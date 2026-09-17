/**
 * AETHER Design System Logo
 * Uses the official AE turquoise brand-mark image asset.
 * Asset: /assets/aether-logo.png (Vite public directory — works in dev + production + Vercel)
 */
export const AetherLogo = ({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  showText = true,
  subtitle = 'MINING INTELLIGENCE PLATFORM',
  className = ''
}) => {
  const sizeMap = {
    sm: { icon: 34, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 40, text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 48, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 64, text: 'text-3xl', sub: 'text-sm' }
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official AE Logo Image — loaded from Vite public dir, no filesystem path */}
      <img
        src="/assets/aether-logo.png"
        alt="AETHER AE Logo"
        width={dim.icon}
        height={dim.icon}
        style={{
          width: dim.icon,
          height: dim.icon,
          objectFit: 'contain',
          flexShrink: 0,
          borderRadius: 8,
          display: 'block'
        }}
        draggable={false}
      />

      {/* Typography Identity Block */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-display font-black tracking-wider text-[#F0EBE2] ${dim.text}`}>
              AETHER
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold tracking-widest bg-[#C46A32]/20 text-[#C46A32] border border-[#C46A32]/40 uppercase">
              v1.0
            </span>
          </div>
          <span className={`font-mono font-semibold tracking-widest text-[#85877E] uppercase mt-0.5 ${dim.sub}`}>
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
};
