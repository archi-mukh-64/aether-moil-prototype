import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { calculateGeologyAtDepth, MINE_GEOLOGY_PROFILES } from '../services/geologyEngine.js';
import { OFFICIAL_MOIL_MINES, MOIL_MINE_REGISTRY } from '../services/mineRegistry.js';
import { reserveApi } from '../services/api/reserveApi.js';
import { nationalRadarApi } from '../services/api/nationalRadarApi.js';
import { explorationApi } from '../services/api/explorationApi.js';
import { earthObservationApi } from '../services/api/earthObservationApi.js';
import { ReserveSatelliteMap } from '../components/ReserveRadar/ReserveSatelliteMap.jsx';
import {
  NATIONAL_RADAR_MODES,
  calculateNationalRadarAnalysis,
  getNationalRadarInsight,
  getNationalCrossMineCorrelations,
  simulateNationalCapitalAllocation
} from '../services/nationalRadarEngine.js';
import {
  Layers,
  Radar,
  MapPin,
  Compass,
  Sparkles,
  Crosshair,
  Activity,
  Download,
  Sliders,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Server,
  Globe2,
  Calendar,
  Clock,
  Search,
  Eye,
  SlidersHorizontal,
  Workflow,
  HelpCircle,
  Play,
  RotateCcw,
  Maximize2,
  Check,
  Filter,
  BarChart3,
  Award,
  Trees,
  Droplets,
  Mountain,
  FileText,
  SplitSquareVertical,
  DollarSign,
  Cpu,
  Wrench,
  Truck,
  Zap,
  Info
} from 'lucide-react';
import { ErrorBoundary } from '../components/common/ErrorBoundary.jsx';
import { AetherSectionHeader, AetherStatusBadge } from '../components/design-system/index.js';

export const ReserveRadarPage = () => {
  return (
    <ErrorBoundary title="EXPLORATION RESERVE RADAR & EARTH INTELLIGENCE">
      <ReserveRadarContent />
    </ErrorBoundary>
  );
};

