import React from 'react';

/**
 * AETHER Section Header Primitive
 * High-contrast typography hierarchy with accent indicator and action slot.
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
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#CBD5E1] ${className}`}>
      <div className="flex items-start gap-3">
        {/* Module Accent Indicator Bar */}
        <div
          style={{ backgroundColor: accent }}
          className="w-1.5 h-10 rounded-full shrink-0 self-stretch my-auto shadow-xs"
        />

        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            {Icon && <Icon className="w-5 h-5 text-[#0F172A]" />}
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] font-display">
              {title}
            </h2>
            {badge && (
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-[#E2E8F0] text-[#1E293B] border border-[#CBD5E1]">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-[#475569] font-sans font-medium">
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
