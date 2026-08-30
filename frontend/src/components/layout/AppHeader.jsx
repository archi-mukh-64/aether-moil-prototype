import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { OFFICIAL_MOIL_MINES } from '../../services/mineRegistry.js';
import { 
  Building2, 
  MapPin, 
  Globe2, 
  ChevronDown, 
  Check, 
  Menu, 
  Clock, 
  Activity, 
  ShieldAlert, 
  RotateCcw,
  Sparkles,
  Layers,
  FileText,
  SlidersHorizontal,
  Flame,
  Radio
} from 'lucide-react';
import { AetherStatusBadge } from '../design-system/AetherStatusBadge.jsx';

/**
 * AETHER Industrial Command Bar (AppHeader)
 * Precision topbar with active mine selector, trilingual language switcher,
 * live scenario context, real-time clock, and quick executive actions.
 */
export const AppHeader = ({ onMobileMenuToggle }) => {
  const { 
    lang, 
    setLang, 
    activeMine, 
    setSelectedMineId, 
    activeScenario, 
    runScenario, 
    resetBaseline, 
    apiConnected, 
    t,
    setIsComparisonModalOpen,
    setIsCommandDrawerOpen,
    setIsReportModalOpen
  } = useApp();

  const [isMineDropdownOpen, setIsMineDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [siteTime, setSiteTime] = useState('11:32:00 IST');
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
        { code: 'en', label: 'English', short: 'EN' },
        { code: 'hi', label: 'हिन्दी', short: 'HI' },
        { code: 'mr', label: 'मराठी', short: 'MR' }
      ]
    : [
        { code: 'en', label: 'English', short: 'EN' },
        { code: 'hi', label: 'हिन्दी', short: 'HI' }
      ];

  const currentLangObj = languages.find(l => l.code === lang) || languages[0];

  return (
    <header className="w-full bg-[#FFFFFF] border-b border-[#E2E8F0] sticky top-0 z-40 select-none shadow-xs font-sans">
      <div className="w-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        
        {/* LEFT SECTION: Mobile Toggle & Active Mine Asset Switcher */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#172033]"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Active Mine Selector Dropdown */}
          <div className="relative" ref={mineDropdownRef}>
            <button
              onClick={() => setIsMineDropdownOpen(!isMineDropdownOpen)}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-left transition-all duration-150 shadow-xs group"
            >
              <div className="p-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-600">
                <MapPin className="w-3.5 h-3.5" />
              </div>

              <div className="flex flex-col">
                <span className="text-[9px] font-mono font-bold text-[#94A3B8] uppercase leading-none">
                  ACTIVE MOIL ASSET
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs sm:text-sm font-bold text-[#172033] font-display truncate max-w-[140px] sm:max-w-[200px]">
                    {activeMine?.name || 'Balaghat Mine'}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-[#64748B]">
                    ({activeMine?.state?.includes('Madhya') ? 'MP' : 'MH'})
                  </span>
                </div>
              </div>

              <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ml-1 ${isMineDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Mine Dropdown Menu */}
            {isMineDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-80 bg-white border border-[#CBD5E1] rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B] border-b border-[#F1F5F9] flex justify-between items-center">
                  <span>SELECT FROM 10 CANONICAL ASSETS</span>
                  <span className="text-amber-600 font-bold">MOIL PSU</span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1 py-1">
                  {OFFICIAL_MOIL_MINES.map((mine) => {
                    const isSelected = (mine.id === activeMine.id);
                    return (
                      <button
                        key={mine.id}
                        onClick={() => {
                          setSelectedMineId(mine.id);
                          setIsMineDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                          isSelected 
                            ? 'bg-amber-50 border border-amber-300 text-[#172033]' 
                            : 'hover:bg-slate-50 text-[#334155]'
                        }`}
                      >
                        <div className="space-y-0.5 truncate">
                          <div className="font-bold text-xs flex items-center gap-1.5 truncate">
                            <span>{mine.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                          </div>
                          <div className="text-[10px] font-mono text-[#64748B]">
                            {mine.district}, {mine.state} • <strong className="text-amber-700">{mine.baseGradeNum}% Mn</strong>
                          </div>
                        </div>

                        <AetherStatusBadge status={mine.status} size="sm" pulse={false} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CENTER SECTION: Active Stress Scenario Pill */}
        <div className="hidden md:flex items-center gap-2">
          {activeScenario && activeScenario.scenarioId !== 'BASELINE' ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5 text-red-600" />
              <span>STRESS SCENARIO: {activeScenario.name || activeScenario.scenarioId}</span>
              <button
                onClick={resetBaseline}
                className="ml-1 p-0.5 rounded hover:bg-red-200 text-red-800 transition-colors"
                title="Reset to Normal Baseline"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>BASELINE NOMINAL OPERATIONS</span>
            </div>
          )}
        </div>

        {/* RIGHT SECTION: Language, Real-time Clock & Action Hub */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Actions (Comparison & Scenario) */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => setIsComparisonModalOpen(true)}
              className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#334155] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              title="Compare MOIL Mines Matrix"
            >
              <Layers className="w-3.5 h-3.5 text-[#0891B2]" />
              <span className="hidden xl:inline">Compare Mines</span>
            </button>

            <button
              onClick={() => setIsCommandDrawerOpen(true)}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              title="Inject Scenario Shock"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden xl:inline">Scenario Lab</span>
            </button>
          </div>

          {/* Trilingual Language Selector */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-mono font-bold text-[#172033] shadow-xs"
            >
              <Globe2 className="w-3.5 h-3.5 text-[#0891B2]" />
              <span>{currentLangObj.short}</span>
              <ChevronDown className="w-3 h-3 text-[#64748B]" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-32 bg-white border border-[#CBD5E1] rounded-xl shadow-lg z-50 p-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                      lang === l.code ? 'bg-amber-50 text-amber-900 font-bold' : 'text-[#334155] hover:bg-slate-50'
                    }`}
                  >
                    <span>{l.label}</span>
                    {lang === l.code && <Check className="w-3 h-3 text-amber-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Real-time IST Clock Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#475569] shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#64748B]" />
            <span>{siteTime}</span>
          </div>

        </div>

      </div>
    </header>
  );
};
