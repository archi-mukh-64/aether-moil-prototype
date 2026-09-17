import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  Globe2,
  Trees,
  Droplets,
  CloudRain,
  Activity,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const MINE_WATER_PROXIMITY = {
  balaghat: '1.2 km (Wainganga River Basin)',
  tirodi: '2.4 km (Chandan River Basin)',
  ukwa: '3.1 km (Nahara River Catchment)',
  munsar: '1.8 km (Sur River Basin)',
  kandri: '2.2 km (Pench River Basin)',
  gumgaon: '2.9 km (Kanhan River Basin)',
  chikla: '1.5 km (Bawanthadi River)',
  'dongri-buzurg': '1.9 km (Bawanthadi Basin)',
  ramtek: '2.6 km (Sur River Basin)',
  bhandara: '2.1 km (Wainganga Basin)'
};

export const EnvironmentalSidebarCard = () => {
  const { activeMine, lang } = useApp();
  const [isExpanded, setIsExpanded] = useState(true);

  const mineId = activeMine?.id || 'balaghat';
  const seed = (activeMine?.spatialSeed || 1) * 7;
  const isUnderground = activeMine?.mineType?.toLowerCase().includes('underground');

  const ndviVal = (0.36 + ((seed % 15) * 0.01)).toFixed(2);
  const ndwiVal = (-0.22 + ((seed % 10) * 0.02)).toFixed(2);
  const moistureVal = (18.4 + ((seed % 12) * 0.8)).toFixed(1);
  const vegStressVal = (7.5 + (seed % 8)).toFixed(1);
  const rainfallMm = activeMine?.baselineRainfallMm || 140;
  const precipAnomaly = (activeMine?.rainfallSensitivity || 1.0) > 1.2 ? '+24% Anomaly' : '+8% Normal';
  
  const riskScoreNum = Math.round(12 + ((activeMine?.rainfallSensitivity || 1.0) * 10) + (seed % 6));
  const riskScore = riskScoreNum > 25 ? `MODERATE (${riskScoreNum}/100)` : `LOW (${riskScoreNum}/100)`;
  const riskVariant = riskScoreNum > 25 
    ? 'bg-[#C84B3F]/20 text-[#E28378] border-[#C84B3F]/40' 
    : 'bg-[#71856B]/20 text-[#A2BA9B] border-[#71856B]/40';

  const landCoverText = isUnderground 
    ? 'Afforestation 62% • Buffer 38%' 
    : 'Opencast 44% • Greenbelt 36%';

  const waterProximityText = MINE_WATER_PROXIMITY[mineId] || '1.8 km (River Basin)';

  return (
    <div className="p-2.5 rounded-xl bg-[#181D1A] border border-[#2E3731] shadow-md space-y-2 font-mono text-xs text-[#F0EBE2] transition-all duration-200">
      {/* Header — Clickable toggle */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer select-none group"
        title={isExpanded ? "Collapse Environmental Monitor" : "Expand Environmental Monitor"}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Globe2 className="w-3.5 h-3.5 text-[#3D8C8A] shrink-0" />
          <span className="font-bold text-[10px] uppercase tracking-wider text-[#F0EBE2] truncate group-hover:text-[#3D8C8A] transition-colors">
            {lang === 'hi' ? 'पर्यावरण मॉनिटर' : lang === 'mr' ? 'पर्यावरण मॉनिटर' : 'ENV MONITOR'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`px-1.5 py-0.2 rounded text-[8.5px] font-bold border ${riskVariant}`}>
            {riskScore.split(' ')[0]}
          </span>
          <button 
            type="button"
            className="p-0.5 rounded text-[#85877E] hover:text-[#F0EBE2] transition-colors"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Active Mine Subheading */}
      <div className="flex items-center justify-between text-[9.5px] pt-1 border-t border-[#2E3731]/60">
        <span className="text-[#85877E]">{lang === 'hi' ? 'खदान:' : lang === 'mr' ? 'खाण:' : 'Mine:'}</span>
        <strong className="text-[#C46A32] font-bold truncate max-w-[130px]">{activeMine?.name || 'Balaghat Mine'}</strong>
      </div>

      {/* Expandable Telemetry Details */}
      {isExpanded && (
        <div className="space-y-2 pt-1 border-t border-[#2E3731]/60">
          {/* Grid of Compact Environmental Metrics */}
          <div className="grid grid-cols-2 gap-1 text-[9px]">
            <div className="p-1 rounded-lg bg-[#202522] border border-[#2E3731] space-y-0.5">
              <div className="flex items-center gap-1 text-[#85877E]">
                <Trees className="w-2.5 h-2.5 text-[#71856B]" />
                <span>NDVI</span>
              </div>
              <div className="font-bold text-[#F0EBE2]">{ndviVal} <span className="text-[#71856B] text-[8px]">(OK)</span></div>
            </div>

            <div className="p-1 rounded-lg bg-[#202522] border border-[#2E3731] space-y-0.5">
              <div className="flex items-center gap-1 text-[#85877E]">
                <Droplets className="w-2.5 h-2.5 text-[#3D8C8A]" />
                <span>NDWI</span>
              </div>
              <div className="font-bold text-[#F0EBE2]">{ndwiVal} <span className="text-[#3D8C8A] text-[8px]">(Opt)</span></div>
            </div>

            <div className="p-1 rounded-lg bg-[#202522] border border-[#2E3731] space-y-0.5">
              <div className="flex items-center gap-1 text-[#85877E]">
                <CloudRain className="w-2.5 h-2.5 text-[#655C9F]" />
                <span>Rain</span>
              </div>
              <div className="font-bold text-[#F0EBE2]">{rainfallMm} mm</div>
            </div>

            <div className="p-1 rounded-lg bg-[#202522] border border-[#2E3731] space-y-0.5">
              <div className="flex items-center gap-1 text-[#85877E]">
                <Activity className="w-2.5 h-2.5 text-[#B88A3B]" />
                <span>Moisture</span>
              </div>
              <div className="font-bold text-[#F0EBE2]">{moistureVal}%</div>
            </div>
          </div>

          {/* Land-cover & Proximity Bar */}
          <div className="space-y-0.5 text-[8.5px] pt-1 border-t border-[#2E3731]/60 text-[#85877E]">
            <div className="flex justify-between">
              <span>Land:</span>
              <span className="text-[#F0EBE2] font-semibold truncate max-w-[130px]">{landCoverText}</span>
            </div>
            <div className="flex justify-between">
              <span>Water:</span>
              <span className="text-[#3D8C8A] font-semibold truncate max-w-[130px]">{waterProximityText}</span>
            </div>
            <div className="flex justify-between">
              <span>Veg Stress:</span>
              <span className="text-[#71856B] font-semibold">Low ({vegStressVal}%)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
