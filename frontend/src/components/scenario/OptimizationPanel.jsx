import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  Zap,
  Sparkles
} from 'lucide-react';

export const OptimizationPanel = () => {
  const { activeScenario, setIsDecisionModalOpen, t, lang } = useApp();
  const [selectedOptId, setSelectedOptId] = useState('OPT-C');
  const scen = t?.scenarioLab || {};
  const comm = t?.common || {};

  if (!activeScenario) return null;

  const rawOptions = activeScenario.optimizationOptions;
  const options = Array.isArray(rawOptions) && rawOptions.length > 0 ? rawOptions : [
    {
      id: 'OPT-A',
      title: lang === 'hi' ? 'विकल्प ए: पारंपरिक सम्प पंपिंग (यथास्थिति)' : lang === 'mr' ? 'पर्याय अ: पारंपारिक सम्प पंपिंग (जैसे थे)' : 'Option A: Reactive Sump Pumping (Status Quo)',
      description: lang === 'hi' ? 'बिना गति बढ़ाए मौजूदा डीवाटरिंग पंप चलाएं।' : lang === 'mr' ? 'वेग न वाढवता विद्यमान पंप चालवा.' : 'Run existing dewatering pumps without speed boost.',
      expectedLossTonnes: 1350,
      expectedLossPct: '-21.8%',
      expectedDowntime: lang === 'hi' ? '18 घंटे' : lang === 'mr' ? '18 तास' : '18 Hours',
      costEstimate: '₹0',
      confidence: '91.2%',
      isAiRecommended: false
    },
    {
      id: 'OPT-B',
      title: lang === 'hi' ? 'विकल्प बी: आंशिक ढुलाई मार्ग परिवर्तन' : lang === 'mr' ? 'पर्याय ब: अंशतः वाहतूक मार्ग बदल' : 'Option B: Partial Haulage Re-Routing',
      description: lang === 'hi' ? 'ट्रकों को उच्च रैंप झुकाव वाले मार्गों पर मोड़ें।' : lang === 'mr' ? 'ट्रक अधिक उताराच्या पर्यायी रस्त्यांवर वळवा.' : 'Divert haulage to higher ramp inclines.',
      expectedLossTonnes: 620,
      expectedLossPct: '-10.0%',
      expectedDowntime: lang === 'hi' ? '8 घंटे' : lang === 'mr' ? '8 तास' : '8 Hours',
      costEstimate: '₹1.8 Lakh',
      confidence: '93.4%',
      isAiRecommended: false
    },
    {
      id: 'OPT-C',
      title: lang === 'hi' ? 'विकल्प सी: एआई स्वचालित बहु-वेक्टर पुनर्प्राप्ति' : lang === 'mr' ? 'पर्याय क: एआय स्वयंचलित बहु-वेक्टर पुनर्प्राप्ती' : 'Option C: AI Automated Multi-Vector Recovery',
      description: lang === 'hi' ? 'एक साथ हाई-हेड सबमर्सिबल पंप तैनात करें, द्वितीयक अयस्क पास सक्रिय करें और प्रेषण अनुकूलित करें।' : lang === 'mr' ? 'एकाच वेळी हाय-हेड पंप सुरू करा, पर्यायी ओअर पास सक्रिय करा व वाहतूक इष्टतम करा.' : 'Simultaneously deploy high-head submersible pumps, activate secondary ore passes, and optimize dispatch.',
      expectedLossTonnes: 200,
      expectedLossPct: '-3.2%',
      expectedDowntime: lang === 'hi' ? '2 घंटे' : lang === 'mr' ? '2 तास' : '2 Hours',
      costEstimate: '₹3.2 Lakh',
      confidence: '96.8%',
      isAiRecommended: true
    }
  ];

  return (
    <div className="panel-surface p-6 sm:p-8 border border-cyan-500/30 font-mono text-xs space-y-6 shadow-2xl animate-fade-in select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-obsidian-800 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Sliders className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              {lang === 'hi' ? 'चरण 5 // निर्देशात्मक अनुकूलन सॉल्वर' : lang === 'mr' ? 'टप्पा 5 // निर्देशात्मक इष्टतमीकरण सॉल्व्हर' : 'STEP 5 // PRESCRIPTIVE OPTIMIZATION SOLVER'}
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              {lang === 'hi' ? 'बहु-विकल्प पैरेटो ट्रेड-ऑफ विश्लेषण' : lang === 'mr' ? 'बहु-पर्यायी पॅरेटो ट्रेड-ऑफ विश्लेषण' : 'Multi-Option Pareto Trade-Off Analysis'}
            </h3>
          </div>
        </div>

        <div className="badge-telemetry font-mono text-[10px] self-start sm:self-auto">
          <span>{lang === 'hi' ? 'बाधित अनुकूलन इंजन' : lang === 'mr' ? 'मर्यादित इष्टतमीकरण इंजिन' : 'Constrained Optimization Engine'}</span>
        </div>
      </div>

      <p className="text-zinc-400 font-sans text-xs leading-relaxed">
        {lang === 'hi'
          ? 'प्रणाली वैधानिक बाधाओं, लागतों और डाउनटाइम के विरुद्ध कई व्यवहार्य परिचालनों का मूल्यांकन करके वैश्विक पैरेटो इष्टतम प्रतिक्रिया की पहचान करती है।'
          : lang === 'mr'
          ? 'प्रणाली वैधानिक बंधने, खर्च आणि डाउनटाइमच्या विरोधात अनेक संभाव्य ऑपरेशन्सचे मूल्यांकन करून जागतिक पॅरेटो इष्टतम प्रतिसादाची निवड करते.'
          : 'The system evaluates multiple feasible operational actions against statutory constraints, costs, and downtime to identify the global Pareto optimal response.'}
      </p>

      {/* 3 Option Monolith Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((opt) => {
          const isSelected = selectedOptId === opt.id;
          const isAiOptimal = !!opt.isAiRecommended;
          const titleStr = typeof opt.title === 'string' ? opt.title : (opt.name || opt.id || 'Option');
          const titleParts = titleStr.split(':');
          const prefix = titleParts[0] || opt.id || 'Option';
          const subTitle = titleParts[1] ? titleParts.slice(1).join(':') : titleStr;

          return (
            <div
              key={opt.id || titleStr}
              onClick={() => setSelectedOptId(opt.id)}
              className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                isAiOptimal
                  ? 'bg-telemetry-950/15 border-telemetry-500/50 shadow-lg ring-1 ring-telemetry-400/30'
                  : isSelected
                  ? 'bg-obsidian-850 border-manganese-500/50'
                  : 'bg-obsidian-950/70 border-obsidian-800 hover:border-obsidian-700'
              }`}
            >
              <div>
                {/* Option Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-xs">{prefix}</span>
                  {isAiOptimal && (
                    <span className="px-2 py-0.5 rounded bg-telemetry-500/20 text-telemetry-300 text-[10px] font-bold border border-telemetry-500/40 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{lang === 'hi' ? 'एआई अनुशंसित' : lang === 'mr' ? 'एआय शिफारस केलेले' : 'AI RECOMMENDED'}</span>
                    </span>
                  )}
                </div>

                <div className="font-sans text-xs text-zinc-300 font-semibold mb-2">
                  {subTitle}
                </div>

                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed mb-4">
                  {opt.description || 'Optimized parameters for local shift conditions.'}
                </p>
              </div>

              {/* Metrics Breakdown */}
              <div className="space-y-2 pt-3 border-t border-obsidian-800 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-500">{lang === 'hi' ? 'अपेक्षित हानि:' : lang === 'mr' ? 'अपेक्षित तूट:' : 'Expected Loss:'}</span>
                  <strong className={isAiOptimal ? 'text-telemetry-400' : 'text-hazard-400'}>
                    {opt.expectedLossPct || '-3.2%'} ({opt.expectedLossTonnes || 200} T)
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500">{lang === 'hi' ? 'अपेक्षित डाउनटाइम:' : lang === 'mr' ? 'अपेक्षित डाउनटाइम:' : 'Expected Downtime:'}</span>
                  <strong className="text-zinc-300">{opt.expectedDowntime || '2 Hours'}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500">{lang === 'hi' ? 'अनुमानित लागत:' : lang === 'mr' ? 'अंदाजित खर्च:' : 'Estimated Cost:'}</span>
                  <strong className="text-zinc-300">{opt.costEstimate || '₹3.2 Lakh'}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500">{lang === 'hi' ? 'मॉडल विश्वास:' : lang === 'mr' ? 'मॉडेल विश्वास:' : 'Model Confidence:'}</span>
                  <strong className="text-telemetry-400">{opt.confidence || '96.8%'}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
