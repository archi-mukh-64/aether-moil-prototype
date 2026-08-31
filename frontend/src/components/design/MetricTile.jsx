import React from 'react';

export const MetricTile = ({
  label,
  value,
  unit,
  trend,
  trendPositive,
  subtitle,
  status,
  icon: Icon,
  accentColor = '#FFB000', // Default Amber
  className = ''
}) => {
  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl bg-[#151B23] border border-[#222D3A] shadow-card-subtle hover:border-[#2D3A4B] hover:bg-[#18202B] hover:shadow-card-elevated transition-all flex flex-col justify-between relative overflow-hidden group ${className}`}
    >
      {/* Top Subtle Semantic Accent Pip */}
      <div
        className="absolute top-0 left-0 right-0 h-[2.5px] opacity-75 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-center justify-between gap-2 pb-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {Icon && (
          <div
            className="p-1.5 rounded-lg border transition-colors"
            style={{
              backgroundColor: `${accentColor}12`,
              borderColor: `${accentColor}30`,
              color: accentColor
            }}
          >
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="my-2 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono text-slate-400 font-semibold">
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-[#1C2633] text-[11px] font-mono">
        {subtitle && (
          <span className="text-slate-400 truncate max-w-[180px]">
            {subtitle}
          </span>
        )}
        {trend && (
          <span className={`font-bold flex items-center gap-0.5 ml-auto ${trendPositive ? 'text-emerald-400' : 'text-coral-400'}`}>
            {trendPositive ? '▲' : '▼'} {trend}
          </span>
        )}
        {status && (
          <span
            className="px-2 py-0.5 rounded-md text-[10px] font-semibold border ml-auto"
            style={{
              backgroundColor: `${accentColor}15`,
              borderColor: `${accentColor}35`,
              color: accentColor
            }}
          >
            {status}
          </span>
        )}
      </div>
    </div>
  );
};
