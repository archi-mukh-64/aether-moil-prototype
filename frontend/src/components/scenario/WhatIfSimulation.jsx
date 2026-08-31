import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Layers,
  Zap,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const WhatIfSimulation = () => {
  const { activeScenario } = useApp();

  if (!activeScenario) return null;

  const sim = activeScenario.whatIfSimulation;
  if (!sim) return null;

  return (
    <div className="panel-surface p-6 sm:p-8 border border-telemetry-500/30 font-mono text-xs space-y-6 shadow-2xl animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-telemetry-500/20 border border-telemetry-500/30 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-telemetry-400" />
          </div>
          <div>
            <div className="text-[10px] text-telemetry-400 font-bold uppercase tracking-wider">
              STEP 6 // WHAT-IF OUTCOME SIMULATION
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              Comparative Impact: Without vs With AI Prescription
            </h3>
          </div>
        </div>

        <div className="px-2.5 py-0.5 rounded bg-[#F0EBE2] border border-[#C8BFAF] text-[10px] text-[#5F625C] self-start sm:self-auto font-bold tracking-wider">
          SYNTHETIC DEMONSTRATION VALUES
        </div>
      </div>

      {/* Two Comparative Panels + Center Delta */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Left Column: Without Intervention (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-hazard-950/20 border border-hazard-500/30 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-hazard-500/20">
              <span className="text-hazard-400 font-bold uppercase tracking-wider text-xs">
                WITHOUT INTERVENTION
              </span>
              <span className="px-2 py-0.5 rounded bg-hazard-500/20 text-hazard-300 text-[9px] font-bold">
                STATUS QUO
              </span>
            </div>

            <div className="space-y-3 pt-3">
              <div className="flex justify-between">
                <span className="text-[#5F625C]">Daily Production:</span>
                <strong className="text-hazard-400 text-sm">{sim.withoutIntervention.production.toLocaleString()} T</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5F625C]">Shortfall Deficit:</span>
                <strong className="text-hazard-400 text-sm">-{sim.withoutIntervention.shortfall.toLocaleString()} T</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5F625C]">Risk Score:</span>
                <strong className="text-hazard-300">{sim.withoutIntervention.riskScore}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5F625C]">Fleet Availability:</span>
                <strong className="text-white">{sim.withoutIntervention.fleetAvailability}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5F625C]">Expected Downtime:</span>
                <strong className="text-hazard-400">{sim.withoutIntervention.downtimeHours} Hours</strong>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-hazard-950/40 text-[11px] text-hazard-300 border border-hazard-500/20">
            Unmitigated financial loss: <strong>{sim.withoutIntervention.netLossINR}</strong>
          </div>
        </div>

        {/* Right Column: With AI Recommendation (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-telemetry-950/20 border border-telemetry-500/40 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-telemetry-500/20">
              <span className="text-telemetry-400 font-bold uppercase tracking-wider text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-telemetry-400" />
                <span>WITH AI RECOMMENDATION</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-telemetry-500/20 text-telemetry-300 text-[9px] font-bold">
                OPTIMIZED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#5F625C]">Protected Production:</span>
                  <strong className="text-telemetry-300 text-sm">{sim.withAiRecommendation.production.toLocaleString()} T</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#5F625C]">Residual Deficit:</span>
                  <strong className="text-emerald-400 text-sm">-{sim.withAiRecommendation.shortfall} T</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#5F625C]">Mitigated Risk:</span>
                  <strong className="text-telemetry-400">{sim.withAiRecommendation.riskScore}</strong>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#5F625C]">Fleet Availability:</span>
                  <strong className="text-white">{sim.withAiRecommendation.fleetAvailability}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#5F625C]">Downtime Restrained:</span>
                  <strong className="text-telemetry-400">{sim.withAiRecommendation.downtimeHours} Hours</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#5F625C]">Protected Net Value:</span>
                  <strong className="text-manganese-300">{sim.delta.valueProtectedINR}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Big Delta Callout Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-telemetry-950/50 border border-telemetry-500/30 text-center font-mono">
            <div>
              <div className="text-[10px] text-[#5F625C] uppercase">RISK REDUCED</div>
              <div className="text-lg font-bold text-telemetry-400 mt-0.5">
                {sim.delta.riskReducedPct}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-[#5F625C] uppercase">YIELD PROTECTED</div>
              <div className="text-lg font-bold text-white mt-0.5">
                +{sim.delta.productionProtectedTonnes.toLocaleString()} T
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <div className="text-[10px] text-[#5F625C] uppercase">DOWNTIME SAVED</div>
              <div className="text-lg font-bold text-manganese-400 mt-0.5">
                {sim.delta.downtimeSavedHours} Hours
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
