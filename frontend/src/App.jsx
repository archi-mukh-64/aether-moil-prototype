import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import { MainLayout } from './layouts/MainLayout.jsx';

// Route-level code splitting for optimal production performance
const Home = lazy(() => import('./pages/Home.jsx').then(m => ({ default: m.Home })));
const CommandCenterPage = lazy(() => import('./pages/CommandCenterPage.jsx').then(m => ({ default: m.CommandCenterPage })));
const ReserveRadarPage = lazy(() => import('./pages/ReserveRadarPage.jsx').then(m => ({ default: m.ReserveRadarPage })));
const AlertEnginePage = lazy(() => import('./pages/AlertEnginePage.jsx').then(m => ({ default: m.AlertEnginePage })));
const ProtocolPage = lazy(() => import('./pages/ProtocolPage.jsx').then(m => ({ default: m.ProtocolPage })));
const EquipmentPage = lazy(() => import('./pages/EquipmentPage.jsx').then(m => ({ default: m.EquipmentPage })));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage.jsx').then(m => ({ default: m.AnalyticsPage })));
const DecisionLogPage = lazy(() => import('./pages/DecisionLogPage.jsx').then(m => ({ default: m.DecisionLogPage })));
const ScenarioLabPage = lazy(() => import('./pages/ScenarioLabPage.jsx').then(m => ({ default: m.ScenarioLabPage })));
const ReportsPage = lazy(() => import('./pages/ReportsPage.jsx').then(m => ({ default: m.ReportsPage })));

function RouteFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-10 h-10 border-2 border-manganese-500/30 border-t-manganese-400 rounded-full animate-spin" />
        <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
          Loading Intelligence Stream...
        </span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
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
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  );
}
