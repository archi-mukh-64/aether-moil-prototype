import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import {
  AetherSectionHeader,
  AetherEmptyState
} from '../components/design-system/index.js';
import { ErrorBoundary } from '../components/common/ErrorBoundary.jsx';
import {
  Terminal,
  Search,
  Clock,
  CheckCircle2,
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
    <div className="space-y-6 font-sans text-[#272A27]">

      {/* 1. TOP DECISION LOG HEADER (Theme: Audit / Governance, Accent: Burgundy #7D4545) */}
      <AetherSectionHeader
        title="DGMS Statutory Decision Log & Audit Ledger"
        subtitle="Cryptographically verified, immutable record of shift supervisor actions, AI prescription approvals, and regulatory compliance logs."
        badge="IMMUTABLE CHAIN OF CUSTODY"
        accent="#7D4545"
        icon={Terminal}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="btn-command-secondary text-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#7D4545]" />
              <span>Export Audit Ledger</span>
            </button>
          </div>
        }
      />

      {/* 2. SEARCH & AUDIT FILTER STRIP */}
      <div className="p-3.5 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#85877E]" />
          <input
            type="text"
            placeholder="Search decisions, supervisor licenses, mine assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] text-xs text-[#272A27] placeholder-[#85877E] font-mono focus:outline-none focus:border-[#7D4545]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#5F625C]">
          <span>Audit Status:</span>
          <span className="px-2.5 py-1 rounded-lg bg-[#71856B]/20 text-[#4A5845] border border-[#71856B]/40 font-bold">
            100% DGMS COMPLIANT
          </span>
        </div>
      </div>

      {/* 3. AUDIT TIMELINE STREAM */}
      {filteredEvents.length > 0 ? (
        <div className="space-y-4">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-5 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] hover:border-[#85877E] shadow-mineral-sm hover:shadow-mineral-md transition-all space-y-3 relative overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#DDD4C5]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#7D4545]/15 text-[#7D4545] border border-[#7D4545]/40">
                    {evt.id}
                  </span>
                  <span className="text-xs font-bold text-[#5F625C] font-mono">
                    • {evt.mineName} ({evt.shift})
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[#5F625C]">
                  <Clock className="w-3.5 h-3.5 text-[#85877E]" />
                  <span>{evt.timestamp}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-sm text-[#272A27] font-display">
                  {evt.title}
                </h3>
                <p className="text-xs text-[#5F625C] leading-relaxed font-sans">
                  <strong>Regulatory Cause:</strong> {evt.reasoning}
                </p>
              </div>

              <div className="pt-2 border-t border-[#DDD4C5] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#4A5845]">
                  <CheckCircle2 className="w-4 h-4 text-[#71856B]" />
                  <span className="font-bold">Verified Impact: {evt.impact}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[#5F625C]">
                  <UserCheck className="w-3.5 h-3.5 text-[#85877E]" />
                  <span>{evt.operator}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <AetherEmptyState
          title="No Audit Records Found"
          description="Try broadening your search query or reset filters."
        />
      )}

    </div>
  );
};
