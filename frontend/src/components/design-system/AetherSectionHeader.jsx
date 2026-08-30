/**
 * AETHER Section Header Primitive
 * High-contrast mineral typography hierarchy with module accent indicator and action slot.
 */
export const AetherSectionHeader = ({
  title,
  subtitle,
  badge,
  icon: Icon,
  accent = '#C46A32', // Default Oxidized Copper
  actions,
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#C8BFAF] ${className}`}>
      <div className="flex items-start gap-3 min-w-0">
        {/* Module Accent Indicator Bar */}
        <div
          style={{ backgroundColor: accent }}
          className="w-1.5 h-10 rounded-full shrink-0 self-stretch my-auto shadow-xs"
        />

        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            {Icon && <Icon className="w-5 h-5 text-[#272A27] shrink-0" />}
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#272A27] font-display truncate">
              {title}
            </h2>
            {badge && (
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-[#DDD4C5] text-[#272A27] border border-[#C8BFAF] shrink-0">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-[#5F625C] font-sans font-medium">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};
