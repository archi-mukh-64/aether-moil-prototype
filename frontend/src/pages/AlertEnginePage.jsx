import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { ForecastPreview } from '../components/ForecastPreview.jsx';
import { RiskCenterPreview } from '../components/RiskCenterPreview.jsx';
import { AetherSectionHeader, AetherStatusBadge } from '../components/design-system/index.js';
import { ErrorBoundary } from '../components/common/ErrorBoundary.jsx';
import { 
  AlertTriangle, 
  Sparkles, 
  Server,
  Globe2,
  Layers,
  BrainCircuit,
  Activity,
  ShieldAlert
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
    <div className="space-y-6 font-sans">
      
      {/* 1. TOP ALERT ENGINE HEADER */}
      <AetherSectionHeader
        title={ae?.title || 'Shortfall Alert Engine & Threat Matrix'}
        subtitle={`Predicting manganese production shortfalls up to 14 days in advance with transparent TreeSHAP root-cause attribution and Earth Observation remote sensing for ${currentMine.name}.`}
        badge="AETHER-FORECAST v3.4"
        accent="#DC2626"
        icon={ShieldAlert}
        actions={
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold flex items-center gap-1.5 shadow-xs">
              <BrainCircuit className="w-3.5 h-3.5 text-red-600" />
              <span>MULTI-PHYSICS + ML SHAP</span>
            </span>
          </div>
        }
      />

      {/* 2. EARTH OBSERVATION MULTI-SOURCE RISK ALERT BANNER */}
      <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-xs flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#172033]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-600">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-amber-700 font-bold uppercase tracking-wider font-mono">
              {lang === 'hi' ? 'पृथ्वी अवलोकन चेतावनी स्रोत // सेंटीनेल-2 एवं स्काडा सहसंबंध' : lang === 'mr' ? 'पृथ्वी निरीक्षण इशारा स्रोत // सेंटिनेल-2 व स्काडा सहसंबंध' : 'EARTH OBSERVATION ALERT SOURCE // SENTINEL-2 & SCADA CORRELATION'}
            </div>
            <div className="text-sm font-bold text-[#172033] mt-0.5 font-display">
              {lang === 'hi' ? 'बहु-स्रोत जोखिम संलयन: उपग्रह नमी विसंगति + स्काडा प्रवाह चेतावनी' : lang === 'mr' ? 'बहु-स्रोत जोखीम एकत्रीकरण: उपग्रह आर्द्रता विसंगती + स्काडा प्रवाह इशारा' : 'Multi-Source Risk Fusion: Satellite Moisture Anomaly + SCADA Flow Alert'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <div className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[#64748B]">{lang === 'hi' ? 'सक्रिय खान: ' : lang === 'mr' ? 'सक्रिय खाण: ' : 'ACTIVE MINE: '}</span>
            <strong className="text-[#172033]">{currentMine.name} ({currentMine.productionTarget?.toLocaleString()} TPD)</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
            <span>LIVE SIMULATION ENGAGED</span>
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
