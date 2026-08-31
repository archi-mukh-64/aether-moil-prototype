import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  ArrowRight,
  ArrowDownRight,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Activity,
  SlidersHorizontal,
  ShieldCheck,
  Zap,
  RotateCcw
} from 'lucide-react';

export const ScenarioDiffIndicator = () => {
  const { activeScenario, activeMine, resetBaseline, t, lang } = useApp();
  const scen = t?.scenarioLab || {};
  const comm = t?.common || {};

  if (!activeScenario) return null;

  const prediction = activeScenario.prediction || {
    unmitigatedYieldTonnes: 4850,
    projectedLossTonnes: 1350,
    projectedLossPercentage: '21.8%',
    shortfallProbability: '84.2%'
  };

  const effectiveMetrics = activeScenario.effectiveMetrics || {
    effectiveIngress: 38.6,
    drainageUtilizationPct: 88.0
  };

  const statusLevel = activeScenario.statusLevel || 'HIGH';
  const detectionScore = activeScenario.detectionScore || '0.86';

  const baselineYield = typeof activeMine?.dailyTarget === 'number' ? activeMine.dailyTarget : 6200;
  const simulatedYield = prediction.unmitigatedYieldTonnes || prediction.unmitigatedYield || (baselineYield - (prediction.projectedLossTonnes || 1350));

  const baselineSensitivity = typeof activeMine?.rainfallSensitivity === 'number' ? activeMine.rainfallSensitivity : 1.0;
  const baselineRisk = `${Math.round(baselineSensitivity * 18)}%`;
  const scenarioRisk = prediction.shortfallProbability || '74.2%';

  const fleetAvailBase = typeof activeMine?.fleetAvailabilityBase === 'number'
    ? activeMine.fleetAvailabilityBase
    : (typeof activeMine?.fleetAvailability === 'number' ? activeMine.fleetAvailability : 88.0);

  const baselineFleet = `${fleetAvailBase}%`;
  const lossPctNum = parseFloat(prediction.projectedLossPercentage) || 15.0;
  const scenarioFleet = `${Math.max(45, Math.round(fleetAvailBase - (lossPctNum * 0.8)))}%`;

  const baselineWater = `${activeMine?.drainageBaselineM3h || 12} m³/h`;
  const scenarioWater = `${effectiveMetrics.effectiveIngress || ((activeMine?.drainageBaselineM3h || 12) + 24)} m³/h`;
  const baselineTrust = '95.4%';
  const scenarioTrust = activeScenario.modelConfidence || '91.4%';

  return (
    <div className="panel-surface p-5 sm:p-6 border border-manganese-500/40 bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-950 font-mono text-xs shadow-2xl animate-fade-in space-y-4 rounded-2xl select-none">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#C8BFAF]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-manganese-400 animate-ping" />
          <span className="font-bold text-[#272A27] uppercase text-xs">
            {lang === 'hi' ? 'डेल्टा अंतर तुलना:' : lang === 'mr' ? 'डेल्टा फरक तुलना:' : 'DELTA COMPARISON:'} {activeMine?.shortName || activeMine?.name || 'Mine'} ({lang === 'hi' ? 'आधारभूत बनाम परिदृश्य' : lang === 'mr' ? 'पायाभूत वि. परिस्थिती' : 'BASELINE vs SCENARIO'})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#5F625C]">
            {lang === 'hi' ? 'परिदृश्य:' : lang === 'mr' ? 'परिस्थिती:' : 'Scenario:'} <strong className="text-manganese-400">{activeScenario.scenarioId || 'MONSOON'}</strong> ({activeScenario.severity || 'HIGH'})
          </span>
          <button
            onClick={resetBaseline}
            className="px-2.5 py-1 rounded-lg bg-[#C8BFAF] hover:bg-obsidian-700 text-[#272A27] hover:text-[#272A27] text-[10px] font-bold transition-colors flex items-center gap-1 border border-[#C8BFAF]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{lang === 'hi' ? 'आधारभूत स्थिति रीसेट करें' : lang === 'mr' ? 'पायाभूत स्थिती रीसेट करा' : 'RESET BASELINE'}</span>
          </button>
        </div>
      </div>

      {/* 6-Metric Delta Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">

        {/* Metric 1: Daily Production */}
        <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-1">
          <div className="text-[10px] text-[#85877E] uppercase font-bold">{comm.production || 'Production'}</div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#5F625C]">{baselineYield.toLocaleString()}</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-hazard-400 flex-shrink-0" />
            <strong className="text-hazard-400">{simulatedYield.toLocaleString()} T/d</strong>
          </div>
          <div className="text-[9px] text-hazard-400/80">-{prediction.projectedLossPercentage || '21.8%'}</div>
        </div>

        {/* Metric 2: Shortfall Risk */}
        <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-1">
          <div className="text-[10px] text-[#85877E] uppercase font-bold">{lang === 'hi' ? 'कमी जोखिम' : lang === 'mr' ? 'तूट जोखीम' : 'Shortfall Risk'}</div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#5F625C]">{baselineRisk}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-hazard-400 flex-shrink-0" />
            <strong className="text-hazard-400">{scenarioRisk}</strong>
          </div>
          <div className="text-[9px] text-hazard-400/80">+{statusLevel}</div>
        </div>

        {/* Metric 3: Fleet Health */}
        <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-1">
          <div className="text-[10px] text-[#85877E] uppercase font-bold">{lang === 'hi' ? 'फ्लीट स्वास्थ्य' : lang === 'mr' ? 'फ्लीट आरोग्य' : 'Fleet Health'}</div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#5F625C]">{baselineFleet}</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-manganese-400 flex-shrink-0" />
            <strong className="text-manganese-300">{scenarioFleet}</strong>
          </div>
          <div className="text-[9px] text-[#85877E]">{lang === 'hi' ? 'ढुलाई ड्रैग प्रभाव' : lang === 'mr' ? 'वाहतूक ड्रॅग प्रभाव' : 'Haul Drag Effect'}</div>
        </div>

        {/* Metric 4: Sump Inflow */}
        <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-1">
          <div className="text-[10px] text-[#85877E] uppercase font-bold">{lang === 'hi' ? 'सम्प अंतर्वाह' : lang === 'mr' ? 'सम्प प्रवाह' : 'Sump Inflow'}</div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#5F625C]">{baselineWater}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <strong className="text-cyan-300">{scenarioWater}</strong>
          </div>
          <div className="text-[9px] text-cyan-400/80">{effectiveMetrics.drainageUtilizationPct || 88}% Cap</div>
        </div>

        {/* Metric 5: Overall Threat */}
        <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-1">
          <div className="text-[10px] text-[#85877E] uppercase font-bold">{lang === 'hi' ? 'समग्र खतरा' : lang === 'mr' ? 'एकूण धोका' : 'Overall Threat'}</div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-telemetry-400">{comm.optimal || 'NOMINAL'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#85877E] flex-shrink-0" />
            <strong className="text-hazard-400">{statusLevel}</strong>
          </div>
          <div className="text-[9px] text-[#85877E]">{lang === 'hi' ? 'स्कोर:' : lang === 'mr' ? 'गुण:' : 'Score:'} {detectionScore}</div>
        </div>

        {/* Metric 6: Trust Score */}
        <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-1">
          <div className="text-[10px] text-[#85877E] uppercase font-bold">{lang === 'hi' ? 'विश्वास अंशांकन' : lang === 'mr' ? 'विश्वास कॅलिब्रेशन' : 'Trust Calibration'}</div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#5F625C]">{baselineTrust}</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-telemetry-400 flex-shrink-0" />
            <strong className="text-telemetry-300">{scenarioTrust}</strong>
          </div>
          <div className="text-[9px] text-telemetry-400/80">{lang === 'hi' ? 'बायेसियन सीमा' : lang === 'mr' ? 'बायेशियन मर्यादा' : 'Bayesian Bound'}</div>
        </div>

      </div>

    </div>
  );
};
