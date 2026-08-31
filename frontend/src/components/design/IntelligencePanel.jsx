import React from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';

export const IntelligencePanel = ({
  title,
  subtitle,
  confidence,
  badgeText = 'AI REASONING',
  children,
  actions,
  className = ''
}) => {
  return (
    <div className={`p-5 sm:p-6 rounded-2xl bg-[#151B23] border border-violet-500/30 shadow-card-elevated relative overflow-hidden ${className}`}>
      {/* Top Violet Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 opacity-80" />

      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#222D3A]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-violet-400">
                {badgeText}
              </span>
              {confidence && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold">
                  {confidence} CONFIDENCE
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-[#272A27] tracking-tight mt-0.5">
              {title}
            </h3>
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      {subtitle && (
        <p className="text-xs font-mono text-slate-300 mt-3 mb-4 leading-relaxed">
          {subtitle}
        </p>
      )}

      <div className="mt-4">
        {children}
      </div>
    </div>
  );
};