const ReserveRadarContent = () => {
  const { selectedMineId, setSelectedMineId, activeMine, officialMines, activeScenario, t } = useApp();

  // Primary Module Mode Tabs
  const [radarTab, setRadarTab] = useState('EARTH_INTELLIGENCE');

  const [selectedBand, setSelectedBand] = useState('SWIR');
  const [basemap, setBasemap] = useState('satellite');
  const [drillDepth, setDrillDepth] = useState(145);
  const [backendProspectivity, setBackendProspectivity] = useState(null);

  // Time Machine States
  const [timeMachineYear, setTimeMachineYear] = useState(2026);
  const [compareYearA, setCompareYearA] = useState(2018);
  const [compareYearB, setCompareYearB] = useState(2026);
  const [isScanningTargets, setIsScanningTargets] = useState(false);
  const [activeTargetId, setActiveTargetId] = useState('TARGET-01');
  const [isCompareTargetsOpen, setIsCompareTargetsOpen] = useState(false);

  // Confidence Map States
  const [confidenceDimension, setConfidenceDimension] = useState('COMPOSITE');
  const [dataDensity, setDataDensity] = useState('HIGH');
  const [modelStance, setModelStance] = useState('BALANCED');
  const [selectedBlockId, setSelectedBlockId] = useState('B-17');

  // National Radar Views & Drawer
  const [nationalRadarView, setNationalRadarView] = useState('NATIONAL_PERFORMANCE');
  const [nationalInvestCr, setNationalInvestCr] = useState(150);
  const [inspectedMineId, setInspectedMineId] = useState('balaghat');

  // GIS Layer Manager States
  const [activeLayers, setActiveLayers] = useState({
    lease: true,
    buffer: true,
    geology: true,
    drillHoles: true,
    targets: true,
    workings: true,
    spectrals: true
  });

  const toggleLayer = (layerKey) => {
    setActiveLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const mineList = Array.isArray(officialMines) && officialMines.length > 0 ? officialMines : OFFICIAL_MOIL_MINES;
  const currentMine = activeMine || MOIL_MINE_REGISTRY.balaghat;
  const inspectedMine = MOIL_MINE_REGISTRY[inspectedMineId] || currentMine;

  // Compute Distinct National Radar Analysis for the Active Mode
  const nationalAnalysis = useMemo(() => {
    return calculateNationalRadarAnalysis(nationalRadarView, mineList, activeScenario);
  }, [nationalRadarView, mineList, activeScenario]);

  const activeModeConfig = NATIONAL_RADAR_MODES[nationalRadarView] || NATIONAL_RADAR_MODES.NATIONAL_PERFORMANCE;
  const nationalInsight = useMemo(() => {
    return getNationalRadarInsight(nationalRadarView, nationalAnalysis);
  }, [nationalRadarView, nationalAnalysis]);

  const nationalCorrelations = useMemo(() => {
    return getNationalCrossMineCorrelations();
  }, []);

  const nationalWhatIf = useMemo(() => {
    return simulateNationalCapitalAllocation(nationalInvestCr, { exploration: 35, fleet: 30, crusher: 20, environment: 15 });
  }, [nationalInvestCr]);

  // Top 5 Strategic Management Interventions (Part 13 Requirement)
  const top5Actions = useMemo(() => {
    return [
      {
        priority: 'PRIORITY #1',
        mine: 'Dongri Buzurg Mine',
        problem: 'High-grade Braunite strike extension unverified at depth (-240m horizon).',
        evidence: 'Sentinel-2 SWIR 0.445 peak & continuous 46% Mn lode outcrop.',
        impact: '+4.8 MT Proved Reserve Upside (₹680 Cr Asset Life Expansion).',
        action: 'Deploy 3 deep diamond core rigs along Eastern strike line.',
        confidence: '95.4%'
      },
      {
        priority: 'PRIORITY #2',
        mine: 'Tirodi Mine',
        problem: 'Monsoon precipitation inundation risk in deep bench sump floor.',
        evidence: 'NDWI moisture surge 0.28 & 1.6x baseline rainfall sensitivity.',
        impact: 'Prevent 756 TPD production shortfall during peak storm cycles.',
        action: 'Commission second 450kW submersible dewatering pump battery.',
        confidence: '92.8%'
      },
      {
        priority: 'PRIORITY #3',
        mine: 'Ramtek Mine',
        problem: 'Primary gyratory crusher bearing thermal shear & low fleet RUL (180h).',
        evidence: 'High failure probability (64%) & 3 critical machinery units.',
        impact: 'Eliminate ₹45L unplanned overhaul and 24h shutdown window.',
        action: 'Perform emergency lube system flush and bearing vibration recalibration.',
        confidence: '94.1%'
      },
      {
        priority: 'PRIORITY #4',
        mine: 'Balaghat Mine',
        problem: 'Surface overburden waste dump #02 afforestation greenbelt deficit.',
        evidence: 'NDVI 0.38 vs statutory target 0.45 perimeter buffer.',
        impact: 'Full DGMS & SPCB statutory environmental compliance assurance.',
        action: 'Execute hydroseeding and 5,000 sapling plantation along terrace #3.',
        confidence: '96.2%'
      },
      {
        priority: 'PRIORITY #5',
        mine: 'Chikla Mine',
        problem: 'Haul road rolling resistance bottleneck causing truck cycle delays.',
        evidence: 'Haulage cycle efficiency dropping to 82% on main incline.',
        impact: '+320 TPD daily throughput recovery to primary processing plant.',
        action: 'Grade and resurface 1.4km incline ramp with crushed ballast aggregate.',
        confidence: '90.5%'
      }
    ];
  }, []);

  // Deterministic calculation of geological strata and assay from geologyEngine
  const geology = useMemo(() => {
    return calculateGeologyAtDepth(selectedMineId, drillDepth, selectedBand);
  }, [selectedMineId, drillDepth, selectedBand]);

  // Fetch live ML prospectivity prediction from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await reserveApi.predictProspectivity({
          mine_id: selectedMineId,
          depth_m: drillDepth,
          mn_grade: geology.mnGrade
        });
        if (mounted && res?.prediction) {
          setBackendProspectivity(res);
        }
      } catch (err) {
        // fallback
      }
    })();
    return () => { mounted = false; };
  }, [selectedMineId, drillDepth, geology.mnGrade]);

  // Dynamic World 10m Land Cover Probabilities for Active Mine
  const dynamicWorldClasses = useMemo(() => {
    const seed = (currentMine.spatialSeed || 1) * 7;
    return [
      { name: 'Trees / Afforestation', pct: 38 + (seed % 10), color: '#16a34a' },
      { name: 'Shrub & Scrub', pct: 22 + (seed % 6), color: '#84cc16' },
      { name: 'Bare Soil / Excavation Face', pct: 18 + (seed % 8), color: '#f59e0b' },
      { name: 'Built Infrastructure / Pad', pct: 12 + (seed % 4), color: '#64748b' },
      { name: 'Sump Water & Drainage', pct: 6 + (seed % 3), color: '#06b6d4' },
      { name: 'Crops / Agriculture Buffer', pct: 4 + (seed % 2), color: '#eab308' }
    ];
  }, [currentMine]);

  // "What Changed?" Automated Change-Detection Records
  const whatChangedRecords = useMemo(() => {
    const pfx = (selectedMineId || 'balaghat').slice(0, 3).toUpperCase();
    return [
      {
        id: `CHG-${pfx}-01`,
        title: 'Active Mining Footprint Expansion',
        location: `${currentMine.name} Eastern Pit Limit`,
        coords: currentMine.coordinates,
        date: '26 AUG 2026 (Sentinel-2 Scene)',
        magnitude: '+8.4 Ha (+13.6% expansion)',
        confidence: '96.2%',
        type: 'EXPANSION',
        desc: 'New bench extraction phase exposed high-grade Braunite strata along strike corridor.'
      },
      {
        id: `CHG-${pfx}-02`,
        title: 'Afforestation & Vegetation Recovery',
        location: `${currentMine.name} Overburden Waste Dump #02`,
        coords: currentMine.coordinates,
        date: '14 JUL 2026 (Landsat-9 OLI)',
        magnitude: '+4.2 Ha (+18.4% NDVI Recovery)',
        confidence: '92.8%',
        type: 'RECOVERY',
        desc: 'Green belt reclamation plantation exhibiting healthy NDVI signature (0.44).'
      },
      {
        id: `CHG-${pfx}-03`,
        title: 'Pit Sump Water Accumulation',
        location: `${currentMine.name} Deep Sump Floor`,
        coords: currentMine.coordinates,
        date: '02 AUG 2026 (Sentinel-2 NDWI)',
        magnitude: '+1.8 Ha (NDWI Surge 0.38)',
        confidence: '94.5%',
        type: 'MOISTURE',
        desc: 'Precipitation run-off accumulation managed by active 450kW pumping battery.'
      }
    ];
  }, [selectedMineId, currentMine]);

  // AI Exploration Targets
  const explorationTargets = useMemo(() => {
    const p = MINE_GEOLOGY_PROFILES[selectedMineId] || MINE_GEOLOGY_PROFILES.balaghat;
    const baseLat = parseFloat(currentMine.coordinates?.split(',')[0]) || 21.8499;
    const baseLng = parseFloat(currentMine.coordinates?.split(',')[1]) || 80.2267;

    return [
      {
        id: 'TARGET-01',
        name: `${p.name} Deep Strike Extensional Zone`,
        prospectivity: 94,
        areaHa: '28.4 Ha',
        gradeEst: `${p.maxMnGrade}% Mn`,
        depthRange: '145m - 240m Level',
        coords: `${(baseLat + 0.004).toFixed(4)}, ${(baseLng + 0.005).toFixed(4)}`,
        satelliteEvidence: 'SWIR 0.412 absorption trough & low vegetation anomaly.',
        geologicalEvidence: 'Gondite reef plunging 70° South into footwall gneiss.',
        drillingEvidence: 'DDH-MOIL-04 intersected 4.8m lode @ 44.5% Mn.',
        confidence: '94.2%',
        riskLevel: 'LOW EXPLORATION RISK',
        recommendation: 'Prioritize 3 diamond drill holes to 240m depth. Expected resource upside: +3.2 MT.',
        status: 'TIER-1 HIGH PRIORITY'
      },
      {
        id: 'TARGET-02',
        name: `${p.name} Western Limb Synclinal Fold`,
        prospectivity: 88,
        areaHa: '19.2 Ha',
        gradeEst: `${(p.maxMnGrade - 3.2).toFixed(1)}% Mn`,
        depthRange: '110m - 195m Level',
        coords: `${(baseLat - 0.003).toFixed(4)}, ${(baseLng - 0.004).toFixed(4)}`,
        satelliteEvidence: 'NDVI spectral stress indicator & thermal inertia anomaly.',
        geologicalEvidence: 'Secondary Braunite alteration horizon along syncline axis.',
        drillingEvidence: 'Infill borehole planned at -180m level.',
        confidence: '88.5%',
        riskLevel: 'MODERATE RISK',
        recommendation: 'Step-out drilling along syncline axial plane. Expected resource upside: +2.1 MT.',
        status: 'DRILL READY'
      },
      {
        id: 'TARGET-03',
        name: `${p.name} Footwall Shear Dislocation Target`,
        prospectivity: 82,
        areaHa: '14.6 Ha',
        gradeEst: `${(p.maxMnGrade - 6.5).toFixed(1)}% Mn`,
        depthRange: '180m - 320m Level',
        coords: `${(baseLat + 0.002).toFixed(4)}, ${(baseLng - 0.006).toFixed(4)}`,
        satelliteEvidence: 'Landsat Band 7/5 ratio lineament discontinuity.',
        geologicalEvidence: 'Biotite schist fault gouge with manganese impregnations.',
        drillingEvidence: 'Historical exploratory core hole assay: 38.2% Mn.',
        confidence: '82.0%',
        riskLevel: 'EXPLORATORY RISK',
        recommendation: 'Electromagnetic geophysical survey prior to deep borehole collaring.',
        status: 'INFILL SCAN'
      }
    ];
  }, [selectedMineId, currentMine]);

  const activeTarget = explorationTargets.find(t => t.id === activeTargetId) || explorationTargets[0];

  // Feature Importance Decomposition for Prospectivity Score
  const featureContribution = useMemo(() => {
    return [
      { name: 'Sausar Geological Structure', pct: 32, fill: '#f59e0b' },
      { name: 'Sentinel-2 SWIR Spectral Signature', pct: 27, fill: '#38bdf8' },
      { name: 'DEM Elevation & Terrain Slope', pct: 18, fill: '#10b981' },
      { name: 'GSI Historical Mine Workings', pct: 15, fill: '#eab308' },
      { name: 'Surface Disturbance Anomaly', pct: 8, fill: '#ec4899' }
    ];
  }, []);

  // Reserve Depletion / Expansion Evolution Waterfall
  const reserveEvolutionData = useMemo(() => {
    const totalEst = currentMine.unfcStatus?.includes('111') ? 14.8 : 8.6;
    return [
      { step: '1. Initial Geological Resource', value: totalEst + 6.2, fill: '#64748b' },
      { step: '2. Cumulative Production Extracted', value: -6.2, fill: '#ef4444' },
      { step: '3. Current Proved Reserve (UNFC-111)', value: totalEst, fill: '#10b981' },
      { step: '4. Satellite-Supported Potential', value: 3.4, fill: '#38bdf8' },
      { step: '5. AI-Projected Deep Expansion', value: 4.8, fill: '#f59e0b' },
      { step: '6. Total Resource Horizon', value: totalEst + 3.4 + 4.8, fill: '#8b5cf6' }
    ];
  }, [currentMine]);

  // Spatial Confidence Grid
  const confidenceGridBlocks = useMemo(() => {
    const blocks = [];
    const stanceMultiplier = modelStance === 'CONSERVATIVE' ? 0.92 : modelStance === 'AGGRESSIVE' ? 1.05 : 1.0;
    const densityBonus = dataDensity === 'HIGH' ? 6 : dataDensity === 'LOW' ? -8 : 0;

    for (let r = 1; r <= 4; r++) {
      for (let c = 1; c <= 6; c++) {
        const id = `B-${(r - 1) * 6 + c}`;
        const baseConf = Math.min(98, Math.max(45, Math.round((70 + ((r * 7 + c * 11) % 25) + densityBonus) * stanceMultiplier)));
        const grade = (38.5 + ((r * 3 + c * 5) % 8.5)).toFixed(1);
        const uncert = (1.8 + ((r + c) % 3.2)).toFixed(1);
        const drillHoles = Math.max(1, (r + c) % 5);
        const level = baseConf >= 85 ? 'HIGH' : baseConf >= 70 ? 'MEDIUM' : 'LOW';

        blocks.push({
          id,
          row: r,
          col: c,
          conf: baseConf,
          grade,
          uncert,
          drillHoles,
          level,
          satSupport: baseConf > 80 ? 'HIGH' : 'MEDIUM',
          geoSupport: baseConf > 75 ? 'HIGH' : 'MODERATE'
        });
      }
    }
    return blocks;
  }, [modelStance, dataDensity]);

  const activeBlock = confidenceGridBlocks.find(b => b.id === selectedBlockId) || confidenceGridBlocks[16];

  // Environmental Monitor Multi-Temporal Profile
  const envTemporalData = useMemo(() => {
    const baseArea = currentMine.leaseAreaHa || 180.5;
    return {
      2018: { footprint: Math.round(baseArea * 0.78), veg: 48, dist: 38, rec: 12, water: 4.2, ndvi: '0.48', ndwi: '0.18', risk: 'LOW' },
      2019: { footprint: Math.round(baseArea * 0.81), veg: 46, dist: 41, rec: 14, water: 4.5, ndvi: '0.46', ndwi: '0.19', risk: 'LOW' },
      2020: { footprint: Math.round(baseArea * 0.84), veg: 44, dist: 45, rec: 16, water: 5.1, ndvi: '0.44', ndwi: '0.21', risk: 'LOW' },
      2021: { footprint: Math.round(baseArea * 0.88), veg: 41, dist: 49, rec: 18, water: 5.4, ndvi: '0.41', ndwi: '0.22', risk: 'MODERATE' },
      2022: { footprint: Math.round(baseArea * 0.91), veg: 40, dist: 52, rec: 20, water: 5.8, ndvi: '0.40', ndwi: '0.23', risk: 'MODERATE' },
      2023: { footprint: Math.round(baseArea * 0.94), veg: 39, dist: 55, rec: 22, water: 6.0, ndvi: '0.39', ndwi: '0.23', risk: 'MODERATE' },
      2024: { footprint: Math.round(baseArea * 0.97), veg: 38, dist: 58, rec: 24, water: 6.2, ndvi: '0.38', ndwi: '0.22', risk: 'LOW' },
      2025: { footprint: Math.round(baseArea * 0.99), veg: 38, dist: 60, rec: 26, water: 6.5, ndvi: '0.38', ndwi: '0.22', risk: 'LOW' },
      2026: { footprint: baseArea, veg: 39, dist: 62, rec: 28, water: 6.8, ndvi: '0.38', ndwi: '0.22', risk: 'LOW (COMPLIANT)' }
    };
  }, [currentMine]);

  const activeEnvScene = envTemporalData[timeMachineYear] || envTemporalData[2026];

  return (
    <div className="space-y-6 font-sans text-[#272A27]">

      {/* 1. Header & Mine Selector Strip (Theme: Geology / Earth Observation, Accent: Ochre #B88A3B) */}
      <AetherSectionHeader
        title={`${currentMine.name} — Reserve Intelligence & Radar`}
        subtitle="Multi-spectral satellite remote sensing, Dynamic World land-cover classification, geological prospectivity modeling, and UNFC reserve intelligence."
        badge={`${currentMine.district?.toUpperCase()} • ${currentMine.state?.toUpperCase()}`}
        accent="#B88A3B"
        icon={Compass}
        actions={
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-lg p-1 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] no-scrollbar">
            {mineList.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedMineId(m.id);
                  setInspectedMineId(m.id);
                  setActiveTargetId('TARGET-01');
                  setSelectedBlockId('B-17');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedMineId === m.id
                    ? 'bg-[#B88A3B] text-white shadow-xs'
                    : 'text-[#5F625C] hover:text-[#272A27] hover:bg-[#E8E1D5]'
                }`}
              >
                {m.shortName || m.name}
              </button>
            ))}
          </div>
        }
      />

      {/* 2. SATELLITE TO UNFC RESERVE INTELLIGENCE PIPELINE BANNER */}
      <div className="p-4 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm space-y-3 font-mono text-xs text-[#272A27]">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#DDD4C5] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-[#3D8C8A]" />
            <span className="font-bold text-[#3D8C8A] uppercase tracking-wider">
              EARTH OBSERVATION &rarr; SPECTRAL FEATURES &rarr; PROSPECTIVITY &rarr; UNFC RESERVE
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#3D8C8A]/15 text-[#275B59] border border-[#3D8C8A]/40 text-[10px] font-bold">
            DATA SOURCE: SATELLITE DEMONSTRATION DATA (Sentinel-2 MSI Level-2A &amp; Landsat 8/9)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
            <div className="text-[9px] text-[#5F625C] uppercase font-bold">1. SATELLITE SPECTRAL</div>
            <div className="text-sm font-bold text-[#3D8C8A] mt-1">SWIR 0.412 Index</div>
            <div className="text-[10.5px] text-[#5F625C] mt-0.5">Braunite Band 11/12 Peak</div>
          </div>

          <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
            <div className="text-[9px] text-[#5F625C] uppercase font-bold">2. GEOLOGICAL HORIZON</div>
            <div className="text-sm font-bold text-[#B88A3B] mt-1">{geology.stratumLayer}</div>
            <div className="text-[10.5px] text-[#5F625C] mt-0.5">Dip: {currentMine.dipAngle || '70° S'} • Sausar Group</div>
          </div>

          <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
            <div className="text-[9px] text-[#5F625C] uppercase font-bold">3. PROSPECTIVITY SCORE</div>
            <div className="text-sm font-bold text-[#71856B] mt-1">{geology.prospectivityScore}% Prospectivity</div>
            <div className="text-[10.5px] text-[#5F625C] mt-0.5">RandomForest RF-94.2 Calibrated</div>
          </div>

          <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
            <div className="text-[9px] text-[#5F625C] uppercase font-bold">4. UNFC STATUS</div>
            <div className="text-sm font-bold text-[#C46A32] mt-1">{currentMine.unfcStatus || 'UNFC-111 Proved'}</div>
            <div className="text-[10.5px] text-[#5F625C] mt-0.5">Statutory Mineral Inventory</div>
          </div>
        </div>
      </div>

      {/* 3. RESERVE RADAR WORKSPACE TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-2 rounded-2xl bg-[#F5F1E9] border border-[#C8BFAF] font-mono text-xs no-scrollbar">
        {[
          { id: 'EARTH_INTELLIGENCE', label: 'Earth Intelligence Map' },
          { id: 'TIME_MACHINE', label: 'Satellite Time Machine' },
          { id: 'PROSPECTIVITY_AI', label: 'Prospectivity AI' },
          { id: 'EXPLORATION_TARGETS', label: 'Exploration Targets' },
          { id: 'RESERVE_EVOLUTION', label: 'Reserve Evolution' },
          { id: 'CONFIDENCE_MAP', label: 'Confidence Map' },
          { id: 'ENVIRONMENTAL_MONITOR', label: 'Environmental Monitor' },
          { id: 'NATIONAL_RADAR', label: 'National Radar' },
          { id: 'VIRTUAL_DRILL', label: 'Virtual Core Drill' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setRadarTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              radarTab === tab.id
                ? 'bg-[#B88A3B] text-white shadow-xs'
                : 'text-[#5F625C] hover:text-[#272A27] hover:bg-[#E8E1D5]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 4. TAB: EARTH INTELLIGENCE (Real Satellite Map + GIS Layers) */}
      {/* ========================================================================= */}
      {radarTab === 'EARTH_INTELLIGENCE' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
            {/* Left 8 Cols: Real Leaflet Satellite GIS Map */}
            <div className="lg:col-span-8 panel-surface p-6 sm:p-8 border border-sky-500/40 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-3">
                <div>
                  <span className="badge-telemetry text-[10px]">COPERNICUS SENTINEL-2 &amp; LANDSAT 8/9</span>
                  <h3 className="font-display text-xl font-bold text-[#272A27] mt-1">
                    Multi-Spectral Earth Observation Canvas ({currentMine.name})
                  </h3>
                </div>

                {/* Basemap & Spectral Band Toggles */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {['SWIR', 'NDVI', 'NDWI', 'TRUE_RGB', 'FALSE_COLOR', 'LAND_COVER'].map(b => (
                    <button
                      key={b}
                      onClick={() => setSelectedBand(b)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        selectedBand === b ? 'bg-[#3D8C8A] text-white font-extrabold shadow' : 'bg-[#F0EBE2] text-[#5F625C] hover:text-[#272A27] border border-[#C8BFAF]'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Real Leaflet Map Container Component */}
              <div className="h-[460px] w-full rounded-2xl overflow-hidden">
                <ReserveSatelliteMap
                  mineId={selectedMineId}
                  activeBand={selectedBand}
                  basemap={basemap}
                  timeMachineYear={timeMachineYear}
                  activeTargetId={activeTargetId}
                  onSelectTarget={(tgt) => setActiveTargetId(tgt.id)}
                  explorationTargets={explorationTargets}
                  activeLayers={activeLayers}
                />
              </div>

              {/* GIS Layer Switcher Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] text-[10px]">
                <span className="text-[#85877E] uppercase font-bold">GIS Layer Overlays:</span>
                <div className="flex flex-wrap items-center gap-3">
                  {[
                    { key: 'lease', label: 'Lease Boundary' },
                    { key: 'buffer', label: '500m Buffer' },
                    { key: 'geology', label: 'Ore Reef Strata' },
                    { key: 'spectrals', label: 'Spectral Raster' },
                    { key: 'drillHoles', label: 'Drill Holes' },
                    { key: 'targets', label: 'AI Targets' }
                  ].map(l => (
                    <label key={l.key} className="flex items-center gap-1.5 cursor-pointer text-[#272A27] hover:text-[#272A27]">
                      <input
                        type="checkbox"
                        checked={activeLayers[l.key] !== false}
                        onChange={() => toggleLayer(l.key)}
                        className="rounded bg-[#F5F1E9] border-[#C8BFAF] text-sky-500 focus:ring-0 cursor-pointer"
                      />
                      <span>{l.label}</span>
                    </label>
                  ))}
                </div>

                {/* Basemap Dropdown */}
                <div className="flex items-center gap-1">
                  <span className="text-[#85877E]">Basemap:</span>
                  <select
                    value={basemap}
                    onChange={(e) => setBasemap(e.target.value)}
                    className="bg-[#F5F1E9] text-[#275B59] border border-[#C8BFAF] rounded px-2 py-0.5 font-mono text-[10px]"
                  >
                    <option value="satellite">Satellite RGB</option>
                    <option value="terrain">USGS Terrain</option>
                    <option value="street">OpenStreetMap</option>
                    <option value="dark">Carto Dark GIS</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Dynamic World Land-Cover Breakdown */}
            <div className="lg:col-span-4 panel-surface p-6 sm:p-8 border border-[#C8BFAF] shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#C8BFAF]">
                <h3 className="font-display text-lg font-bold text-[#272A27]">Dynamic World Land-Cover</h3>
                <span className="text-[10px] text-[#85877E]">10m Near-Real-Time</span>
              </div>

              <div className="space-y-3">
                {dynamicWorldClasses.map(c => (
                  <div key={c.name} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#272A27]">{c.name}</span>
                      <strong className="text-[#272A27]">{c.pct}%</strong>
                    </div>
                    <div className="w-full h-2 bg-[#F0EBE2] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB: HISTORICAL SATELLITE TIME MACHINE */}
      {/* ========================================================================= */}
      {radarTab === 'TIME_MACHINE' && (
        <div className="panel-surface p-6 sm:p-8 border border-sky-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-3">
            <div>
              <span className="badge-telemetry text-[10px]">HISTORICAL SATELLITE TIME MACHINE</span>
              <h3 className="font-display text-xl font-bold text-[#272A27] mt-1">
                Multi-Temporal Landscape Evolution ({timeMachineYear} Scene)
              </h3>
            </div>
            <span className="text-xs font-mono text-[#3D8C8A] font-bold">2018 &rarr; 2026 Timeline</span>
          </div>

          {/* Timeline Slider */}
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between text-[#272A27]">
              <span>Select Acquisition Year:</span>
              <strong className="text-[#275B59] text-sm font-bold">{timeMachineYear} COMPOSITE</strong>
            </div>
            <input
              type="range"
              min="2018"
              max="2026"
              value={timeMachineYear}
              onChange={(e) => setTimeMachineYear(parseInt(e.target.value))}
              className="w-full h-2 bg-[#F0EBE2] rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex justify-between text-[10px] text-[#85877E] pt-1">
              <span>2018 (Baseline)</span>
              <span>2020</span>
              <span>2022</span>
              <span>2024</span>
              <span>2026 (Latest Available)</span>
            </div>
          </div>

          {/* Real Leaflet Map showing the selected time machine year */}
          <div className="h-[360px] w-full rounded-2xl overflow-hidden border border-[#C8BFAF]">
            <ReserveSatelliteMap
              mineId={selectedMineId}
              activeBand={selectedBand}
              basemap={basemap}
              timeMachineYear={timeMachineYear}
              activeTargetId={activeTargetId}
              onSelectTarget={(tgt) => setActiveTargetId(tgt.id)}
              explorationTargets={explorationTargets}
              activeLayers={activeLayers}
            />
          </div>

          {/* "What Changed?" AI Automated Anomaly Detector Records */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-[#272A27] uppercase tracking-wider font-mono">
              "WHAT CHANGED?" // AUTOMATED SATELLITE CHANGE-DETECTION INTELLIGENCE
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              {whatChangedRecords.map(r => (
                <div key={r.id} className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <strong className="text-[#272A27]">{r.title}</strong>
                    <span className="px-1.5 py-0.2 rounded bg-sky-950 text-[#275B59] border border-sky-800 font-bold">{r.confidence} CI</span>
                  </div>
                  <div className="text-[11px] text-amber-400 font-bold">{r.magnitude}</div>
                  <p className="text-[#5F625C] text-[10.5px] font-sans leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB: PROSPECTIVITY AI */}
      {/* ========================================================================= */}
      {radarTab === 'PROSPECTIVITY_AI' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
          {/* Prospectivity Score Card */}
          <div className="lg:col-span-6 panel-surface p-6 sm:p-8 border border-manganese-500/40 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#C8BFAF]">
              <h3 className="font-display text-xl font-bold text-[#272A27]">AI Mineral Prospectivity Score</h3>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                HIGH PROBABILITY
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] text-center space-y-2">
              <div className="text-5xl font-display font-extrabold text-emerald-400">
                {geology.prospectivityScore}%
              </div>
              <div className="text-xs text-[#272A27] font-bold">Continuous Mineral Potential Index (0-100)</div>
              <p className="text-[11px] text-[#5F625C] max-w-md mx-auto font-sans">
                Trained on Geological Survey of India (GSI) borehole core samples &amp; Sentinel-2 SWIR 0.412 absorption spectrum.
              </p>
            </div>
          </div>

          {/* Feature Contribution Breakdown */}
          <div className="lg:col-span-6 panel-surface p-6 sm:p-8 border border-[#C8BFAF] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#C8BFAF]">
              <h3 className="font-display text-xl font-bold text-[#272A27]">Multi-Input Feature Importance</h3>
              <span className="text-[10px] text-[#85877E]">RandomForest Weights</span>
            </div>

            <div className="space-y-3">
              {featureContribution.map(f => (
                <div key={f.name} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#272A27]">{f.name}</span>
                    <strong className="text-[#272A27]">{f.pct}%</strong>
                  </div>
                  <div className="w-full h-2 bg-[#F0EBE2] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${f.pct}%`, backgroundColor: f.fill }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB: EXPLORATION TARGET GENERATOR */}
      {/* ========================================================================= */}
      {radarTab === 'EXPLORATION_TARGETS' && (
        <div className="panel-surface p-6 sm:p-8 border border-sky-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-3">
            <div>
              <span className="badge-radar text-[10px]">AI EXPLORATION TARGET SCANNER</span>
              <h3 className="font-display text-xl font-bold text-[#272A27] mt-1">
                Candidate Drilling Targets ({currentMine.name} Strike Zone)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCompareTargetsOpen(!isCompareTargetsOpen)}
                className="px-3 py-2 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] text-[#272A27] hover:text-[#272A27] font-mono text-xs font-bold transition-all"
              >
                {isCompareTargetsOpen ? 'HIDE COMPARISON' : 'COMPARE TARGETS'}
              </button>
              <button
                onClick={async () => {
                  setIsScanningTargets(true);
                  try {
                    await explorationApi.runScan(selectedMineId);
                  } catch (e) {
                    console.debug('Exploration scan note:', e);
                  }
                  setTimeout(() => setIsScanningTargets(false), 1000);
                }}
                className="px-4 py-2 rounded-xl bg-manganese-500 text-obsidian-950 font-bold flex items-center gap-2 hover:bg-manganese-400 transition-all shadow font-mono text-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isScanningTargets ? 'RUNNING SATELLITE PROSPECTIVITY SCAN...' : 'RUN AI EXPLORATION SCAN'}</span>
              </button>
            </div>
          </div>

          {/* Real Leaflet Map focusing on candidate exploration targets */}
          <div className="h-[360px] w-full rounded-2xl overflow-hidden border border-[#C8BFAF]">
            <ReserveSatelliteMap
              mineId={selectedMineId}
              activeBand={selectedBand}
              basemap={basemap}
              timeMachineYear={timeMachineYear}
              activeTargetId={activeTargetId}
              onSelectTarget={(tgt) => setActiveTargetId(tgt.id)}
              explorationTargets={explorationTargets}
              activeLayers={activeLayers}
            />
          </div>

          {/* Target Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {explorationTargets.map(t => (
              <div
                key={t.id}
                onClick={() => setActiveTargetId(t.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                  activeTarget.id === t.id
                    ? 'bg-[#F0EBE2] border-2 border-[#C46A32] text-[#272A27] shadow-xl'
                    : 'bg-[#F0EBE2] border-[#C8BFAF] text-[#5F625C] hover:border-zinc-700'
                }`}
              >
                <div className="flex justify-between items-center pb-2 border-b border-obsidian-850">
                  <strong className="text-[#272A27] text-sm">{t.name}</strong>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                    {t.prospectivity}% Score
                  </span>
                </div>
                <div className="flex justify-between text-[#5F625C]">
                  <span>Estimated Grade:</span>
                  <strong className="text-manganese-400">{t.gradeEst}</strong>
                </div>
                <div className="flex justify-between text-[#5F625C]">
                  <span>Depth Horizon:</span>
                  <strong className="text-[#272A27]">{t.depthRange}</strong>
                </div>
                <div className="text-[11px] text-[#272A27] pt-1 font-sans">
                  <strong>Satellite Evidence:</strong> {t.satelliteEvidence}
                </div>
                <div className="text-[11px] text-emerald-400 font-sans">
                  <strong>Drilling Support:</strong> {t.drillingEvidence}
                </div>
                <div className="pt-2 border-t border-obsidian-850 text-[10.5px] text-amber-300 font-sans">
                  <strong>Recommended Action:</strong> {t.recommendation}
                </div>
              </div>
            ))}
          </div>

          {/* Multi-Target Comparison Modal/Table */}
          {isCompareTargetsOpen && (
            <div className="p-6 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-obsidian-850">
                <h4 className="font-bold text-[#272A27] text-sm">Target-to-Target Comparative Decision Matrix</h4>
                <span className="text-[10px] text-[#85877E]">3 Candidate Prospects Identified</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0f172a] text-[#5F625C] border-b border-[#C8BFAF] uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Target ID</th>
                      <th className="py-2.5 px-3">Prospectivity</th>
                      <th className="py-2.5 px-3">Est Grade</th>
                      <th className="py-2.5 px-3">Depth</th>
                      <th className="py-2.5 px-3">Area</th>
                      <th className="py-2.5 px-3">Confidence</th>
                      <th className="py-2.5 px-3">Exploration Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-obsidian-800 text-[#272A27]">
                    {explorationTargets.map(tgt => (
                      <tr key={tgt.id} className="hover:bg-[#C8BFAF]/50">
                        <td className="py-2.5 px-3 font-bold text-[#272A27]">{tgt.id}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">{tgt.prospectivity}%</td>
                        <td className="py-2.5 px-3 text-manganese-400 font-bold">{tgt.gradeEst}</td>
                        <td className="py-2.5 px-3">{tgt.depthRange}</td>
                        <td className="py-2.5 px-3">{tgt.areaHa}</td>
                        <td className="py-2.5 px-3 text-[#3D8C8A] font-bold">{tgt.confidence}</td>
                        <td className="py-2.5 px-3 font-bold text-amber-300">{tgt.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. TAB: RESERVE EVOLUTION WATERFALL */}
      {/* ========================================================================= */}
      {radarTab === 'RESERVE_EVOLUTION' && (
        <div className="panel-surface p-6 sm:p-8 border border-[#C8BFAF] shadow-2xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-[#C8BFAF]">
            <div>
              <span className="badge-manganese text-[10px]">RESERVE EVOLUTION WATERFALL</span>
              <h3 className="font-display text-xl font-bold text-[#272A27] mt-1">
                Initial Resource vs Depletion &amp; AI-Projected Additions
              </h3>
            </div>
            <span className="text-xs font-mono text-[#5F625C]">Million Tonnes (MT)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {reserveEvolutionData.map(step => (
              <div key={step.step} className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-2">
                <span className="text-[10px] text-[#85877E] uppercase font-bold">{step.step}</span>
                <div className="text-2xl font-bold text-[#272A27]" style={{ color: step.fill }}>
                  {step.value > 0 ? `+${step.value.toFixed(1)}` : step.value.toFixed(1)} MT
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. TAB: CONFIDENCE MAP */}
      {/* ========================================================================= */}
      {radarTab === 'CONFIDENCE_MAP' && (
        <div className="panel-surface p-6 sm:p-8 border border-emerald-500/40 shadow-2xl space-y-6 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-3">
            <div>
              <span className="badge-telemetry text-[10px]">SPATIAL UNCERTAINTY &amp; CONFIDENCE ANALYSIS</span>
              <h3 className="font-display text-xl font-bold text-[#272A27] mt-1">
                Mine Block Resource Confidence Grid ({currentMine.name})
              </h3>
            </div>
            <span className="text-xs text-emerald-400 font-bold">24 Spatial Blocks Assessed</span>
          </div>

          {/* Interactive Controls Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF]">
            <div className="space-y-1.5">
              <span className="text-[#85877E] uppercase text-[10px]">Confidence Dimension:</span>
              <select
                value={confidenceDimension}
                onChange={(e) => setConfidenceDimension(e.target.value)}
                className="w-full bg-[#F5F1E9] text-[#272A27] border border-[#C8BFAF] rounded-lg p-2 text-xs"
              >
                <option value="COMPOSITE">Composite Confidence</option>
                <option value="GEOLOGICAL">Geological Structure Confidence</option>
                <option value="GRADE">Assayed Grade Confidence</option>
                <option value="RESERVE">UNFC Reserve Confidence</option>
                <option value="SATELLITE">Sentinel SWIR Satellite Support</option>
                <option value="EXPLORATION">Drilling Exploration Confidence</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <span className="text-[#85877E] uppercase text-[10px]">Borehole Data Density:</span>
              <div className="flex items-center gap-1">
                {['LOW', 'MEDIUM', 'HIGH'].map(d => (
                  <button
                    key={d}
                    onClick={() => setDataDensity(d)}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-bold ${
                      dataDensity === d ? 'bg-emerald-500 text-obsidian-950' : 'bg-[#F5F1E9] text-[#5F625C] border border-[#C8BFAF]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[#85877E] uppercase text-[10px]">Model Prediction Stance:</span>
              <div className="flex items-center gap-1">
                {['CONSERVATIVE', 'BALANCED', 'AGGRESSIVE'].map(m => (
                  <button
                    key={m}
                    onClick={() => setModelStance(m)}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-bold ${
                      modelStance === m ? 'bg-manganese-500 text-obsidian-950' : 'bg-[#F5F1E9] text-[#5F625C] border border-[#C8BFAF]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Spatial Grid & Block Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 24-Cell Spatial Grid */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#5F625C] text-xs font-bold">Spatial Extraction Horizon Matrix (4 Rows × 6 Cols)</span>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> High (≥85%)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> Medium (70-84%)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500" /> Low (&lt;70%)</span>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-2.5">
                {confidenceGridBlocks.map(block => (
                  <div
                    key={block.id}
                    onClick={() => setSelectedBlockId(block.id)}
                    className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                      activeBlock.id === block.id
                        ? 'border-white scale-105 shadow-xl bg-[#17263f]'
                        : block.level === 'HIGH'
                        ? 'bg-emerald-950/40 border-emerald-500/40 hover:border-emerald-400'
                        : block.level === 'MEDIUM'
                        ? 'bg-amber-950/40 border-amber-500/40 hover:border-amber-400'
                        : 'bg-rose-950/40 border-rose-500/40 hover:border-rose-400'
                    }`}
                  >
                    <div className="font-bold text-[#272A27] text-[11px]">{block.id}</div>
                    <div className={`text-xs font-extrabold mt-1 ${
                      block.level === 'HIGH' ? 'text-emerald-400' : block.level === 'MEDIUM' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {block.conf}%
                    </div>
                    <div className="text-[9px] text-[#5F625C] mt-0.5">{block.grade}% Mn</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Block Inspector Drawer */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-obsidian-850">
                <div>
                  <h4 className="font-bold text-[#272A27] text-base">BLOCK {activeBlock.id}</h4>
                  <span className="text-[10px] text-[#85877E]">Resource Confidence Dossier</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  activeBlock.level === 'HIGH' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                  activeBlock.level === 'MEDIUM' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {activeBlock.level} CONFIDENCE
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between pb-1.5 border-b border-obsidian-850">
                  <span className="text-[#5F625C]">Model Confidence:</span>
                  <strong className="text-emerald-400 font-bold">{activeBlock.conf}%</strong>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-obsidian-850">
                  <span className="text-[#5F625C]">Assayed Mn Estimate:</span>
                  <strong className="text-manganese-400 font-bold">{activeBlock.grade}% Mn</strong>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-obsidian-850">
                  <span className="text-[#5F625C]">Uncertainty Bounds:</span>
                  <strong className="text-[#272A27]">±{activeBlock.uncert}%</strong>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-obsidian-850">
                  <span className="text-[#5F625C]">Diamond Borehole Support:</span>
                  <strong className="text-[#3D8C8A] font-bold">{activeBlock.drillHoles} Core Holes</strong>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-obsidian-850">
                  <span className="text-[#5F625C]">Satellite SWIR Support:</span>
                  <strong className="text-[#272A27] font-bold">{activeBlock.satSupport}</strong>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-obsidian-850">
                  <span className="text-[#5F625C]">Sausar Geological Support:</span>
                  <strong className="text-[#272A27] font-bold">{activeBlock.geoSupport}</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] text-[11px] text-[#272A27] font-sans">
                <strong>Recommended Next Action:</strong> Infill diamond drilling probe recommended at -180m horizon to upgrade block to UNFC-111 Proved Reserve.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. TAB: ENVIRONMENTAL MONITOR */}
      {/* ========================================================================= */}
      {radarTab === 'ENVIRONMENTAL_MONITOR' && (
        <div className="panel-surface p-6 sm:p-8 border border-emerald-500/40 shadow-2xl space-y-6 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-3">
            <div>
              <span className="badge-telemetry text-[10px]">EARTH OBSERVATION ENVIRONMENTAL MONITOR</span>
              <h3 className="font-display text-xl font-bold text-[#272A27] mt-1">
                Multi-Temporal Afforestation, Disturbance &amp; Sump Water Tracking ({timeMachineYear})
              </h3>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              STATUTORY COMPLIANCE: {activeEnvScene.risk}
            </span>
          </div>

          {/* Temporal Slider for Environmental Intelligence */}
          <div className="space-y-2 p-4 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF]">
            <div className="flex justify-between text-[#272A27]">
              <span>Inspect Environmental Year:</span>
              <strong className="text-emerald-400 font-bold text-sm">{timeMachineYear} SATELLITE COMPOSITE</strong>
            </div>
            <input
              type="range"
              min="2018"
              max="2026"
              value={timeMachineYear}
              onChange={(e) => setTimeMachineYear(parseInt(e.target.value))}
              className="w-full h-2 bg-[#F5F1E9] rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-[#85877E] pt-1">
              <span>2018 (Baseline)</span>
              <span>2020</span>
              <span>2022</span>
              <span>2024</span>
              <span>2026 (Latest Scene)</span>
            </div>
          </div>

          {/* Environmental Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-1">
              <span className="text-[10px] text-[#85877E] uppercase">Mine Footprint</span>
              <div className="text-xl font-bold text-[#272A27]">{activeEnvScene.footprint} Ha</div>
              <div className="text-[10px] text-[#5F625C]">Total authorized area</div>
            </div>

            <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-1">
              <span className="text-[10px] text-[#85877E] uppercase">Afforestation Buffer</span>
              <div className="text-xl font-bold text-emerald-400">{activeEnvScene.veg} Ha (NDVI {activeEnvScene.ndvi})</div>
              <div className="text-[10px] text-emerald-400 font-sans">Green belt perimeter stable</div>
            </div>

            <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-1">
              <span className="text-[10px] text-[#85877E] uppercase">Reclaimed Land</span>
              <div className="text-xl font-bold text-[#3D8C8A]">{activeEnvScene.rec} Ha</div>
              <div className="text-[10px] text-[#5F625C]">Waste dump restoration</div>
            </div>

            <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-1">
              <span className="text-[10px] text-[#85877E] uppercase">Sump Moisture NDWI</span>
              <div className="text-xl font-bold text-cyan-400">{activeEnvScene.ndwi} ({activeEnvScene.water} Ha)</div>
              <div className="text-[10px] text-[#5F625C]">Dewatering pumps nominal</div>
            </div>
          </div>

          {/* 2018 -> 2026 Cumulative Environmental Evolution Breakdown */}
          <div className="p-6 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-3 font-mono text-xs">
            <h4 className="font-bold text-[#272A27] text-sm">Cumulative 8-Year Environmental Evolution (2018 &rarr; 2026)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
                <span className="text-[#5F625C] text-[10px] uppercase">1. Disturbed Footprint Expansion</span>
                <div className="text-base font-bold text-[#272A27] mt-1">+18.2 Ha (+11.2% within lease)</div>
                <p className="text-[10.5px] text-[#5F625C] font-sans mt-0.5">Bench deepening &amp; crusher pad expansion.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
                <span className="text-[#5F625C] text-[10px] uppercase">2. Afforestation &amp; Reclamation</span>
                <div className="text-base font-bold text-emerald-400 mt-1">+16.0 Ha Restored (+18.4% NDVI)</div>
                <p className="text-[10.5px] text-emerald-400 font-sans mt-0.5">Perimeter green belt plantation compliance.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
                <span className="text-[#5F625C] text-[10px] uppercase">3. Sump Hydrology Control</span>
                <div className="text-base font-bold text-[#3D8C8A] mt-1">+2.6 Ha Water Managed (450kW Active)</div>
                <p className="text-[10.5px] text-[#5F625C] font-sans mt-0.5">Zero discharge overflow into natural drainage.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. TAB: NATIONAL RADAR (7-Mode Multi-Variate Intelligence Engine) */}
      {/* ========================================================================= */}
      {radarTab === 'NATIONAL_RADAR' && (
        <div className="space-y-6 font-mono text-xs">

          {/* Header Strip & 7 Mode Selector */}
          <div className="panel-surface p-6 sm:p-8 border border-[#C8BFAF] shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-3">
              <div>
                <span className="badge-manganese text-[10px]">NATIONAL RESERVE INTELLIGENCE COMMAND</span>
                <h3 className="font-display text-xl font-bold text-[#272A27] mt-1">
                  10-Mine National Strategy Engine // Mode: <strong style={{ color: activeModeConfig.color }}>{activeModeConfig.label.toUpperCase()}</strong>
                </h3>
                <p className="text-[#5F625C] text-xs font-sans mt-0.5">{activeModeConfig.description}</p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] text-[#272A27] font-bold">
                10 CANONICAL ASSETS (MP &amp; MH)
              </span>
            </div>

            {/* 7 Mode Switcher Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] no-scrollbar">
              {Object.keys(NATIONAL_RADAR_MODES).map(key => {
                const cfg = NATIONAL_RADAR_MODES[key];
                const isActive = nationalRadarView === key;
                return (
                  <button
                    key={key}
                    onClick={() => setNationalRadarView(key)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all whitespace-nowrap ${
                      isActive
                        ? 'text-obsidian-950 shadow-lg scale-105'
                        : 'text-[#5F625C] hover:text-[#272A27] hover:bg-[#F5F1E9]'
                    }`}
                    style={{ backgroundColor: isActive ? cfg.color : 'transparent' }}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>

            {/* National AI Insight Banner */}
            <div className="p-4 rounded-xl bg-[#0c1524] border border-sky-500/40 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#3D8C8A] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[10px] text-[#3D8C8A] font-bold uppercase tracking-wider">NATIONAL AI STRATEGIC INSIGHT</span>
                <p className="text-[#272A27] text-xs font-sans leading-relaxed">{nationalInsight}</p>
              </div>
            </div>

            {/* "Why Did The Ranking Change?" Model Driver Weights Box */}
            <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-2">
              <div className="flex justify-between items-center text-[10px] text-[#5F625C] uppercase font-bold">
                <span>RANKING DRIVER WEIGHTS // {activeModeConfig.label.toUpperCase()}</span>
                <span>Sum = 100% Deterministic Model</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                {activeModeConfig.driverWeights.map(d => (
                  <div key={d.name} className="p-2.5 rounded-lg bg-[#F5F1E9] border border-[#C8BFAF] flex justify-between items-center">
                    <span className="text-[#272A27] text-[10.5px] truncate">{d.name}</span>
                    <strong className="text-[#272A27] text-[11px] ml-2" style={{ color: activeModeConfig.color }}>{d.pct}%</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Mode-Specific Ranked Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0f172a] text-[#5F625C] border-b border-[#C8BFAF] uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Mine Asset</th>
                    <th className="py-3 px-4">State</th>
                    <th className="py-3 px-4">{nationalAnalysis[0]?.metricPrimaryLabel || 'Primary Metric'}</th>
                    <th className="py-3 px-4">{nationalAnalysis[0]?.metricSecondaryLabel || 'Secondary Metric'}</th>
                    <th className="py-3 px-4">{nationalAnalysis[0]?.metricTertiaryLabel || 'Tertiary Metric'}</th>
                    <th className="py-3 px-4">{nationalAnalysis[0]?.metricQuaternaryLabel || 'Status / Driver'}</th>
                    <th className="py-3 px-4">Mode Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-obsidian-800 text-[#272A27]">
                  {nationalAnalysis.map((m) => (
                    <tr
                      key={m.id}
                      onClick={() => {
                        setSelectedMineId(m.id);
                        setInspectedMineId(m.id);
                      }}
                      className={`hover:bg-[#C8BFAF]/50 cursor-pointer transition-colors ${inspectedMineId === m.id ? 'bg-[#15233b]/70 text-[#272A27] font-bold' : ''}`}
                    >
                      <td className="py-3 px-4 font-bold text-[#272A27]">
                        <span className="px-2 py-0.5 rounded bg-[#F5F1E9] border border-[#C8BFAF] text-[10px]">
                          #{m.rank}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#272A27] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeModeConfig.color }} />
                        <span>{m.name}</span>
                      </td>
                      <td className="py-3 px-4 text-[#5F625C]">{m.state}</td>
                      <td className="py-3 px-4 font-bold text-[#272A27]">{m.metricPrimary}</td>
                      <td className="py-3 px-4 text-[#272A27]">{m.metricSecondary}</td>
                      <td className="py-3 px-4 text-[#272A27]">{m.metricTertiary}</td>
                      <td className="py-3 px-4 text-[#5F625C] text-[11px]">{m.metricQuaternary}</td>
                      <td className="py-3 px-4 font-bold text-base" style={{ color: activeModeConfig.color }}>
                        {m.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* "WHY DID THIS MINE RANK HERE?" Deep Explainability Dossier Drawer (Part 2 Requirement) */}
          <div className="panel-surface p-6 sm:p-8 border border-sky-500/40 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#C8BFAF] gap-2">
              <div>
                <span className="text-[10px] text-[#3D8C8A] font-bold uppercase tracking-wider">EXPLAINABLE AI INTELLIGENCE DOSSIER</span>
                <h3 className="font-display text-xl font-bold text-[#272A27] mt-0.5">
                  Why is {inspectedMine.name} Ranked in {activeModeConfig.label}?
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#F0EBE2] border border-[#C8BFAF] text-[#5F625C] text-xs">
                Selected Asset: <strong className="text-[#272A27]">{inspectedMine.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-2">
                <span className="text-[#85877E] uppercase text-[10px] font-bold">1. Ore &amp; Reserve Base</span>
                <div className="text-[#272A27] font-bold">{inspectedMine.oreGrade} • {inspectedMine.unfcStatus || 'UNFC-111 Proved'}</div>
                <p className="text-[#5F625C] text-[11px] font-sans">
                  Deep Braunite strike continuity plunging 70° South into Sausar Group bedrock with high metallurgical grade.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-2">
                <span className="text-[#85877E] uppercase text-[10px] font-bold">2. Operational &amp; Fleet Status</span>
                <div className="text-[#272A27] font-bold">Target: {inspectedMine.productionTarget} TPD • {inspectedMine.fleetCount} Komatsu Units</div>
                <p className="text-[#5F625C] text-[11px] font-sans">
                  Crusher line running at {inspectedMine.crusherHealthBase || 92}% baseline health with active telemetry nodes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-2">
                <span className="text-[#85877E] uppercase text-[10px] font-bold">3. Recommended Action</span>
                <div className="text-emerald-400 font-bold">Strategic Resource Intervention</div>
                <p className="text-[#272A27] text-[11px] font-sans">
                  Prioritize diamond core infill drilling and maintain predictive lube monitoring on primary crushers.
                </p>
              </div>
            </div>
          </div>

          {/* NATIONAL AI STRATEGIC ADVISOR: TOP 5 ACTIONS (Part 13 Requirement) */}
          <div className="panel-surface p-6 sm:p-8 border border-manganese-500/40 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#C8BFAF]">
              <div>
                <span className="badge-radar text-[10px]">NATIONAL AI STRATEGIC ADVISOR</span>
                <h3 className="font-display text-xl font-bold text-[#272A27] mt-0.5">
                  Top 5 Priority Interventions Across MOIL Portfolio
                </h3>
              </div>
              <span className="text-xs text-manganese-400 font-bold">Portfolio Optimization</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {top5Actions.map(act => (
                <div key={act.priority} className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-manganese-950 text-manganese-300 border border-manganese-800 font-bold">
                      {act.priority}
                    </span>
                    <strong className="text-[#272A27]">{act.mine}</strong>
                  </div>
                  <div className="text-[#272A27] font-bold text-[11.5px]">{act.problem}</div>
                  <div className="text-[#5F625C] text-[10.5px] font-sans">
                    <strong>Evidence:</strong> {act.evidence}
                  </div>
                  <div className="text-emerald-400 text-[10.5px] font-sans">
                    <strong>Impact:</strong> {act.impact}
                  </div>
                  <div className="pt-1.5 border-t border-obsidian-850 text-amber-300 text-[10.5px] font-sans">
                    <strong>Action:</strong> {act.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-Mine Correlation Engine */}
          <div className="panel-surface p-6 sm:p-8 border border-[#C8BFAF] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#C8BFAF]">
              <h3 className="font-display text-lg font-bold text-[#272A27]">National Cross-Mine Correlation Engine</h3>
              <span className="text-[10px] text-[#85877E]">Pearson Coefficient (r)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {nationalCorrelations.map(c => (
                <div key={c.pair} className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <strong className="text-[#272A27]">{c.pair}</strong>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">{c.r}</span>
                  </div>
                  <p className="text-[#5F625C] text-[10.5px] font-sans leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* National What-If Capital Allocation Simulator */}
          <div className="panel-surface p-6 sm:p-8 border border-manganese-500/40 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-3">
              <div>
                <span className="badge-manganese text-[10px]">NATIONAL CAPITAL ALLOCATION SIMULATOR</span>
                <h3 className="font-display text-xl font-bold text-[#272A27] mt-1">
                  What If MOIL Invests ₹{nationalInvestCr} Crore Capital?
                </h3>
              </div>
              <span className="text-xs text-manganese-400 font-bold">10-Mine Portfolio ROI Projection</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[#272A27]">
                <span>Select Capital Deployment:</span>
                <strong className="text-manganese-400 font-bold text-base">₹{nationalInvestCr} Crore Budget</strong>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="25"
                value={nationalInvestCr}
                onChange={(e) => setNationalInvestCr(parseInt(e.target.value))}
                className="w-full h-2 bg-[#F0EBE2] rounded-lg appearance-none cursor-pointer accent-manganese-500"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-1">
                <span className="text-[10px] text-[#85877E] uppercase">Reserve Conversion</span>
                <div className="text-lg font-bold text-[#3D8C8A]">+{nationalWhatIf.reserveConversionMT} MT</div>
                <div className="text-[10px] text-[#5F625C]">UNFC-333 to UNFC-111</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-1">
                <span className="text-[10px] text-[#85877E] uppercase">Production Capacity</span>
                <div className="text-lg font-bold text-emerald-400">+{nationalWhatIf.productionIncreaseTPD} TPD</div>
                <div className="text-[10px] text-[#5F625C]">Crusher &amp; Shovel throughput</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-1">
                <span className="text-[10px] text-[#85877E] uppercase">Fleet Availability</span>
                <div className="text-lg font-bold text-amber-400">+{nationalWhatIf.fleetAvailabilityGainPct}% Gain</div>
                <div className="text-[10px] text-[#5F625C]">Komatsu RUL extension</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-1">
                <span className="text-[10px] text-[#85877E] uppercase">Greenbelt Restored</span>
                <div className="text-lg font-bold text-lime-400">+{nationalWhatIf.environmentalReclamationHa} Ha</div>
                <div className="text-[10px] text-[#5F625C]">Afforestation compliance</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-1">
                <span className="text-[10px] text-[#85877E] uppercase">Risk Reduction</span>
                <div className="text-lg font-bold text-rose-400">-{nationalWhatIf.riskReductionPct}% Risk</div>
                <div className="text-[10px] text-[#5F625C]">Downtime &amp; failure drops</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. TAB: VIRTUAL CORE DRILL PROBE */}
      {/* ========================================================================= */}
      {radarTab === 'VIRTUAL_DRILL' && (
        <div className="panel-surface p-6 sm:p-8 border border-[#C8BFAF] shadow-2xl space-y-6 font-mono text-xs">
          <div className="flex justify-between items-center pb-4 border-b border-[#C8BFAF]">
            <div>
              <span className="badge-telemetry text-[10px]">VIRTUAL CORE DRILL PROBE</span>
              <h3 className="font-display text-xl font-bold text-[#272A27] mt-1">
                Depth-Dependent Stratigraphy &amp; Assayed Grade Curve
              </h3>
            </div>
            <span className="text-xs text-manganese-400 font-bold">{drillDepth}m Current Depth</span>
          </div>

          <div className="space-y-3">
            <label className="text-[#272A27] flex justify-between">
              <span>Adjust Probe Drilling Depth:</span>
              <strong className="text-manganese-400 text-sm font-bold">-{drillDepth} m Horizon</strong>
            </label>
            <input
              type="range"
              min="20"
              max="350"
              value={drillDepth}
              onChange={(e) => setDrillDepth(parseInt(e.target.value))}
              className="w-full h-2 bg-[#F0EBE2] rounded-lg appearance-none cursor-pointer accent-manganese-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF]">
              <span className="text-[10px] text-[#85877E] uppercase">Stratum Formation</span>
              <div className="text-base font-bold text-[#272A27] mt-1">{geology.stratumLayer}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF]">
              <span className="text-[10px] text-[#85877E] uppercase">Assayed Grade</span>
              <div className="text-base font-bold text-manganese-400 mt-1">{geology.mnGrade}% Mn</div>
            </div>
            <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF]">
              <span className="text-[10px] text-[#85877E] uppercase">SiO₂ Content</span>
              <div className="text-base font-bold text-[#272A27] mt-1">{geology.silicaPct}%</div>
            </div>
            <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF]">
              <span className="text-[10px] text-[#85877E] uppercase">Confidence</span>
              <div className="text-base font-bold text-emerald-400 mt-1">{geology.confidencePct}%</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
