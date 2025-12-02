export type UrgencyLevel = 'CRITICAL' | 'MODERATE' | 'LOW' | 'UNKNOWN';
export type ResponseStatus = 'pending' | 'in_progress' | 'resolved' | 'duplicate';

export interface Region {
  name: string;
  districts: string[];
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  regions?: Region[]; // Optional: Configured regions for location selection
}

export interface IncidentResponse {
  id: string;
  incidentId: string;
  name: string;
  contact: string;
  needs: string;
  location: string;
  region?: string; // Selected region (e.g., "Hong Kong", "Kowloon")
  district?: string; // Selected district (e.g., "Sha Tin", "Mong Kok")
  images?: string[]; // Base64 encoded images (max 5)
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
