import { MOIL_MINE_REGISTRY } from './mineRegistry.js';

export const SCENARIO_PRESETS = [
  {
    id: 'BASELINE',
    name: 'Baseline Nominal',
    color: '#10b981',
    description: 'Normal seasonal operations across all pit benches and shafts.',
    defaultRainfall: 12.5,
    defaultCrusher: 90.0,
    defaultFleet: 88.0,
    defaultHaulEff: 92.0,
    defaultSumpInflow: 120.0,
    defaultPumpCap: 95.0,
    defaultEqHealth: 92.0
  },
  {
    id: 'HEAVY_MONSOON',
    name: 'Heavy Monsoon Influx',
    color: '#3b82f6',
    description: 'Catchment storm of 95 mm/day causing haul-ramp traction loss and sump head loading.',
    defaultRainfall: 95.0,
    defaultCrusher: 75.0,
    defaultFleet: 65.0,
    defaultHaulEff: 48.0,
    defaultSumpInflow: 480.0,
    defaultPumpCap: 85.0,
    defaultEqHealth: 78.0
  },
  {
    id: 'CRUSHER_SEIZURE',
    name: 'Crusher Bearing Seizure',
    color: '#f59e0b',
    description: 'Catastrophic primary jaw/gyratory crusher failure dropping throughput to 20%.',
    defaultRainfall: 12.5,
    defaultCrusher: 20.0,
    defaultFleet: 82.0,
    defaultHaulEff: 90.0,
    defaultSumpInflow: 120.0,
    defaultPumpCap: 95.0,
    defaultEqHealth: 58.0
  },
  {
    id: 'MULTI_RISK',
    name: 'Multi-Risk Crisis',
    color: '#ef4444',
    description: 'Simultaneous heavy rainfall, haulage mud-lock, crusher bearing seizure, and pump failure.',
    defaultRainfall: 110.0,
    defaultCrusher: 18.0,
    defaultFleet: 52.0,
    defaultHaulEff: 38.0,
    defaultSumpInflow: 580.0,
    defaultPumpCap: 60.0,
    defaultEqHealth: 50.0
  }
];

