import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { AetherSectionHeader, AetherStatusBadge } from '../components/design-system/index.js';
import { ErrorBoundary } from '../components/common/ErrorBoundary.jsx';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const ProtocolPage = () => {
  return (
    <ErrorBoundary title="AUTONOMOUS MITIGATION PROTOCOLS">
      <ProtocolPageContent />
    </ErrorBoundary>
  );
};

const ProtocolPageContent = () => {
  const { activeMine, activeScenario, lang, t } = useApp();
  const [dispatchedProtocols, setDispatchedProtocols] = useState({});

  const handleDispatch = (protocolId) => {
    setDispatchedProtocols(prev => ({
      ...prev,
      [protocolId]: true
    }));
  };

  const protocols = [
    {
      id: 'PROT-MON-01',
      scenarioMatch: 'MONSOON',
      title: lang === 'hi' ? 'सहायक जल निकासी एवं खदान संप सुरक्षा' : lang === 'mr' ? 'सहाय्यक निचरा व खाण संप संरक्षण' : 'Deep Sump Dewatering & Haul Road Slurry Clearance',
      category: 'HYDROGEOLOGICAL MITIGATION',
      categoryColor: '#3D8C8A',
      severity: 'CRITICAL',
      description: 'Activate 3 auxiliary high-head submersible pumps (650 m³/h capacity) at Level -185m sump and deploy grader fleet with crushed slag binder to Western haul road haulage ramps.',
      expectedRecovery: '+1,116 T / Day (+80.8% shortfall prevented)',
      roi: '₹18.4 Lakhs / Shift Revenue Protected',
      timeToDeploy: '18 Minutes',
      confidence: '96.4%'
    },
    {
      id: 'PROT-CRU-02',
      scenarioMatch: 'CRUSHER',
      title: lang === 'hi' ? 'प्राथमिक क्रशर फीड नियंत्रण एवं कंपन शमन' : lang === 'mr' ? 'प्राथमिक क्रशर फीड नियंत्रण व कंपन शमन' : 'Primary Jaw Crusher Feed Throttling & Thermal Dissipation',
      category: 'ELECTROMECHANICAL MITIGATION',
      categoryColor: '#C46A32',
      severity: 'CRITICAL',
      description: 'Throttle vibratory feeder rate from 280 to 200 TPH, engage forced-air oil mist cooling to drive bearing #2, and divert oversized ROM boulders (>450mm) to secondary mobile impact crusher.',
      expectedRecovery: '+610 T / Day (Bearing failure prevented)',
      roi: '₹34.5 Lakhs Asset Replacement Avoided',
      timeToDeploy: '12 Minutes',
      confidence: '94.8%'
    },
    {
      id: 'PROT-GRD-03',
      scenarioMatch: 'BASELINE',
      title: lang === 'hi' ? 'उच्च-ग्रेड अयस्क स्टॉकपाइल सम्मिश्रण' : lang === 'mr' ? 'उच्च-प्रत धातुक साठा मिश्रण' : 'Non-Linear Manganese Grade Blending & Stockpile Recovery',
      category: 'METALLURGICAL QUALITY ASSURANCE',
      categoryColor: '#655C9F',
      severity: 'OPTIMAL',
      description: 'Dynamically mix low-grade ROM (38.2% Mn) with high-grade silo buffer ore (48.5% Mn) in a 60:40 ratio using precision load-cell feeder belts to deliver guaranteed 44.0% Mn furnace feed.',
      expectedRecovery: 'Grade compliance maintained at 44.2% Mn',
      roi: 'Zero Grade Penalty (₹6.8 Lakhs/lot value preserved)',
      timeToDeploy: 'Immediate Continuous',
      confidence: '98.1%'
    }
  ];

  return (
    <div className="space-y-6 font-sans text-[#272A27]">

      {/* 1. TOP PROTOCOL HEADER (Theme: Regulatory, Accent: Burgundy #7D4545) */}
      <AetherSectionHeader
        title={`${activeMine.name} — Statutory Mitigation Protocols`}
        subtitle="Actionable, pre-validated operational procedures calibrated to physical mine hydrogeology, crusher vibration thresholds, and ore blend requirements."
        badge="AUTO-PRESCRIPTIVE"
        accent="#7D4545"
        icon={ShieldCheck}
        actions={
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-[#71856B]/15 border border-[#71856B]/40 text-[#4A5845] font-bold flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#71856B]" />
              <span>STATUTORY COMPLIANT</span>
            </span>
          </div>
        }
      />

      {/* 2. PROTOCOL ACTION CARDS GRID */}
      <div className="grid grid-cols-1 gap-5 font-mono">
        {protocols.map((p) => {
          const isDispatched = dispatchedProtocols[p.id];

          return (
            <div key={p.id} className="p-5 sm:p-6 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] hover:border-[#85877E] shadow-mineral-sm hover:shadow-mineral-md transition-all space-y-4 relative overflow-hidden text-[#272A27]">
              {/* Top Accent Line */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ backgroundColor: p.categoryColor || '#7D4545' }}
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#DDD4C5]">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-xl border"
                    style={{
                      backgroundColor: `${p.categoryColor}15`,
                      borderColor: `${p.categoryColor}35`,
                      color: p.categoryColor
                    }}
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: p.categoryColor }}>
                        {p.category} • {p.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#71856B]/20 text-[#4A5845] border border-[#71856B]/40 text-[10px] font-bold font-mono">
                        {p.confidence} CONFIDENCE
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#272A27] tracking-tight mt-0.5 font-display">
                      {p.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-[#5F625C] block uppercase font-mono">DEPLOYMENT TIME</span>
                    <strong className="text-xs text-[#272A27] font-mono">{p.timeToDeploy}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#5F625C] block uppercase font-mono">VALUE PROTECTED</span>
                    <strong className="text-xs text-[#C46A32] font-mono">{p.roi}</strong>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#5F625C] leading-relaxed font-sans font-medium">
                {p.description}
              </p>

              {/* Metrics & Dispatch Button Row */}
              <div className="pt-2 border-t border-[#DDD4C5] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-[#4A5845] font-bold">
                    <TrendingUp className="w-3.5 h-3.5 text-[#71856B]" />
                    <span>{p.expectedRecovery}</span>
                  </div>
                  <AetherStatusBadge status={p.severity} size="sm" pulse={false} />
                </div>

                <button
                  onClick={() => handleDispatch(p.id)}
                  disabled={isDispatched}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-sm ${
                    isDispatched
                      ? 'bg-[#71856B]/20 text-[#4A5845] border border-[#71856B]/40 cursor-default'
                      : 'bg-[#7D4545] hover:bg-[#683636] text-white cursor-pointer'
                  }`}
                >
                  {isDispatched ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#71856B]" />
                      <span>DISPATCHED TO SHIFT CONTROLLER</span>
                    </>
                  ) : (
                    <>
                      <span>EXECUTE MITIGATION DISPATCH</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
