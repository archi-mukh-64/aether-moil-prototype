import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import {
  Truck,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  Fuel,
  Thermometer,
  Gauge,
  Clock,
  Wrench,
  Zap,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Award,
  Layers,
  ArrowUpRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Radio,
  ArrowLeftRight,
  Calendar,
  AlertOctagon,
  Timer
} from 'lucide-react';
import { EquipmentIcon } from '../components/GeospatialTwin/EquipmentIcons.jsx';
import { ErrorBoundary } from '../components/common/ErrorBoundary.jsx';
import { AetherSectionHeader, AetherStatusBadge } from '../components/design-system/index.js';

export const EquipmentPage = () => {
  return (
    <ErrorBoundary title="EQUIPMENT SCADA FLEET RECOVERY">
      <EquipmentContent />
    </ErrorBoundary>
  );
};

const EquipmentContent = () => {
  const { activeMine, activeScenario, isApiLoading, t, lang } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [fleetTab, setFleetTab] = useState('FLEET_ROSTER'); // 'FLEET_ROSTER', 'CYCLE_MONITOR', 'MAINTENANCE_RUL', 'ANALYTICS', 'COMPARISON'

  // Machine Comparison State
  const [compareIdA, setCompareIdA] = useState(null);
  const [compareIdB, setCompareIdB] = useState(null);

  const isUnderground = activeMine.mineType.toLowerCase().includes('underground');
  const scenarioType = activeScenario?.scenarioId || '';

  // Dynamic, Mine-Specific & Scenario-Aware Equipment Fleet Registry
  const equipmentFleet = useMemo(() => {
    const pfx = (activeMine.shortName || 'MIN').slice(0, 3).toUpperCase();

    if (isUnderground) {
      return [
        {
          id: `LHD-${pfx}-01`,
          name: 'Sandvik LH517i Underground Loader',
          oem: 'Sandvik Mining',
          model: 'LH517i High-Capacity',
          category: 'LHD',
          location: `${activeMine.waterTableDepth} Stope 04`,
          health: scenarioType === 'MONSOON' ? 64 : 94,
          status: scenarioType === 'MONSOON' ? 'ALERT' : 'OPTIMAL',
          rulHours: scenarioType === 'MONSOON' ? 840 : 2480,
          failureProb: scenarioType === 'MONSOON' ? 38 : 6,
          rulConfidence: 94,
          engineHours: 4820,
          fuelPct: 78,
          fuelRateLph: 34.2,
          speedKmh: 14.5,
          payloadT: 17.2,
          ratedCapacityT: 17.5,
          cycleCount: 42,
          avgCycleMin: 6.8,
          engineTempC: scenarioType === 'MONSOON' ? 88 : 74,
          hydraulicTempC: 68,
          hydraulicPressureBar: 210,
          oilPressureBar: 4.8,
          coolantTempC: 82,
          vibrationMms: scenarioType === 'MONSOON' ? 3.4 : 1.8,
          utilizationPct: 84.5,
          idleRatioPct: 8.2,
          maintenancePriority: scenarioType === 'MONSOON' ? 'HIGH' : 'LOW',
          prescription: 'Inspect stope dewatering seals and wheel motor ingress protection.',
          strengths: ['High payload factor (98%)', 'Low hydraulic drift', 'Clean oil analysis'],
          penalties: scenarioType === 'MONSOON' ? ['Sump water ingress risk', 'Elevated wheel motor temp'] : ['Minor brake pad wear'],
          recentEvents: [
            { time: '10:14', event: 'Stope 04 ore pass dump completed (17.2T)', type: 'normal' },
            { time: '08:30', event: 'Shift pre-start hydraulic pressure test passed (210 Bar)', type: 'normal' }
          ]
        },
        {
          id: `LHD-${pfx}-02`,
          name: 'Caterpillar R1700G Underground LHD',
          oem: 'Caterpillar',
          model: 'R1700G Smart Underground',
          category: 'LHD',
          location: 'Shaft Horizon Crosscut -210m',
          health: 91,
          status: 'OPTIMAL',
          rulHours: 3120,
          failureProb: 8,
          rulConfidence: 96,
          engineHours: 3450,
          fuelPct: 84,
          fuelRateLph: 31.8,
          speedKmh: 16.0,
          payloadT: 14.0,
          ratedCapacityT: 15.0,
          cycleCount: 48,
          avgCycleMin: 6.2,
          engineTempC: 72,
          hydraulicTempC: 66,
          hydraulicPressureBar: 205,
          oilPressureBar: 5.1,
          coolantTempC: 80,
          vibrationMms: 1.6,
          utilizationPct: 88.2,
          idleRatioPct: 6.4,
          maintenancePriority: 'LOW',
          prescription: 'Perform scheduled 250-hour hydraulic oil filter exchange.',
          strengths: ['Low vibration (1.6 mm/s)', 'Optimal engine temp (72°C)', 'High availability (92%)'],
          penalties: ['Approaching 250-hr scheduled PM'],
          recentEvents: [
            { time: '11:05', event: 'Ore haul to central ore bin completed', type: 'normal' },
            { time: '09:12', event: 'Transmission oil temp stable at 66°C', type: 'normal' }
          ]
        },
        {
          id: `HOIST-${pfx}-01`,
          name: 'Siemens 3.2MW Production Friction Winder',
          oem: 'Siemens Mining',
          model: '3.2MW Dual-Rope Koepe',
          category: 'HOIST',
          location: 'Main Headframe Tower',
          health: 98,
          status: 'OPTIMAL',
          rulHours: 8400,
          failureProb: 2,
          rulConfidence: 98,
          engineHours: 12400,
          fuelPct: 100,
          fuelRateLph: 0,
          speedKmh: 42.0,
          payloadT: 25.0,
          ratedCapacityT: 25.0,
          cycleCount: 140,
          avgCycleMin: 2.8,
          engineTempC: 54,
          hydraulicTempC: 52,
          hydraulicPressureBar: 180,
          oilPressureBar: 6.2,
          coolantTempC: 64,
          vibrationMms: 0.8,
          utilizationPct: 96.4,
          idleRatioPct: 2.1,
          maintenancePriority: 'LOW',
          prescription: 'Brake caliper shoe thickness calibrated to statutory DGMS norms.',
          strengths: ['Near-zero vibration (0.8 mm/s)', '96.4% utilization', 'Statutory brake cert active'],
          penalties: ['None'],
          recentEvents: [
            { time: '11:42', event: 'Full skip hoist cycle completed (25T payload)', type: 'normal' },
            { time: '07:00', event: 'Statutory rope tension & overspeed safety trip test passed', type: 'normal' }
          ]
        },
        {
          id: `PUMP-${pfx}-01`,
          name: 'Kirloskar 450kW Heavy Submersible Sump Pump',
          oem: 'Kirloskar Brothers',
          model: '450kW Multi-Stage High Head',
          category: 'PUMP',
          location: `Bottom Dewatering Sump (${activeMine.waterTableDepth})`,
          health: scenarioType === 'MONSOON' ? 58 : 96,
          status: scenarioType === 'MONSOON' ? 'ALERT' : 'OPTIMAL',
          rulHours: scenarioType === 'MONSOON' ? 420 : 4200,
          failureProb: scenarioType === 'MONSOON' ? 44 : 4,
          rulConfidence: 92,
          engineHours: 6800,
          fuelPct: 100,
          fuelRateLph: 0,
          speedKmh: 0,
          payloadT: 0,
          ratedCapacityT: 0,
          cycleCount: 0,
          avgCycleMin: 0,
          engineTempC: scenarioType === 'MONSOON' ? 84 : 68,
          hydraulicTempC: 60,
          hydraulicPressureBar: 240,
          oilPressureBar: 5.4,
          coolantTempC: 72,
          vibrationMms: scenarioType === 'MONSOON' ? 4.2 : 2.4,
          utilizationPct: 92.0,
          idleRatioPct: 1.5,
          maintenancePriority: scenarioType === 'MONSOON' ? 'CRITICAL' : 'LOW',
          prescription: 'Auxiliary backup impellers tested; discharge rate verified at 380 m³/h.',
          strengths: ['High discharge volume (380 m³/h)', 'Continuous dewatering reliability'],
          penalties: scenarioType === 'MONSOON' ? ['High suction slurry cavitation', 'Vibration peak 4.2 mm/s'] : ['Normal impeller wear'],
          recentEvents: [
            { time: '10:50', event: 'Sump level sensor triggered continuous high-volume discharge', type: 'normal' },
            { time: '08:15', event: 'Motor winding insulation resistance verified at 45 MΩ', type: 'normal' }
          ]
        },
        {
          id: `CRUSH-${pfx}-01`,
          name: 'Metso Outotec C130 Gyratory Jaw Crusher',
          oem: 'Metso Outotec',
          model: 'C130 High-Reduction Sizer',
          category: 'CRUSHER',
          location: 'Surface Sizing Station',
          health: scenarioType === 'CRUSHER' ? 42 : 89,
          status: scenarioType === 'CRUSHER' ? 'CRITICAL' : 'OPTIMAL',
          rulHours: scenarioType === 'CRUSHER' ? 120 : 3800,
          failureProb: scenarioType === 'CRUSHER' ? 78 : 11,
          rulConfidence: 95,
          engineHours: 8900,
          fuelPct: 100,
          fuelRateLph: 0,
          speedKmh: 0,
          payloadT: 220,
          ratedCapacityT: 250,
          cycleCount: 0,
          avgCycleMin: 0,
          engineTempC: scenarioType === 'CRUSHER' ? 98 : 62,
          hydraulicTempC: scenarioType === 'CRUSHER' ? 92 : 58,
          hydraulicPressureBar: scenarioType === 'CRUSHER' ? 140 : 210,
          oilPressureBar: scenarioType === 'CRUSHER' ? 3.2 : 5.8,
          coolantTempC: scenarioType === 'CRUSHER' ? 94 : 68,
          vibrationMms: scenarioType === 'CRUSHER' ? 6.8 : 2.1,
          utilizationPct: scenarioType === 'CRUSHER' ? 42.0 : 86.4,
          idleRatioPct: scenarioType === 'CRUSHER' ? 48.0 : 5.2,
          maintenancePriority: scenarioType === 'CRUSHER' ? 'CRITICAL' : 'MEDIUM',
          prescription: scenarioType === 'CRUSHER'
            ? 'CRITICAL ALERT: Drive bearing harmonic anomaly (42 Hz) - execute immediate bearing grease purge.'
            : 'Bearing temperature and eccentric shaft vibration within nominal ISO 10816 zone.',
          strengths: ['High throughput capability (250 TPH)', 'Uniform manganese product sizing'],
          penalties: scenarioType === 'CRUSHER' ? ['Drive bearing harmonic runaway (42 Hz)', 'Oil pressure drop (3.2 Bar)'] : ['Normal jaw liner wear'],
          recentEvents: [
            { time: '11:10', event: scenarioType === 'CRUSHER' ? 'Harmonic vibration spike 6.8 mm/s detected' : 'Product sizing sample verified: 85% -40mm', type: scenarioType === 'CRUSHER' ? 'alert' : 'normal' },
            { time: '09:00', event: 'Lube oil flow sensor calibration confirmed', type: 'normal' }
          ]
        }
      ];
    } else {
      return [
        {
          id: `EX-${pfx}-01`,
          name: 'Komatsu PC800-8 Heavy Mining Shovel',
          oem: 'Komatsu Mining',
          model: 'PC800-8 Hydraulic Excavator',
          category: 'EXCAVATOR',
          location: 'Bench 04 (+280m MSL)',
          health: 95,
          status: 'OPTIMAL',
          rulHours: 3400,
          failureProb: 5,
          rulConfidence: 97,
          engineHours: 4200,
          fuelPct: 82,
          fuelRateLph: 48.5,
          speedKmh: 2.8,
          payloadT: 38.0,
          ratedCapacityT: 40.0,
          cycleCount: 180,
          avgCycleMin: 1.8,
          engineTempC: 69,
          hydraulicTempC: 65,
          hydraulicPressureBar: 320,
          oilPressureBar: 5.6,
          coolantTempC: 84,
          vibrationMms: 1.4,
          utilizationPct: 89.4,
          idleRatioPct: 5.8,
          maintenancePriority: 'LOW',
          prescription: 'Bucket tooth adapter inspection completed; boom hydraulic seals nominal.',
          strengths: ['Fast swing cycle (1.8 min)', 'Low vibration (1.4 mm/s)', 'High hydraulic pressure (320 Bar)'],
          penalties: ['Normal bucket lip shroud erosion'],
          recentEvents: [
            { time: '11:30', event: 'Loaded CAT 777D (90T payload) in 4 passes', type: 'normal' },
            { time: '09:40', event: 'Automated lubrication system cycle executed', type: 'normal' }
          ]
        },
        {
          id: `TRUCK-${pfx}-01`,
          name: 'Caterpillar 777D Heavy Haul Dumper',
          oem: 'Caterpillar',
          model: '777D 100-Ton Haul Truck',
          category: 'TRUCK',
          location: 'Main East Haul Corridor',
          health: scenarioType === 'MONSOON' ? 71 : 92,
          status: scenarioType === 'MONSOON' ? 'ALERT' : 'OPTIMAL',
          rulHours: scenarioType === 'MONSOON' ? 950 : 2900,
          failureProb: scenarioType === 'MONSOON' ? 28 : 8,
          rulConfidence: 94,
          engineHours: 5800,
          fuelPct: 68,
          fuelRateLph: 54.2,
          speedKmh: scenarioType === 'MONSOON' ? 12.0 : 28.5,
          payloadT: 85.0,
          ratedCapacityT: 90.0,
          cycleCount: 28,
          avgCycleMin: 18.4,
          engineTempC: scenarioType === 'MONSOON' ? 84 : 76,
          hydraulicTempC: 72,
          hydraulicPressureBar: 220,
          oilPressureBar: 5.2,
          coolantTempC: 86,
          vibrationMms: scenarioType === 'MONSOON' ? 3.6 : 2.2,
          utilizationPct: 82.0,
          idleRatioPct: 9.4,
          maintenancePriority: scenarioType === 'MONSOON' ? 'HIGH' : 'LOW',
          prescription: 'Tire pressure monitored at 105 PSI; retarder brake cooling verified.',
          strengths: ['High payload factor (94%)', 'Optimal brake retarder cooling'],
          penalties: scenarioType === 'MONSOON' ? ['Ramp slip & retarder heat buildup', 'Increased fuel burn (+18%)'] : ['Tire tread wear: 65% life remaining'],
          recentEvents: [
            { time: '11:15', event: 'Haul cycle completed to Primary Crusher Pad', type: 'normal' },
            { time: '08:20', event: 'TPMS tire pressure scan verified at 105 PSI', type: 'normal' }
          ]
        },
        {
          id: `TRUCK-${pfx}-02`,
          name: 'Komatsu HD785-7 Off-Highway Truck',
          oem: 'Komatsu',
          model: 'HD785-7 Rigid Dump Truck',
          category: 'TRUCK',
          location: 'South Waste Dump Ramp',
          health: 88,
          status: 'OPTIMAL',
          rulHours: 2400,
          failureProb: 12,
          rulConfidence: 95,
          engineHours: 6400,
          fuelPct: 74,
          fuelRateLph: 52.0,
          speedKmh: 34.0,
          payloadT: 88.0,
          ratedCapacityT: 91.0,
          cycleCount: 32,
          avgCycleMin: 16.8,
          engineTempC: 72,
          hydraulicTempC: 70,
          hydraulicPressureBar: 215,
          oilPressureBar: 5.4,
          coolantTempC: 85,
          vibrationMms: 1.7,
          utilizationPct: 86.5,
          idleRatioPct: 7.2,
          maintenancePriority: 'LOW',
          prescription: 'Suspension strut pressure calibrated; automatic payload metering active.',
          strengths: ['Fast haul speed (34.0 km/h)', 'Low fuel burn per tonne-km', 'Payload accuracy +/- 1.2%'],
          penalties: ['Approaching 500-hr oil drain interval'],
          recentEvents: [
            { time: '11:40', event: 'Waste dump cycle completed at South Ramp', type: 'normal' },
            { time: '09:10', event: 'Hydropneumatic suspension nitrogen pressure nominal', type: 'normal' }
          ]
        },
        {
          id: `DRILL-${pfx}-01`,
          name: 'Sandvik DR412i Rotary Blast Hole Drill',
          oem: 'Sandvik',
          model: 'DR412i Automated Rotary Drill',
          category: 'DRILL',
          location: 'Bench 06 (+320m MSL)',
          health: 93,
          status: 'OPTIMAL',
          rulHours: 3800,
          failureProb: 7,
          rulConfidence: 96,
          engineHours: 3200,
          fuelPct: 86,
          fuelRateLph: 38.0,
          speedKmh: 1.2,
          payloadT: 0,
          ratedCapacityT: 0,
          cycleCount: 64,
          avgCycleMin: 4.5,
          engineTempC: 66,
          hydraulicTempC: 62,
          hydraulicPressureBar: 280,
          oilPressureBar: 5.8,
          coolantTempC: 80,
          vibrationMms: 1.9,
          utilizationPct: 91.2,
          idleRatioPct: 4.6,
          maintenancePriority: 'LOW',
          prescription: 'Rotary drill bit penetration rate optimal at 1.2 m/min.',
          strengths: ['High penetration rate (1.2 m/min)', 'High blast pattern accuracy', 'Low drill pipe vibration'],
          penalties: ['Tungsten carbide bit wear at 30%'],
          recentEvents: [
            { time: '11:20', event: 'Blast hole #42 (12m depth) drilled successfully', type: 'normal' },
            { time: '08:45', event: 'Compressor air flow verified at 1200 CFM', type: 'normal' }
          ]
        },
        {
          id: `CRUSH-${pfx}-01`,
          name: 'In-Pit Jaw Crusher Hopper Station',
          oem: 'Terex Finlay',
          model: 'J-1480 Heavy Jaw Crusher',
          category: 'CRUSHER',
          location: 'Primary Pit Crusher Pad',
          health: scenarioType === 'CRUSHER' ? 44 : 88,
          status: scenarioType === 'CRUSHER' ? 'CRITICAL' : 'OPTIMAL',
          rulHours: scenarioType === 'CRUSHER' ? 140 : 4100,
          failureProb: scenarioType === 'CRUSHER' ? 76 : 12,
          rulConfidence: 95,
          engineHours: 7600,
          fuelPct: 100,
          fuelRateLph: 0,
          speedKmh: 0,
          payloadT: 240,
          ratedCapacityT: 260,
          cycleCount: 0,
          avgCycleMin: 0,
          engineTempC: scenarioType === 'CRUSHER' ? 96 : 64,
          hydraulicTempC: scenarioType === 'CRUSHER' ? 90 : 60,
          hydraulicPressureBar: scenarioType === 'CRUSHER' ? 145 : 215,
          oilPressureBar: scenarioType === 'CRUSHER' ? 3.4 : 5.6,
          coolantTempC: scenarioType === 'CRUSHER' ? 92 : 70,
          vibrationMms: scenarioType === 'CRUSHER' ? 7.2 : 2.0,
          utilizationPct: scenarioType === 'CRUSHER' ? 44.0 : 88.0,
          idleRatioPct: scenarioType === 'CRUSHER' ? 44.0 : 4.8,
          maintenancePriority: scenarioType === 'CRUSHER' ? 'CRITICAL' : 'MEDIUM',
          prescription: scenarioType === 'CRUSHER'
            ? 'CRITICAL ALERT: Drive bearing thermal runaway (96°C) - switch to secondary bypass feeder.'
            : 'Toggle plate alignment calibrated; jaw liner wear profile nominal.',
          strengths: ['High crusher sizing capacity (260 TPH)', 'Integrated grizzly feeder screening'],
          penalties: scenarioType === 'CRUSHER' ? ['Bearing thermal runaway (96°C)', 'Severe eccentric vibration (7.2 mm/s)'] : ['Normal jaw wear'],
          recentEvents: [
            { time: '11:00', event: scenarioType === 'CRUSHER' ? 'Crusher drive motor overloaded (96°C)' : 'Feed rate nominal at 240 TPH', type: scenarioType === 'CRUSHER' ? 'alert' : 'normal' },
            { time: '08:00', event: 'Magnetic separator tramp iron check passed', type: 'normal' }
          ]
        }
      ];
    }
  }, [activeMine, isUnderground, scenarioType]);

  // Dynamic Fleet Ranking Algorithm (Transparent multi-dimensional score)
  const rankedFleet = useMemo(() => {
    return [...equipmentFleet].map(item => {
      // Score = Health*0.35 + Availability*0.20 + Utilization*0.20 + (100 - Vibration*10)*0.15 + (RUL/50)*0.10 - Penalties
      const availScore = item.status === 'OPTIMAL' ? 95 : item.status === 'ALERT' ? 70 : 40;
      const vibScore = Math.max(0, 100 - item.vibrationMms * 12);
      const rulScore = Math.min(100, (item.rulHours / 4000) * 100);
      const penalty = item.status === 'CRITICAL' ? 25 : item.status === 'ALERT' ? 10 : 0;

      const compositeScore = (
        (item.health * 0.35) +
        (availScore * 0.20) +
        (item.utilizationPct * 0.20) +
        (vibScore * 0.15) +
        (rulScore * 0.10) -
        penalty
      ).toFixed(1);

      return {
        ...item,
        fleetScore: parseFloat(compositeScore)
      };
    }).sort((a, b) => b.fleetScore - a.fleetScore);
  }, [equipmentFleet]);

  // Filtered Assets for Roster
  const filteredAssets = useMemo(() => {
    return equipmentFleet.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            a.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'ALL' || a.category === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [equipmentFleet, searchQuery, filterType]);

  const activeAsset = useMemo(() => {
    return equipmentFleet.find(a => a.id === selectedAssetId) || equipmentFleet[0];
  }, [equipmentFleet, selectedAssetId]);

  const compareAssetA = useMemo(() => {
    return equipmentFleet.find(a => a.id === compareIdA) || equipmentFleet[0];
  }, [equipmentFleet, compareIdA]);

  const compareAssetB = useMemo(() => {
    return equipmentFleet.find(a => a.id === compareIdB) || equipmentFleet[1] || equipmentFleet[0];
  }, [equipmentFleet, compareIdB]);

  // Overall Fleet KPI Aggregates
  const fleetKpis = useMemo(() => {
    const total = equipmentFleet.length;
    const optimal = equipmentFleet.filter(a => a.status === 'OPTIMAL').length;
    const alert = equipmentFleet.filter(a => a.status === 'ALERT').length;
    const critical = equipmentFleet.filter(a => a.status === 'CRITICAL').length;
    const avgHealth = Math.round(equipmentFleet.reduce((acc, a) => acc + a.health, 0) / total);
    const avgUtil = (equipmentFleet.reduce((acc, a) => acc + a.utilizationPct, 0) / total).toFixed(1);
    const totalHours = equipmentFleet.reduce((acc, a) => acc + a.engineHours, 0).toLocaleString();
    return { total, optimal, alert, critical, avgHealth, avgUtil, totalHours };
  }, [equipmentFleet]);

  // Fleet Bottleneck Detection
  const bottleneckInfo = useMemo(() => {
    if (scenarioType === 'CRUSHER') {
      return { stage: 'CRUSHER SIZING', severity: 'CRITICAL', delay: '+14.2 min queue', desc: 'Primary crusher drive bearing bottleneck throttling total mine throughput.' };
    }
    if (scenarioType === 'MONSOON') {
      return { stage: 'HAULAGE RAMP', severity: 'HIGH', delay: '+6.8 min haul slip', desc: 'Pit floor slurry and wet ramp conditions reducing dumper speed by 22%.' };
    }
    return { stage: 'BALANCED', severity: 'OPTIMAL', delay: 'Nominal flow', desc: 'Load, haul, dump, and crusher cycles operating in sync without queue delay.' };
  }, [scenarioType]);

  return (
    <div className="space-y-6 font-sans text-[#272A27]">

      {/* 1. TOP HEADER & FLEET TELEMETRY RIBBON (Theme: Heavy Machinery, Accent: Mineral Sage #71856B + Copper #C46A32) */}
      <AetherSectionHeader
        title={`${activeMine.name} — Fleet SCADA & Machine Telemetry`}
        subtitle={`Real-time payload, engine thermodynamics, hydraulic health, and predictive RUL for ${activeMine.name}.`}
        badge={activeMine.mineType?.toUpperCase()}
        accent="#71856B"
        icon={Truck}
        actions={
          <div className="flex items-center p-1 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] text-xs flex-wrap gap-1">
            {[
              { id: 'FLEET_ROSTER', label: t?.fleet?.fleetRoster || 'Fleet Roster' },
              { id: 'CYCLE_MONITOR', label: t?.fleet?.loadHaulCycles || 'Load & Haul Cycles' },
              { id: 'MAINTENANCE_RUL', label: t?.fleet?.predictiveRul || 'Predictive RUL' },
              { id: 'ANALYTICS', label: t?.fleet?.fleetRankings || 'Fleet Rankings' },
              { id: 'COMPARISON', label: 'Machine Comparison' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFleetTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-bold font-mono transition-all cursor-pointer ${
                  fleetTab === tab.id
                    ? 'bg-[#71856B] text-white shadow-xs'
                    : 'text-[#5F625C] hover:text-[#272A27] hover:bg-[#E8E1D5]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        }
      />

      {/* 2. FLEET OVERVIEW AGGREGATE KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm">
          <div className="text-[10px] text-[#5F625C] uppercase font-bold">{t?.fleet?.totalUnits || 'TOTAL FLEET'}</div>
          <div className="text-xl font-bold text-[#272A27] mt-1 flex items-center justify-between">
            <span>{fleetKpis.total} Units</span>
            <Truck className="w-4 h-4 text-[#71856B]" />
          </div>
          <div className="text-[9px] text-[#4A5845] mt-1 font-bold">{fleetKpis.optimal} Optimal • {fleetKpis.alert + fleetKpis.critical} Alarmed</div>
        </div>

        <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm">
          <div className="text-[10px] text-[#5F625C] uppercase font-bold">{t?.fleet?.availability || 'FLEET AVAILABILITY'}</div>
          <div className="text-xl font-bold text-[#4A5845] mt-1 flex items-center justify-between">
            <span>{activeMine.fleetAvailabilityBase || 87.5}%</span>
            <ShieldCheck className="w-4 h-4 text-[#71856B]" />
          </div>
          <div className="text-[9px] text-[#5F625C] mt-1">Target: &gt; 85.0%</div>
        </div>

        <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm">
          <div className="text-[10px] text-[#5F625C] uppercase font-bold">{t?.fleet?.utilization || 'FLEET UTILIZATION'}</div>
          <div className="text-xl font-bold text-[#3D8C8A] mt-1 flex items-center justify-between">
            <span>{fleetKpis.avgUtil}%</span>
            <Activity className="w-4 h-4 text-[#3D8C8A]" />
          </div>
          <div className="text-[9px] text-[#5F625C] mt-1">Effective Haul Shift</div>
        </div>

        <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm">
          <div className="text-[10px] text-[#5F625C] uppercase font-bold">{t?.fleet?.meanHealth || 'MEAN FLEET HEALTH'}</div>
          <div className="text-xl font-bold text-[#C46A32] mt-1 flex items-center justify-between">
            <span>{fleetKpis.avgHealth}%</span>
            <Gauge className="w-4 h-4 text-[#C46A32]" />
          </div>
          <div className="text-[9px] text-[#5F625C] mt-1">SCADA Diagnostics</div>
        </div>

        <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm">
          <div className="text-[10px] text-[#5F625C] uppercase font-bold">{t?.fleet?.engineHours || 'TOTAL ENGINE HOURS'}</div>
          <div className="text-xl font-bold text-[#272A27] mt-1 flex items-center justify-between">
            <span>{fleetKpis.totalHours}</span>
            <Clock className="w-4 h-4 text-[#655C9F]" />
          </div>
          <div className="text-[9px] text-[#5F625C] mt-1">Fleet Cumulative</div>
        </div>

        <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm">
          <div className="text-[10px] text-[#5F625C] uppercase font-bold">{t?.fleet?.criticalAlerts || 'CRITICAL ALERTS'}</div>
          <div className={`text-xl font-bold mt-1 flex items-center justify-between ${
            fleetKpis.critical > 0 ? 'text-[#872C23] animate-pulse' : 'text-[#4A5845]'
          }`}>
            <span>{fleetKpis.critical} Alarms</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-[9px] text-[#5F625C] mt-1">Immediate Triage</div>
        </div>
      </div>

      {/* 3. BOTTLENECK RADAR BANNER */}
      <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-950 text-amber-400 border border-amber-600/40">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[#5F625C] text-[10px] uppercase font-bold">OPERATIONAL BOTTLENECK RADAR:</span>
            <div className="text-[#272A27] font-bold text-xs flex items-center gap-2">
              <span>{bottleneckInfo.stage}</span>
              <span className={`px-2 py-0.2 rounded text-[9px] font-bold ${
                bottleneckInfo.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                bottleneckInfo.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {bottleneckInfo.severity} • {bottleneckInfo.delay}
              </span>
            </div>
          </div>
        </div>
        <p className="text-[#272A27] text-xs max-w-xl">
          {bottleneckInfo.desc}
        </p>
      </div>

      {/* 4. FLEET ROSTER & INSPECTION VIEW */}
      {fleetTab === 'FLEET_ROSTER' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Left Machine Roster List (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#85877E] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by ID, OEM, or Type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] text-xs text-white placeholder-[#85877E] focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] text-xs text-[#272A27] focus:outline-none"
              >
                <option value="ALL">All Machinery</option>
                <option value="EXCAVATOR">Excavators / Shovels</option>
                <option value="TRUCK">Haul Dumpers</option>
                <option value="LHD">Underground LHDs</option>
                <option value="HOIST">Shaft Hoists</option>
                <option value="PUMP">Dewatering Pumps</option>
                <option value="CRUSHER">Crushers &amp; Sizers</option>
              </select>
            </div>

            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {filteredAssets.map(asset => {
                const isSelected = activeAsset.id === asset.id;
                return (
                  <button
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#E8E1D5] border-2 border-[#C46A32] shadow-md'
                        : 'bg-[#F0EBE2] border-[#C8BFAF] hover:bg-[#E8E1D5] hover:border-[#85877E]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#F5F1E9] border border-[#C8BFAF] text-amber-400">
                        <EquipmentIcon type={asset.category} className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#272A27]">{asset.id}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[8.5px] font-bold ${
                            asset.status === 'CRITICAL'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : asset.status === 'ALERT'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {asset.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#5F625C] mt-0.5 truncate max-w-[200px]">{asset.name}</div>
                        <div className="text-[9px] text-[#85877E] font-mono mt-0.5">{asset.location}</div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <div className="text-[9px] text-[#85877E] uppercase">HEALTH</div>
                      <div className="text-sm font-bold text-emerald-400">{asset.health}%</div>
                      <div className="text-[9px] text-amber-300 mt-0.5">{asset.rulHours} hrs RUL</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Selected Machine Digital Health Card (7 Cols) */}
          <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-4">

            {/* Header with Silhouette & Quick State */}
            <div className="flex items-start justify-between pb-3 border-b border-[#C8BFAF]">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] text-amber-400">
                  <EquipmentIcon type={activeAsset.category} className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400">{activeAsset.category}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      activeAsset.status === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : activeAsset.status === 'ALERT'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {activeAsset.status}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#DDD4C5] text-[#272A27] text-[9px] font-bold">
                      PRIORITY: {activeAsset.maintenancePriority}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-[#272A27] mt-1">{activeAsset.name}</h2>
                  <div className="text-[10.5px] text-[#5F625C]">{activeAsset.id} • OEM: {activeAsset.oem} • Model: {activeAsset.model}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-[#85877E] uppercase font-bold">HEALTH DIAL</div>
                <div className="text-2xl font-bold text-emerald-400 flex items-center justify-end gap-1">
                  <Gauge className="w-5 h-5 text-emerald-400" />
                  {activeAsset.health}%
                </div>
              </div>
            </div>

            {/* Operating Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
                <div className="text-[9px] text-[#85877E] uppercase">{t?.fleet?.engineTemp || 'ENGINE TEMP'}</div>
                <div className="text-sm font-bold text-amber-300 mt-0.5 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5" />
                  {activeAsset.engineTempC}°C
                </div>
                <div className="text-[9px] text-[#5F625C] mt-1">Normal: &lt; 85°C</div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
                <div className="text-[9px] text-[#85877E] uppercase">{t?.fleet?.hydraulicPressure || 'HYDRAULIC PRESSURE'}</div>
                <div className="text-sm font-bold text-sky-300 mt-0.5 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" />
                  {activeAsset.hydraulicPressureBar} Bar
                </div>
                <div className="text-[9px] text-[#5F625C] mt-1">Nominal: 200-340</div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
                <div className="text-[9px] text-[#85877E] uppercase">{t?.fleet?.vibrationRms || 'VIBRATION RMS'}</div>
                <div className="text-sm font-bold text-purple-300 mt-0.5 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  {activeAsset.vibrationMms} mm/s
                </div>
                <div className="text-[9px] text-[#5F625C] mt-1">ISO Zone A/B</div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
                <div className="text-[9px] text-[#85877E] uppercase">{t?.fleet?.rulHours || 'ESTIMATED RUL'}</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {activeAsset.rulHours} hrs
                </div>
                <div className="text-[9px] text-[#5F625C] mt-1">Conf: {activeAsset.rulConfidence}%</div>
              </div>
            </div>

            {/* Strengths and Penalties Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F5F1E9] border border-emerald-900/40">
                <div className="text-[9px] text-emerald-400 font-bold uppercase mb-1">POSITIVE OPERATING FACTORS</div>
                <ul className="space-y-0.5 text-[11px] text-[#272A27]">
                  {activeAsset.strengths.map((s, i) => (
                    <li key={i} className="flex items-center gap-1 text-emerald-300">
                      <span>✓</span> <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F5F1E9] border border-rose-900/40">
                <div className="text-[9px] text-rose-400 font-bold uppercase mb-1">DEGRADATION PENALTIES</div>
                <ul className="space-y-0.5 text-[11px] text-[#272A27]">
                  {activeAsset.penalties.map((p, i) => (
                    <li key={i} className="flex items-center gap-1 text-rose-300">
                      <span>⚠</span> <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Prescriptive Work Order */}
            <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] space-y-1 text-xs">
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                <span>{t?.fleet?.workOrder || 'AI PRESCRIPTIVE WORK ORDER'}</span>
              </div>
              <p className="text-[#272A27] text-xs leading-relaxed">
                {activeAsset.prescription}
              </p>
            </div>

            {/* Recent Machine Event Timeline */}
            <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-1.5 text-xs">
              <div className="text-[10px] text-[#5F625C] font-bold uppercase tracking-wider">
                SCADA TELEMETRY EVENT TIMELINE (TODAY)
              </div>
              <div className="space-y-1">
                {activeAsset.recentEvents.map((ev, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-[#F5F1E9] border border-[#C8BFAF]">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold">{ev.time}</span>
                      <span className="text-[#272A27]">{ev.event}</span>
                    </div>
                    <span className={`px-1.5 py-0.2 rounded text-[8.5px] font-bold ${
                      ev.type === 'alert' ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'
                    }`}>
                      {ev.type.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. LOAD & HAUL CYCLE MONITORING VIEW */}
      {fleetTab === 'CYCLE_MONITOR' && (
        <div className="p-5 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#C8BFAF]">
            <div>
              <h3 className="text-base font-bold text-[#272A27]">{t?.fleet?.cycleTitle || 'Komatsu-Inspired Load & Haul Cycle Telemetry'}</h3>
              <p className="text-xs text-[#5F625C]">Complete 4-stage operational haulage cycle tracking payload utilization and cycle delays.</p>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-amber-950 text-amber-300 border border-amber-800 text-xs font-bold">
              AVG CYCLE TIME: 18.2 MIN
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#F5F1E9] border border-sky-800/40 space-y-1">
              <div className="text-[10px] text-sky-400 font-bold uppercase">{t?.fleet?.stageLoading || 'STAGE 1: LOADING'}</div>
              <div className="text-xl font-bold text-[#272A27]">4.2 min</div>
              <div className="text-xs text-[#5F625C]">Shovel Loading • 38T/pass</div>
            </div>
            <div className="p-4 rounded-xl bg-[#F5F1E9] border border-yellow-800/40 space-y-1">
              <div className="text-[10px] text-yellow-400 font-bold uppercase">{t?.fleet?.stageHauling || 'STAGE 2: HAULING'}</div>
              <div className="text-xl font-bold text-[#272A27]">12.8 min</div>
              <div className="text-xs text-[#5F625C]">28.5 km/h avg • East Ramp Corridor</div>
            </div>
            <div className="p-4 rounded-xl bg-[#F5F1E9] border border-purple-800/40 space-y-1">
              <div className="text-[10px] text-purple-400 font-bold uppercase">{t?.fleet?.stageDumping || 'STAGE 3: DUMPING'}</div>
              <div className="text-xl font-bold text-[#272A27]">1.5 min</div>
              <div className="text-xs text-[#5F625C]">Primary Crusher Station</div>
            </div>
            <div className="p-4 rounded-xl bg-[#F5F1E9] border border-emerald-800/40 space-y-1">
              <div className="text-[10px] text-emerald-400 font-bold uppercase">{t?.fleet?.stageReturn || 'STAGE 4: RETURN'}</div>
              <div className="text-xl font-bold text-[#272A27]">9.1 min</div>
              <div className="text-xs text-[#5F625C]">34.0 km/h avg • Empty Return Route</div>
            </div>
          </div>
        </div>
      )}

      {/* 6. PREDICTIVE RUL MATRIX VIEW */}
      {fleetTab === 'MAINTENANCE_RUL' && (
        <div className="p-5 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#C8BFAF]">
            <div>
              <h3 className="text-base font-bold text-[#272A27]">{t?.fleet?.predictiveRul || 'Predictive RUL Matrix'}</h3>
              <p className="text-xs text-[#5F625C]">Component Remaining Useful Life calculated from vibration harmonics, thermal stress, and engine hours.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F5F1E9] text-[#5F625C] uppercase text-[10px] border-b border-[#C8BFAF]">
                <tr>
                  <th className="p-2.5">Machine ID</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">OEM &amp; Model</th>
                  <th className="p-2.5">Utilization %</th>
                  <th className="p-2.5">Vibration RMS</th>
                  <th className="p-2.5">Health</th>
                  <th className="p-2.5">Estimated RUL</th>
                  <th className="p-2.5">Failure Prob</th>
                  <th className="p-2.5">PM Priority</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141f32]">
                {equipmentFleet.map(a => (
                  <tr key={a.id} className="hover:bg-[#0c1524] transition-colors">
                    <td className="p-2.5 font-bold text-[#272A27]">{a.id}</td>
                    <td className="p-2.5 text-[#272A27]">{a.category}</td>
                    <td className="p-2.5 text-[#5F625C]">{a.name}</td>
                    <td className="p-2.5 text-sky-300">{a.utilizationPct}%</td>
                    <td className="p-2.5 text-purple-300">{a.vibrationMms} mm/s</td>
                    <td className="p-2.5 font-bold text-emerald-400">{a.health}%</td>
                    <td className="p-2.5 text-amber-300 font-bold">{a.rulHours} hrs</td>
                    <td className="p-2.5 text-rose-300 font-bold">{a.failureProb}%</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        a.maintenancePriority === 'CRITICAL' ? 'bg-rose-950 text-rose-300' :
                        a.maintenancePriority === 'HIGH' ? 'bg-amber-950 text-amber-300' :
                        'bg-[#DDD4C5] text-[#272A27]'
                      }`}>
                        {a.maintenancePriority}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        a.status === 'CRITICAL' ? 'bg-rose-950 text-rose-300' : a.status === 'ALERT' ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. DYNAMIC FLEET RANKINGS VIEW */}
      {fleetTab === 'ANALYTICS' && (
        <div className="p-5 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#C8BFAF]">
            <div>
              <h3 className="text-base font-bold text-[#272A27]">{t?.fleet?.fleetRankings || 'Multi-Dimensional Fleet Rankings'}</h3>
              <p className="text-xs text-[#5F625C]">Transparent weighted formula incorporating health (35%), availability (20%), utilization (20%), vibration (15%), and RUL (10%).</p>
            </div>
          </div>

          <div className="space-y-3">
            {rankedFleet.map((m, idx) => (
              <div key={m.id} className="p-3.5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-sm ${
                    idx === 0 ? 'bg-amber-500 text-black shadow-lg' :
                    idx === 1 ? 'bg-zinc-300 text-black' :
                    idx === 2 ? 'bg-amber-800 text-white' :
                    'bg-zinc-800 text-[#5F625C]'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-[#272A27] text-xs">{m.name}</strong>
                      <span className="text-[10px] text-[#5F625C] font-mono">({m.id})</span>
                    </div>
                    <div className="text-[10.5px] text-[#5F625C] mt-0.5">
                      Strengths: <span className="text-emerald-300">{m.strengths.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>
                    <div className="text-[9px] text-[#85877E] uppercase">HEALTH</div>
                    <div className="font-bold text-emerald-400">{m.health}%</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-[#85877E] uppercase">UTILIZATION</div>
                    <div className="font-bold text-sky-300">{m.utilizationPct}%</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-[#85877E] uppercase">FLEET SCORE</div>
                    <div className="text-base font-bold text-amber-300">{m.fleetScore}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. MACHINE COMPARISON VIEW */}
      {fleetTab === 'COMPARISON' && (
        <div className="p-5 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#C8BFAF]">
            <div>
              <h3 className="text-base font-bold text-[#272A27]">Side-by-Side Machine Comparison</h3>
              <p className="text-xs text-[#5F625C]">Evaluate telemetry, vibration metrics, thermodynamic profiles, and RUL between two assets.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Machine A */}
            <div className="p-4 rounded-xl bg-[#F5F1E9] border border-sky-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sky-400 font-bold text-xs">ASSET A</span>
                <select
                  value={compareAssetA.id}
                  onChange={(e) => setCompareIdA(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-[#F0EBE2] border border-[#C8BFAF] text-xs text-white"
                >
                  {equipmentFleet.map(a => <option key={a.id} value={a.id}>{a.id} - {a.name}</option>)}
                </select>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Health Score:</span> <strong className="text-emerald-400">{compareAssetA.health}%</strong></div>
                <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Estimated RUL:</span> <strong className="text-amber-300">{compareAssetA.rulHours} hrs</strong></div>
                <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Failure Probability:</span> <strong className="text-rose-300">{compareAssetA.failureProb}%</strong></div>
                <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Vibration RMS:</span> <strong className="text-purple-300">{compareAssetA.vibrationMms} mm/s</strong></div>
                <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Engine Temp:</span> <strong className="text-amber-300">{compareAssetA.engineTempC}°C</strong></div>
                <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Hydraulic Pressure:</span> <strong className="text-sky-300">{compareAssetA.hydraulicPressureBar} Bar</strong></div>
                <div className="flex justify-between"><span>Utilization:</span> <strong className="text-[#272A27]">{compareAssetA.utilizationPct}%</strong></div>
              </div>
            </div>

            {/* Machine B */}
            <div className="p-4 rounded-xl bg-[#F5F1E9] border border-amber-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold text-xs">ASSET B</span>
                <select
                  value={compareAssetB.id}
                  onChange={(e) => setCompareIdB(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-[#F0EBE2] border border-[#C8BFAF] text-xs text-white"
                >
                  {equipmentFleet.map(a => <option key={a.id} value={a.id}>{a.id} - {a.name}</option>)}
                </select>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Health Score:</span> <strong className="text-emerald-400">{compareAssetB.health}%</strong></div>
                <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Estimated RUL:</span> <strong className="text-amber-300">{compareAssetB.rulHours} hrs</strong></div>
                <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Failure Probability:</span> <strong className="text-rose-300">{compareAssetB.failureProb}%</strong></div>
                <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Vibration RMS:</span> <strong className="text-purple-300">{compareAssetB.vibrationMms} mm/s</strong></div>
                <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Engine Temp:</span> <strong className="text-amber-300">{compareAssetB.engineTempC}°C</strong></div>
                <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Hydraulic Pressure:</span> <strong className="text-sky-300">{compareAssetB.hydraulicPressureBar} Bar</strong></div>
                <div className="flex justify-between"><span>Utilization:</span> <strong className="text-[#272A27]">{compareAssetB.utilizationPct}%</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
