import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  FileCheck, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  UserCheck, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DecisionAudit = () => {
  const { decisionHistory, t, lang } = useApp();
  const dlog = t?.decisionLog || {};
  const comm = t?.common || {};
  const scen = t?.scenarioLab || {};

  const auditLogs = Array.isArray(decisionHistory) && decisionHistory.length > 0 ? decisionHistory : [
    {
      id: 'LOG-DEC-01',
      timestamp: 'Today, 10:42:15 IST',
      mine: 'Balaghat Mine',
      scenario: 'Monsoon Inundation',
      detectedEvent: 'Sump Water Inrush Level 3',
      recommendation: 'PROTO-AP-04 Automated Dewatering',
      operatorDecision: 'APPROVED',
      operatorName: 'S. Sharma (Mine Manager)',
      operatorNote: 'Statutory clearance verified. Dewatering active.',
      expectedImpact: '+1,150 T/day',
      realizedOutcome: '+1,120 T protected'
    }
  ];

  return (
    <div className="panel-surface p-6 sm:p-8 border border-obsidian-800 font-mono text-xs space-y-6 shadow-2xl animate-fade-in select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-obsidian-800 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-obsidian-800 border border-obsidian-700 flex items-center justify-center">
            <FileCheck className="w-4 h-4 text-manganese-400" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              {dlog.stepLabel || 'STEP 7 // DECISION AUDIT & REGULATORY LEDGER'}
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              {dlog.title || 'AI Decision Log & Regulatory Traceability'}
            </h3>
          </div>
        </div>

        <Link
          to="/decision-log"
          className="text-manganese-400 hover:text-manganese-300 font-bold text-xs flex items-center gap-1 self-start sm:self-auto transition-colors"
        >
          <span>{dlog.viewFullLedger || 'View Full Historical Ledger'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Latest Audit Logs (3 recent entries) */}
      <div className="space-y-3">
        {auditLogs.slice(0, 3).map((log) => {
          let statusColor = 'bg-telemetry-500/20 text-telemetry-300 border-telemetry-500/30';
          if (log.operatorDecision === 'MODIFIED') {
            statusColor = 'bg-manganese-500/20 text-manganese-300 border-manganese-500/30';
          } else if (log.operatorDecision === 'REJECTED') {
            statusColor = 'bg-hazard-500/20 text-hazard-300 border-hazard-500/30';
          }

          return (
            <div
              key={log.id}
              className="p-4 rounded-xl bg-obsidian-950/80 border border-obsidian-800/90 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-obsidian-850">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-manganese-400">{log.id}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-white font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-manganese-400" />
                    {log.mine}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-400">{log.timestamp}</span>
                </div>

                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${statusColor}`}>
                  {log.operatorDecision}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">{dlog.detectedEvent || 'Detected Event:'}</span>
                  <strong className="text-white">{log.detectedEvent || log.scenario}</strong>
                </div>

                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">{dlog.authorizedAction || 'Authorized Action:'}</span>
                  <strong className="text-manganese-300">{log.recommendation}</strong>
                </div>

                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">{dlog.realizedProtection || 'Realized Protection:'}</span>
                  <strong className="text-telemetry-300">{log.realizedOutcome || log.expectedImpact}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-obsidian-850 flex items-center justify-between text-[10px] text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-manganese-400" />
                  <span>{dlog.operator || 'Operator:'} <strong className="text-zinc-200">{log.operatorName}</strong></span>
                </div>
                {log.operatorNote && (
                  <span className="text-zinc-300 italic truncate max-w-xs">"{log.operatorNote}"</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
