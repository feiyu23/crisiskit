import { Incident, IncidentResponse, IncidentsRepo } from '../types';
import { GoogleSheetsWebhookService } from './googleSheetsWebhook';

const STORAGE_KEYS = {
  INCIDENTS: 'crisiskit_incidents',
  RESPONSES: 'crisiskit_responses',
};

// Simulate async DB calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class InMemoryRepo implements IncidentsRepo {
  async getIncidents(): Promise<Incident[]> {
    await delay(100);
    const data = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    return data ? JSON.parse(data) : [];
  }

  async getIncidentById(id: string): Promise<Incident | undefined> {
    const incidents = await this.getIncidents();
    return incidents.find((i) => i.id === id);
  }

  async createIncident(incident: Omit<Incident, 'id' | 'createdAt'>): Promise<Incident> {
    const incidents = await this.getIncidents();
    const newIncident: Incident = {
      ...incident,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify([newIncident, ...incidents]));
    return newIncident;
  }

  async saveIncident(incident: Incident): Promise<void> {
    const incidents = await this.getIncidents();
    const index = incidents.findIndex((i) => i.id === incident.id);
    if (index >= 0) {
      incidents[index] = incident;
    } else {
      incidents.unshift(incident);
    }
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
  }

  async getResponses(incidentId: string): Promise<IncidentResponse[]> {
    await delay(100);
    const data = localStorage.getItem(STORAGE_KEYS.RESPONSES);
    const allResponses: IncidentResponse[] = data ? JSON.parse(data) : [];
    return allResponses
      .filter((r) => r.incidentId === incidentId)
      .sort((a, b) => b.submittedAt - a.submittedAt);
  }

  async submitResponse(response: Omit<IncidentResponse, 'id' | 'submittedAt'>): Promise<IncidentResponse> {
    const data = localStorage.getItem(STORAGE_KEYS.RESPONSES);
    const allResponses: IncidentResponse[] = data ? JSON.parse(data) : [];

    const newResponse: IncidentResponse = {
      ...response,
      id: crypto.randomUUID(),
      submittedAt: Date.now(),
    };

    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify([newResponse, ...allResponses]));

    // Auto-sync to Google Sheets webhook if configured
    GoogleSheetsWebhookService.sendToWebhook(response.incidentId, newResponse)
      .catch(err => console.warn('Webhook sync failed (non-critical):', err));

    return newResponse;
  }

  async updateResponse(updatedResponse: IncidentResponse): Promise<void> {
    const data = localStorage.getItem(STORAGE_KEYS.RESPONSES);
    let allResponses: IncidentResponse[] = data ? JSON.parse(data) : [];
    allResponses = allResponses.map(r => r.id === updatedResponse.id ? updatedResponse : r);
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(allResponses));
  }
}