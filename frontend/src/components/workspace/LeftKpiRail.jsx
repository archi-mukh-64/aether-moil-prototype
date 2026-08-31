import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  Layers,
  ChevronDown,
  Activity,
  Award,
  DollarSign,
  ShieldCheck,
  Leaf,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export const LeftKpiRail = () => {
  const {
    activeMine,
    activeScenario,
    selectedMineId,
    setSelectedMineId,
    officialMines,
    t,
    lang
  } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('12h 37m 45s');
  const ws = t?.workspace || {};
  const comm = t?.common || {};

  // Live Shift Countdown Timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfShift = new Date();
      endOfShift.setHours(20, 0, 0, 0); // End of shift at 20:00
      let diffMs = endOfShift - now;
      if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
      const hrs = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeRemaining(`${String(hrs).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentMine = activeMine || {
    name: 'Balaghat Mine',
    shortName: 'Balaghat',
    productionTarget: 6200,
    projectedYield: 6200,
    oreGrade: '44.2% Mn',
    state: 'Madhya Pradesh'
  };

  const isScenario = Boolean(activeScenario);
  const dailyTarget = currentMine.productionTarget || 6200;
  const yieldT = currentMine.projectedYield || currentMine.currentOutput || dailyTarget;
  const achievementPct = isScenario ? Math.max(18, Math.round((yieldT / dailyTarget) * 45)) : 52;
  const achievedT = Math.round(dailyTarget * (achievementPct / 100));

  const mineList = Array.isArray(officialMines) && officialMines.length > 0 ? officialMines : [];

  // Key Performance Items
  const keyPerformance = [
    {
      id: 'prod',
      name: ws.production || 'Production',
      icon: Activity,
      val: isScenario ? '-18.5%' : '+21.5%',
      isPositive: !isScenario,
      color: isScenario ? 'bg-[#C84B3F]' : 'bg-[#2D7A4D]',
      iconColor: isScenario ? 'text-[#C84B3F]' : 'text-[#2D7A4D]',
      width: isScenario ? '38%' : '78%'
    },
    {
      id: 'qual',
      name: ws.quality || 'Quality',
      icon: Award,
      val: isScenario && activeScenario.scenarioId === 'GRADE' ? '-16.4%' : '-12.0%',
      isPositive: false,
      color: 'bg-[#C84B3F]',
      iconColor: 'text-[#C46A32]',
      width: '42%'
    },
    {
      id: 'cost',
      name: ws.cost || 'Cost',
      icon: DollarSign,
      val: isScenario ? '-14.2%' : '-8.7%',
      isPositive: false,
      color: 'bg-[#C84B3F]',
      iconColor: 'text-[#C46A32]',
      width: '35%'
    },
    {
      id: 'safe',
      name: ws.safety || 'Safety',
      icon: ShieldCheck,
      val: '+30.0%',
      isPositive: true,
      color: 'bg-[#2D7A4D]',
      iconColor: 'text-[#2D7A4D]',
      width: '88%'
    },
    {
      id: 'sust',
      name: ws.sustainability || 'Sustainability',
      icon: Leaf,
      val: '+10.2%',
      isPositive: true,
      color: 'bg-[#2D7A4D]',
      iconColor: 'text-[#2D7A4D]',
      width: '65%'
    }
  ];

  // Risk Overview Percentages
  const riskHigh = isScenario ? 68 : 41;
  const riskMed = isScenario ? 24 : 35;
  const riskLow = isScenario ? 8 : 24;

  return (
    <aside className="w-full flex-shrink-0 flex flex-col gap-3 font-sans text-xs select-none">

      {/* 1. ACTIVE MINE SELECTOR CARD */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full p-3.5 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] hover:border-[#C46A32] transition-all flex items-center justify-between text-left shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#E8E1D5] border border-[#C8BFAF] flex items-center justify-center flex-shrink-0">
              <Layers className="w-4 h-4 text-[#C46A32]" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-[#85877E] font-mono uppercase font-bold tracking-wider">
                {ws.activeMine || 'Active Mine'}
              </div>
              <div className="text-sm font-bold text-[#272A27] truncate">
                {currentMine.name}
              </div>
              <div className="text-[11px] text-[#5F625C] truncate">
                {currentMine.state}
              </div>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-[#85877E] flex-shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 max-h-72 overflow-y-auto rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] shadow-xl p-1.5 z-50 no-scrollbar font-mono text-xs">
            <div className="px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#C46A32] font-bold border-b border-[#DDD4C5]">
              {ws.network10Mines || 'MOIL Mine Network (10 Mines)'}
            </div>
            <div className="mt-1 space-y-0.5">
              {mineList.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMineId(m.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    selectedMineId === m.id
                      ? 'bg-[#C46A32]/15 text-[#8F4418] font-bold border border-[#C46A32]/40'
                      : 'text-[#272A27] hover:bg-[#E8E1D5]'
                  }`}
                >
                  <span className="truncate">{m.name}</span>
                  <span className="text-[10px] text-[#85877E] pl-2 font-mono">{m.averageMnGrade || m.oreGrade}%</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. PRODUCTION ACHIEVEMENT */}
      <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-3.5 shadow-xs">
        <div className="text-[10px] text-[#5F625C] font-mono uppercase font-bold tracking-wider">
          {ws.prodAchievement || 'PRODUCTION ACHIEVEMENT'}
        </div>

        {/* Semi-Circular Progress Arc */}
        <div className="relative w-full flex flex-col items-center justify-center pt-1">
          <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden">
            <svg className="w-44 h-44 -rotate-90 origin-center" viewBox="0 0 100 100">
              {/* Background Arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#DDD4C5"
                strokeWidth="10"
                strokeDasharray="251.2"
                strokeDashoffset="125.6"
              />
              {/* Active Progress Arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke={isScenario ? '#C84B3F' : '#2D7A4D'}
                strokeWidth="10"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (achievementPct / 100) * 125.6}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>

            {/* Center Percentage Display */}
            <div className="absolute bottom-0 inset-x-0 flex flex-col items-center justify-center pb-1">
              <span className="text-3xl font-extrabold text-[#272A27] tracking-tight font-sans">
                {achievementPct}%
              </span>
            </div>
          </div>

          {/* Achieved vs Daily Target Tonnage */}
          <div className="w-full flex justify-between items-center px-2 pt-2 text-center">
            <div>
              <div className="text-base font-bold text-[#272A27] font-mono">
                {achievedT.toLocaleString()} T
              </div>
              <div className="text-[10px] text-[#85877E] uppercase font-mono">
                {ws.achieved || 'Achieved'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-[#272A27] font-mono">
                {dailyTarget.toLocaleString()} T
              </div>
              <div className="text-[10px] text-[#85877E] uppercase font-mono">
                {ws.dailyTarget || 'Daily Target'}
              </div>
            </div>
          </div>

          {/* Time Remaining & Shift Boxes */}
          <div className="grid grid-cols-2 gap-2 w-full pt-2">
            <div className="p-2 rounded-lg bg-[#F5F1E9] border border-[#C8BFAF] text-center">
              <div className="text-[9px] text-[#85877E] uppercase font-mono">
                {ws.timeRemaining || 'Time Remaining'}
              </div>
              <div className="text-xs font-bold text-[#272A27] font-mono mt-0.5">
                {timeRemaining}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-[#F5F1E9] border border-[#C8BFAF] text-center">
              <div className="text-[9px] text-[#85877E] uppercase font-mono">
                {ws.shiftCycle || 'Shift Cycle'}
              </div>
              <div className="text-xs font-bold text-[#272A27] font-mono mt-0.5">
                Shift A (Day)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. KEY PERFORMANCE INDICATORS */}
      <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-3 shadow-xs">
        <div className="text-[10px] text-[#5F625C] font-mono uppercase font-bold tracking-wider">
          {ws.keyPerformance || 'KEY PERFORMANCE INDICATORS'}
        </div>

        <div className="space-y-2.5">
          {keyPerformance.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${kpi.iconColor}`} />
                    <span className="text-[#5F625C]">{kpi.name}</span>
                  </div>
                  <span className={`font-bold ${kpi.isPositive ? 'text-[#2D7A4D]' : 'text-[#C84B3F]'}`}>
                    {kpi.val}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#DDD4C5] overflow-hidden">
                  <div
                    className={`h-full ${kpi.color} rounded-full transition-all duration-500`}
                    style={{ width: kpi.width }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. SHIFT RISK OVERVIEW */}
      <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-3 shadow-xs">
        <div className="text-[10px] text-[#5F625C] font-mono uppercase font-bold tracking-wider">
          {ws.riskOverview || 'SHIFT RISK OVERVIEW'}
        </div>

        <div className="space-y-2">
          {/* High Risk Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-[#8F2D24] font-bold">High Threat Exposure</span>
              <span className="text-[#272A27] font-bold">{riskHigh}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#DDD4C5] overflow-hidden">
              <div className="h-full bg-[#C84B3F] rounded-full" style={{ width: `${riskHigh}%` }} />
            </div>
          </div>

          {/* Moderate Risk Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-[#8F6518] font-bold">Moderate Operational Drift</span>
              <span className="text-[#272A27] font-bold">{riskMed}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#DDD4C5] overflow-hidden">
              <div className="h-full bg-[#C46A32] rounded-full" style={{ width: `${riskMed}%` }} />
            </div>
          </div>

          {/* Low Risk Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-[#2D7A4D] font-bold">Low Risk Systems Nominal</span>
              <span className="text-[#272A27] font-bold">{riskLow}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#DDD4C5] overflow-hidden">
              <div className="h-full bg-[#2D7A4D] rounded-full" style={{ width: `${riskLow}%` }} />
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
};
