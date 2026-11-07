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
  ShieldAlert,
  Backpack,
  Globe
} from 'lucide-react';
import { exportAllDataJSON, importDataJSON } from '../utils/dataPortability';
import { EmergencyBroadcastModal } from '../components/EmergencyBroadcastModal';
import { SafetyCheckinModal } from '../components/SafetyCheckinModal';
import { EmergencyBeaconModal } from '../components/EmergencyBeaconModal';
import { DisasterFieldGuideModal } from '../components/DisasterFieldGuideModal';
import { BeaconOfHopeModal } from '../components/BeaconOfHopeModal';
import { FamilyStockpileModal } from '../components/FamilyStockpileModal';
import { CommunityMutualAidModal } from '../components/CommunityMutualAidModal';
import { t, getLang, Language } from '../utils/i18n';

export const Home: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active language state
  const [lang, setLangState] = useState<Language>(getLang());

  useEffect(() => {
    const handleLangChange = () => setLangState(getLang());
    window.addEventListener('crisiskit_lang_change', handleLangChange);
    return () => window.removeEventListener('crisiskit_lang_change', handleLangChange);
  }, []);

  const isEn = lang === 'en';

  // Survival Modals state
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showBeaconModal, setShowBeaconModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showHopeModal, setShowHopeModal] = useState(false);
  const [showStockpileModal, setShowStockpileModal] = useState(false);
  const [showMutualAidModal, setShowMutualAidModal] = useState(false);

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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 dark:bg-red-950/90 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 text-xs font-bold mb-3 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          {isEn 
            ? 'Global Humanitarian Lifeline · Works 100% Offline' 
            : '全球人道离线生命线 · 全天候离线运行'}
          <span className="font-serif text-[11px] text-amber-700 dark:text-amber-300 hidden sm:inline">
            བཀྲ་ཤིས་བདེ་ལེགས
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
          {t('beaconTitle')}
        </h1>
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 max-w-2xl mx-auto leading-relaxed font-normal">
          {isEn ? (
            <>
              Pure non-profit public lifeline for <strong className="text-gray-900 dark:text-white font-bold">Earthquakes, Volcanic eruptions, Floods, Blizzards, Mudslides, Grid outages, and Epidemics</strong>.
              <br className="hidden sm:inline" />
              <strong className="text-red-600 dark:text-red-400 font-semibold"> Fully functional offline & zero-data required</strong>. Stay calm and preserve warmth — hope is with you.
            </>
          ) : (
            <>
              纯公益全天候防灾生命线。专为<strong className="text-gray-900 dark:text-white font-bold">地震、火山喷发、洪涝、风雪极寒、泥石流、断网断电孤岛与公共卫生紧急状态</strong>打造。
              <br className="hidden sm:inline" />
              <strong className="text-red-600 dark:text-red-400 font-semibold">支持完全离线与零流量运行</strong>。请保持镇定、保存体温，微光虽小，星火为你守候。
            </>
          )}
        </p>
      </div>

      {/* 🔴 Section 1: The 4 Primary Panic-Proof Lifeline Actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            {t('lifelineSectionTitle')}
          </h2>
          <span className="text-[11px] text-gray-500 dark:text-gray-300 font-mono">
            {t('lifelineSectionSubtitle')}
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
                {t('emergencySMSTag')}
              </span>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center justify-between">
                <span>{t('emergencySMS')}</span>
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-xs text-red-100 mt-1 line-clamp-2">
                {t('emergencySMSDesc')}
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
                {t('sosBeaconTag')}
              </span>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center justify-between">
                <span>{t('sosBeacon')}</span>
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-xs text-amber-100 mt-1 line-clamp-2">
                {t('sosBeaconDesc')}
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
                {t('directReportTag')}
              </span>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center justify-between">
                <span>{t('directReport')}</span>
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-xs text-blue-100 mt-1 line-clamp-2">
                {t('directReportDesc')}
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
                {t('safetyCheckinTag')}
              </span>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center justify-between">
                <span>{t('safetyCheckin')}</span>
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-xs text-emerald-100 mt-1 line-clamp-2">
                {t('safetyCheckinDesc')}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 🎒 Section 2: Preparedness, Community Mutual Aid, Mental First Aid & Survival Field Guide */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Backpack className="w-4 h-4" />
            {isEn ? 'CIVIL DEFENCE STOCKPILE & COMMUNITY MUTUAL AID' : '国家民防标准家庭备灾 · 社区与避难所余缺互助'}
          </h2>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
            {isEn ? 'Nordic / German Standards · 100% Offline' : '北欧/德国标准测算 · 就地余缺调剂'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* Module 1: Family Stockpile Calculator (NEW) */}
        <div className="p-4 sm:p-5 rounded-2xl border border-emerald-300 dark:border-emerald-800/80 bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 rounded-xl">
                  <Backpack className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                  {isEn ? '72h & 7-Day Family Stockpile Calculator' : '🎒 72h / 7天 极境家庭备灾计算器'}
                </h3>
              </div>
              <span className="text-[10px] text-emerald-800 dark:text-emerald-200 font-bold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                {isEn ? 'Civil Defence Standard' : '有备无患'}
              </span>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed mb-4 font-normal">
              {isEn 
                ? 'Based on Nordic and German civil defence guidelines: calculate exact drinking water, non-perishable high-calorie food, 14-day chronic medicines, and emergency cooking heat for your family.'
                : '依据北欧与德国国家民防指南：测算家庭饮用水（3.5L/人/天）、免烹饪高能口粮、14天慢性病常备药、卡式炉与应急排泄物储备，支持离线打勾清点。'}
            </p>
          </div>
          <button
            onClick={() => setShowStockpileModal(true)}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow transition text-center"
          >
            {isEn ? 'Open Stockpile Calculator & Checklist' : '开启家庭备灾测算与清点单'}
          </button>
        </div>

        {/* Module 2: Community Mutual Aid Board (NEW) */}
        <div className="p-4 sm:p-5 rounded-2xl border border-teal-300 dark:border-teal-800/80 bg-gradient-to-br from-teal-50/90 via-cyan-50/40 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-300 rounded-xl">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                  {isEn ? 'Community Mutual Aid Board' : '🤝 社区与避难所余缺互助调剂板'}
                </h3>
              </div>
              <span className="text-[10px] text-teal-800 dark:text-teal-200 font-bold bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                {isEn ? 'Local Barter' : '守望相助'}
              </span>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed mb-4 font-normal">
              {isEn 
                ? 'Isolated shelter mutual exchange: share generator charging hours, extra antibiotics, or water purification tablets. Request urgent insulin, baby formula, or blankets.'
                : '断网孤岛与安置点互通有无：“我有余/可提供”（发电机充电、多余消炎药、井水）与“我急需”（降压药、婴儿配方奶粉、保温毯），就地余缺互济。'}
            </p>
          </div>
          <button
            onClick={() => setShowMutualAidModal(true)}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs rounded-xl shadow transition text-center"
          >
            {isEn ? 'Open Community Mutual Aid Board' : '进入社区余缺互助调剂板'}
          </button>
        </div>

        {/* Module 3: Beacon of Hope & Mental First Aid */}
        <div className="p-4 sm:p-5 rounded-2xl border border-pink-300 dark:border-pink-800/80 bg-gradient-to-br from-pink-50/90 via-rose-50/40 to-amber-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-pink-100 dark:bg-pink-950/80 text-pink-600 dark:text-pink-300 rounded-xl">
                  <Heart className="w-5 h-5 fill-pink-500/20" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                  {t('mentalAidTitle')}
                </h3>
              </div>
              <span className="text-[10px] text-amber-700 dark:text-amber-300 font-serif bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                བཀྲ་ཤིས་བདེ་ལེགས
              </span>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed mb-4 font-normal">
              {t('mentalAidDesc')}
            </p>
          </div>
          <button
            onClick={() => setShowHopeModal(true)}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold text-xs rounded-xl shadow transition text-center"
          >
            {t('mentalAidBtn')}
          </button>
        </div>

        {/* Module 4: Multi-Hazard Field Survival Guide */}
        <div className="p-4 sm:p-5 rounded-2xl border border-amber-300 dark:border-amber-800/80 bg-gradient-to-br from-amber-50/90 via-yellow-50/30 to-orange-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300 rounded-xl">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                  {isEn ? 'Multi-Hazard Field Survival Guide' : '📖 极境多灾种自救避险手册'}
                </h3>
              </div>
              <span className="text-[10px] text-amber-800 dark:text-amber-200 font-bold bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                {isEn ? 'Earthquake · Volcano · Cold' : '离线生死指南'}
              </span>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed mb-4 font-normal">
              {isEn 
                ? 'Actionable survival protocols: Earthquake (Drop, Cover, Hold On), Mudslides (perpendicular escape), Volcanic ash defense, Severe cold (hypothermia prevention), and Emergency water purification.'
                : '地震室内外避震避险、泥石流垂直高地逃生、火山灰呼吸道与眼部防护、高寒湿冷隔绝地面防失温、野外泥水三步澄清煮沸与疫情防交叉感染。'}
            </p>
          </div>
          <button
            onClick={() => setShowGuideModal(true)}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow transition text-center"
          >
            {isEn ? 'View Multi-Hazard Survival Guide' : '查看多灾种避险与自救指南'}
          </button>
        </div>
      </div>
      </div>

      {/* 📚 Section: Survival & Preparedness Field Knowledge Base */}
      <div className="mb-10 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 border border-indigo-200 dark:border-indigo-900/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-md shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white">
                {isEn ? 'Sparks Beacon Survival & Stockpile Field Library' : '📚 极境防灾与国家民防储备文库'}
              </h3>
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                {isEn ? '6 Deep Protocols' : '权威干货 · 离线可读'}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
              {isEn
                ? 'Deep-dive tactical protocols: 72h family stockpile calculations, phone beacons in total grid collapse, earthquake rubble tapping, volcanic ash eye safety, and ground heat loss laws.'
                : '深度实战避险：72h家庭储备标准拆解、断电断网孤岛手机信标、地震废墟敲击求生、火山灰护眼与防压塌、湿冷防失温地面隔绝铁律。'}
            </p>
          </div>
        </div>
        <Link
          to="/articles"
          className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 group"
        >
          <span>{isEn ? 'Browse Survival Library' : '进入防灾文库查阅'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* ⚙️ Section 3: Responders, Volunteers & Disaster Coordination Workspace */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
        <details className="group rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm transition">
          <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-850 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl">
                <Mountain className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {t('responderWorkspace')}
                  <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                    {t('responderWorkspaceTag')}
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('responderDesc')}
                </p>
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
          </summary>

          <div className="p-5 border-t border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-900/50 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t('activeIncidents')}</h4>
                <p className="text-xs text-gray-500">{t('activeIncidentsDesc')}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleExportAll} variant="secondary" disabled={isExporting || incidents.length === 0}>
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  {isExporting ? t('exporting') : t('exportAll')}
                </Button>
                <Button onClick={handleImportClick} variant="secondary" disabled={isImporting}>
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                  {isImporting ? t('importing') : t('importData')}
                </Button>
                <Link to="/create">
                  <Button>
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    {t('newIncident')}
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
                <p className="text-xs text-gray-500 mb-3">{t('noIncidents')}</p>
                <Link to="/create">
                  <Button variant="secondary">{t('createFirstForm')}</Button>
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
                            {t('createdTime')}：{new Date(incident.createdAt).toLocaleString()} · {t('channelId')}: {incident.id.slice(0, 8)}
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
                Sparks Beacon (Global Humanitarian Offline Edition)
              </div>
              <Link to="/design" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                {t('designPhilosophy')}
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
      <FamilyStockpileModal
        isOpen={showStockpileModal}
        onClose={() => setShowStockpileModal(false)}
      />
      <CommunityMutualAidModal
        isOpen={showMutualAidModal}
        onClose={() => setShowMutualAidModal(false)}
      />
    </div>
  );
};
