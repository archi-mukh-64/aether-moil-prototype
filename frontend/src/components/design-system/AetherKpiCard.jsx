import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AetherStatusBadge } from './AetherStatusBadge.jsx';

/**
 * AETHER Industrial KPI Card Primitive
 * Precision dashboard metric card with trend indicators, sparkline, and status pill.
 */
export const AetherKpiCard = ({
  title,
  value,
  unit = '',
  subtitle,
  icon: Icon,
  change,
  changeType = 'positive', // 'positive' | 'negative' | 'neutral'
  status,
  sparklineData,
  accent = 'amber', // 'amber' | 'cyan' | 'navy' | 'emerald' | 'indigo' | 'coral'
  className = '',
  onClick
}) => {
  const accentStyles = {
    amber: { iconBg: 'bg-amber-50 text-amber-600 border-amber-200', borderTop: 'border-t-amber-500' },
    cyan: { iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-200', borderTop: 'border-t-cyan-500' },
    navy: { iconBg: 'bg-slate-100 text-slate-800 border-slate-300', borderTop: 'border-t-slate-800' },
    emerald: { iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200', borderTop: 'border-t-emerald-500' },
    indigo: { iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200', borderTop: 'border-t-indigo-500' },
    coral: { iconBg: 'bg-red-50 text-red-600 border-red-200', borderTop: 'border-t-red-500' }
  };

  const currentAccent = accentStyles[accent] || accentStyles.amber;

  const renderTrendIcon = () => {
    if (changeType === 'positive') return <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />;
    if (changeType === 'negative') return <TrendingDown className="w-3.5 h-3.5 text-red-600" />;
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
  };

  const trendColor = changeType === 'positive' 
    ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
    : changeType === 'negative' 
    ? 'text-red-700 bg-red-50 border-red-200' 
    : 'text-slate-600 bg-slate-50 border-slate-200';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      whileHover={onClick ? { y: -2 } : {}}
      onClick={onClick}
      className={`relative bg-white border border-[#E2E8F0] border-t-2 ${currentAccent.borderTop} rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Top Row: Title, Icon & Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-xs font-semibold tracking-wider text-[#64748B] uppercase font-sans block">
            {title}
          </span>
          {subtitle && (
            <span className="text-[11px] text-[#94A3B8] font-mono block">
              {subtitle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {status && <AetherStatusBadge status={status} size="sm" pulse={false} />}
          {Icon && (
            <div className={`p-2 rounded-lg border shadow-xs ${currentAccent.iconBg}`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="mt-4 mb-2 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#172033] font-display">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-bold text-[#64748B] font-mono">
            {unit}
          </span>
        )}
      </div>

      {/* Bottom Row: Percentage Change & Optional Sparkline */}
      <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-2 mt-auto text-xs">
        {change && (
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-mono font-bold text-[11px] ${trendColor}`}>
            {renderTrendIcon()}
            <span>{change}</span>
          </div>
        )}

        {sparklineData && sparklineData.length > 0 && (
          <div className="h-6 w-24 flex items-end gap-1">
            {sparklineData.map((val, idx) => {
              const maxVal = Math.max(...sparklineData, 1);
              const heightPct = Math.max(15, Math.round((val / maxVal) * 100));
              return (
                <div
                  key={idx}
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded-xs transition-all ${
                    accent === 'amber' ? 'bg-amber-400' :
                    accent === 'cyan' ? 'bg-cyan-500' :
                    accent === 'emerald' ? 'bg-emerald-500' :
                    accent === 'coral' ? 'bg-red-400' :
                    accent === 'indigo' ? 'bg-indigo-500' : 'bg-slate-400'
                  } opacity-75 hover:opacity-100`}
                />
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
