import { MOIL_MINE_REGISTRY } from './mineRegistry.js';

/**
 * AETHER Authoritative Discrete-Event Operational Scenario Simulation Engine
 *
 * Deterministic multi-variable physics & discrete-event simulation model
 * computing live interactions across weather, haulage, crushing, dewatering,
 * shaft hoisting, fleet SCADA telemetry, and production quotas for all 10 MOIL assets.
 */

// Mine-Specific Spatial & Geotechnical Profiles (10 Canonical Assets)
export const MINE_SPATIAL_PROFILES = {
  balaghat: {
    type: 'UNDERGROUND_SHAFT',
    depthMeters: 385,
    levels: [-140, -180, -240, -385],
    activeLevel: -180,
    headframeHeightMeters: 42,
    winderSpeedMs: 12.5,
    shaftCapacityTPD: 6200,
    orebodyDip: '70° S',
    oreThicknessM: 14.5,
    rockType: 'Mica Schist & Braunite-Gondite',
    benchCount: 0,
    rampGradePct: 0,
    haulDistanceKm: 1.8,
    primaryEquipment: 'Sandvik LH517i LHD & Double-Drum Friction Winder',
    crusherLocation: 'Surface Beneficiation Plant (Pad A)',
    sumpCapacityM3: 4500,
    baseInflowM3h: 120
  },
  tirodi: {
    type: 'OPENCAST_AMPHITHEATRE',
    depthMeters: 105,
    levels: [345, 315, 285, 255, 240], // Bench RLs
    activeLevel: 255,
    headframeHeightMeters: 0,
    winderSpeedMs: 0,
    shaftCapacityTPD: 0,
    orebodyDip: '45° NW',
    oreThicknessM: 8.2,
    rockType: 'Quartzite & Pegmatite',
    benchCount: 5,
    rampGradePct: 8.5,
    haulDistanceKm: 3.4,
    primaryEquipment: 'Komatsu HD785-7 & Komatsu PC2000-8 Shovel',
    crusherLocation: 'In-Pit Sizing Station CR-TIR',
    sumpCapacityM3: 3200,
    baseInflowM3h: 65
  },
  ukwa: {
    type: 'UNDERGROUND_ADIT',
    depthMeters: 180,
    levels: [-60, -120, -180],
    activeLevel: -120,
    headframeHeightMeters: 28,
    winderSpeedMs: 8.0,
    shaftCapacityTPD: 1850,
    orebodyDip: '35° SW',
    oreThicknessM: 6.5,
    rockType: 'Phyllite & Gondite',
    benchCount: 0,
    rampGradePct: 0,
    haulDistanceKm: 2.1,
    primaryEquipment: 'Overland Conveyor & Sandvik LHD Fleet',
    crusherLocation: 'Portal Sizing Hopper',
    sumpCapacityM3: 2800,
    baseInflowM3h: 80
  },
  munsar: {
    type: 'UNDERGROUND_SHAFT',
    depthMeters: 240,
    levels: [-90, -140, -190, -240],
    activeLevel: -140,
    headframeHeightMeters: 36,
    winderSpeedMs: 10.0,
    shaftCapacityTPD: 2400,
    orebodyDip: '60° S',
    oreThicknessM: 7.8,
    rockType: 'Mansar Mica Schist',
    benchCount: 0,
    rampGradePct: 0,
    haulDistanceKm: 1.5,
    primaryEquipment: 'Vertical Skip Winder & Sandvik LH410',
    crusherLocation: 'Shaft Collar Discharge',
    sumpCapacityM3: 3100,
    baseInflowM3h: 95
  },
  kandri: {
    type: 'TRANSITION_PIT_SHAFT',
    depthMeters: 160,
    levels: [320, 290, 260, 200],
    activeLevel: 260,
    headframeHeightMeters: 32,
    winderSpeedMs: 9.5,
    shaftCapacityTPD: 2800,
    orebodyDip: '55° SE',
    oreThicknessM: 9.1,
    rockType: 'Gondite with Pyrolusite',
    benchCount: 3,
    rampGradePct: 7.8,
    haulDistanceKm: 2.2,
    primaryEquipment: 'Komatsu HD785 & Underground Shaft Incline',
    crusherLocation: 'Central Beneficiation CR-KAN',
    sumpCapacityM3: 3500,
    baseInflowM3h: 75
  },
  gumgaon: {
    type: 'UNDERGROUND_SHAFT',
    depthMeters: 320,
    levels: [-100, -180, -260, -320],
    activeLevel: -180,
    headframeHeightMeters: 40,
    winderSpeedMs: 11.5,
    shaftCapacityTPD: 3400,
    orebodyDip: '65° S',
    oreThicknessM: 11.0,
    rockType: 'Braunite-Quartzite',
    benchCount: 0,
    rampGradePct: 0,
    haulDistanceKm: 1.9,
    primaryEquipment: 'Heavy Production Winder & Sandvik LH517i',
    crusherLocation: 'Surface Secondary Sizing CR-GUM',
    sumpCapacityM3: 4100,
    baseInflowM3h: 110
  },
  chikla: {
    type: 'TRANSITION_PIT_SHAFT',
    depthMeters: 220,
    levels: [310, 270, 230, 150],
    activeLevel: 230,
    headframeHeightMeters: 34,
    winderSpeedMs: 10.5,
    shaftCapacityTPD: 4100,
    orebodyDip: '50° NW',
    oreThicknessM: 12.4,
    rockType: 'Sausar Gondite Braunite',
    benchCount: 4,
    rampGradePct: 8.0,
    haulDistanceKm: 2.8,
    primaryEquipment: 'Komatsu Fleet & Production Hoist',
    crusherLocation: 'North Quarry Sizing Station',
    sumpCapacityM3: 3900,
    baseInflowM3h: 90
  },
  'dongri-buzurg': {
    type: 'OPENCAST_AMPHITHEATRE',
    depthMeters: 120,
    levels: [360, 330, 300, 270, 240],
    activeLevel: 270,
    headframeHeightMeters: 0,
    winderSpeedMs: 0,
    shaftCapacityTPD: 0,
    orebodyDip: '40° S',
    oreThicknessM: 15.0,
    rockType: 'Supergene Peroxide & Pyrolusite',
    benchCount: 5,
    rampGradePct: 8.2,
    haulDistanceKm: 4.1,
    primaryEquipment: 'High-Capacity Komatsu 785 Fleet & PC2000 Shovels',
    crusherLocation: 'Main Beneficiation & Battery Grade Plant CR-DB',
    sumpCapacityM3: 5200,
    baseInflowM3h: 70
  },
  ramtek: {
    type: 'OPENCAST_AMPHITHEATRE',
    depthMeters: 65,
    levels: [310, 285, 260, 245],
    activeLevel: 260,
    headframeHeightMeters: 0,
    winderSpeedMs: 0,
    shaftCapacityTPD: 0,
    orebodyDip: '30° N',
    oreThicknessM: 5.4,
    rockType: 'Manganiferous Schist',
    benchCount: 3,
    rampGradePct: 7.2,
    haulDistanceKm: 1.8,
    primaryEquipment: 'Komatsu HD465 & PC1250 Excavators',
    crusherLocation: 'Quarry Perimeter Sizing Station',
    sumpCapacityM3: 2100,
    baseInflowM3h: 45
  },
  bhandara: {
    type: 'OPENCAST_AMPHITHEATRE',
    depthMeters: 80,
    levels: [320, 290, 260, 240],
    activeLevel: 260,
    headframeHeightMeters: 0,
    winderSpeedMs: 0,
    shaftCapacityTPD: 0,
    orebodyDip: '35° NE',
    oreThicknessM: 6.8,
    rockType: 'Braunite-Gondite Blend',
    benchCount: 3,
    rampGradePct: 7.5,
    haulDistanceKm: 2.3,
    primaryEquipment: 'Komatsu HD785 Fleet & Jaw Crusher Station',
    crusherLocation: 'ROM Stockpile Crusher CR-BHA',
    sumpCapacityM3: 2400,
    baseInflowM3h: 50
  }
};

