import { Incident, IncidentResponse, IncidentsRepo } from '../types';

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
    return newResponse;
  }

  async updateResponse(updatedResponse: IncidentResponse): Promise<void> {
    const data = localStorage.getItem(STORAGE_KEYS.RESPONSES);
    let allResponses: IncidentResponse[] = data ? JSON.parse(data) : [];
    allResponses = allResponses.map(r => r.id === updatedResponse.id ? updatedResponse : r);
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(allResponses));
  }
}