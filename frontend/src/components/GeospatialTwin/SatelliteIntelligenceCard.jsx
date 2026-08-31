import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { MINE_SPATIAL_REGISTRY } from './mapConfig.js';
import {
  Globe2,
  Sparkles,
  Calendar,
  TrendingUp,
  Droplet,
  Layers,
  Compass,
  Info,
  ChevronRight,
  ShieldCheck,
  Activity,
  Sliders,
  Eye
} from 'lucide-react';

export const SatelliteIntelligenceCard = ({ mineId = 'balaghat' }) => {
  const { lang, t } = useApp();
  const [selectedYear, setSelectedYear] = useState('2026');
  const [satelliteSpectralMode, setSatelliteSpectralMode] = useState('TRUE_COLOR'); // 'TRUE_COLOR', 'NDVI', 'SWIR', 'WATER'
  const [compareSplit, setCompareSplit] = useState(50); // percentage for split slider
  const mineConfig = MINE_SPATIAL_REGISTRY[mineId] || MINE_SPATIAL_REGISTRY.balaghat;
  const geo = t?.geospatial || {};

  const changeTimeline = [
    { year: '2024', label: geo.baselineSurvey || 'Baseline Survey', areaHa: mineConfig.leaseAreaHa * 0.88, ndvi: 0.48, waterRisk: 'LOW', disturbedDiff: 'Baseline' },
    { year: '2025', label: geo.pitExpansion || 'Pit Expansion', areaHa: mineConfig.leaseAreaHa * 0.94, ndvi: 0.42, waterRisk: 'MODERATE', disturbedDiff: '+6.8% Area' },
    { year: '2026', label: geo.activeHorizon || 'Active Horizon', areaHa: mineConfig.leaseAreaHa, ndvi: 0.38, waterRisk: 'OPTIMAL', disturbedDiff: '+12.4% Area' }
  ];

  const currentTimeline = changeTimeline.find(t => t.year === selectedYear) || changeTimeline[2];

  return (
    <div className="p-4 rounded-2xl bg-[#090e17]/95 border border-[#1a283e] backdrop-blur-md font-mono text-xs text-[#272A27] space-y-3 shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#141f30]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
            <Globe2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-[#272A27] text-xs">{geo.earthObservationIntel || 'Earth Observation Intelligence'}</h4>
            <div className="text-[10px] text-emerald-400 font-bold">Sentinel-2 MSI Level-2A • Landsat 8/9 OLI</div>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#0c1422] text-sky-400 border border-sky-800 text-[10px] font-bold">
          26 AUG 2026 SCENE
        </span>
      </div>

      {/* Spectral Layer Selector */}
      <div className="space-y-1.5">
        <div className="text-[10px] text-[#5F625C] font-bold uppercase flex items-center justify-between">
          <span>{geo.spectralBandAnalysis || 'SPECTRAL BAND ANALYSIS'}</span>
          <span className="text-sky-300 font-bold">{satelliteSpectralMode}</span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {[
            { id: 'TRUE_COLOR', label: geo.trueRgb || 'True RGB' },
            { id: 'NDVI', label: geo.ndviVeg || 'NDVI Veg' },
            { id: 'SWIR', label: geo.swirOre || 'SWIR Ore' },
            { id: 'WATER', label: geo.moisture || 'Moisture' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setSatelliteSpectralMode(m.id)}
              className={`py-1 px-1.5 rounded-lg border text-center text-[10px] font-bold transition-all ${
                satelliteSpectralMode === m.id
                  ? 'bg-sky-950 text-sky-300 border-sky-500 shadow'
                  : 'bg-[#0b121e] border-[#182436] text-[#5F625C] hover:text-[#272A27]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Year Surface Disturbance Timeline Selector */}
      <div className="space-y-1.5">
        <div className="text-[10px] text-[#5F625C] font-bold uppercase flex items-center justify-between">
          <span>{geo.surfaceChangeDetection || 'SURFACE CHANGE DETECTION (2024 → 2026)'}</span>
          <span className="text-amber-400">{geo.active || 'ACTIVE'}: {selectedYear}</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {changeTimeline.map(t => (
            <button
              key={t.year}
              onClick={() => setSelectedYear(t.year)}
              className={`p-2 rounded-xl border text-center transition-all ${
                selectedYear === t.year
                  ? 'bg-[#15233b] border-emerald-500/60 text-white shadow'
                  : 'bg-[#0b121e] border-[#182436] text-[#5F625C] hover:text-[#272A27]'
              }`}
            >
              <div className="text-xs font-bold">{t.year}</div>
              <div className="text-[9px] text-[#85877E] truncate">{t.label}</div>
              <div className="text-[8.5px] text-emerald-400 mt-0.5">{t.disturbedDiff}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Before / After Interactive Split Bar */}
      <div className="p-2.5 rounded-xl bg-[#0c1422] border border-[#182636] space-y-1.5">
        <div className="flex justify-between text-[10px] font-bold text-[#5F625C]">
          <span>2024 BASELINE ({100 - compareSplit}%)</span>
          <span className="text-amber-400">2026 ACTIVE ({compareSplit}%)</span>
        </div>
        <input
          type="range"
          min="10"
          max="90"
          value={compareSplit}
          onChange={(e) => setCompareSplit(parseInt(e.target.value, 10))}
          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />
        <div className="text-[9px] text-[#85877E] text-center">
          {geo.sliderDesc || 'Interactive multi-temporal change detection slider'}
        </div>
      </div>

      {/* Satellite Spectral Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
        <div className="p-2 rounded-xl bg-[#0c1422] border border-[#182636]">
          <div className="text-[9px] text-[#85877E] uppercase">{geo.activeFootprint || 'ACTIVE FOOTPRINT'}</div>
          <div className="text-sm font-bold text-[#272A27] mt-0.5">{currentTimeline.areaHa.toFixed(1)} Ha</div>
          <div className="text-[9px] text-emerald-400 mt-0.5">{geo.leaseBound || 'Lease Bound'}</div>
        </div>

        <div className="p-2 rounded-xl bg-[#0c1422] border border-[#182636]">
          <div className="text-[9px] text-[#85877E] uppercase">{geo.vegetationIndex || 'VEGETATION INDEX'}</div>
          <div className="text-sm font-bold text-sky-300 mt-0.5">NDVI {currentTimeline.ndvi}</div>
          <div className="text-[9px] text-[#5F625C] mt-0.5">{geo.bufferZone || 'Buffer Zone'}</div>
        </div>

        <div className="p-2 rounded-xl bg-[#0c1422] border border-[#182636] col-span-2 sm:col-span-1">
          <div className="text-[9px] text-[#85877E] uppercase">{geo.swirMineralIndex || 'SWIR MINERAL INDEX'}</div>
          <div className="text-sm font-bold text-amber-300 mt-0.5">0.412 SWIR</div>
          <div className="text-[9px] text-amber-400 mt-0.5">{geo.brauniteSignature || 'Braunite Signature'}</div>
        </div>
      </div>

      <div className="p-2 rounded-xl bg-[#0b1320] border border-[#1c2e4a] flex items-center justify-between text-[10.5px]">
        <span className="text-[#5F625C]">{geo.demElevation || 'DEM ELEVATION RELIEF'}:</span>
        <strong className="text-[#272A27]">{mineConfig.elevation} (SRTM 30m Global)</strong>
      </div>
    </div>
  );
};
