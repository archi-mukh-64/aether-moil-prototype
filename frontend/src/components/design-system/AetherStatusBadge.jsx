import React from 'react';

/**
 * AETHER Status Badge Primitive
 * Consistent status and severity indicator pill with pulse dot.
 */
export const AetherStatusBadge = ({ 
  status = 'OPTIMAL',
  size = 'md', // 'sm' | 'md' | 'lg'
  pulse = true,
  className = ''
}) => {
  const normalized = (status || '').toUpperCase().trim();

  const configMap = {
    CRITICAL: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', label: 'CRITICAL' },
    DANGER: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', label: 'CRITICAL' },
    HIGH: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', label: 'HIGH RISK' },
    
    WATCH: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', label: 'WATCH' },
    WARNING: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', label: 'WARNING' },
    ELEVATED: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', label: 'ELEVATED' },
    MEDIUM: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', label: 'MEDIUM' },
    
    OPTIMAL: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', label: 'OPTIMAL' },
    SUCCESS: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', label: 'NOMINAL' },
    NOMINAL: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', label: 'NOMINAL' },
    LOW: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', label: 'LOW RISK' },
    
    ACTIVE: { bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200', dot: 'bg-cyan-600', label: 'ACTIVE' },
    ACKNOWLEDGED: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500', label: 'ACKNOWLEDGED' },
    RESOLVED: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', dot: 'bg-slate-500', label: 'RESOLVED' },
    ESCALATED: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-600', label: 'ESCALATED' }
  };

  const current = configMap[normalized] || {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    dot: 'bg-slate-500',
    label: normalized
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2'
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full font-mono font-bold tracking-wider border shadow-xs select-none ${current.bg} ${current.text} ${current.border} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dot}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`} />
      </span>
      <span>{current.label}</span>
    </span>
  );
};
