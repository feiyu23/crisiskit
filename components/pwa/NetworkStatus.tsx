import React from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

/**
 * Network Status Indicator Component
 * Displays online/offline status and pending queue count
 */
export const NetworkStatus: React.FC = () => {
  const { isOnline, pendingCount, isSyncing, lastSyncResult, syncNow } = useNetworkStatus();

  // Don't show anything if online and no pending items
  if (isOnline && pendingCount === 0 && !lastSyncResult) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {/* Offline Badge */}
      {!isOnline && (
        <div className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 mb-2">
          <WifiOff className="w-5 h-5" />
          <div className="flex-1">
            <div className="font-semibold">Offline Mode</div>
            {pendingCount > 0 && (
              <div className="text-sm opacity-90">
                {pendingCount} {pendingCount === 1 ? 'submission' : 'submissions'} queued
              </div>
            )}
          </div>
        </div>
      )}

      {/* Syncing Badge */}
      {isOnline && isSyncing && (
        <div className="bg-yellow-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 mb-2 animate-pulse">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <div className="flex-1">
            <div className="font-semibold">Syncing...</div>
            <div className="text-sm opacity-90">Uploading queued submissions</div>
          </div>
        </div>
      )}

      {/* Online with Pending Items */}
      {isOnline && !isSyncing && pendingCount > 0 && (
        <div className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 mb-2">
          <Wifi className="w-5 h-5" />
          <div className="flex-1">
            <div className="font-semibold">Online</div>
            <div className="text-sm opacity-90">
              {pendingCount} {pendingCount === 1 ? 'item' : 'items'} pending
            </div>
          </div>
          <button
            onClick={syncNow}
            className="bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-50 transition-colors"
          >
            Sync Now
          </button>
        </div>
      )}

      {/* Sync Result Toast */}
      {lastSyncResult && lastSyncResult.total > 0 && (
        <div
          className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
            lastSyncResult.failed === 0
              ? 'bg-green-600 text-white'
              : 'bg-orange-600 text-white'
          }`}
        >
          {lastSyncResult.failed === 0 ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
          <div className="flex-1">
            <div className="font-semibold">
              {lastSyncResult.failed === 0 ? 'Sync Complete' : 'Partial Sync'}
            </div>
            <div className="text-sm opacity-90">
              {lastSyncResult.success} synced
              {lastSyncResult.failed > 0 && `, ${lastSyncResult.failed} failed`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkStatus;
