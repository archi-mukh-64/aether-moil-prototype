import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AetherStatusBadge } from './AetherStatusBadge.jsx';

/**
 * AETHER Mineral KPI Card Primitive
 * Precision dashboard metric card with semantic accents, trend indicators,
 * sparklines, and status badges.
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
  accent = 'copper', // 'copper' | 'ochre' | 'sage' | 'teal' | 'violet' | 'vermilion' | 'burgundy' | 'terracotta'
  className = '',
  onClick
}) => {
  const accentStyles = {
    copper: { iconBg: 'bg-[#C46A32]/10 text-[#C46A32] border-[#C46A32]/30', borderTop: 'border-t-[#C46A32]', bar: 'bg-[#C46A32]' },
    ochre: { iconBg: 'bg-[#B88A3B]/10 text-[#B88A3B] border-[#B88A3B]/30', borderTop: 'border-t-[#B88A3B]', bar: 'bg-[#B88A3B]' },
    sage: { iconBg: 'bg-[#71856B]/10 text-[#71856B] border-[#71856B]/30', borderTop: 'border-t-[#71856B]', bar: 'bg-[#71856B]' },
    teal: { iconBg: 'bg-[#3D8C8A]/10 text-[#3D8C8A] border-[#3D8C8A]/30', borderTop: 'border-t-[#3D8C8A]', bar: 'bg-[#3D8C8A]' },
    violet: { iconBg: 'bg-[#655C9F]/10 text-[#655C9F] border-[#655C9F]/30', borderTop: 'border-t-[#655C9F]', bar: 'bg-[#655C9F]' },
    vermilion: { iconBg: 'bg-[#C84B3F]/10 text-[#C84B3F] border-[#C84B3F]/30', borderTop: 'border-t-[#C84B3F]', bar: 'bg-[#C84B3F]' },
    burgundy: { iconBg: 'bg-[#7D4545]/10 text-[#7D4545] border-[#7D4545]/30', borderTop: 'border-t-[#7D4545]', bar: 'bg-[#7D4545]' },
    terracotta: { iconBg: 'bg-[#B76543]/10 text-[#B76543] border-[#B76543]/30', borderTop: 'border-t-[#B76543]', bar: 'bg-[#B76543]' }
  };

  const currentAccent = accentStyles[accent] || accentStyles.copper;

  const renderTrendIcon = () => {
    if (changeType === 'positive') return <TrendingUp className="w-3.5 h-3.5 text-[#71856B]" />;
    if (changeType === 'negative') return <TrendingDown className="w-3.5 h-3.5 text-[#C84B3F]" />;
    return <Minus className="w-3.5 h-3.5 text-[#85877E]" />;
  };

  const trendColor = changeType === 'positive'
    ? 'text-[#4A5845] bg-[#71856B]/15 border-[#71856B]/40'
    : changeType === 'negative'
    ? 'text-[#872C23] bg-[#C84B3F]/15 border-[#C84B3F]/40'
    : 'text-[#5F625C] bg-[#DDD4C5] border-[#C8BFAF]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      whileHover={onClick ? { y: -2 } : {}}
      onClick={onClick}
      className={`relative bg-[#F0EBE2] border border-[#C8BFAF] border-t-4 ${currentAccent.borderTop} rounded-xl p-4 sm:p-5 shadow-mineral-sm hover:shadow-mineral-md hover:border-[#85877E] transition-all duration-200 flex flex-col justify-between overflow-hidden min-w-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Top Row: Title, Icon & Status */}
      <div className="flex items-start justify-between gap-2 min-w-0">
        <div className="space-y-0.5 min-w-0 flex-1">
          <span className="text-[11px] font-bold tracking-wider text-[#5F625C] uppercase font-mono block truncate">
            {title}
          </span>
          {subtitle && (
            <span className="text-[10px] text-[#85877E] font-sans block truncate">
              {subtitle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {status && <AetherStatusBadge status={status} size="sm" pulse={false} />}
          {Icon && (
            <div className={`p-1.5 rounded-lg border shadow-xs shrink-0 ${currentAccent.iconBg}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="mt-3 mb-2 flex items-baseline gap-1.5 min-w-0">
        <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#272A27] font-display truncate tabular-nums">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-bold text-[#5F625C] font-mono shrink-0">
            {unit}
          </span>
        )}
      </div>

      {/* Bottom Row: Percentage Change & Sparkline */}
      <div className="pt-2.5 border-t border-[#DDD4C5] flex items-center justify-between gap-2 mt-auto text-xs min-w-0">
        {change && (
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-mono font-bold text-[10px] truncate shrink-0 ${trendColor}`}>
            {renderTrendIcon()}
            <span className="truncate">{change}</span>
          </div>
        )}

        {sparklineData && sparklineData.length > 0 && (
          <div className="h-5 w-20 flex items-end gap-1 shrink-0 ml-auto">
            {sparklineData.map((val, idx) => {
              const maxVal = Math.max(...sparklineData, 1);
              const heightPct = Math.max(15, Math.round((val / maxVal) * 100));
              return (
                <div
                  key={idx}
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded-xs transition-all ${currentAccent.bar} opacity-80 hover:opacity-100`}
                />
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
