import React, { useState, useEffect } from 'react';
import { SafetyCheckin } from '../types';
import { safetyCheckinService } from '../services/safetyCheckinService';
import { Button } from './Button';
import { 
  X, Search, ShieldCheck, UserCheck, Users, MapPin, 
  Clock, AlertCircle, Download, Upload, CheckCircle2 
} from 'lucide-react';

interface SafetyCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyCheckinModal: React.FC<SafetyCheckinModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'checkin' | 'search'>('checkin');
  const [checkins, setCheckins] = useState<SafetyCheckin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Checkin form state
  const [name, setName] = useState('');
  const [phoneLast4, setPhoneLast4] = useState('');
  const [companionsCount, setCompanionsCount] = useState(1);
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<SafetyCheckin['status']>('safe');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadCheckins();
    }
  }, [isOpen]);

  const loadCheckins = async () => {
    setLoading(true);
    const data = await safetyCheckinService.getAllCheckins();
    setCheckins(data);
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await safetyCheckinService.registerCheckin({
      name: name.trim(),
      phoneLast4: phoneLast4.trim() || '****',
      companionsCount: companionsCount || 1,
      location: location.trim() || '临时避难点',
      status,
      note: note.trim() || undefined
    });

    setSubmitSuccess(true);
    await loadCheckins();
    setTimeout(() => {
      setSubmitSuccess(false);
      setActiveTab('search');
    }, 1200);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    const results = await safetyCheckinService.searchCheckins(query);
    setCheckins(results);
  };

  const handleExport = async () => {
    const json = await safetyCheckinService.exportCheckins();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crisiskit_safety_roster_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const list = JSON.parse(text);
      if (Array.isArray(list)) {
        const count = await safetyCheckinService.importCheckins(list);
        alert(`成功导入 ${count} 条平安名单记录！`);
        await loadCheckins();
      }
    } catch (err) {
      alert('导入失败，文件格式不符合要求');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 border border-green-200 dark:border-green-900/40 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                亲友寻人与平安打卡站
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                支持完全离线登记与亲友信息核对，一键汇总结对
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 px-5 pt-2">
          <button
            onClick={() => setActiveTab('checkin')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'checkin'
                ? 'border-green-600 text-green-600 dark:border-green-400 dark:text-green-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            我已安全（报备打卡）
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'search'
                ? 'border-green-600 text-green-600 dark:border-green-400 dark:text-green-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Search className="w-4 h-4" />
            寻人查询（已登记 {checkins.length} 人）
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'checkin' ? (
            <form onSubmit={handleRegister} className="space-y-4">
              {submitSuccess && (
                <div className="p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-2 text-green-700 dark:text-green-300 text-xs animate-bounce">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>打卡成功！已持久化保存在本地离线名册中。</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    受困者/避难者姓名 *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="如: 扎西顿珠 / 达瓦"
                    className="w-full text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    手机后4位 (供亲友验证)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={phoneLast4}
                    onChange={(e) => setPhoneLast4(e.target.value)}
                    placeholder="如: 8821"
                    className="w-full text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    同行总人数
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={companionsCount}
                    onChange={(e) => setCompanionsCount(parseInt(e.target.value) || 1)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    当前避难点/所在位置
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="如: 吉隆镇中心小学安置点"
                    className="w-full text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  身体状况
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('safe')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold ${
                      status === 'safe'
                        ? 'border-green-500 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    良好安全
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('injured')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold ${
                      status === 'injured'
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    轻微伤情
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('critical')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold ${
                      status === 'critical'
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    急需就医
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  附言 (给亲友的话或特殊需求)
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="如: 我跟向导在一起，手机快没电了，大家都很安全，别担心。"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                />
              </div>

              <Button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md">
                一键登记离线平安名册
              </Button>
            </form>
          ) : (
            <div className="space-y-3">
              {/* Search bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="搜索亲友姓名、手机尾号或安置点..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pb-1">
                <span>找到 {checkins.length} 条记录</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    导出名册
                  </button>
                  <label className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    导入名册
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Roster list */}
              {checkins.length === 0 ? (
                <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-xs">
                  暂无匹配的平安登记记录，请在左侧标签进行报备。
                </div>
              ) : (
                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                  {checkins.map(item => (
                    <div 
                      key={item.id}
                      className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/60 shadow-sm space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900 dark:text-white">
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                            尾号: {item.phoneLast4}
                          </span>
                          <span className="text-[11px] text-gray-500 flex items-center gap-0.5">
                            <Users className="w-3 h-3" />
                            同行{item.companionsCount}人
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'safe'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                            : item.status === 'injured'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                        }`}>
                          {item.status === 'safe' ? '安全良好' : item.status === 'injured' ? '轻伤' : '急需就医'}
                        </span>
                      </div>

                      <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>避难点：{item.location}</span>
                      </div>

                      {item.note && (
                        <div className="text-xs bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg text-gray-700 dark:text-gray-300 italic">
                          "{item.note}"
                        </div>
                      )}

                      <div className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>打卡时间：{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
