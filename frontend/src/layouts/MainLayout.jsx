import React, { useState } from 'react';
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
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts.js';
import { useApp } from '../context/AppContext.jsx';

export const MainLayout = () => {
  // Activate global workstation keyboard shortcuts
  useKeyboardShortcuts();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { 
    isComparisonModalOpen, 
    setIsComparisonModalOpen, 
    isExecutiveModalOpen, 
    setIsExecutiveModalOpen,
    isReportModalOpen,
    setIsReportModalOpen
  } = useApp();

  return (
    <div className="min-h-screen flex bg-obsidian-950 text-zinc-100 selection:bg-manganese-500/30 selection:text-manganese-200">
      
      {/* 1. Collapsible Categorized Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* 2. Main Application Flow Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Command Platform Header */}
        <AppHeader onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />

        {/* Viewport Outlet */}
        <main className="flex-1 w-full relative">
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
