import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { INTELLIGENCE_ENGINES } from '../data/mockEngines.js';
import { 
  AlertTriangle, 
  Layers, 
  Zap, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Radio, 
  Compass, 
  Sparkles, 
  ChevronRight, 
  Terminal, 
  BarChart3, 
  Radar,
  BrainCircuit,
  Binary,
  Flame,
  FileCheck
} from 'lucide-react';

export const IntelligenceEngines = () => {
  const { t, activeMine, activeScenario, intelligenceMode, lang } = useApp();
  const [activeEngineId, setActiveEngineId] = useState('shortfall-alert');

  const iconMap = {
    AlertTriangle: AlertTriangle,
    Radar: Radar,
    Zap: Zap,
    Cpu: Cpu,
    ShieldCheck: ShieldCheck,
    Activity: Activity
  };

  const selectedEngine = INTELLIGENCE_ENGINES.find(e => e.id === activeEngineId) || INTELLIGENCE_ENGINES[0];
  const Icon = iconMap[selectedEngine.icon] || Activity;

  // Rich engine metadata
  const engineDetails = {
    'shortfall-alert': {
      detects: lang === 'hi' ? '14 दिन पूर्व तक शिफ्ट उत्पादन घाटे का जोखिम' : lang === 'mr' ? '14 दिवस आधीपर्यंत शिफ्ट उत्पादन तूट जोखीम' : 'Shift production deficit risk up to 14 days in advance',
      inputs: 'Pit Rainfall (mm), Sump Ingress (m³/h), Crusher Vibration (mm/s), Fleet Availability (%)',
      aiModel: 'LightGBM Gradient Boosted Trees (140 Estimators, TreeSHAP)',
      confidence: intelligenceMode === 'ML_MODEL' ? '91.4%' : '95.4%',
      output: `${activeMine.shortfallRisk} ${lang === 'hi' ? 'कमी संभावना' : lang === 'mr' ? 'तूट शक्यता' : 'shortfall probability for'} ${activeMine.name}`,
      action: lang === 'hi' ? 'सहायक डीडॉटरिंग पंप सक्रिय करें एवं ढुलाई फ्लीट को पुनर्निर्देशित करें' : lang === 'mr' ? 'सहाय्यक पंप सुरू करा व वाहतूक फ्लीट वळवा' : 'Trigger auxiliary dewatering pumps & re-route secondary haulage fleet',
      explainability: 'TreeSHAP attribution splits primary deficit risk into environmental and mechanical drivers.'
    },
    'exploration-radar': {
      detects: lang === 'hi' ? 'उप-सतह मैंगनीज गोंडाइट अयस्क क्षितिज एवं शिरा निरंतरता' : lang === 'mr' ? 'उप-पृष्ठभाग मॅंगनीज गोंडाइट खनिज साठे व शिरा सातत्य' : 'Sub-surface manganese gondite ore horizons and vein continuations',
      inputs: 'Sentinel-2 SWIR Band 11/12, Geological Contact Lineaments, GSI Boreholes',
      aiModel: 'Random Forest Regressor + Gaussian Stratigraphy Interpolator',
      confidence: '94.2%',
      output: `${activeMine.grade} ${lang === 'hi' ? 'पर प्रतिच्छेदित' : lang === 'mr' ? 'येथे आढळले' : 'intersected at'} ${activeMine.waterTableDepth}`,
      action: lang === 'hi' ? 'UNFC-111 रिजर्व अपग्रेड के लिए गहरे इन्फिल ड्रिलिंग अभियान को अधिकृत करें' : lang === 'mr' ? 'UNFC-111 साठा अपग्रेडसाठी सखोल ड्रिलिंग मोहीम अधिकृत करा' : 'Authorize deep infill drilling campaign for UNFC-111 reserve upgrade',
      explainability: 'Absorption band indices (2.19µm) isolate supergene manganese peroxide signatures.'
    },
    'auto-protocol': {
      detects: lang === 'hi' ? 'उप-इष्टतम परिचालन प्रतिक्रियाएं एवं आपातकालीन प्रेषण अड़चनें' : lang === 'mr' ? 'अयोग्य ऑपरेशनल प्रतिसाद व आपत्कालीन प्रेषण अडथळे' : 'Sub-optimal operational responses and emergency dispatch bottlenecks',
      inputs: 'Active Shift Anomaly State, Fleet Location Telemetry, Stockpile Buffer Volume',
      aiModel: 'Mixed-Integer Linear Programming (MILP) Pareto Solver',
      confidence: '97.2%',
      output: 'PROTO-AP-04 Optimized Multi-Vector Recovery Active',
      action: lang === 'hi' ? 'शिफ्ट परिवर्तन स्नेहन शुद्धिकरण स्वचालित करें एवं हॉलेज डंपर पुनर्निर्देशित करें' : lang === 'mr' ? 'शिफ्ट बदल वंगण शुद्धीकरण स्वयंचलित करा व डंपर वळवा' : 'Automate shift change lubrication purge and re-route haul dumpers',
      explainability: 'Evaluates 3 alternative countermeasure vectors across cost, recovery, and lead time.'
    },
    'equipment-health': {
      detects: lang === 'hi' ? 'प्रारंभिक बेयरिंग हार्मोनिक गिरावट, मोटर ओवरहीटिंग, हाइड्रोलिक सील रिसाव' : lang === 'mr' ? 'सुरुवातीचे बेअरिंग बिघाड, मोटर अतिउष्णता, हायड्रॉलिक गळती' : 'Early bearing harmonic degradation, motor overheating, hydraulic seal leaks',
      inputs: 'FFT Acceleration Peaks (42 Hz), RTD Thermal Drift (°C), Hydraulic Pressure (Bar)',
      aiModel: 'Weibull Hazard Rate & Long Short-Term Memory (LSTM) Autoencoders',
      confidence: '89.6%',
      output: `${lang === 'hi' ? 'क्रशर स्वास्थ्य' : lang === 'mr' ? 'क्रशर आरोग्य' : 'Crusher health at'} ${activeMine.crusherHealthBase || 84}% • 48 Days RUL`,
      action: lang === 'hi' ? 'शिफ्ट परिवर्तन के दौरान 45 मिनट के निवारक रखरखाव का समय निर्धारित करें' : lang === 'mr' ? 'शिफ्ट बदलादरम्यान 45 मिनिटांच्या प्रतिबंधात्मक देखभालीचे नियोजन करा' : 'Schedule 45-minute preventative maintenance during shift change',
      explainability: 'Harmonic vibration z-score spike isolated to drive motor outer race bearing.'
    },
    'trust-score': {
      detects: lang === 'hi' ? 'सेंसर बहाव, डेटा विकृति, भविष्यवाणी अनिश्चितता, एवं वैधानिक गैर-अनुपालन' : lang === 'mr' ? 'सेन्सर त्रुटी, डेटा बिघाड, अंदाज अनिश्चितता व वैधानिक गैर-पालन' : 'Sensor drift, data corruption, prediction uncertainty, and statutory non-compliance',
      inputs: 'Piezometer Calibration, Weighbridge Scans, Core Assay Variance, DGMS Records',
      aiModel: 'Bayesian Uncertainty Quantification & Dempster-Shafer Evidence Theory',
      confidence: '95.8%',
      output: '5-Pillar Bayesian Audit Score: 95.8% (Statutory Clear)',
      action: lang === 'hi' ? 'सत्यापित डीजीएमएस अनुपालन प्रमाणपत्र जारी करें एवं अपरिवर्तनीय निर्णय हैश लॉग करें' : lang === 'mr' ? 'प्रमाणित डीजीएमएस अनुपालन प्रमाणपत्र जारी करा व अपरिवर्तनीय निर्णय हॅश नोंदवा' : 'Issue verified DGMS compliance certificate and log immutable decision hash',
      explainability: 'Quantifies epistemic and aleatoric uncertainty across all sub-surface telemetry.'
    },
    'anomaly-detector': {
      detects: lang === 'hi' ? 'अप्रत्याशित मिश्रित बहु-परिवर्तनीय परिचालन संकट' : lang === 'mr' ? 'अनपेक्षित मिश्र बहु-चलात्मक ऑपरेशनल संकट' : 'Unforeseen compound multivariable operational crises',
      inputs: 'Multi-Stream Telemetry Ingestion (128 Nodes at 1.2s Sync Rate)',
      aiModel: 'Isolation Forest + Mahalanobis Distance Multivariable Classifier',
      confidence: '93.0%',
      output: 'Compound Threat State: Nominal Baseline Monitoring',
      action: lang === 'hi' ? 'मुख्य खनन अभियंता समीक्षा के लिए बहु-वेक्टर विसंगति को चिह्नित करें' : lang === 'mr' ? 'मुख्य खाण अभियंता पुनरावलोकनासाठी बहु-वेक्टर त्रुटी चिन्हांकित करा' : 'Flag multi-vector anomaly for Chief Mining Engineer review',
      explainability: 'Mahalanobis distance metric isolates cross-sensor covariance breakdown.'
    }
  };

  const details = engineDetails[selectedEngine.id] || engineDetails['shortfall-alert'];

  return (
    <section className="command-container py-12 select-none">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-obsidian-800 pb-6">
        <div>
          <div className="badge-manganese mb-2">
            <Sparkles className="w-3.5 h-3.5 text-manganese-400" />
            <span>{lang === 'hi' ? 'स्वायत्त खनन वास्तुकला' : lang === 'mr' ? 'स्वायत्त खाणकाम वास्तुकला' : 'AUTONOMOUS MINING ARCHITECTURE'}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {t.engines?.title || 'ONE PLATFORM. SIX INTELLIGENCE ENGINES.'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl font-mono">
            {t.engines?.subtitle || 'Engineered for extreme reliability in deep shaft underground and large-scale opencast manganese mining.'}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
          <span className="text-manganese-400 font-bold">{lang === 'hi' ? 'सक्रिय क्षेत्र:' : lang === 'mr' ? 'सक्रिय विभाग:' : 'ACTIVE SECTOR:'}</span>
          <span className="text-white font-bold">{activeMine.name}</span>
        </div>
      </div>

      {/* Asymmetric Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 5 Cols: Technical Engine Navigation List */}
        <div className="lg:col-span-5 space-y-2.5">
          {INTELLIGENCE_ENGINES.map((engine, idx) => {
            const isSelected = activeEngineId === engine.id;

            return (
              <div
                key={engine.id}
                onClick={() => setActiveEngineId(engine.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-obsidian-850 border-manganese-500/60 shadow-lg ring-1 ring-manganese-500/30'
                    : 'bg-obsidian-900/60 border-obsidian-800 hover:border-obsidian-700 hover:bg-obsidian-850/60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                    isSelected ? 'bg-manganese-500/20 text-manganese-300 border border-manganese-500/40' : 'bg-obsidian-800 text-zinc-400'
                  }`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      {engine.category}
                    </div>
                    <div className={`text-sm font-bold transition-colors ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                      {engine.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    isSelected ? 'bg-manganese-400 animate-ping' : 'bg-telemetry-500'
                  }`} />
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-manganese-400 translate-x-0.5' : 'text-zinc-600'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 7 Cols: Expansive Spotlight Intelligence Chamber */}
        <div className="lg:col-span-7 panel-surface p-6 sm:p-8 border border-obsidian-750/90 shadow-2xl space-y-6 font-mono text-xs">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-obsidian-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-obsidian-950 border border-obsidian-750 flex items-center justify-center shadow-inner">
                <Icon className="w-6 h-6 text-manganese-400" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-manganese-400 font-semibold">
                  {selectedEngine.code} • {selectedEngine.category}
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {selectedEngine.name}
                </h3>
              </div>
            </div>

            <span className="badge-telemetry text-[10px] font-bold">
              {lang === 'hi' ? 'एआई विश्वास:' : lang === 'mr' ? 'एआय विश्वास:' : 'AI CONFIDENCE:'} {details.confidence}
            </span>
          </div>

          {/* Tagline */}
          <p className="text-sm text-manganese-300 font-semibold leading-relaxed">
            {selectedEngine.tagline}
          </p>

          {/* Deep Technical Architecture Matrix */}
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-obsidian-950/80 border border-obsidian-800">
              <span className="text-zinc-500 text-[10px] uppercase block font-bold">{lang === 'hi' ? 'यह क्या पहचानता है:' : lang === 'mr' ? 'हे काय ओळखते:' : 'What It Detects:'}</span>
              <span className="text-zinc-200 text-xs mt-0.5 block">{details.detects}</span>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-950/80 border border-obsidian-800">
              <span className="text-zinc-500 text-[10px] uppercase block font-bold">{lang === 'hi' ? 'एआई मॉडल एवं एल्गोरिदम:' : lang === 'mr' ? 'एआय मॉडेल व अल्गोरिदम:' : 'AI Model & Algorithm:'}</span>
              <span className="text-white text-xs mt-0.5 block">{details.aiModel}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-obsidian-950/80 border border-obsidian-800">
                <span className="text-zinc-500 text-[10px] uppercase block font-bold">{lang === 'hi' ? 'वर्तमान लाइव आउटपुट:' : lang === 'mr' ? 'सध्याचे थेट आउटपुट:' : 'Current Live Output:'}</span>
                <span className="text-manganese-300 text-xs mt-0.5 block font-bold">{details.output}</span>
              </div>

              <div className="p-3 rounded-xl bg-obsidian-950/80 border border-obsidian-800">
                <span className="text-zinc-500 text-[10px] uppercase block font-bold">{lang === 'hi' ? 'प्रभावित क्षेत्र:' : lang === 'mr' ? 'प्रभावित विभाग:' : 'Affected Sector:'}</span>
                <span className="text-telemetry-300 text-xs mt-0.5 block font-bold">{activeMine.name}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-950/80 border border-obsidian-800">
              <span className="text-zinc-500 text-[10px] uppercase block font-bold">{lang === 'hi' ? 'अनुशंसित निर्देशात्मक कार्रवाई:' : lang === 'mr' ? 'शिफारस केलेली निर्देशात्मक कृती:' : 'Prescriptive Action Recommended:'}</span>
              <span className="text-white text-xs mt-0.5 block">{details.action}</span>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-950/80 border border-obsidian-800">
              <span className="text-zinc-500 text-[10px] uppercase block font-bold">{lang === 'hi' ? 'स्पष्टीकरण एवं एट्रिब्यूशन:' : lang === 'mr' ? 'स्पष्टीकरण व ॲट्रिब्युशन:' : 'Explainability & Attribution:'}</span>
              <span className="text-zinc-300 text-xs mt-0.5 block">{details.explainability}</span>
            </div>
          </div>

          {/* Action Launch Bar */}
          <div className="pt-4 border-t border-obsidian-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-zinc-500 text-[11px]">
              {lang === 'hi' ? 'अनुमान एसएलए: <1.4s • आईएसओ 22932 अनुपालन' : lang === 'mr' ? 'अंदाज एसएलए: <1.4s • आयएसओ 22932 पालन' : 'Inference SLA: <1.4s • ISO 22932 Compliant'}
            </span>

            <Link
              to={selectedEngine.route}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-manganese-500 hover:bg-manganese-400 text-obsidian-950 text-xs font-mono font-bold tracking-wide uppercase shadow-lg transition-transform hover:scale-[1.02]"
            >
              <span>{lang === 'hi' ? `लॉन्च करें ${selectedEngine.name}` : lang === 'mr' ? `सुरू करा ${selectedEngine.name}` : `Launch ${selectedEngine.name}`}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>

    </section>
  );
};
