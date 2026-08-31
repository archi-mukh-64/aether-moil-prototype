import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import {
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Zap,
  Activity,
  Droplet,
  Truck,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export const BeforeAfterDelta = () => {
  const { activeScenario, decisionStage, setIsDecisionModalOpen } = useApp();

  if (!activeScenario) return null;

  const b = activeScenario.beforeState || {
    dailyProduction: 6200,
    predictedYield: 4850,
    shortfallRisk: 'High (84.2%)',
    fleetAvailability: '62.0%',
    waterIngressRate: '38.6 m³/h',
    unmitigatedLossTonnes: 1350,
    unmitigatedLossPct: '-21.8%'
  };

  const p = activeScenario.recommendation || activeScenario.prescribedAction || {
    actionId: 'PROTO-AP-04',
    protectedYield: '+1,150 T/day'
  };

  const options = Array.isArray(activeScenario.optimizationOptions) ? activeScenario.optimizationOptions : [];
  const bestOpt = options.find(o => o.isAiRecommended) || options[0] || {
    expectedLossPct: '-3.2%',
    expectedLossTonnes: 200,
    protectedTonnes: 1150,
    roi: '9.4x'
  };

  const rawStressor = activeScenario.evidenceFactors?.[0]?.factor || activeScenario.shapDrivers?.[0]?.feature || 'Environmental Stress';
  const primaryStressor = typeof rawStressor === 'string' ? rawStressor : 'Operational Stress';
  const confidence = activeScenario.detection?.confidence || activeScenario.prediction?.modelConfidence || '94.8%';
  const timeHorizon = activeScenario.timeHorizon || activeScenario.prediction?.horizon || '24 HOURS';

  return (
    <section className="command-container py-6">
      <div className="panel-surface p-6 sm:p-8 border border-manganese-500/40 shadow-2xl relative overflow-hidden bg-gradient-to-b from-obsidian-900 via-obsidian-900/95 to-obsidian-950">

        {/* Background Aura */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-hazard-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-obsidian-800 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-hazard text-[11px] font-bold">
                {activeScenario.code || 'SCENARIO ALERT'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-obsidian-800 text-zinc-400 font-mono">
                SYNTHETIC SIMULATION DATA
              </span>
            </div>
            <h3 className="font-display text-2xl font-bold text-[#272A27] mt-2">
              Live Decision Delta — {activeScenario.title || activeScenario.detectionHeadline || activeScenario.scenarioId || 'Simulation State'}
            </h3>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span>Confidence: <strong className="text-telemetry-400">{confidence}</strong></span>
            <span>•</span>
            <span>Horizon: <strong className="text-[#272A27]">{timeHorizon}</strong></span>
          </div>
        </div>

        {/* 3-Column Progression: BEFORE BASELINE -> UNMITIGATED THREAT -> AI OPTIMIZED COUNTERMEASURE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-8">

          {/* Col 1: Baseline Before Scenario */}
          <div className="p-5 rounded-xl bg-obsidian-950/80 border border-obsidian-800 space-y-4 font-mono text-xs flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>01 // BEFORE BASELINE</span>
                <span className="text-telemetry-400 font-bold">PRE-SHOCK</span>
              </div>
              <div className="text-base font-bold text-[#272A27] mb-4">
                Nominal Mining Rate
              </div>

              <div className="space-y-2 text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Daily Target:</span>
                  <strong className="text-[#272A27]">{b.dailyProduction?.toLocaleString() || 6200} TPD</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Shortfall Risk:</span>
                  <strong className="text-telemetry-400">Low (&lt;10%)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Fleet Availability:</span>
                  <strong className="text-[#272A27]">{b.fleetAvailability || '88.0%'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Water Table Inflow:</span>
                  <strong className="text-cyan-400">{b.waterIngressRate || '12 m³/h'}</strong>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-obsidian-900 text-[11px] text-zinc-400 border border-obsidian-800">
              Shift operating at 100% quota compliance.
            </div>
          </div>

          {/* Col 2: Unmitigated Threat Impact */}
          <div className="p-5 rounded-xl bg-hazard-950/20 border border-hazard-500/40 space-y-4 font-mono text-xs flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-hazard-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>02 // UNMITIGATED THREAT</span>
                <span className="text-hazard-400 font-bold animate-pulse">AT RISK</span>
              </div>
              <div className="text-base font-bold text-hazard-300 mb-4">
                {b.unmitigatedLossTonnes?.toLocaleString() || 1350} Tonnes at Risk ({b.unmitigatedLossPct || '-21.8%'})
              </div>

              <div className="space-y-2 text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Predicted Yield:</span>
                  <strong className="text-hazard-400">{b.predictedYield?.toLocaleString() || 4850} TPD</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Threat Deficit:</span>
                  <strong className="text-hazard-400">-{b.unmitigatedLossTonnes?.toLocaleString() || 1350} T</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Shortfall Probability:</span>
                  <strong className="text-hazard-300">{b.shortfallRisk || '84.2%'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Primary Stressor:</span>
                  <strong className="text-white truncate max-w-[140px]">{primaryStressor.split('(')[0]}</strong>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-hazard-950/60 text-[11px] text-hazard-200 border border-hazard-500/30">
              Without intervention, target quota fails by {b.unmitigatedLossPct || '-21.8%'}.
            </div>
          </div>

          {/* Col 3: AI Optimized Response */}
          <div className="p-5 rounded-xl bg-telemetry-950/20 border border-telemetry-500/40 space-y-4 font-mono text-xs flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-telemetry-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>03 // AI OPTIMIZED RESPONSE</span>
                <span className="text-telemetry-400 font-bold">RECOVERED</span>
              </div>
              <div className="text-base font-bold text-telemetry-300 mb-4">
                {p.protectedYield || '+1,150 T/day'} Protected
              </div>

              <div className="space-y-2 text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Restricted Loss:</span>
                  <strong className="text-emerald-400">{bestOpt.expectedLossPct || '-3.2%'} (Only {bestOpt.expectedLossTonnes || 200} T)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Protected Production:</span>
                  <strong className="text-telemetry-400">+{bestOpt.protectedTonnes?.toLocaleString() || 1150} T</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Prescribed Protocol:</span>
                  <strong className="text-manganese-300">{p.actionId || 'PROTO-AP-04'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Calculated ROI:</span>
                  <strong className="text-[#272A27]">{bestOpt.roi || '9.4x'}</strong>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-telemetry-950/60 text-[11px] text-telemetry-200 border border-telemetry-500/30">
              Recovers &gt;85% of lost tonnage via multi-vector balancing.
            </div>
          </div>

        </div>

        {/* Action Trigger Banner */}
        <div className="p-4 rounded-xl bg-obsidian-950/90 border border-obsidian-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="text-zinc-400">
            Status: {decisionStage === 'APPROVED' ? (
              <span className="text-telemetry-400 font-bold">Protocol {p.actionId} Authorized by Operator &amp; Logged to Audit Ledger</span>
            ) : (
              <span className="text-manganese-400 font-bold">Operator Authorization Pending for Protocol {p.actionId}</span>
            )}
          </div>

          {decisionStage !== 'APPROVED' && (
            <button
              onClick={() => setIsDecisionModalOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-manganese-500 to-amber-500 hover:from-manganese-400 hover:to-amber-400 text-obsidian-950 font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all hover:scale-105"
            >
              <Zap className="w-4 h-4" />
              <span>Review &amp; Authorize Prescription</span>
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
