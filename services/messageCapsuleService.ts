export interface MessageCapsule {
  id: string;
  recipientName: string;
  recipientContact: string;
  senderName: string;
  messageText: string;
  timestamp: number;
  status: 'sealed' | 'delivered';
}

const CAPSULE_STORAGE_KEY = 'crisiskit_message_capsules';

export const messageCapsuleService = {
  /**
   * Save a sealed message capsule locally
   */
  async saveCapsule(capsuleData: Omit<MessageCapsule, 'id' | 'timestamp' | 'status'>): Promise<MessageCapsule> {
    const capsule: MessageCapsule = {
      ...capsuleData,
      id: 'cap_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: Date.now(),
      status: 'sealed'
    };

    try {
      const all = await this.getAllCapsules();
      const updated = [capsule, ...all];
      localStorage.setItem(CAPSULE_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to seal message capsule:', e);
    }

    return capsule;
  },

  /**
   * Get all sealed capsules
   */
  async getAllCapsules(): Promise<MessageCapsule[]> {
    try {
      const raw = localStorage.getItem(CAPSULE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.sort((a, b) => b.timestamp - a.timestamp);
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  },

  /**
   * Delete a capsule
   */
  async deleteCapsule(id: string): Promise<void> {
    const all = await this.getAllCapsules();
    const filtered = all.filter(c => c.id !== id);
    localStorage.setItem(CAPSULE_STORAGE_KEY, JSON.stringify(filtered));
  }
};
