import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { 
  X, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  UserCheck, 
  FileText,
  Sliders,
  Sparkles
} from 'lucide-react';

export const DecisionModal = () => {
  const { 
    isDecisionModalOpen, 
    setIsDecisionModalOpen, 
    activeScenario, 
    approveDecision, 
    modifyDecision, 
    rejectDecision,
    t,
    lang
  } = useApp();

  const [operatorName, setOperatorName] = useState('R. Sharma (Senior Shift Controller)');
  const [operatorNotes, setOperatorNotes] = useState('');
  const [selectedOptionId, setSelectedOptionId] = useState('OPT-C');
  const [activeTab, setActiveTab] = useState('APPROVE'); // APPROVE, MODIFY, REJECT

  if (!isDecisionModalOpen || !activeScenario) return null;

  const p = activeScenario.recommendation || activeScenario.prescribedAction || {
    actionId: 'PROTO-AP-04',
    title: 'Operational Countermeasure',
    whatToDo: 'Engage auxiliary dewatering pump and reroute fleet.',
    why: 'Prevents pit flooding.',
    expectedImpact: '+1,150 T/day Protected Yield',
    confidence: '94.8%',
    timeToIntervene: '< 45 Minutes'
  };

  const options = activeScenario.optimizationOptions || [];

  const handleApprove = () => {
    approveDecision(operatorName, operatorNotes || 'Prescribed parameters verified against DGMS statutory limits. Dispatch authorized.');
  };

  const handleModify = () => {
    modifyDecision(selectedOptionId, operatorName, operatorNotes || 'Adjusted optimization option parameters.');
  };

  const handleReject = () => {
    rejectDecision(operatorNotes || 'Manual controller override.', operatorName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto panel-surface p-6 sm:p-8 border border-manganese-500/40 shadow-2xl bg-obsidian-900 no-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={() => setIsDecisionModalOpen(false)}
          className="absolute top-6 right-6 p-2 rounded-lg bg-obsidian-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="pb-6 border-b border-obsidian-800 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-telemetry text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-telemetry-400" />
              <span>{lang === 'hi' ? 'उत्तरदायी एआई // प्रेषण नियंत्रण प्राधिकरण' : lang === 'mr' ? 'जबाबदार एआय // प्रेषण नियंत्रण प्राधिकरण' : 'RESPONSIBLE AI // DISPATCH CONTROL AUTHORITY'}</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              {lang === 'hi' ? 'डीजीएमएस वैधानिक प्रशासन' : lang === 'mr' ? 'डीजीएमएस वैधानिक नियमन' : 'DGMS STATUTORY GOVERNANCE'}
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            {lang === 'hi' ? 'मानव-इन-द-लूप निर्णय प्राधिकरण' : lang === 'mr' ? 'मानवी सहभाग निर्णय प्राधिकरण' : 'Human-in-the-Loop Decision Authority'}
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            {lang === 'hi' ? 'निर्देशात्मक प्रोटोकॉल समीक्षा:' : lang === 'mr' ? 'निर्देशात्मक प्रोटोकॉल पुनरावलोकन:' : 'Reviewing Prescriptive Protocol for:'} <strong className="text-white">{activeScenario.title || activeScenario.detectionHeadline || activeScenario.scenarioId || 'Operational Scenario'}</strong>
          </p>
        </div>

        {/* Prescription Summary */}
        <div className="p-4 rounded-xl bg-obsidian-950/90 border border-manganese-500/30 mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-mono text-xs font-bold text-manganese-400">
              {p.actionId}: {p.title || 'Operational Protocol'}
            </span>
            <span className="badge-telemetry text-[10px] self-start sm:self-auto font-mono">
              {lang === 'hi' ? 'एआई विश्वास:' : lang === 'mr' ? 'एआय विश्वास:' : 'AI Confidence:'} {p.confidence || '94.8%'}
            </span>
          </div>

          <p className="text-xs text-zinc-300 font-mono whitespace-pre-line leading-relaxed pl-2 border-l-2 border-manganese-500">
            {p.whatToDo}
          </p>
        </div>

        {/* Multi-Option Comparison Grid */}
        <div className="mb-6 space-y-3">
          <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
            <span>{lang === 'hi' ? 'अनुकूलन सॉल्वर विकल्प' : lang === 'mr' ? 'इष्टतमीकरण सॉल्व्हर पर्याय' : 'Optimization Solver Options'}</span>
            <span className="text-telemetry-400 text-[10px]">{lang === 'hi' ? 'पैरेटो फ्रंटियर विश्लेषण' : lang === 'mr' ? 'पॅरेटो फ्रंटियर विश्लेषण' : 'Pareto Frontier Analysis'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isRecommended = opt.isAiRecommended;
              const optTitle = opt.title || opt.id || 'Option';
              const optHeadline = optTitle.includes(':') ? optTitle.split(':')[1] : optTitle;
              const optCategory = optTitle.includes(':') ? optTitle.split(':')[0] : opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between font-mono text-xs ${
                    isSelected
                      ? 'bg-obsidian-800 border-manganese-500 shadow-md ring-1 ring-manganese-400'
                      : 'bg-obsidian-950/60 border-obsidian-800 hover:border-obsidian-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white text-[11px]">{optCategory}</span>
                      {isRecommended && (
                        <span className="px-1.5 py-0.5 rounded bg-telemetry-500/20 text-telemetry-400 text-[9px] font-bold border border-telemetry-500/30 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{lang === 'hi' ? 'एआई इष्टतम' : lang === 'mr' ? 'एआय इष्टतम' : 'AI OPTIMAL'}</span>
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-zinc-200 text-xs mb-1 truncate">{optHeadline}</div>
                    <p className="text-[10px] text-zinc-400 line-clamp-2 mb-3">{opt.description}</p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-obsidian-850 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">{lang === 'hi' ? 'हानि:' : lang === 'mr' ? 'तूट:' : 'Loss:'}</span>
                      <strong className={isRecommended ? 'text-telemetry-400' : 'text-hazard-400'}>{opt.expectedLossPct} ({opt.expectedLossTonnes} T)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">{lang === 'hi' ? 'डाउनटाइम:' : lang === 'mr' ? 'डाउनटाइम:' : 'Downtime:'}</span>
                      <strong className="text-zinc-300">{opt.expectedDowntime}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">{lang === 'hi' ? 'अनुमानित लागत:' : lang === 'mr' ? 'अंदाजित खर्च:' : 'Est Cost:'}</span>
                      <strong className="text-zinc-300">{opt.costEstimate}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operator Credentials Form */}
        <div className="p-4 rounded-xl bg-obsidian-950/80 border border-obsidian-800 mb-6 space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                {lang === 'hi' ? 'अधिकृत करने वाले शिफ्ट पर्यवेक्षक / नियंत्रक:' : lang === 'mr' ? 'अधिकृत करणारे शिफ्ट पर्यवेक्षक / नियंत्रक:' : 'Authorizing Shift Supervisor / Controller:'}
              </label>
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-obsidian-900 border border-obsidian-750 text-white font-mono text-xs focus:border-manganese-500 outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                {lang === 'hi' ? 'ऑडिट नोट्स / परिचालन ओवरराइड्स:' : lang === 'mr' ? 'ऑडिट नोट्स / ऑपरेशनल ओव्हरराइड्स:' : 'Audit Notes / Operational Overrides:'}
              </label>
              <input
                type="text"
                value={operatorNotes}
                onChange={(e) => setOperatorNotes(e.target.value)}
                placeholder={lang === 'hi' ? 'उदा. पंप AP-04 सत्यापित ऑनलाइन; वायरलेस संदेश पूर्ण।' : lang === 'mr' ? 'उदा. पंप AP-04 ऑनलाइन तपासला; वायरलेस संदेश पूर्ण.' : 'e.g. Pump AP-04 verified online; VHF radio broadcast to dumpers.'}
                className="w-full px-3 py-2 rounded-lg bg-obsidian-900 border border-obsidian-750 text-zinc-200 font-mono text-xs focus:border-manganese-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons: [ APPROVE ] [ MODIFY ] [ REJECT ] */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-obsidian-800 font-mono text-xs">
          <button
            onClick={handleReject}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-obsidian-850 hover:bg-hazard-500/20 text-zinc-400 hover:text-hazard-300 border border-obsidian-700 font-bold uppercase tracking-wide transition-colors"
          >
            {lang === 'hi' ? '[ अस्वीकार / मैनुअल ओवरराइड ]' : lang === 'mr' ? '[ नकार / मॅन्युअल ओव्हरराइड ]' : '[ REJECT / MANUAL OVERRIDE ]'}
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleModify}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-manganese-300 border border-obsidian-700 font-bold uppercase tracking-wide transition-colors"
            >
              {lang === 'hi' ? '[ योजना संशोधित करें ]' : lang === 'mr' ? '[ योजना सुधारा ]' : '[ MODIFY PLAN ]'}
            </button>

            <button
              onClick={handleApprove}
              className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-gradient-to-r from-telemetry-500 to-emerald-400 hover:from-telemetry-400 hover:to-emerald-300 text-obsidian-950 font-black uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'hi' ? '[ स्वीकृत एवं प्रेषित करें ]' : lang === 'mr' ? '[ मंजूर व प्रेषित करा ]' : '[ APPROVE & DISPATCH ]'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
