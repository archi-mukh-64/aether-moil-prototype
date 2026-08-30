import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  HelpCircle, 
  Info, 
  Layers, 
  Cpu, 
  Activity 
} from 'lucide-react';

export const EvidencePanel = () => {
  const { activeScenario, activeMine, t, lang } = useApp();

  if (!activeScenario) return null;

  const factors = activeScenario.evidenceFactors || [];

  return (
    <div className="panel-surface p-6 sm:p-8 border border-manganese-500/30 font-mono text-xs space-y-6 shadow-2xl animate-fade-in select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-obsidian-800 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-manganese-500/20 border border-manganese-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-manganese-400" />
          </div>
          <div>
            <div className="text-[10px] text-manganese-400 font-bold uppercase tracking-wider">
              {lang === 'hi' ? 'चरण 3 // साक्ष्य एवं व्याख्या' : lang === 'mr' ? 'टप्पा 3 // पुरावे व स्पष्टीकरण' : 'STEP 3 // EVIDENCE & EXPLANATION'}
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              {lang === 'hi' ? `${activeMine.name} में मूल-कारण चालक` : lang === 'mr' ? `${activeMine.name} मधील मूळ-कारण घटक` : `Root-Cause Drivers at ${activeMine.name}`}
            </h3>
          </div>
        </div>

        <div className="px-2.5 py-1 rounded-lg bg-obsidian-950 border border-obsidian-800 text-[10px] text-manganese-400 font-bold self-start sm:self-auto">
          <span>{lang === 'hi' ? 'विशेषता एट्रिब्यूशन (सिम्युलेटेड SHAP)' : lang === 'mr' ? 'वैशिष्ट्य ॲट्रिब्युशन (सिम्युलेटेड SHAP)' : 'FEATURE ATTRIBUTION (SIMULATED SHAP)'}</span>
        </div>
      </div>

      <p className="text-zinc-400 font-sans text-xs leading-relaxed">
        {lang === 'hi' ? 'योगात्मक स्थानीय विशेषता एट्रिब्यूशन द्वारा परिमाणित रैंक किए गए मूल कारण चालक। अपारदर्शी भविष्यवाणी के बजाय कारण व्याख्यात्मकता प्रदर्शित करता है।' :
         lang === 'mr' ? 'स्थानिक वैशिष्ट्य ॲट्रिब्युशनद्वारे मोजलेले क्रमवारी केलेले मूळ कारण घटक. अपारदर्शक अंदाजाऐवजी कारणात्मक स्पष्टीकरण प्रदर्शित करते.' :
         'Ranked root-cause drivers quantified by additive local feature attribution. Demonstrates causal interpretability rather than opaque prediction.'}
      </p>

      {/* Ranked Factors Waterfall */}
      <div className="space-y-3 font-mono">
        {factors.map((f) => {
          const isElevating = f.direction === 'risk_elevating';
          
          return (
            <div
              key={f.rank}
              className="p-4 rounded-xl bg-obsidian-950/80 border border-obsidian-800/90 space-y-2.5 hover:border-obsidian-700 transition-all"
            >
              {/* Factor Title & Impact */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-obsidian-800 border border-obsidian-700 flex items-center justify-center text-[10px] font-bold text-manganese-400 flex-shrink-0">
                    {f.rank}
                  </span>
                  <div>
                    <span className="font-bold text-white text-xs">{f.factor}</span>
                    <span className="text-[10px] text-zinc-500 ml-2">({f.category})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className={`flex items-center gap-1 font-bold text-xs ${
                    isElevating ? 'text-hazard-400' : 'text-telemetry-400'
                  }`}>
                    {isElevating ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                    <span>{isElevating ? `+${f.impactPct}%` : `-${f.impactPct}%`}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 uppercase">
                    {isElevating ? (lang === 'hi' ? 'जोखिम योगदान' : lang === 'mr' ? 'जोखीम योगदान' : 'Risk Contrib') : (lang === 'hi' ? 'बफर ऑफसेट' : lang === 'mr' ? 'बफर ऑफसेट' : 'Buffer Offset')}
                  </span>
                </div>
              </div>

              {/* Progress Bar Representation */}
              <div className="w-full h-2 bg-obsidian-900 rounded-full overflow-hidden border border-obsidian-850">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isElevating ? 'bg-gradient-to-r from-hazard-600 to-hazard-400' : 'bg-gradient-to-r from-telemetry-600 to-telemetry-400'
                  }`}
                  style={{ width: `${Math.min(100, f.impactPct * 1.8)}%` }}
                />
              </div>

              {/* Technical Detail Explainer */}
              <div className="text-[11px] text-zinc-400 font-sans leading-tight">
                {f.detail}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
