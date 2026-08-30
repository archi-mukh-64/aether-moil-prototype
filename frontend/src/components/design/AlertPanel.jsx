import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AlertPanel = ({
  title,
  description,
  severity = 'critical', // critical, warning, optimal
  timestamp,
  metricDelta,
  onAction,
  actionLabel = 'TRIGGER PROTOCOL',
  className = ''
}) => {
  const severityConfigs = {
    critical: {
      border: 'border-coral-500/40',
      topLine: 'bg-coral-500',
      badge: 'bg-coral-500/15 text-coral-400 border-coral-500/30',
      icon: AlertTriangle,
      iconColor: 'text-coral-400',
      iconBg: 'bg-coral-500/15 border-coral-500/30',
      badgeLabel: 'CRITICAL THREAT'
    },
    warning: {
      border: 'border-orange-500/40',
      topLine: 'bg-orange-500',
      badge: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
      icon: AlertCircle,
      iconColor: 'text-orange-400',
      iconBg: 'bg-orange-500/15 border-orange-500/30',
      badgeLabel: 'ELEVATED RISK'
    },
    optimal: {
      border: 'border-emerald-500/40',
      topLine: 'bg-emerald-500',
      badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15 border-emerald-500/30',
      badgeLabel: 'OPTIMAL COMPLIANCE'
    }
  };

  const cfg = severityConfigs[severity] || severityConfigs.critical;
  const Icon = cfg.icon;

  return (
    <div className={`p-5 rounded-2xl bg-[#151B23] border ${cfg.border} shadow-card-subtle relative overflow-hidden ${className}`}>
      {/* Top Semantic Indicator */}
      <div className={`absolute top-0 left-0 right-0 h-[2.5px] ${cfg.topLine}`} />

      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#222D3A]">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${cfg.iconBg} ${cfg.iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${cfg.badge}`}>
                {cfg.badgeLabel}
              </span>
              {timestamp && (
                <span className="text-[10px] font-mono text-slate-400">
                  {timestamp}
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white tracking-tight mt-1">
              {title}
            </h4>
          </div>
        </div>

        {metricDelta && (
          <div className="text-right font-mono">
            <span className="text-xs font-bold text-coral-400 block">
              {metricDelta}
            </span>
          </div>
        )}
      </div>

      <p className="text-xs font-mono text-slate-300 mt-3 leading-relaxed">
        {description}
      </p>

      {onAction && (
        <div className="mt-4 pt-3 border-t border-[#222D3A] flex items-center justify-end">
          <button
            onClick={onAction}
            className="btn-command-danger text-[11px] py-1.5 px-3"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
};
