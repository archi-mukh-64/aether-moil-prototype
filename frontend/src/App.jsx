import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import { MainLayout } from './layouts/MainLayout.jsx';

import { Home } from './pages/Home.jsx';
import { CommandCenterPage } from './pages/CommandCenterPage.jsx';
import { ReserveRadarPage } from './pages/ReserveRadarPage.jsx';
import { AlertEnginePage } from './pages/AlertEnginePage.jsx';
import { ProtocolPage } from './pages/ProtocolPage.jsx';
import { EquipmentPage } from './pages/EquipmentPage.jsx';
import { AnalyticsPage } from './pages/AnalyticsPage.jsx';
import { DecisionLogPage } from './pages/DecisionLogPage.jsx';
import { ScenarioLabPage } from './pages/ScenarioLabPage.jsx';
import { ReportsPage } from './pages/ReportsPage.jsx';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="command-center" element={<CommandCenterPage />} />
            <Route path="scenario-lab" element={<ScenarioLabPage />} />
            <Route path="scenarios" element={<ScenarioLabPage />} />
            <Route path="reserve-radar" element={<ReserveRadarPage />} />
            <Route path="alert-engine" element={<AlertEnginePage />} />
            <Route path="protocol" element={<ProtocolPage />} />
            <Route path="equipment" element={<EquipmentPage />} />
            <Route path="equipments" element={<EquipmentPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="decision-log" element={<DecisionLogPage />} />
            <Route path="reports" element={<ReportsPage />} />
            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
