import React from 'react';
import { ShieldCheck, ArrowRight, TrendingUp } from 'lucide-react';

export const ActionPanel = ({
  title,
  description,
  expectedYield,
  confidence = '94.2%',
  onDispatch,
  dispatchLabel = 'DISPATCH MITIGATION',
  className = ''
}) => {
  return (
    <div className={`p-5 rounded-2xl bg-[#151B23] border border-amber-500/40 shadow-card-elevated relative overflow-hidden ${className}`}>
      {/* Top Amber Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-amber-500" />

      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#222D3A]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-400 block">
              PRESCRIPTIVE AI ACTION
            </span>
            <h4 className="text-sm font-bold text-white tracking-tight">
              {title}
            </h4>
          </div>
        </div>

        {confidence && (
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
            {confidence} CONFIDENCE
          </span>
        )}
      </div>

      <p className="text-xs font-mono text-slate-200 mt-3 leading-relaxed">
        {description}
      </p>

      <div className="mt-4 pt-3 border-t border-[#222D3A] flex flex-wrap items-center justify-between gap-3 font-mono">
        {expectedYield && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>EXPECTED RECOVERY: {expectedYield}</span>
          </div>
        )}

        {onDispatch && (
          <button
            onClick={onDispatch}
            className="btn-command-primary text-xs py-2 px-4 ml-auto"
          >
            <span>{dispatchLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
