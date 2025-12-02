import { Incident, IncidentResponse, IncidentsRepo, UrgencyLevel } from '../types';
// Note: googleapis is a server-side library. Ensure this code only runs in a Node environment.
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export class GoogleSheetsRepo implements IncidentsRepo {
  private sheets: any; // Using any to avoid strict type issues if googleapis isn't fully installed
  private spreadsheetId: string;

  constructor(serviceAccountEmail: string, privateKey: string, spreadsheetId: string) {
    const auth = new google.auth.JWT(
      serviceAccountEmail,
      undefined,
      privateKey.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = spreadsheetId;
  }

  async getIncidents(): Promise<Incident[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Incidents!A2:E', // id, title, location, description, createdAt
      });

      const rows = response.data.values || [];
      return rows.map((row: string[]) => ({
        id: row[0],
        title: row[1],
        description: row[3], // location is row[2], but not in Incident type currently
        createdAt: Number(row[4]),
      }));
    } catch (error) {
      console.error('Error fetching incidents from Sheets:', error);
      return [];
    }
  }

  async getIncidentById(id: string): Promise<Incident | undefined> {
    const incidents = await this.getIncidents();
    return incidents.find(i => i.id === id);
  }

  async createIncident(incident: Omit<Incident, 'id' | 'createdAt'>): Promise<Incident> {
    const newIncident: Incident = {
      ...incident,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    const row = [
      newIncident.id,
      newIncident.title,
      '', // Location placeholder
      newIncident.description,
      newIncident.createdAt.toString(),
      '[]' // formFieldsJson
    ];

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: 'Incidents!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [row] },
    });

    return newIncident;
  }

  async getResponses(incidentId: string): Promise<IncidentResponse[]> {
    try {
      // Fetching all submissions and filtering in memory (simplification for MVP)
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Submissions!A2:E', // id, incidentId, createdAt, urgencyLevel, answersJson
      });

      const rows = response.data.values || [];
      const incidentRows = rows.filter((row: string[]) => row[1] === incidentId);

      return incidentRows.map((row: string[]) => {
        const answers = JSON.parse(row[4] || '{}');
        const urgency = row[3] as UrgencyLevel;
        
        return {
          id: row[0],
          incidentId: row[1],
          submittedAt: Number(row[2]),
          name: answers.name || '',
          contact: answers.contact || '',
          needs: answers.needs || '',
          location: answers.location || '',
          aiClassification: urgency !== 'UNKNOWN' ? {
            urgency: urgency,
            reasoning: answers.aiReasoning || ''
          } : undefined
        };
      }).sort((a: IncidentResponse, b: IncidentResponse) => b.submittedAt - a.submittedAt);
    } catch (error) {
      console.error('Error fetching responses from Sheets:', error);
      return [];
    }
  }

  async submitResponse(response: Omit<IncidentResponse, 'id' | 'submittedAt'>): Promise<IncidentResponse> {
    const newResponse: IncidentResponse = {
      ...response,
      id: crypto.randomUUID(),
      submittedAt: Date.now(),
    };

    const answersJson = JSON.stringify({
      name: newResponse.name,
      contact: newResponse.contact,
      needs: newResponse.needs,
      location: newResponse.location,
      aiReasoning: newResponse.aiClassification?.reasoning
    });

    const row = [
      newResponse.id,
      newResponse.incidentId,
      newResponse.submittedAt.toString(),
      newResponse.aiClassification?.urgency || 'UNKNOWN',
      answersJson
    ];

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: 'Submissions!A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [row] },
    });

    return newResponse;
  }

  async updateResponse(updatedResponse: IncidentResponse): Promise<void> {
    // 1. Fetch all to find the row index (inefficient but simple for MVP without DB ID mapping)
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Submissions!A:A', // Only fetch IDs
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row: string[]) => row[0] === updatedResponse.id);

    if (rowIndex === -1) {
      throw new Error(`Response with ID ${updatedResponse.id} not found in Sheets`);
    }

    // Row index is 0-based, Sheets is 1-based. A1 is header.
    // So if findIndex is 1 (second item in array), it's row 2 in 0-indexed array, which is Row 2 in Sheet?
    // Wait, range A:A includes header. Index 0 is header.
    // Index 1 is first data row (Row 2).
    const sheetRowNumber = rowIndex + 1;

    const answersJson = JSON.stringify({
      name: updatedResponse.name,
      contact: updatedResponse.contact,
      needs: updatedResponse.needs,
      location: updatedResponse.location,
      aiReasoning: updatedResponse.aiClassification?.reasoning
    });

    const rowData = [
      updatedResponse.id,
      updatedResponse.incidentId,
      updatedResponse.submittedAt.toString(),
      updatedResponse.aiClassification?.urgency || 'UNKNOWN',
      answersJson
    ];

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `Submissions!A${sheetRowNumber}:E${sheetRowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [rowData] },
    });
  }
}