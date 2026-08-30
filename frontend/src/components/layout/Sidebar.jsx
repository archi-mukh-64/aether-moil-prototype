import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
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
  FileText
} from 'lucide-react';

export const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const { lang, t, setIsReportModalOpen } = useApp();

  // Collapsible category accordions state (default open)
  const [openSections, setOpenSections] = useState({
    COMMAND: true,
    INTELLIGENCE: true,
    FLEET: true,
    OPERATIONS: true,
    SYSTEM: true
  });

  const toggleSection = (sec) => {
    setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const navCategories = [
    {
      id: 'COMMAND',
      label: lang === 'hi' ? 'कमांड' : lang === 'mr' ? 'कमांड' : 'COMMAND',
      zoneColor: '#FFB000', // Amber
      items: [
        { name: t?.nav?.overview || 'National Overview', path: '/', icon: Layers, exact: true, iconColor: '#FFB000' },
        { name: t?.nav?.commandCenter || 'Command Center', path: '/command-center', icon: Radio, iconColor: '#FFB000' }
      ]
    },
    {
      id: 'INTELLIGENCE',
      label: lang === 'hi' ? 'खुफिया तंत्र' : lang === 'mr' ? 'गुप्तवार्ता' : 'INTELLIGENCE',
      zoneColor: '#21D4C5', // Cyan
      items: [
        { name: t?.nav?.reserveRadar || 'Reserve Radar', path: '/reserve-radar', icon: Compass, iconColor: '#21D4C5' },
        { name: t?.nav?.alertEngine || 'Alert Engine', path: '/alert-engine', icon: Activity, iconColor: '#FF5A67' },
        { name: t?.nav?.analytics || 'Analytics', path: '/analytics', icon: BarChart3, iconColor: '#8B7CFF' }
      ]
    },
    {
      id: 'FLEET',
      label: lang === 'hi' ? 'फ्लीट एवं स्काडा' : lang === 'mr' ? 'फ्लीट व स्काडा' : 'FLEET & SCADA',
      zoneColor: '#22C55E', // Green
      items: [
        { name: t?.nav?.equipment || 'Equipment Intelligence', path: '/equipment', icon: Cpu, iconColor: '#22C55E' }
      ]
    },
    {
      id: 'OPERATIONS',
      label: lang === 'hi' ? 'परिचालन' : lang === 'mr' ? 'ऑपरेशन्स' : 'OPERATIONS',
      zoneColor: '#FFB020', // Orange / Amber
      items: [
        { name: t?.nav?.scenarioLab || 'Scenario Lab', path: '/scenario-lab', icon: FlaskConical, iconColor: '#FFB020' },
        { name: t?.nav?.protocol || 'Protocols', path: '/protocol', icon: ShieldCheck, iconColor: '#22C55E' }
      ]
    },
    {
      id: 'SYSTEM',
      label: lang === 'hi' ? 'प्रणाली' : lang === 'mr' ? 'प्रणाली' : 'SYSTEM',
      zoneColor: '#8B7CFF', // Violet
      items: [
        { name: t?.nav?.decisionLog || 'Decision Log', path: '/decision-log', icon: Terminal, iconColor: '#8B7CFF' }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-[#0B0F14]/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-[#10151C] border-r border-[#222D3A] z-50 flex flex-col justify-between transition-all duration-300 select-none shadow-2xl ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Brand Banner */}
        <div className="p-3.5 border-b border-[#222D3A] flex items-center justify-between gap-2">
          {!isCollapsed && (
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-[#151B23] border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:border-amber-400 transition-colors shadow">
                <svg viewBox="0 0 32 32" className="w-4 h-4">
                  <polygon points="16,3 28,9 28,23 16,29 4,23 4,9" fill="none" stroke="#FFB000" strokeWidth="2" />
                  <circle cx="16" cy="16" r="3" fill="#FFB000" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-white tracking-wider font-sans leading-none">
                  AETHER
                </span>
                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest mt-1">
                  MOIL INTELLIGENCE
                </span>
              </div>
            </Link>
          )}

          {isCollapsed && (
            <Link to="/" className="mx-auto w-8 h-8 rounded-xl bg-[#151B23] border border-amber-500/40 flex items-center justify-center text-amber-400">
              <svg viewBox="0 0 32 32" className="w-4 h-4">
                <polygon points="16,3 28,9 28,23 16,29 4,23 4,9" fill="none" stroke="#FFB000" strokeWidth="2" />
                <circle cx="16" cy="16" r="3" fill="#FFB000" />
              </svg>
            </Link>
          )}

          {/* Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg bg-[#151B23] hover:bg-[#1A232E] text-slate-400 hover:text-white border border-[#222D3A] transition-colors cursor-pointer hidden lg:flex items-center justify-center"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Middle Navigation Links Accordion */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3.5 space-y-4 no-scrollbar font-sans">
          {navCategories.map((cat) => {
            const isOpen = openSections[cat.id] !== false;

            return (
              <div key={cat.id} className="space-y-1">
                {/* Category Header */}
                {!isCollapsed && (
                  <button
                    onClick={() => toggleSection(cat.id)}
                    className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.zoneColor }} />
                      <span>{cat.label}</span>
                    </span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                  </button>
                )}

                {/* Submodule Items */}
                {(isOpen || isCollapsed) && (
                  <div className="space-y-0.5">
                    {cat.items.map((item) => {
                      const isActive = item.exact 
                        ? location.pathname === item.path 
                        : (location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)));
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMobileOpen(false)}
                          title={isCollapsed ? item.name : undefined}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 relative group ${
                            isActive
                              ? 'bg-[#1A232E] text-white font-bold border shadow-sm'
                              : 'text-slate-400 hover:text-white hover:bg-[#151B23] border border-transparent'
                          }`}
                          style={{
                            borderColor: isActive ? `${cat.zoneColor}50` : 'transparent'
                          }}
                        >
                          <Icon 
                            className="w-4 h-4 flex-shrink-0 transition-colors" 
                            style={{ 
                              color: isActive ? cat.zoneColor : item.iconColor 
                            }} 
                          />

                          {!isCollapsed && (
                            <span className="truncate tracking-wide">
                              {item.name}
                            </span>
                          )}

                          {/* Active Indicator Pip */}
                          {isActive && (
                            <span 
                              className="absolute right-2.5 w-1.5 h-1.5 rounded-full shadow-sm" 
                              style={{ 
                                backgroundColor: cat.zoneColor,
                                boxShadow: `0 0 8px ${cat.zoneColor}`
                              }} 
                            />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Quick Tools */}
        <div className="p-3 border-t border-[#222D3A] space-y-2">
          <Link
            to="/reports"
            onClick={() => setIsMobileOpen(false)}
            className={`w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#0B0F14] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-glow-amber transition-all cursor-pointer ${
              isCollapsed ? 'px-2' : 'px-3'
            }`}
            title="Executive PDF/PPTX Reports Hub"
          >
            <FileText className="w-4 h-4" />
            {!isCollapsed && <span>{lang === 'hi' ? 'कार्यकारी रिपोर्ट' : lang === 'mr' ? 'कार्यकारी अहवाल' : 'Reports Hub'}</span>}
          </Link>
        </div>
      </aside>
    </>
  );
};
