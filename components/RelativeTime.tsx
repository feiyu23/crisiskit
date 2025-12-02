import React from 'react';

interface RelativeTimeProps {
  timestamp: number;
}

export const RelativeTime: React.FC<RelativeTimeProps> = ({ timestamp }) => {
  const getRelativeTime = (ts: number) => {
    const now = Date.now();
    const diffMs = now - ts;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getColorClass = (ts: number) => {
    const diffMs = Date.now() - ts;
    const diffHours = diffMs / 3600000;

    // CRITICAL: 5+ hours old = RED (flashing)
    if (diffHours >= 5) {
      return 'text-red-600 font-bold animate-pulse';
    }
    // WARNING: 2-5 hours old = ORANGE
    if (diffHours >= 2) {
      return 'text-orange-600 font-semibold';
    }
    // RECENT: 1-2 hours old = YELLOW
    if (diffHours >= 1) {
      return 'text-yellow-600';
    }
    // FRESH: < 1 hour old = GREEN
    return 'text-green-600';
  };

  const relativeTime = getRelativeTime(timestamp);
  const colorClass = getColorClass(timestamp);

  return (
    <div className="flex flex-col">
      <span className={`text-sm ${colorClass}`}>
        {relativeTime}
      </span>
      <span className="text-xs text-gray-400">
        {new Date(timestamp).toLocaleString()}
      </span>
    </div>
  );
};
