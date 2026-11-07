import { MutualAidItem, MutualAidType, MutualAidCategory } from '../types';
import { getLang } from '../utils/i18n';

const LOCAL_STORAGE_MUTUAL_AID_KEY = 'crisiskit_mutual_aid_items';

const DEFAULT_SEED_ITEMS_ZH: MutualAidItem[] = [
  {
    id: 'aid_sample_1',
    type: 'offer',
    category: 'power',
    title: '柴油发电机集中充电 (12:00-14:00)',
    description: '可带多孔插线板为邻里手机和应急手电免费充电，每人限充30分钟。',
    contact: '李先生 (帐篷区B-07)',
    location: '临时安置点大树下',
    status: 'active',
    timestamp: Date.now() - 3600000 * 2,
  },
  {
    id: 'aid_sample_2',
    type: 'request',
    category: 'medicine',
    title: '急求成人速效降压药 (硝苯地平或络活喜)',
    description: '家中老人受惊吓血压升至170，药被落水冲走，急需两至三片应急，愿以干粮换取！',
    contact: '扎西 (安置点医务帐篷旁)',
    location: '安置点A区3号房',
    isUrgent: true,
    status: 'active',
    timestamp: Date.now() - 3600000,
  },
  {
    id: 'aid_sample_3',
    type: 'offer',
    category: 'water',
    title: '二氧化氯净水药片 20片分赠',
    description: '可净化野外溪水与泥水，有需要洁净饮用水的家庭请自带水壶来领。',
    contact: '王医生 (志愿者)',
    location: '救灾物资分发台',
    status: 'active',
    timestamp: Date.now() - 1800000,
  }
];

const DEFAULT_SEED_ITEMS_EN: MutualAidItem[] = [
  {
    id: 'aid_sample_1',
    type: 'offer',
    category: 'power',
    title: 'Community Generator Charging Station (12:00-14:00)',
    description: 'Free multi-port charging for phones and flashlights. 30 minutes max per person.',
    contact: 'Alex (Tent B-07)',
    location: 'Central Shelter Plaza',
    status: 'active',
    timestamp: Date.now() - 3600000 * 2,
  },
  {
    id: 'aid_sample_2',
    type: 'request',
    category: 'medicine',
    title: 'Urgent: Blood Pressure Medicine (Amlodipine / Nifedipine)',
    description: 'Elderly relative BP spiked to 170 due to panic. Medication swept away. Need 2-3 pills, willing to barter rations!',
    contact: 'Elena (Medical Tent)',
    location: 'Sector A, Cabin 3',
    isUrgent: true,
    status: 'active',
    timestamp: Date.now() - 3600000,
  },
  {
    id: 'aid_sample_3',
    type: 'offer',
    category: 'water',
    title: 'Water Purification Tablets (20 pcs to share)',
    description: 'Purifies raw stream/muddy water. Families in need please bring clean water bottles.',
    contact: 'Dr. Evans (Volunteer)',
    location: 'Aid Distribution Desk',
    status: 'active',
    timestamp: Date.now() - 1800000,
  }
];

export const mutualAidService = {
  getItems(): MutualAidItem[] {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_MUTUAL_AID_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to read mutual aid items from storage', e);
    }
    // Return sample seed items on first run matching current language
    const seeds = getLang() === 'en' ? DEFAULT_SEED_ITEMS_EN : DEFAULT_SEED_ITEMS_ZH;
    localStorage.setItem(LOCAL_STORAGE_MUTUAL_AID_KEY, JSON.stringify(seeds));
    return seeds;
  },

  addItem(item: Omit<MutualAidItem, 'id' | 'timestamp' | 'status'>): MutualAidItem {
    const newItem: MutualAidItem = {
      ...item,
      id: 'aid_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      status: 'active',
      timestamp: Date.now()
    };

    const current = this.getItems();
    const updated = [newItem, ...current];
    try {
      localStorage.setItem(LOCAL_STORAGE_MUTUAL_AID_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save mutual aid item', e);
    }
    return newItem;
  },

  toggleStatus(id: string): MutualAidItem | undefined {
    const current = this.getItems();
    const target = current.find(i => i.id === id);
    if (!target) return undefined;

    target.status = target.status === 'active' ? 'fulfilled' : 'active';
    try {
      localStorage.setItem(LOCAL_STORAGE_MUTUAL_AID_KEY, JSON.stringify(current));
    } catch (e) {
      console.error(e);
    }
    return target;
  },

  deleteItem(id: string): void {
    const current = this.getItems();
    const updated = current.filter(i => i.id !== id);
    try {
      localStorage.setItem(LOCAL_STORAGE_MUTUAL_AID_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  },

  searchItems(type: MutualAidType | 'all', category: MutualAidCategory | 'all', query: string): MutualAidItem[] {
    const all = this.getItems();
    const q = query.trim().toLowerCase();

    return all.filter(item => {
      if (type !== 'all' && item.type !== type) return false;
      if (category !== 'all' && item.category !== category) return false;
      if (!q) return true;

      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.contact.toLowerCase().includes(q) ||
        (item.location && item.location.toLowerCase().includes(q))
      );
    });
  }
};
