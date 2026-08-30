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
 * High-contrast topbar with active mine selector, trilingual language switcher,
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
        { code: 'hi', label: 'à¤¹à¤¿à¤¨à¥à¤¦à¥€', short: 'HI' },
        { code: 'mr', label: 'à¤®à¤°à¤¾à¤ à¥€', short: 'MR' }
      ]
    : [
        { code: 'en', label: 'English', short: 'EN' },
        { code: 'hi', label: 'à¤¹à¤¿à¤¨à¥à¤¦à¥€', short: 'HI' }
      ];

  const currentLangObj = languages.find(l => l.code === lang) || languages[0];

  return (
    <header className="w-full bg-white border-b border-[#CBD5E1] sticky top-0 z-40 select-none shadow-xs font-sans">
      <div className="w-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">

        {/* LEFT SECTION: Mobile Toggle & Active Mine Asset Switcher */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0F172A]"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Active Mine Selector Dropdown */}
          <div className="relative" ref={mineDropdownRef}>
            <button
              onClick={() => setIsMineDropdownOpen(!isMineDropdownOpen)}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-left transition-all duration-150 shadow-xs group cursor-pointer"
            >
              <div className="p-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-700">
                <MapPin className="w-3.5 h-3.5" />
              </div>

              <div className="flex flex-col">
                <span className="text-[9px] font-mono font-bold text-[#64748B] uppercase leading-none">
                  ACTIVE MOIL ASSET
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs sm:text-sm font-black text-[#0F172A] font-display truncate max-w-[140px] sm:max-w-[200px]">
                    {activeMine?.name || 'Balaghat Mine'}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#475569]">
                    ({activeMine?.state?.includes('Madhya') ? 'MP' : 'MH'})
                  </span>
                </div>
              </div>

              <ChevronDown className={`w-3.5 h-3.5 text-[#475569] transition-transform duration-200 ml-1 ${isMineDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Mine Dropdown Menu */}
            {isMineDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-80 bg-white border border-[#CBD5E1] rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#475569] border-b border-[#E2E8F0] flex justify-between items-center">
                  <span>SELECT FROM 10 CANONICAL ASSETS</span>
                  <span className="text-amber-700 font-bold">MOIL PSU</span>
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
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 border border-amber-400 text-[#0F172A]'
                            : 'hover:bg-slate-50 text-[#1E293B]'
                        }`}
                      >
                        <div className="space-y-0.5 truncate">
                          <div className="font-bold text-xs flex items-center gap-1.5 truncate text-[#0F172A]">
                            <span>{mine.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 font-bold" />}
                          </div>
                          <div className="text-[10px] font-mono text-[#475569]">
                            {mine.district}, {mine.state} â€¢ <strong className="text-amber-800">{mine.baseGradeNum}% Mn</strong>
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
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 border border-red-300 text-red-800 text-xs font-mono font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5 text-red-700" />
              <span>STRESS SCENARIO: {activeScenario.name || activeScenario.scenarioId}</span>
              <button
                onClick={resetBaseline}
                className="ml-1 p-0.5 rounded hover:bg-red-200 text-red-900 transition-colors"
                title="Reset to Normal Baseline"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
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
              className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Compare MOIL Mines Matrix"
            >
              <Layers className="w-3.5 h-3.5 text-[#0891B2]" />
              <span className="hidden xl:inline">Compare Mines</span>
            </button>

            <button
              onClick={() => setIsCommandDrawerOpen(true)}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-xs font-mono font-bold text-[#0F172A] shadow-xs cursor-pointer"
            >
              <Globe2 className="w-3.5 h-3.5 text-[#0891B2]" />
              <span>{currentLangObj.short}</span>
              <ChevronDown className="w-3 h-3 text-[#475569]" />
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
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      lang === l.code ? 'bg-amber-100 text-amber-900 font-bold' : 'text-[#1E293B] hover:bg-slate-50'
                    }`}
                  >
                    <span>{l.label}</span>
                    {lang === l.code && <Check className="w-3 h-3 text-amber-600 font-bold" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Real-time IST Clock Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] font-mono text-xs text-[#1E293B] font-bold shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#475569]" />
            <span>{siteTime}</span>
          </div>

        </div>

      </div>
    </header>
  );
};
