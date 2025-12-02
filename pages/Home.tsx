import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storage';
import { Incident, IncidentResponse } from '../types';
import { Button } from '../components/Button';
import { AlertTriangle, Plus, ArrowRight, BookOpen, Download, Upload } from 'lucide-react';
import { exportAllDataJSON, importDataJSON } from '../utils/dataPortability';

export const Home: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    const data = await storageService.getIncidents();
    setIncidents(data);
    setLoading(false);
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      // Get all incidents
      const incidents = await storageService.getIncidents();

      // Get all responses for all incidents
      const responsesPromises = incidents.map(inc => storageService.getResponses(inc.id));
      const responsesArrays = await Promise.all(responsesPromises);
      const allResponses = responsesArrays.flat();

      exportAllDataJSON(incidents, allResponses);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const { incidents: importedIncidents, responses: importedResponses } = await importDataJSON(file);

      // Confirm before overwriting
      const confirmMsg = `This will import ${importedIncidents.length} incidents and ${importedResponses.length} responses. This will MERGE with existing data. Continue?`;
      if (!confirm(confirmMsg)) {
        setIsImporting(false);
        return;
      }

      // Import incidents
      const existingIncidents = await storageService.getIncidents();
      const existingIds = new Set(existingIncidents.map(i => i.id));

      for (const incident of importedIncidents) {
        if (!existingIds.has(incident.id)) {
          // Create new incident by directly setting localStorage
          localStorage.setItem(
            'crisiskit_incidents',
            JSON.stringify([...existingIncidents, incident])
          );
          existingIncidents.push(incident);
        }
      }

      // Import responses
      const allExistingResponses: IncidentResponse[] = [];
      for (const incident of existingIncidents) {
        const responses = await storageService.getResponses(incident.id);
        allExistingResponses.push(...responses);
      }

      const existingResponseIds = new Set(allExistingResponses.map(r => r.id));
      const newResponses = importedResponses.filter(r => !existingResponseIds.has(r.id));

      if (newResponses.length > 0) {
        localStorage.setItem(
          'crisiskit_responses',
          JSON.stringify([...allExistingResponses, ...newResponses])
        );
      }

      alert(`Successfully imported ${importedIncidents.length} incidents and ${newResponses.length} new responses!`);
      loadIncidents(); // Reload
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import data. Please check the file format.');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="mx-auto h-12 w-12 text-primary-600 flex items-center justify-center rounded-full bg-primary-100 mb-4">
          <AlertTriangle size={24} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
          CrisisKit Lite
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          10-second crisis data collection with AI triage.<br />
          Share a link. Collect needs. Export to Google Sheets.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Active Incidents</h2>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleExportAll} variant="secondary" disabled={isExporting || incidents.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export Backup'}
          </Button>
          <Button onClick={handleImportClick} variant="secondary" disabled={isImporting}>
            <Upload className="mr-2 h-4 w-4" />
            {isImporting ? 'Importing...' : 'Import Backup'}
          </Button>
          <Link to="/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Incident
            </Button>
          </Link>
        </div>
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
      />

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : incidents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300 mb-12">
          <p className="text-gray-500 mb-4">No active incidents found.</p>
          <Link to="/create">
            <Button variant="secondary">Create your first form</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4 mb-16">
          {incidents.map((incident) => (
            <Link 
              key={incident.id} 
              to={`/incident/${incident.id}`}
              className="block group"
            >
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {incident.title}
                    </h3>
                    <p className="text-gray-500 mt-1 line-clamp-2">{incident.description}</p>
                    <p className="text-xs text-gray-400 mt-3">
                      Created {new Date(incident.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ArrowRight className="text-gray-300 group-hover:text-primary-500 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* About / README Section */}
      <div className="border-t border-gray-200 pt-12">
        <div className="prose prose-blue max-w-none text-gray-600">
          <div className="flex justify-between items-baseline mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              About CrisisKit Lite <span className="ml-2 text-xl">🚨</span>
            </h2>
            <Link to="/design" className="text-sm font-medium text-primary-600 hover:text-primary-800 flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              Read Design Philosophy
            </Link>
          </div>
          
          <p className="text-lg leading-relaxed mb-6">
            <strong>CrisisKit is the bridge between affected people and volunteer teams:</strong>
          </p>

          <div className="bg-gray-50 border-2 border-gray-200 p-6 rounded-lg mb-8 text-center font-mono text-sm">
            <p className="text-gray-700">
              Affected People → <strong className="text-primary-600">CrisisKit Form</strong> → <strong className="text-primary-600">AI Triage</strong> → Google Sheets → Volunteers
            </p>
          </div>

          <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg mb-8">
            <p className="font-semibold text-gray-900 mb-2">Why Not Just Use Google Forms + Sheets?</p>
            <p className="text-gray-700 mb-3">
              <strong>Google Forms</strong> take 15+ minutes to set up, have poor mobile UX, no AI triage, and no duplicate detection.
            </p>
            <p className="text-gray-700">
              <strong>CrisisKit</strong> takes 10 seconds to create, is mobile-optimized with SOS location button,
              auto-classifies urgency with AI, detects duplicates, and exports directly to Google Sheets with one click.
            </p>
          </div>

          <p className="mb-4">
            <strong>What CrisisKit Does:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-8">
             <li><strong>10-Second Form Creation</strong> - No account, no setup, just create and share</li>
             <li><strong>Mobile-First Design</strong> - Large buttons, SOS location button, works on any phone</li>
             <li><strong>AI-Powered Triage</strong> - Gemini AI classifies Critical/Moderate/Low urgency automatically</li>
             <li><strong>Visual Statistics</strong> - See urgency distribution, region heatmaps, and timeline trends at a glance</li>
             <li><strong>Smart Duplicate Detection</strong> - Prevents spam, tracks updates from same contact</li>
             <li><strong>Auto-Sync to Google Sheets</strong> - Real-time webhook sync or one-click export for volunteer collaboration</li>
             <li><strong>Region/District Selection</strong> - Pre-configured dropdowns for fast location tracking</li>
          </ul>

          <div className="text-center mt-8">
            <Link to="/design">
                <Button variant="secondary" className="w-full sm:w-auto">
                    Why we built this: The Story of Taipo Fire &rarr;
                </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};