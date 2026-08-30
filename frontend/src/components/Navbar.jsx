import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { OFFICIAL_MOIL_MINES } from '../services/mineRegistry.js';
import { 
  Building2, 
  MapPin, 
  Layers, 
  Globe2, 
  HelpCircle, 
  RotateCcw, 
  FlaskConical, 
  ChevronDown, 
  Check, 
  Activity, 
  ChevronRight,
  ShieldCheck,
  Compass,
  SlidersHorizontal,
  FileText,
  Sparkles,
  Radio,
  BarChart3,
  Cpu,
  ShieldAlert,
  Terminal,
  Clock
} from 'lucide-react';

export const Navbar = () => {
  const { 
    lang, 
    setLang, 
    activeMine, 
    selectedMineId,
    setSelectedMineId,
    activeScenario, 
    runScenario, 
    resetBaseline, 
    setIsCommandDrawerOpen, 
    setIsSupportModalOpen,
    setIsComparisonModalOpen,
    setIsExecutiveModalOpen,
    setIsReportModalOpen,
    apiConnected,
    t
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();
  const [isMineDropdownOpen, setIsMineDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [siteTime, setSiteTime] = useState('10:33:00 IST');
  const mineDropdownRef = useRef(null);
  const langDropdownRef = useRef(null);

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Kolkata'
      });
      setSiteTime(`${timeStr} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mineDropdownRef.current && !mineDropdownRef.current.contains(e.target)) {
        setIsMineDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isMaharashtra = activeMine?.state?.toLowerCase().includes('maharashtra');
  const languages = isMaharashtra
    ? [
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'हिन्दी' },
        { code: 'mr', label: 'मराठी' }
      ]
    : [
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'हिन्दी' }
      ];

  // Subtle Warm Identity Accent Colors per Mine
  const mineAccentColors = {
    'balaghat': '#d97706',      // Copper / Deep Manganese Brown
    'tirodi': '#ca8a04',        // Warm Ochre
    'ukwa': '#15803d',          // Forest Green + Gold
    'munsar': '#c2410c',        // Earthy Rust
    'kandri': '#a16207',        // Sandstone
    'gumgaon': '#0f766e',       // Muted Teal + Copper
    'chikla': '#e11d48',        // Warm Terracotta
    'dongri-buzurg': '#f59e0b', // Mineral Amber
    'ramtek': '#65a30d',        // Warm Olive
    'bhandara': '#78716c'       // Muted Bronze
  };

  const currentAccent = mineAccentColors[activeMine.id] || '#d97706';

  // Grouped Navigation Structure
  const navSections = [
    {
      label: lang === 'hi' ? 'कमांड' : lang === 'mr' ? 'कमांड' : 'COMMAND',
      items: [
        { name: t?.nav?.overview || 'OVERVIEW', path: '/' },
        { name: t?.nav?.commandCenter || 'COMMAND CENTER', path: '/command-center' }
      ]
    },
    {
      label: lang === 'hi' ? 'खुफिया तंत्र' : lang === 'mr' ? 'गुप्तवार्ता' : 'INTELLIGENCE',
      items: [
        { name: t?.nav?.reserveRadar || 'RESERVE RADAR', path: '/reserve-radar' },
        { name: t?.nav?.alertEngine || 'ALERT ENGINE', path: '/alert-engine' },
        { name: t?.nav?.analytics || 'ANALYTICS', path: '/analytics' },
        { name: t?.nav?.equipment || 'EQUIPMENT', path: '/equipment' }
      ]
    },
    {
      label: lang === 'hi' ? 'परिचालन' : lang === 'mr' ? 'ऑपरेशन्स' : 'OPERATIONS',
      items: [
        { name: t?.nav?.scenarioLab || 'SCENARIO LAB', path: '/scenario-lab' },
        { name: t?.nav?.protocol || 'PROTOCOL', path: '/protocol' }
      ]
    },
    {
      label: lang === 'hi' ? 'सिस्टम' : lang === 'mr' ? 'प्रणाली' : 'SYSTEM',
      items: [
        { name: t?.nav?.decisionLog || 'DECISION LOG', path: '/decision-log' }
      ]
    }
  ];

  return (
    <header className="w-full bg-obsidian-950 border-b border-obsidian-750 sticky top-0 z-50 select-none shadow-xl font-sans">
      
      {/* 1. TOP GLOBAL COMMAND HEADER */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-obsidian-800/80">
        
        {/* Left: Brand Identity & Active Mine Selector */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link to="/" className="flex items-center gap-3 group">
            
            {/* Manganese Hexagonal Crystal Mark */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-obsidian-800 via-obsidian-900 to-obsidian-950 border border-manganese-500/40 flex items-center justify-center shadow-lg group-hover:border-manganese-400 transition-colors">
              <svg viewBox="0 0 32 32" className="w-5 h-5">
                <defs>
                  <linearGradient id="moilMineralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                </defs>
                <polygon points="16,3 28,9 28,23 16,29 4,23 4,9" fill="none" stroke="url(#moilMineralGrad)" strokeWidth="1.8" />
                <polygon points="16,8 24,12 24,20 16,24 8,20 8,12" fill="url(#moilMineralGrad)" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="1" />
                <circle cx="16" cy="16" r="3" fill="#ffffff" />
              </svg>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white tracking-wider leading-none">
                  AETHER
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-manganese-500/15 text-manganese-300 border border-manganese-500/30 uppercase">
                  MOIL LIMITED
                </span>
              </div>
              <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest leading-none mt-1">
                {t?.subtitle || 'NATIONAL MANGANESE INTELLIGENCE'}
              </span>
            </div>
          </Link>

          {/* ACTIVE MINE SELECTOR DROPDOWN */}
          <div className="relative" ref={mineDropdownRef}>
            <button
              onClick={() => setIsMineDropdownOpen(!isMineDropdownOpen)}
              className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-750 hover:border-obsidian-700 text-white text-xs font-bold transition-all shadow-md group cursor-pointer"
              style={{ borderLeft: `3.5px solid ${currentAccent}` }}
            >
              <div className="flex flex-col text-left">
                <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-wider">
                  {t?.common?.active_mine || 'ACTIVE SECTOR MINE'}
                </span>
                <span className="font-bold text-xs text-zinc-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentAccent }} />
                  <span>{activeMine.name}</span>
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-transform ${isMineDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu of All 10 MOIL Mines */}
            {isMineDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-obsidian-900 border border-obsidian-700 shadow-2xl p-2 z-[100] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-obsidian-800 flex items-center justify-between">
                  <span>{lang === 'hi' ? '10 प्रामाणिक मॉयल खदानें' : lang === 'mr' ? '10 अधिकृत मॉयल खाणी' : '10 CANONICAL MOIL ASSETS'}</span>
                  <span className="text-manganese-400 font-mono text-[9px]">{lang === 'hi' ? 'मध्य क्षेत्र' : lang === 'mr' ? 'मध्य पट्टा' : 'CENTRAL BELT'}</span>
                </div>

                <div className="mt-1 space-y-1 max-h-80 overflow-y-auto pr-1 no-scrollbar">
                  {OFFICIAL_MOIL_MINES.map((m) => {
                    const isSelected = m.id === activeMine.id;
                    const accent = mineAccentColors[m.id] || '#d97706';

                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedMineId(m.id);
                          setIsMineDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-obsidian-800 text-white font-bold border border-manganese-500/40 shadow-sm'
                            : 'text-zinc-300 hover:bg-obsidian-850 hover:text-white'
                        }`}
                        style={{ borderLeft: isSelected ? `3px solid ${accent}` : '3px solid transparent' }}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                            <strong className="text-zinc-100">{m.name}</strong>
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono mt-0.5 ml-3.5">
                            {m.district}, {m.state} • {m.mineType}
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 text-manganese-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Active Mine Geographic Metadata Pill */}
          <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-obsidian-900/80 border border-obsidian-800 font-mono text-xs text-zinc-300">
            <div>
              <span className="text-zinc-500 text-[8px] block uppercase">{lang === 'hi' ? 'स्थान' : lang === 'mr' ? 'स्थान' : 'LOCATION'}</span>
              <strong className="text-zinc-200 text-[11px]">{activeMine.district}, {activeMine.state}</strong>
            </div>
            <div className="w-[1px] h-5 bg-obsidian-750" />
            <div>
              <span className="text-zinc-500 text-[8px] block uppercase">{lang === 'hi' ? 'निर्देशांक' : lang === 'mr' ? 'अक्षांश-रेखांश' : 'COORDINATES'}</span>
              <strong className="text-zinc-300 text-[10px]">{activeMine.coordinatesDMS}</strong>
            </div>
            <div className="w-[1px] h-5 bg-obsidian-750" />
            <div>
              <span className="text-zinc-500 text-[8px] block uppercase">{lang === 'hi' ? 'स्थिति' : lang === 'mr' ? 'स्थिती' : 'STATUS'}</span>
              <span className="text-telemetry-400 font-bold text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-telemetry-400 animate-pulse" />
                <span>{t?.common?.optimal || 'OPTIMAL'}</span>
              </span>
            </div>
          </div>

        </div>

        {/* Right: Operational Scenarios + Language + Reports + Live Time */}
        <div className="flex items-center gap-2 font-mono text-xs">
          
          {/* Quick Scenario Triggers */}
          <div className="hidden xl:flex items-center gap-1.5">
            <button
              onClick={() => runScenario('MONSOON', 'HIGH', '24 HOURS')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeScenario?.scenarioId === 'MONSOON'
                  ? 'bg-hazard-600 text-white shadow-md'
                  : 'bg-obsidian-900 border border-obsidian-750 text-zinc-300 hover:border-hazard-500/40 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span>{lang === 'hi' ? 'भारी मानसून' : lang === 'mr' ? 'मुसळधार मान्सून' : 'Monsoon Shock'}</span>
            </button>

            <button
              onClick={() => runScenario('CRUSHER', 'HIGH', '24 HOURS')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeScenario?.scenarioId === 'CRUSHER'
                  ? 'bg-hazard-600 text-white shadow-md'
                  : 'bg-obsidian-900 border border-obsidian-750 text-zinc-300 hover:border-hazard-500/40 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-rose-400" />
              <span>{lang === 'hi' ? 'क्रशर जाम' : lang === 'mr' ? 'क्रशर बिघाड' : 'Crusher Seizure'}</span>
            </button>

            <button
              onClick={() => runScenario('MULTI_RISK', 'HIGH', '24 HOURS')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeScenario?.scenarioId === 'MULTI_RISK'
                  ? 'bg-hazard-600 text-white shadow-md'
                  : 'bg-obsidian-900 border border-obsidian-750 text-zinc-300 hover:border-hazard-500/40 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'hi' ? 'बहु-जोखिम' : lang === 'mr' ? 'मल्टी-रिस्क' : 'Multi-Risk'}</span>
            </button>

            {activeScenario && (
              <button
                onClick={resetBaseline}
                className="px-2.5 py-1.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-750 text-zinc-300 hover:text-white text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                title="Reset to Normal Baseline Operations"
              >
                <RotateCcw className="w-3 h-3 text-emerald-400" />
                <span>{lang === 'hi' ? 'रीसेट' : lang === 'mr' ? 'रीसेट' : 'Reset'}</span>
              </button>
            )}
          </div>

          {/* Multilingual Selector */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-750 text-zinc-200 text-xs font-bold transition-all cursor-pointer"
            >
              <Globe2 className="w-3.5 h-3.5 text-manganese-400" />
              <span className="uppercase">{lang}</span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-xl bg-obsidian-900 border border-obsidian-700 shadow-2xl p-1 z-[100] backdrop-blur-xl">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                      lang === l.code
                        ? 'bg-manganese-500/20 text-manganese-300 font-bold'
                        : 'text-zinc-300 hover:bg-obsidian-800 hover:text-white'
                    }`}
                  >
                    <span>{l.label}</span>
                    {lang === l.code && <Check className="w-3.5 h-3.5 text-manganese-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PDF/PPTX Export Reports Trigger */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-manganese-600 hover:bg-manganese-500 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'रिपोर्ट' : lang === 'mr' ? 'अहवाल' : 'Reports'}</span>
          </button>

          {/* Live System Time */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-900 border border-obsidian-800 text-zinc-400 text-[11px] font-mono">
            <Clock className="w-3 h-3 text-zinc-500" />
            <span>{siteTime}</span>
          </div>

        </div>

      </div>

      {/* 2. LOWER LOGICALLY GROUPED NAVIGATION BAR */}
      <nav className="w-full px-4 sm:px-6 lg:px-8 bg-obsidian-900/90 border-b border-obsidian-800/80 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-6 sm:gap-8 py-1.5">
          {navSections.map((sec, secIdx) => (
            <div key={sec.label} className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest mr-1.5 hidden md:inline">
                {sec.label}:
              </span>

              <div className="flex items-center gap-1">
                {sec.items.map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150 flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-obsidian-800 text-manganese-400 border border-manganese-500/40 shadow-sm font-bold'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-obsidian-850'
                      }`}
                    >
                      {item.path === '/' && <Layers className="w-3.5 h-3.5 text-zinc-400" />}
                      {item.path === '/command-center' && <Radio className="w-3.5 h-3.5 text-zinc-400" />}
                      {item.path === '/reserve-radar' && <Compass className="w-3.5 h-3.5 text-zinc-400" />}
                      {item.path === '/alert-engine' && <Activity className="w-3.5 h-3.5 text-zinc-400" />}
                      {item.path === '/analytics' && <BarChart3 className="w-3.5 h-3.5 text-zinc-400" />}
                      {item.path === '/equipment' && <Cpu className="w-3.5 h-3.5 text-zinc-400" />}
                      {item.path === '/scenario-lab' && <FlaskConical className="w-3.5 h-3.5 text-zinc-400" />}
                      {item.path === '/protocol' && <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />}
                      {item.path === '/decision-log' && <Terminal className="w-3.5 h-3.5 text-zinc-400" />}
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              {secIdx < navSections.length - 1 && (
                <div className="w-[1px] h-4 bg-obsidian-800 mx-2 hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </nav>

    </header>
  );
};
