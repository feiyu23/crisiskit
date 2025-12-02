import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storageService } from '../services/storage';
import { geminiService } from '../services/gemini';
import { Incident, IncidentResponse } from '../types';
import { Button } from '../components/Button';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { exportToCSV } from '../utils/csvExport';
import { ArrowLeft, Share2, RefreshCw, AlertCircle, FileText, ExternalLink, Download } from 'lucide-react';

export const IncidentDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [responses, setResponses] = useState<IncidentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    const [incData, resData] = await Promise.all([
      storageService.getIncidentById(id),
      storageService.getResponses(id)
    ]);
    setIncident(incData || null);
    setResponses(resData);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const runAIAnalysis = async () => {
    if (responses.length === 0) return;
    setIsAnalyzing(true);
    
    // Process only unclassified responses to save tokens/time
    const unclassified = responses.filter(r => !r.aiClassification);
    
    for (const res of unclassified) {
      const classification = await geminiService.classifyUrgency(res.needs, res.location);
      const updated = { ...res, aiClassification: classification };
      await storageService.updateResponse(updated);
      
      // Update local state progressively
      setResponses(prev => prev.map(p => p.id === updated.id ? updated : p));
    }
    
    setIsAnalyzing(false);
  };

  const copyPublicLink = () => {
    const url = `${window.location.origin}/#/submit/${id}`;
    navigator.clipboard.writeText(url);
    alert('Public link copied to clipboard!');
  };

  const handleExportCSV = () => {
    if (!incident || responses.length === 0) return;
    exportToCSV(responses, incident.title);
  };

  // Helper to render location with potential links
  const renderLocation = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary-600 hover:text-primary-800 hover:underline inline-flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            Maps Link <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading incident data...</div>;
  if (!incident) return <div className="p-12 text-center text-danger-500">Incident not found.</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Incidents
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{incident.title}</h1>
          <p className="text-gray-500 mt-1">
            {responses.length} responses collected • Created {new Date(incident.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={runAIAnalysis} variant="secondary" disabled={isAnalyzing || responses.length === 0}>
             <RefreshCw className={`mr-2 h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
             {isAnalyzing ? 'Analyzing...' : 'Run AI Triage'}
          </Button>
          <Button onClick={handleExportCSV} variant="secondary" disabled={responses.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={copyPublicLink}>
            <Share2 className="mr-2 h-4 w-4" />
            Copy Public Link
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        {responses.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No responses yet</h3>
            <p className="text-gray-500 mt-1 mb-6">Share the public link to start collecting needs.</p>
            <Button onClick={copyPublicLink} variant="secondary">Copy Link</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency (AI)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name / Contact</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Needs & Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {responses.map((response) => (
                  <tr key={response.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {response.aiClassification ? (
                        <div className="flex flex-col gap-1">
                          <UrgencyBadge level={response.aiClassification.urgency} />
                          <span className="text-xs text-gray-500 max-w-[150px] truncate" title={response.aiClassification.reasoning}>
                            {response.aiClassification.reasoning}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{response.name}</div>
                      <div className="text-sm text-gray-500">{response.contact}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">{response.needs}</div>
                      <div className="text-xs text-gray-500 mt-1 break-words">
                        {renderLocation(response.location)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(response.submittedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};