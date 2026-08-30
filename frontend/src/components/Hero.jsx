import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { 
  Radio, 
  Layers, 
  AlertTriangle, 
  Zap, 
  Cpu, 
  BarChart3, 
  Compass, 
  Globe2, 
  ChevronDown, 
  Terminal, 
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Crosshair,
  TrendingUp,
  Activity,
  Play
} from 'lucide-react';

export const Hero = () => {
  const { activeMine, setIsCommandDrawerOpen, runScenario } = useApp();
  const [pulseTime, setPulseTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseTime(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-obsidian-800/80 bg-gradient-to-b from-obsidian-950 via-obsidian-900/40 to-obsidian-950">
      
      {/* Ambient Radial Lighting Backgrounds */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-manganese-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] bg-telemetry-500/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 tech-grid-dense opacity-40 pointer-events-none" />

      <div className="command-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
          
          {/* ========================================================================= */}
          {/* LEFT 6-7 COLS: MISSION HEADLINE & ENTERPRISE VALUE PROP                   */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-6 text-left">
            
            {/* Top Identity & Geodetic Pill Rail */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="badge-manganese shadow-sm">
                <Radio className="w-3.5 h-3.5 animate-pulse text-manganese-400" />
                <span>MOIL ENTERPRISE AI × EARTH OBSERVATION</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-900/90 text-zinc-300 font-mono text-[11px] border border-obsidian-750">
                <Compass className="w-3 h-3 text-telemetry-400" />
                <span className="font-bold text-white uppercase">{activeMine.name}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">{activeMine.district?.toUpperCase()} • {activeMine.state?.toUpperCase()}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-telemetry-400">{activeMine.coordinatesDMS || activeMine.dmsCoordinates || activeMine.coordinates}</span>
              </div>
            </div>

            {/* Impactful Display Headline */}
            <div className="space-y-2">
              <div className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-zinc-400 font-semibold">
                Manganese Ore India Limited // Mining Command
              </div>
              <h1 className="font-display text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.04]">
                INTELLIGENCE <br />
                <span className="bg-gradient-to-r from-zinc-100 via-manganese-400 to-amber-300 bg-clip-text text-transparent">
                  BENEATH THE SURFACE.
                </span>
              </h1>
            </div>

            {/* Concise Value Proposition Text */}
            <p className="text-base sm:text-lg text-zinc-300 font-sans leading-relaxed max-w-2xl">
              Real-time multi-mine telemetry, 14-day production shortfall forecasting, and prescriptive decision-support for India’s largest manganese producer.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs">
              <Link
                to="/command-center"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-manganese-500 via-manganese-400 to-amber-400 hover:from-manganese-400 hover:to-amber-300 text-obsidian-950 font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.25)] transition-all hover:scale-105 flex items-center gap-2"
              >
                <span>OPEN COMMAND CENTER</span>
                <ArrowRight className="w-4 h-4 text-obsidian-950" />
              </Link>

              <button
                onClick={() => setIsCommandDrawerOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-obsidian-900/90 hover:bg-obsidian-850 text-zinc-200 hover:text-white font-bold border border-obsidian-750 hover:border-manganese-500/40 transition-all flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-manganese-400" />
                <span>EXPLORE SCENARIO LAB</span>
              </button>
            </div>

            {/* Technical Sub-Datum Strip */}
            <div className="pt-4 border-t border-obsidian-800/80 flex flex-wrap items-center gap-6 font-mono text-xs text-zinc-400">
              <div>
                <span className="text-zinc-500 text-[10px] uppercase block">Proved Reserve:</span>
                <strong className="text-white text-sm">{activeMine.reservePotentialM}M Tonnes</strong>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] uppercase block">Ore Grade:</span>
                <strong className="text-manganese-400 text-sm">{activeMine.baseGradeNum}% Mn</strong>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] uppercase block">Baseline Quota:</span>
                <strong className="text-white text-sm">{activeMine.dailyTarget.toLocaleString()} TPD</strong>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] uppercase block">Mine Elevation:</span>
                <strong className="text-telemetry-400 text-sm">{activeMine.elevation}</strong>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT 5-6 COLS: EXPANSIVE GEOLOGICAL & SATELLITE HUD VISUALIZER           */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div className="panel-surface p-6 sm:p-7 border border-obsidian-750 relative overflow-hidden shadow-2xl space-y-5 bg-gradient-to-br from-obsidian-900/90 via-obsidian-950 to-obsidian-900/90">
              
              {/* Radar & Telemetry HUD Header */}
              <div className="flex items-center justify-between pb-3 border-b border-obsidian-800 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-manganese-400 animate-spin" style={{ animationDuration: '12s' }} />
                  <span className="font-bold text-white uppercase tracking-wider">{activeMine.shortName} RADAR</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-telemetry-400">
                  <span className="w-2 h-2 rounded-full bg-telemetry-400 animate-ping" />
                  <span>AUTONOMOUS SCAN ACTIVE</span>
                </div>
              </div>

              {/* Sub-Surface Strata & Radar Target Visualization Area */}
              <div className="relative h-64 rounded-xl bg-obsidian-950/80 border border-obsidian-800 overflow-hidden flex items-center justify-center p-4">
                
                {/* Radar Sweep Arc */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-70">
                  <div className="w-56 h-56 rounded-full border border-manganese-500/20 flex items-center justify-center">
                    <div className="w-40 h-40 rounded-full border border-telemetry-500/30 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full border border-cyan-500/20" />
                    </div>
                  </div>
                  <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-manganese-500/15 via-transparent to-transparent animate-radar-sweep" />
                </div>

                {/* Sub-Surface Strata Layer Cut-outs */}
                <div className="relative z-10 w-full space-y-2 font-mono text-xs">
                  <div className="p-2 rounded-lg bg-obsidian-900/90 border border-obsidian-750 flex items-center justify-between shadow-sm">
                    <span className="text-zinc-400 text-[11px]">Surface Overburden (RL +340m):</span>
                    <span className="text-zinc-300 font-bold">Alluvial Clay &amp; Quartzite</span>
                  </div>
                  <div className="p-2 rounded-lg bg-obsidian-900/90 border border-manganese-500/40 flex items-center justify-between shadow-md ring-1 ring-manganese-500/20">
                    <span className="text-manganese-300 font-bold text-[11px]">Gondite Mn Ore Reef ({activeMine.waterTableDepth}):</span>
                    <span className="text-manganese-400 font-bold">{activeMine.grade}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-obsidian-900/90 border border-obsidian-750 flex items-center justify-between shadow-sm">
                    <span className="text-zinc-400 text-[11px]">Shaft Deep Sump Pumping:</span>
                    <span className="text-cyan-400 font-bold">{activeMine.drainageBaselineM3h || 12} m³/h</span>
                  </div>
                </div>

                {/* Corner Geodetic Crosshairs */}
                <div className="absolute top-2 left-2 text-[9px] font-mono text-zinc-600">
                  + {activeMine.latitude}
                </div>
                <div className="absolute bottom-2 right-2 text-[9px] font-mono text-zinc-600">
                  + {activeMine.longitude}
                </div>
              </div>

              {/* Real-time Fleet & Sump Sensor Readout Strip */}
              <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                <div className="p-3 rounded-xl bg-obsidian-950/80 border border-obsidian-800 space-y-1">
                  <div className="text-[10px] text-zinc-500 uppercase">HEMM Fleet Ready</div>
                  <div className="text-sm font-bold text-white">{activeMine.activeFleet}</div>
                  <div className="text-[10px] text-telemetry-400">{activeMine.fleetAvailabilityBase}% Availability</div>
                </div>

                <div className="p-3 rounded-xl bg-obsidian-950/80 border border-obsidian-800 space-y-1">
                  <div className="text-[10px] text-zinc-500 uppercase">Shortfall Forecast</div>
                  <div className="text-sm font-bold text-telemetry-300">{activeMine.shortfallRisk}</div>
                  <div className="text-[10px] text-zinc-400">95% Bayesian Confidence</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
