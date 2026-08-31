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
    <section className="command-container py-4">
      <div className="panel-surface p-6 sm:p-8 border border-[#C8BFAF] shadow-mineral-md relative overflow-hidden bg-[#F0EBE2]">

        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#C8BFAF] mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#C84B3F]/15 border border-[#C84B3F]/40 text-[#8F2D24] text-[11px] font-bold uppercase tracking-wider font-mono">
                {activeScenario.code || 'SCENARIO STRESS INJECTION'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#DDD4C5] text-[#5F625C] font-mono font-bold">
                SYNTHETIC SIMULATION DATA
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#272A27] mt-2">
              Live Decision Delta — {activeScenario.title || activeScenario.detectionHeadline || activeScenario.scenarioId || 'Simulation State'}
            </h3>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-[#5F625C] bg-[#F5F1E9] px-3.5 py-1.5 rounded-xl border border-[#C8BFAF]">
            <span>Confidence: <strong className="text-[#3D8C8A] font-bold">{confidence}</strong></span>
            <span className="text-[#85877E]">•</span>
            <span>Horizon: <strong className="text-[#272A27] font-bold">{timeHorizon}</strong></span>
          </div>
        </div>

        {/* 3-Column Progression: BEFORE BASELINE -> UNMITIGATED THREAT -> AI OPTIMIZED COUNTERMEASURE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch mb-6">

          {/* Col 1: Baseline Before Scenario */}
          <div className="p-5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] space-y-4 font-mono text-xs flex flex-col justify-between shadow-xs">
            <div>
              <div className="text-[10px] text-[#5F625C] uppercase tracking-wider mb-1 flex items-center justify-between font-bold">
                <span>01 // BEFORE BASELINE</span>
                <span className="text-[#3D8C8A] font-bold">PRE-SHOCK</span>
              </div>
              <div className="text-base font-bold text-[#272A27] mb-4">
                Nominal Mining Rate
              </div>

              <div className="space-y-2 text-[#5F625C]">
                <div className="flex justify-between">
                  <span>Daily Target:</span>
                  <strong className="text-[#272A27] font-bold">{b.dailyProduction?.toLocaleString() || 6200} TPD</strong>
                </div>
                <div className="flex justify-between">
                  <span>Shortfall Risk:</span>
                  <strong className="text-[#3D8C8A] font-bold">Low (&lt;10%)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Fleet Availability:</span>
                  <strong className="text-[#272A27] font-bold">{b.fleetAvailability || '88.0%'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Water Table Inflow:</span>
                  <strong className="text-[#3D8C8A] font-bold">{b.waterIngressRate || '12 m³/h'}</strong>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#E8E1D5] text-[11px] text-[#5F625C] border border-[#C8BFAF] font-sans">
              Shift operating at 100% quota compliance.
            </div>
          </div>

          {/* Col 2: Unmitigated Threat Impact */}
          <div className="p-5 rounded-xl bg-[#FBF0EE] border border-[#EAA29A] space-y-4 font-mono text-xs flex flex-col justify-between shadow-xs">
            <div>
              <div className="text-[10px] text-[#C84B3F] uppercase tracking-wider mb-1 flex items-center justify-between font-bold">
                <span>02 // UNMITIGATED THREAT</span>
                <span className="text-[#C84B3F] font-bold animate-pulse">AT RISK</span>
              </div>
              <div className="text-base font-bold text-[#8F2D24] mb-4">
                {b.unmitigatedLossTonnes?.toLocaleString() || 1350} Tonnes at Risk ({b.unmitigatedLossPct || '-21.8%'})
              </div>

              <div className="space-y-2 text-[#5F625C]">
                <div className="flex justify-between">
                  <span>Predicted Yield:</span>
                  <strong className="text-[#C84B3F] font-bold">{b.predictedYield?.toLocaleString() || 4850} TPD</strong>
                </div>
                <div className="flex justify-between">
                  <span>Threat Deficit:</span>
                  <strong className="text-[#C84B3F] font-bold">-{b.unmitigatedLossTonnes?.toLocaleString() || 1350} T</strong>
                </div>
                <div className="flex justify-between">
                  <span>Shortfall Probability:</span>
                  <strong className="text-[#C84B3F] font-bold">{b.shortfallRisk || '84.2%'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Primary Stressor:</span>
                  <strong className="text-[#272A27] font-bold truncate max-w-[140px]">{primaryStressor.split('(')[0]}</strong>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#F8E3E0] text-[11px] text-[#8F2D24] border border-[#EAA29A] font-sans">
              Without intervention, target quota fails by {b.unmitigatedLossPct || '-21.8%'}.
            </div>
          </div>

          {/* Col 3: AI Optimized Response */}
          <div className="p-5 rounded-xl bg-[#EEF5F0] border border-[#9DC4A5] space-y-4 font-mono text-xs flex flex-col justify-between shadow-xs">
            <div>
              <div className="text-[10px] text-[#4A5845] uppercase tracking-wider mb-1 flex items-center justify-between font-bold">
                <span>03 // AI OPTIMIZED RESPONSE</span>
                <span className="text-[#4A5845] font-bold">RECOVERED</span>
              </div>
              <div className="text-base font-bold text-[#355239] mb-4">
                {p.protectedYield || '+1,150 T/day'} Protected
              </div>

              <div className="space-y-2 text-[#5F625C]">
                <div className="flex justify-between">
                  <span>Restricted Loss:</span>
                  <strong className="text-[#355239] font-bold">{bestOpt.expectedLossPct || '-3.2%'} (Only {bestOpt.expectedLossTonnes || 200} T)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Protected Production:</span>
                  <strong className="text-[#355239] font-bold">+{bestOpt.protectedTonnes?.toLocaleString() || 1150} T</strong>
                </div>
                <div className="flex justify-between">
                  <span>Prescribed Protocol:</span>
                  <strong className="text-[#C46A32] font-bold">{p.actionId || 'PROTO-AP-04'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Calculated ROI:</span>
                  <strong className="text-[#272A27] font-bold">{bestOpt.roi || '9.4x'}</strong>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#E2ECE4] text-[11px] text-[#355239] border border-[#9DC4A5] font-sans">
              Recovers &gt;85% of lost tonnage via multi-vector balancing.
            </div>
          </div>

        </div>

        {/* Action Trigger Banner */}
        <div className="p-4 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="text-[#5F625C]">
            Status: {decisionStage === 'APPROVED' ? (
              <span className="text-[#4A5845] font-bold">Protocol {p.actionId} Authorized by Operator &amp; Logged to Audit Ledger</span>
            ) : (
              <span className="text-[#C46A32] font-bold">Operator Authorization Pending for Protocol {p.actionId}</span>
            )}
          </div>

          {decisionStage !== 'APPROVED' && (
            <button
              onClick={() => setIsDecisionModalOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-[#C46A32] hover:bg-[#B05924] text-white font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
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
