import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  Terminal,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Cpu,
  Activity,
  ShieldCheck,
  Zap,
  Code
} from 'lucide-react';

export const PipelineInspector = () => {
  const { activeScenario, activeMine, selectedMineId, scenarioSeverity, scenarioTimeHorizon } = useApp();

  if (!activeScenario) {
    return (
      <div className="panel-surface p-8 border border-[#C8BFAF] font-mono text-xs text-center space-y-3">
        <Terminal className="w-8 h-8 text-[#85877E] mx-auto animate-pulse" />
        <h4 className="font-bold text-white text-sm">INTELLIGENCE PIPELINE INSPECTOR</h4>
        <p className="text-[#85877E] max-w-md mx-auto">
          No stress anomaly injected. Select a scenario and stress level above to inspect the step-by-step causal derivation pipeline.
        </p>
      </div>
    );
  }

  const isDetected = !!activeScenario.isDetected;
  const statusLevel = activeScenario.statusLevel || 'NOMINAL';
  const thresholdSummary = activeScenario.thresholdSummary || 'Operational threshold evaluation nominal.';
  const prediction = activeScenario.prediction || {
    productionAtRiskFormatted: '0 T',
    shortfallProbability: '5%',
    modelConfidence: '95.0%'
  };
  const recommendation = activeScenario.recommendation || {
    actionId: 'PROTO-AP-01',
    protectedYield: '+0 T'
  };
  const signals = Array.isArray(activeScenario.signals) ? activeScenario.signals : [];
  const mineName = activeMine?.name || 'Balaghat Mine';

  return (
    <div className="panel-surface p-6 sm:p-8 border border-telemetry-500/40 bg-gradient-to-b from-telemetry-950/15 via-obsidian-900 to-obsidian-950 font-mono text-xs space-y-6 shadow-2xl animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-telemetry-500/20 border border-telemetry-500/30 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-telemetry-400" />
          </div>
          <div>
            <div className="text-[10px] text-telemetry-400 font-bold uppercase tracking-wider">
              CAUSAL INFERENCE PIPELINE TRACER
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              Deterministic Decision Pipeline: {mineName}
            </h3>
          </div>
        </div>

        <div className="px-2.5 py-1 rounded-lg bg-[#F0EBE2] border border-[#C8BFAF] text-[10px] text-[#5F625C] font-bold">
          DEMO INTELLIGENCE SIMULATOR
        </div>
      </div>

      {/* 5-Step Pipeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

        {/* Step 1: Inputs */}
        <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-2">
          <div className="flex items-center justify-between text-[10px] text-[#85877E] font-bold pb-1 border-b border-obsidian-850">
            <span>01 // INPUTS</span>
            <Layers className="w-3 h-3 text-[#5F625C]" />
          </div>
          <div className="space-y-1 text-[11px]">
            <div>Mine: <strong className="text-white">{mineName.split(' ')[0]}</strong></div>
            <div>Stress: <strong className="text-manganese-400">{scenarioSeverity || 'HIGH'}</strong></div>
            <div>Window: <strong className="text-[#272A27]">{scenarioTimeHorizon || '24 HOURS'}</strong></div>
            <div>Target: <strong className="text-[#272A27]">{activeMine?.dailyTarget?.toLocaleString() || 6200} TPD</strong></div>
          </div>
        </div>

        {/* Step 2: Features */}
        <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-2">
          <div className="flex items-center justify-between text-[10px] text-[#85877E] font-bold pb-1 border-b border-obsidian-850">
            <span>02 // FEATURES</span>
            <Activity className="w-3 h-3 text-[#5F625C]" />
          </div>
          <div className="space-y-1 text-[11px]">
            {signals.slice(0, 2).map((s, idx) => {
              const sigName = typeof s.name === 'string' ? s.name : 'Signal';
              return (
                <div key={idx} className="truncate">
                  <span className="text-[#85877E]">{sigName.split(' ')[0]}:</span> <strong className="text-[#272A27]">{s.value || 'Nominal'}</strong>
                </div>
              );
            })}
            <div>Drift: <strong className="text-hazard-400">{signals[0]?.magnitude || '0%'}</strong></div>
          </div>
        </div>

        {/* Step 3: Detection */}
        <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-2">
          <div className="flex items-center justify-between text-[10px] text-[#85877E] font-bold pb-1 border-b border-obsidian-850">
            <span>03 // DETECTION</span>
            <Cpu className="w-3 h-3 text-[#5F625C]" />
          </div>
          <div className="space-y-1 text-[11px]">
            <div>Score: <strong className="text-telemetry-400">{activeScenario.detectionScore || '0.85'}</strong></div>
            <div>Threshold: <strong className={isDetected ? 'text-hazard-400' : 'text-telemetry-400'}>{isDetected ? 'EXCEEDED' : 'NOMINAL'}</strong></div>
            <div>Status: <span className="badge-hazard text-[9px]">{statusLevel}</span></div>
          </div>
        </div>

        {/* Step 4: Prediction */}
        <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-2">
          <div className="flex items-center justify-between text-[10px] text-[#85877E] font-bold pb-1 border-b border-obsidian-850">
            <span>04 // PREDICTION</span>
            <Zap className="w-3 h-3 text-[#5F625C]" />
          </div>
          <div className="space-y-1 text-[11px]">
            <div>At Risk: <strong className="text-hazard-400">{prediction.productionAtRiskFormatted || '0 T'}</strong></div>
            <div>Prob: <strong className="text-manganese-400">{prediction.shortfallProbability || '0%'}</strong></div>
            <div>Confidence: <strong className="text-telemetry-400">{prediction.modelConfidence || '95%'}</strong></div>
          </div>
        </div>

        {/* Step 5: Prescription */}
        <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-2">
          <div className="flex items-center justify-between text-[10px] text-[#85877E] font-bold pb-1 border-b border-obsidian-850">
            <span>05 // PRESCRIPTION</span>
            <ShieldCheck className="w-3 h-3 text-[#5F625C]" />
          </div>
          <div className="space-y-1 text-[11px]">
            <div>SOP: <strong className="text-manganese-400">{recommendation.actionId || 'AP-01'}</strong></div>
            <div>Protected: <strong className="text-telemetry-400">{recommendation.protectedYield || '+0 T'}</strong></div>
            <div>Status: <span className="badge-telemetry text-[9px]">READY</span></div>
          </div>
        </div>

      </div>

      {/* Threshold Evaluation Context */}
      <div className="p-4 rounded-xl bg-[#F0EBE2]/90 border border-[#C8BFAF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-telemetry-400 flex-shrink-0" />
          <span>Evaluation Rationale: <strong className="text-white">{thresholdSummary}</strong></span>
        </div>
        <span className="text-[#85877E] text-[11px]">Calibrated with Mine Operational Constraints</span>
      </div>

    </div>
  );
};
