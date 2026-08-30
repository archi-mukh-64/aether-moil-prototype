import React from 'react';

/**
 * AETHER Section Header Primitive
 * Clear typography hierarchy with accent indicator and action slot.
 */
export const AetherSectionHeader = ({
  title,
  subtitle,
  badge,
  icon: Icon,
  accent = '#F59E0B',
  actions,
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0] ${className}`}>
      <div className="flex items-start gap-3">
        {/* Module Accent Indicator Bar */}
        <div 
          style={{ backgroundColor: accent }} 
          className="w-1.5 h-10 rounded-full shrink-0 self-stretch my-auto"
        />

        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            {Icon && <Icon className="w-5 h-5 text-[#172033]" />}
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#172033] font-display">
              {title}
            </h2>
            {badge && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-[#475569] border border-slate-200">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-[#64748B] font-sans">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