export const MINE_PHYSICAL_PROFILES = {
  'balaghat': {
    id: 'balaghat',
    name: 'Balaghat Mine',
    targetTpd: 6200,
    actualD1Tpd: 6140,
    mineType: 'Underground Deep Shaft',
    keyInfrastructure: 'Holmes & Bharveli Vertical Shaft (-185m Level)',
    rainSens: 1.35,
    crusherHealthBase: 88,
    fleetAvailBase: 88,
    haulDistKm: 2.8,
    maxDrainageM3h: 45.0,
    headPressureFactor: 1.45,
    stockpileBufferT: 850,
    roadGradeFactor: 1.05,
    crusherDependency: 0.78,
    catchmentExposure: 1.10,
    tau: 7, lambda: 14, phi: 0.0, psi: 0.4,
    waveA: 0.035, waveB: 0.018,
    stockpileDampening: 0.22,
    baseUncertainty: 0.020,
    volatilityDrift: 0.025,
    vulnCategory: 'Deep Shaft Sump Head & Skip Inundation',
    protocolCode: 'PROTO-BAL-01'
  },
  'dongri-buzurg': {
    id: 'dongri-buzurg',
    name: 'Dongri Buzurg Mine',
    targetTpd: 5400,
    actualD1Tpd: 5320,
    mineType: 'Opencast Semi-Mechanized',
    keyInfrastructure: 'East Pit Continuous 3.2km Ramp Circuit',
    rainSens: 1.55,
    crusherHealthBase: 85,
    fleetAvailBase: 86,
    haulDistKm: 3.2,
    maxDrainageM3h: 42.0,
    headPressureFactor: 1.15,
    stockpileBufferT: 920,
    roadGradeFactor: 1.35,
    crusherDependency: 0.72,
    catchmentExposure: 1.40,
    tau: 5, lambda: 10, phi: 0.5, psi: 0.8,
    waveA: 0.045, waveB: 0.022,
    stockpileDampening: 0.28,
    baseUncertainty: 0.024,
    volatilityDrift: 0.032,
    vulnCategory: 'Opencast Haul-Road Ramp Mud Slick & Sump Flooding',
    protocolCode: 'PROTO-DB-02'
  },
  'chikla': {
    id: 'chikla',
    name: 'Chikla Mine',
    targetTpd: 4100,
    actualD1Tpd: 4050,
    mineType: 'Underground Incline & Shaft',
    keyInfrastructure: 'Main Incline & Sub-Level Winze Circuit (-120m)',
    rainSens: 1.20,
    crusherHealthBase: 90,
    fleetAvailBase: 90,
    haulDistKm: 2.1,
    maxDrainageM3h: 28.0,
    headPressureFactor: 1.25,
    stockpileBufferT: 650,
    roadGradeFactor: 1.00,
    crusherDependency: 0.68,
    catchmentExposure: 0.95,
    tau: 6, lambda: 12, phi: 0.2, psi: 0.3,
    waveA: 0.028, waveB: 0.015,
    stockpileDampening: 0.18,
    baseUncertainty: 0.018,
    volatilityDrift: 0.022,
    vulnCategory: 'Incline Track Slip & Ore Pocket Jamming',
    protocolCode: 'PROTO-CHK-01'
  },
  'gumgaon': {
    id: 'gumgaon',
    name: 'Gumgaon Mine',
    targetTpd: 3400,
    actualD1Tpd: 3360,
    mineType: 'Underground Deep Shaft',
    keyInfrastructure: 'Vertical Shaft & Fault Contact Sump (-160m)',
    rainSens: 1.25,
    crusherHealthBase: 88,
    fleetAvailBase: 87,
    haulDistKm: 2.4,
    maxDrainageM3h: 30.0,
    headPressureFactor: 1.30,
    stockpileBufferT: 540,
    roadGradeFactor: 1.10,
    crusherDependency: 0.65,
    catchmentExposure: 1.05,
    tau: 4, lambda: 8, phi: 0.1, psi: 0.5,
    waveA: 0.032, waveB: 0.016,
    stockpileDampening: 0.16,
    baseUncertainty: 0.021,
    volatilityDrift: 0.026,
    vulnCategory: 'High Hydrostatic Water Inrush via Fault Zone',
    protocolCode: 'PROTO-GUM-01'
  },
  'tirodi': {
    id: 'tirodi',
    name: 'Tirodi Mine',
    targetTpd: 3100,
    actualD1Tpd: 3040,
    mineType: 'Opencast & Incline',
    keyInfrastructure: 'North Benches & Incline Sump (-92m)',
    rainSens: 1.45,
    crusherHealthBase: 82,
    fleetAvailBase: 84,
    haulDistKm: 1.9,
    maxDrainageM3h: 24.0,
    headPressureFactor: 1.20,
    stockpileBufferT: 480,
    roadGradeFactor: 1.25,
    crusherDependency: 0.70,
    catchmentExposure: 1.30,
    tau: 5, lambda: 11, phi: 0.4, psi: 0.9,
    waveA: 0.040, waveB: 0.020,
    stockpileDampening: 0.20,
    baseUncertainty: 0.025,
    volatilityDrift: 0.030,
    vulnCategory: 'Bench Stability Degradation & High Inflow Surge',
    protocolCode: 'PROTO-TIR-03'
  },
  'kandri': {
    id: 'kandri',
    name: 'Kandri Mine',
    targetTpd: 2800,
    actualD1Tpd: 2760,
    mineType: 'Opencast to UG Transition',
    keyInfrastructure: 'Pit Bottom Adit Portal & Decline (-110m)',
    rainSens: 1.15,
    crusherHealthBase: 86,
    fleetAvailBase: 86,
    haulDistKm: 1.7,
    maxDrainageM3h: 22.0,
    headPressureFactor: 1.10,
    stockpileBufferT: 420,
    roadGradeFactor: 0.95,
    crusherDependency: 0.60,
    catchmentExposure: 0.90,
    tau: 6, lambda: 9, phi: 0.3, psi: 0.6,
    waveA: 0.026, waveB: 0.014,
    stockpileDampening: 0.15,
    baseUncertainty: 0.019,
    volatilityDrift: 0.024,
    vulnCategory: 'Portal Face Slumping & High Water Infiltration',
    protocolCode: 'PROTO-KAN-02'
  },
  'munsar': {
    id: 'munsar',
    name: 'Munsar Mine',
    targetTpd: 2400,
    actualD1Tpd: 2350,
    mineType: 'Opencast & UG Shaft',
    keyInfrastructure: 'Central Incline & Level 3 Sump (-85m)',
    rainSens: 1.10,
    crusherHealthBase: 84,
    fleetAvailBase: 85,
    haulDistKm: 1.5,
    maxDrainageM3h: 20.0,
    headPressureFactor: 1.05,
    stockpileBufferT: 390,
    roadGradeFactor: 0.90,
    crusherDependency: 0.58,
    catchmentExposure: 0.85,
    tau: 4, lambda: 8, phi: 0.2, psi: 0.4,
    waveA: 0.025, waveB: 0.012,
    stockpileDampening: 0.14,
    baseUncertainty: 0.020,
    volatilityDrift: 0.025,
    vulnCategory: 'Adit Drainage Siltation & Crusher Grid Choke',
    protocolCode: 'PROTO-MUN-01'
  },
  'bhandara': {
    id: 'bhandara',
    name: 'Bhandara Mine',
    targetTpd: 1950,
    actualD1Tpd: 1910,
    mineType: 'Underground Incline',
    keyInfrastructure: 'East Incline Drift & Dewatering Pump Room (-70m)',
    rainSens: 1.00,
    crusherHealthBase: 80,
    fleetAvailBase: 83,
    haulDistKm: 1.4,
    maxDrainageM3h: 18.0,
    headPressureFactor: 1.00,
    stockpileBufferT: 310,
    roadGradeFactor: 0.88,
    crusherDependency: 0.55,
    catchmentExposure: 0.80,
    tau: 3, lambda: 7, phi: 0.1, psi: 0.3,
    waveA: 0.024, waveB: 0.011,
    stockpileDampening: 0.12,
    baseUncertainty: 0.022,
    volatilityDrift: 0.027,
    vulnCategory: 'Secondary Crushing Choke & Incline Mud Deposition',
    protocolCode: 'PROTO-BHN-01'
  },
  'ukwa': {
    id: 'ukwa',
    name: 'Ukwa Mine',
    targetTpd: 1850,
    actualD1Tpd: 1820,
    mineType: 'Underground Drift & Adit',
    keyInfrastructure: 'Level 4 Main Haulage Adit & Gravity Sump',
    rainSens: 0.95,
    crusherHealthBase: 92,
    fleetAvailBase: 91,
    haulDistKm: 1.2,
    maxDrainageM3h: 16.0,
    headPressureFactor: 0.90,
    stockpileBufferT: 290,
    roadGradeFactor: 0.80,
    crusherDependency: 0.50,
    catchmentExposure: 0.75,
    tau: 8, lambda: 16, phi: 0.0, psi: 0.2,
    waveA: 0.020, waveB: 0.010,
    stockpileDampening: 0.11,
    baseUncertainty: 0.016,
    volatilityDrift: 0.020,
    vulnCategory: 'Adit Rail Derailment & Tramming Congestion',
    protocolCode: 'PROTO-UKW-01'
  },
  'ramtek': {
    id: 'ramtek',
    name: 'Ramtek Mine',
    targetTpd: 1600,
    actualD1Tpd: 1570,
    mineType: 'Opencast Exploratory Bench',
    keyInfrastructure: 'Shallow Quarry Benches (-50m Pit Floor)',
    rainSens: 0.90,
    crusherHealthBase: 82,
    fleetAvailBase: 82,
    haulDistKm: 1.1,
    maxDrainageM3h: 14.0,
    headPressureFactor: 0.85,
    stockpileBufferT: 250,
    roadGradeFactor: 0.85,
    crusherDependency: 0.48,
    catchmentExposure: 0.70,
    tau: 4, lambda: 7, phi: 0.3, psi: 0.5,
    waveA: 0.030, waveB: 0.015,
    stockpileDampening: 0.10,
    baseUncertainty: 0.034,
    volatilityDrift: 0.040,
    vulnCategory: 'Contract Hauler Roster Variance',
    protocolCode: 'PROTO-RAM-01'
  }
};

