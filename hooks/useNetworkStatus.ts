import { useState, useEffect, useCallback } from 'react';
import { offlineQueue } from '../services/offlineQueue';
import { storageService } from '../services/storage';

export interface NetworkStatus {
  isOnline: boolean;
  pendingCount: number;
  isSyncing: boolean;
  lastSyncResult?: {
    success: number;
    failed: number;
    total: number;
  };
}

/**
 * Hook to monitor network status and manage offline queue
 */
export function useNetworkStatus(): NetworkStatus & {
  syncNow: () => Promise<void>;
  refreshCount: () => Promise<void>;
} {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncResult, setLastSyncResult] = useState<{
    success: number;
    failed: number;
    total: number;
  }>();

  // Refresh pending count from IndexedDB
  const refreshCount = useCallback(async () => {
    try {
      const count = await offlineQueue.getCount();
      setPendingCount(count);
    } catch (error) {
      console.error('Failed to get queue count:', error);
    }
  }, []);

  // Manually trigger sync
  const syncNow = useCallback(async () => {
    if (!isOnline || isSyncing) {
      return;
    }

    setIsSyncing(true);

    try {
      const result = await offlineQueue.syncAll(async (data) => {
        return await storageService.submitResponse(data);
      });

      setLastSyncResult(result);

      // Refresh count after sync
      await refreshCount();

      if (result.success > 0) {
        console.log(`✅ Successfully synced ${result.success} submissions`);
      }

      if (result.failed > 0) {
        console.warn(`⚠️ Failed to sync ${result.failed} submissions`);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, refreshCount]);

  // Handle online event
  useEffect(() => {
    const handleOnline = async () => {
      console.log('🌐 Network restored!');
      setIsOnline(true);

      // Wait a bit for network to stabilize
      setTimeout(async () => {
        const count = await offlineQueue.getCount();
        if (count > 0) {
          console.log(`🔄 Auto-syncing ${count} queued submissions...`);
          await syncNow();
        }
      }, 1000);
    };

    const handleOffline = () => {
      console.log('📡 Network lost - entering offline mode');
      setIsOnline(false);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial count refresh
    refreshCount();

    // Periodic count refresh (every 30 seconds)
    const interval = setInterval(refreshCount, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [syncNow, refreshCount]);

  return {
    isOnline,
    pendingCount,
    isSyncing,
    lastSyncResult,
    syncNow,
    refreshCount
  };
}

export default useNetworkStatus;