/**
 * Calculate deterministic multi-physics simulation state
 */
export const calculateSimulationState = (
  mineId,
  scenarioId = 'BASELINE_RESET',
  userOffsets = {},
  timeHours = 2.24,
  activeIntervention = null
) => {
  const mine = MOIL_MINE_REGISTRY[mineId] || MOIL_MINE_REGISTRY.balaghat;
  const spatial = MINE_SPATIAL_PROFILES[mineId] || MINE_SPATIAL_PROFILES.balaghat;
  const isUnderground = (mine.mineType || '').toLowerCase().includes('underground');
  const target = mine.productionTarget || 3000;
  const rainSens = mine.rainfallSensitivity || 1.2;
  const pfx = (mine.shortName || 'MIN').slice(0, 3).toUpperCase();

  // 1. Base Calibrated Parameters
  let baseRain = mine.baselineRainfallMm || 18.0;
  let baseCrusher = mine.crusherHealthBase || 88;
  let baseFleet = mine.fleetAvailabilityBase || 90;
  let baseHaul = !isUnderground ? 88 : 94;
  let baseDewatering = isUnderground ? 95 : 85;

  // 2. Scenario Perturbations (15 Scenarios)
  let scenRainDelta = 0;
  let scenCrusherDelta = 0;
  let scenFleetDelta = 0;
  let scenHaulDelta = 0;
  let scenDewateringDelta = 0;

  if (scenarioId === 'HEAVY_MONSOON') {
    scenRainDelta = 75 * rainSens;
    scenHaulDelta = !isUnderground ? -38 : -18;
    scenDewateringDelta = isUnderground ? -45 : -25;
    scenFleetDelta = -12;
  } else if (scenarioId === 'CRUSHER_SEIZURE') {
    scenCrusherDelta = -75;
    scenFleetDelta = -18;
  } else if (scenarioId === 'HAUL_ROAD_FAILURE') {
    scenHaulDelta = -48;
    scenFleetDelta = -22;
    scenRainDelta = 15;
  } else if (scenarioId === 'FLEET_BREAKDOWN') {
    scenFleetDelta = -55;
    scenHaulDelta = -30;
  } else if (scenarioId === 'SHAFT_HOIST_FAILURE') {
    scenFleetDelta = isUnderground ? -65 : -20;
    scenCrusherDelta = -35;
  } else if (scenarioId === 'DEWATERING_FAILURE') {
    scenDewateringDelta = -70;
    scenRainDelta = 25;
    scenHaulDelta = -25;
  } else if (scenarioId === 'POWER_FAILURE') {
    scenCrusherDelta = -60;
    scenDewateringDelta = -50;
    scenFleetDelta = -40;
  } else if (scenarioId === 'GEOLOGICAL_HAZARD') {
    scenHaulDelta = -35;
    scenFleetDelta = -25;
  } else if (scenarioId === 'MULTI_RISK_CRISIS') {
    scenRainDelta = 65 * rainSens;
    scenCrusherDelta = -45;
    scenFleetDelta = -32;
    scenHaulDelta = -35;
    scenDewateringDelta = -35;
  } else if (scenarioId === 'FIRE_INCIDENT') {
    scenCrusherDelta = -55;
    scenFleetDelta = -20;
  } else if (scenarioId === 'SLOPE_INSTABILITY') {
    scenHaulDelta = -40;
    scenFleetDelta = -25;
  } else if (scenarioId === 'EXTREME_RAINFALL') {
    scenRainDelta = 120 * rainSens;
    scenHaulDelta = -50;
    scenDewateringDelta = -60;
    scenFleetDelta = -30;
  } else if (scenarioId === 'VENTILATION_FAILURE') {
    scenFleetDelta = isUnderground ? -50 : -15;
  } else if (scenarioId === 'BLASTING_DISRUPTION') {
    scenFleetDelta = -30;
    scenHaulDelta = -20;
  }

  // 3. Intervention Countermeasures
  let intervRainBonus = 0;
  let intervCrusherBonus = 0;
  let intervFleetBonus = 0;
  let intervHaulBonus = 0;
  let intervDewateringBonus = 0;

  if (activeIntervention === 'PUMP_BOOST') {
    intervDewateringBonus = +38;
  } else if (activeIntervention === 'TRUCK_DEPLOY') {
    intervFleetBonus = +22;
    intervHaulBonus = +15;
  } else if (activeIntervention === 'CRUSHER_THROTTLE') {
    intervCrusherBonus = +42;
  } else if (activeIntervention === 'ROAD_BALLAST') {
    intervHaulBonus = +35;
  }

  // Combined Physical Parameters
  const rainfall = Math.max(0, Math.min(250, Math.round(baseRain + scenRainDelta + (userOffsets.rainfall || 0) - intervRainBonus)));
  const crusher = Math.max(5, Math.min(100, Math.round(baseCrusher + scenCrusherDelta + (userOffsets.crusher || 0) + intervCrusherBonus)));
  const fleet = Math.max(20, Math.min(100, Math.round(baseFleet + scenFleetDelta + (userOffsets.fleet || 0) + intervFleetBonus)));
  const haul = Math.max(20, Math.min(100, Math.round(baseHaul + scenHaulDelta + (userOffsets.haul || 0) + intervHaulBonus)));
  const dewatering = Math.max(10, Math.min(100, Math.round(baseDewatering + scenDewateringDelta + (userOffsets.dewatering || 0) + intervDewateringBonus)));

  // 4. Physical Causal Degradation Penalties
  const timeFactor = Math.min(1.0, Math.max(0.15, (timeHours / 12)));
  const rainExcess = Math.max(0, rainfall - 20);
  const rainPenalty = (rainExcess * 0.22 * rainSens);
  const crusherPenalty = (100 - crusher) * 0.45;
  const fleetPenalty = (100 - fleet) * 0.35;
  const haulPenalty = (100 - haul) * 0.28;
  const pumpPenalty = (100 - dewatering) * 0.25;

  const totalPenaltyRaw = (rainPenalty + crusherPenalty + fleetPenalty + haulPenalty + pumpPenalty) * 0.65;
  const totalLossPct = scenarioId === 'BASELINE_RESET' ? 0 : Math.min(85, Math.max(0, totalPenaltyRaw * timeFactor));
  const lossTonnes = Math.round(target * (totalLossPct / 100));
  const projectedYield = Math.max(0, target - lossTonnes);
  const revenueRiskLakhs = Math.round((lossTonnes * 14200) / 100000);
  const targetAchievement = ((projectedYield / target) * 100).toFixed(1);

  // 5. Dynamic Sump Hydrology Model
  const baseInflow = spatial.baseInflowM3h;
  const rainInflowAdd = Math.round(rainfall * 1.8 * rainSens);
  const totalInflowM3h = baseInflow + rainInflowAdd;
  const pumpDischargeRate = Math.round((dewatering / 100) * (spatial.sumpCapacityM3 / 8));
  const netInflowRate = totalInflowM3h - pumpDischargeRate;
  const waterLevelBaseMeters = isUnderground ? 2.4 : 1.6;
  const sumpWaterLevel = Math.max(0.8, Math.min(12.0, (waterLevelBaseMeters + (netInflowRate * timeHours * 0.012))).toFixed(1));
  const pumpUtilization = Math.min(100, Math.round((totalInflowM3h / (pumpDischargeRate || 1)) * 65));

  // 6. Dynamic Crusher Sizing Throughput
  const baseThroughputTPH = Math.round(target / 18);
  const crusherThroughput = Math.max(0, Math.round(baseThroughputTPH * (crusher / 100) * (haul / 100)));

  // 7. Dynamic Shaft Hoisting Operations
  const hoistSpeed = (spatial.winderSpeedMs * (fleet / 100)).toFixed(1);
  const currentCageDepth = Math.round(Math.abs(spatial.activeLevel) * (0.3 + 0.7 * Math.sin(timeHours * Math.PI * 0.8)));

  // 8. Dynamic Event Timeline Milestones
  const events = [
    { time: '00:00', label: `${mine.name} Baseline Shift Handover`, status: 'OK', type: 'INFO' },
    { time: '00:32', label: scenarioId === 'HEAVY_MONSOON' ? `Precipitation intensifies to ${rainfall} mm/h` : scenarioId === 'CRUSHER_SEIZURE' ? `Crusher vibration exceeds 4.5 mm/s` : `Operational telemetry monitored`, status: 'ALERT', type: 'WARNING' },
    { time: '01:15', label: scenarioId === 'HEAVY_MONSOON' ? 'Haul road friction drops below 0.45' : scenarioId === 'CRUSHER_SEIZURE' ? 'Bearing thermal alarm triggered' : 'Sensor array nominal', status: 'WARNING', type: 'WARNING' },
    { time: '02:00', label: scenarioId === 'HEAVY_MONSOON' ? 'Sump water inflow exceeds nominal pump rating' : scenarioId === 'CRUSHER_SEIZURE' ? 'Secondary sizing feeder throttled' : 'Cycle pacing on schedule', status: totalLossPct > 15 ? 'CRITICAL' : 'OK', type: totalLossPct > 15 ? 'CRITICAL' : 'INFO' }
  ];

  if (activeIntervention) {
    events.push({
      time: '02:18',
      label: `AETHER Autonomous Intervention Activated: ${activeIntervention}`,
      status: 'RECOVERING',
      type: 'AI'
    });
    events.push({
      time: '02:45',
      label: `Protected Yield: +${Math.round(lossTonnes * 0.75)} TPD ($₹${Math.round(revenueRiskLakhs * 0.75)}L)`,
      status: 'RESOLVED',
      type: 'RECOVERY'
    });
  }

  // 9. AI Prescriptive Synthesis
  let aiTitle = 'Nominal Operational State';
  let aiDesc = 'All geotechnical, hydrology, and equipment signals are streaming within standard envelopes.';

  if (scenarioId === 'HEAVY_MONSOON') {
    aiTitle = 'Severe Road Slurry & Catchment Inundation';
    aiDesc = `Rainfall of ${rainfall} mm/h is saturating East Ramp. Traction loss will induce a -${lossTonnes} TPD yield deficit ($₹${revenueRiskLakhs}L risk). Immediate dewatering boost & gravel ballasting recommended.`;
  } else if (scenarioId === 'CRUSHER_SEIZURE') {
    aiTitle = 'Primary Jaw Crusher Bearing Seizure';
    aiDesc = `Vibration spectral harmonic peak at 42Hz indicates imminent drive bearing collapse. Throttling throughput from ${baseThroughputTPH} TPH to ${crusherThroughput} TPH and engaging bypass screen will protect ₹34.5L in equipment value.`;
  } else if (scenarioId === 'MULTI_RISK_CRISIS') {
    aiTitle = 'Multi-Risk Compound Cascade';
    aiDesc = `Concurrent precipitation and crusher harmonic drift is creating a multi-point bottleneck across extraction and sizing circuits. Total forecast deficit: -${lossTonnes} TPD.`;
  } else if (scenarioId === 'HAUL_ROAD_FAILURE') {
    aiTitle = 'Main Haul Ramp Slope Sloughing';
    aiDesc = `East Ramp traction loss extending haul cycle times to 28 min. Rerouting trucks to West Ridge Corridor recommended.`;
  } else if (scenarioId === 'FLEET_BREAKDOWN') {
    aiTitle = 'Heavy Dumper Outage';
    aiDesc = `Loss of lead haulage units throttling shovel face throughput. Standby HD465 deployment recommended.`;
  } else if (scenarioId === 'SHAFT_HOIST_FAILURE') {
    aiTitle = 'Winder Thyristor Interlock Trip';
    aiDesc = `Vertical ore hoisting paused between -180m and -240m. Auxiliary crosscut buffering engaged.`;
  } else if (scenarioId === 'DEWATERING_FAILURE') {
    aiTitle = 'Deep Sump Submersible Pump Trip';
    aiDesc = `Sump water level rising at 0.18 m/hr. Mobile diesel emergency pump unit deployment recommended.`;
  }

  return {
    mineId,
    mineName: mine.name,
    scenarioId,
    activeParameters: {
      rainfall,
      crusher,
      fleet,
      haul,
      dewatering
    },
    kpis: {
      productionDay: projectedYield,
      lossTonnes,
      revenueRiskLakhs,
      targetAchievement,
      crusherThroughput,
      fleetHealth: fleet,
      haulEfficiency: haul,
      sumpWaterLevel,
      pumpUtilization
    },
    shaft: {
      speed: hoistSpeed,
      currentDepth: currentCageDepth,
      targetLevel: spatial.activeLevel,
      status: scenarioId === 'SHAFT_HOIST_FAILURE' ? 'TRIPPED' : 'HOISTING'
    },
    weather: {
      condition: rainfall > 40 ? 'Heavy Inundation' : rainfall > 15 ? 'Moderate Rain' : 'Clear Skies',
      precipitationRate: rainfall,
      windSpeed: Math.round(14 + (rainfall * 0.15)),
      temperature: Math.round(29 - (rainfall * 0.05))
    },
    events,
    aiInsight: {
      title: aiTitle,
      description: aiDesc,
      recommendedIntervention: scenarioId === 'HEAVY_MONSOON' ? 'PUMP_BOOST' : scenarioId === 'CRUSHER_SEIZURE' ? 'CRUSHER_THROTTLE' : 'TRUCK_DEPLOY'
    },
    spatial
  };
};
