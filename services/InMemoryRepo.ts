import { Incident, IncidentResponse, IncidentsRepo } from '../types';
import { GoogleSheetsWebhookService } from './googleSheetsWebhook';

export const DEFAULT_PUBLIC_EMERGENCY_INCIDENT: Incident = {
  id: 'emergency-beacon-channel',
  title: '现场紧急求助与灾情直报通道 (Sparks Beacon)',
  description: '面向现场受灾受困人员及目击者。即使断网也能自动离线排队，恢复网络自动同步，并可生成核验二维码与短报文。',
  createdAt: 1724900000000,
  regions: [
    { name: '西藏/日喀则/定日/樟木/吉隆', districts: ['受灾村落/孤岛', '安置点/临时避难所', '沿线公路/滑坡段', '高海拔营地'] },
    { name: '中尼边境/加德满都/高山区域', districts: ['边境口岸周边', '徒步线路/滑坡段', '高海拔营地', '其他区域'] },
    { name: '其他灾区/通用区域', districts: ['受困核心区', '外围转移区', '临时求助点', '其他'] }
  ]
};

const STORAGE_KEYS = {
  INCIDENTS: 'crisiskit_incidents',
  RESPONSES: 'crisiskit_responses',
};

// Simulate async DB calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class InMemoryRepo implements IncidentsRepo {
  async getIncidents(): Promise<Incident[]> {
    await delay(50);
    const data = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    if (data) {
      try {
        const parsed: Incident[] = JSON.parse(data);
        if (parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed to parse incidents from storage', e);
      }
    }
    return [DEFAULT_PUBLIC_EMERGENCY_INCIDENT];
  }

  async getIncidentById(id: string): Promise<Incident | undefined> {
    if (id === DEFAULT_PUBLIC_EMERGENCY_INCIDENT.id) {
      return DEFAULT_PUBLIC_EMERGENCY_INCIDENT;
    }
    const incidents = await this.getIncidents();
    return incidents.find((i) => i.id === id) || DEFAULT_PUBLIC_EMERGENCY_INCIDENT;
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