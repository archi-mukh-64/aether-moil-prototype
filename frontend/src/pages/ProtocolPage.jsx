import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { SectionHeader } from '../components/design/SectionHeader.jsx';
import { ActionPanel } from '../components/design/ActionPanel.jsx';
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
      categoryColor: '#21D4C5',
      severity: 'CRITICAL',
      severityType: 'critical',
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
      categoryColor: '#FFB000',
      severity: 'CRITICAL',
      severityType: 'critical',
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
      categoryColor: '#8B7CFF',
      severity: 'OPTIMAL',
      severityType: 'optimal',
      description: 'Dynamically mix low-grade ROM (38.2% Mn) with high-grade silo buffer ore (48.5% Mn) in a 60:40 ratio using precision load-cell feeder belts to deliver guaranteed 44.0% Mn furnace feed.',
      expectedRecovery: 'Grade compliance maintained at 44.2% Mn',
      roi: 'Zero Grade Penalty (₹6.8 Lakhs/lot value preserved)',
      timeToDeploy: 'Immediate Continuous',
      confidence: '98.1%'
    }
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto space-y-6 font-sans">
      
      {/* 1. TOP PROTOCOL HEADER */}
      <SectionHeader
        category="OPERATIONAL MITIGATION ENGINE // AI DISPATCH"
        categoryColor="#22C55E"
        badge="AUTO-PRESCRIPTIVE"
        badgeColor="#FFB000"
        title={`${activeMine.name} — Autonomous Mitigation Protocols`}
        subtitle="Actionable, pre-validated operational procedures calibrated to physical mine hydrogeology, crusher vibration thresholds, and ore blend requirements."
        actions={
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-[#151B23] border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1.5 shadow-glow-green">
              <ShieldCheck className="w-3.5 h-3.5" />
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
            <div key={p.id} className="p-5 sm:p-6 rounded-2xl bg-[#151B23] border border-[#222D3A] hover:border-[#2D3A4B] shadow-card-elevated space-y-4 relative overflow-hidden">
              {/* Top Accent Line */}
              <div 
                className="absolute top-0 left-0 right-0 h-[2.5px]" 
                style={{ backgroundColor: p.categoryColor || '#FFB000' }} 
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#222D3A]">
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
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                        {p.confidence} CONFIDENCE
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight mt-0.5 font-sans">
                      {p.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 block uppercase">DEPLOYMENT TIME</span>
                    <strong className="text-xs text-slate-200">{p.timeToDeploy}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 block uppercase">VALUE PROTECTED</span>
                    <strong className="text-xs text-amber-400">{p.roi}</strong>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {p.description}
              </p>

              <div className="pt-3 border-t border-[#222D3A] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                  <TrendingUp className="w-4 h-4" />
                  <span>{p.expectedRecovery}</span>
                </div>

                <button
                  onClick={() => handleDispatch(p.id)}
                  disabled={isDispatched}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                    isDispatched
                      ? 'bg-emerald-600 text-white shadow-none opacity-90'
                      : 'btn-command-primary'
                  }`}
                >
                  {isDispatched ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>DISPATCHED TO SHIFT CONTROLLER</span>
                    </>
                  ) : (
                    <>
                      <span>DISPATCH PROTOCOL</span>
                      <ArrowRight className="w-4 h-4" />
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
