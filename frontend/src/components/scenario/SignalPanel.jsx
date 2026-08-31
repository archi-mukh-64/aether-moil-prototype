import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  Activity,
  Radio,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';

export const SignalPanel = () => {
  const { activeScenario, selectedMineId, t, lang } = useApp();
  const scen = t?.scenarioLab || {};
  const comm = t?.common || {};

  if (!activeScenario) {
    return (
      <div className="panel-surface p-6 sm:p-8 border border-[#C8BFAF] font-mono text-xs text-center space-y-3 select-none">
        <Radio className="w-8 h-8 text-[#85877E] mx-auto animate-pulse" />
        <h4 className="font-bold text-white text-sm">
          {lang === 'hi' ? 'चरण 1 // सिग्नल पहचान' : lang === 'mr' ? 'टप्पा 1 // सिग्नल शोध' : 'STEP 1 // SIGNAL DETECTION'}
        </h4>
        <p className="text-[#85877E] max-w-md mx-auto">
          {lang === 'hi'
            ? 'कोई तनाव विसंगति सक्रिय नहीं है। वास्तविक समय टेलीमेट्री विचलन देखने के लिए ऊपर एक परिदृश्य चुनें।'
            : lang === 'mr'
            ? 'कोणतीही ताण विसंगती सक्रिय नाही. थेट टेलीमेट्री विचलन पाहण्यासाठी वरील परिस्थिती निवडा.'
            : 'No stress anomaly active. Select a scenario above to observe real-time telemetry drift and causal propagation.'}
        </p>
      </div>
    );
  }

  const causal = activeScenario.causalChain || [];

  return (
    <div className="panel-surface p-6 sm:p-8 border border-hazard-500/40 bg-gradient-to-b from-hazard-950/15 via-obsidian-900 to-obsidian-950 font-mono text-xs space-y-6 shadow-2xl animate-fade-in select-none">

      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-hazard-500/20 border border-hazard-500/30 flex items-center justify-center">
            <Radio className="w-4 h-4 text-hazard-400 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-hazard-400 font-bold uppercase tracking-wider">
              {lang === 'hi' ? 'चरण 1 // सिग्नल पहचान एवं कारणात्मक प्रसार' : lang === 'mr' ? 'टप्पा 1 // सिग्नल शोध व कारणात्मक प्रसार' : 'STEP 1 // SIGNAL DETECTION & CAUSAL PROPAGATION'}
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              {lang === 'hi' ? 'बहु-चर सेंसर ड्रिफ्ट - ' : lang === 'mr' ? 'बहु-चल सेन्सर ड्रिफ्ट - ' : 'Multi-Variate Sensor Drift at '}{activeScenario.mineName}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#5F625C]">
          <span className="badge-manganese text-[10px]">{activeScenario.appliedSeverity} {lang === 'hi' ? 'गंभीरता' : lang === 'mr' ? 'तीव्रता' : 'SEVERITY'}</span>
          <span>{lang === 'hi' ? 'समय सीमा:' : lang === 'mr' ? 'कालावधी:' : 'Horizon:'} <strong className="text-white">{activeScenario.appliedHorizon}</strong></span>
        </div>
      </div>

      {/* Causal Propagation Chain */}
      {causal.length > 0 && (
        <div className="p-4 rounded-xl bg-[#F0EBE2]/90 border border-[#C8BFAF] space-y-2">
          <div className="text-[10px] text-[#85877E] uppercase tracking-wider font-bold">
            {lang === 'hi' ? 'कारणात्मक श्रृंखला प्रसार (इनपुट → तनाव → कमी):' : lang === 'mr' ? 'कारणात्मक साखळी प्रसार (इनपुट → ताण → तूट):' : 'CAUSAL CHAIN PROPAGATION (INPUT → STRESS → DEFICIT):'}
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
            {causal.map((c, idx) => (
              <React.Fragment key={idx}>
                <div className="px-3 py-1.5 rounded-lg bg-[#F5F1E9] border border-[#C8BFAF] flex items-center gap-2">
                  <span className="text-[#5F625C] text-[11px]">{c.step}:</span>
                  <strong className={c.status === 'hazard' ? 'text-hazard-400' : 'text-telemetry-400'}>{c.delta}</strong>
                </div>
                {idx < causal.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-[#85877E] flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Detected Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {activeScenario.signals.map((sig, idx) => {
          const isCritical = sig.severity === 'CRITICAL' || sig.severity === 'HIGH';
          const isWarning = sig.severity === 'WARNING' || sig.severity === 'MEDIUM';

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 transition-all ${
                isCritical
                  ? 'bg-hazard-950/25 border-hazard-500/40 shadow-sm'
                  : isWarning
                  ? 'bg-manganese-950/20 border-manganese-500/40'
                  : 'bg-telemetry-950/20 border-telemetry-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white truncate max-w-[220px]">
                  {sig.name}
                </span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  isCritical
                    ? 'bg-hazard-500/20 text-hazard-300 border border-hazard-500/30'
                    : isWarning
                    ? 'bg-manganese-500/20 text-manganese-300 border border-manganese-500/30'
                    : 'bg-telemetry-500/20 text-telemetry-300 border border-telemetry-500/30'
                }`}>
                  {sig.severity}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className={`text-base font-bold ${
                  isCritical ? 'text-hazard-400' : isWarning ? 'text-manganese-300' : 'text-telemetry-400'
                }`}>
                  {sig.value}
                </span>
                <span className="text-[11px] text-[#5F625C]">
                  {lang === 'hi' ? 'आधारभूत:' : lang === 'mr' ? 'पायाभूत:' : 'Baseline:'} {sig.normal}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#C8BFAF] text-[10px] text-[#5F625C]">
                <span className="text-[#85877E]">{lang === 'hi' ? 'विचलन:' : lang === 'mr' ? 'विचलन:' : 'Drift:'} <strong className="text-white">{sig.magnitude}</strong></span>
                <span>{lang === 'hi' ? 'ताजगी:' : lang === 'mr' ? 'ताजेपणा:' : 'Freshness:'} <strong className="text-[#272A27]">{sig.freshness}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
