import React from 'react';

/**
 * Professional Industrial SCADA Equipment Silhouette SVGs
 * Inspired by Komatsu & Caterpillar Technical Fleet Schematics
 */

export const EquipmentIcon = ({ type, className = "w-4 h-4", color = "currentColor" }) => {
  const normType = (type || 'TRUCK').toUpperCase();

  if (normType.includes('EXCAVATOR') || normType.includes('SHOVEL') || normType === 'EX') {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Tracked Undercarriage */}
        <rect x="3" y="24" width="18" height="5" rx="2" fill={color} fillOpacity="0.2" />
        <circle cx="6" cy="26.5" r="1.5" fill={color} />
        <circle cx="12" cy="26.5" r="1.5" fill={color} />
        <circle cx="18" cy="26.5" r="1.5" fill={color} />
        {/* Cab & Body */}
        <rect x="5" y="16" width="12" height="8" rx="1.5" fill={color} fillOpacity="0.3" />
        <line x1="8" y1="18" x2="11" y2="18" strokeWidth="1.2" />
        {/* Boom, Stick, Bucket */}
        <path d="M14 18 L21 9 L27 15 L29 19 L25 21 Z" fill={color} fillOpacity="0.4" />
        <line x1="14" y1="18" x2="21" y2="9" strokeWidth="2.2" />
        <line x1="21" y1="9" x2="27" y2="15" strokeWidth="2" />
        <line x1="27" y1="15" x2="29" y2="19" strokeWidth="2" />
      </svg>
    );
  }

  if (normType.includes('DRILL') || normType === 'DR') {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Track Base */}
        <rect x="4" y="25" width="14" height="4" rx="1.5" fill={color} fillOpacity="0.2" />
        {/* Drill Mast Tower */}
        <line x1="18" y1="27" x2="18" y2="5" strokeWidth="2.4" />
        <line x1="14" y1="25" x2="18" y2="9" strokeWidth="1.5" />
        {/* Rotary Head & Bit */}
        <rect x="16" y="10" width="4" height="6" rx="1" fill={color} fillOpacity="0.5" />
        <line x1="18" y1="16" x2="18" y2="29" strokeWidth="1.8" strokeDasharray="2,2" />
        {/* Operator Cab */}
        <rect x="6" y="18" width="8" height="7" rx="1" fill={color} fillOpacity="0.3" />
      </svg>
    );
  }

  if (normType.includes('LHD') || normType.includes('UNDERGROUND')) {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Low Profile Underground Body */}
        <path d="M7 21 L13 21 L16 17 L24 17 L27 21 L30 21 L30 24 L5 24 Z" fill={color} fillOpacity="0.3" />
        {/* Wheels */}
        <circle cx="9" cy="24" r="3" fill={color} fillOpacity="0.4" />
        <circle cx="23" cy="24" r="3" fill={color} fillOpacity="0.4" />
        {/* Low Profile Cab */}
        <rect x="15" y="14" width="6" height="4" rx="1" fill={color} fillOpacity="0.5" />
        {/* Front Scoop Bucket */}
        <path d="M27 18 L31 22 L28 25 L24 25 Z" fill={color} fillOpacity="0.6" />
      </svg>
    );
  }

  if (normType.includes('DOZER') || normType === 'DZ') {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Track Base */}
        <rect x="5" y="22" width="18" height="6" rx="3" fill={color} fillOpacity="0.3" />
        <circle cx="8" cy="25" r="1.5" fill={color} />
        <circle cx="14" cy="25" r="1.5" fill={color} />
        <circle cx="20" cy="25" r="1.5" fill={color} />
        {/* Cab */}
        <rect x="10" y="14" width="10" height="8" rx="1.5" fill={color} fillOpacity="0.3" />
        {/* Heavy Blade */}
        <path d="M25 17 L28 17 L29 27 L24 27 Z" fill={color} fillOpacity="0.5" />
        <line x1="20" y1="22" x2="25" y2="22" strokeWidth="2" />
      </svg>
    );
  }

  if (normType.includes('CRUSHER') || normType === 'CR') {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Crusher Feed Hopper */}
        <polygon points="6,6 26,6 20,16 12,16" fill={color} fillOpacity="0.4" />
        {/* Crushing Chamber & Jaws */}
        <rect x="10" y="16" width="12" height="8" fill={color} fillOpacity="0.3" />
        <line x1="12" y1="18" x2="16" y2="22" strokeWidth="1.8" />
        <line x1="20" y1="18" x2="16" y2="22" strokeWidth="1.8" />
        {/* Discharge Conveyor */}
        <line x1="6" y1="28" x2="26" y2="24" strokeWidth="2.5" />
      </svg>
    );
  }

  if (normType.includes('PUMP') || normType === 'SUMP') {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Submersible Pump Cylindrical Body */}
        <rect x="10" y="8" width="12" height="16" rx="2" fill={color} fillOpacity="0.3" />
        <line x1="10" y1="14" x2="22" y2="14" strokeWidth="1.2" />
        <line x1="10" y1="18" x2="22" y2="18" strokeWidth="1.2" />
        {/* Suction Impeller Screen */}
        <path d="M12 24 L16 28 L20 24 Z" fill={color} fillOpacity="0.5" />
        {/* Discharge Pipe */}
        <path d="M16 8 L16 4 L22 4" strokeWidth="2" />
      </svg>
    );
  }

  if (normType.includes('SHAFT') || normType.includes('HOIST')) {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Headframe Tower A-Frame */}
        <line x1="8" y1="28" x2="16" y2="6" strokeWidth="2.2" />
        <line x1="24" y1="28" x2="16" y2="6" strokeWidth="2.2" />
        <line x1="10" y1="20" x2="22" y2="20" strokeWidth="1.5" />
        <line x1="12" y1="14" x2="20" y2="14" strokeWidth="1.5" />
        {/* Sheave Wheels */}
        <circle cx="16" cy="6" r="3" fill={color} fillOpacity="0.4" />
        {/* Vertical Hoist Rope */}
        <line x1="16" y1="9" x2="16" y2="28" strokeWidth="1.5" strokeDasharray="2,2" />
      </svg>
    );
  }

  // Default: Heavy Haul Dumper Truck (Komatsu / Caterpillar)
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Dump Bed */}
      <polygon points="5,11 20,11 18,20 4,20" fill={color} fillOpacity="0.3" />
      {/* Front Cab */}
      <polygon points="20,13 25,13 27,17 27,20 20,20" fill={color} fillOpacity="0.4" />
      <line x1="22" y1="15" x2="25" y2="15" strokeWidth="1.2" />
      {/* Heavy Mining Tires */}
      <circle cx="8" cy="22" r="3.5" fill={color} fillOpacity="0.5" />
      <circle cx="23" cy="22" r="3.5" fill={color} fillOpacity="0.5" />
      <circle cx="8" cy="22" r="1.5" fill="#ffffff" />
      <circle cx="23" cy="22" r="1.5" fill="#ffffff" />
    </svg>
  );
};
