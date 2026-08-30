import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { ScenarioSelector } from './ScenarioSelector.jsx';
import { ScenarioDiffIndicator } from './ScenarioDiffIndicator.jsx';
import { SignalPanel } from './SignalPanel.jsx';
import { PredictionPanel } from './PredictionPanel.jsx';
import { EvidencePanel } from './EvidencePanel.jsx';
import { RecommendationPanel } from './RecommendationPanel.jsx';
import { OptimizationPanel } from './OptimizationPanel.jsx';
import { WhatIfSimulation } from './WhatIfSimulation.jsx';
import { HumanDecision } from './HumanDecision.jsx';
import { DecisionAudit } from './DecisionAudit.jsx';
import { PipelineInspector } from './PipelineInspector.jsx';
import { 
  SlidersHorizontal, 
  Radio, 
  TrendingDown, 
  Sparkles, 
  Zap, 
  Sliders, 
  TrendingUp, 
  UserCheck, 
  FileCheck,
  ChevronRight,
  ShieldCheck,
  Terminal
} from 'lucide-react';

export const ScenarioLab = () => {
  const { activeScenario, decisionStage, t, lang } = useApp();
  const [activeStepTab, setActiveStepTab] = useState('ALL');
  const scenT = t?.scenarioLab || {};

  const steps = [
    { id: 'ALL', label: lang === 'hi' ? 'संपूर्ण लूप' : lang === 'mr' ? 'संपूर्ण लूप' : 'Complete Loop' },
    { id: 'INSPECTOR', label: lang === 'hi' ? '⚡ पाइपलाइन अनुरेखक' : lang === 'mr' ? '⚡ पाइपलाइन ट्रेसर' : '⚡ Pipeline Tracer' },
    { id: 'SIGNALS', label: lang === 'hi' ? '1. सिग्नल्स' : lang === 'mr' ? '1. सिग्नल्स' : '1. Signals' },
    { id: 'PREDICTION', label: lang === 'hi' ? '2. भविष्यवाणी' : lang === 'mr' ? '2. अंदाज' : '2. Prediction' },
    { id: 'EVIDENCE', label: lang === 'hi' ? '3. साक्ष्य (SHAP)' : lang === 'mr' ? '3. पुरावे (SHAP)' : '3. Evidence (SHAP)' },
    { id: 'RECOMMENDATION', label: lang === 'hi' ? '4. एआई कार्रवाई' : lang === 'mr' ? '4. एआय कृती' : '4. AI Action' },
    { id: 'OPTIMIZATION', label: lang === 'hi' ? '5. अनुकूलन' : lang === 'mr' ? '5. इष्टतमीकरण' : '5. Optimization' },
    { id: 'WHATIF', label: lang === 'hi' ? '6. व्हॉट-इफ' : lang === 'mr' ? '6. व्हॉट-इफ' : '6. What-If' },
    { id: 'DECISION', label: lang === 'hi' ? '7. निर्णय' : lang === 'mr' ? '7. निर्णय' : '7. Decision' },
    { id: 'AUDIT', label: lang === 'hi' ? '8. ऑडिट लॉग' : lang === 'mr' ? '8. ऑडिट नोंद' : '8. Audit Log' }
  ];

  return (
    <section className="command-container py-12 space-y-8 select-none">
      
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-obsidian-800">
        <div>
          <div className="badge-manganese mb-3">
            <SlidersHorizontal className="w-3 h-3 text-manganese-400" />
            <span>{lang === 'hi' ? 'मॉयल प्रदर्शन एवं निर्णय इंजन' : lang === 'mr' ? 'मॉयल प्रात्यक्षिक व निर्णय इंजिन' : 'MOIL DEMONSTRATION & DECISION ENGINE'}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
            {scenT.pageTitle || 'Operational Scenario Lab'}
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-3xl font-normal">
            {lang === 'hi' ? 'वास्तविक परिचालन तनाव इंजेक्ट करके संपूर्ण मॉयल निर्णय पाइपलाइन का प्रत्यक्ष अनुभव करें: आधारभूत स्थिति बनाम तनाव, दहलीज पहचान, सिम्युलेटेड भविष्यवाणी, विशेषता एट्रिब्यूशन, एवं ऑपरेटर प्रेषण प्राधिकरण।' :
             lang === 'mr' ? 'प्रत्यक्ष ऑपरेशनल ताण इंजेक्ट करून संपूर्ण मॉयल निर्णय पाइपलाइनचा अनुभव घ्या: पायाभूत स्थिती वि. ताण, मर्यादा शोध, सिम्युलेटेड अंदाज, वैशिष्ट्य ॲट्रिब्युशन व ऑपरेटर प्रेषण अधिकृती.' :
             'Inject real-world operational stress to witness the full MOIL Decision Pipeline: baseline state vs injected stress, threshold detection, simulated prediction, feature attribution, and operator dispatch authorization.'}
          </p>
        </div>

        {/* Step Filter Navigation Strip */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-obsidian-900 border border-obsidian-750 self-start md:self-auto overflow-x-auto no-scrollbar font-mono text-xs">
          {steps.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStepTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeStepTab === tab.id
                  ? 'bg-manganese-500 text-obsidian-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Master Scenario Selector */}
      <ScenarioSelector />

      {/* Compact Baseline vs Scenario Delta Indicator */}
      {activeScenario && <ScenarioDiffIndicator />}

      {/* Active Step Panels Progression */}
      {activeScenario && (
        <div className="space-y-8 animate-fade-in">
          
          {(activeStepTab === 'ALL' || activeStepTab === 'INSPECTOR') && (
            <PipelineInspector />
          )}

          {(activeStepTab === 'ALL' || activeStepTab === 'SIGNALS') && (
            <SignalPanel />
          )}

          {(activeStepTab === 'ALL' || activeStepTab === 'PREDICTION') && (
            <PredictionPanel />
          )}

          {(activeStepTab === 'ALL' || activeStepTab === 'EVIDENCE') && (
            <EvidencePanel />
          )}

          {(activeStepTab === 'ALL' || activeStepTab === 'RECOMMENDATION') && (
            <RecommendationPanel />
          )}

          {(activeStepTab === 'ALL' || activeStepTab === 'OPTIMIZATION') && (
            <OptimizationPanel />
          )}

          {(activeStepTab === 'ALL' || activeStepTab === 'WHATIF') && (
            <WhatIfSimulation />
          )}

          {(activeStepTab === 'ALL' || activeStepTab === 'DECISION') && (
            <HumanDecision />
          )}

          {(activeStepTab === 'ALL' || activeStepTab === 'AUDIT') && (
            <DecisionAudit />
          )}

        </div>
      )}

    </section>
  );
};
