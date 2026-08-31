import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { AppHeader } from '../components/layout/AppHeader.jsx';
import { SystemStatusBar } from '../components/workspace/SystemStatusBar.jsx';
import { CommandDrawer } from '../components/CommandDrawer.jsx';
import { DecisionModal } from '../components/DecisionModal.jsx';
import { SupportModal } from '../components/SupportModal.jsx';
import { MineComparisonModal } from '../components/modals/MineComparisonModal.jsx';
import { ExecutiveCommandModal } from '../components/modals/ExecutiveCommandModal.jsx';
import { ReportModal } from '../components/modals/ReportModal.jsx';
import { ErrorBoundary } from '../components/common/ErrorBoundary.jsx';
import { AetherLoadingScreen } from '../components/design-system/AetherLoadingScreen.jsx';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts.js';
import { useApp } from '../context/AppContext.jsx';

export const MainLayout = () => {
  // Activate global workstation keyboard shortcuts
  useKeyboardShortcuts();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBootScreen, setShowBootScreen] = useState(false);

  // Check if session has already seen the boot screen
  useEffect(() => {
    const hasBooted = sessionStorage.getItem('aether_booted');
    if (!hasBooted) {
      setShowBootScreen(true);
    }
  }, []);

  const handleBootComplete = () => {
    sessionStorage.setItem('aether_booted', 'true');
    setShowBootScreen(false);
  };

  const {
    isComparisonModalOpen,
    setIsComparisonModalOpen,
    isExecutiveModalOpen,
    setIsExecutiveModalOpen,
    isReportModalOpen,
    setIsReportModalOpen
  } = useApp();

  // 0. Completely Isolated Boot Initialization Screen
  if (showBootScreen) {
    return <AetherLoadingScreen onComplete={handleBootComplete} />;
  }

  return (
    <div className="min-h-screen flex bg-[#E8E1D5] text-[#272A27] font-sans selection:bg-[#C46A32]/30 selection:text-[#6C3214]">

      {/* 1. Collapsible Mineral Rail Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* 2. Main Application Flow Area (Offset by sidebar width) */}
      <div className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        {/* Top Command Console Header */}
        <AppHeader onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />

        {/* Viewport Outlet */}
        <main className="flex-1 w-full relative p-4 sm:p-6 lg:p-8 max-w-[1720px] mx-auto space-y-6">
          <ErrorBoundary title="SYSTEM VIEWPORT RECOVERY">
            <Outlet />
          </ErrorBoundary>
        </main>

        {/* Operational Status Console Bar */}
        <SystemStatusBar />
      </div>

      {/* Global Modals & Drawers */}
      <DecisionModal />
      <SupportModal />
      <CommandDrawer />
      <MineComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
      />
      <ExecutiveCommandModal
        isOpen={isExecutiveModalOpen}
        onClose={() => setIsExecutiveModalOpen(false)}
      />
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
