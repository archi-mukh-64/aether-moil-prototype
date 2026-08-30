import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { ForecastPreview } from '../components/ForecastPreview.jsx';
import { RiskCenterPreview } from '../components/RiskCenterPreview.jsx';
import { SectionHeader } from '../components/design/SectionHeader.jsx';
import { ErrorBoundary } from '../components/common/ErrorBoundary.jsx';
import { 
  AlertTriangle, 
  Sparkles, 
  Server,
  Globe2,
  Layers,
  BrainCircuit,
  Activity
} from 'lucide-react';

export const AlertEnginePage = () => {
  return (
    <ErrorBoundary title="SHORTFALL ALERT ENGINE MODULE">
      <AlertEngineContent />
    </ErrorBoundary>
  );
};

const AlertEngineContent = () => {
  const { activeMine, t, lang } = useApp();
  const ae = t?.alertEngine || {};

  const currentMine = activeMine || {
    id: 'balaghat',
    name: 'Balaghat Mine',
    shortName: 'Balaghat',
    rainfallSensitivity: 1.35,
    crusherHealthBase: 88,
    waterTableDepth: '-185m Level',
    stockpileBufferT: 850,
    oreGrade: '44.2% Mn',
    shortfallRisk: 'Low (12%)',
    productionTarget: 6200
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto space-y-6 font-sans">
      
      {/* 1. TOP ALERT ENGINE HEADER */}
      <SectionHeader
        category={ae?.predictiveBadge || 'AI EARLY WARNING & SHAP EXPLAINABILITY'}
        categoryColor="#FF5A67"
        badge="AETHER-FORECAST v3.4"
        badgeColor="#8B7CFF"
        title={ae?.title || 'Shortfall Alert Engine & Anomaly Detector'}
        subtitle={`Predicting manganese production shortfalls up to 14 days in advance with transparent TreeSHAP root-cause attribution and Earth Observation remote sensing for ${currentMine.name}.`}
        actions={
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-[#151B23] border border-violet-500/30 text-violet-400 font-bold flex items-center gap-1.5 shadow-glow-violet">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>MULTI-PHYSICS + ML</span>
            </span>
          </div>
        }
      />

      {/* 2. EARTH OBSERVATION MULTI-SOURCE RISK ALERT BANNER */}
      <div className="p-4 rounded-2xl bg-[#151B23] border border-amber-500/40 shadow-card-subtle flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-coral-500 via-amber-400 to-cyan-400 opacity-90" />

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              {lang === 'hi' ? 'पृथ्वी अवलोकन चेतावनी स्रोत // सेंटीनेल-2 एवं स्काडा सहसंबंध' : lang === 'mr' ? 'पृथ्वी निरीक्षण इशारा स्रोत // सेंटिनेल-2 व स्काडा सहसंबंध' : 'EARTH OBSERVATION ALERT SOURCE // SENTINEL-2 & SCADA CORRELATION'}
            </div>
            <div className="text-sm font-bold text-white mt-0.5 font-sans">
              {lang === 'hi' ? 'बहु-स्रोत जोखिम संलयन: उपग्रह नमी विसंगति + स्काडा प्रवाह चेतावनी' : lang === 'mr' ? 'बहु-स्रोत जोखीम एकत्रीकरण: उपग्रह आर्द्रता विसंगती + स्काडा प्रवाह इशारा' : 'Multi-Source Risk Fusion: Satellite Moisture Anomaly + SCADA Flow Alert'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <div className="px-3 py-1.5 rounded-xl bg-[#1A232E] border border-[#222D3A]">
            <span className="text-slate-400">{lang === 'hi' ? 'सक्रिय खान: ' : lang === 'mr' ? 'सक्रिय खाण: ' : 'ACTIVE MINE: '}</span>
            <strong className="text-amber-300">{currentMine.name} ({currentMine.productionTarget?.toLocaleString()} TPD)</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#1A232E] border border-[#222D3A]">
            <span className="text-slate-400">{lang === 'hi' ? 'स्थिति: ' : lang === 'mr' ? 'स्थिती: ' : 'STATUS: '}</span>
            <strong className="text-emerald-400">{lang === 'hi' ? 'लाइव सिमुलेशन सक्रिय' : lang === 'mr' ? 'थेट सिम्युलेशन सक्रिय' : 'LIVE SIMULATION ENGAGED'}</strong>
          </div>
        </div>
      </div>

      {/* 3. PRODUCTION FORECAST TIME-SERIES CHART */}
      <ForecastPreview />

      {/* 4. OPERATIONAL RISK CENTER COMPONENT */}
      <RiskCenterPreview />

    </div>
  );
};
