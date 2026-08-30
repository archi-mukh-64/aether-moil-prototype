import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';
import { AetherLogo } from '../design-system/AetherLogo.jsx';
import {
  Layers,
  Radio,
  Compass,
  Activity,
  BarChart3,
  Cpu,
  FlaskConical,
  ShieldCheck,
  Terminal,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Truck,
  Globe2,
  FileText,
  LineChart,
  ShieldAlert,
  Server,
  Database,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';

/**
 * AETHER Responsive Industrial Sidebar
 * Bloomberg / Command Center aesthetic tailored for national-level MOIL operations.
 */
export const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const { lang, t, apiConnected, setIsReportModalOpen } = useApp();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [sourcesModalOpen, setSourcesModalOpen] = useState(false);

  // Grouped Navigation Schema strictly adhering to Phase 7 specification
  const navSections = [
    {
      id: 'NATIONAL',
      title: 'NATIONAL INTELLIGENCE',
      accent: '#F59E0B', // Amber
      items: [
        { name: t?.nav?.overview || 'Overview', path: '/', icon: Layers, exact: true, accent: '#F59E0B' }
      ]
    },
    {
      id: 'OPERATIONS',
      title: 'OPERATIONS',
      accent: '#0284C7', // Steel Blue
      items: [
        { name: t?.nav?.commandCenter || 'Command Center', path: '/command-center', icon: Radio, accent: '#0284C7' },
        { name: t?.nav?.equipment || 'Equipment', path: '/equipment', icon: Cpu, accent: '#EA580C' },
        { name: t?.nav?.alertEngine || 'Alerts', path: '/alert-engine', icon: ShieldAlert, accent: '#DC2626' }
      ]
    },
    {
      id: 'INTELLIGENCE',
      title: 'INTELLIGENCE',
      accent: '#0891B2', // Cyan
      items: [
        { name: t?.nav?.reserveRadar || 'Reserve Radar', path: '/reserve-radar', icon: Compass, accent: '#0D9488' },
        { name: t?.nav?.analytics || 'Analytics', path: '/analytics', icon: LineChart, accent: '#6366F1' },
        { name: 'Exploration', path: '/reserve-radar', icon: Sparkles, accent: '#0D9488' },
        { name: 'Forecasting', path: '/analytics', icon: BarChart3, accent: '#6366F1' }
      ]
    },
    {
      id: 'SIMULATION',
      title: 'SIMULATION',
      accent: '#8B5CF6', // Purple
      items: [
        { name: t?.nav?.scenarioLab || 'Scenario Lab', path: '/scenario-lab', icon: FlaskConical, accent: '#8B5CF6' }
      ]
    },
    {
      id: 'COMPLIANCE',
      title: 'COMPLIANCE',
      accent: '#10B981', // Emerald
      items: [
        { name: t?.nav?.protocol || 'Protocols', path: '/protocol', icon: ShieldCheck, accent: '#10B981' },
        { name: t?.nav?.decisionLog || 'Decision Log', path: '/decision-log', icon: Terminal, accent: '#4F46E5' }
      ]
    },
    {
      id: 'REPORTING',
      title: 'REPORTING',
      accent: '#2563EB', // Blue
      items: [
        { name: t?.nav?.reports || 'Reports', path: '/reports', icon: FileText, accent: '#2563EB' }
      ]
    },
    {
      id: 'SYSTEM',
      title: 'SYSTEM',
      accent: '#64748B', // Slate
      items: [
        {
          name: 'Data Sources & GEE',
          action: () => setSourcesModalOpen(true),
          icon: Database,
          accent: '#0891B2'
        },
        {
          name: 'About AETHER',
          action: () => setAboutModalOpen(true),
          icon: Info,
          accent: '#F59E0B'
        }
      ]
    }
  ];

  const isActiveRoute = (item) => {
    if (!item.path) return false;
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 bg-white border-r border-[#CBD5E1] shadow-md flex flex-col justify-between transition-all duration-300 select-none ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* 1. Header / Brand Mark */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#CBD5E1] bg-white">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <AetherLogo size="sm" showText={true} />
            </div>
          ) : (
            <div className="mx-auto">
              <AetherLogo size="sm" showText={false} />
            </div>
          )}

          {/* Desktop Collapse / Expand Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Categorized Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
          {navSections.map((sec) => (
            <div key={sec.id} className="space-y-1">
              {/* Section Header */}
              {!isCollapsed && (
                <div className="px-3 pb-1 text-[10px] font-mono font-bold tracking-wider text-[#64748B] uppercase">
                  {sec.title}
                </div>
              )}

              {/* Navigation Items */}
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActiveRoute(item);

                  if (item.action) {
                    return (
                      <button
                        key={item.name}
                        onClick={item.action}
                        onMouseEnter={() => setHoveredItem(item.name)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold font-sans transition-all duration-150 relative cursor-pointer text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] ${
                          isCollapsed ? 'justify-center' : 'justify-start'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" style={{ color: item.accent }} />
                        {!isCollapsed && <span>{item.name}</span>}

                        {/* Collapsed Tooltip */}
                        {isCollapsed && hoveredItem === item.name && (
                          <div className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-[#0F172A] text-white text-xs font-mono whitespace-nowrap shadow-xl z-50 pointer-events-none">
                            {item.name}
                          </div>
                        )}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold font-sans transition-all duration-150 relative ${
                        active
                          ? 'bg-[#F1F5F9] text-[#0F172A] shadow-xs border border-[#CBD5E1]'
                          : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                      } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                    >
                      {/* Active Indicator Bar */}
                      {active && (
                        <div
                          style={{ backgroundColor: item.accent }}
                          className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full shadow-xs"
                        />
                      )}

                      <Icon
                        className="w-4 h-4 shrink-0 transition-colors"
                        style={{ color: active ? item.accent : '#64748B' }}
                      />

                      {!isCollapsed && <span>{item.name}</span>}

                      {/* Collapsed Tooltip */}
                      {isCollapsed && hoveredItem === item.name && (
                        <div className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-[#0F172A] text-white text-xs font-mono whitespace-nowrap shadow-xl z-50 pointer-events-none">
                          {item.name}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 3. System Operational Status Footer */}
        <div className="p-3 border-t border-[#CBD5E1] bg-[#F8FAFC]">
          {!isCollapsed ? (
            <div className="p-2.5 rounded-xl bg-white border border-[#CBD5E1] space-y-2 text-[11px] font-mono">
              <div className="flex items-center justify-between text-[#334155]">
                <span className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-slate-500" />
                  System Status
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {apiConnected ? 'API LIVE' : 'DEMO MODE'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#64748B] pt-1.5 border-t border-[#F1F5F9]">
                <span>AETHER v1.0</span>
                <span className="text-amber-700 font-bold">MOIL Limited</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" title="System Operational" />
            </div>
          )}
        </div>
      </aside>

      {/* About AETHER Modal */}
      <AnimatePresence>
        {aboutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#CBD5E1] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1]">
                <AetherLogo size="sm" showText={true} />
                <button
                  onClick={() => setAboutModalOpen(false)}
                  className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-[#334155] leading-relaxed">
                <p>
                  <strong>AETHER (Advanced Earth-observation Telemetry &amp; Holistic Extraction Radar)</strong> is an enterprise-grade AI mining intelligence platform engineered for MOIL Limited (Manganese Ore India Limited).
                </p>
                <p>
                  The platform unifies 10-mine SCADA telemetry, Sentinel-2 SWIR mineral spectroscopy, TreeSHAP predictive diagnostics, and DGMS statutory safety audit ledgers.
                </p>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] font-mono text-[11px] space-y-1">
                  <div><strong>Architecture:</strong> React + Vite + Tailwind + FastAPI + Scikit-Learn</div>
                  <div><strong>Mines:</strong> 10 Operating Leases (Madhya Pradesh &amp; Maharashtra)</div>
                  <div><strong>Compliance:</strong> DGMS Statutory Audit Log &amp; UNFC 2009 Standards</div>
                </div>
              </div>

              <button
                onClick={() => setAboutModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs uppercase tracking-wider"
              >
                Close Information Window
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Data Sources & GEE Modal */}
      <AnimatePresence>
        {sourcesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#CBD5E1] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1]">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-600" />
                  <h3 className="font-bold text-base text-[#0F172A] font-display">Data Architecture &amp; GEE Satellite Feeds</h3>
                </div>
                <button
                  onClick={() => setSourcesModalOpen(false)}
                  className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-[#334155] leading-relaxed">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-2 font-mono text-[11px]">
                  <div><strong className="text-cyan-800">1. Sentinel-2 MSI Level-2A:</strong> 10m Multi-spectral bands (B11/B12 SWIR for Braunite / Pyrolusite alteration detection).</div>
                  <div><strong className="text-emerald-800">2. SCADA Telemetry Stream:</strong> Real-time vibration FFT, sump level, motor thermal sensors.</div>
                  <div><strong className="text-amber-800">3. UNFC Block Models:</strong> Geostatistical kriging and 3D wireframe reserve classifications.</div>
                  <div><strong className="text-purple-800">4. OpenStreetMap Architecture:</strong> Zero-key, high-res topographic baseline maps.</div>
                </div>
              </div>

              <button
                onClick={() => setSourcesModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs uppercase tracking-wider"
              >
                Close Data Architecture
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
