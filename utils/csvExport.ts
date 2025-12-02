import { IncidentResponse } from '../types';

export function exportToCSV(responses: IncidentResponse[], incidentTitle: string) {
  // CSV headers
  const headers = [
    'Timestamp',
    'Name',
    'Contact',
    'Needs',
    'Location',
    'AI Urgency',
    'AI Reasoning'
  ];

  // Convert responses to CSV rows
  const rows = responses.map(response => {
    const timestamp = new Date(response.submittedAt).toLocaleString();
    const urgency = response.aiClassification?.urgency || 'Not classified';
    const reasoning = response.aiClassification?.reasoning || '';

    return [
      timestamp,
      response.name,
      response.contact,
      response.needs,
      response.location,
      urgency,
      reasoning
    ].map(field => {
      // Escape quotes and wrap in quotes if contains comma, newline, or quote
      const escaped = String(field).replace(/"/g, '""');
      return /[,\n"]/.test(escaped) ? `"${escaped}"` : escaped;
    });
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${incidentTitle.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
