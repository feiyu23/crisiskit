import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storage';
import { Incident, IncidentResponse } from '../types';
import { Button } from '../components/Button';
import { 
  AlertTriangle, 
  Plus, 
  ArrowRight, 
  BookOpen, 
  Download, 
  Upload, 
  Radio, 
  ShieldCheck, 
  AlertOctagon, 
  HeartHandshake, 
  Mountain, 
  FileText, 
  Heart, 
  Sparkles, 
  ChevronDown, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { exportAllDataJSON, importDataJSON } from '../utils/dataPortability';
import { EmergencyBroadcastModal } from '../components/EmergencyBroadcastModal';
import { SafetyCheckinModal } from '../components/SafetyCheckinModal';
import { EmergencyBeaconModal } from '../components/EmergencyBeaconModal';
import { DisasterFieldGuideModal } from '../components/DisasterFieldGuideModal';
import { BeaconOfHopeModal } from '../components/BeaconOfHopeModal';

export const Home: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Survival Modals state
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showBeaconModal, setShowBeaconModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showHopeModal, setShowHopeModal] = useState(false);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    const data = await storageService.getIncidents();
    setIncidents(data);
    setLoading(false);
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const incidents = await storageService.getIncidents();
      const responsesPromises = incidents.map(inc => storageService.getResponses(inc.id));
      const responsesArrays = await Promise.all(responsesPromises);
      const allResponses = responsesArrays.flat();

      exportAllDataJSON(incidents, allResponses);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const { incidents: importedIncidents, responses: importedResponses } = await importDataJSON(file);

      const confirmMsg = `This will import ${importedIncidents.length} incidents and ${importedResponses.length} responses. Continue?`;
      if (!confirm(confirmMsg)) {
        setIsImporting(false);
        return;
      }

      const existingIncidents = await storageService.getIncidents();
      const existingIds = new Set(existingIncidents.map(i => i.id));

      for (const incident of importedIncidents) {
        if (!existingIds.has(incident.id)) {
          localStorage.setItem(
            'crisiskit_incidents',
            JSON.stringify([...existingIncidents, incident])
          );
          existingIncidents.push(incident);
        }
      }

      const allExistingResponses: IncidentResponse[] = [];
      for (const incident of existingIncidents) {
        const responses = await storageService.getResponses(incident.id);
        allExistingResponses.push(...responses);
      }

      const existingResponseIds = new Set(allExistingResponses.map(r => r.id));
      const newResponses = importedResponses.filter(r => !existingResponseIds.has(r.id));

      if (newResponses.length > 0) {
        localStorage.setItem(
          'crisiskit_responses',
          JSON.stringify([...allExistingResponses, ...newResponses])
        );
      }

      alert(`Successfully imported ${importedIncidents.length} incidents and ${newResponses.length} responses!`);
      loadIncidents();
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import data. Please check the file format.');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-16 sm:pt-20 pb-28 sm:pb-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/70 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold mb-3 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          西藏-尼泊尔极境离线求生 · 全天候生命线
          <span className="font-serif text-[11px] text-amber-700 dark:text-amber-300">བཀྲ་ཤིས་བདེ་ལེགས</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
          Sparks Beacon · 星火应急信标
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          纯公益防灾求生站。专为暴雨、山体滑坡、泥石流、断网断电、高寒失温的极端场景打造。
          <br className="hidden sm:inline" />
          <strong className="text-red-600 dark:text-red-400 font-semibold">支持完全离线与零流量运行</strong>。请保持镇定、保存体温，微光虽小，星火为你守候。
        </p>
      </div>

      {/* 🔴 Section 1: The 4 Primary Panic-Proof Lifeline Actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            现场遇险 · 紧急自救通道（点击即用）
          </h2>
          <span className="text-[11px] text-gray-400 dark:text-gray-500 font-mono">
            零学习成本 · 离线可用
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Action 1: Emergency SMS Broadcast */}
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white shadow-lg hover:shadow-xl active:scale-[0.99] transition text-left group min-h-[130px] border border-red-500/30"
          >
            <div className="flex items-start justify-between w-full">
              <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                <Radio className="w-6 h-6 text-white animate-pulse" />
              </div>
              <span className="text-[11px] font-bold bg-white/25 px-2.5 py-1 rounded-full text-white">
                零流量 / 卫星短信
              </span>
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                一键短信/卫星呼救
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-xs text-red-100 mt-1 line-clamp-2">
                自动提取高精度GPS、海拔与伤情，直接调起手机短信发送给亲友或救援队
              </div>
            </div>
          </button>

          {/* Action 2: Emergency Visual & Audio Beacon */}
          <button
            onClick={() => setShowBeaconModal(true)}
            className="flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl active:scale-[0.99] transition text-left group min-h-[130px] border border-amber-400/30"
          >
            <div className="flex items-start justify-between w-full">
              <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                <AlertOctagon className="w-6 h-6 text-white" />
              </div>
              <span className="text-[11px] font-bold bg-white/25 px-2.5 py-1 rounded-full text-white">
                夜间 / 浓雾穿透
              </span>
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                声光救援信标
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-xs text-amber-100 mt-1 line-clamp-2">
                屏幕全屏摩斯 SOS 强光频闪 + 3.1kHz 穿透性高频求生哨，引导搜救分队定位
              </div>
            </div>
          </button>

          {/* Action 3: Direct SOS Intake Form (Works fully offline!) */}
          <Link
            to="/submit"
            className="flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl active:scale-[0.99] transition text-left group min-h-[130px] border border-blue-500/30"
          >
            <div className="flex items-start justify-between w-full">
              <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-[11px] font-bold bg-white/25 px-2.5 py-1 rounded-full text-white">
                断网自动排队
              </span>
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                现场求助与伤情直报
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-xs text-blue-100 mt-1 line-clamp-2">
                登记受困位置、人数、受困伤情与急缺物资，离线也能安全记录并生成核验二维码
              </div>
            </div>
          </Link>

          {/* Action 4: Safety Check-in & Reunification */}
          <button
            onClick={() => setShowCheckinModal(true)}
            className="flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg hover:shadow-xl active:scale-[0.99] transition text-left group min-h-[130px] border border-emerald-500/30"
          >
            <div className="flex items-start justify-between w-full">
              <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                <HeartHandshake className="w-6 h-6 text-white" />
              </div>
              <span className="text-[11px] font-bold bg-white/25 px-2.5 py-1 rounded-full text-white">
                避难所查人
              </span>
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                报平安 & 寻亲名册
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-xs text-emerald-100 mt-1 line-clamp-2">
                查寻失联亲友是否在避难所名单（输入姓名/手机尾号快查），或登记自己脱险平安
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 🌸 Section 2: Mental First Aid & Survival Field Knowledge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-10">
        {/* Beacon of Hope */}
        <div className="p-4 sm:p-5 rounded-2xl border border-pink-200 dark:border-pink-900/50 bg-gradient-to-br from-pink-50/80 via-rose-50/40 to-amber-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 rounded-xl">
                  <Heart className="w-5 h-5 fill-pink-500/20" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                  微光与希望 · 心理平复与互助站
                </h3>
              </div>
              <span className="text-[10px] text-amber-700 dark:text-amber-300 font-serif bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">
                བཀྲ་ཤིས་བདེ་ལེགས
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              恐慌时跟随 <strong>4-7-8 呼吸光圈</strong> 平抑心跳与过度换气；了解 <strong>72小时科学搜救推进时间线</strong> 破除绝望；写下封存于本地的 <strong>爱的时空胶囊</strong>。
            </p>
          </div>
          <button
            onClick={() => setShowHopeModal(true)}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold text-xs rounded-xl shadow transition text-center"
          >
            开启微光守护与呼吸平复
          </button>
        </div>

        {/* Mudslide Field Survival Guide */}
        <div className="p-4 sm:p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/80 via-yellow-50/30 to-orange-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                  泥石流垂直逃生与高原自救
                </h3>
              </div>
              <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                离线图解
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              <strong>绝不顺着山沟跑，往垂直两侧高地跑</strong>；警惕上游断流与轰鸣（堰塞湖溃决前兆）；湿冷环境下<strong>隔绝地面防失温四步法</strong>与自制饮水净化。
            </p>
          </div>
          <button
            onClick={() => setShowGuideModal(true)}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow transition text-center"
          >
            查看避险手册与防失温指南
          </button>
        </div>
      </div>

      {/* ⚙️ Section 3: Responders, Volunteers & Disaster Coordination Workspace */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
        <details className="group rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 overflow-hidden shadow-sm transition">
          <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-750 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl">
                <Mountain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  救援队与应急协同工作台
                  <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold px-2 py-0.5 rounded">
                    协调指挥 / 备份管理
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  面向现场救援协调者、志愿者团队及表格协同（点击展开/收起）
                </p>
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
          </summary>

          <div className="p-5 border-t border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-900/50 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">活跃救援通道与事件看板</h4>
                <p className="text-xs text-gray-500">点击任意通道即可进入指挥看板、查看求助热力与AI分诊</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleExportAll} variant="secondary" disabled={isExporting || incidents.length === 0}>
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  {isExporting ? '导出中...' : '导出全部备份'}
                </Button>
                <Button onClick={handleImportClick} variant="secondary" disabled={isImporting}>
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                  {isImporting ? '导入中...' : '导入数据合并'}
                </Button>
                <Link to="/create">
                  <Button>
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    新建救灾专案
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hidden file input for import */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : incidents.length === 0 ? (
              <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 mb-3">暂无其他特定救援专案</p>
                <Link to="/create">
                  <Button variant="secondary">创建第一个救援表单</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {incidents.map((incident) => (
                  <Link 
                    key={incident.id} 
                    to={`/incident/${incident.id}`}
                    className="block group"
                  >
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition">
                            {incident.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{incident.description}</p>
                          <p className="text-[10px] text-gray-400 mt-2 font-mono">
                            创建时间：{new Date(incident.createdAt).toLocaleString()} · ID: {incident.id.slice(0, 8)}
                          </p>
                        </div>
                        <ArrowRight className="text-gray-300 group-hover:text-primary-500 transition-colors w-4 h-4 shrink-0" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Architecture / Manifesto footnote */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-gray-500">
              <div>
                Sparks Beacon 结合了 CrisisKit Lite 敏捷架构与离线 PWA 引擎。
              </div>
              <Link to="/design" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                查阅系统设计哲学 (Design Philosophy)
              </Link>
            </div>
          </div>
        </details>
      </div>

      {/* Survival Modals */}
      <EmergencyBroadcastModal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
      />
      <SafetyCheckinModal
        isOpen={showCheckinModal}
        onClose={() => setShowCheckinModal(false)}
      />
      <EmergencyBeaconModal
        isOpen={showBeaconModal}
        onClose={() => setShowBeaconModal(false)}
      />
      <DisasterFieldGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
      <BeaconOfHopeModal
        isOpen={showHopeModal}
        onClose={() => setShowHopeModal(false)}
      />
    </div>
  );
};