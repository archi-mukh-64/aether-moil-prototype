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
  Layers
} from 'lucide-react';

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
    t 
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
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'हिन्दी' },
        { code: 'mr', label: 'मराठी' }
      ]
    : [
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'हिन्दी' }
      ];

  const mineAccentColors = {
    'balaghat': '#FFB000',      // Industrial Amber
    'tirodi': '#FFB020',        // Warning Orange
    'ukwa': '#22C55E',          // Forest Green
    'munsar': '#F0445E',        // Critical Coral
    'kandri': '#21D4C5',        // Cyan Teal
    'gumgaon': '#19C3D1',       // Cyan Intel
    'chikla': '#8B7CFF',        // Violet AI
    'dongri-buzurg': '#FFC247', // Gold
    'ramtek': '#34D399',        // Spring Green
    'bhandara': '#8E9EAE'       // Slate Bronze
  };

  const currentAccent = mineAccentColors[activeMine.id] || '#FFB000';

  return (
    <header className="w-full bg-[#10151C]/95 backdrop-blur-xl border-b border-[#222D3A] sticky top-0 z-40 select-none shadow-md font-sans">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        
        {/* Left Section: Mobile Toggle, Brand & Global Mine Selector */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Hamburger */}
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-xl bg-[#151B23] border border-[#222D3A] text-slate-300 hover:text-white lg:hidden cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* AETHER Brand Mark & Subtitle */}
          <Link to="/" className="hidden sm:flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#151B23] border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:border-amber-400 transition-colors shadow">
              <svg viewBox="0 0 32 32" className="w-4 h-4">
                <polygon points="16,3 28,9 28,23 16,29 4,23 4,9" fill="none" stroke="#FFB000" strokeWidth="2" />
                <circle cx="16" cy="16" r="3" fill="#FFB000" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white tracking-wider font-sans leading-none">
                  AETHER
                </span>
                <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase">
                  MOIL PLATFORM
                </span>
              </div>
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
                {t?.subtitle || 'NATIONAL MINING INTELLIGENCE'}
              </span>
            </div>
          </Link>

          <div className="w-[1px] h-6 bg-[#222D3A] hidden sm:block" />

          {/* ACTIVE GLOBAL MINE SELECTOR */}
          <div className="relative" ref={mineDropdownRef}>
            <button
              onClick={() => setIsMineDropdownOpen(!isMineDropdownOpen)}
              className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-[#151B23] hover:bg-[#1A232E] border border-[#222D3A] hover:border-[#2D3A4B] text-white text-xs font-bold transition-all shadow-card-subtle group cursor-pointer"
              style={{ borderLeft: `3.5px solid ${currentAccent}` }}
            >
              <div className="flex flex-col text-left">
                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider">
                  {t?.common?.active_mine || 'ACTIVE SECTOR MINE'}
                </span>
                <span className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentAccent }} />
                  <span>{activeMine.name}</span>
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform ${isMineDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu of 10 Canonical MOIL Mines */}
            {isMineDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-[#10151C] border border-[#222D3A] shadow-2xl p-2 z-[100] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-[#222D3A] flex items-center justify-between">
                  <span>{lang === 'hi' ? '10 प्रामाणिक मॉयल खदानें' : lang === 'mr' ? '10 अधिकृत मॉयल खाणी' : '10 CANONICAL MOIL MINES'}</span>
                  <span className="text-amber-400 font-mono text-[9px]">{lang === 'hi' ? 'मध्य क्षेत्र' : lang === 'mr' ? 'मध्य पट्टा' : 'CENTRAL BELT'}</span>
                </div>

                <div className="mt-1 space-y-1 max-h-80 overflow-y-auto pr-1 no-scrollbar">
                  {OFFICIAL_MOIL_MINES.map((m) => {
                    const isSelected = m.id === activeMine.id;
                    const accent = mineAccentColors[m.id] || '#FFB000';

                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedMineId(m.id);
                          setIsMineDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#1A232E] text-white font-bold border border-amber-500/40 shadow-sm'
                            : 'text-slate-300 hover:bg-[#151B23] hover:text-white'
                        }`}
                        style={{ borderLeft: isSelected ? `3px solid ${accent}` : '3px solid transparent' }}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                            <strong className="text-slate-100">{m.name}</strong>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 ml-3.5">
                            {m.district}, {m.state} • {m.mineType}
                          </div>
                        </div>

                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Active Mine Location & GPS Pill */}
          <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#151B23] border border-[#222D3A] font-mono text-xs text-slate-300">
            <div>
              <span className="text-slate-400 text-[8px] block uppercase">{lang === 'hi' ? 'स्थान' : lang === 'mr' ? 'स्थान' : 'LOCATION'}</span>
              <strong className="text-slate-200 text-[11px]">{activeMine.district}, {activeMine.state}</strong>
            </div>
            <div className="w-[1px] h-5 bg-[#222D3A]" />
            <div>
              <span className="text-slate-400 text-[8px] block uppercase">{lang === 'hi' ? 'निर्देशांक' : lang === 'mr' ? 'अक्षांश-रेखांश' : 'COORDINATES'}</span>
              <strong className="text-cyan-300 text-[10px]">{activeMine.coordinatesDMS}</strong>
            </div>
            <div className="w-[1px] h-5 bg-[#222D3A]" />
            <div>
              <span className="text-slate-400 text-[8px] block uppercase">{lang === 'hi' ? 'स्थिति' : lang === 'mr' ? 'स्थिती' : 'STATUS'}</span>
              <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t?.common?.optimal || 'OPTIMAL'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Operational Scenarios + Multilingual Selector + Live Clock */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          
          {/* Quick Scenario Stress Triggers */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => runScenario('MONSOON', 'HIGH', '24 HOURS')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeScenario?.scenarioId === 'MONSOON'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-[#151B23] border border-[#222D3A] text-slate-300 hover:border-orange-500/40 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'hi' ? 'भारी मानसून' : lang === 'mr' ? 'मुसळधार मान्सून' : 'Monsoon Shock'}</span>
            </button>

            <button
              onClick={() => runScenario('CRUSHER', 'HIGH', '24 HOURS')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeScenario?.scenarioId === 'CRUSHER'
                  ? 'bg-coral-500 text-white shadow-md'
                  : 'bg-[#151B23] border border-[#222D3A] text-slate-300 hover:border-coral-500/40 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-coral-400" />
              <span>{lang === 'hi' ? 'क्रशर जाम' : lang === 'mr' ? 'क्रशर बिघाड' : 'Crusher Seizure'}</span>
            </button>

            <button
              onClick={() => runScenario('MULTI_RISK', 'HIGH', '24 HOURS')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeScenario?.scenarioId === 'MULTI_RISK'
                  ? 'bg-coral-600 text-white shadow-md'
                  : 'bg-[#151B23] border border-[#222D3A] text-slate-300 hover:border-coral-500/40 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'hi' ? 'बहु-जोखिम' : lang === 'mr' ? 'मल्टी-रिस्क' : 'Multi-Risk'}</span>
            </button>

            {activeScenario && (
              <button
                onClick={resetBaseline}
                className="px-2.5 py-1.5 rounded-xl bg-[#1A232E] hover:bg-[#222D3A] border border-[#2D3A4B] text-slate-200 hover:text-white text-[11px] flex items-center gap-1 transition-all cursor-pointer"
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151B23] hover:bg-[#1A232E] border border-[#222D3A] text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              <Globe2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="uppercase">{lang}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-xl bg-[#10151C] border border-[#222D3A] shadow-2xl p-1 z-[100] backdrop-blur-xl">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                      lang === l.code
                        ? 'bg-amber-500/20 text-amber-300 font-bold'
                        : 'text-slate-300 hover:bg-[#151B23] hover:text-white'
                    }`}
                  >
                    <span>{l.label}</span>
                    {lang === l.code && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Live System Time */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151B23] border border-[#222D3A] text-slate-300 text-[11px] font-mono">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{siteTime}</span>
          </div>

        </div>

      </div>
    </header>
  );
};
