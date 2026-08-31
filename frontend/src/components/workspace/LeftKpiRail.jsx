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
      color: isScenario ? 'bg-rose-500' : 'bg-teal-400',
      iconColor: isScenario ? 'text-rose-400' : 'text-teal-400',
      width: isScenario ? '38%' : '78%'
    },
    {
      id: 'qual',
      name: ws.quality || 'Quality',
      icon: Award,
      val: isScenario && activeScenario.scenarioId === 'GRADE' ? '-16.4%' : '-12.0%',
      isPositive: false,
      color: 'bg-rose-500',
      iconColor: 'text-amber-400',
      width: '42%'
    },
    {
      id: 'cost',
      name: ws.cost || 'Cost',
      icon: DollarSign,
      val: isScenario ? '-14.2%' : '-8.7%',
      isPositive: false,
      color: 'bg-rose-500',
      iconColor: 'text-amber-400',
      width: '35%'
    },
    {
      id: 'safe',
      name: ws.safety || 'Safety',
      icon: ShieldCheck,
      val: '+30.0%',
      isPositive: true,
      color: 'bg-teal-400',
      iconColor: 'text-teal-400',
      width: '88%'
    },
    {
      id: 'sust',
      name: ws.sustainability || 'Sustainability',
      icon: Leaf,
      val: '+10.2%',
      isPositive: true,
      color: 'bg-teal-400',
      iconColor: 'text-teal-400',
      width: '65%'
    }
  ];

  // Risk Overview Percentages
  const riskHigh = isScenario ? 68 : 41;
  const riskMed = isScenario ? 24 : 35;
  const riskLow = isScenario ? 8 : 24;

  return (
    <aside className="w-full lg:w-[280px] xl:w-[290px] flex-shrink-0 flex flex-col gap-3 font-sans text-xs select-none">

      {/* 1. ACTIVE MINE SELECTOR CARD */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full p-3.5 rounded-xl bg-[#0c1017] border border-[#1a2333] hover:border-amber-500/40 transition-all flex items-center justify-between text-left shadow-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#141b27] border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-[#85877E] font-mono uppercase font-bold tracking-wider">
                {ws.activeMine || 'Active Mine'}
              </div>
              <div className="text-sm font-bold text-white truncate">
                {currentMine.name}
              </div>
              <div className="text-[11px] text-[#5F625C] truncate">
                {currentMine.state}
              </div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-[#85877E] flex-shrink-0" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 max-h-72 overflow-y-auto rounded-xl bg-[#0a0e14] border border-[#1f293d] shadow-2xl p-1.5 z-50 no-scrollbar font-mono text-xs">
            <div className="px-2.5 py-1 text-[10px] uppercase tracking-wider text-amber-400 font-bold border-b border-[#172030]">
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
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                    selectedMineId === m.id
                      ? 'bg-amber-500/20 text-amber-300 font-bold'
                      : 'text-[#272A27] hover:bg-[#141c2b]'
                  }`}
                >
                  <span className="truncate">{m.name}</span>
                  <span className="text-[10px] text-[#85877E] pl-2">{m.averageMnGrade || m.oreGrade}%</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. PRODUCTION ACHIEVEMENT */}
      <div className="p-4 rounded-xl bg-[#0c1017] border border-[#1a2333] space-y-3.5 shadow-sm">
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
                stroke="#16202f"
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
                stroke={isScenario ? '#ef4444' : '#10b981'}
                strokeWidth="10"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (achievementPct / 100) * 125.6}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>

            {/* Center Percentage Display */}
            <div className="absolute bottom-0 inset-x-0 flex flex-col items-center justify-center pb-1">
              <span className="text-3xl font-extrabold text-white tracking-tight font-sans">
                {achievementPct}%
              </span>
            </div>
          </div>

          {/* Achieved vs Daily Target Tonnage */}
          <div className="w-full flex justify-between items-center px-2 pt-2 text-center">
            <div>
              <div className="text-base font-bold text-white font-mono">
                {achievedT.toLocaleString()} T
              </div>
              <div className="text-[10px] text-[#85877E] uppercase font-mono">
                {ws.achieved || 'Achieved'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-white font-mono">
                {dailyTarget.toLocaleString()} T
              </div>
              <div className="text-[10px] text-[#85877E] uppercase font-mono">
                {ws.dailyTarget || 'Daily Target'}
              </div>
            </div>
          </div>

          {/* Time Remaining & Shift Boxes */}
          <div className="grid grid-cols-2 gap-2 w-full pt-2">
            <div className="p-2 rounded-lg bg-[#080b10] border border-[#141b27] text-center">
              <div className="text-[9px] text-[#85877E] uppercase font-mono">
                {ws.timeRemaining || 'Time Remaining'}
              </div>
              <div className="text-xs font-bold text-[#272A27] font-mono mt-0.5">
                {timeRemaining}
              </div>
            </div>

            <div className="p-2 rounded-lg bg-[#080b10] border border-[#141b27] text-center">
              <div className="text-[9px] text-[#85877E] uppercase font-mono">
                {ws.shift || 'Shift'}
              </div>
              <div className="text-xs font-bold text-[#272A27] font-mono mt-0.5">
                {ws.shiftA || 'A Shift'}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. KEY PERFORMANCE (vs Target) */}
      <div className="p-4 rounded-xl bg-[#0c1017] border border-[#1a2333] space-y-2.5 shadow-sm font-mono text-xs">
        <div className="flex justify-between items-center text-[10px] text-[#5F625C] uppercase font-bold tracking-wider pb-1">
          <span>{ws.keyPerformance || 'KEY PERFORMANCE'}</span>
          <span className="text-[#85877E] font-normal">{ws.vsTarget || 'vs Target'}</span>
        </div>

        <div className="space-y-2 pt-0.5">
          {keyPerformance.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 w-24 flex-shrink-0">
                  <Icon className={`w-3 h-3 ${item.iconColor}`} />
                  <span className="text-[11px] text-[#272A27] truncate font-sans font-medium">{item.name}</span>
                </div>

                {/* Horizontal Progress Bar */}
                <div className="flex-1 h-1.5 bg-[#141b27] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: item.width }}
                  />
                </div>

                {/* Delta Percentage */}
                <div className={`w-14 text-right text-[11px] font-bold flex items-center justify-end gap-0.5 ${item.isPositive ? 'text-teal-400' : 'text-rose-400'}`}>
                  <span>{item.val}</span>
                  {item.isPositive ? (
                    <TrendingUp className="w-3 h-3 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="w-3 h-3 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. RISK OVERVIEW */}
      <div className="p-4 rounded-xl bg-[#0c1017] border border-[#1a2333] space-y-3 shadow-sm font-mono text-xs">
        <div className="text-[10px] text-[#5F625C] uppercase font-bold tracking-wider">
          {ws.riskOverview || 'RISK OVERVIEW'}
        </div>

        <div className="flex items-center gap-4">

          {/* Donut Chart with Center HIGH % */}
          <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="36" fill="transparent" stroke="#16202f" strokeWidth="12" />
              {/* High Segment */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#f43f5e"
                strokeWidth="12"
                strokeDasharray="226"
                strokeDashoffset={226 - (riskHigh / 100) * 226}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] text-[#5F625C] font-bold uppercase">{ws.high ? ws.high.toUpperCase() : 'HIGH'}</span>
              <span className="text-sm font-extrabold text-white font-mono leading-none">
                {riskHigh}%
              </span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="flex-1 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-[#272A27]">{ws.high || 'High'}</span>
              </div>
              <span className="text-white font-bold">{riskHigh}%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-[#272A27]">{ws.medium || 'Medium'}</span>
              </div>
              <span className="text-white font-bold">{riskMed}%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                <span className="text-[#272A27]">{ws.low || 'Low'}</span>
              </div>
              <span className="text-white font-bold">{riskLow}%</span>
            </div>
          </div>

        </div>
      </div>

    </aside>
  );
};
