/**
 * AETHER Design System Logo
 * Custom vector identity representing MOIL Mining Intelligence:
 * - Central upward 'A' apex & geological mountain ore strata
 * - Elliptical satellite orbital trajectory ring (Earth Observation)
 * - Faceted manganese crystal geometry (Sausar Group braunite)
 * - Network nodes symbolizing edge telemetry
 * - Colors: Oxidized Copper (#C46A32), Mineral Ochre (#B88A3B), Muted Teal (#3D8C8A), Slate Charcoal (#202522)
 */
export const AetherLogo = ({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  showText = true,
  subtitle = 'MINING INTELLIGENCE PLATFORM',
  className = ''
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 36, text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 48, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 64, text: 'text-3xl', sub: 'text-sm' }
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Precision Geological & Orbital SVG Icon */}
      <svg
        width={dim.icon}
        height={dim.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="aether-copper-grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C46A32" />
            <stop offset="100%" stopColor="#B05924" />
          </linearGradient>
          <linearGradient id="aether-dark-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#29302B" />
            <stop offset="100%" stopColor="#202522" />
          </linearGradient>
          <linearGradient id="aether-teal-grad" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#68B2B0" />
            <stop offset="100%" stopColor="#3D8C8A" />
          </linearGradient>
          <filter id="aether-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#C46A32" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Outer Shield / Geological Hexagon Boundary */}
        <path
          d="M24 3L42 13.5V34.5L24 45L6 34.5V13.5L24 3Z"
          fill="#202522"
          stroke="#C8BFAF"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Geological Strata Layers */}
        <path
          d="M24 3L42 13.5L24 24L6 13.5L24 3Z"
          fill="url(#aether-dark-grad)"
          opacity="0.9"
        />
        <path
          d="M6 13.5L24 24V45L6 34.5V13.5Z"
          fill="#1C211E"
          opacity="0.95"
        />
        <path
          d="M42 13.5L24 24V45L42 34.5V13.5Z"
          fill="#29302B"
          opacity="0.85"
        />

        {/* Satellite Orbital Trajectory Arc */}
        <path
          d="M8 20C12 12 36 10 40 28"
          stroke="url(#aether-teal-grad)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeDasharray="2 3"
        />
        <circle cx="40" cy="28" r="2.5" fill="#68B2B0" stroke="#202522" strokeWidth="1" />

        {/* Prominent Copper 'A' Ascending Mountain Peak */}
        <path
          d="M24 9L36 33H30L27.5 27.5H20.5L18 33H12L24 9Z"
          fill="url(#aether-copper-grad)"
          filter="url(#aether-glow)"
        />

        {/* Inner Apex Cutout */}
        <polygon
          points="24,15 26,22.5 22,22.5"
          fill="#202522"
        />

        {/* Cross-Link Diamond / Intelligence Horizon */}
        <path
          d="M17 28.5H31L24 35.5L17 28.5Z"
          fill="url(#aether-teal-grad)"
          opacity="0.95"
        />

        {/* Core Node Vertex */}
        <circle cx="24" cy="28.5" r="2" fill="#E8E1D5" />
      </svg>

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
