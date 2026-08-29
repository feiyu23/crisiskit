import { SafetyCheckin } from '../types';
import { db } from './offlineQueue';

const LOCAL_STORAGE_BACKUP_KEY = 'crisiskit_safety_checkins';

export const safetyCheckinService = {
  /**
   * Register a new safety check-in record
   */
  async registerCheckin(data: Omit<SafetyCheckin, 'id' | 'timestamp'>): Promise<SafetyCheckin> {
    const checkin: SafetyCheckin = {
      ...data,
      id: 'ck_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: Date.now(),
    };

    try {
      await db.safetyCheckins.put(checkin);
    } catch (err) {
      console.warn('IndexedDB write failed, falling back to localStorage:', err);
    }

    // Always maintain localStorage backup for ultra-resilient offline persistence
    try {
      const existing = this.getLocalStorageBackup();
      const updated = [checkin, ...existing.filter(item => item.id !== checkin.id)];
      localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage backup error:', e);
    }

    return checkin;
  },

  /**
   * Get all recorded check-ins, sorted newest first
   */
  async getAllCheckins(): Promise<SafetyCheckin[]> {
    try {
      const list = await db.safetyCheckins.orderBy('timestamp').reverse().toArray();
      if (list.length > 0) return list;
    } catch (err) {
      console.warn('IndexedDB read failed, falling back to localStorage:', err);
    }
    return this.getLocalStorageBackup();
  },

  /**
   * Search check-ins by Name, Phone Last 4, Location, or Note
   */
  async searchCheckins(query: string): Promise<SafetyCheckin[]> {
    const all = await this.getAllCheckins();
    const q = query.trim().toLowerCase();
    if (!q) return all;

    return all.filter(item => {
      const matchName = item.name.toLowerCase().includes(q);
      const matchPhone = item.phoneLast4.includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      const matchNote = item.note ? item.note.toLowerCase().includes(q) : false;
      return matchName || matchPhone || matchLoc || matchNote;
    });
  },

  /**
   * Delete a record by ID
   */
  async deleteCheckin(id: string): Promise<void> {
    try {
      await db.safetyCheckins.delete(id);
    } catch (e) {
      console.error(e);
    }
    try {
      const current = this.getLocalStorageBackup();
      const filtered = current.filter(item => item.id !== id);
      localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }
  },

  /**
   * Export all check-ins as JSON string
   */
  async exportCheckins(): Promise<string> {
    const all = await this.getAllCheckins();
    return JSON.stringify(all, null, 2);
  },

  /**
   * Import check-ins from peers or emergency coordinators
   */
  async importCheckins(checkins: SafetyCheckin[]): Promise<number> {
    let importedCount = 0;
    for (const item of checkins) {
      if (!item.id || !item.name) continue;
      try {
        await db.safetyCheckins.put(item);
        importedCount++;
      } catch (err) {
        console.warn('Failed to import checkin to IndexedDB:', err);
      }
    }

    // Update backup
    try {
      const existing = this.getLocalStorageBackup();
      const existingMap = new Map(existing.map(i => [i.id, i]));
      for (const item of checkins) {
        existingMap.set(item.id, item);
      }
      localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(Array.from(existingMap.values())));
    } catch (e) {
      console.error('Failed to update localStorage backup:', e);
    }

    return importedCount;
  },

  /**
   * Fallback retrieval from localStorage
   */
  getLocalStorageBackup(): SafetyCheckin[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.sort((a, b) => b.timestamp - a.timestamp);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }
};
