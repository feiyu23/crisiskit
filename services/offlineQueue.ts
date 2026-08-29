import Dexie, { Table } from 'dexie';
import { IncidentResponse, SafetyCheckin } from '../types';

// Queue item with retry metadata
export interface QueuedSubmission {
  id?: number; // Auto-incremented primary key
  data: Omit<IncidentResponse, 'id' | 'submittedAt'>; // Original submission data
  timestamp: number; // When it was queued
  retries: number; // Number of retry attempts
  lastAttempt?: number; // Last retry timestamp
  error?: string; // Last error message
}

// IndexedDB database using Dexie
export class OfflineDB extends Dexie {
  submissions!: Table<QueuedSubmission, number>;
  safetyCheckins!: Table<SafetyCheckin, string>;

  constructor() {
    super('CrisisKitOffline');

    // Define database schema version 1
    this.version(1).stores({
      submissions: '++id, timestamp, retries'
    });

    // Version 2: adds safety check-in registry for missing persons / reunification
    this.version(2).stores({
      submissions: '++id, timestamp, retries',
      safetyCheckins: 'id, name, phoneLast4, timestamp, status'
    });
  }
}

// Create singleton database instance
export const db = new OfflineDB();

// Maximum retry attempts
const MAX_RETRIES = 3;

/**
 * Offline Queue Service
 * Manages submissions when network is unavailable
 */
export const offlineQueue = {
  /**
   * Add submission to offline queue
   */
  async add(data: Omit<IncidentResponse, 'id' | 'submittedAt'>): Promise<number> {
    const queueItem: QueuedSubmission = {
      data,
      timestamp: Date.now(),
      retries: 0
    };

    const id = await db.submissions.add(queueItem);
    console.log('✅ Added to offline queue:', id);
    return id;
  },

  /**
   * Get count of pending submissions
   */
  async getCount(): Promise<number> {
    return await db.submissions.count();
  },

  /**
   * Get all pending submissions
   */
  async getAll(): Promise<QueuedSubmission[]> {
    return await db.submissions.orderBy('timestamp').toArray();
  },

  /**
   * Remove submission from queue
   */
  async remove(id: number): Promise<void> {
    await db.submissions.delete(id);
    console.log('✅ Removed from queue:', id);
  },

  /**
   * Update retry count and error for a submission
   */
  async updateRetry(id: number, error: string): Promise<void> {
    const item = await db.submissions.get(id);
    if (!item) return;

    await db.submissions.update(id, {
      retries: item.retries + 1,
      lastAttempt: Date.now(),
      error
    });
  },

  /**
   * Clear all submissions from queue
   */
  async clear(): Promise<void> {
    await db.submissions.clear();
    console.log('✅ Queue cleared');
  },

  /**
   * Sync all queued submissions
   * Returns: { success: number, failed: number }
   */
  async syncAll(
    submitFn: (data: Omit<IncidentResponse, 'id' | 'submittedAt'>) => Promise<IncidentResponse>
  ): Promise<{ success: number; failed: number; total: number }> {
    const items = await this.getAll();
    let success = 0;
    let failed = 0;

    console.log(`🔄 Syncing ${items.length} queued submissions...`);

    for (const item of items) {
      if (!item.id) continue;

      // Skip if max retries reached
      if (item.retries >= MAX_RETRIES) {
        console.warn(`⚠️ Max retries reached for item ${item.id}, skipping`);
        failed++;
        continue;
      }

      try {
        // Attempt to submit
        await submitFn(item.data);

        // Success - remove from queue
        await this.remove(item.id);
        success++;
        console.log(`✅ Synced item ${item.id}`);
      } catch (error) {
        // Failed - update retry count
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        await this.updateRetry(item.id, errorMsg);
        failed++;
        console.error(`❌ Failed to sync item ${item.id}:`, errorMsg);
      }
    }

    console.log(`🎉 Sync complete: ${success} success, ${failed} failed`);

    return { success, failed, total: items.length };
  },

  /**
   * Check if there are items ready to retry
   */
  async hasItemsToRetry(): Promise<boolean> {
    const items = await this.getAll();
    return items.some(item => item.retries < MAX_RETRIES);
  },

  /**
   * Get items that have exceeded max retries
   */
  async getFailedItems(): Promise<QueuedSubmission[]> {
    const items = await this.getAll();
    return items.filter(item => item.retries >= MAX_RETRIES);
  },

  /**
   * Export queue data for debugging
   */
  async exportQueue(): Promise<string> {
    const items = await this.getAll();
    return JSON.stringify(items, null, 2);
  }
};

// Auto-sync when coming online
if (typeof window !== 'undefined') {
  window.addEventListener('online', async () => {
    const count = await offlineQueue.getCount();
    if (count > 0) {
      console.log(`🌐 Network restored! ${count} items in queue`);
      // Note: Actual sync will be triggered by the component
      // This just logs the event
    }
  });

  window.addEventListener('offline', () => {
    console.log('📡 Network lost - entering offline mode');
  });
}

export default offlineQueue;
