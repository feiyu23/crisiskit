import React, { useState } from 'react';
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
import { Radio, ShieldCheck, AlertOctagon, BookOpen, Heart, FileText } from 'lucide-react';

const App: React.FC = () => {
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showBeaconModal, setShowBeaconModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showHopeModal, setShowHopeModal] = useState(false);

  return (
    <HashRouter>
      {/* Global Control Bar */}
      <div className="fixed top-3 left-4 z-40 flex flex-wrap items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />

        {/* Quick Disaster Survival Utilities on Desktop */}
        <div className="hidden sm:flex items-center gap-1.5 bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded-lg text-xs shadow-sm">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold hover:underline px-1.5 py-0.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40"
            title="一键生成短信/卫星紧急消息并发送亲友"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>紧急联络</span>
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={() => setShowCheckinModal(true)}
            className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold hover:underline px-1.5 py-0.5 rounded hover:bg-green-50 dark:hover:bg-green-950/40"
            title="离线报平安与亲友寻人名册"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>报平安/寻人</span>
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={() => setShowBeaconModal(true)}
            className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-bold hover:underline px-1.5 py-0.5 rounded hover:bg-orange-50 dark:hover:bg-orange-950/40"
            title="夜间与浓雾下的屏幕SOS频闪与3.1kHz救生哨"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>声光信标</span>
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={() => setShowGuideModal(true)}
            className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold hover:underline px-1.5 py-0.5 rounded hover:bg-amber-50 dark:hover:bg-amber-950/40"
            title="离线泥石流垂直逃生与高原防失温手册"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>避险手册</span>
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={() => setShowHopeModal(true)}
            className="flex items-center gap-1 text-pink-600 dark:text-pink-400 font-bold hover:underline px-1.5 py-0.5 rounded hover:bg-pink-50 dark:hover:bg-pink-950/40"
            title="4-7-8呼吸平复、72h救援时间线、临时自治角色与爱的时空胶囊"
          >
            <Heart className="w-3.5 h-3.5 fill-pink-500/20" />
            <span>微光与希望</span>
          </button>
        </div>
      </div>

      {/* Mobile Emergency Quick Dock (Fixed at bottom on mobile) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 px-2 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
        <button
          onClick={() => setShowBroadcastModal(true)}
          className="flex flex-col items-center gap-0.5 text-red-600 dark:text-red-400 py-1 px-1.5 rounded-lg active:scale-95 transition"
        >
          <Radio className="w-5 h-5 animate-pulse" />
          <span className="text-[10px] font-bold">短信呼救</span>
        </button>
        <button
          onClick={() => setShowBeaconModal(true)}
          className="flex flex-col items-center gap-0.5 text-amber-600 dark:text-amber-400 py-1 px-1.5 rounded-lg active:scale-95 transition"
        >
          <AlertOctagon className="w-5 h-5" />
          <span className="text-[10px] font-bold">声光信标</span>
        </button>
        <Link
          to="/submit"
          className="flex flex-col items-center gap-0.5 text-blue-600 dark:text-blue-400 py-1 px-1.5 rounded-lg active:scale-95 transition"
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-bold">求助直报</span>
        </Link>
        <button
          onClick={() => setShowCheckinModal(true)}
          className="flex flex-col items-center gap-0.5 text-emerald-600 dark:text-emerald-400 py-1 px-1.5 rounded-lg active:scale-95 transition"
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] font-bold">报平安/寻亲</span>
        </button>
        <button
          onClick={() => setShowHopeModal(true)}
          className="flex flex-col items-center gap-0.5 text-pink-600 dark:text-pink-400 py-1 px-1.5 rounded-lg active:scale-95 transition"
        >
          <Heart className="w-5 h-5 fill-pink-500/20" />
          <span className="text-[10px] font-bold">微光希望</span>
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

      {/* PWA Components - Global */}
      <NetworkStatus />
      <PWAInstallPrompt />

      <Routes>
        <Route path="/" element={<Home />} />
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