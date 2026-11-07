import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { CreateIncident } from './pages/CreateIncident';
import { IncidentDashboard } from './pages/IncidentDashboard';
import { PublicSubmit } from './pages/PublicSubmit';
import { DesignNotes } from './pages/DesignNotes';
import { NetworkStatus } from './components/pwa/NetworkStatus';
import { PWAInstallPrompt } from './components/pwa/PWAInstallPrompt';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { EmergencyBroadcastModal } from './components/EmergencyBroadcastModal';
import { SafetyCheckinModal } from './components/SafetyCheckinModal';
import { EmergencyBeaconModal } from './components/EmergencyBeaconModal';
import { DisasterFieldGuideModal } from './components/DisasterFieldGuideModal';
import { BeaconOfHopeModal } from './components/BeaconOfHopeModal';
import { FamilyStockpileModal } from './components/FamilyStockpileModal';
import { CommunityMutualAidModal } from './components/CommunityMutualAidModal';
import { ArticlesList } from './pages/ArticlesList';
import { ArticleDetail } from './pages/ArticleDetail';
import { Radio, ShieldCheck, AlertOctagon, BookOpen, Heart, FileText, Backpack, HeartHandshake, Library } from 'lucide-react';
import { t, getLang, Language } from './utils/i18n';

const App: React.FC = () => {
  const [lang, setLangState] = useState<Language>(getLang());

  useEffect(() => {
    const handleLangChange = () => setLangState(getLang());
    window.addEventListener('crisiskit_lang_change', handleLangChange);
    return () => window.removeEventListener('crisiskit_lang_change', handleLangChange);
  }, []);

  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showBeaconModal, setShowBeaconModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showHopeModal, setShowHopeModal] = useState(false);
  const [showStockpileModal, setShowStockpileModal] = useState(false);
  const [showMutualAidModal, setShowMutualAidModal] = useState(false);

  return (
    <HashRouter>
      {/* Global Control Bar */}
      <div className="fixed top-3 left-4 z-40 flex flex-wrap items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />

        {/* Quick Disaster Survival Utilities on Desktop */}
        <div className="hidden lg:flex items-center gap-1.5 bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded-lg text-xs shadow-sm">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold hover:underline px-1.5 py-0.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40"
            title="一键生成短信/卫星紧急消息并发送亲友"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{t('dockSMS')}</span>
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={() => setShowBeaconModal(true)}
            className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-bold hover:underline px-1.5 py-0.5 rounded hover:bg-orange-50 dark:hover:bg-orange-950/40"
            title="夜间与浓雾下的屏幕SOS频闪与3.1kHz救生哨"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{t('dockBeacon')}</span>
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={() => setShowStockpileModal(true)}
            className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline px-1.5 py-0.5 rounded hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            title="72h/7天家庭备灾物资计算器与清点单"
          >
            <Backpack className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Stockpile' : '备灾测算'}</span>
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={() => setShowMutualAidModal(true)}
            className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-bold hover:underline px-1.5 py-0.5 rounded hover:bg-teal-50 dark:hover:bg-teal-950/40"
            title="社区避难所余缺互助调剂板"
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Mutual Aid' : '余缺互助'}</span>
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={() => setShowCheckinModal(true)}
            className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold hover:underline px-1.5 py-0.5 rounded hover:bg-green-50 dark:hover:bg-green-950/40"
            title="离线报平安与亲友寻人名册"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('dockCheckin')}</span>
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={() => setShowGuideModal(true)}
            className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold hover:underline px-1.5 py-0.5 rounded hover:bg-amber-50 dark:hover:bg-amber-950/40"
            title="多灾种自救避险手册"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Field Guide' : '避险手册'}</span>
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={() => setShowHopeModal(true)}
            className="flex items-center gap-1 text-pink-600 dark:text-pink-400 font-bold hover:underline px-1.5 py-0.5 rounded hover:bg-pink-50 dark:hover:bg-pink-950/40"
            title="4-7-8呼吸平复、72h救援时间线、临时自治角色与爱的时空胶囊"
          >
            <Heart className="w-3.5 h-3.5 fill-pink-500/20" />
            <span>{t('dockHope')}</span>
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <Link
            to="/articles"
            className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold hover:underline px-1.5 py-0.5 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
            title="防灾干货与国家民防储备文库"
          >
            <Library className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Library' : '文库'}</span>
          </Link>
        </div>
      </div>

      {/* Mobile Emergency Quick Dock (Fixed at bottom on mobile) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 px-2 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
        <button
          onClick={() => setShowBroadcastModal(true)}
          className="flex flex-col items-center gap-0.5 text-red-600 dark:text-red-400 py-1 px-1 rounded-lg active:scale-95 transition"
        >
          <Radio className="w-5 h-5 animate-pulse" />
          <span className="text-[10px] font-bold">{t('dockSMS')}</span>
        </button>
        <button
          onClick={() => setShowBeaconModal(true)}
          className="flex flex-col items-center gap-0.5 text-amber-600 dark:text-amber-400 py-1 px-1 rounded-lg active:scale-95 transition"
        >
          <AlertOctagon className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t('dockBeacon')}</span>
        </button>
        <button
          onClick={() => setShowStockpileModal(true)}
          className="flex flex-col items-center gap-0.5 text-emerald-600 dark:text-emerald-400 py-1 px-1 rounded-lg active:scale-95 transition"
        >
          <Backpack className="w-5 h-5" />
          <span className="text-[10px] font-bold">{lang === 'en' ? 'Stockpile' : '备灾'}</span>
        </button>
        <button
          onClick={() => setShowMutualAidModal(true)}
          className="flex flex-col items-center gap-0.5 text-teal-600 dark:text-teal-400 py-1 px-1 rounded-lg active:scale-95 transition"
        >
          <HeartHandshake className="w-5 h-5" />
          <span className="text-[10px] font-bold">{lang === 'en' ? 'Mutual Aid' : '互助'}</span>
        </button>
        <button
          onClick={() => setShowHopeModal(true)}
          className="flex flex-col items-center gap-0.5 text-pink-600 dark:text-pink-400 py-1 px-1 rounded-lg active:scale-95 transition"
        >
          <Heart className="w-5 h-5 fill-pink-500/20" />
          <span className="text-[10px] font-bold">{t('dockHope')}</span>
        </button>
      </div>

      {/* Modals */}
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

      {/* PWA Components - Global */}
      <NetworkStatus />
      <PWAInstallPrompt />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<ArticlesList />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
        <Route path="/guides" element={<ArticlesList />} />
        <Route path="/guides/:slug" element={<ArticleDetail />} />
        <Route path="/create" element={<CreateIncident />} />
        <Route path="/incident/:id" element={<IncidentDashboard />} />
        <Route path="/submit/:id" element={<PublicSubmit />} />
        <Route path="/submit" element={<PublicSubmit />} />
        <Route path="/design" element={<DesignNotes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;