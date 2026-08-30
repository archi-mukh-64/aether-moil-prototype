import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  SlidersHorizontal, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

export const SihDemoBanner = () => {
  const { 
    activeScenario, 
    decisionStage, 
    runScenario, 
    resetDemo, 
    setIsCommandDrawerOpen, 
    setIsDecisionModalOpen,
    t,
    lang
  } = useApp();

  const comm = t?.common || {};
  const scen = t?.scenarioLab || {};

  return (
    <div className="w-full bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-950 border-b border-manganese-500/30 py-2.5 px-4 sm:px-6 lg:px-8 text-xs font-mono relative z-40 shadow-lg select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left Status Tag */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-manganese-500/20 text-manganese-300 border border-manganese-500/40 text-[11px] font-bold">
            <Sparkles className="w-3 h-3 text-manganese-400" />
            <span>{comm.mode_demo || 'SIH DEMO MODE'} // {comm.disclaimer || 'DETERMINISTIC AI LOOP'}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-zinc-400 text-[11px]">
            <span>{comm.system_status || 'STATUS'}:</span>
            {activeScenario ? (
              <span className="font-bold text-hazard-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-hazard-500 animate-pulse" />
                {activeScenario.name || activeScenario.id} ({decisionStage})
              </span>
            ) : (
              <span className="font-bold text-telemetry-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-telemetry-400" />
                {comm.allClear || 'BASELINE NOMINAL'}
              </span>
            )}
          </div>
        </div>

        {/* Center Quick 1-Click Simulation Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => runScenario('MONSOON', 'HIGH', '72h')}
            className={`px-2.5 py-1 rounded text-[11px] transition-all flex items-center gap-1.5 font-bold ${
              activeScenario?.id === 'MONSOON'
                ? 'bg-hazard-500 text-obsidian-950 shadow-md'
                : 'bg-obsidian-800 text-zinc-300 hover:bg-obsidian-750 hover:text-white border border-obsidian-700'
            }`}
          >
            <Play className="w-2.5 h-2.5" />
            <span>{comm.heavy_monsoon || '1. Heavy Monsoon'}</span>
          </button>

          <button
            onClick={() => runScenario('CRUSHER', 'MEDIUM', '24h')}
            className={`px-2.5 py-1 rounded text-[11px] transition-all flex items-center gap-1.5 font-bold ${
              activeScenario?.id === 'CRUSHER'
                ? 'bg-manganese-500 text-obsidian-950 shadow-md'
                : 'bg-obsidian-800 text-zinc-300 hover:bg-obsidian-750 hover:text-white border border-obsidian-700'
            }`}
          >
            <Play className="w-2.5 h-2.5" />
            <span>{comm.crusher_seizure || '2. Crusher Seizure'}</span>
          </button>

          <button
            onClick={() => runScenario('MULTI_RISK', 'EXTREME', '72h')}
            className={`px-2.5 py-1 rounded text-[11px] transition-all flex items-center gap-1.5 font-bold ${
              activeScenario?.id === 'MULTI_RISK'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-obsidian-800 text-zinc-300 hover:bg-obsidian-750 hover:text-white border border-obsidian-700'
            }`}
          >
            <Play className="w-2.5 h-2.5" />
            <span>{comm.multi_risk_crisis || '3. Multi-Risk Crisis'}</span>
          </button>
        </div>

        {/* Right Tools: Human Action + Reset */}
        <div className="flex items-center gap-2">
          {activeScenario && decisionStage !== 'APPROVED' && (
            <button
              onClick={() => setIsDecisionModalOpen(true)}
              className="px-3 py-1 rounded bg-telemetry-500 hover:bg-telemetry-400 text-obsidian-950 font-bold text-[11px] flex items-center gap-1 shadow-md animate-pulse"
            >
              <Zap className="w-3 h-3" />
              <span>{scen.authorizeBtn || comm.recommendation || 'Review AI Prescription'}</span>
            </button>
          )}

          {activeScenario && decisionStage === 'APPROVED' && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-telemetry-500/20 text-telemetry-300 border border-telemetry-500/40 text-[11px] font-bold">
              <CheckCircle2 className="w-3 h-3 text-telemetry-400" />
              <span>{scen.authorizedBtn || 'PRESCRIPTION DISPATCHED'}</span>
            </div>
          )}

          <button
            onClick={() => setIsCommandDrawerOpen(true)}
            className="px-2.5 py-1 rounded bg-obsidian-800 hover:bg-obsidian-750 text-manganese-400 border border-obsidian-700 text-[11px] flex items-center gap-1 font-bold"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>{t?.nav?.scenarioLab || 'Lab'}</span>
          </button>

          <button
            onClick={resetDemo}
            title={comm.reset_baseline || 'Reset to Baseline Nominal State'}
            className="px-2.5 py-1 rounded bg-obsidian-800 hover:bg-hazard-500/20 text-zinc-400 hover:text-hazard-300 border border-obsidian-700 text-[11px] flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">{comm.reset_baseline || 'Reset Baseline'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
