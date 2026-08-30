import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { SectionHeader } from '../components/design/SectionHeader.jsx';
import { ErrorBoundary } from '../components/common/ErrorBoundary.jsx';
import { 
  Terminal, 
  Search, 
  Filter, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

export const DecisionLogPage = () => {
  return (
    <ErrorBoundary title="STATUTORY DECISION AUDIT LOG">
      <DecisionLogPageContent />
    </ErrorBoundary>
  );
};

const DecisionLogPageContent = () => {
  const { activeMine, lang, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const auditEvents = [
    {
      id: 'AUD-2026-0829-01',
      title: 'Auxiliary Dewatering Pump Activation & Haulage Reroute',
      mineName: activeMine.name,
      shift: 'Shift A (06:00 - 14:00)',
      timestamp: '29 Aug 2026, 10:14 IST',
      actionType: 'MITIGATION_DISPATCH',
      operator: 'Mining Engineer S. Sharma (DGMS Lic #4829)',
      status: 'APPROVED',
      statusColor: '#22C55E',
      reasoning: 'Water inflow at Level -185m sump reached 1,850 m³/h after 55mm precipitation burst.',
      impact: '+1,116 TPD yield protected; haul road slip factor reduced by 42%.'
    },
    {
      id: 'AUD-2026-0829-02',
      title: 'Primary Jaw Crusher Feed Throttled from 280 to 200 TPH',
      mineName: 'Dongri Buzurg Mine',
      shift: 'Shift A (06:00 - 14:00)',
      timestamp: '29 Aug 2026, 09:42 IST',
      actionType: 'EQUIPMENT_PROTECTION',
      operator: 'Plant Controller V. Deshmukh',
      status: 'APPROVED',
      statusColor: '#22C55E',
      reasoning: 'Vibration RMS on drive bearing #2 reached 4.8 mm/s exceeding warning threshold (3.5 mm/s).',
      impact: 'Bearing catastrophic seizure averted; continuous 200 TPH processing maintained.'
    },
    {
      id: 'AUD-2026-0828-03',
      title: 'Grade Blending Ratio Adjusted to 55:45 (ROM : Stockpile)',
      mineName: 'Chikla Mine',
      shift: 'Shift B (14:00 - 22:00)',
      timestamp: '28 Aug 2026, 17:30 IST',
      actionType: 'QUALITY_CONTROL',
      operator: 'Chief Metallurgist R. Patil',
      status: 'APPROVED',
      statusColor: '#22C55E',
      reasoning: 'Pit extraction face 04 produced 38.4% Mn grade against 44.0% Mn contract requirement.',
      impact: 'Product grade stabilized at 44.2% Mn across 420 Ton lot.'
    },
    {
      id: 'AUD-2026-0828-04',
      title: 'Emergency Stope Dewatering Pipeline Bypass Installed',
      mineName: 'Balaghat Mine',
      shift: 'Shift C (22:00 - 06:00)',
      timestamp: '28 Aug 2026, 02:15 IST',
      actionType: 'EMERGENCY_INTERVENTION',
      operator: 'Underground Shift Boss P. Rathore',
      status: 'APPROVED',
      statusColor: '#22C55E',
      reasoning: 'Main discharge pipe fractured due to water hammer pressure spike.',
      impact: 'Stope flooding prevented; 4 underground LHD loaders kept in service.'
    }
  ];

  const filteredEvents = auditEvents.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.mineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.operator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto space-y-6 font-sans">
      
      {/* 1. TOP DECISION LOG HEADER */}
      <SectionHeader
        category="STATUTORY AUDIT LEDGER // DGMS COMPLIANCE"
        categoryColor="#8B7CFF"
        badge="IMMUTABLE CHAIN OF CUSTODY"
        badgeColor="#21D4C5"
        title="AI Decision Audit Log & Operational Traceability"
        subtitle="Chronological audit record of every automated AI alert, prescriptive mitigation dispatched, and operator authorization across MOIL mining operations."
        actions={
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-[#151B23] border border-violet-500/30 text-violet-400 font-bold flex items-center gap-1.5 shadow-glow-violet">
              <UserCheck className="w-3.5 h-3.5" />
              <span>DGMS VERIFIED</span>
            </span>
          </div>
        }
      />

      {/* 2. SEARCH & FILTER BAR */}
      <div className="p-4 rounded-2xl bg-[#151B23] border border-[#222D3A] shadow-card-subtle flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by action, mine name, or operator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#10151C] border border-[#222D3A] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">FILTER:</span>
          <span className="px-3 py-1.5 rounded-xl bg-[#10151C] border border-[#222D3A] text-amber-400 font-bold">
            {filteredEvents.length} TOTAL AUDIT ENTRIES
          </span>
        </div>
      </div>

      {/* 3. AUDIT ENTRIES TIMELINE */}
      <div className="space-y-4 font-mono">
        {filteredEvents.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-[#151B23] border border-[#222D3A] hover:border-[#2D3A4B] shadow-card-subtle space-y-3 relative overflow-hidden">
            {/* Left Status Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-violet-500" />

            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#222D3A]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider">
                      {item.id} • {item.actionType}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                      {item.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight mt-0.5 font-sans">
                    {item.title}
                  </h4>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{item.timestamp}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300 font-sans">
              <div className="p-3 rounded-xl bg-[#10151C] border border-[#222D3A]">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">AI ROOT-CAUSE REASONING</span>
                <p className="mt-1 leading-relaxed">{item.reasoning}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#10151C] border border-[#222D3A]">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">VERIFIED OPERATIONAL OUTCOME</span>
                <p className="mt-1 text-emerald-300 leading-relaxed font-bold">{item.impact}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#222D3A] flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Authorized by: <strong className="text-slate-200">{item.operator}</strong></span>
              </span>

              <span className="text-amber-400 font-bold">
                {item.mineName} • {item.shift}
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
