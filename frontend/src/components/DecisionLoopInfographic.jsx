import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import {
  Radio,
  Search,
  TrendingDown,
  Sparkles,
  Zap,
  Sliders,
  TrendingUp,
  CheckCircle2,
  Award,
  ChevronRight,
  ArrowRight,
  ShieldAlert,
  Cpu
} from 'lucide-react';

export const DecisionLoopInfographic = () => {
  const { activeScenario, decisionStage, setIsDecisionModalOpen, t, lang } = useApp();
  const scen = t?.scenarioLab || {};
  const comm = t?.common || {};

  const rec = activeScenario?.recommendation || activeScenario?.prescribedAction || {
    actionId: 'PROTO-AP-04',
    protectedYield: '+1,150 T/day'
  };

  const steps = [
    {
      code: '01',
      title: scen.signalTitle ? (lang === 'hi' ? 'सिग्नल' : lang === 'mr' ? 'सिग्नल' : 'SIGNAL') : 'SIGNAL',
      desc: lang === 'hi' ? '284 वास्तविक समय आईओटी सेंसर एवं उपग्रह टेलीमेट्री' : lang === 'mr' ? '284 थेट आयओटी सेन्सर्स व उपग्रह टेलीमेट्री' : '284 real-time IoT sensors & satellite telemetry',
      icon: Radio,
      active: true,
      color: 'text-telemetry-400'
    },
    {
      code: '02',
      title: lang === 'hi' ? 'पहचान' : lang === 'mr' ? 'शोध' : 'DETECTION',
      desc: lang === 'hi' ? 'बहु-चर विसंगति एवं सेंसर ड्रिफ्ट स्कैनर' : lang === 'mr' ? 'बहु-चल विसंगती व सेन्सर ड्रिफ्ट स्कॅनर' : 'Multi-variate anomaly & sensor drift scanner',
      icon: Search,
      active: !!activeScenario,
      color: 'text-hazard-400'
    },
    {
      code: '03',
      title: lang === 'hi' ? 'भविष्यवाणी' : lang === 'mr' ? 'अंदाज' : 'PREDICTION',
      desc: lang === 'hi' ? '14-दिवसीय उत्पादन अंतर एवं घाटा मॉडलिंग' : lang === 'mr' ? '14-दिवसीय उत्पादन तूट व मॉडेलिंग' : '14-day production shortfall & deficit modeling',
      icon: TrendingDown,
      active: !!activeScenario,
      color: 'text-hazard-300'
    },
    {
      code: '04',
      title: lang === 'hi' ? 'स्पष्टीकरण' : lang === 'mr' ? 'स्पष्टीकरण' : 'EXPLANATION',
      desc: lang === 'hi' ? 'ट्री-शाप (TreeSHAP) सटीक स्थानीय फीचर एट्रिब्यूशन' : lang === 'mr' ? 'ट्री-शाप (TreeSHAP) अचूक स्थानिक फीचर विश्लेषण' : 'TreeSHAP exact local feature attribution',
      icon: Sparkles,
      active: !!activeScenario,
      color: 'text-manganese-400'
    },
    {
      code: '05',
      title: lang === 'hi' ? 'सिफारिश' : lang === 'mr' ? 'शिफारस' : 'RECOMMENDATION',
      desc: lang === 'hi' ? 'बाधित निर्देशात्मक स्वचालित कार्रवाई' : lang === 'mr' ? 'मर्यादित निर्देशात्मक स्वयंचलित कृती' : 'Constrained prescriptive auto-actions',
      icon: Zap,
      active: !!activeScenario,
      color: 'text-manganese-300'
    },
    {
      code: '06',
      title: lang === 'hi' ? 'अनुकूलन' : lang === 'mr' ? 'इष्टतमीकरण' : 'OPTIMIZATION',
      desc: lang === 'hi' ? 'लागत-लाभ विश्लेषण के साथ बहु-विकल्प पैरेटो सॉल्वर' : lang === 'mr' ? 'खर्च-फायदा विश्लेषणासह बहु-पर्यायी पॅरेटो सॉल्व्हर' : 'Multi-option Pareto solver with cost-benefit analysis',
      icon: Sliders,
      active: !!activeScenario,
      color: 'text-cyan-400'
    },
    {
      code: '07',
      title: lang === 'hi' ? 'अपेक्षित प्रभाव' : lang === 'mr' ? 'अपेक्षित प्रभाव' : 'EXPECTED IMPACT',
      desc: lang === 'hi' ? 'परिमाणित संरक्षित उत्पादन और वित्तीय आरओआई' : lang === 'mr' ? 'परिमाणित संरक्षित उत्पादन व आर्थिक परतावा' : 'Quantified protected tonnage & financial ROI',
      icon: TrendingUp,
      active: !!activeScenario,
      color: 'text-emerald-400'
    },
    {
      code: '08',
      title: lang === 'hi' ? 'मानव अनुमोदन' : lang === 'mr' ? 'मानवी मंजुरी' : 'HUMAN APPROVAL',
      desc: lang === 'hi' ? 'ऑपरेटर साइन-ऑफ और वैधानिक अनुपालन' : lang === 'mr' ? 'ऑपरेटर मंजुरी व वैधानिक नियम पालन' : 'Operator sign-off & statutory compliance',
      icon: CheckCircle2,
      active: decisionStage === 'APPROVED' || decisionStage === 'MODIFIED',
      color: 'text-telemetry-400'
    },
    {
      code: '09',
      title: lang === 'hi' ? 'परिणाम' : lang === 'mr' ? 'अंतिम परिणाम' : 'OUTCOME',
      desc: lang === 'hi' ? 'वास्तविक संरक्षित उत्पादन एवं शिफ्ट ऑडिट लॉग' : lang === 'mr' ? 'प्रत्यक्ष संरक्षित उत्पादन व शिफ्ट ऑडिट नोंद' : 'Realized tonnage protected & shift audit log',
      icon: Award,
      active: decisionStage === 'APPROVED' || decisionStage === 'MODIFIED',
      color: 'text-emerald-300'
    }
  ];

  return (
    <section className="command-container py-12 select-none">

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-obsidian-800 pb-8">
        <div>
          <div className="badge-manganese mb-3">
            <Cpu className="w-3 h-3 text-manganese-400" />
            <span>{lang === 'hi' ? 'मुख्य वास्तुकला सिद्धांत' : lang === 'mr' ? 'मुख्य वास्तुकला तत्त्वज्ञान' : 'CORE ARCHITECTURAL PHILOSOPHY'}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#272A27]">
            {lang === 'hi' ? 'कच्चे संकेतों से परिचालन निर्णयों तक' : lang === 'mr' ? 'थेट संकेतांपासून ऑपरेशनल निर्णयांपर्यंत' : 'From Raw Signals to Operational Decisions'}
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-3xl font-normal">
            {lang === 'hi'
              ? 'मॉयल केवल एक निगरानी डैशबोर्ड नहीं है। यह एक संपूर्ण निर्देशात्मक निर्णय बुद्धिमत्ता लूप है जो उप-सतह विसंगतियों को ऑपरेटर-शासित उपायों में बदलता है।'
              : lang === 'mr'
              ? 'मॉयल केवळ एक देखरेख डॅशबोर्ड नाही. हे एक संपूर्ण निर्देशात्मक निर्णय बुद्धिमत्ता लूप आहे जे जमिनीखालील विसंगतींना ऑपरेटर-शासित उपायांमध्ये बदलते.'
              : 'MOIL is not merely a monitoring dashboard. It is an end-to-end Prescriptive Decision Intelligence Loop translating sub-surface sensor anomalies into mathematically optimized, operator-governed countermeasures.'}
          </p>
        </div>

        <div className="badge-telemetry self-start md:self-auto font-mono text-xs">
          <span>{lang === 'hi' ? 'मानव-इन-द-लूप अनिवार्य' : lang === 'mr' ? 'मानवी मंजुरी अनिवार्य' : 'HUMAN-IN-THE-LOOP MANDATED'}</span>
        </div>
      </div>

      {/* Interactive Horizontal 9-Step Pipeline Rack */}
      <div className="p-6 rounded-2xl bg-obsidian-900/90 border border-obsidian-750/90 shadow-2xl overflow-x-auto no-scrollbar">
        <div className="flex items-stretch min-w-[960px] gap-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = activeScenario && (
              (step.code === '02' && decisionStage === 'DETECTED') ||
              (step.code === '05' && decisionStage === 'DETECTED') ||
              (step.code === '08' && decisionStage === 'APPROVED')
            );

            return (
              <React.Fragment key={step.code}>
                <div
                  className={`flex-1 p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                    step.active
                      ? 'bg-obsidian-850 border-obsidian-700 shadow-md'
                      : 'bg-obsidian-950/60 border-obsidian-850 opacity-50'
                  } ${isCurrent ? 'ring-1 ring-manganese-400 bg-manganese-950/20' : ''}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-zinc-500 font-bold">{step.code}</span>
                      <Icon className={`w-4 h-4 ${step.color}`} />
                    </div>
                    <div className={`font-display text-xs font-bold tracking-wider uppercase mb-1 ${step.active ? 'text-white' : 'text-zinc-500'}`}>
                      {step.title}
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-400 font-sans leading-tight mt-2">
                    {step.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="flex items-center text-zinc-700 flex-shrink-0">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Live Context Prompt */}
      {activeScenario && (
        <div className="mt-4 p-4 rounded-xl bg-obsidian-950/90 border border-manganese-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-zinc-300 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-hazard-500 animate-ping" />
            <span>
              {comm.active_mine || 'Active'}: <strong className="text-[#272A27]">{activeScenario.title || activeScenario.detectionHeadline || activeScenario.scenarioId || 'Simulation State'}</strong> — {scen.decisionSupportTitle || 'AI recommends'} <strong className="text-manganese-400">{rec?.actionId || 'AP-04'}</strong> ({rec?.protectedYield || '+1,150 T'} Protected)
            </span>
          </div>

          <button
            onClick={() => setIsDecisionModalOpen(true)}
            className="px-4 py-1.5 rounded-lg bg-manganese-500 hover:bg-manganese-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
          >
            <span>{scen.authorizeBtn || 'Review & Authorize'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </section>
  );
};
