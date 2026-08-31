import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  TrendingDown,
  AlertTriangle,
  ShieldCheck,
  Clock,
  BarChart3,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';

export const PredictionPanel = () => {
  const { activeScenario } = useApp();

  if (!activeScenario) return null;

  const pred = activeScenario.prediction;

  return (
    <div className="panel-surface p-6 sm:p-8 border border-hazard-500/30 font-mono text-xs space-y-6 shadow-2xl animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-hazard-500/20 border border-hazard-500/30 flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-hazard-400" />
          </div>
          <div>
            <div className="text-[10px] text-hazard-400 font-bold uppercase tracking-wider">
              STEP 2 // QUANTITATIVE RISK PREDICTION
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              Deterministic Shortfall &amp; Impact Projection
            </h3>
          </div>
        </div>

        <div className="px-2.5 py-0.5 rounded bg-[#F0EBE2] border border-[#C8BFAF] text-[10px] text-[#5F625C] self-start sm:self-auto font-bold tracking-wider">
          DEMONSTRATION PREDICTION
        </div>
      </div>

      {/* 4-Box Prediction Telemetry Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Production at Risk */}
        <div className="p-4 rounded-xl bg-[#F0EBE2] border border-hazard-500/30 space-y-1">
          <div className="text-[10px] text-[#85877E] uppercase tracking-wider">
            PRODUCTION AT RISK
          </div>
          <div className="text-2xl font-bold text-hazard-400 tracking-tight">
            {pred.productionAtRiskFormatted}
          </div>
          <div className="text-[11px] text-hazard-300/80">
            {pred.expectedImpact}
          </div>
        </div>

        {/* Shortfall Probability */}
        <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-1">
          <div className="text-[10px] text-[#85877E] uppercase tracking-wider">
            SHORTFALL PROBABILITY
          </div>
          <div className="text-2xl font-bold text-manganese-400 tracking-tight">
            {pred.shortfallProbability}
          </div>
          <div className="text-[11px] text-[#5F625C]">
            Bayesian Prior Calibrated
          </div>
        </div>

        {/* Prediction Horizon */}
        <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-1">
          <div className="text-[10px] text-[#85877E] uppercase tracking-wider">
            TIME HORIZON
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {pred.horizon}
          </div>
          <div className="text-[11px] text-[#5F625C]">
            Pre-Impact Lead Time
          </div>
        </div>

        {/* Model Confidence */}
        <div className="p-4 rounded-xl bg-[#F0EBE2] border border-telemetry-500/30 space-y-1">
          <div className="text-[10px] text-[#85877E] uppercase tracking-wider">
            MODEL CONFIDENCE
          </div>
          <div className="text-2xl font-bold text-telemetry-400 tracking-tight">
            {pred.modelConfidence}
          </div>
          <div className="text-[11px] text-telemetry-300/80">
            95% Confidence Band
          </div>
        </div>

      </div>

    </div>
  );
};
