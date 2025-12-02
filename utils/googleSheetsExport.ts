import { Incident, IncidentResponse } from '../types';

/**
 * Export responses and open directly in Google Sheets
 * Uses Google Sheets Import Data feature
 */
export function openInGoogleSheets(incident: Incident, responses: IncidentResponse[]) {
  // Generate CSV content
  const headers = [
    'Timestamp',
    'Status',
    'Name',
    'Contact',
    'Region',
    'District',
    'Detailed Location',
    'Needs',
    'AI Urgency',
    'AI Reasoning',
    'Assigned To',
    'Notes'
  ];

  const rows = responses.map(r => [
    new Date(r.submittedAt).toLocaleString(),
    r.status || 'pending',
    r.name,
    r.contact,
    r.region || '',
    r.district || '',
    r.location,
    r.needs,
    r.aiClassification?.urgency || '',
    r.aiClassification?.reasoning || '',
    r.assignedTo || '',
    r.notes || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  // Create a data URL with CSV content
  const dataUrl = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);

  // Generate Google Sheets URL that will import the CSV
  // Note: This opens the import dialog, user needs to click "Import"
  const sheetsUrl = `https://docs.google.com/spreadsheets/create`;

  // Alternative: Create a shareable link with instructions
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  // Open Google Sheets in new tab
  const newWindow = window.open(sheetsUrl, '_blank');

  // Show instructions modal
  return {
    csvUrl: url,
    csvContent,
    instructions: `
1. A new Google Sheet has been opened
2. Click "File" → "Import" → "Upload"
3. Or copy this data and paste into the sheet
    `.trim()
  };
}

/**
 * Generate a shareable TSV (Tab-Separated Values) that can be pasted directly into Google Sheets
 */
export function copyToClipboardForSheets(incident: Incident, responses: IncidentResponse[]): string {
  const headers = [
    'Timestamp',
    'Status',
    'Name',
    'Contact',
    'Region',
    'District',
    'Location',
    'Needs',
    'Urgency',
    'AI Reasoning',
    'Assigned To',
    'Notes'
  ];

  const rows = responses.map(r => [
    new Date(r.submittedAt).toLocaleString(),
    r.status || 'pending',
    r.name,
    r.contact,
    r.region || '',
    r.district || '',
    r.location,
    r.needs,
    r.aiClassification?.urgency || '',
    r.aiClassification?.reasoning || '',
    r.assignedTo || '',
    r.notes || ''
  ]);

  // Use TAB separator for easy paste into Google Sheets
  const tsvContent = [
    headers.join('\t'),
    ...rows.map(row => row.join('\t'))
  ].join('\n');

  return tsvContent;
}

/**
 * Generate a Google Sheets importable URL
 * Creates a CSV file and provides copy-paste instructions
 */
export async function exportToGoogleSheets(
  incident: Incident,
  responses: IncidentResponse[]
): Promise<{success: boolean; message: string}> {
  try {
    // Generate TSV content (better for Google Sheets)
    const tsvContent = copyToClipboardForSheets(incident, responses);

    // Copy to clipboard
    await navigator.clipboard.writeText(tsvContent);

    // Open Google Sheets
    window.open('https://docs.google.com/spreadsheets/create', '_blank');

    return {
      success: true,
      message: `
✅ Data copied to clipboard!

Next steps:
1. A new Google Sheet has opened
2. Click on cell A1
3. Press Cmd+V (Mac) or Ctrl+V (Windows) to paste
4. Done! Your data is now in Google Sheets
      `.trim()
    };
  } catch (error) {
    console.error('Failed to export to Google Sheets:', error);
    return {
      success: false,
      message: 'Failed to copy data. Please try exporting as CSV instead.'
    };
  }
}
