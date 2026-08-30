import React from 'react';

/**
 * AETHER Design System Logo
 * Custom vector identity representing MOIL Mining Intelligence:
 * - Central upward 'A' apex representing operational progress
 * - Faceted manganese crystal geometry (Sausar Group braunite)
 * - Network nodes symbolizing AI intelligence & remote sensing
 * - Colors: Primary Amber (#F59E0B), Deep Navy (#172033), Intelligence Cyan (#0891B2)
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
      {/* Precision Geometric SVG Icon */}
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
          <linearGradient id="aether-amber-grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="aether-navy-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="aether-cyan-grad" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#0891B2" />
          </linearGradient>
          <filter id="aether-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#F59E0B" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Outer Shield / Geological Hexagon Boundary */}
        <path
          d="M24 3L42 13.5V34.5L24 45L6 34.5V13.5L24 3Z"
          fill="#172033"
          stroke="#E2E8F0"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Sausar Ore Crystal Facets */}
        <path
          d="M24 3L42 13.5L24 24L6 13.5L24 3Z"
          fill="url(#aether-navy-grad)"
          opacity="0.85"
        />
        <path
          d="M6 13.5L24 24V45L6 34.5V13.5Z"
          fill="#0F172A"
          opacity="0.9"
        />
        <path
          d="M42 13.5L24 24V45L42 34.5V13.5Z"
          fill="#1E293B"
          opacity="0.75"
        />

        {/* Prominent Golden 'A' Ascending Core */}
        <path
          d="M24 9L36 33H30L27.5 27.5H20.5L18 33H12L24 9Z"
          fill="url(#aether-amber-grad)"
          filter="url(#aether-glow)"
        />

        {/* Inner Apex Cutout */}
        <polygon
          points="24,15 26,22.5 22,22.5"
          fill="#172033"
        />

        {/* Cross-Link Diamond / Intelligence Horizon */}
        <path
          d="M17 28.5H31L24 35.5L17 28.5Z"
          fill="url(#aether-cyan-grad)"
          opacity="0.95"
        />

        {/* Network Vertices (Intelligence Radar Nodes) */}
        <circle cx="24" cy="9" r="2.25" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1.5" />
        <circle cx="12" cy="33" r="1.75" fill="#FFFFFF" stroke="#0891B2" strokeWidth="1.5" />
        <circle cx="36" cy="33" r="1.75" fill="#FFFFFF" stroke="#0891B2" strokeWidth="1.5" />
        <circle cx="24" cy="35.5" r="1.75" fill="#22D3EE" />
      </svg>

      {/* Branded Typographic Hierarchy */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-black tracking-wider text-[#172033] ${dim.text} font-display`}>
              AETHER
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest bg-amber-500/10 text-amber-700 border border-amber-500/30">
              MOIL
            </span>
          </div>
          {subtitle && (
            <span className={`font-mono font-semibold tracking-widest text-[#64748B] uppercase ${dim.sub} mt-0.5`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
