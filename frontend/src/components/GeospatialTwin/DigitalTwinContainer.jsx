import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { DigitalTwin2D } from './DigitalTwin2D.jsx';
import { DigitalTwin3D } from './DigitalTwin3D.jsx';
import { RealEarthMap } from './RealEarthMap.jsx';
import { SatelliteIntelligenceCard } from './SatelliteIntelligenceCard.jsx';
import { GisLayerControls } from './layers/GisLayerControls.jsx';
import { EquipmentIcon } from './EquipmentIcons.jsx';
import { MINE_SPATIAL_REGISTRY } from './mapConfig.js';
import {
  Layers,
  MapPin,
  X,
  Compass,
  SlidersHorizontal,
  ChevronDown,
  Sun,
  Activity,
  Maximize2,
  Minimize2,
  Radio,
  Gauge,
  Thermometer,
  Zap,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Globe2,
  Mountain,
  Play,
  Pause,
  Award,
  Info,
  Server,
  Sparkles,
  Truck
} from 'lucide-react';

export const DigitalTwinContainer = () => {
  const navigate = useNavigate();
  const { activeMine, activeScenario, selectedMineId, setSelectedMineId, t, lang, setIsReportModalOpen } = useApp();

  // Primary Digital Twin Modes: 'REAL_EARTH', 'OPERATIONAL', 'GEOLOGICAL'
  const [twinMode, setTwinMode] = useState('REAL_EARTH');
  const [viewType, setViewType] = useState('3D'); // '2D', '3D'
  const [undergroundPerspective, setUndergroundPerspective] = useState('UNDERGROUND'); // 'SURFACE', 'UNDERGROUND', 'SECTION'
  const [timeOfDay, setTimeOfDay] = useState('13:40');
  const [isLayerDrawerOpen, setIsLayerDrawerOpen] = useState(false);
  const [isSatIntelOpen, setIsSatIntelOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isGeeModalOpen, setIsGeeModalOpen] = useState(false);
  const [isJudgeModeActive, setIsJudgeModeActive] = useState(false);
  const [judgeStep, setJudgeStep] = useState(0);

  const [activeLayers, setActiveLayers] = useState({
    satellite: true,
    terrain: true,
    boundary: true,
    benches: true,
    haulRoads: true,
    shafts: true,
    crusher: true,
    stockpile: true,
    sump: true,
    infrastructure: true,
    oreZones: true,
    geology: true,
    equipment: true,
    telemetry: true,
    production: true,
    riskZones: true,
    weather: true
  });

  const toggleLayer = (layerId) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  const mineConfig = MINE_SPATIAL_REGISTRY[selectedMineId] || MINE_SPATIAL_REGISTRY.balaghat;
  const isUnderground = mineConfig.mineType?.toLowerCase().includes('underground');

  const judgeStepTitles = [
    '01 NATIONAL OVERVIEW',
    '02 SELECT MINE',
    '03 REAL EARTH',
    '04 SATELLITE INTELLIGENCE',
    '05 2D OPERATIONAL TWIN',
    '06 3D TERRAIN',
    '07 GEOLOGICAL SECTION',
    '08 LIVE TELEMETRY',
    '09 KOMATSU FLEET',
    '10 AI ALERT',
    '11 SCENARIO SIMULATION',
    '12 RECOMMENDED DECISION',
    '13 REPORT GENERATION'
  ];

  // 13-Step Judge Demo Tour Sequence
  useEffect(() => {
    let timer;
    if (isJudgeModeActive) {
      timer = setInterval(() => {
        setJudgeStep(prev => {
          const next = (prev + 1) % 13;
          if (next === 0) {
            setTwinMode('REAL_EARTH');
            setIsSatIntelOpen(false);
          } else if (next === 1) {
            setSelectedMineId('balaghat');
          } else if (next === 2) {
            setTwinMode('REAL_EARTH');
          } else if (next === 3) {
            setIsSatIntelOpen(true);
          } else if (next === 4) {
            setIsSatIntelOpen(false);
            setTwinMode('OPERATIONAL');
            setViewType('2D');
          } else if (next === 5) {
            setViewType('3D');
          } else if (next === 6) {
            setTwinMode('GEOLOGICAL');
            setUndergroundPerspective('SECTION');
            setViewType('2D');
          } else if (next === 7) {
            setTwinMode('OPERATIONAL');
            setViewType('3D');
          } else if (next === 8) {
            setSelectedAsset({
              name: 'Komatsu PC800 Mining Shovel',
              code: 'EX-01',
              type: 'EXCAVATOR',
              health: 94,
              engineTemp: '76°C',
              vib: '1.4 mm/s',
              fuel: '82%',
              rul: '2,840 hrs',
              level: 'Bench 04 (+280m)'
            });
          } else if (next === 9) {
            setSelectedAsset(null);
          } else if (next === 10) {
            setUndergroundPerspective('UNDERGROUND');
          } else if (next === 11) {
            setViewType('3D');
          } else if (next === 12) {
            setIsReportModalOpen(true);
          }
          return next;
        });
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isJudgeModeActive, isUnderground, setSelectedMineId, setIsReportModalOpen]);

  return (
    <div className="relative w-full h-[540px] sm:h-[600px] lg:h-[650px] rounded-2xl bg-[#06090e] border border-[#18263c] overflow-hidden shadow-2xl flex flex-col font-sans select-none text-zinc-100">

      {/* 1. TOP GIS WORKSTATION TOOLBAR */}
      <div className="px-3 sm:px-4 py-2 bg-[#090f19]/95 border-b border-[#141f32] flex flex-wrap items-center justify-between gap-2 z-20 backdrop-blur-md">

        {/* Left: Core Digital Twin Mode Tabs */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center p-0.5 rounded-xl bg-[#0c1422] border border-[#1c2c46] font-mono text-xs shadow-inner">
            {[
              { id: 'REAL_EARTH', label: t?.twin?.realEarth || 'Real Earth / Satellite', icon: Globe2 },
              { id: 'OPERATIONAL', label: t?.twin?.operational || 'Operational Twin', icon: Activity },
              { id: 'GEOLOGICAL', label: t?.twin?.geological || 'Geological Twin', icon: Mountain }
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setTwinMode(m.id)}
                  className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    twinMode === m.id
                      ? 'bg-[#182844] text-sky-300 shadow-md border border-sky-500/40'
                      : 'text-[#5F625C] hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{m.label}</span>
                  <span className="sm:hidden">{m.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* 2D / 3D Perspective Toggle (When in Operational or Geological mode) */}
          {twinMode !== 'REAL_EARTH' && (
            <div className="flex items-center p-0.5 rounded-xl bg-[#0c1422] border border-[#1c2c46] font-mono text-xs">
              <button
                onClick={() => setViewType('3D')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  viewType === '3D' ? 'bg-[#15233b] text-amber-300' : 'text-[#85877E] hover:text-[#272A27]'
                }`}
              >
                {t?.twin?.view3D || '3D View'}
              </button>
              <button
                onClick={() => setViewType('2D')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  viewType === '2D' ? 'bg-[#15233b] text-amber-300' : 'text-[#85877E] hover:text-[#272A27]'
                }`}
              >
                {t?.twin?.view2D || '2D Plan'}
              </button>
            </div>
          )}

          {/* Underground Horizon Perspective Toggle (SURFACE / UNDERGROUND / SECTION) */}
          {twinMode === 'GEOLOGICAL' && (
            <div className="flex items-center p-0.5 rounded-xl bg-[#0c1422] border border-cyan-800/60 font-mono text-xs">
              {['SURFACE', 'UNDERGROUND', 'SECTION'].map((p) => (
                <button
                  key={p}
                  onClick={() => setUndergroundPerspective(p)}
                  className={`px-2 py-1 rounded-lg font-bold text-[10px] transition-all ${
                    undergroundPerspective === p
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow'
                      : 'text-[#85877E] hover:text-[#272A27]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Satellite Intelligence Toggle, Judge Demo, Time Slider, GIS Layers */}
        <div className="flex items-center gap-2">

          {/* Satellite Change Intelligence Toggle */}
          <button
            onClick={() => setIsSatIntelOpen(prev => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[10.5px] font-mono transition-all shadow ${
              isSatIntelOpen
                ? 'bg-emerald-900/80 text-emerald-200 border-emerald-500'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50 hover:bg-emerald-900/40'
            }`}
            title="Satellite Earth Observation Change Intelligence"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">SATELLITE INTEL</span>
          </button>

          {/* 13-Step Judge Demo Guided Walkthrough Button */}
          <button
            onClick={() => setIsJudgeModeActive(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs font-bold transition-all shadow-md ${
              isJudgeModeActive
                ? 'bg-rose-900/80 text-rose-200 border border-rose-500 animate-pulse'
                : 'bg-amber-950/60 text-amber-300 border border-amber-600/60 hover:bg-amber-900/60'
            }`}
          >
            {isJudgeModeActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isJudgeModeActive ? judgeStepTitles[judgeStep] : (t?.nav?.judgeDemo || 'JUDGE DEMO')}</span>
          </button>

          {/* Time-of-Day Illumination Slider */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0c1422] border border-[#1c2c46] font-mono text-xs">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <input
              type="range"
              min="6"
              max="18"
              step="0.5"
              value={parseFloat(timeOfDay.split(':')[0]) + parseFloat(timeOfDay.split(':')[1]) / 60}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                const h = Math.floor(val);
                const m = Math.round((val - h) * 60);
                setTimeOfDay(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
              }}
              className="w-14 accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
            <span className="text-amber-300 font-bold text-[11px]">{timeOfDay}</span>
          </div>

          {/* GIS Layers Drawer Toggle */}
          <button
            onClick={() => setIsLayerDrawerOpen(prev => !prev)}
            className={`p-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 border transition-all ${
              isLayerDrawerOpen
                ? 'bg-[#1e2f4d] text-sky-300 border-sky-500'
                : 'bg-[#0c1422] text-[#5F625C] border-[#1c2c46] hover:text-white'
            }`}
            title="Toggle GIS Engineering Layers"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">{t?.twin?.layers || 'LAYERS'}</span>
          </button>
        </div>
      </div>

      {/* 2. PRIMARY VIEWPORT CANVAS / MAP CONTAINER */}
      <div className="relative flex-1 w-full bg-[#06090e] overflow-hidden">

        {twinMode === 'REAL_EARTH' ? (
          <RealEarthMap
            mineId={selectedMineId}
            activeLayers={activeLayers}
            activeScenario={activeScenario}
            onSelectAsset={(asset) => setSelectedAsset(asset)}
            onSelectSensor={(sensor) => setSelectedSensor(sensor)}
            onSelectLocation={(loc) => setSelectedLocation(loc)}
          />
        ) : viewType === '3D' ? (
          <DigitalTwin3D
            mineId={selectedMineId}
            activeScenario={activeScenario}
            twinMode={twinMode}
            undergroundPerspective={undergroundPerspective}
            timeOfDay={timeOfDay}
            activeLayers={activeLayers}
            onSelectAsset={(asset) => setSelectedAsset(asset)}
          />
        ) : (
          <DigitalTwin2D
            mineId={selectedMineId}
            activeScenario={activeScenario}
            twinMode={twinMode}
            undergroundPerspective={undergroundPerspective}
            activeLayers={activeLayers}
            onSelectAsset={(asset) => setSelectedAsset(asset)}
          />
        )}

        {/* 3. GIS STATUS BAR (Bottom Georeferencing Overlay) */}
        <div className="absolute bottom-2 left-2 right-2 z-10 pointer-events-none flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#090f19]/90 border border-[#18263c] backdrop-blur-md text-[10.5px] font-mono text-[#272A27]">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{mineConfig.coordinatesDMS}</span>
            </div>
            <div className="text-[#5F625C]">
              ELEVATION: <strong className="text-white">{mineConfig.elevation}</strong>
            </div>
            <div className="text-[#5F625C]">
              DATUM: <strong className="text-white">WGS84</strong>
            </div>
            <div className="text-[#5F625C] hidden md:inline">
              LEASE: <strong className="text-emerald-400">{mineConfig.leaseAreaHa} Ha</strong>
            </div>
            <div className="text-[#5F625C] hidden lg:inline">
              SOURCE: <strong className="text-sky-300">Sentinel-2 / Esri World Imagery / Carto</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[10px] text-[#5F625C]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SCADA TELEMETRY SYNCED</span>
            </div>
          </div>
        </div>

        {/* 4. SATELLITE INTELLIGENCE POPUP DRAWER */}
        {isSatIntelOpen && (
          <div className="absolute top-2 left-2 z-30 w-84 max-w-sm shadow-2xl animate-in fade-in slide-in-from-left-2 duration-200">
            <SatelliteIntelligenceCard mineId={selectedMineId} />
          </div>
        )}

        {/* 5. GIS LAYERS POPUP DRAWER */}
        {isLayerDrawerOpen && (
          <div className="absolute top-2 right-2 z-30 w-72 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <GisLayerControls
              activeLayers={activeLayers}
              onToggleLayer={toggleLayer}
            />
          </div>
        )}

        {/* 6. SLIDE-OUT SCADA ASSET DIAGNOSTICS INSPECTOR */}
        {selectedAsset && (
          <div className="absolute top-2 left-2 z-30 w-80 p-4 rounded-2xl bg-[#090e17]/95 border border-sky-500/50 shadow-2xl backdrop-blur-md space-y-3 font-mono text-xs animate-in fade-in slide-in-from-left-2 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#18263c]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-950 border border-sky-500/40 text-sky-300">
                  <EquipmentIcon type={selectedAsset.type} className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs leading-tight">{selectedAsset.name}</h4>
                  <div className="text-[10px] text-sky-400 font-bold">{selectedAsset.code} • {selectedAsset.level || 'Active Stope'}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1 rounded-lg text-[#5F625C] hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-[#0d1522] border border-[#19263a]">
                <div className="text-[9px] text-[#85877E] uppercase">OPERATING HEALTH</div>
                <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5" />
                  {selectedAsset.health || 92}%
                </div>
              </div>
              <div className="p-2 rounded-lg bg-[#0d1522] border border-[#19263a]">
                <div className="text-[9px] text-[#85877E] uppercase">ENGINE TEMP</div>
                <div className="text-sm font-bold text-amber-400 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5" />
                  {selectedAsset.temp || selectedAsset.engineTemp || '74°C'}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-[#0d1522] border border-[#19263a]">
                <div className="text-[9px] text-[#85877E] uppercase">VIBRATION RMS</div>
                <div className="text-sm font-bold text-sky-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" />
                  {selectedAsset.vib || '1.6 mm/s'}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-[#0d1522] border border-[#19263a]">
                <div className="text-[9px] text-[#85877E] uppercase">ESTIMATED RUL</div>
                <div className="text-sm font-bold text-emerald-300 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {selectedAsset.rul || '2,480 hrs'}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#18263c] flex items-center justify-between">
              <span className="text-[10px] text-[#5F625C]">DGMS SAFETY CERTIFIED</span>
              <button
                onClick={() => navigate('/equipment')}
                className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] transition-colors"
              >
                OPEN FLEET INSPECTION →
              </button>
            </div>
          </div>
        )}

        {/* 7. SENSOR TELEMETRY INSPECTOR MODAL */}
        {selectedSensor && (
          <div className="absolute top-2 left-2 z-30 w-80 p-4 rounded-2xl bg-[#090e17]/95 border border-cyan-500/50 shadow-2xl backdrop-blur-md space-y-3 font-mono text-xs animate-in fade-in slide-in-from-left-2 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#18263c]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs leading-tight">{selectedSensor.name || selectedSensor.id}</h4>
                  <div className="text-[10px] text-cyan-400 font-bold">{selectedSensor.type} • {selectedSensor.unit}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedSensor(null)}
                className="p-1 rounded-lg text-[#5F625C] hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0c1422] border border-[#19263a] flex items-center justify-between">
              <div>
                <div className="text-[9px] text-[#85877E] uppercase">CURRENT READING</div>
                <div className="text-lg font-bold text-white">{selectedSensor.value} {selectedSensor.unit}</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-[#85877E] uppercase">STATUS</div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                  {selectedSensor.status || 'NORMAL'}
                </span>
              </div>
            </div>

            <div className="text-[10.5px] text-[#5F625C] space-y-1">
              <div className="flex justify-between"><span>Normal Threshold:</span> <strong className="text-white">{selectedSensor.normalRange || '0 - 100'}</strong></div>
              <div className="flex justify-between"><span>Sample Rate:</span> <strong className="text-white">1 Hz Live Telemetry</strong></div>
              <div className="flex justify-between"><span>Protocol State:</span> <strong className="text-emerald-400">DGMS Standard Met</strong></div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
