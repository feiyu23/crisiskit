export type UrgencyLevel = 'CRITICAL' | 'MODERATE' | 'LOW' | 'UNKNOWN';
export type ResponseStatus = 'pending' | 'in_progress' | 'resolved' | 'duplicate';

export interface Incident {
  id: string;
  title: string;
  description: string;
  createdAt: number;
}

export interface IncidentResponse {
  id: string;
  incidentId: string;
  name: string;
  contact: string;
  needs: string;
  location: string;
  submittedAt: number;
  status?: ResponseStatus;
  assignedTo?: string;
  notes?: string;
  resolvedAt?: number;
  aiClassification?: {
    urgency: UrgencyLevel;
    reasoning: string;
  };
}

export interface IncidentsRepo {
  getIncidents(): Promise<Incident[]>;
  getIncidentById(id: string): Promise<Incident | undefined>;
  createIncident(incident: Omit<Incident, 'id' | 'createdAt'>): Promise<Incident>;
  getResponses(incidentId: string): Promise<IncidentResponse[]>;
  submitResponse(response: Omit<IncidentResponse, 'id' | 'submittedAt'>): Promise<IncidentResponse>;
  updateResponse(response: IncidentResponse): Promise<void>;
}
