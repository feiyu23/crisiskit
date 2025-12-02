import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { CreateIncident } from './pages/CreateIncident';
import { IncidentDashboard } from './pages/IncidentDashboard';
import { PublicSubmit } from './pages/PublicSubmit';
import { DesignNotes } from './pages/DesignNotes';
import { NetworkStatus } from './components/pwa/NetworkStatus';
import { PWAInstallPrompt } from './components/pwa/PWAInstallPrompt';

const App: React.FC = () => {
  return (
    <HashRouter>
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