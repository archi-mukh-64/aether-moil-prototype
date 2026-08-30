import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  Sparkles
} from 'lucide-react';

export const ExecutiveImpactStrip = () => {
  const metrics = [
    {
      label: 'Production Protected',
      value: '+48,200 T',
      unit: 'YIELD RECOVERED',
      change: '₹19.4 Cr Value',
      icon: TrendingUp,
      color: 'text-telemetry-400'
    },
    {
      label: 'Downtime Avoided',
      value: '128 Hours',
      unit: 'HAULAGE & CRUSHING',
      change: '0 Safety Breaches',
      icon: Clock,
      color: 'text-manganese-400'
    },
    {
      label: 'Failures Anticipated',
      value: '4 Critical',
      unit: 'HEMM ASSETS SAVED',
      change: '100% Pre-Seizure',
      icon: ShieldCheck,
      color: 'text-cyan-400'
    },
    {
      label: 'Reserves Delineated',
      value: '14.8M T',
      unit: 'INDICATED Mn',
      change: 'UNFC-111 Standard',
      icon: Layers,
      color: 'text-amber-400'
    },
    {
      label: 'Threats Detected',
      value: '18 Events',
      unit: 'MONSOON & STRATA',
      change: '100% Mitigated',
      icon: AlertTriangle,
      color: 'text-hazard-400'
    },
    {
      label: 'AI Adoption Rate',
      value: '94.4%',
      unit: 'OPERATOR APPROVAL',
      change: 'Responsible AI',
      icon: CheckCircle2,
      color: 'text-emerald-400'
    }
  ];

  return (
    <section className="command-container py-10">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-obsidian-800 mb-8 gap-3">
        <div>
          <div className="badge-telemetry mb-2">
            <Award className="w-3 h-3 text-telemetry-400" />
            <span>EXECUTIVE IMPACT &amp; VALUE REALIZATION</span>
          </div>
          <h3 className="font-display text-2xl font-bold text-white">
            Cumulative Operational Protection Metrics
          </h3>
        </div>

        <div className="px-3 py-1 rounded bg-obsidian-900 border border-obsidian-750 text-[10px] font-mono text-zinc-400 self-start sm:self-auto">
          SIMULATION / DEMONSTRATION MODE
        </div>
      </div>

      {/* 6 Monolith KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-obsidian-900/90 border border-obsidian-750/90 font-mono text-xs flex flex-col justify-between hover:border-obsidian-600 transition-all shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{m.label}</span>
                  <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                </div>
                <div className={`text-xl font-bold tracking-tight mb-1 ${m.color}`}>
                  {m.value}
                </div>
                <div className="text-[10px] text-zinc-400">
                  {m.unit}
                </div>
              </div>

              <div className="pt-3 border-t border-obsidian-800/80 mt-3 text-[10px] text-zinc-400 font-semibold">
                {m.change}
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
