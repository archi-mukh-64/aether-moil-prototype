/**
 * AETHER Status Badge Primitive
 * Consistent status and severity indicator pill with pulse dot using the mineral palette.
 */
export const AetherStatusBadge = ({
  status = 'OPTIMAL',
  size = 'md', // 'sm' | 'md' | 'lg'
  pulse = true,
  className = ''
}) => {
  const normalized = (status || '').toUpperCase().trim();

  const configMap = {
    CRITICAL: { bg: 'bg-[#C84B3F]/15', text: 'text-[#872C23]', border: 'border-[#C84B3F]/40', dot: 'bg-[#C84B3F]', label: 'CRITICAL' },
    DANGER: { bg: 'bg-[#C84B3F]/15', text: 'text-[#872C23]', border: 'border-[#C84B3F]/40', dot: 'bg-[#C84B3F]', label: 'CRITICAL' },
    HIGH: { bg: 'bg-[#C84B3F]/15', text: 'text-[#872C23]', border: 'border-[#C84B3F]/40', dot: 'bg-[#C84B3F]', label: 'HIGH RISK' },

    WATCH: { bg: 'bg-[#B88A3B]/15', text: 'text-[#7C571F]', border: 'border-[#B88A3B]/40', dot: 'bg-[#B88A3B]', label: 'WATCH' },
    WARNING: { bg: 'bg-[#B88A3B]/15', text: 'text-[#7C571F]', border: 'border-[#B88A3B]/40', dot: 'bg-[#B88A3B]', label: 'WARNING' },
    ELEVATED: { bg: 'bg-[#B88A3B]/15', text: 'text-[#7C571F]', border: 'border-[#B88A3B]/40', dot: 'bg-[#B88A3B]', label: 'ELEVATED' },
    MEDIUM: { bg: 'bg-[#B88A3B]/15', text: 'text-[#7C571F]', border: 'border-[#B88A3B]/40', dot: 'bg-[#B88A3B]', label: 'MEDIUM' },

    OPTIMAL: { bg: 'bg-[#71856B]/15', text: 'text-[#4A5845]', border: 'border-[#71856B]/40', dot: 'bg-[#71856B]', label: 'OPTIMAL' },
    SUCCESS: { bg: 'bg-[#71856B]/15', text: 'text-[#4A5845]', border: 'border-[#71856B]/40', dot: 'bg-[#71856B]', label: 'NOMINAL' },
    NOMINAL: { bg: 'bg-[#71856B]/15', text: 'text-[#4A5845]', border: 'border-[#71856B]/40', dot: 'bg-[#71856B]', label: 'NOMINAL' },
    LOW: { bg: 'bg-[#71856B]/15', text: 'text-[#4A5845]', border: 'border-[#71856B]/40', dot: 'bg-[#71856B]', label: 'LOW RISK' },

    ACTIVE: { bg: 'bg-[#3D8C8A]/15', text: 'text-[#275B59]', border: 'border-[#3D8C8A]/40', dot: 'bg-[#3D8C8A]', label: 'ACTIVE' },
    ACKNOWLEDGED: { bg: 'bg-[#655C9F]/15', text: 'text-[#423A6D]', border: 'border-[#655C9F]/40', dot: 'bg-[#655C9F]', label: 'ACKNOWLEDGED' },
    RESOLVED: { bg: 'bg-[#DDD4C5]', text: 'text-[#5F625C]', border: 'border-[#C8BFAF]', dot: 'bg-[#85877E]', label: 'RESOLVED' },
    ESCALATED: { bg: 'bg-[#B76543]/15', text: 'text-[#7B3E25]', border: 'border-[#B76543]/40', dot: 'bg-[#B76543]', label: 'ESCALATED' }
  };

  const current = configMap[normalized] || {
    bg: 'bg-[#DDD4C5]',
    text: 'text-[#5F625C]',
    border: 'border-[#C8BFAF]',
    dot: 'bg-[#85877E]',
    label: normalized
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2'
  };

  return (
    <span
      className={`inline-flex items-center shrink-0 max-w-full rounded-full font-mono font-bold tracking-wider border shadow-xs select-none ${current.bg} ${current.text} ${current.border} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dot}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 shrink-0 ${current.dot}`} />
      </span>
      <span className="truncate">{current.label}</span>
    </span>
  );
};
