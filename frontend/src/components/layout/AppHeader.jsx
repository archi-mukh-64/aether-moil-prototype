import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { OFFICIAL_MOIL_MINES } from '../../services/mineRegistry.js';
import {
  MapPin,
  Globe2,
  ChevronDown,
  Check,
  Menu,
  Clock,
  Activity,
  ShieldAlert,
  RotateCcw,
  Layers,
  FileText
} from 'lucide-react';

/**
 * AETHER Command Console Bar (AppHeader)
 * High-contrast dark charcoal header (#292E2A) with active mine selector, trilingual language switcher,
 * live scenario context, real-time clock, and quick executive actions.
 */
export const AppHeader = ({ onMobileMenuToggle }) => {
  const {
    lang,
    setLang,
    activeMine,
    setSelectedMineId,
    activeScenario,
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
    <header className="w-full bg-[#292E2A] border-b border-[#3A423C] sticky top-0 z-40 select-none shadow-md font-sans text-[#F0EBE2]">
      <div className="w-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">

        {/* LEFT SECTION: Mobile Toggle & Active Mine Asset Switcher */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg bg-[#202522] hover:bg-[#323B34] text-[#F0EBE2] cursor-pointer"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Active Mine Selector Dropdown */}
          <div className="relative" ref={mineDropdownRef}>
            <button
              onClick={() => setIsMineDropdownOpen(!isMineDropdownOpen)}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#202522] hover:bg-[#323B34] border border-[#3A423C] text-left transition-all duration-150 shadow-sm group cursor-pointer"
            >
              <div className="p-1 rounded-md bg-[#C46A32]/20 border border-[#C46A32]/40 text-[#C46A32]">
                <MapPin className="w-3.5 h-3.5" />
              </div>

              <div className="flex flex-col">
                <span className="text-[9px] font-mono font-bold text-[#85877E] uppercase leading-none">
                  ACTIVE MOIL ASSET
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs sm:text-sm font-bold text-[#F0EBE2] font-display truncate max-w-[140px] sm:max-w-[200px]">
                    {activeMine?.name || 'Balaghat Mine'}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#C46A32]">
                    ({activeMine?.state?.includes('Madhya') ? 'MP' : 'MH'})
                  </span>
                </div>
              </div>

              <ChevronDown className={`w-3.5 h-3.5 text-[#85877E] transition-transform duration-200 ml-1 ${isMineDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Mine Dropdown Menu */}
            {isMineDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-80 bg-[#F0EBE2] border border-[#C8BFAF] rounded-2xl shadow-2xl z-50 p-2 space-y-1 text-[#272A27] animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#5F625C] border-b border-[#C8BFAF] flex justify-between items-center">
                  <span>SELECT FROM 10 CANONICAL ASSETS</span>
                  <span className="text-[#C46A32] font-bold">MOIL PSU</span>
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
                            ? 'bg-[#E8E1D5] border border-[#C46A32] text-[#272A27] font-bold'
                            : 'hover:bg-[#F5F1E9] text-[#272A27]'
                        }`}
                      >
                        <div className="space-y-0.5 truncate">
                          <div className="font-bold text-xs flex items-center gap-1.5 truncate">
                            <span>{mine.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#C46A32] font-bold" />}
                          </div>
                          <div className="text-[10px] font-mono text-[#5F625C]">
                            {mine.district}, {mine.state} • <strong className="text-[#C46A32]">{mine.baseGradeNum}% Mn</strong>
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
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C84B3F]/20 border border-[#C84B3F]/50 text-[#C84B3F] text-xs font-mono font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5 text-[#C84B3F]" />
              <span>STRESS SCENARIO: {activeScenario.name || activeScenario.scenarioId}</span>
              <button
                onClick={resetBaseline}
                className="ml-1 p-0.5 rounded hover:bg-[#C84B3F]/30 text-[#F0EBE2] transition-colors cursor-pointer"
                title="Reset to Normal Baseline"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#71856B]/20 border border-[#71856B]/40 text-[#A6C09F] text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-[#71856B]" />
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
              className="p-2 rounded-xl bg-[#202522] hover:bg-[#323B34] border border-[#3A423C] text-[#F0EBE2] text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Compare MOIL Mines Matrix"
            >
              <Layers className="w-3.5 h-3.5 text-[#3D8C8A]" />
              <span className="hidden xl:inline">Compare Mines</span>
            </button>

            <button
              onClick={() => setIsCommandDrawerOpen(true)}
              className="p-2 rounded-xl bg-[#C46A32]/20 hover:bg-[#C46A32]/30 border border-[#C46A32]/50 text-[#C46A32] text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Inject Scenario Shock"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C46A32]" />
              <span className="hidden xl:inline">Scenario Lab</span>
            </button>
          </div>

          {/* Trilingual Language Selector */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#202522] hover:bg-[#323B34] border border-[#3A423C] text-xs font-mono font-bold text-[#F0EBE2] shadow-sm cursor-pointer"
            >
              <Globe2 className="w-3.5 h-3.5 text-[#3D8C8A]" />
              <span>{currentLangObj.short}</span>
              <ChevronDown className="w-3 h-3 text-[#85877E]" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-32 bg-[#F0EBE2] border border-[#C8BFAF] rounded-xl shadow-2xl z-50 p-1 space-y-0.5 text-[#272A27] animate-in fade-in zoom-in-95 duration-150">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      lang === l.code ? 'bg-[#C46A32] text-white' : 'text-[#272A27] hover:bg-[#E8E1D5]'
                    }`}
                  >
                    <span>{l.label}</span>
                    {lang === l.code && <Check className="w-3 h-3 text-white font-bold" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Real-time IST Clock Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#202522] border border-[#3A423C] font-mono text-xs text-[#F0EBE2] font-bold shadow-sm">
            <Clock className="w-3.5 h-3.5 text-[#85877E]" />
            <span>{siteTime}</span>
          </div>

        </div>

      </div>
    </header>
  );
};
