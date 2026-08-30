import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ChevronRight,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Activity,
  TrendingUp,
  Compass,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { AetherStatusBadge } from './AetherStatusBadge.jsx';

/**
 * AETHER Intelligence & Explainability Component
 * High-contrast AI insight panel with anomaly detection, confidence levels,
 * SHAP-style primary driver contribution bars, and actionable mitigation triggers.
 */
export const AetherInsightPanel = ({
  title = 'AETHER INTELLIGENCE & EXPLAINABILITY',
  subtitle = 'Prescriptive AI Diagnostics, Anomaly Telemetry & SHAP Driver Contributions',
  insights = [],
  className = ''
}) => {
  const [selectedInsightId, setSelectedInsightId] = useState(insights[0]?.id || null);

  // Default demonstration insights if none provided
  const defaultInsights = [
    {
      id: 'INS-01',
      mineName: 'Gumgaon Mine',
      mineId: 'gumgaon',
      category: 'ELECTROMECHANICAL',
      title: 'Crusher Bearing Seizure Risk Detected',
      anomalyText: 'Harmonic vibration drift â†‘ 18% in primary gyratory crusher',
      severity: 'CRITICAL',
      confidence: '96.4%',
      modelSource: 'TreeSHAP & XGBoost GBM v1.0',
      drivers: [
        { name: 'Bearing Thermal Gradient (88Â°C)', impact: 42, direction: 'risk' },
        { name: 'Harmonic Vibration RMS (6.8 mm/s)', impact: 34, direction: 'risk' },
        { name: 'Crusher Liner Wear Index', impact: 14, direction: 'risk' },
        { name: 'Lubrication Viscosity Margin', impact: -10, direction: 'safe' }
      ],
      recommendation: 'Initiate statutory secondary cone crusher switchover under DGMS Rule 104.',
      actionPath: '/protocol',
      actionLabel: 'OPEN STATUTORY PROTOCOL'
    },
    {
      id: 'INS-02',
      mineName: 'Balaghat Mine',
      mineId: 'balaghat',
      category: 'PRODUCTION YIELD',
      title: 'Production Variance Deficit Alert',
      anomalyText: '14-day production forecast shortfall: -1,382 MT vs Quota',
      severity: 'HIGH',
      confidence: '94.8%',
      modelSource: 'Bayesian Time-Series Forecast Engine',
      drivers: [
        { name: 'Underground Sump Influx (+410 mÂ³/h)', impact: 38, direction: 'risk' },
        { name: 'Stope Face Mucking Cycle Delay', impact: 28, direction: 'risk' },
        { name: 'Holmes Shaft Winder Throughput', impact: -16, direction: 'safe' }
      ],
      recommendation: 'Activate auxiliary diesel-electric dewatering pump battery at -185m level.',
      actionPath: '/alert-engine',
      actionLabel: 'INSPECT THREAT MATRIX'
    },
    {
      id: 'INS-03',
      mineName: 'Tirodi Mine',
      mineId: 'tirodi',
      category: 'GEOSPATIAL / UNFC',
      title: 'Satellite SWIR Braunite Mineralization Peak',
      anomalyText: 'Sentinel-2 Band 11/12 reflectance reveals +1.8M Tonnes unclassified vein',
      severity: 'OPTIMAL',
      confidence: '92.1%',
      modelSource: 'Spectral Remote Sensing & Random Forest UNFC Classifier',
      drivers: [
        { name: 'SWIR 2.19Âµm Manganese Alteration Index', impact: 48, direction: 'safe' },
        { name: 'Sausar Group Structural Syncline Dip (45Â°)', impact: 32, direction: 'safe' },
        { name: 'NDVI Vegetation Disturbance Deficit', impact: -8, direction: 'risk' }
      ],
      recommendation: 'Schedule 3 diamond core confirmation boreholes at Grid Point T-04.',
      actionPath: '/reserve-radar',
      actionLabel: 'EXPLORE RESERVE RADAR'
    }
  ];

  const activeInsightList = (insights && insights.length > 0) ? insights : defaultInsights;
  const activeInsight = activeInsightList.find(i => i.id === selectedInsightId) || activeInsightList[0];

  return (
    <div className={`bg-white border border-[#CBD5E1] rounded-xl shadow-sm overflow-hidden ${className}`}>

      {/* Header */}
      <div className="px-5 py-4 bg-[#F1F5F9] border-b border-[#CBD5E1] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#0F172A] font-display flex items-center gap-2">
              {title}
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-100 text-cyan-900 border border-cyan-300">
                {activeInsightList.length} SIGNALS
              </span>
            </h3>
            <p className="text-[11px] text-[#475569] font-sans">
              {subtitle}
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#334155]">
          <Activity className="w-3.5 h-3.5 text-emerald-700" />
          Continuous Diagnostic Evaluation
        </span>
      </div>

      {/* Main Grid: Left Selector List, Right Explainability Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#CBD5E1]">

        {/* Left 5 Cols: Insight Signal Stream */}
        <div className="lg:col-span-5 p-3 space-y-2.5 bg-[#F8FAFC] overflow-y-auto max-h-[420px]">
          {activeInsightList.map((ins) => {
            const isSelected = (activeInsight?.id === ins.id);
            return (
              <button
                key={ins.id}
                onClick={() => setSelectedInsightId(ins.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
                    : 'bg-white border-[#CBD5E1] hover:border-[#94A3B8] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-[#0F172A] font-display">
                      {ins.mineName}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#64748B]">
                      â€¢ {ins.category || 'OPERATIONAL'}
                    </span>
                  </div>
                  <AetherStatusBadge status={ins.severity} size="sm" pulse={isSelected} />
                </div>

                <p className="text-xs text-[#1E293B] font-semibold leading-snug">
                  {ins.anomalyText || ins.title}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#475569] pt-1.5 border-t border-[#E2E8F0]">
                  <span>Confidence: <strong className="text-[#0F172A] font-bold">{ins.confidence}</strong></span>
                  <span className="text-amber-700 font-bold flex items-center gap-0.5">
                    Details <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right 7 Cols: Full Explainability & Recommended Action */}
        <div className="lg:col-span-7 p-5 bg-white space-y-4">
          <AnimatePresence mode="wait">
            {activeInsight && (
              <motion.div
                key={activeInsight.id}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 text-left"
              >
                {/* Header detail */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0891B2]">
                      {activeInsight.modelSource || 'Bayesian AI Diagnostic Engine'}
                    </span>
                    <h4 className="text-base font-black text-[#0F172A] font-display">
                      {activeInsight.title}
                    </h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono font-bold text-[#64748B] block">CONFIDENCE SCORE</span>
                    <span className="text-base font-black text-emerald-700 font-mono">
                      {activeInsight.confidence}
                    </span>
                  </div>
                </div>

                {/* Primary Drivers (SHAP Explainability Waterfall Bars) */}
                {activeInsight.drivers && activeInsight.drivers.length > 0 && (
                  <div className="space-y-2 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1]">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#334155] uppercase font-mono">
                      <span className="flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-amber-600" />
                        PRIMARY EXPLANATORY DRIVERS (SHAP)
                      </span>
                      <span className="text-[10px] text-[#64748B]">CONTRIBUTION %</span>
                    </div>

                    <div className="space-y-2 pt-1">
                      {activeInsight.drivers.map((drv, idx) => {
                        const isRisk = drv.direction === 'risk' || drv.impact > 0;
                        const widthPct = Math.min(100, Math.abs(drv.impact) * 2);
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="text-[#0F172A] font-semibold">{drv.name}</span>
                              <span className={`font-bold ${isRisk ? 'text-red-700' : 'text-emerald-700'}`}>
                                {drv.impact > 0 ? `+${drv.impact}%` : `${drv.impact}%`}
                              </span>
                            </div>
                            {/* Visual Driver Contribution Bar */}
                            <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden flex">
                              <div
                                style={{ width: `${widthPct}%` }}
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isRisk ? 'bg-red-600' : 'bg-emerald-600'
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Prescriptive Recommended Action Box */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono font-black text-amber-900 uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-amber-700" />
                      RECOMMENDED OPERATIONAL ACTION
                    </span>
                    <p className="text-xs text-[#0F172A] font-bold">
                      {activeInsight.recommendation}
                    </p>
                  </div>

                  {activeInsight.actionPath && (
                    <Link
                      to={activeInsight.actionPath}
                      className="px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold font-mono uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
                    >
                      <span>{activeInsight.actionLabel || 'EXECUTE ACTION'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    </Link>
                  )}
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};
