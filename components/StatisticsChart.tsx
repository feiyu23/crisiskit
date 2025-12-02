import React from 'react';
import { IncidentResponse } from '../types';

interface StatisticsChartProps {
  responses: IncidentResponse[];
}

export const StatisticsChart: React.FC<StatisticsChartProps> = ({ responses }) => {
  // Calculate urgency statistics
  const urgencyStats = {
    CRITICAL: responses.filter(r => r.aiClassification?.urgency === 'CRITICAL').length,
    MODERATE: responses.filter(r => r.aiClassification?.urgency === 'MODERATE').length,
    LOW: responses.filter(r => r.aiClassification?.urgency === 'LOW').length,
    UNKNOWN: responses.filter(r => !r.aiClassification || r.aiClassification.urgency === 'UNKNOWN').length
  };

  // Calculate status statistics
  const statusStats = {
    pending: responses.filter(r => !r.status || r.status === 'pending').length,
    in_progress: responses.filter(r => r.status === 'in_progress').length,
    resolved: responses.filter(r => r.status === 'resolved').length
  };

  // Calculate region statistics
  const regionStats: Record<string, number> = {};
  responses.forEach(r => {
    if (r.region) {
      regionStats[r.region] = (regionStats[r.region] || 0) + 1;
    }
  });

  // Calculate district statistics (top 5)
  const districtStats: Record<string, number> = {};
  responses.forEach(r => {
    if (r.district) {
      const key = `${r.region} - ${r.district}`;
      districtStats[key] = (districtStats[key] || 0) + 1;
    }
  });
  const topDistricts = Object.entries(districtStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Calculate time-based statistics (last 24 hours, by 6-hour blocks)
  const now = Date.now();
  const last24h = now - 24 * 60 * 60 * 1000;
  const timeBlocks = [
    { label: '0-6h ago', count: 0 },
    { label: '6-12h ago', count: 0 },
    { label: '12-18h ago', count: 0 },
    { label: '18-24h ago', count: 0 }
  ];

  responses.forEach(r => {
    const age = now - r.submittedAt;
    if (age < last24h) return;

    const hoursAgo = age / (60 * 60 * 1000);
    if (hoursAgo < 6) timeBlocks[0].count++;
    else if (hoursAgo < 12) timeBlocks[1].count++;
    else if (hoursAgo < 18) timeBlocks[2].count++;
    else if (hoursAgo < 24) timeBlocks[3].count++;
  });

  const maxTimeCount = Math.max(...timeBlocks.map(b => b.count), 1);

  const total = responses.length;

  if (total === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">No data available for statistics yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-500 mt-1">Total Submissions</div>
        </div>
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-red-600">{urgencyStats.CRITICAL}</div>
          <div className="text-sm text-red-700 mt-1 font-medium">Critical</div>
        </div>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-yellow-600">{urgencyStats.MODERATE}</div>
          <div className="text-sm text-yellow-700 mt-1 font-medium">Moderate</div>
        </div>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{statusStats.resolved}</div>
          <div className="text-sm text-green-700 mt-1 font-medium">Resolved</div>
        </div>
      </div>

      {/* Urgency Distribution */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Urgency Distribution</h3>
        <div className="space-y-3">
          {[
            { label: 'Critical', count: urgencyStats.CRITICAL, color: 'bg-red-500' },
            { label: 'Moderate', count: urgencyStats.MODERATE, color: 'bg-yellow-500' },
            { label: 'Low', count: urgencyStats.LOW, color: 'bg-green-500' },
            { label: 'Pending AI', count: urgencyStats.UNKNOWN, color: 'bg-gray-400' }
          ].map(item => (
            <div key={item.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className="text-sm text-gray-600">
                  {item.count} ({total > 0 ? Math.round((item.count / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${item.color} h-3 rounded-full transition-all`}
                  style={{ width: `${total > 0 ? (item.count / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Status</h3>
        <div className="space-y-3">
          {[
            { label: 'Pending', count: statusStats.pending, color: 'bg-gray-500' },
            { label: 'In Progress', count: statusStats.in_progress, color: 'bg-blue-500' },
            { label: 'Resolved', count: statusStats.resolved, color: 'bg-green-500' }
          ].map(item => (
            <div key={item.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className="text-sm text-gray-600">
                  {item.count} ({total > 0 ? Math.round((item.count / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${item.color} h-3 rounded-full transition-all`}
                  style={{ width: `${total > 0 ? (item.count / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Region Statistics */}
      {Object.keys(regionStats).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submissions by Region</h3>
          <div className="space-y-3">
            {Object.entries(regionStats)
              .sort((a, b) => b[1] - a[1])
              .map(([region, count]) => (
                <div key={region}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">📍 {region}</span>
                    <span className="text-sm text-gray-600">
                      {count} ({total > 0 ? Math.round((count / total) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary-500 h-3 rounded-full transition-all"
                      style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Top Districts */}
      {topDistricts.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Affected Districts</h3>
          <div className="space-y-2">
            {topDistricts.map(([district, count], index) => (
              <div key={district} className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{district}</span>
                    <span className="text-sm text-gray-600">{count} people</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time-based Trends (Last 24h) */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Timeline (Last 24h)</h3>
        <div className="flex items-end justify-between gap-4 h-48">
          {timeBlocks.map(block => (
            <div key={block.label} className="flex-1 flex flex-col items-center justify-end gap-2">
              <div
                className="w-full bg-primary-500 rounded-t-lg transition-all hover:bg-primary-600 relative group"
                style={{ height: `${(block.count / maxTimeCount) * 100}%`, minHeight: block.count > 0 ? '20px' : '0' }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {block.count} submissions
                </div>
              </div>
              <div className="text-xs text-gray-600 text-center">{block.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
