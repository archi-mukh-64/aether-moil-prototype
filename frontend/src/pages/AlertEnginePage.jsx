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

      {/* 1. TOP ALERT ENGINE HEADER (Theme: Safety / Threat, Accent: Vermilion #C84B3F) */}
      <AetherSectionHeader
        title={ae?.title || 'Shortfall Alert Engine & Threat Matrix'}
        subtitle={`Predicting manganese production shortfalls up to 14 days in advance with transparent TreeSHAP root-cause attribution and Earth Observation remote sensing for ${currentMine.name}.`}
        badge="AETHER-FORECAST v3.4"
        accent="#C84B3F"
        icon={ShieldAlert}
        actions={
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-[#C84B3F]/15 border border-[#C84B3F]/40 text-[#872C23] font-bold flex items-center gap-1.5 shadow-xs">
              <BrainCircuit className="w-3.5 h-3.5 text-[#C84B3F]" />
              <span>MULTI-PHYSICS + ML SHAP</span>
            </span>
          </div>
        }
      />

      {/* 2. EARTH OBSERVATION MULTI-SOURCE RISK ALERT BANNER */}
      <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#272A27]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-lg bg-[#C84B3F]/10 border border-[#C84B3F]/30 text-[#C84B3F] shrink-0">
            <Globe2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-[#872C23] font-bold uppercase tracking-wider font-mono">
              {lang === 'hi' ? 'पृथ्वी अवलोकन चेतावनी स्रोत // सेंटीनेल-2 एवं स्काडा सहसंबंध' : lang === 'mr' ? 'पृथ्वी निरीक्षण इशारा स्रोत // सेंटिनेल-2 व स्काडा सहसंबंध' : 'EARTH OBSERVATION ALERT SOURCE // SENTINEL-2 & SCADA CORRELATION'}
            </div>
            <div className="text-sm font-bold text-[#272A27] mt-0.5 font-display truncate">
              {lang === 'hi' ? 'बहु-स्रोत जोखिम संलयन: उपग्रह नमी विसंगति + स्काडा प्रवाह चेतावनी' : lang === 'mr' ? 'बहु-स्रोत जोखीम एकत्रीकरण: उपग्रह आर्द्रता विसंगती + स्काडा प्रवाह इशारा' : 'Multi-Source Risk Fusion: Satellite Moisture Anomaly + SCADA Flow Alert'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] shrink-0">
          <div className="px-3 py-1.5 rounded-lg bg-[#F5F1E9] border border-[#C8BFAF]">
            <span className="text-[#5F625C]">{lang === 'hi' ? 'सक्रिय खान: ' : lang === 'mr' ? 'सक्रिय खाण: ' : 'ACTIVE MINE: '}</span>
            <strong className="text-[#272A27]">{currentMine.name} ({currentMine.productionTarget?.toLocaleString()} TPD)</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#71856B]/20 border border-[#71856B]/40 text-[#4A5845] font-bold">
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
