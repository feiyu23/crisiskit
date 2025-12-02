import { Incident, IncidentResponse } from '../types';

/**
 * Export all data (incidents + responses) to a single JSON file
 */
export function exportAllDataJSON(incidents: Incident[], responses: IncidentResponse[]) {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    incidents,
    responses
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `crisiskit-backup-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Import data from JSON file
 */
export async function importDataJSON(file: File): Promise<{
  incidents: Incident[];
  responses: IncidentResponse[];
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (!data.incidents || !data.responses) {
          throw new Error('Invalid backup file format');
        }

        resolve({
          incidents: data.incidents,
          responses: data.responses
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Export responses for a specific incident to CSV
 */
export function exportIncidentResponsesCSV(
  incident: Incident,
  responses: IncidentResponse[]
) {
  const headers = [
    'Timestamp',
    'Status',
    'Name',
    'Contact',
    'Location',
    'Needs',
    'AI Urgency',
    'AI Reasoning',
    'Assigned To',
    'Notes',
    'Resolved At'
  ];

  const rows = responses.map(r => [
    new Date(r.submittedAt).toLocaleString(),
    r.status || 'pending',
    r.name,
    r.contact,
    r.location,
    r.needs,
    r.aiClassification?.urgency || 'N/A',
    r.aiClassification?.reasoning || 'N/A',
    r.assignedTo || '',
    r.notes || '',
    r.resolvedAt ? new Date(r.resolvedAt).toLocaleString() : ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${incident.title.replace(/[^a-z0-9]/gi, '-')}-responses-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