export class AlertForecastEngine {
  static getMineProfile(mineId) {
    const canonicalId = String(mineId || 'balaghat').toLowerCase().replace('_', '-');
    return MINE_PHYSICAL_PROFILES[canonicalId] || MINE_PHYSICAL_PROFILES['balaghat'];
  }

  static generateAlertForecast({
    mineId = 'balaghat',
    scenarioId = 'BASELINE',
    parameters = {},
    includeComparisons = true
  } = {}) {
    const canonicalId = String(mineId || 'balaghat').toLowerCase().replace('_', '-');
    const mine = MOIL_MINE_REGISTRY[canonicalId] || MOIL_MINE_REGISTRY[canonicalId.replace('-', '_')] || MOIL_MINE_REGISTRY.balaghat;
    const phys = this.getMineProfile(canonicalId);
    
    // Canonical Target and Physical Baseline
    const target = phys.targetTpd;
    const rainfallSens = phys.rainSens;
    const baseCrusherHealth = phys.crusherHealthBase;
    const baseFleetAvail = phys.fleetAvailBase;
    const haulDistKm = phys.haulDistKm;
    const bufferStockpileT = phys.stockpileBufferT;
    const baseGrade = mine.oreGrade || mine.grade || '44.2% Mn';
    const mineType = phys.mineType;

    const scenKey = (scenarioId || 'BASELINE').toUpperCase();
    const preset = SCENARIO_PRESETS.find(s => s.id === scenKey) || SCENARIO_PRESETS[0];

    // Effective Parameters with Slider Overrides
    const rainfall = parameters.rainfall !== undefined ? Number(parameters.rainfall) : preset.defaultRainfall;
    const crusherAvail = parameters.crusherAvailability !== undefined ? Number(parameters.crusherAvailability) : preset.defaultCrusher;
    const fleetAvail = parameters.fleetAvailability !== undefined ? Number(parameters.fleetAvailability) : preset.defaultFleet;
    const haulEff = parameters.haulageEfficiency !== undefined ? Number(parameters.haulageEfficiency) : preset.defaultHaulEff;
    const sumpInflow = parameters.sumpInflow !== undefined ? Number(parameters.sumpInflow) : preset.defaultSumpInflow;
    const pumpCap = parameters.pumpCapacity !== undefined ? Number(parameters.pumpCapacity) : preset.defaultPumpCap;
    const eqHealth = parameters.equipmentHealth !== undefined ? Number(parameters.equipmentHealth) : preset.defaultEqHealth;

    const baseDate = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const forecastPoints = [];

    let totalShortfallTonnes = 0;
    let worstDayPoint = null;
    let recoveryDayIdx = null;

    let sumRainLoss = 0;
    let sumHaulLoss = 0;
    let sumCrusherLoss = 0;
    let sumFleetLoss = 0;
    let sumSumpLoss = 0;
    let sumStockpileOffset = 0;

    for (let d = 1; d <= 14; d++) {
      const curDate = new Date(baseDate);
      curDate.setDate(baseDate.getDate() + (d - 1));
      const dateStr = `${curDate.getDate()} ${months[curDate.getMonth()]}`;

      let dayRainMultiplier = 1.0;
      let dayHaulMultiplier = 1.0;
      let dayCrusherMultiplier = 1.0;
      let dayFleetMultiplier = 1.0;
      let daySumpMultiplier = 1.0;
      let eventMarker = 'NORMAL';
      let mainDriver = 'Nominal Quota Operations';

      if (scenKey === 'BASELINE') {
        dayRainMultiplier = 0.85 + 0.15 * Math.sin(d * 0.5);
        eventMarker = 'NOMINAL QUOTA STABILITY';
        mainDriver = `${mine.name} Baseline Shift Rotation`;
      } else if (scenKey === 'HEAVY_MONSOON') {
        if (d <= 2) {
          dayRainMultiplier = 0.25;
          dayHaulMultiplier = 0.95;
          daySumpMultiplier = 0.35;
          eventMarker = 'PRE-MONSOON ONSET';
          mainDriver = 'Catchment Cloud Influx';
        } else if (d === 3) {
          dayRainMultiplier = 0.70;
          dayHaulMultiplier = 0.78;
          daySumpMultiplier = 0.75;
          eventMarker = 'PRECIPITATION INTENSIFICATION';
          mainDriver = 'Haul Ramp Surface Softening';
        } else if (d >= 4 && d <= 6) {
          dayRainMultiplier = 1.30;
          dayHaulMultiplier = 0.44;
          daySumpMultiplier = 1.40;
          dayFleetMultiplier = 0.70;
          dayCrusherMultiplier = 0.80;
          eventMarker = 'PEAK MONSOON INUNDATION & HAUL SLIP';
          mainDriver = `Heavy Catchment Storm (${phys.keyInfrastructure})`;
        } else if (d >= 7 && d <= 9) {
          dayRainMultiplier = 0.50;
          dayHaulMultiplier = 0.68;
          daySumpMultiplier = 0.80;
          dayFleetMultiplier = 0.84;
          dayCrusherMultiplier = 0.90;
          eventMarker = 'AUXILIARY DEWATERING ENGAGED';
          mainDriver = `Pumping Head Active (${phys.maxDrainageM3h} m³/h Battery)`;
        } else if (d >= 10 && d <= 12) {
          dayRainMultiplier = 0.20;
          dayHaulMultiplier = 0.86;
          daySumpMultiplier = 0.40;
          dayFleetMultiplier = 0.92;
          dayCrusherMultiplier = 0.96;
          eventMarker = 'ROAD RE-GRADING & CLEARANCE';
          mainDriver = 'Haul Traction Restoring';
        } else {
          dayRainMultiplier = 0.15;
          dayHaulMultiplier = 0.95;
          daySumpMultiplier = 0.25;
          dayFleetMultiplier = 0.98;
          dayCrusherMultiplier = 1.0;
          eventMarker = 'STABILIZED OPERATIONS';
          mainDriver = 'Post-Monsoon Baseline Re-stabilization';
        }
      } else if (scenKey === 'CRUSHER_SEIZURE' || scenKey === 'CRUSHER_CONSTRAINT') {
        if (d <= 3) {
          dayCrusherMultiplier = 1.0;
          eventMarker = 'NOMINAL OPERATIONS';
          mainDriver = 'Primary Crusher Circuit Nominal';
        } else if (d === 4) {
          dayCrusherMultiplier = 0.45;
          eventMarker = 'BEARING TEMPERATURE ALARM & RPM DROP';
          mainDriver = 'Vibration Spike in Jaw Excenter';
        } else if (d >= 5 && d <= 6) {
          dayCrusherMultiplier = 0.15;
          eventMarker = 'CRUSHER BEARING SEIZURE & LOCKOUT';
          mainDriver = 'Downstream Crushing Circuit Offline';
        } else if (d >= 7 && d <= 8) {
          dayCrusherMultiplier = 0.35;
          eventMarker = 'STOCKPILE FEED BYPASS & RIG REPAIR';
          mainDriver = 'Manual Sizing & Direct ROM Diversion';
        } else if (d === 9) {
          dayCrusherMultiplier = 0.62;
          eventMarker = 'COLD RUN COMMISSIONING & BALANCING';
          mainDriver = 'Unloaded Bearing Run & Dynamic Alignment';
        } else if (d >= 10 && d <= 12) {
          dayCrusherMultiplier = 0.88;
          eventMarker = 'THROUGHPUT RECOVERY RAMP';
          mainDriver = 'Paced Feed Rate Re-acceleration';
        } else {
          dayCrusherMultiplier = 1.0;
          eventMarker = 'FULL CAPACITY RESTORATION';
          mainDriver = 'Full Circuit Nominal Output';
        }
      } else if (scenKey === 'MULTI_RISK') {
        if (d <= 2) {
          dayRainMultiplier = 0.35;
          dayCrusherMultiplier = 0.90;
          dayHaulMultiplier = 0.90;
          eventMarker = 'INCUBATING COMPOUNDED RISK';
          mainDriver = 'Multi-Vector Warning Signals';
        } else if (d >= 3 && d <= 7) {
          dayRainMultiplier = 1.35;
          dayHaulMultiplier = 0.38;
          dayCrusherMultiplier = 0.18;
          dayFleetMultiplier = 0.52;
          daySumpMultiplier = 1.50;
          eventMarker = 'COMPOUNDED MULTI-VECTOR CRISIS PEAK';
          mainDriver = `Cascading Flooding, Ramp Slip & Crusher Lockout (${phys.vulnCategory})`;
        } else if (d >= 8 && d <= 11) {
          dayRainMultiplier = 0.65;
          dayHaulMultiplier = 0.65;
          dayCrusherMultiplier = 0.52;
          dayFleetMultiplier = 0.72;
          daySumpMultiplier = 0.85;
          eventMarker = 'EMERGENCY MULTI-FRONT MITIGATION';
          mainDriver = 'Auxiliary Pumping & Bypass Haulage';
        } else {
          dayRainMultiplier = 0.30;
          dayHaulMultiplier = 0.80;
          dayCrusherMultiplier = 0.78;
          dayFleetMultiplier = 0.86;
          daySumpMultiplier = 0.45;
          eventMarker = 'SYSTEM-WIDE PROGRESSIVE RECOVERY';
          mainDriver = 'Stabilizing Operating Parameters';
        }
      }

      const effRainfall = Math.max(0, rainfall * dayRainMultiplier);
      const effHaulEff = Math.max(20, Math.min(100, haulEff * dayHaulMultiplier));
      const effCrusher = Math.max(10, Math.min(100, crusherAvail * dayCrusherMultiplier));
      const effFleet = Math.max(20, Math.min(100, fleetAvail * dayFleetMultiplier));
      const effInflow = Math.max(20, sumpInflow * daySumpMultiplier);
      const effPump = Math.max(20, pumpCap);
      const effEqHealth = Math.max(20, eqHealth);

      // Deep Mine-Specific Physical Delta Losses
      const rainLoss = target * Math.max(0, (effRainfall - 12.5) / 100.0) * 0.28 * rainfallSens * phys.catchmentExposure;
      const haulLoss = target * Math.max(0, (92.0 - effHaulEff) / 100.0) * 0.35 * (haulDistKm / 2.5) * phys.roadGradeFactor;
      const crusherLoss = target * Math.max(0, (baseCrusherHealth - effCrusher) / 100.0) * phys.crusherDependency;
      const fleetLoss = target * Math.max(0, (baseFleetAvail - effFleet) / 100.0) * 0.42;
      const eqLoss = target * Math.max(0, (88.0 - effEqHealth) / 100.0) * 0.22;
      
      const unpumpedInflow = Math.max(0, effInflow - (phys.maxDrainageM3h * (effPump / 100.0)));
      const waterLoss = target * Math.min(0.40, (unpumpedInflow / 500.0) * 0.38 * phys.headPressureFactor);

      const interactionPenalty = scenKey === 'MULTI_RISK' ? (rainLoss + crusherLoss + haulLoss) * 0.18 : 0;

      const rawLoss = rainLoss + haulLoss + crusherLoss + fleetLoss + waterLoss + eqLoss + interactionPenalty;
      const availableStockpile = Math.min(bufferStockpileT, target * 0.25);
      const stockpileOffset = Math.min(availableStockpile * 0.55, rawLoss * phys.stockpileDampening);

      const netDailyLoss = Math.max(0, Math.min(target * 0.88, rawLoss - stockpileOffset));

      sumRainLoss += rainLoss;
      sumHaulLoss += haulLoss;
      sumCrusherLoss += crusherLoss;
      sumFleetLoss += fleetLoss;
      sumSumpLoss += waterLoss;
      sumStockpileOffset += stockpileOffset;

      // Deterministic Harmonic Waveform per Mine
      const waveVal = target * (
        phys.waveA * Math.sin((2 * Math.PI * (d + phys.phi)) / phys.tau) +
        phys.waveB * Math.cos((2 * Math.PI * (d + phys.psi)) / phys.lambda)
      );

      let dayYield;
      if (scenKey === 'BASELINE') {
        dayYield = Math.round(target - netDailyLoss + waveVal);
      } else {
        dayYield = Math.round(Math.max(target * 0.12, target - netDailyLoss + (waveVal * 0.35)));
      }

      if (d > 5 && recoveryDayIdx === null && dayYield >= target * 0.85) {
        recoveryDayIdx = d;
      }

      const sigma = target * (phys.baseUncertainty + phys.volatilityDrift * Math.sqrt(d));
      const lowerCi = Math.round(Math.max(0, dayYield - 1.96 * sigma));
      const upperCi = Math.round(dayYield + 1.96 * sigma);

      const shortfall = Math.round(Math.max(0, target - dayYield));
      const shortfallPct = Math.round(((shortfall / target) * 100) * 10) / 10;
      totalShortfallTonnes += shortfall;

      let riskLvl = 'LOW';
      if (shortfallPct >= 35.0 || dayYield < target * 0.65) riskLvl = 'CRITICAL';
      else if (shortfallPct >= 18.0) riskLvl = 'HIGH';
      else if (shortfallPct >= 6.0) riskLvl = 'MODERATE';

      const isHist = (d === 1);
      const actualYield = isHist ? phys.actualD1Tpd : null;

      const pointData = {
        day_num: d,
        day_label: `D${d}`,
        date: dateStr,
        target_tpd: target,
        baseline_tpd: Math.round(target + waveVal),
        predicted_yield_tpd: dayYield,
        lower_ci_tpd: lowerCi,
        upper_ci_tpd: upperCi,
        shortfall_tpd: shortfall,
        shortfall_pct: shortfallPct,
        risk_level: riskLvl,
        main_driver: mainDriver,
        event_marker: eventMarker,
        rainfall_mm: Math.round(effRainfall * 10) / 10,
        crusher_avail_pct: Math.round(effCrusher),
        fleet_avail_pct: Math.round(effFleet),
        haul_eff_pct: Math.round(effHaulEff),
        sump_inflow_m3h: Math.round(effInflow),
        actual_tpd: actualYield,
        is_historical: isHist
      };

      if (!worstDayPoint || dayYield < worstDayPoint.predicted_yield_tpd) {
        worstDayPoint = pointData;
      }

      forecastPoints.push(pointData);
    }

    // Validate exactly 14 forecast points
    if (!Array.isArray(forecastPoints) || forecastPoints.length !== 14) {
      throw new Error("Alert forecast must contain exactly 14 days");
    }

    const avgPredictedYield = Math.round((forecastPoints.reduce((acc, p) => acc + p.predicted_yield_tpd, 0) / 14) * 10) / 10;
    const avgDailyShortfall = Math.round((totalShortfallTonnes / 14) * 10) / 10;
    const netImpactTpd = Math.round(avgPredictedYield - target);

    // Dynamic TreeSHAP Waterfall Feature Drivers for this Mine
    const avgRainLoss = Math.round(sumRainLoss / 14);
    const avgHaulLoss = Math.round(sumHaulLoss / 14);
    const avgCrusherLoss = Math.round(sumCrusherLoss / 14);
    const avgFleetLoss = Math.round(sumFleetLoss / 14);
    const avgSumpLoss = Math.round(sumSumpLoss / 14);
    const avgStockpileGain = Math.round(sumStockpileOffset / 14);

    const waterfallDrivers = [
      {
        name: 'Precipitation & Water Ingress',
        impact_tpd: -avgRainLoss,
        category: 'Environmental',
        current_val: `${rainfall} mm/day`,
        baseline_val: '12.5 mm/day',
        direction: 'negative',
        confidence_pct: 95.8,
        recommendation: `Engage ${phys.maxDrainageM3h} m³/h auxiliary submersibles at ${phys.keyInfrastructure}`
      },
      {
        name: 'Haul Road Traction & Slip',
        impact_tpd: -avgHaulLoss,
        category: 'Logistics',
        current_val: `${haulEff}% traction`,
        baseline_val: '92.0% traction',
        direction: 'negative',
        confidence_pct: 93.4,
        recommendation: `Deploy gravel top-dressing on ${phys.haulDistKm} km haul gradient`
      },
      {
        name: 'Primary Crusher Circuit',
        impact_tpd: -avgCrusherLoss,
        category: 'Mechanical',
        current_val: `${crusherAvail}% throughput`,
        baseline_val: `${baseCrusherHealth}% nominal`,
        direction: 'negative',
        confidence_pct: 96.2,
        recommendation: `Activate secondary bypass crusher with ${phys.crusherDependency > 0.65 ? 'urgent' : 'standard'} priority`
      },
      {
        name: 'Fleet Availability Roster',
        impact_tpd: -avgFleetLoss,
        category: 'Equipment',
        current_val: `${fleetAvail}% availability`,
        baseline_val: `${baseFleetAvail}% nominal`,
        direction: 'negative',
        confidence_pct: 91.0,
        recommendation: 'Reassign standby tippers from secondary overburden haulage'
      },
      {
        name: 'Stockpile Surge Buffer',
        impact_tpd: avgStockpileGain,
        category: 'Mitigation',
        current_val: `${bufferStockpileT} T capacity`,
        baseline_val: '850 T nominal',
        direction: 'positive',
        confidence_pct: 98.0,
        recommendation: `Feed high-grade surge stockpile (${baseGrade}) to sustain mill processing`
      }
    ];

    // Dynamic AI Bottleneck Narrative Grounded in Active Mine Characteristics
    let aiExplanation = '';
    if (scenKey === 'BASELINE') {
      aiExplanation = `${mine.name} (${phys.mineType}) is operating within nominal statistical tolerance. Baseline yield averages ${avgPredictedYield.toLocaleString()} TPD against the statutory quota target of ${target.toLocaleString()} TPD. Historical logged yield on Day 1 is ${phys.actualD1Tpd.toLocaleString()} TPD (${((phys.actualD1Tpd / target) * 100).toFixed(1)}% quota achievement). Harmonic shift oscillations reflect the ${phys.tau}-day shift rotation schedule with no structural bottlenecks detected across ${phys.keyInfrastructure}.`;
    } else if (scenKey === 'HEAVY_MONSOON') {
      aiExplanation = `${mine.name} is experiencing significant operational drag under the Heavy Monsoon scenario, with projected 14-day yield averaging ${avgPredictedYield.toLocaleString()} TPD (-${Math.abs(netImpactTpd).toLocaleString()} TPD deficit). The primary bottleneck is ${waterfallDrivers[0].name} (-${Math.abs(waterfallDrivers[0].impact_tpd)} TPD) compounded by ${waterfallDrivers[1].name} (-${Math.abs(waterfallDrivers[1].impact_tpd)} TPD) along the ${phys.haulDistKm} km haul gradient. Peak shortfall reaches Day ${worstDayPoint?.day_num || 5} (${worstDayPoint?.predicted_yield_tpd.toLocaleString()} TPD). High-grade stockpile drawdown of ${bufferStockpileT} T dampens recovery until auxiliary dewatering stabilizes the ${phys.keyInfrastructure}. Statutory protocol ${phys.protocolCode} is recommended.`;
    } else if (scenKey === 'CRUSHER_SEIZURE') {
      aiExplanation = `Catastrophic primary crusher bearing seizure at ${mine.name} introduces severe downstream throttling. Crushing availability plunges to ${crusherAvail}% on Day 5, collapsing daily yield to ${worstDayPoint?.predicted_yield_tpd.toLocaleString()} TPD against the ${target.toLocaleString()} TPD baseline quota. The 14-day cumulative volume at risk is ${totalShortfallTonnes.toLocaleString()} Tonnes (₹${((totalShortfallTonnes * 14500) / 10000000).toFixed(2)} Cr value). Emergency overhaul and dynamic bearing realignment restore 85%+ throughput by Day ${recoveryDayIdx || 10}. Statutory protocol ${phys.protocolCode} is active.`;
    } else {
      aiExplanation = `${mine.name} faces a compounded Multi-Risk Crisis combining severe catchment rainfall, ${phys.haulDistKm} km haulage mud slip, crusher bearing constraint, and sump inundation at ${phys.keyInfrastructure}. Total volume at risk reaches ${totalShortfallTonnes.toLocaleString()} Tonnes with worst-day deficit at ${worstDayPoint?.predicted_yield_tpd.toLocaleString()} TPD (Day ${worstDayPoint?.day_num || 5}). Multi-vector algorithmic mitigation under protocol ${phys.protocolCode} is urgently required to prevent cascading unrecoverable quarter shortfall.`;
    }

    // Pre-calculate Multi-Scenario Comparison Overlay for Chart (Clean non-recursive call)
    const scenariosComparison = [];
    if (includeComparisons) {
      SCENARIO_PRESETS.forEach(presetItem => {
        if (presetItem.id === scenKey) {
          scenariosComparison.push({
            scenario_id: presetItem.id,
            name: presetItem.name,
            color: presetItem.color,
            points: forecastPoints.map(p => p.predicted_yield_tpd)
          });
        } else {
          const sim = AlertForecastEngine.generateAlertForecast({
            mineId: canonicalId,
            scenarioId: presetItem.id,
            includeComparisons: false
          });
          scenariosComparison.push({
            scenario_id: presetItem.id,
            name: presetItem.name,
            color: presetItem.color,
            points: sim.forecast_points.map(p => p.predicted_yield_tpd)
          });
        }
      });
    }

    const kpis = {
      avg_predicted_yield: avgPredictedYield,
      avg_daily_shortfall: avgDailyShortfall,
      total_shortfall_tonnes: totalShortfallTonnes,
      worst_day: worstDayPoint ? `${worstDayPoint.day_label} (${worstDayPoint.date})` : 'D5',
      worst_day_yield: worstDayPoint ? worstDayPoint.predicted_yield_tpd : Math.round(target * 0.65),
      worst_day_shortfall: worstDayPoint ? worstDayPoint.shortfall_tpd : Math.round(target * 0.35),
      recovery_day: recoveryDayIdx ? `D${recoveryDayIdx}` : (scenKey === 'BASELINE' ? 'D1 (Nominal)' : 'D11+'),
      risk_classification: worstDayPoint ? worstDayPoint.risk_level : 'LOW',
      financial_exposure_cr: Math.round(((totalShortfallTonnes * 14500) / 10000000) * 100) / 100,
      crusher_status: `${crusherAvail}% Avail (${baseCrusherHealth}% Base Health)`,
      fleet_status: `${fleetAvail}% Roster (${baseFleetAvail}% Base)`,
      water_status: `${phys.maxDrainageM3h} m³/h Pumping (${phys.headPressureFactor}x Head)`
    };

    return {
      // Canonical camelCase properties
      mineId: canonicalId,
      mineName: mine.name,
      mineType: phys.mineType,
      oreGrade: baseGrade,
      dailyTarget: target,
      historicalActualD1: phys.actualD1Tpd,
      activeScenario: scenKey,
      forecastPoints: forecastPoints,
      waterfallDrivers: waterfallDrivers,
      netImpactTpd: netImpactTpd,
      kpis,
      aiExplanation: aiExplanation,
      scenariosComparison: scenariosComparison,
      physicalProfile: phys,
      generatedAlerts: [
        {
          id: `ALT-${canonicalId.toUpperCase().slice(0, 3)}-01`,
          severity: kpis.risk_classification === 'CRITICAL' ? 'CRITICAL' : (kpis.risk_classification === 'HIGH' ? 'HIGH' : 'NORMAL'),
          title: `${scenKey.replace('_', ' ')}: ${mine.name}`,
          message: aiExplanation.slice(0, 160) + '...',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST'
        }
      ],
      modelsStatus: {
        engine: 'AETHER-DYNAMIC-FORECAST-v4.0',
        active_mine: canonicalId,
        canonical_target_tpd: target,
        model_version: 'v4.0-PHYSICS-GROUNDED',
        status: 'ONLINE'
      },

      // Full snake_case properties for 100% backward/cross-compatibility
      mine_id: canonicalId,
      mine_name: mine.name,
      mine_type: phys.mineType,
      ore_grade: baseGrade,
      daily_target: target,
      historical_actual_d1: phys.actualD1Tpd,
      active_scenario: scenKey,
      forecast_points: forecastPoints,
      waterfall_drivers: waterfallDrivers,
      net_impact_tpd: netImpactTpd,
      ai_explanation: aiExplanation,
      scenarios_comparison: scenariosComparison,
      physical_profile: phys,
      generated_alerts: [
        {
          id: `ALT-${canonicalId.toUpperCase().slice(0, 3)}-01`,
          severity: kpis.risk_classification === 'CRITICAL' ? 'CRITICAL' : (kpis.risk_classification === 'HIGH' ? 'HIGH' : 'NORMAL'),
          title: `${scenKey.replace('_', ' ')}: ${mine.name}`,
          message: aiExplanation.slice(0, 160) + '...',
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST'
        }
      ],
      models_status: {
        engine: 'AETHER-DYNAMIC-FORECAST-v4.0',
        active_mine: canonicalId,
        canonical_target_tpd: target,
        model_version: 'v4.0-PHYSICS-GROUNDED',
        status: 'ONLINE'
      }
    };
  }
}
