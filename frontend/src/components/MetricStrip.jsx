import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Truck,
  Layers,
  ShieldCheck,
  Zap,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const MetricStrip = () => {
  const { activeMine, trustPillars, activeScenario, t } = useApp();

  const trustScore = trustPillars && trustPillars[0] ? `${trustPillars[0].score}%` : '95.8%';
  const dailyTargetNum = typeof activeMine.dailyTarget === 'number' ? activeMine.dailyTarget : 6200;
  const projectedYieldNum = typeof activeMine.projectedYield === 'number' ? activeMine.projectedYield : dailyTargetNum;
  const isDeficit = dailyTargetNum > projectedYieldNum;
  const deficitTonnes = dailyTargetNum - projectedYieldNum;

  const kpis = [
    {
      id: 'target',
      code: 'KPI-01 // PRODUCTION',
      label: 'DAILY TARGET',
      value: dailyTargetNum.toLocaleString(),
      unit: 'T / DAY',
      trend: '+2.4% MoM Stable',
      trendType: 'positive',
      indicator: `${activeMine.name.replace(' Mine', '')} Shift Quota`,
      color: 'text-white',
      accent: 'border-obsidian-800'
    },
    {
      id: 'forecast',
      code: 'KPI-02 // PREDICTION',
      label: 'AI FORECAST',
      value: projectedYieldNum.toLocaleString(),
      unit: 'T / DAY',
      trend: isDeficit ? `-${deficitTonnes.toLocaleString()} T Deficit` : '+Nominal Pacing',
      trendType: isDeficit ? 'negative' : 'positive',
      indicator: activeScenario ? 'Scenario Yield Simulation' : '14-Day Baseline Horizon',
      color: isDeficit ? 'text-hazard-400' : 'text-manganese-400',
      accent: isDeficit ? 'border-hazard-500/40 bg-hazard-950/10' : 'border-manganese-500/30'
    },
    {
      id: 'risk',
      code: 'KPI-03 // DEFICIT RISK',
      label: 'SHORTFALL RISK',
      value: activeMine.shortfallRisk,
      unit: 'PROBABILITY',
      trend: activeMine.statusVariant === 'hazard' ? 'Threat Level High' : 'Within Safety Envelope',
      trendType: activeMine.statusVariant === 'hazard' ? 'negative' : 'positive',
      indicator: 'LightGBM TreeSHAP Engine',
      color: activeMine.statusVariant === 'hazard' ? 'text-hazard-400' : 'text-telemetry-400',
      accent: activeMine.statusVariant === 'hazard' ? 'border-hazard-500/40' : 'border-telemetry-500/30'
    },
    {
      id: 'fleet',
      code: 'KPI-04 // HEMM FLEET',
      label: 'FLEET UPTIME',
      value: activeMine.activeFleet,
      unit: 'ONLINE UNITS',
      trend: `${activeMine.fleetAvailabilityBase}% Availability`,
      trendType: 'positive',
      indicator: `${activeMine.fleetSize} Total Heavy Dumpers & Winders`,
      color: 'text-white',
      accent: 'border-obsidian-800'
    },
    {
      id: 'trust',
      code: 'KPI-05 // GOVERNANCE',
      label: 'AI TRUST',
      value: trustScore,
      unit: 'CALIBRATED',
      trend: 'Bayesian 5-Pillar Audit',
      trendType: 'positive',
      indicator: 'ISO 22932 Compliance Verified',
      color: 'text-telemetry-300',
      accent: 'border-telemetry-500/30'
    }
  ];

  return (
    <section className="command-container -mt-6 sm:-mt-8 relative z-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpis.map((kpi) => {
          const isNegative = kpi.trendType === 'negative';
          return (
            <div
              key={kpi.id}
              className={`p-5 rounded-2xl bg-obsidian-900/90 backdrop-blur-xl border ${kpi.accent} hover:border-obsidian-600 transition-all hover:bg-obsidian-850 hover:shadow-2xl flex flex-col justify-between space-y-3`}
            >
              {/* Top Code & Indicator */}
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 border-b border-obsidian-800/80 pb-2">
                <span className="font-bold tracking-wider">{kpi.code}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-manganese-400" />
              </div>

              {/* Label & Big Number */}
              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase font-bold tracking-wider mb-1">
                  {kpi.label}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl xl:text-4xl font-extrabold font-mono tracking-tight ${kpi.color}`}>
                    {kpi.value}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase">
                    {kpi.unit}
                  </span>
                </div>
              </div>

              {/* Bottom Trend & Subtext */}
              <div className="pt-2 border-t border-obsidian-800/60 font-mono text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`font-bold flex items-center gap-1 ${isNegative ? 'text-hazard-400' : 'text-telemetry-400'}`}>
                    {isNegative ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                    <span>{kpi.trend}</span>
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 truncate">
                  {kpi.indicator}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
};
