import React from 'react';

export const ChartContainer = ({
  title,
  subtitle,
  badge,
  badgeColor = '#FFB000',
  legend,
  controls,
  children,
  className = ''
}) => {
  return (
    <div className={`p-5 sm:p-6 rounded-2xl bg-[#151B23] border border-[#222D3A] shadow-card-subtle hover:border-[#2D3A4B] transition-all relative overflow-hidden ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#222D3A]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#272A27] tracking-tight font-sans">
              {title}
            </h3>
            {badge && (
              <span
                className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border"
                style={{
                  backgroundColor: `${badgeColor}15`,
                  borderColor: `${badgeColor}35`,
                  color: badgeColor
                }}
              >
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs font-mono text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {legend && (
            <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
              {legend}
            </div>
          )}
          {controls && (
            <div className="flex items-center gap-1.5">
              {controls}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        {children}
      </div>
    </div>
  );
};
