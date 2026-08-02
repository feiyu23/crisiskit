import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { CreateIncident } from './pages/CreateIncident';
import { IncidentDashboard } from './pages/IncidentDashboard';
import { PublicSubmit } from './pages/PublicSubmit';
import { DesignNotes } from './pages/DesignNotes';
import { NetworkStatus } from './components/pwa/NetworkStatus';
import { PWAInstallPrompt } from './components/pwa/PWAInstallPrompt';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageSwitcher } from './components/LanguageSwitcher';

const App: React.FC = () => {
  return (
    <HashRouter>
      {/* Global Control Bar */}
      <div className="fixed top-3 left-4 z-40 flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      {/* PWA Components - Global */}
      <NetworkStatus />
      <PWAInstallPrompt />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateIncident />} />
        <Route path="/incident/:id" element={<IncidentDashboard />} />
        <Route path="/submit/:id" element={<PublicSubmit />} />
        <Route path="/design" element={<DesignNotes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;