import React from 'react';
import { Activity } from 'lucide-react';

export const OperationalPanel = ({
  title,
  category,
  status = 'ONLINE',
  statusType = 'optimal', // optimal, warning, critical
  icon: Icon = Activity,
  children,
  actions,
  className = ''
}) => {
  const statusColors = {
    optimal: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    critical: 'bg-coral-500/15 text-coral-400 border-coral-500/30'
  };

  return (
    <div className={`p-5 rounded-2xl bg-[#151B23] border border-cyan-500/30 shadow-card-subtle relative overflow-hidden ${className}`}>
      {/* Top Cyan Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-cyan-400/80" />

      <div className="flex items-center justify-between pb-3 border-b border-[#222D3A]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            {category && (
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 block">
                {category}
              </span>
            )}
            <h4 className="text-sm font-bold text-[#272A27] tracking-tight">
              {title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status && (
            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold border ${statusColors[statusType] || statusColors.optimal}`}>
              {status}
            </span>
          )}
          {actions}
        </div>
      </div>

      <div className="mt-4">
        {children}
      </div>
    </div>
  );
};
