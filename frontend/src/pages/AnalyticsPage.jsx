import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { MOIL_MINE_REGISTRY, OFFICIAL_MOIL_MINES, getMineAnalytics } from '../services/mineRegistry.js';
import { ErrorBoundary } from '../components/common/ErrorBoundary.jsx';
import { AetherSectionHeader, AetherStatusBadge } from '../components/design-system/index.js';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  BarChart3,
  Layers,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Award,
  CheckCircle2,
  PieChart,
  Sparkles,
  SlidersHorizontal,
  Activity,
  Cpu,
  Droplet,
  Compass,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  Scale,
  Zap,
  Radio,
  RotateCcw,
  Gauge,
  Clock,
  AlertTriangle,
  FileText,
  Globe2,
  Calendar,
  Search,
  Filter,
  Truck,
  Wrench,
  Thermometer,
  CloudRain,
  DollarSign,
  Briefcase,
  BrainCircuit,
  HelpCircle,
  Workflow,
  FileCheck
} from 'lucide-react';

export const AnalyticsPage = () => {
  return (
    <ErrorBoundary title="MINING INTELLIGENCE ANALYTICS CENTER">
      <AnalyticsPageContent />
    </ErrorBoundary>
  );
};

const AnalyticsPageContent = () => {
  const {
    activeMine,
    selectedMineId,
    setSelectedMineId,
    activeScenario,
    resetBaseline,
    officialMines,
    setIsDecisionModalOpen,
    t
  } = useApp();

  const mineList = Array.isArray(officialMines) && officialMines.length > 0 ? officialMines : OFFICIAL_MOIL_MINES;
  const currentMine = activeMine || MOIL_MINE_REGISTRY.balaghat;

  // Active Dynamic Analytics Profile derived purely from currentMine and activeScenario
  const analytics = useMemo(() => {
    return getMineAnalytics(
      selectedMineId || currentMine.id,
      activeScenario ? { scenarioId: activeScenario.scenarioId, severity: activeScenario.severity } : null
    );
  }, [selectedMineId, currentMine, activeScenario]);

  // Date Range Filter State (7D, 30D, 90D, 6M, 1Y)
  const [dateRange, setDateRange] = useState('30D');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'BRAIN', 'WHATIF', 'CAUSE_EFFECT', 'PRODUCTION', 'SHIFT', 'BOTTLENECK', 'DOWNTIME', 'EQUIPMENT', 'TELEMETRY', 'RISK', 'SCENARIO', 'EO', 'BENCHMARK'
  const [selectedMachineId, setSelectedMachineId] = useState(null);

  // What-If Simulator Interactive State (Part 5 Requirement)
  const [whatIfCrusherThrottle, setWhatIfCrusherThrottle] = useState(20);
  const [whatIfMonsoonRainfall, setWhatIfMonsoonRainfall] = useState(55);
  const [whatIfHaulDelay, setWhatIfHaulDelay] = useState(12);

  // Blending Simulator State
  const [blendPartnerId, setBlendPartnerId] = useState('tirodi');
  const [blendRatio, setBlendRatio] = useState(60);

  const blendPartner = useMemo(() => {
    if (blendPartnerId === selectedMineId) {
      const fallbackId = Object.keys(MOIL_MINE_REGISTRY).find(id => id !== selectedMineId) || 'dongri-buzurg';
      return MOIL_MINE_REGISTRY[fallbackId] || MOIL_MINE_REGISTRY.tirodi;
    }
    return MOIL_MINE_REGISTRY[blendPartnerId] || MOIL_MINE_REGISTRY.tirodi;
  }, [blendPartnerId, selectedMineId]);

  const activeRatioFraction = (blendRatio || 60) / 100;
  const partnerRatioFraction = (100 - (blendRatio || 60)) / 100;
  const currentGradeNum = typeof currentMine.baseGradeNum === 'number' ? currentMine.baseGradeNum : 44.2;
  const currentSilicaPct = typeof currentMine.silicaBasePct === 'number' ? currentMine.silicaBasePct : 12.4;
  const currentPhosphorusPct = typeof currentMine.phosphorusBasePct === 'number' ? currentMine.phosphorusBasePct : 0.08;

  const partnerGradeNum = typeof blendPartner?.baseGradeNum === 'number' ? blendPartner.baseGradeNum : 39.4;
  const partnerSilicaPct = typeof blendPartner?.silicaBasePct === 'number' ? blendPartner.silicaBasePct : 16.2;
  const partnerPhosphorusPct = typeof blendPartner?.phosphorusBasePct === 'number' ? blendPartner.phosphorusBasePct : 0.11;

  const blendedMnGrade = Math.round((currentGradeNum * activeRatioFraction + partnerGradeNum * partnerRatioFraction) * 10) / 10;
  const blendedSilica = Math.round((currentSilicaPct * activeRatioFraction + partnerSilicaPct * partnerRatioFraction) * 10) / 10;
  const blendedP = Math.round((currentPhosphorusPct * activeRatioFraction + partnerPhosphorusPct * partnerRatioFraction) * 1000) / 1000;

  const totalBlendedTPD = typeof currentMine.productionTarget === 'number' ? currentMine.productionTarget : 6200;
  const blendedValueCr = ((totalBlendedTPD * (blendedMnGrade / 40.0) * 14200) / 10000000).toFixed(2);

  // Composite Production History + 14-Day Forecast Time-Series Chart Data
  const chartData = useMemo(() => {
    const hist = analytics?.productionHistory || [];
    const fc = analytics?.forecast || [];

    const historyPoints = hist.map((p) => ({
      label: p.date,
      type: 'HISTORICAL',
      target: p.target,
      actual: p.actual,
      efficiency: p.efficiency,
      aiForecast: null,
      lowerBound: null,
      upperBound: null
    }));

    const forecastPoints = fc.map((f) => ({
      label: f.day,
      type: 'FORECAST',
      target: currentMine.productionTarget,
      actual: null,
      efficiency: null,
      aiForecast: f.aiForecast,
      lowerBound: f.lowerBound,
      upperBound: f.upperBound
    }));

    const sliceCount = dateRange === '7D' ? 5 : dateRange === '30D' ? 10 : dateRange === '90D' ? 15 : 20;
    return [...historyPoints.slice(-sliceCount), ...forecastPoints];
  }, [analytics, currentMine, dateRange]);

  // Production Loss Waterfall Data
  const waterfallData = useMemo(() => {
    const target = currentMine.productionTarget;
    const weatherLoss = Math.round(target * (currentMine.rainfallSensitivity > 1.3 ? 0.08 : 0.04));
    const equipLoss = Math.round(target * 0.06);
    const crusherLoss = Math.round(target * 0.05);
    const haulLoss = Math.round(target * 0.03);
    const opLoss = Math.round(target * 0.02);
    const actual = target - (weatherLoss + equipLoss + crusherLoss + haulLoss + opLoss);

    return [
      { step: '1. Target Quota', value: target, fill: '#64748b' },
      { step: '2. Weather Inflow', value: -weatherLoss, fill: '#ef4444' },
      { step: '3. Equipment RUL', value: -equipLoss, fill: '#f97316' },
      { step: '4. Crusher Throttle', value: -crusherLoss, fill: '#f59e0b' },
      { step: '5. Haulage Congestion', value: -haulLoss, fill: '#eab308' },
      { step: '6. Shift Operational Pacing', value: -opLoss, fill: '#38bdf8' },
      { step: '7. Net Output Forecast', value: actual, fill: '#10b981' }
    ];
  }, [currentMine]);

  // Mine Digital Brain Multi-Horizon Timeline (Part 4 Requirement)
  const brainHorizons = useMemo(() => {
    return [
      { horizon: 'NEXT 6 HOURS', event: 'Shift B Transition & Gyratory Crusher Maintenance Window', impact: 'Nominal output (+2.1% buffer)', confidence: '98.2%' },
      { horizon: 'NEXT 24 HOURS', event: 'Rainfall anomaly threshold forecast at 48mm in Balaghat basin', impact: 'Pit sump pumping load increase to 420 m³/h', confidence: '94.6%' },
      { horizon: 'NEXT 7 DAYS', event: 'Deep stope -240m drilling campaign & blast hole charging', impact: 'High-grade Braunite yield projected at 44.8% Mn', confidence: '91.0%' },
      { horizon: 'NEXT 30 DAYS', event: 'Statutory DGMS MMR-1961 quarterly geotechnical audit', impact: 'Zero compliance deviations forecasted', confidence: '89.5%' }
    ];
  }, []);

  // What-If Simulation Results Calculator (Part 5 Requirement)
  const whatIfResults = useMemo(() => {
    const baseTarget = currentMine.productionTarget;
    const crusherLoss = Math.round(baseTarget * (whatIfCrusherThrottle / 100) * 0.45);
    const rainLoss = Math.round(baseTarget * (whatIfMonsoonRainfall / 100) * 0.35);
    const haulLoss = Math.round(baseTarget * (whatIfHaulDelay / 60) * 0.20);
    const totalLost = crusherLoss + rainLoss + haulLoss;
    const projectedYield = Math.max(0, baseTarget - totalLost);
    const revImpactCr = ((totalLost * 14200) / 10000000).toFixed(2);
    const recoveryHours = Math.round((totalLost / baseTarget) * 48);

    return {
      totalLost,
      projectedYield,
      revImpactCr,
      recoveryHours,
      stockpileBuildT: Math.round(crusherLoss * 1.8),
      fleetUtilImpactPct: Math.round((totalLost / baseTarget) * 100)
    };
  }, [currentMine, whatIfCrusherThrottle, whatIfMonsoonRainfall, whatIfHaulDelay]);

  // Cause -> Effect -> Action Engine Workflows (Part 6 Requirement)
  const causeEffectWorkflows = useMemo(() => {
    return [
      {
        id: 'WF-01',
        title: 'Primary Crusher Drive Bearing Anomaly',
        obs: 'Crusher vibration RMS elevated to 6.8 mm/s with 2X harmonic peak at 248 Hz.',
        cause: 'Drive end spherical roller bearing inner race spalling and lubrication shear.',
        opImpact: 'Crusher sizing throughput throttled from 280 TPH to 180 TPH.',
        prodImpact: 'Estimated daily shortfall of 680 Tonnes.',
        finImpact: '₹96.5 Lakhs revenue at risk.',
        action: 'Schedule 2-hour planned bearing grease flush & adjust eccentric bushing clearance.',
        benefit: 'Prevents catastrophic shaft seizure, recovers 620 Tonnes yield.'
      },
      {
        id: 'WF-02',
        title: 'Heavy Monsoon Basin Inundation Flow',
        obs: 'Catchment precipitation at 65 mm/hr with sump inflow surging to 720 m³/h.',
        cause: 'Monsoon run-off exceeding primary surface drainage ditch capacity.',
        opImpact: 'Haul Ramp 02 traction coefficient reduced to 0.42; speed throttled.',
        prodImpact: 'Haul cycle delay +14 mins/trip; 840 Tonnes at risk.',
        finImpact: '₹1.19 Cr revenue at risk.',
        action: 'Activate secondary 450kW standby submersible pump battery and grade drainage ditches.',
        benefit: 'Restores haul ramp cycle time in 4.5 hours; eliminates flooding.'
      }
    ];
  }, []);

  // Shift Intelligence Data
  const shiftData = useMemo(() => {
    const baseTonnage = Math.round(currentMine.productionTarget / 3);
    return [
      { shift: 'Shift A (06:00 - 14:00)', target: baseTonnage, actual: Math.round(baseTonnage * 1.04), tph: Math.round(baseTonnage / 7.5), util: '88.4%', downtime: '24 mins', eff: '104%', status: 'OPTIMAL' },
      { shift: 'Shift B (14:00 - 22:00)', target: baseTonnage, actual: Math.round(baseTonnage * 0.96), tph: Math.round(baseTonnage / 8.2), util: '82.1%', downtime: '48 mins', eff: '96%', status: 'NORMAL' },
      { shift: 'Shift C (22:00 - 06:00)', target: baseTonnage, actual: Math.round(baseTonnage * 0.91), tph: Math.round(baseTonnage / 8.8), util: '78.5%', downtime: '65 mins', eff: '91%', status: 'ATTENTION' }
    ];
  }, [currentMine]);

  // Bottleneck Analysis Data
  const bottleneckData = useMemo(() => {
    return [
      { stage: '1. Face Excavation', load: '78%', status: 'NOMINAL', limitFactor: 'Blasting cycle delay (14 mins)', action: 'Stagger bench blast timing' },
      { stage: '2. HEMM Loading', load: '84%', status: 'NOMINAL', limitFactor: 'Shovel repositioning', action: 'Optimize double-side spotting' },
      { stage: '3. Haulage Cycle', load: '91%', status: 'MODERATE', limitFactor: 'Ramp grade rolling resistance', action: 'Motor grader road maintenance' },
      { stage: '4. Crusher Sizing', load: '96%', status: activeScenario?.scenarioId === 'CRUSHER' ? 'CRITICAL' : 'HIGH', limitFactor: 'Primary jaw hopper bridging', action: 'Activate hydraulic rock-breaker' },
      { stage: '5. Mine Dewatering', load: '42%', status: 'NOMINAL', limitFactor: 'Sump basin storage volume', action: 'Maintain standby 450kW pump' }
    ];
  }, [activeScenario]);

  // Downtime Intelligence Breakdown
  const downtimeData = useMemo(() => {
    return [
      { category: 'Mechanical Breakdown', hours: 4.2, pct: 28, costLakhs: '₹14.2' },
      { category: 'Crusher Maintenance', hours: 3.5, pct: 23, costLakhs: '₹11.8' },
      { category: 'Electrical & Power Outage', hours: 2.1, pct: 14, costLakhs: '₹7.1' },
      { category: 'Haul Road Maintenance', hours: 1.8, pct: 12, costLakhs: '₹6.1' },
      { category: 'Weather / Monsoon Rain', hours: 2.4, pct: 16, costLakhs: '₹8.2' },
      { category: 'DGMS Safety Pre-shift Check', hours: 1.0, pct: 7, costLakhs: '₹3.4' }
    ];
  }, []);

  // Cost Intelligence Breakdown
  const costData = useMemo(() => {
    return {
      costPerTonne: '₹4,820 / Tonne',
      fuelCost: '₹1,240 / Tonne (25.7%)',
      maintenanceCost: '₹860 / Tonne (17.8%)',
      powerExplosives: '₹740 / Tonne (15.4%)',
      downtimeLossCost: '₹420 / Tonne (8.7%)',
      laborOverhead: '₹1,560 / Tonne (32.4%)',
      netMarginPerTonne: '₹9,380 / Tonne (66.0% Margin at ₹14,200/T)'
    };
  }, []);

  // Machine List for the Equipment Tab
  const pfx = (selectedMineId || 'balaghat').slice(0, 3).toUpperCase();
  const machineList = useMemo(() => {
    return [
      { id: `EX-${pfx}-01`, name: `${pfx} Primary Mining Excavator`, type: 'EXCAVATOR', health: 94, temp: '76°C', vib: '1.4 mm/s', oil: '4.5 bar', hours: '4,820 hrs', rul: '2,840 hrs', failProb: 6.2, priority: 'LOW' },
      { id: `TRK-${pfx}-01`, name: `${pfx} Heavy Haul Dumper #01`, type: 'TRUCK', health: 88, temp: '82°C', vib: '2.1 mm/s', oil: '4.2 bar', hours: '6,140 hrs', rul: '1,420 hrs', failProb: 14.8, priority: 'MEDIUM' },
      { id: `CRU-${pfx}-01`, name: `${pfx} Gyratory Sizing Crusher`, type: 'CRUSHER', health: activeScenario?.scenarioId === 'CRUSHER' ? 42 : 89, temp: activeScenario?.scenarioId === 'CRUSHER' ? '98°C' : '64°C', vib: activeScenario?.scenarioId === 'CRUSHER' ? '6.8 mm/s' : '2.2 mm/s', oil: '3.8 bar', hours: '8,920 hrs', rul: activeScenario?.scenarioId === 'CRUSHER' ? '48 hrs' : '1,120 hrs', failProb: activeScenario?.scenarioId === 'CRUSHER' ? 78.4 : 12.0, priority: activeScenario?.scenarioId === 'CRUSHER' ? 'CRITICAL' : 'MEDIUM' },
      { id: `PMP-${pfx}-01`, name: `${pfx} Deep Pit Dewatering Pump`, type: 'PUMP', health: 96, temp: '62°C', vib: '1.1 mm/s', oil: '5.1 bar', hours: '3,450 hrs', rul: '3,800 hrs', failProb: 3.5, priority: 'LOW' },
      { id: `DRL-${pfx}-01`, name: `${pfx} Blast Hole Rotary Drill`, type: 'DRILL', health: 91, temp: '71°C', vib: '1.8 mm/s', oil: '4.4 bar', hours: '5,210 hrs', rul: '2,150 hrs', failProb: 8.9, priority: 'LOW' }
    ];
  }, [pfx, activeScenario]);

  const activeMachine = machineList.find(m => m.id === selectedMachineId) || machineList[0];

  // Telemetry FFT Spectrum Data
  const fftData = useMemo(() => {
    const baseFreq = activeMachine.type === 'CRUSHER' ? 124 : activeMachine.type === 'PUMP' ? 50 : 85;
    const isCritical = activeMachine.priority === 'CRITICAL';

    return [
      { freq: '10 Hz', amp: 0.2, harmonic: 'Sub-synchronous' },
      { freq: '25 Hz', amp: 0.4, harmonic: 'Shaft 1/2X' },
      { freq: `${baseFreq} Hz`, amp: isCritical ? 6.8 : 1.6, harmonic: '1X Fundamental Peak' },
      { freq: `${baseFreq * 2} Hz`, amp: isCritical ? 4.2 : 0.8, harmonic: '2X Bearing Inner Race' },
      { freq: `${baseFreq * 3} Hz`, amp: isCritical ? 3.1 : 0.5, harmonic: '3X Gear Mesh' },
      { freq: '500 Hz', amp: isCritical ? 2.4 : 0.3, harmonic: 'Blade Pass' },
      { freq: '1000 Hz', amp: isCritical ? 1.8 : 0.2, harmonic: 'High Freq Resonance' }
    ];
  }, [activeMachine]);

  // Risk Matrix Domains
  const riskDomains = useMemo(() => {
    const isMonsoon = activeScenario?.scenarioId === 'MONSOON';
    const isCrusher = activeScenario?.scenarioId === 'CRUSHER';

    return [
      { id: 'EQUIPMENT', name: 'Equipment Failure Risk', prob: isCrusher ? 78 : 24, impact: 4, score: isCrusher ? 312 : 96, trend: isCrusher ? '+54%' : '-2%', level: isCrusher ? 'CRITICAL' : 'LOW', factors: 'Primary crusher drive bearing thermal dissipation & harmonic vibration spike.' },
      { id: 'WEATHER', name: 'Monsoon Inundation Risk', prob: isMonsoon ? 84 : 32, impact: 5, score: isMonsoon ? 420 : 160, trend: isMonsoon ? '+68%' : '+4%', level: isMonsoon ? 'CRITICAL' : 'MEDIUM', factors: 'Catchment precipitation exceeding pit sump dewatering capacity threshold.' },
      { id: 'GEOLOGICAL', name: 'Strata & Rockfall Risk', prob: 18, impact: 4, score: 72, trend: '0%', level: 'LOW', factors: 'Hanging wall quartzite joint dilation within statutory DGMS safe limits.' },
      { id: 'WATER', name: 'Groundwater Ingress Risk', prob: 28, impact: 3, score: 84, trend: '+3%', level: 'MEDIUM', factors: 'Water table horizon at -185m level maintaining steady piezometer head.' },
      { id: 'PRODUCTION', name: 'Quota Shortfall Risk', prob: (isMonsoon || isCrusher) ? 76 : 14, impact: 4, score: (isMonsoon || isCrusher) ? 304 : 56, trend: (isMonsoon || isCrusher) ? '+45%' : '-5%', level: (isMonsoon || isCrusher) ? 'CRITICAL' : 'LOW', factors: 'Shift extraction pacing vs allocated daily target tonnage.' },
      { id: 'ENVIRONMENTAL', name: 'Perimeter Buffer Compliance', prob: 12, impact: 2, score: 24, trend: '-1%', level: 'LOW', factors: 'Sentinel-2 NDVI vegetation health index compliance at 0.38.' }
    ];
  }, [activeScenario]);

  // Scenario Comparison Data
  const scenarioComparisonData = useMemo(() => {
    const baseTarget = currentMine.productionTarget;
    return [
      { scenario: 'BASELINE RESET', yield: baseTarget, loss: 0, recoveryHrs: 0, avail: currentMine.fleetAvailabilityBase, revLossCr: '₹0.00' },
      { scenario: 'HEAVY MONSOON', yield: Math.round(baseTarget * 0.78), loss: Math.round(baseTarget * 0.22), recoveryHrs: 36, avail: currentMine.fleetAvailabilityBase - 15, revLossCr: (baseTarget * 0.22 * 14200 / 10000000).toFixed(2) },
      { scenario: 'CRUSHER SEIZURE', yield: Math.round(baseTarget * 0.82), loss: Math.round(baseTarget * 0.18), recoveryHrs: 24, avail: currentMine.fleetAvailabilityBase - 12, revLossCr: (baseTarget * 0.18 * 14200 / 10000000).toFixed(2) },
      { scenario: 'MULTI-RISK CRISIS', yield: Math.round(baseTarget * 0.61), loss: Math.round(baseTarget * 0.39), recoveryHrs: 72, avail: currentMine.fleetAvailabilityBase - 28, revLossCr: (baseTarget * 0.39 * 14200 / 10000000).toFixed(2) }
    ];
  }, [currentMine]);

  const isScenarioActive = !!activeScenario;

  return (
    <div className="space-y-6 font-sans text-[#272A27]">

      {/* 1. Header & Asset Selector Strip (Theme: AI Intelligence, Accent: Indigo Violet #655C9F) */}
      <AetherSectionHeader
        title={`${currentMine.name} — Predictive Shift & Bottleneck Analytics`}
        subtitle="Multi-dimensional operations intelligence, loss attribution waterfalls, shift analytics, bottleneck diagnosis, vibration FFT harmonics, and risk matrices."
        badge={`${currentMine.district?.toUpperCase()} • ${currentMine.state?.toUpperCase()}`}
        accent="#655C9F"
        icon={BarChart3}
        actions={
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-lg p-1 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] no-scrollbar">
            {mineList.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMineId(m.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedMineId === m.id
                    ? 'bg-[#655C9F] text-white shadow-xs'
                    : 'text-[#5F625C] hover:text-[#272A27] hover:bg-[#E8E1D5]'
                }`}
              >
                {m.shortName || m.name}
              </button>
            ))}
          </div>
        }
      />

      {/* 2. EXECUTIVE AI-GENERATED OPERATIONAL INSIGHTS BANNER */}
      <div className="p-4 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm space-y-2.5 font-mono text-xs text-[#272A27]">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#DDD4C5] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#655C9F]" />
            <span className="font-bold text-[#655C9F] uppercase tracking-wider">
              AI GENERATED OPERATIONAL INSIGHTS // LIVE SCADA &amp; REMOTE SENSING
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#655C9F]/15 text-[#423A6D] border border-[#655C9F]/40 text-[10px] font-bold">
            CONFIDENCE: 96.4%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          <div className="p-2.5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#71856B] mt-1 flex-shrink-0" />
            <span>Production pacing at <strong className="text-[#4A5845]">{analytics.production?.achievementPct || 100}%</strong> of nominal {currentMine.productionTarget.toLocaleString()} TPD quota.</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B88A3B] mt-1 flex-shrink-0" />
            <span>Primary Crusher line health at <strong className="text-[#7C571F]">{analytics.equipment?.machineHealthIndex || `${currentMine.crusherHealthBase}%`}</strong>. Bearing vibration at {currentMine.telemetry.bearingVibrationMmS}.</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3D8C8A] mt-1 flex-shrink-0" />
            <span>Sentinel-2 SWIR band reflects high <strong className="text-[#275B59]">{currentMine.baseGradeNum}% Mn</strong> mineral signature across {currentMine.leaseAreaHa} Ha footprint.</span>
          </div>
        </div>
      </div>

      {/* 3. DATE RANGE & ANALYTICS MODULE TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-[#F5F1E9] border border-[#C8BFAF] font-mono text-xs">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: 'All Modules' },
            { id: 'BRAIN', label: 'Mine Digital Brain' },
            { id: 'WHATIF', label: 'What-If Simulator' },
            { id: 'CAUSE_EFFECT', label: 'Cause → Effect → Action' },
            { id: 'PRODUCTION', label: 'Production Intelligence' },
            { id: 'SHIFT', label: 'Shift Analytics' },
            { id: 'BOTTLENECK', label: 'Bottleneck Engine' },
            { id: 'DOWNTIME', label: 'Downtime & Cost' },
            { id: 'EQUIPMENT', label: 'Equipment & RUL' },
            { id: 'TELEMETRY', label: 'Telemetry FFT' },
            { id: 'RISK', label: 'Risk Matrix' },
            { id: 'SCENARIO', label: 'Scenario Lab' },
            { id: 'EO', label: 'Earth Observation' },
            { id: 'BENCHMARK', label: 'Cross-Mine Benchmark' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#1a2b47] text-sky-300 border border-sky-500/50 shadow'
                  : 'text-[#5F625C] hover:text-white hover:bg-[#C8BFAF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center p-1 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF]">
          {['7D', '30D', '90D', '6M', '1Y'].map(r => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                dateRange === r
                  ? 'bg-manganese-500 text-obsidian-950 shadow'
                  : 'text-[#5F625C] hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3B. TAB: MINE DIGITAL BRAIN (Part 4 Requirement) */}
      {/* ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'BRAIN') && (
        <div className="panel-surface p-6 sm:p-8 border border-sky-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-950 border border-sky-500/40 text-sky-400">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
                  MINE DIGITAL BRAIN // REAL-TIME FUSION OF SCADA, SATELLITE &amp; ML
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  Current Mine State &amp; "What Will Happen Next?" Predictive Trajectory
                </h3>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-xs font-bold">
              OVERALL MINE HEALTH: 94.8 / 100
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF]">
              <span className="text-[#85877E] uppercase text-[10px]">Production Health</span>
              <div className="text-base font-bold text-emerald-400 mt-1">98.2% (Nominal)</div>
            </div>
            <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF]">
              <span className="text-[#85877E] uppercase text-[10px]">Equipment Fleet</span>
              <div className="text-base font-bold text-sky-400 mt-1">{currentMine.fleetAvailabilityBase}% Avail</div>
            </div>
            <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF]">
              <span className="text-[#85877E] uppercase text-[10px]">Geological Quality</span>
              <div className="text-base font-bold text-amber-400 mt-1">{currentMine.oreGrade} High Grade</div>
            </div>
            <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF]">
              <span className="text-[#85877E] uppercase text-[10px]">Satellite Compliance</span>
              <div className="text-base font-bold text-cyan-400 mt-1">0.38 NDVI (Buffer OK)</div>
            </div>
          </div>

          {/* "What Will Happen Next?" Forecast Timeline */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-[#272A27] uppercase tracking-wider font-mono">
              "WHAT WILL HAPPEN NEXT?" // MULTI-HORIZON OPERATIONAL PROJECTION
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
              {brainHorizons.map(h => (
                <div key={h.horizon} className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <strong className="text-sky-400">{h.horizon}</strong>
                    <span className="text-emerald-400 font-bold">{h.confidence} CI</span>
                  </div>
                  <div className="font-bold text-white text-[11px]">{h.event}</div>
                  <p className="text-[#5F625C] text-[10px] font-sans">{h.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3C. TAB: WHAT-IF INTELLIGENCE SIMULATOR (Part 5 Requirement) */}
      {/* ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'WHATIF') && (
        <div className="panel-surface p-6 sm:p-8 border border-amber-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  "WHAT-IF" OPERATIONAL DECISION SIMULATOR
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  Real-Time Multi-Variable Shock &amp; Financial Impact Calculator
                </h3>
              </div>
            </div>
            <span className="text-xs font-mono text-[#5F625C]">{currentMine.name} Stress Matrix</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
            {/* Input Sliders */}
            <div className="lg:col-span-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[#272A27] flex justify-between">
                  <span>What if Crusher Output Falls:</span>
                  <strong className="text-amber-400 font-bold">-{whatIfCrusherThrottle}% Throttle</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={whatIfCrusherThrottle}
                  onChange={(e) => setWhatIfCrusherThrottle(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#F0EBE2] rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[#272A27] flex justify-between">
                  <span>What if Monsoon Rainfall Surges:</span>
                  <strong className="text-sky-400 font-bold">+{whatIfMonsoonRainfall} mm / hr</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="120"
                  value={whatIfMonsoonRainfall}
                  onChange={(e) => setWhatIfMonsoonRainfall(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#F0EBE2] rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[#272A27] flex justify-between">
                  <span>What if Haul Ramp Delay Increases:</span>
                  <strong className="text-rose-400 font-bold">+{whatIfHaulDelay} mins / trip</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="45"
                  value={whatIfHaulDelay}
                  onChange={(e) => setWhatIfHaulDelay(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#F0EBE2] rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>
            </div>

            {/* Simulation Dynamic Output */}
            <div className="lg:col-span-6 p-5 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-3 flex flex-col justify-between">
              <div className="flex justify-between items-center pb-2 border-b border-obsidian-850">
                <span className="text-[#5F625C]">Projected Daily Yield:</span>
                <strong className="text-lg font-bold text-white">{whatIfResults.projectedYield.toLocaleString()} T <span className="text-xs text-rose-400">(-{whatIfResults.totalLost} T)</span></strong>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-obsidian-850">
                <span className="text-[#5F625C]">Estimated Value at Risk:</span>
                <strong className="text-base font-bold text-rose-400">₹{whatIfResults.revImpactCr} Cr</strong>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-obsidian-850">
                <span className="text-[#5F625C]">ROM Stockpile Accumulation:</span>
                <strong className="text-base font-bold text-amber-400">+{whatIfResults.stockpileBuildT} Tonnes</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#5F625C]">Expected Recovery Time:</span>
                <strong className="text-base font-bold text-emerald-400">{whatIfResults.recoveryHours} Hours</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3D. TAB: CAUSE -> EFFECT -> ACTION ENGINE (Part 6 Requirement) */}
      {/* ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'CAUSE_EFFECT') && (
        <div className="panel-surface p-6 sm:p-8 border border-sky-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-950 border border-sky-500/40 text-sky-400">
                <Workflow className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
                  CAUSE &rarr; EFFECT &rarr; ACTION INTELLIGENCE ENGINE
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  Root-Cause Diagnostic Tree &amp; DGMS Verified Corrective Interventions
                </h3>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">2 Active Workflows</span>
          </div>

          <div className="space-y-4">
            {causeEffectWorkflows.map(wf => (
              <div key={wf.id} className="p-5 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-obsidian-850">
                  <strong className="text-white text-sm">{wf.title}</strong>
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">{wf.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
                    <span className="text-[#85877E] uppercase text-[9px]">1. SCADA Observation</span>
                    <p className="text-[#272A27] text-[11px] mt-1">{wf.obs}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
                    <span className="text-[#85877E] uppercase text-[9px]">2. Probable Root Cause</span>
                    <p className="text-amber-400 text-[11px] mt-1">{wf.cause}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
                    <span className="text-[#85877E] uppercase text-[9px]">3. Operational Impact</span>
                    <p className="text-sky-300 text-[11px] mt-1">{wf.opImpact}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
                    <span className="text-[#85877E] uppercase text-[9px]">4. Production &amp; Value at Risk</span>
                    <p className="text-rose-400 text-[11px] mt-1">{wf.prodImpact} ({wf.finImpact})</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] lg:col-span-2">
                    <span className="text-[#85877E] uppercase text-[9px]">5. Recommended Intervention &amp; Benefit</span>
                    <p className="text-emerald-400 text-[11px] font-sans font-bold mt-1">{wf.action} &rarr; {wf.benefit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SIX EXECUTIVE KPI SUMMARY TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-xs">
        <div className="panel-surface p-5 border border-[#C8BFAF] space-y-2">
          <div className="flex items-center justify-between text-[#85877E] text-[10px] uppercase font-bold">
            <span>Daily Output</span>
            <Activity className="w-3.5 h-3.5 text-manganese-400" />
          </div>
          <div className="text-2xl font-display font-bold text-white">
            {analytics.production?.actualProduction?.toLocaleString() || currentMine.baselineProduction.toLocaleString()} T
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#5F625C]">Target:</span>
            <strong className="text-[#272A27]">{currentMine.productionTarget.toLocaleString()} T</strong>
          </div>
        </div>

        <div className="panel-surface p-5 border border-[#C8BFAF] space-y-2">
          <div className="flex items-center justify-between text-[#85877E] text-[10px] uppercase font-bold">
            <span>Achievement</span>
            <TrendingUp className="w-3.5 h-3.5 text-telemetry-400" />
          </div>
          <div className={`text-2xl font-display font-bold ${(analytics.production?.achievementPct || 100) >= 95 ? 'text-telemetry-400' : 'text-hazard-400'}`}>
            {analytics.production?.achievementPct || 100}%
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#5F625C]">Trend:</span>
            <strong className="text-[#272A27]">{analytics.production?.trend7Day || '+2.4% MoM'}</strong>
          </div>
        </div>

        <div className="panel-surface p-5 border border-[#C8BFAF] space-y-2">
          <div className="flex items-center justify-between text-[#85877E] text-[10px] uppercase font-bold">
            <span>Mn Grade</span>
            <Layers className="w-3.5 h-3.5 text-manganese-400" />
          </div>
          <div className="text-2xl font-display font-bold text-manganese-400">
            {currentMine.baseGradeNum}%
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#5F625C]">SiO₂:</span>
            <strong className="text-[#272A27]">{currentMine.silicaBasePct}% ({currentMine.phosphorusBasePct}% P)</strong>
          </div>
        </div>

        <div className="panel-surface p-5 border border-[#C8BFAF] space-y-2">
          <div className="flex items-center justify-between text-[#85877E] text-[10px] uppercase font-bold">
            <span>Recovery Rate</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-telemetry-400" />
          </div>
          <div className="text-2xl font-display font-bold text-telemetry-300">
            {analytics.production?.recoveryRate || `${currentMine.recoveryRatePct}%`}
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#5F625C]">Status:</span>
            <strong className="text-emerald-400">DGMS Calibrated</strong>
          </div>
        </div>

        <div className="panel-surface p-5 border border-[#C8BFAF] space-y-2">
          <div className="flex items-center justify-between text-[#85877E] text-[10px] uppercase font-bold">
            <span>Fleet Health</span>
            <Cpu className="w-3.5 h-3.5 text-manganese-400" />
          </div>
          <div className="text-2xl font-display font-bold text-manganese-300">
            {analytics.equipment?.fleetAvailability || `${currentMine.fleetAvailabilityBase}%`}
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#5F625C]">Total Fleet:</span>
            <strong className="text-white">{currentMine.fleetCount} HEMM Units</strong>
          </div>
        </div>

        <div className="panel-surface p-5 border border-[#C8BFAF] space-y-2">
          <div className="flex items-center justify-between text-[#85877E] text-[10px] uppercase font-bold">
            <span>AI Risk Level</span>
            <ShieldCheck className="w-3.5 h-3.5 text-telemetry-400" />
          </div>
          <div className={`text-2xl font-display font-bold ${isScenarioActive ? 'text-hazard-400' : 'text-emerald-400'}`}>
            {isScenarioActive ? 'ELEVATED' : 'NOMINAL'}
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#5F625C]">Shortfall Prob:</span>
            <strong className={isScenarioActive ? 'text-hazard-400' : 'text-emerald-400'}>
              {analytics.production?.shortfallProb || currentMine.shortfallRisk}
            </strong>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. TAB: ALL / PRODUCTION INTELLIGENCE */}
      {/* ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'PRODUCTION') && (
        <div className="space-y-6">
          {/* Production Trajectory Chart */}
          <div className="panel-surface p-6 sm:p-8 border border-[#C8BFAF] shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#C8BFAF] gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge-telemetry font-mono text-[10px]">GBM TIME-SERIES MODEL</span>
                  <span className="text-xs font-mono text-[#5F625C]">Historical Output &amp; 14-Day AI Forecast ({dateRange})</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  Production Trajectory &amp; Forecast Confidence Envelope (95% CI)
                </h3>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-manganese-500" /><span>Actual Output</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-sky-400" /><span>AI Forecast</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-zinc-600" /><span>Target Quota</span></div>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} domain={['dataMin - 500', 'dataMax + 500']} />
                  <Tooltip contentStyle={{ backgroundColor: '#090e17', borderColor: '#1e293b', borderRadius: '12px', fontFamily: 'JetBrains Mono', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="actual" stroke="#f59e0b" strokeWidth={3} fill="url(#actualGrad)" name="Actual Output (T)" />
                  <Area type="monotone" dataKey="aiForecast" stroke="#38bdf8" strokeWidth={3} strokeDasharray="4 4" fill="url(#forecastGrad)" name="AI Forecast (T)" />
                  <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 6" dot={false} name="Daily Target (T)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Production Loss Attribution Waterfall */}
          <div className="panel-surface p-6 sm:p-8 border border-[#C8BFAF] shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#C8BFAF]">
              <div>
                <span className="badge-hazard text-[10px] font-mono">LOSS ATTRIBUTION WATERFALL</span>
                <h3 className="font-display text-xl font-bold text-white mt-1">
                  Target Quota vs Root-Cause Loss Attribution Breakdown
                </h3>
              </div>
              <span className="text-xs font-mono text-[#5F625C]">Target: {currentMine.productionTarget.toLocaleString()} TPD</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="step" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#090e17', borderColor: '#1e293b', borderRadius: '12px', fontFamily: 'JetBrains Mono', fontSize: '12px' }} />
                  <Bar dataKey="value" name="Tonnage Impact (T)">
                    {waterfallData.map((entry, index) => (
                      <cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5B. TAB: SHIFT INTELLIGENCE */}
      {/* ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'SHIFT') && (
        <div className="panel-surface p-6 sm:p-8 border border-[#C8BFAF] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-3">
            <div>
              <span className="badge-telemetry text-[10px] font-mono">SHIFT INTELLIGENCE // 3-SHIFT ROTATION</span>
              <h3 className="font-display text-xl font-bold text-white mt-1">
                Shift-Wise Tonnage, Machine Utilization &amp; Downtime Profile
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">Best Shift: Shift A (+4.2%)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {shiftData.map((sh, idx) => (
              <div key={sh.shift} className="p-5 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-obsidian-850">
                  <strong className="text-white text-sm">{sh.shift}</strong>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sh.status === 'OPTIMAL' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                    {sh.eff}
                  </span>
                </div>
                <div className="flex justify-between text-[#5F625C]">
                  <span>Actual Output:</span>
                  <strong className="text-white">{sh.actual.toLocaleString()} T <span className="text-[10px] text-[#85877E]">(Target: {sh.target} T)</span></strong>
                </div>
                <div className="flex justify-between text-[#5F625C]">
                  <span>Extraction Rate:</span>
                  <strong className="text-sky-400">{sh.tph} Tonnes / Hour</strong>
                </div>
                <div className="flex justify-between text-[#5F625C]">
                  <span>Fleet Utilization:</span>
                  <strong className="text-emerald-400">{sh.util}</strong>
                </div>
                <div className="flex justify-between text-[#5F625C]">
                  <span>Logged Downtime:</span>
                  <strong className="text-amber-400">{sh.downtime}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5C. TAB: BOTTLENECK ANALYSIS */}
      {/* ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'BOTTLENECK') && (
        <div className="panel-surface p-6 sm:p-8 border border-amber-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-3">
            <div>
              <span className="badge-hazard text-[10px] font-mono">AUTOMATED BOTTLENECK ENGINE</span>
              <h3 className="font-display text-xl font-bold text-white mt-1">
                Extraction Flow Throttle &amp; Recommended Operational Actions
              </h3>
            </div>
            <span className="text-xs font-mono text-[#5F625C]">Active Limiting Factor: <strong className="text-amber-400">Crusher Sizing Line</strong></span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#0f172a] text-[#5F625C] border-b border-[#C8BFAF] uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Extraction Stage</th>
                  <th className="py-3 px-4">Capacity Load</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Limiting Root Cause</th>
                  <th className="py-3 px-4">Recommended Intervention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-800 text-[#272A27]">
                {bottleneckData.map(b => (
                  <tr key={b.stage} className="hover:bg-[#C8BFAF]/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{b.stage}</td>
                    <td className="py-3 px-4 font-bold text-sky-400">{b.load}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${b.status === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : b.status === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#5F625C]">{b.limitFactor}</td>
                    <td className="py-3 px-4 text-emerald-400 font-sans font-bold">{b.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5D. TAB: DOWNTIME & COST INTELLIGENCE */}
      {/* ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'DOWNTIME') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
          {/* Downtime Breakdown */}
          <div className="lg:col-span-6 panel-surface p-6 sm:p-8 border border-[#C8BFAF] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#C8BFAF]">
              <h3 className="font-display text-lg font-bold text-white">Downtime Root-Cause Allocation</h3>
              <span className="text-[10px] text-[#5F625C]">Total Downtime: 15.0 hrs / month</span>
            </div>
            <div className="space-y-2.5">
              {downtimeData.map(d => (
                <div key={d.category} className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] flex justify-between items-center">
                  <div>
                    <strong className="text-white">{d.category}</strong>
                    <div className="text-[10px] text-[#85877E]">{d.hours} hrs ({d.pct}% of total)</div>
                  </div>
                  <span className="text-rose-400 font-bold">{d.costLakhs} Loss</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Intelligence */}
          <div className="lg:col-span-6 panel-surface p-6 sm:p-8 border border-emerald-500/40 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#C8BFAF]">
              <h3 className="font-display text-lg font-bold text-white">Extraction Cost &amp; Profit Margin</h3>
              <span className="text-[10px] text-emerald-400 font-bold">₹14,200 / Tonne Realization</span>
            </div>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] flex justify-between items-center">
                <span className="text-[#5F625C]">Total Unit Extraction Cost:</span>
                <strong className="text-xl font-bold text-amber-400">{costData.costPerTonne}</strong>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-[#F0EBE2] border border-obsidian-850">Fuel: <strong className="text-white">{costData.fuelCost}</strong></div>
                <div className="p-2.5 rounded-lg bg-[#F0EBE2] border border-obsidian-850">Maintenance: <strong className="text-white">{costData.maintenanceCost}</strong></div>
                <div className="p-2.5 rounded-lg bg-[#F0EBE2] border border-obsidian-850">Power/Explosives: <strong className="text-white">{costData.powerExplosives}</strong></div>
                <div className="p-2.5 rounded-lg bg-[#F0EBE2] border border-obsidian-850">Downtime Impact: <strong className="text-rose-400">{costData.downtimeLossCost}</strong></div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex justify-between items-center">
                <span className="text-emerald-300">Net Operating Margin:</span>
                <strong className="text-lg font-bold text-emerald-400">{costData.netMarginPerTonne}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB: EQUIPMENT & PREDICTIVE RUL */}
      {/* ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'EQUIPMENT') && (
        <div className="panel-surface p-6 sm:p-8 border border-[#C8BFAF] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-3">
            <div>
              <span className="badge-manganese text-[10px] font-mono">KOMATSU FLEET DIAGNOSTICS</span>
              <h3 className="font-display text-xl font-bold text-white mt-1">
                Machine-Specific Health, Telemetry &amp; Predictive RUL ({currentMine.name})
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">5 Active HEMM Assets</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
            {/* Machine Selector List */}
            <div className="lg:col-span-4 space-y-2">
              <span className="text-[#85877E] uppercase text-[10px]">Select Machine Asset:</span>
              {machineList.map(m => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMachineId(m.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    activeMachine.id === m.id
                      ? 'bg-[#15233b] border-manganese-500 text-white shadow'
                      : 'bg-[#F0EBE2] border-[#C8BFAF] text-[#5F625C] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <strong className="text-white text-xs">{m.name}</strong>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      m.priority === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      m.priority === 'MEDIUM' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {m.priority}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#5F625C] mt-1">
                    <span>Health: <strong className="text-emerald-400">{m.health}%</strong></span>
                    <span>RUL: <strong className="text-white">{m.rul}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Machine Detailed Diagnostic Inspector */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-obsidian-850">
                <div>
                  <h4 className="font-bold text-white text-base">{activeMachine.name}</h4>
                  <span className="text-[10px] text-manganese-400 font-bold">{activeMachine.id} • {activeMachine.hours} Operating Time</span>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#85877E] uppercase">Estimated RUL</div>
                  <div className="text-xl font-bold text-emerald-400">{activeMachine.rul}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
                  <div className="text-[10px] text-[#85877E] uppercase">VIBRATION RMS</div>
                  <div className="text-lg font-bold text-sky-400 mt-1">{activeMachine.vib}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
                  <div className="text-[10px] text-[#85877E] uppercase">TEMPERATURE</div>
                  <div className="text-lg font-bold text-amber-400 mt-1">{activeMachine.temp}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
                  <div className="text-[10px] text-[#85877E] uppercase">HYDRAULIC OIL</div>
                  <div className="text-lg font-bold text-[#272A27] mt-1">{activeMachine.oil}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
                  <div className="text-[10px] text-[#85877E] uppercase">FAILURE PROB</div>
                  <div className="text-lg font-bold text-rose-400 mt-1">{activeMachine.failProb}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB: TELEMETRY FFT & SENSOR CORRELATIONS */}
      {/* ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'TELEMETRY') && (
        <div className="panel-surface p-6 sm:p-8 border border-[#C8BFAF] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-3">
            <div>
              <span className="badge-telemetry text-[10px] font-mono">VIBRATION FFT HARMONIC ANALYSIS</span>
              <h3 className="font-display text-xl font-bold text-white mt-1">
                Fast Fourier Transform (FFT) Spectrum &amp; Sensor Cross-Correlation
              </h3>
            </div>
            <span className="text-xs font-mono text-[#5F625C]">Target Asset: <strong className="text-white">{activeMachine.name}</strong></span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fftData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="freq" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} domain={[0, 8]} />
                <Tooltip contentStyle={{ backgroundColor: '#090e17', borderColor: '#1e293b', borderRadius: '12px', fontFamily: 'JetBrains Mono', fontSize: '12px' }} />
                <Bar dataKey="amp" fill="#38bdf8" name="Vibration Amplitude (mm/s RMS)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs pt-2">
            <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF]">
              <span className="text-[#85877E] uppercase text-[10px]">Vibration &harr; Temp Correlation</span>
              <div className="text-base font-bold text-emerald-400 mt-1">r = +0.88 (Strong Linear)</div>
            </div>
            <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF]">
              <span className="text-[#85877E] uppercase text-[10px]">Vibration &harr; Hydraulic Pressure</span>
              <div className="text-base font-bold text-sky-400 mt-1">r = -0.42 (Moderate Negative)</div>
            </div>
            <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF]">
              <span className="text-[#85877E] uppercase text-[10px]">Harmonic Anomaly Threshold</span>
              <div className="text-base font-bold text-amber-400 mt-1">4.5 mm/s (ISO 10816-3 Standard)</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. TAB: RISK MATRIX & HEATMAP */}
      {/* ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'RISK') && (
        <div className="panel-surface p-6 sm:p-8 border border-[#C8BFAF] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-3">
            <div>
              <span className="badge-hazard text-[10px] font-mono">MINE RISK MATRIX &amp; HEATMAP</span>
              <h3 className="font-display text-xl font-bold text-white mt-1">
                7-Domain Multi-Risk Matrix &amp; Operational Vulnerability Score
              </h3>
            </div>
            <span className="text-xs font-mono text-[#5F625C]">DGMS MMR-1961 Calibrated</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#0f172a] text-[#5F625C] border-b border-[#C8BFAF] uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Risk Domain</th>
                  <th className="py-3 px-4">Probability (%)</th>
                  <th className="py-3 px-4">Impact (1-5)</th>
                  <th className="py-3 px-4">Score (P &times; I)</th>
                  <th className="py-3 px-4">7-Day Trend</th>
                  <th className="py-3 px-4">Threat Level</th>
                  <th className="py-3 px-4">Contributing Factors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-800 text-[#272A27]">
                {riskDomains.map(r => (
                  <tr key={r.id} className="hover:bg-[#C8BFAF]/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{r.name}</td>
                    <td className="py-3 px-4">{r.prob}%</td>
                    <td className="py-3 px-4">{r.impact} / 5</td>
                    <td className="py-3 px-4 font-bold text-amber-400">{r.score}</td>
                    <td className="py-3 px-4 text-[#272A27]">{r.trend}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.level === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        r.level === 'MEDIUM' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {r.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#5F625C] text-[11px] max-w-xs truncate">{r.factors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. TAB: SCENARIO LAB INSIDE ANALYTICS */}
      {/* ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'SCENARIO') && (
        <div className="panel-surface p-6 sm:p-8 border border-[#C8BFAF] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-3">
            <div>
              <span className="badge-telemetry text-[10px] font-mono">SCENARIO LAB ANALYTICS</span>
              <h3 className="font-display text-xl font-bold text-white mt-1">
                4-Scenario Stress Permutation &amp; Revenue Sensitivity Matrix
              </h3>
            </div>
            <span className="text-xs font-mono text-[#5F625C]">{currentMine.name} Stress Model</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            {scenarioComparisonData.map((s, idx) => (
              <div key={s.scenario} className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-2">
                <span className="text-[10px] text-manganese-400 font-bold uppercase">{s.scenario}</span>
                <div className="text-lg font-bold text-white">{s.yield.toLocaleString()} T <span className="text-xs text-[#5F625C]">(-{s.loss} T)</span></div>
                <div className="text-[11px] text-[#5F625C] flex justify-between">
                  <span>Recovery Time:</span>
                  <strong className="text-white">{s.recoveryHrs} Hours</strong>
                </div>
                <div className="text-[11px] text-[#5F625C] flex justify-between">
                  <span>Projected Revenue Loss:</span>
                  <strong className="text-rose-400">{s.revLossCr} Cr</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. TAB: EARTH OBSERVATION SATELLITE ANALYTICS */}
      {/* ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'EO') && (
        <div className="panel-surface p-6 sm:p-8 border border-emerald-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  EARTH OBSERVATION REMOTE SENSING ANALYTICS // SENTINEL-2 &amp; LANDSAT
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  Multi-Temporal Land Disturbance &amp; Spectral Mineral Trajectory
                </h3>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-[#0c182a] border border-sky-800 text-sky-300 font-mono text-xs font-bold">
              26 AUG 2026 SCENE • SATELLITE DEMONSTRATION DATA
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-2">
              <span className="text-[#85877E] uppercase text-[10px]">1. 3-Year Disturbance Trend</span>
              <div className="text-base font-bold text-white">2024: 162.4 Ha &rarr; 2026: {currentMine.leaseAreaHa} Ha</div>
              <p className="text-[11px] text-emerald-400 font-sans">+13.6% active extraction footprint expansion within authorized lease boundary.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-2">
              <span className="text-[#85877E] uppercase text-[10px]">2. Mean NDVI Vegetation Index</span>
              <div className="text-base font-bold text-sky-300">NDVI 0.38 (Stable Buffer)</div>
              <p className="text-[11px] text-[#5F625C] font-sans">Green belt afforestation compliance maintained along perimeter.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-2">
              <span className="text-[#85877E] uppercase text-[10px]">3. NDWI Moisture Anomaly</span>
              <div className="text-base font-bold text-cyan-300">0.22 (Low Moisture Risk)</div>
              <p className="text-[11px] text-[#5F625C] font-sans">Pit sump dewatering pumps operating at nominal 35% load.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-2">
              <span className="text-[#85877E] uppercase text-[10px]">4. SWIR Mineral Signature</span>
              <div className="text-base font-bold text-amber-300">0.412 SWIR Band 11/12 Peak</div>
              <p className="text-[11px] text-amber-400 font-sans">High-grade Braunite manganese spectral absorption confirmed.</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. TAB: CROSS-MINE BENCHMARKING & NATIONAL RANKING */}
      {/* ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'BENCHMARK') && (
        <div className="panel-surface p-6 sm:p-8 border border-[#C8BFAF] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-3">
            <div>
              <span className="badge-manganese text-[10px] font-mono">CROSS-MINE BENCHMARKING &amp; NATIONAL RANKING</span>
              <h3 className="font-display text-xl font-bold text-white mt-1">
                Multi-Asset Operational &amp; Geological Comparison (10 Canonical Mines)
              </h3>
            </div>
            <span className="text-xs font-mono text-[#5F625C]">Sorted by National Quota</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#0f172a] text-[#5F625C] border-b border-[#C8BFAF] uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Mine Asset</th>
                  <th className="py-3 px-4">Type / State</th>
                  <th className="py-3 px-4">Target (TPD)</th>
                  <th className="py-3 px-4">Mn Grade</th>
                  <th className="py-3 px-4">Fleet Health</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Estimated RUL</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Satellite Footprint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-800 text-[#272A27]">
                {mineList.map((m, idx) => (
                  <tr key={m.id} className={`hover:bg-[#C8BFAF]/50 transition-colors ${selectedMineId === m.id ? 'bg-[#15233b]/60 text-white font-bold' : ''}`}>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-manganese-400" />
                      <span>{m.name}</span>
                    </td>
                    <td className="py-3 px-4 text-[#5F625C]">{m.mineType} ({m.state})</td>
                    <td className="py-3 px-4 font-bold text-white">{m.productionTarget?.toLocaleString()} T</td>
                    <td className="py-3 px-4 text-manganese-400 font-bold">{m.oreGrade}</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">{m.crusherHealthBase || 92}%</td>
                    <td className="py-3 px-4 text-sky-400">{m.fleetAvailabilityBase || 88}%</td>
                    <td className="py-3 px-4 text-[#272A27]">48-62 Days</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                        {m.shortfallRisk || 'LOW'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#272A27]">{m.leaseAreaHa} Ha</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 12. DYNAMIC METALLURGICAL BLENDING SOLVER */}
      {(activeTab === 'ALL' || activeTab === 'PRODUCTION') && (
        <div className="panel-surface p-6 sm:p-8 border border-[#C8BFAF] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#C8BFAF] gap-4">
            <div>
              <div className="badge-manganese mb-2 font-mono text-[10px]">
                <Sliders className="w-3.5 h-3.5 text-manganese-400" />
                <span>DYNAMIC METALLURGICAL BLENDING SOLVER</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white">
                Manganese Ore Grade Blending Optimizer
              </h3>
              <p className="text-xs font-mono text-[#5F625C] mt-1 max-w-2xl">
                Simulates linear blending between active feed (<strong className="text-white">{currentMine.name}</strong>) and complementary MOIL mine reserves to satisfy steel plant specifications.
              </p>
            </div>

            <div className="text-left sm:text-right font-mono text-xs">
              <span className="text-[#85877E] uppercase">Target Spec Envelope:</span>
              <div className="text-sm font-bold text-white">&ge;40.0% Mn • &le;14.5% SiO₂ • &le;0.12% P</div>
            </div>
          </div>

          {/* Controls & Results */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-mono text-xs">
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-3">
                <label className="text-[#272A27] flex justify-between">
                  <span>Blend Ratio ({currentMine.shortName || currentMine.name}):</span>
                  <strong className="text-manganese-400 font-bold">{blendRatio}% Primary / {100 - blendRatio}% Partner</strong>
                </label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={blendRatio}
                  onChange={(e) => setBlendRatio(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#F0EBE2] rounded-lg appearance-none cursor-pointer accent-manganese-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[#272A27]">Select Complementary Partner Mine:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {mineList.filter(m => m.id !== currentMine.id).slice(0, 6).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setBlendPartnerId(m.id)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        blendPartnerId === m.id
                          ? 'bg-[#15233b] border-manganese-500 text-white shadow'
                          : 'bg-[#F0EBE2] border-[#C8BFAF] text-[#5F625C] hover:text-[#272A27]'
                      }`}
                    >
                      <div className="font-bold text-[11px] truncate">{m.shortName || m.name}</div>
                      <div className="text-[9px] text-manganese-400">{m.baseGradeNum || 40}% Mn</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Blend Output Metric Card */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-4 flex flex-col justify-between">
              <div className="flex justify-between items-center pb-3 border-b border-obsidian-850">
                <span className="text-[#5F625C]">Blended Manganese Grade:</span>
                <strong className="text-xl font-bold text-manganese-400">{blendedMnGrade}% Mn</strong>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-obsidian-850">
                <span className="text-[#5F625C]">Blended Silica (SiO₂):</span>
                <strong className="text-base font-bold text-[#272A27]">{blendedSilica}%</strong>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-obsidian-850">
                <span className="text-[#5F625C]">Blended Phosphorus (P):</span>
                <strong className="text-base font-bold text-[#272A27]">{blendedP}%</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#5F625C]">Commercial Daily Value:</span>
                <strong className="text-xl font-bold text-telemetry-400">₹{blendedValueCr} Cr / Day</strong>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
