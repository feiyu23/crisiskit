import React, { useState, useEffect } from 'react';
import { 
  X, HeartHandshake, Plus, Search, Filter, Phone, 
  MapPin, CheckCircle, Clock, AlertTriangle, Zap, Pill, 
  Droplets, Utensils, ShieldAlert, Baby, Wrench, Download, Upload 
} from 'lucide-react';
import { MutualAidItem, MutualAidType, MutualAidCategory } from '../types';
import { mutualAidService } from '../services/mutualAidService';
import { getLang } from '../utils/i18n';

interface CommunityMutualAidModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunityMutualAidModal: React.FC<CommunityMutualAidModalProps> = ({ isOpen, onClose }) => {
  const lang = getLang();
  const isEn = lang === 'en';

  const [items, setItems] = useState<MutualAidItem[]>([]);
  const [filterType, setFilterType] = useState<MutualAidType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<MutualAidCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [newType, setNewType] = useState<MutualAidType>('offer');
  const [newCategory, setNewCategory] = useState<MutualAidCategory>('power');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newIsUrgent, setNewIsUrgent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadItems();
    }
  }, [isOpen]);

  const loadItems = () => {
    const list = mutualAidService.getItems();
    setItems(list);
  };

  if (!isOpen) return null;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContact.trim()) {
      alert(isEn ? 'Please fill in Title and Contact Info.' : '请填写物品标题与联系方式。');
      return;
    }

    mutualAidService.addItem({
      type: newType,
      category: newCategory,
      title: newTitle.trim(),
      description: newDescription.trim(),
      contact: newContact.trim(),
      location: newLocation.trim() || undefined,
      isUrgent: newIsUrgent
    });

    // Reset
    setNewTitle('');
    setNewDescription('');
    setNewLocation('');
    setNewIsUrgent(false);
    setShowAddForm(false);
    loadItems();
  };

  const handleToggleStatus = (id: string) => {
    mutualAidService.toggleStatus(id);
    loadItems();
  };

  const handleDeleteItem = (id: string) => {
    if (confirm(isEn ? 'Remove this item?' : '确定删除该互助条目？')) {
      mutualAidService.deleteItem(id);
      loadItems();
    }
  };

  const filteredItems = items.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.contact.toLowerCase().includes(q) ||
      (item.location && item.location.toLowerCase().includes(q))
    );
  });

  const getCategoryIcon = (cat: MutualAidCategory) => {
    switch (cat) {
      case 'power': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'medicine': return <Pill className="w-4 h-4 text-rose-500" />;
      case 'water': return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'food': return <Utensils className="w-4 h-4 text-emerald-500" />;
      case 'baby': return <Baby className="w-4 h-4 text-pink-500" />;
      case 'tools': return <Wrench className="w-4 h-4 text-gray-500" />;
      default: return <ShieldAlert className="w-4 h-4 text-purple-500" />;
    }
  };

  const getCategoryName = (cat: MutualAidCategory) => {
    if (isEn) {
      switch (cat) {
        case 'power': return 'Power/Charge';
        case 'medicine': return 'Medicine';
        case 'water': return 'Water';
        case 'food': return 'Food';
        case 'warmth': return 'Warmth';
        case 'baby': return 'Baby Care';
        case 'tools': return 'Tools';
        default: return 'Other';
      }
    }
    switch (cat) {
      case 'power': return '电能/发电机';
      case 'medicine': return '急需药品';
      case 'water': return '饮水净水';
      case 'food': return '干粮食品';
      case 'warmth': return '保暖衣被';
      case 'baby': return '母婴奶粉';
      case 'tools': return '救援工具';
      default: return '其他互助';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in safe-area-inset">
      <div className="bg-white dark:bg-gray-900 border border-teal-300 dark:border-teal-800/60 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-600 text-white rounded-2xl shadow-md">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                  {isEn ? 'Community Mutual Aid Board' : '社区与安置点余缺互助调剂板'}
                </h2>
                <span className="text-[10px] bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 font-bold px-2 py-0.5 rounded-full">
                  {isEn ? 'Offline Local-First' : '离线互助 · 以物易物'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {isEn 
                  ? 'Neighbors helping neighbors in isolated shelters: share spare power, water, or urgent medicines.'
                  : '守望相助 · 孤岛避难所余缺调剂：发电机共享充电、急需药物调剂、净水片与婴儿物资互济'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Filter Bar */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? 'Search item, tent #, contact, medicine...' : '搜索物资名称、房号帐篷、药品、联系人...'}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              {showAddForm ? (isEn ? 'Close Form' : '关闭发布') : (isEn ? 'Publish Offer/Need' : '发布互助/急求')}
            </button>
          </div>

          {/* Type Tabs & Category Filter */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex rounded-xl bg-gray-200 dark:bg-gray-700 p-0.5">
              <button
                onClick={() => setFilterType('all')}
                className={`py-1 px-2.5 rounded-lg font-bold transition ${filterType === 'all' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}
              >
                {isEn ? 'All' : '全部'}
              </button>
              <button
                onClick={() => setFilterType('offer')}
                className={`py-1 px-2.5 rounded-lg font-bold transition ${filterType === 'offer' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700 dark:text-emerald-400'}`}
              >
                🟢 {isEn ? 'I Can Share' : '我有余/可提供'}
              </button>
              <button
                onClick={() => setFilterType('request')}
                className={`py-1 px-2.5 rounded-lg font-bold transition ${filterType === 'request' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-700 dark:text-rose-400'}`}
              >
                🔴 {isEn ? 'I Need Help' : '我急需/求帮助'}
              </button>
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-gray-700 dark:text-gray-200 font-semibold"
            >
              <option value="all">{isEn ? 'All Categories' : '全部类别'}</option>
              <option value="power">{isEn ? 'Power/Charging' : '电能/发电机'}</option>
              <option value="medicine">{isEn ? 'Medicines' : '急需药品'}</option>
              <option value="water">{isEn ? 'Water/Purification' : '饮水净水'}</option>
              <option value="food">{isEn ? 'Food' : '干粮食品'}</option>
              <option value="warmth">{isEn ? 'Warmth' : '保暖衣被'}</option>
              <option value="baby">{isEn ? 'Baby/Infant' : '母婴奶粉'}</option>
              <option value="tools">{isEn ? 'Tools' : '救援工具'}</option>
              <option value="other">{isEn ? 'Other' : '其他'}</option>
            </select>
          </div>
        </div>

        {/* Add Form Drawer */}
        {showAddForm && (
          <form onSubmit={handleAddItem} className="p-4 bg-teal-50/70 dark:bg-gray-800/90 border-b border-teal-200 dark:border-teal-900 space-y-3 text-xs">
            <div className="font-bold text-gray-900 dark:text-white flex items-center justify-between">
              <span>{isEn ? 'Post New Mutual Aid Item' : '发布新的社区余缺/求援信息'}</span>
              <span className="text-[10px] text-gray-500">{isEn ? 'Stored locally in shelter device' : '保存在本地，可生成核验信息'}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  {isEn ? 'Type' : '互助类型'}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('offer')}
                    className={`flex-1 py-1.5 rounded-lg font-bold border transition ${
                      newType === 'offer' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    🟢 {isEn ? 'I Can Share' : '我有余 (共享)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('request')}
                    className={`flex-1 py-1.5 rounded-lg font-bold border transition ${
                      newType === 'request' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    🔴 {isEn ? 'I Need Help' : '我急需 (求助)'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  {isEn ? 'Category' : '物资种类'}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full py-1.5 px-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white font-medium"
                >
                  <option value="power">{isEn ? '⚡ Power/Charging' : '⚡ 电能/发电机'}</option>
                  <option value="medicine">{isEn ? '💊 Critical Medicine' : '💊 急需药品'}</option>
                  <option value="water">{isEn ? '💧 Water / Purification' : '💧 饮水净水'}</option>
                  <option value="food">{isEn ? '🥫 Food Rations' : '🥫 干粮食品'}</option>
                  <option value="warmth">{isEn ? '🧥 Warmth & Blankets' : '🧥 保暖衣被'}</option>
                  <option value="baby">{isEn ? '👶 Infant & Baby Formula' : '👶 母婴奶粉'}</option>
                  <option value="tools">{isEn ? '🔧 Shovels/Tools' : '🔧 救援工具'}</option>
                  <option value="other">{isEn ? '📦 Other' : '📦 其他'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                {isEn ? 'Title (Clear & Concise)' : '物品标题 / 事项 (一目了然)'} *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={isEn ? 'e.g. 1000W generator charging available / Need insulin pen needle' : '例如：柴油发电机集中充电 / 急求胰岛素针头 / 多余净水片分发'}
                className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                {isEn ? 'Details & Conditions' : '详细说明 (数量、换取需求或共享时段)'}
              </label>
              <textarea
                rows={2}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder={isEn ? 'e.g. Every day 12:00-14:00, bring your own cable / Can exchange with rice' : '例如：每天中午12点开启，自带充电线 / 愿用两包压缩饼干换取两片止痛药'}
                className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  {isEn ? 'Contact (Name / Phone / Radio)' : '联系人 / 手机 / 对讲机'} *
                </label>
                <input
                  type="text"
                  required
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  placeholder={isEn ? 'e.g. John Doe / Tent B-12' : '例如：张先生 (138xxx) / 帐篷区A-05'}
                  className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  {isEn ? 'Location / Tent #' : '所在位置 / 地标'}
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder={isEn ? 'e.g. Near medical tent / High ground' : '例如：安置点医务帐篷西侧'}
                  className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newIsUrgent}
                  onChange={(e) => setNewIsUrgent(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <span className="text-rose-600 font-bold">{isEn ? 'Mark as Urgent (Life-Critical)' : '标记为极度紧急 (涉及生命健康)'}</span>
              </label>

              <button
                type="submit"
                className="py-1.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow"
              >
                {isEn ? 'Confirm Post' : '确认发布'}
              </button>
            </div>
          </form>
        )}

        {/* List Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-500">
              <HeartHandshake className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-xs font-bold">{isEn ? 'No mutual aid posts matching criteria' : '暂无匹配的余缺互助信息'}</p>
              <p className="text-[11px] mt-1 text-gray-400">
                {isEn ? 'Click "Publish Offer/Need" above to post the first one.' : '点击上方“发布互助/急求”发布一条'}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isOffer = item.type === 'offer';
              const isFulfilled = item.status === 'fulfilled';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isFulfilled
                      ? 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 opacity-60'
                      : isOffer
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 shadow-sm'
                      : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isOffer 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' 
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                      }`}>
                        {isOffer ? (isEn ? '🟢 CAN SHARE' : '🟢 我有余/可提供') : (isEn ? '🔴 NEED HELP' : '🔴 我急需/求帮助')}
                      </span>

                      <span className="flex items-center gap-1 text-[11px] font-bold text-gray-600 dark:text-gray-300">
                        {getCategoryIcon(item.category)}
                        {getCategoryName(item.category)}
                      </span>

                      {item.isUrgent && (
                        <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded animate-pulse">
                          {isEn ? 'URGENT' : '急迫'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(item.id)}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold transition ${
                          isFulfilled
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            : 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 hover:bg-teal-200'
                        }`}
                      >
                        {isFulfilled ? (isEn ? 'Reopen' : '恢复激活') : (isEn ? 'Mark Resolved' : '标记已解决')}
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-gray-400 hover:text-red-500 text-xs px-1"
                        title={isEn ? 'Delete' : '删除'}
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <h3 className={`text-sm font-black text-gray-900 dark:text-white mb-1 ${isFulfilled ? 'line-through text-gray-400' : ''}`}>
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                      {item.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200/60 dark:border-gray-800/60 text-[11px] text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-bold text-gray-800 dark:text-gray-200">
                        <Phone className="w-3.5 h-3.5 text-teal-600" />
                        {item.contact}
                      </span>
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {item.location}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between text-xs">
          <div className="text-gray-500 dark:text-gray-400">
            🤝 {isEn ? 'Community mutual aid saves lives when outside help is delayed.' : '外部救援抵达前，邻里互通有无是维系生存的最强堡垒'}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow transition"
          >
            {isEn ? 'Close' : '关闭'}
          </button>
        </div>
      </div>
    </div>
  );
};
