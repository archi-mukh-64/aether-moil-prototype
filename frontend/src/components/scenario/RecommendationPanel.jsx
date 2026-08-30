import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  Zap, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

export const RecommendationPanel = () => {
  const { activeScenario, decisionStage, setIsDecisionModalOpen, t, lang } = useApp();
  const scen = t?.scenarioLab || {};
  const comm = t?.common || {};

  if (!activeScenario) return null;

  const rec = activeScenario.recommendation || {
    actionId: 'AP-04',
    title: 'Automated Sump Dewatering Boost',
    whatToDo: 'Deploy auxiliary high-capacity submersible pumps to Stope 04 and increase pump RPM by +35%.',
    why: 'Prevents water inrush from reaching active loading benches and protects 1,150 T of planned production.',
    expectedImpact: '+1,150 T protected yield',
    timeToIntervene: '< 45 Minutes',
    confidence: '96.4%'
  };

  const isApproved = decisionStage === 'APPROVED';

  return (
    <div className="panel-surface p-6 sm:p-8 border border-manganese-500/40 bg-gradient-to-b from-manganese-950/10 via-obsidian-900 to-obsidian-950 font-mono text-xs space-y-6 shadow-2xl animate-fade-in select-none">
      
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-obsidian-800 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-manganese-500/20 border border-manganese-500/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-manganese-400" />
          </div>
          <div>
            <div className="text-[10px] text-manganese-400 font-bold uppercase tracking-wider">
              {lang === 'hi' ? 'चरण 4 // निर्देशात्मक एआई कार्रवाई' : lang === 'mr' ? 'टप्पा 4 // निर्देशात्मक एआय कृती' : 'STEP 4 // PRESCRIPTIVE AI ACTION'}
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              {scen.aiRecommendationsTitle || 'AI Recommended Operational Countermeasure'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isApproved ? (
            <span className="px-3 py-1 rounded bg-telemetry-500/20 text-telemetry-300 border border-telemetry-500/40 font-bold text-[10px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{scen.authorizedBtn || 'AUTHORIZED BY CONTROLLER'}</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded bg-hazard-500/20 text-hazard-300 border border-hazard-500/40 font-bold text-[10px] animate-pulse flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'मानव अनुमोदन की प्रतीक्षा' : lang === 'mr' ? 'मानवी मंजुरीची प्रतीक्षा' : 'AWAITING HUMAN APPROVAL'}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Prescription Callout */}
      <div className="p-5 rounded-xl bg-obsidian-950/90 border border-manganese-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-manganese-400 font-bold tracking-wider uppercase text-xs">
            {rec.actionId} • {rec.title}
          </span>
          <span className="text-telemetry-400 font-bold text-xs">
            {scen.confidence || 'Conf'}: {rec.confidence}
          </span>
        </div>

        <div className="text-zinc-200 font-sans text-xs whitespace-pre-line leading-relaxed pl-2 border-l-2 border-manganese-500/50">
          {rec.whatToDo}
        </div>
      </div>

      {/* Triad Telemetry Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Why */}
        <div className="p-4 rounded-xl bg-obsidian-950/80 border border-obsidian-800 space-y-1.5">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
            {lang === 'hi' ? 'यह कार्रवाई क्यों?' : lang === 'mr' ? 'ही कृती का?' : 'WHY THIS ACTION?'}
          </div>
          <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
            {rec.why}
          </p>
        </div>

        {/* Expected Impact */}
        <div className="p-4 rounded-xl bg-telemetry-950/20 border border-telemetry-500/30 space-y-1.5">
          <div className="text-[10px] text-telemetry-400 uppercase tracking-wider font-bold">
            {scen.expectedRecovery || 'EXPECTED IMPACT'}
          </div>
          <div className="text-base font-bold text-telemetry-300">
            {rec.expectedImpact}
          </div>
        </div>

        {/* Time to Intervene */}
        <div className="p-4 rounded-xl bg-obsidian-950/80 border border-obsidian-800 space-y-1.5">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
            {scen.execTime || 'TIME TO INTERVENE'}
          </div>
          <div className="text-base font-bold text-manganese-400">
            {rec.timeToIntervene}
          </div>
          <div className="text-[10px] text-zinc-500">
            {lang === 'hi' ? 'पूर्व-विफलता समय-सीमा' : lang === 'mr' ? 'बिघाड-पूर्व वेळ खिडकी' : 'Pre-Failure Window'}
          </div>
        </div>

      </div>

      {/* Action Bar */}
      {!isApproved && (
        <div className="p-4 rounded-xl bg-obsidian-950/90 border border-obsidian-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-zinc-400">
            {lang === 'hi' ? 'खदान प्रेषण को मापदंड भेजने से पहले मानव अनुमोदन आवश्यक है।' : lang === 'mr' ? 'खाण प्रेषणाला पॅरामीटर्स पाठवण्यापूर्वी मानवी मंजुरी आवश्यक आहे.' : 'Human approval required before parameters are sent to mine dispatch.'}
          </span>

          <button
            onClick={() => setIsDecisionModalOpen(true)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-manganese-500 to-amber-500 hover:from-manganese-400 hover:to-amber-400 text-obsidian-950 font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Zap className="w-4 h-4" />
            <span>{scen.authorizeBtn || 'Open Decision Authority'}</span>
          </button>
        </div>
      )}

    </div>
  );
};
