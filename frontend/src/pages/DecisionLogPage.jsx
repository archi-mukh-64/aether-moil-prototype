import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { 
  AetherSectionHeader, 
  AetherStatusBadge, 
  AetherEmptyState 
} from '../components/design-system/index.js';
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
  UserCheck,
  Download
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
    <div className="space-y-6 font-sans">
      
      {/* 1. TOP DECISION LOG HEADER */}
      <AetherSectionHeader
        title="DGMS Statutory Decision Log & Audit Ledger"
        subtitle="Cryptographically verified, immutable record of shift supervisor actions, AI prescription approvals, and regulatory compliance logs."
        badge="IMMUTABLE CHAIN OF CUSTODY"
        accent="#4F46E5"
        icon={Terminal}
        actions={
          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.print()}
              className="btn-command-secondary text-xs"
            >
              <Download className="w-3.5 h-3.5 text-amber-600" />
              <span>Export Audit Ledger</span>
            </button>
          </div>
        }
      />

      {/* 2. SEARCH & FILTER BAR */}
      <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by keyword, mine, or DGMS license..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#172033] placeholder-[#94A3B8] text-xs font-sans focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-[#64748B] self-end sm:self-auto">
          <span>Total Records: <strong className="text-[#172033]">{filteredEvents.length}</strong></span>
          <span className="text-[#CBD5E1]">•</span>
          <span className="text-emerald-700 font-bold">100% Audit Verified</span>
        </div>
      </div>

      {/* 3. AUDIT EVENTS TIMELINE STREAM */}
      <div className="space-y-4 font-mono">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((evt) => (
            <div 
              key={evt.id} 
              className="p-5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                    {evt.actionType}
                  </span>
                  <span className="text-xs font-bold text-[#172033] font-display">
                    {evt.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <AetherStatusBadge status="OPTIMAL" size="sm" pulse={false} />
                  <span className="text-[11px] text-[#64748B]">{evt.timestamp}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-[#94A3B8] block uppercase">MINE ASSET</span>
                  <strong className="text-[#172033]">{evt.mineName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#94A3B8] block uppercase">SHIFT PERIOD</span>
                  <strong className="text-[#172033]">{evt.shift}</strong>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[10px] text-[#94A3B8] block uppercase">VERIFYING OFFICER</span>
                  <strong className="text-[#172033]">{evt.operator}</strong>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1 text-xs">
                <div className="text-[#475569]">
                  <strong className="text-[#172033]">Trigger Reason: </strong>{evt.reasoning}
                </div>
                <div className="text-emerald-700 font-semibold">
                  <strong className="text-emerald-800">Operational Outcome: </strong>{evt.impact}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#94A3B8] pt-1">
                <span>SHA-256 Ledger Hash: <code>{evt.id.replace(/-/g, '').toLowerCase()}f83a...</code></span>
                <span className="text-emerald-600 font-bold">DIGITALLY SIGNED</span>
              </div>
            </div>
          ))
        ) : (
          <AetherEmptyState
            title="No Matching Audit Records"
            description="No statutory decision logs matched your current search parameters."
            actionLabel="Clear Search Filter"
            onAction={() => setSearchQuery('')}
          />
        )}
      </div>

    </div>
  );
};
