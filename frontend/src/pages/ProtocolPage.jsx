import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { AetherSectionHeader, AetherStatusBadge } from '../components/design-system/index.js';
import { ErrorBoundary } from '../components/common/ErrorBoundary.jsx';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Activity, 
  Wrench, 
  Droplet, 
  Sliders,
  DollarSign
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
      categoryColor: '#0891B2',
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
      categoryColor: '#F59E0B',
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
      categoryColor: '#6366F1',
      severity: 'OPTIMAL',
      description: 'Dynamically mix low-grade ROM (38.2% Mn) with high-grade silo buffer ore (48.5% Mn) in a 60:40 ratio using precision load-cell feeder belts to deliver guaranteed 44.0% Mn furnace feed.',
      expectedRecovery: 'Grade compliance maintained at 44.2% Mn',
      roi: 'Zero Grade Penalty (₹6.8 Lakhs/lot value preserved)',
      timeToDeploy: 'Immediate Continuous',
      confidence: '98.1%'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. TOP PROTOCOL HEADER */}
      <AetherSectionHeader
        title={`${activeMine.name} — Statutory Mitigation Protocols`}
        subtitle="Actionable, pre-validated operational procedures calibrated to physical mine hydrogeology, crusher vibration thresholds, and ore blend requirements."
        badge="AUTO-PRESCRIPTIVE"
        accent="#10B981"
        icon={ShieldCheck}
        actions={
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
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
            <div key={p.id} className="p-5 sm:p-6 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-xs hover:shadow-md transition-all space-y-4 relative overflow-hidden">
              {/* Top Accent Line */}
              <div 
                className="absolute top-0 left-0 right-0 h-[3px]" 
                style={{ backgroundColor: p.categoryColor || '#10B981' }} 
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
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
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold font-mono">
                        {p.confidence} CONFIDENCE
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#172033] tracking-tight mt-0.5 font-display">
                      {p.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-[#64748B] block uppercase font-mono">DEPLOYMENT TIME</span>
                    <strong className="text-xs text-[#172033] font-mono">{p.timeToDeploy}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#64748B] block uppercase font-mono">VALUE PROTECTED</span>
                    <strong className="text-xs text-amber-700 font-mono">{p.roi}</strong>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#475569] leading-relaxed font-sans font-medium">
                {p.description}
              </p>

              {/* Metrics & Dispatch Button Row */}
              <div className="pt-2 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{p.expectedRecovery}</span>
                  </div>
                  <AetherStatusBadge status={p.severity} size="sm" pulse={false} />
                </div>

                <button
                  onClick={() => handleDispatch(p.id)}
                  disabled={isDispatched}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-xs ${
                    isDispatched
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                      : 'bg-[#172033] hover:bg-[#1E293B] text-white cursor-pointer'
                  }`}
                >
                  {isDispatched ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>DISPATCHED TO SHIFT CONTROLLER</span>
                    </>
                  ) : (
                    <>
                      <span>EXECUTE MITIGATION DISPATCH</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
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
