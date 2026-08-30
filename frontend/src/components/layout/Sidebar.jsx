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
  const { lang, t, setIsReportModalOpen } = useApp();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [sourcesModalOpen, setSourcesModalOpen] = useState(false);

  // Grouped Navigation Schema strictly adhering to prompt specification
  const navSections = [
    {
      id: 'NATIONAL',
      title: 'NATIONAL INTELLIGENCE',
      accent: '#F59E0B', // Amber
      items: [
        { name: t?.nav?.overview || 'Overview', path: '/', icon: Layers, exact: true, accent: '#F59E0B' },
        { name: t?.nav?.commandCenter || 'Mine Command Center', path: '/command-center', icon: Radio, accent: '#0284C7' }
      ]
    },
    {
      id: 'INTELLIGENCE',
      title: 'INTELLIGENCE',
      accent: '#0891B2', // Cyan
      items: [
        { name: t?.nav?.alertEngine || 'Risk & Threats', path: '/alert-engine', icon: ShieldAlert, accent: '#DC2626' },
        { name: t?.nav?.analytics || 'Predictive Analytics', path: '/analytics', icon: LineChart, accent: '#6366F1' },
        { name: t?.nav?.reserveRadar || 'Reserve Intelligence', path: '/reserve-radar', icon: Compass, accent: '#0D9488' },
        { name: t?.nav?.equipment || 'Fleet Intelligence', path: '/equipment', icon: Cpu, accent: '#EA580C' }
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
        { name: t?.nav?.protocol || 'Statutory Protocols', path: '/protocol', icon: ShieldCheck, accent: '#10B981' },
        { name: t?.nav?.decisionLog || 'Decision & Audit Log', path: '/decision-log', icon: Terminal, accent: '#4F46E5' },
        { name: t?.nav?.reports || 'Reports & Handover', path: '/reports', icon: FileText, accent: '#2563EB' }
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

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-[#FFFFFF] border-r border-[#E2E8F0] z-50 flex flex-col justify-between transition-all duration-300 select-none shadow-sm ${
          isCollapsed ? 'w-18' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & Logo Area */}
        <div>
          <div className="h-16 px-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
            <Link 
              to="/" 
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-2 overflow-hidden"
            >
              <AetherLogo size={isCollapsed ? 'sm' : 'md'} showText={!isCollapsed} />
            </Link>

            {/* Collapse / Expand Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9] transition-colors"
              title={isCollapsed ? 'Expand Sidebar (Ctrl+B)' : 'Collapse Sidebar (Ctrl+B)'}
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items List */}
          <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-230px)] font-sans">
            {navSections.map((sec) => (
              <div key={sec.id} className="space-y-1">
                {/* Section Title Header */}
                {!isCollapsed && (
                  <div className="px-3 py-1 flex items-center justify-between text-[10px] font-mono font-bold tracking-wider text-[#94A3B8] uppercase">
                    <span>{sec.title}</span>
                  </div>
                )}

                {/* Section Items */}
                <div className="space-y-0.5">
                  {sec.items.map((item) => {
                    const active = isActiveRoute(item);
                    const Icon = item.icon;

                    const itemContent = (
                      <div
                        onMouseEnter={() => setHoveredItem(item.name)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                          active
                            ? 'bg-[#F0F4F8] text-[#172033] shadow-xs'
                            : 'text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC]'
                        } ${isCollapsed ? 'justify-center px-2' : ''}`}
                      >
                        {/* Active Accent Bar */}
                        {active && (
                          <motion.div
                            layoutId="activeNavIndicator"
                            style={{ backgroundColor: item.accent || sec.accent }}
                            className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full"
                          />
                        )}

                        {/* Icon */}
                        <Icon 
                          className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                            active ? 'text-[#172033]' : 'text-[#64748B] group-hover:text-[#172033]'
                          }`} 
                        />

                        {/* Label */}
                        {!isCollapsed && (
                          <span className="truncate">
                            {item.name}
                          </span>
                        )}

                        {/* Tooltip on Collapsed Mode */}
                        {isCollapsed && hoveredItem === item.name && (
                          <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#172033] text-white text-xs font-semibold whitespace-nowrap shadow-lg z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                            {item.name}
                          </div>
                        )}
                      </div>
                    );

                    if (item.action) {
                      return (
                        <button
                          key={item.name}
                          onClick={() => {
                            item.action();
                            setIsMobileOpen(false);
                          }}
                          className="w-full text-left cursor-pointer"
                        >
                          {itemContent}
                        </button>
                      );
                    }

                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        {itemContent}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom System Operational Status Box */}
        <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          {!isCollapsed ? (
            <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-2 text-[11px] font-mono">
              <div className="flex items-center justify-between text-[#16A34A] font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  SYSTEM OPERATIONAL
                </span>
                <span className="text-[10px] text-[#64748B]">v1.0</span>
              </div>

              <div className="space-y-1 text-[10px] text-[#64748B] pt-1 border-t border-[#F1F5F9]">
                <div className="flex items-center justify-between">
                  <span>API GATEWAY</span>
                  <strong className="text-emerald-700">ONLINE</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>DATABASE</span>
                  <strong className="text-emerald-700">ONLINE</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>ML ENGINE</span>
                  <strong className="text-emerald-700">ONLINE</strong>
                </div>
              </div>

              <div className="text-[9.5px] text-[#94A3B8] text-center pt-1 border-t border-[#F1F5F9]">
                MOIL Limited • SIH 2026
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700" title="System Operational">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
        </div>
      </aside>

      {/* About AETHER Modal */}
      {aboutModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#CBD5E1] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-[#172033]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <AetherLogo size="sm" />
              <button 
                onClick={() => setAboutModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#475569] leading-relaxed">
              <p>
                <strong>AETHER</strong> is an industrial-grade intelligence platform built for <strong>MOIL Limited</strong> (Manganese Ore India Limited, Ministry of Steel, Govt. of India).
              </p>
              <p>
                It fuses <strong>Sentinel-2 Level-2A remote sensing</strong>, <strong>Sausar Group manganese geology</strong>, <strong>SCADA telemetry</strong>, and <strong>TreeSHAP prescriptive AI</strong> for zero-deficit production management.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] font-mono text-[#64748B] space-y-1">
              <div>Release: <strong>AETHER Production v1.0</strong></div>
              <div>Stack: <strong>React 18 + Vite + FastAPI + Supabase</strong></div>
              <div>Geospatial: <strong>Zero-Key OpenStreetMap Architecture</strong></div>
            </div>

            <button
              onClick={() => setAboutModalOpen(false)}
              className="w-full py-2 bg-[#172033] hover:bg-[#1E293B] text-white rounded-xl text-xs font-bold font-mono transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* Data Sources Modal */}
      {sourcesModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#CBD5E1] rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-[#172033]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-600" />
                <h3 className="font-bold text-sm font-display">AETHER Verified Data Sources</h3>
              </div>
              <button 
                onClick={() => setSourcesModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-[#475569]">
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="font-bold text-[#172033]">1. Earth Observation Remote Sensing</div>
                <div className="text-[11px] text-[#64748B]">Copernicus Sentinel-2 MSI Level-2A &amp; Landsat 8/9 OLI spectral reflectance.</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="font-bold text-[#172033]">2. MOIL Official SCADA Telemetry</div>
                <div className="text-[11px] text-[#64748B]">Real-time vibration, shaft hoist speeds, sump discharge, and crusher metrics.</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="font-bold text-[#172033]">3. Sausar Group Geological Horizons</div>
                <div className="text-[11px] text-[#64748B]">Precambrian metamorphic stratigraphy, UNFC-111 reserve blocks, and core assays.</div>
              </div>
            </div>

            <button
              onClick={() => setSourcesModalOpen(false)}
              className="w-full py-2 bg-[#172033] hover:bg-[#1E293B] text-white rounded-xl text-xs font-bold font-mono transition-colors"
            >
              CONFIRM
            </button>
          </div>
        </div>
      )}
    </>
  );
};
