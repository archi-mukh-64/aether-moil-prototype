import React from 'react';
import { Layers, ShieldCheck, MapPin, Globe2, Compass } from 'lucide-react';

/**
 * AETHER Map Legend & Control Overlay Primitive
 * Lightweight, zero-key Leaflet floating overlay showing mine statuses,
 * geological layers, and active geospatial intelligence source.
 */
export const AetherMapLegend = ({
  className = '',
  selectedMine,
  activeLayer = 'OpenStreetMap',
  showGeology = true,
  onToggleGeology
}) => {
  return (
    <div className={`p-3 rounded-xl bg-white/95 backdrop-blur-md border border-[#CBD5E1] shadow-md font-sans text-xs text-[#1E293B] space-y-2 select-none pointer-events-auto ${className}`}>

      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[#E2E8F0] font-mono text-[10px] font-bold text-[#64748B]">
        <div className="flex items-center gap-1.5 text-[#0F172A]">
          <Layers className="w-3.5 h-3.5 text-amber-500" />
          <span>MAP INTELLIGENCE</span>
        </div>
        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
          ZERO-KEY OSM
        </span>
      </div>

      {/* Pin Status Legend */}
      <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white shadow-xs shrink-0" />
          <span className="text-slate-700 font-semibold">Critical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white shadow-xs shrink-0" />
          <span className="text-slate-700 font-semibold">Watch</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-white shadow-xs shrink-0" />
          <span className="text-slate-700 font-semibold">Optimal</span>
        </div>
      </div>

      {/* Sausar Geological Belt Corridor Toggle */}
      {onToggleGeology && (
        <div className="pt-1 border-t border-[#F1F5F9] flex items-center justify-between text-[11px]">
          <span className="text-[#475569] font-medium flex items-center gap-1">
            <Compass className="w-3 h-3 text-amber-600" />
            Sausar Mn Belt
          </span>
          <button
            onClick={onToggleGeology}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
              showGeology
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}
          >
            {showGeology ? 'VISIBLE' : 'HIDDEN'}
          </button>
        </div>
      )}

      {/* Selected Mine Status Ticker */}
      {selectedMine && (
        <div className="pt-1 border-t border-[#F1F5F9] text-[10px] font-mono flex items-center justify-between text-[#64748B]">
          <span>ACTIVE: <strong className="text-[#172033]">{selectedMine.name}</strong></span>
          <span className="text-amber-600 font-bold">{selectedMine.grade || '44.2% Mn'}</span>
        </div>
      )}

    </div>
  );
};
