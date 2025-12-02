import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storageService } from '../services/storage';
import { geminiService } from '../services/gemini';
import { Incident, IncidentResponse } from '../types';
import { Button } from '../components/Button';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { StatusBadge } from '../components/StatusBadge';
import { RelativeTime } from '../components/RelativeTime';
import { exportToCSV } from '../utils/csvExport';
import { exportToGoogleSheets } from '../utils/googleSheetsExport';
import { ResponseStatus } from '../types';
import { ArrowLeft, Share2, RefreshCw, AlertCircle, FileText, ExternalLink, Download, Sheet, Settings, BarChart3 } from 'lucide-react';
import { GoogleSheetsSetup } from '../components/GoogleSheetsSetup';
import { StatisticsChart } from '../components/StatisticsChart';

export const IncidentDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [responses, setResponses] = useState<IncidentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [regionFilter, setRegionFilter] = useState<string>('');
  const [districtFilter, setDistrictFilter] = useState<string>('');
  const [showSheetsSetup, setShowSheetsSetup] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    const [incData, resData] = await Promise.all([
      storageService.getIncidentById(id),
      storageService.getResponses(id)
    ]);
    setIncident(incData || null);

    // Sort responses: CRITICAL first, then MODERATE, then LOW, then UNKNOWN
    const sortedResponses = resData.sort((a, b) => {
      const urgencyOrder = { CRITICAL: 0, MODERATE: 1, LOW: 2, UNKNOWN: 3 };
      const aUrgency = a.aiClassification?.urgency || 'UNKNOWN';
      const bUrgency = b.aiClassification?.urgency || 'UNKNOWN';

      // First sort by urgency
      const urgencyDiff = urgencyOrder[aUrgency] - urgencyOrder[bUrgency];
      if (urgencyDiff !== 0) return urgencyDiff;

      // Then by submission time (newest first)
      return b.submittedAt - a.submittedAt;
    });

    setResponses(sortedResponses);
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

  const handleExportToSheets = async () => {
    if (!incident || responses.length === 0) return;
    const result = await exportToGoogleSheets(incident, responses);
    alert(result.message);
  };

  const updateResponseStatus = async (responseId: string, newStatus: ResponseStatus) => {
    const response = responses.find(r => r.id === responseId);
    if (!response) return;

    const updated = {
      ...response,
      status: newStatus,
      resolvedAt: newStatus === 'resolved' ? Date.now() : response.resolvedAt
    };

    await storageService.updateResponse(updated);
    setResponses(prev => prev.map(r => r.id === responseId ? updated : r));
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

  // Get unique regions and districts for filtering
  const uniqueRegions = [...new Set(responses.map(r => r.region).filter(Boolean))];
  const filteredByRegion = regionFilter
    ? responses.filter(r => r.region === regionFilter)
    : responses;
  const uniqueDistricts = [...new Set(filteredByRegion.map(r => r.district).filter(Boolean))];

  // Apply filters
  const filteredResponses = responses.filter(r => {
    if (regionFilter && r.region !== regionFilter) return false;
    if (districtFilter && r.district !== districtFilter) return false;
    return true;
  });

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
          <Button
            onClick={() => setShowStatistics(!showStatistics)}
            variant={showStatistics ? "primary" : "secondary"}
            disabled={responses.length === 0}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            {showStatistics ? 'Hide Stats' : 'Show Stats'}
          </Button>
          <Button onClick={runAIAnalysis} variant="secondary" disabled={isAnalyzing || responses.length === 0}>
             <RefreshCw className={`mr-2 h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
             {isAnalyzing ? 'Analyzing...' : 'Run AI Triage'}
          </Button>
          <Button onClick={() => setShowSheetsSetup(true)} variant="secondary">
            <Settings className="mr-2 h-4 w-4" />
            Auto-Sync Setup
          </Button>
          <Button onClick={handleExportToSheets} variant="secondary" disabled={responses.length === 0}>
            <Sheet className="mr-2 h-4 w-4" />
            Open in Sheets
          </Button>
          <Button onClick={handleExportCSV} variant="secondary" disabled={responses.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
          <Button onClick={copyPublicLink}>
            <Share2 className="mr-2 h-4 w-4" />
            Copy Public Link
          </Button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      {showStatistics && responses.length > 0 && (
        <div className="mb-6">
          <StatisticsChart responses={responses} />
        </div>
      )}

      {/* Region/District Filters */}
      {uniqueRegions.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
          <select
            value={regionFilter}
            onChange={(e) => {
              setRegionFilter(e.target.value);
              setDistrictFilter('');
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Regions ({responses.length})</option>
            {uniqueRegions.map(region => (
              <option key={region} value={region}>
                {region} ({responses.filter(r => r.region === region).length})
              </option>
            ))}
          </select>

          {regionFilter && uniqueDistricts.length > 0 && (
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Districts ({filteredByRegion.length})</option>
              {uniqueDistricts.map(district => (
                <option key={district} value={district}>
                  {district} ({filteredByRegion.filter(r => r.district === district).length})
                </option>
              ))}
            </select>
          )}

          {(regionFilter || districtFilter) && (
            <button
              onClick={() => {
                setRegionFilter('');
                setDistrictFilter('');
              }}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        {filteredResponses.length === 0 ? (
          responses.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No responses yet</h3>
              <p className="text-gray-500 mt-1 mb-6">Share the public link to start collecting needs.</p>
              <Button onClick={copyPublicLink} variant="secondary">Copy Link</Button>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-500">No responses match the selected filters.</p>
              <button
                onClick={() => {
                  setRegionFilter('');
                  setDistrictFilter('');
                }}
                className="mt-4 text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                Clear filters
              </button>
            </div>
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name / Contact</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Needs & Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResponses.map((response) => {
                  const urgency = response.aiClassification?.urgency || 'UNKNOWN';
                  const rowClass = urgency === 'CRITICAL'
                    ? 'bg-red-50 hover:bg-red-100 border-l-4 border-red-500'
                    : urgency === 'MODERATE'
                    ? 'bg-yellow-50 hover:bg-yellow-100 border-l-4 border-yellow-500'
                    : 'hover:bg-gray-50';

                  return (
                  <tr key={response.id} className={rowClass}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={response.status || 'pending'} />
                    </td>
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
                      <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                        {response.region && (
                          <div className="font-medium text-gray-700">
                            📍 {response.region}{response.district && ` • ${response.district}`}
                          </div>
                        )}
                        <div className="break-words">
                          {renderLocation(response.location)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RelativeTime timestamp={response.submittedAt} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {response.status !== 'in_progress' && response.status !== 'resolved' && (
                          <button
                            onClick={() => updateResponseStatus(response.id, 'in_progress')}
                            className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                          >
                            Start
                          </button>
                        )}
                        {response.status !== 'resolved' && (
                          <button
                            onClick={() => updateResponseStatus(response.id, 'resolved')}
                            className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Google Sheets Setup Modal */}
      {showSheetsSetup && id && (
        <GoogleSheetsSetup incidentId={id} onClose={() => setShowSheetsSetup(false)} />
      )}
    </div>
  );
};