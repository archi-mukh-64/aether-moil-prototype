import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';
import { AetherLogo } from '../design-system/AetherLogo.jsx';
import {
  Layers,
  Radio,
  Compass,
  Cpu,
  FlaskConical,
  ShieldCheck,
  Terminal,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Globe2,
  FileText,
  LineChart,
  ShieldAlert,
  Server,
  Database,
  X
} from 'lucide-react';

/**
 * AETHER Responsive Mineral Rail Sidebar
 * Digital Mine / Geological Command aesthetic tailored for MOIL national operations.
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
      title: 'NATIONAL',
      accent: '#C46A32', // Oxidized Copper
      items: [
        { name: t?.nav?.overview || 'Overview', path: '/', icon: Layers, exact: true, accent: '#C46A32' }
      ]
    },
    {
      id: 'OPERATIONS',
      title: 'OPERATIONS',
      accent: '#71856B', // Mineral Sage
      items: [
        { name: t?.nav?.commandCenter || 'Command Center', path: '/command-center', icon: Radio, accent: '#71856B' },
        { name: t?.nav?.equipment || 'Fleet & Equipment', path: '/equipment', icon: Cpu, accent: '#71856B' },
        { name: t?.nav?.alertEngine || 'Alert Engine', path: '/alert-engine', icon: ShieldAlert, accent: '#C84B3F' }
      ]
    },
    {
      id: 'INTELLIGENCE',
      title: 'INTELLIGENCE',
      accent: '#B88A3B', // Mineral Ochre
      items: [
        { name: t?.nav?.reserveRadar || 'Reserve Radar', path: '/reserve-radar', icon: Compass, accent: '#B88A3B' },
        { name: t?.nav?.analytics || 'Analytics', path: '/analytics', icon: LineChart, accent: '#655C9F' },
        { name: 'Earth Observation', path: '/reserve-radar', icon: Globe2, accent: '#3D8C8A' }
      ]
    },
    {
      id: 'SIMULATION',
      title: 'SIMULATION',
      accent: '#B76543', // Terracotta
      items: [
        { name: t?.nav?.scenarioLab || 'Scenario Lab', path: '/scenario-lab', icon: FlaskConical, accent: '#B76543' }
      ]
    },
    {
      id: 'GOVERNANCE',
      title: 'GOVERNANCE',
      accent: '#7D4545', // Burgundy
      items: [
        { name: t?.nav?.protocol || 'Protocols', path: '/protocol', icon: ShieldCheck, accent: '#7D4545' },
        { name: t?.nav?.decisionLog || 'Decision Log', path: '/decision-log', icon: Terminal, accent: '#7D4545' }
      ]
    },
    {
      id: 'REPORTING',
      title: 'REPORTING',
      accent: '#C46A32', // Copper
      items: [
        { name: t?.nav?.reports || 'Reports', path: '/reports', icon: FileText, accent: '#C46A32' }
      ]
    },
    {
      id: 'SYSTEM',
      title: 'SYSTEM',
      accent: '#85877E', // Mineral Muted
      items: [
        {
          name: 'Data Status & GEE',
          action: () => setSourcesModalOpen(true),
          icon: Database,
          accent: '#3D8C8A'
        },
        {
          name: 'API Status & Health',
          action: () => setAboutModalOpen(true),
          icon: Server,
          accent: '#71856B'
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
          className="fixed inset-0 bg-[#202522]/80 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 bg-[#202522] border-r border-[#2E3731] shadow-2xl flex flex-col justify-between transition-all duration-300 select-none ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* 1. Header / Brand Mark */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#2E3731] bg-[#202522]">
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
            className="hidden lg:flex p-1.5 rounded-lg text-[#85877E] hover:text-[#F0EBE2] hover:bg-[#29302B] transition-colors cursor-pointer"
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
            className="lg:hidden p-1.5 rounded-lg text-[#85877E] hover:text-[#F0EBE2] hover:bg-[#29302B]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Categorized Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-thin">
          {navSections.map((sec) => (
            <div key={sec.id} className="space-y-1">
              {/* Section Header */}
              {!isCollapsed && (
                <div className="px-3 pb-1 text-[10px] font-mono font-bold tracking-widest text-[#85877E] uppercase">
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
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold font-sans transition-all duration-150 relative cursor-pointer text-[#A6A89F] hover:bg-[#29302B] hover:text-[#F0EBE2] ${
                          isCollapsed ? 'justify-center' : 'justify-start'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" style={{ color: item.accent }} />
                        {!isCollapsed && <span>{item.name}</span>}

                        {/* Collapsed Tooltip */}
                        {isCollapsed && hoveredItem === item.name && (
                          <div className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-[#292E2A] border border-[#3A423C] text-[#F0EBE2] text-xs font-mono whitespace-nowrap shadow-2xl z-50 pointer-events-none">
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
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-150 relative ${
                        active
                          ? 'bg-[#29302B] text-[#F0EBE2] shadow-sm'
                          : 'text-[#A6A89F] hover:bg-[#29302B]/60 hover:text-[#F0EBE2]'
                      } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                    >
                      {/* Active Indicator Left Rail */}
                      {active && (
                        <div
                          style={{ backgroundColor: item.accent }}
                          className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full shadow-xs"
                        />
                      )}

                      <Icon
                        className="w-4 h-4 shrink-0 transition-colors"
                        style={{ color: active ? item.accent : '#85877E' }}
                      />

                      {!isCollapsed && <span>{item.name}</span>}

                      {/* Collapsed Tooltip */}
                      {isCollapsed && hoveredItem === item.name && (
                        <div className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-[#292E2A] border border-[#3A423C] text-[#F0EBE2] text-xs font-mono whitespace-nowrap shadow-2xl z-50 pointer-events-none">
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
        <div className="p-3 border-t border-[#2E3731] bg-[#1C211E]">
          {!isCollapsed ? (
            <div className="p-2.5 rounded-xl bg-[#202522] border border-[#2E3731] space-y-2 text-[11px] font-mono">
              <div className="flex items-center justify-between text-[#A6A89F]">
                <span className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-[#85877E]" />
                  System Status
                </span>
                <span className="flex items-center gap-1 text-[#71856B] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#71856B] animate-pulse" />
                  {apiConnected ? 'API LIVE' : 'DEMO MODE'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#85877E] pt-1.5 border-t border-[#2E3731]">
                <span>AETHER v1.0</span>
                <span className="text-[#C46A32] font-bold">MOIL Limited</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-3 h-3 rounded-full bg-[#71856B] shadow-sm" title="System Operational" />
            </div>
          )}
        </div>
      </aside>

      {/* About AETHER Modal */}
      <AnimatePresence>
        {aboutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202522]/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#F0EBE2] border border-[#C8BFAF] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-[#272A27]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#C8BFAF]">
                <AetherLogo size="sm" showText={true} />
                <button
                  onClick={() => setAboutModalOpen(false)}
                  className="p-1 rounded-lg text-[#5F625C] hover:text-[#272A27] hover:bg-[#DDD4C5] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-[#272A27] leading-relaxed">
                <p>
                  <strong>AETHER (Advanced Earth-observation Telemetry &amp; Holistic Extraction Radar)</strong> is a national-scale digital mining intelligence platform engineered for MOIL Limited.
                </p>
                <p>
                  Unifies 10-mine SCADA telemetry, Sentinel-2 SWIR mineral spectroscopy, TreeSHAP predictive diagnostics, and DGMS statutory safety audit ledgers.
                </p>
                <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] font-mono text-[11px] space-y-1">
                  <div><strong>Architecture:</strong> React + Vite + Tailwind + FastAPI + Scikit-Learn</div>
                  <div><strong>Mines:</strong> 10 Operating Leases (Madhya Pradesh &amp; Maharashtra)</div>
                  <div><strong>Compliance:</strong> DGMS Statutory Audit Log &amp; UNFC 2009 Standards</div>
                </div>
              </div>

              <button
                onClick={() => setAboutModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#292E2A] hover:bg-[#202522] text-[#F0EBE2] font-bold text-xs uppercase tracking-wider cursor-pointer"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202522]/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#F0EBE2] border border-[#C8BFAF] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-[#272A27]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#C8BFAF]">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#3D8C8A]" />
                  <h3 className="font-bold text-base text-[#272A27] font-display">Data Architecture &amp; GEE Satellite Feeds</h3>
                </div>
                <button
                  onClick={() => setSourcesModalOpen(false)}
                  className="p-1 rounded-lg text-[#5F625C] hover:text-[#272A27] hover:bg-[#DDD4C5] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-[#272A27] leading-relaxed">
                <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] space-y-2 font-mono text-[11px]">
                  <div><strong className="text-[#3D8C8A]">1. Sentinel-2 MSI Level-2A:</strong> 10m Multi-spectral bands (B11/B12 SWIR for Braunite / Pyrolusite alteration detection).</div>
                  <div><strong className="text-[#71856B]">2. SCADA Telemetry Stream:</strong> Real-time vibration FFT, sump level, motor thermal sensors.</div>
                  <div><strong className="text-[#B88A3B]">3. UNFC Block Models:</strong> Geostatistical kriging and 3D wireframe reserve classifications.</div>
                  <div><strong className="text-[#C46A32]">4. OpenStreetMap Architecture:</strong> Zero-key, high-res topographic baseline maps.</div>
                </div>
              </div>

              <button
                onClick={() => setSourcesModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#292E2A] hover:bg-[#202522] text-[#F0EBE2] font-bold text-xs uppercase tracking-wider cursor-pointer"
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
