import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Lock, 
  Activity, 
  FileText, 
  TrendingUp,
  Cpu,
  Radio,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

export const TrustScorePreview = () => {
  const { trustPillars, activeMine, t, lang } = useApp();
  const overall = trustPillars && trustPillars[0] ? trustPillars[0] : { score: 95.4, grade: 'Exceptional (Tier 1)', trend: '+0.8%' };
  const pillars = trustPillars ? trustPillars.slice(1) : [];

  return (
    <section className="command-container py-12 border-t border-obsidian-800 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="badge-telemetry mb-3">
            <ShieldCheck className="w-3 h-3 text-telemetry-400 animate-pulse" />
            <span>{lang === 'hi' ? 'स्पष्टीकरण एवं प्रशासन अंशांकन' : lang === 'mr' ? 'स्पष्टीकरण व नियमन कॅलिब्रेशन' : 'EXPLAINABILITY & GOVERNANCE CALIBRATION'}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            {lang === 'hi' ? 'मॉडल निश्चितता एवं विश्वास सूचकांक' : lang === 'mr' ? 'मॉडेल निश्चितता व विश्वास निर्देशांक' : 'Model Certainty & Trust Index'}
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-2xl font-normal">
            {lang === 'hi' ? `${activeMine.name} के लिए सतत बायेसियन टेलीमेट्री सत्यापन जो सख्त डीजीएमएस अनुपालन सुनिश्चित करता है।` :
             lang === 'mr' ? `${activeMine.name} साठी सतत बायेशियन टेलिमेट्री पडताळणी जी कठोर डीजीएमएस पालनाची खात्री देते.` :
             `Continuous Bayesian telemetry verification for ${activeMine.name} ensuring strict DGMS compliance.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-obsidian-900 border border-obsidian-750 font-mono text-xs text-zinc-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-telemetry-400 animate-ping" />
            <span>{lang === 'hi' ? 'अंशांकन: लाइव' : lang === 'mr' ? 'कॅलिब्रेशन: थेट' : 'CALIBRATION: LIVE'}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Overall Big Gauge + Right 4 Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 5 Cols: Massive Overall Score Hero Card */}
        <div className="lg:col-span-5 panel-surface p-8 sm:p-10 border border-obsidian-700/80 relative overflow-hidden flex flex-col justify-between shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
              <span>{lang === 'hi' ? 'समग्र गवर्नेंस सूचकांक' : lang === 'mr' ? 'एकूण गव्हर्नन्स निर्देशांक' : 'OVERALL GOVERNANCE INDEX'}</span>
              <span className="badge-telemetry text-[10px]">{overall.grade}</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display text-6xl sm:text-7xl font-extrabold text-white tracking-tight">
                {overall.score}%
              </span>
              <span className="text-sm font-mono text-telemetry-400 font-bold">
                {overall.trend}
              </span>
            </div>

            <p className="text-xs font-mono text-zinc-400 leading-relaxed">
              {lang === 'hi' ? `${activeMine.name} में आईओटी सेंसर, भौतिक खदान बाधाओं और बैकटेस्टेड शिफ्ट रिपोर्टों पर अंशांकित समग्र बायेसियन विश्वास सूचकांक।` :
               lang === 'mr' ? `${activeMine.name} मध्ये आयओटी सेन्सर्स, भौतिक खाण मर्यादा आणि बॅक-टेस्ट केलेल्या शिफ्ट अहवालांवर कॅलिब्रेट केलेला एकूण बायेशियन विश्वास निर्देशांक.` :
               `Composite Bayesian trust index calibrated across IoT sensors, physical mine constraints, and backtested shift reports at ${activeMine.name}.`}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-obsidian-800 space-y-3 font-mono text-xs">
            <div className="flex justify-between text-zinc-300">
              <span className="text-zinc-400">{lang === 'hi' ? 'ऑडिट स्थिति:' : lang === 'mr' ? 'ऑडिट स्थिती:' : 'Audit Status:'}</span>
              <strong className="text-white">{lang === 'hi' ? 'डीजीएमएस वैधानिक अनुपालन' : lang === 'mr' ? 'डीजीएमएस वैधानिक पालन' : 'DGMS Statutory Compliant'}</strong>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span className="text-zinc-400">{lang === 'hi' ? 'अंशांकन विधि:' : lang === 'mr' ? 'कॅलिब्रेशन पद्धत:' : 'Calibration Method:'}</span>
              <strong className="text-telemetry-400">{lang === 'hi' ? 'नियतिवादी बायेसियन कर्नेल' : lang === 'mr' ? 'नियतात्मक बायेशियन कर्नल' : 'Deterministic Bayesian Kernel'}</strong>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: 4 Specific Pillars */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-obsidian-900/80 border border-obsidian-750/80 hover:border-obsidian-600 transition-all flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white font-mono">{pillar.name}</span>
                  <span className="text-xs font-bold font-mono text-telemetry-400">{pillar.score}%</span>
                </div>
                <p className="text-[11px] font-mono text-zinc-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-obsidian-950 overflow-hidden border border-obsidian-800">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-manganese-500 to-telemetry-400 transition-all duration-700"
                  style={{ width: `${pillar.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
};
