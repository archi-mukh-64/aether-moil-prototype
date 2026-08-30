/**
 * MOIL Risk & Feature Attribution Engine
 * Computes Mine Intelligence Index, 14-Day Dynamic Forecasts, and Ranked Feature Drivers.
 */

import { MINE_PROFILES } from './mineProfiles.js';

/**
 * Calculates the composite Mine Intelligence Score (0 - 100)
 */
export function calculateMineIntelligenceScore(mineId = 'balaghat', activeStress = null) {
  const mine = MINE_PROFILES[mineId] || MINE_PROFILES.balaghat;

  // Pillars:
  // 1. Production Health: (current vs daily target) * 25
  const prodRatio = Math.min(1.0, mine.currentOutputBase / mine.dailyTarget);
  const prodScore = prodRatio * 25;

  // 2. Equipment Health: crusher + fleet * 25
  const equipScore = ((mine.crusherHealthBase + mine.fleetAvailabilityBase) / 200) * 25;

  // 3. Environmental Stability: (1 - rainfallSens * 0.3) * 20
  const envScore = Math.max(10, (1.0 - (mine.rainfallSensitivity - 0.5) * 0.35) * 20);

  // 4. Exploration & Reserve Potential: (reserve / 20M) * 15
  const reserveScore = Math.min(15, (mine.reservePotentialM / 20) * 15);

  // 5. Sensor Reliability & Governance: sensorReliability * 15
  const sensorScore = mine.sensorReliability * 15;

  let baseIntelligence = Math.round(prodScore + equipScore + envScore + reserveScore + sensorScore);

  // If stress is active, deduct based on stress severity
  if (activeStress && activeStress.scenarioId) {
    const sev = activeStress.severity || 'HIGH';
    const mult = sev === 'CRITICAL' ? 18 : sev === 'HIGH' ? 12 : sev === 'MEDIUM' ? 7 : 3;
    baseIntelligence = Math.max(48, baseIntelligence - mult);
  }

  return baseIntelligence;
}

/**
 * Generates the 14-day dynamic forecast time-series for the selected mine and stress.
 */
export function generateForecastSeries(mineId = 'balaghat', activeStress = null) {
  const mine = MINE_PROFILES[mineId] || MINE_PROFILES.balaghat;
  const target = mine.dailyTarget;

  const baselineCurve = [
    { day: 'Day 1', actual: target - 40, target, predicted: target - 30, lowerBound: target - 170, upperBound: target + 90, rainfall: 12 },
    { day: 'Day 2', actual: target - 10, target, predicted: target - 20, lowerBound: target - 140, upperBound: target + 100, rainfall: 18 },
    { day: 'Day 3', actual: target - 70, target, predicted: target - 60, lowerBound: target - 210, upperBound: target + 70, rainfall: 24 },
    { day: 'Day 4', actual: target + 70, target, predicted: target + 20, lowerBound: target - 110, upperBound: target + 160, rainfall: 5 },
    { day: 'Day 5', actual: target, target, predicted: target - 10, lowerBound: target - 130, upperBound: target + 120, rainfall: 8 },
    { day: 'Day 6', actual: target - 140, target, predicted: target - 110, lowerBound: target - 240, upperBound: target + 20, rainfall: 42 },
    { day: 'Day 7 (Today)', actual: mine.currentOutputBase, target, predicted: mine.currentOutputBase + 10, lowerBound: mine.currentOutputBase - 120, upperBound: mine.currentOutputBase + 140, rainfall: 68 },
    { day: 'Day 8 (Proj)', actual: null, target, predicted: target - 280, lowerBound: target - 480, upperBound: target - 100, rainfall: 85 },
    { day: 'Day 9 (Proj)', actual: null, target, predicted: target - 320, lowerBound: target - 530, upperBound: target - 130, rainfall: 74 },
    { day: 'Day 10 (Proj)', actual: null, target, predicted: target - 170, lowerBound: target - 360, upperBound: target + 20, rainfall: 35 },
    { day: 'Day 11 (Proj)', actual: null, target, predicted: target - 20, lowerBound: target - 170, upperBound: target + 170, rainfall: 15 },
    { day: 'Day 12 (Proj)', actual: null, target, predicted: target + 100, lowerBound: target - 50, upperBound: target + 270, rainfall: 8 },
    { day: 'Day 13 (Proj)', actual: null, target, predicted: target + 150, lowerBound: target + 10, upperBound: target + 310, rainfall: 4 },
    { day: 'Day 14 (Proj)', actual: null, target, predicted: target + 170, lowerBound: target + 30, upperBound: target + 330, rainfall: 2 }
  ];

  // If stress is active, dynamically scale Day 8 to Day 10 deficit
  if (activeStress && activeStress.scenarioId) {
    const sev = activeStress.severity || 'HIGH';
    const mult = sev === 'CRITICAL' ? 1.6 : sev === 'HIGH' ? 1.0 : sev === 'MEDIUM' ? 0.6 : 0.3;
    const deficitT = Math.round(target * 0.18 * mult);

    return baselineCurve.map((d, idx) => {
      if (idx >= 7 && idx <= 10) {
        const p = Math.max(Math.round(target * 0.5), target - deficitT - (idx === 8 ? 80 : 0));
        return {
          ...d,
          predicted: p,
          lowerBound: p - 220,
          upperBound: p + 160
        };
      }
      return d;
    });
  }

  return baselineCurve;
}

/**
 * Computes the 5-pillar Bayesian trust scores for the selected mine.
 */
export function generateTrustPillars(mineId = 'balaghat', activeStress = null) {
  const mine = MINE_PROFILES[mineId] || MINE_PROFILES.balaghat;

  let baseTrust = Math.round(mine.sensorReliability * 96 * 10) / 10;
  let dataQuality = Math.round(mine.sensorReliability * 98 * 10) / 10;
  let certainty = 93.4;
  let stability = 95.1;
  let historical = Math.round((1.0 - mine.historicalShortfallTendency * 0.2) * 96 * 10) / 10;

  if (activeStress && activeStress.scenarioId) {
    const sev = activeStress.severity || 'HIGH';
    const mult = sev === 'CRITICAL' ? 4.5 : sev === 'HIGH' ? 2.5 : sev === 'MEDIUM' ? 1.2 : 0.5;
    certainty = Math.round((certainty - mult * 1.5) * 10) / 10;
    stability = Math.round((stability - mult * 1.2) * 10) / 10;
    baseTrust = Math.round(((dataQuality + certainty + stability + historical) / 4) * 10) / 10;
  }

  return [
    {
      name: 'Overall Governance Trust',
      score: baseTrust,
      description: `Composite Bayesian calibration across all IoT sensor streams at ${mine.name}.`,
      grade: baseTrust > 92 ? 'Exceptional (Tier 1)' : 'High Fidelity',
      trend: '+0.8%'
    },
    {
      name: 'Input Data Quality',
      score: dataQuality,
      description: 'Sensor completeness, telemetry frame integrity, and satellite reflectance clarity.',
      grade: 'High Fidelity',
      trend: '+1.1%'
    },
    {
      name: 'Model Certainty',
      score: certainty,
      description: 'Prediction variance margin and ensemble stability under adverse shock tests.',
      grade: certainty > 90 ? 'Robust' : 'Active Variance',
      trend: '-0.4%'
    },
    {
      name: 'Signal Stability',
      score: stability,
      description: 'Zero drift in real-time telemetry from underground shaft vibration & pit piezometers.',
      grade: 'Calibrated',
      trend: '+0.4%'
    },
    {
      name: 'Historical Verification',
      score: historical,
      description: 'Backtested production accuracy against MOIL audited shift reports over 180 days.',
      grade: 'Audited',
      trend: '+1.5%'
    }
  ];
}

// Canonical Comprehensive 10-Mine Operational Threat Matrix
export const CANONICAL_MOIL_THREATS = [
  // 1. Balaghat Mine
  {
    id: "ALT-BAL-101",
    mineId: "balaghat",
    mine_id: "balaghat",
    mineName: "Balaghat Mine",
    mine_name: "Balaghat Mine",
    mine: "Balaghat Mine",
    state: "Madhya Pradesh",
    title: "Primary Crusher High-Frequency Harmonic Vibration Drift",
    description: "Spectral vibration on Crusher CR-BAL-01 reached 4.85 mm/s (normal: 2.1 mm/s). TreeSHAP attributes 34% risk to eccentric bearing race wear.",
    primaryDriver: "Crusher CR-BAL-01 drive bearing vibration spike (4.85 mm/s vs 2.1 mm/s baseline)",
    severity: "CRITICAL",
    level: "Critical",
    category: "Mechanical",
    source: "SCADA Telemetry & TreeSHAP",
    sensorType: "Tri-Axial Accelerometer (Piezoelectric)",
    sensor_type: "Tri-Axial Accelerometer (Piezoelectric)",
    sensorId: "VIB-CR-01",
    sensor_id: "VIB-CR-01",
    riskScore: 89,
    risk_score: 89,
    probability: "88%",
    affectedSystem: "Primary Crushing Circuit",
    affected_system: "Primary Crushing Circuit",
    affectedEquipment: "Nordberg C160 Jaw Crusher (CR-BAL-01)",
    affected_equipment: "Nordberg C160 Jaw Crusher (CR-BAL-01)",
    productionImpactTpd: 1116,
    production_impact_tpd: 1116,
    expectedImpact: "-1,116 T/day Deficit",
    financialExposure: "₹1.62 Cr",
    financial_exposure: "₹1.62 Cr",
    recommendedAction: "Engage secondary jaw crusher standby and throttle feed conveyor to 70%.",
    recommended_action: "Engage secondary jaw crusher standby and throttle feed conveyor to 70%.",
    status: "ACTIVE",
    acknowledgementState: false,
    acknowledgement_state: false,
    escalationState: false,
    escalation_state: false,
    confidence: "95.4%"
  },
  {
    id: "ALT-BAL-102",
    mineId: "balaghat",
    mine_id: "balaghat",
    mineName: "Balaghat Mine",
    mine_name: "Balaghat Mine",
    mine: "Balaghat Mine",
    state: "Madhya Pradesh",
    title: "-185m Level Sump Dewatering Ingress Surge",
    description: "Inflow rate into main shaft drainage sump reached 820 m³/h vs maximum pump discharge rate of 900 m³/h (91.1% capacity utilization).",
    primaryDriver: "Deep Sump inflow surge (820 m³/h vs 900 m³/h pump max capacity)",
    severity: "HIGH",
    level: "High",
    category: "Hydrogeological",
    source: "SCADA Flow Meter",
    sensorType: "Electromagnetic Flow Transducer",
    sensor_type: "Electromagnetic Flow Transducer",
    sensorId: "FLOW-SMP-01",
    sensor_id: "FLOW-SMP-01",
    riskScore: 78,
    risk_score: 78,
    probability: "76%",
    affectedSystem: "Underground Dewatering Substation",
    affected_system: "Underground Dewatering Substation",
    affectedEquipment: "Kirloskar 250 kW High-Head Submersible (PUMP-BAL-01)",
    affected_equipment: "Kirloskar 250 kW High-Head Submersible (PUMP-BAL-01)",
    productionImpactTpd: 720,
    production_impact_tpd: 720,
    expectedImpact: "-720 T/day Deficit",
    financialExposure: "₹1.04 Cr",
    financial_exposure: "₹1.04 Cr",
    recommendedAction: "Start auxiliary 250 kW Kirloskar submersible pump on level 6 drainage header.",
    recommended_action: "Start auxiliary 250 kW Kirloskar submersible pump on level 6 drainage header.",
    status: "ACTIVE",
    acknowledgementState: false,
    acknowledgement_state: false,
    escalationState: false,
    escalation_state: false,
    confidence: "93.8%"
  },
  {
    id: "ALT-BAL-103",
    mineId: "balaghat",
    mine_id: "balaghat",
    mineName: "Balaghat Mine",
    mine_name: "Balaghat Mine",
    mine: "Balaghat Mine",
    state: "Madhya Pradesh",
    title: "3.2MW Friction Winder Drive Thermal Anomaly",
    description: "Stator winding thermal sensor on south shaft winder registered 78.4°C during high-speed hoisting cycle.",
    primaryDriver: "Winder motor stator thermal gradient (+14°C above baseline)",
    severity: "ELEVATED",
    level: "Elevated",
    category: "Electrical",
    source: "Drive SCADA Telemetry",
    sensorType: "PT100 RTD Temperature Probe",
    sensor_type: "PT100 RTD Temperature Probe",
    sensorId: "TEMP-WND-02",
    sensor_id: "TEMP-WND-02",
    riskScore: 64,
    risk_score: 64,
    probability: "62%",
    affectedSystem: "Main Shaft Hoisting System",
    affected_system: "Main Shaft Hoisting System",
    affectedEquipment: "3.2MW Thyristor Friction Winder (HOIST-BAL-01)",
    affected_equipment: "3.2MW Thyristor Friction Winder (HOIST-BAL-01)",
    productionImpactTpd: 450,
    production_impact_tpd: 450,
    expectedImpact: "-450 T/day Deficit",
    financialExposure: "₹0.65 Cr",
    financial_exposure: "₹0.65 Cr",
    recommendedAction: "Reduce cage cycle acceleration by 15% and inspect forced-air cooling ducts.",
    recommended_action: "Reduce cage cycle acceleration by 15% and inspect forced-air cooling ducts.",
    status: "ACTIVE",
    acknowledgementState: false,
    acknowledgement_state: false,
    escalationState: false,
    escalation_state: false,
    confidence: "91.2%"
  },
  {
    id: "ALT-BAL-104",
    mineId: "balaghat",
    mine_id: "balaghat",
    mineName: "Balaghat Mine",
    mine_name: "Balaghat Mine",
    mine: "Balaghat Mine",
    state: "Madhya Pradesh",
    title: "Surface Stockpile Blending Grade Variance",
    description: "Feed silica variance detected at 11.2% against 9.5% specification threshold for metallurgical furnace batching.",
    primaryDriver: "Stockpile SiO2 segregation (11.2% vs 9.5% target)",
    severity: "LOW",
    level: "Low",
    category: "Production",
    source: "XRF Online Belt Analyzer",
    sensorType: "Prompt Gamma Neutron Activation",
    sensor_type: "Prompt Gamma Neutron Activation",
    sensorId: "XRF-BLD-01",
    sensor_id: "XRF-BLD-01",
    riskScore: 28,
    risk_score: 28,
    probability: "25%",
    affectedSystem: "Surface Ore Blending Yard",
    affected_system: "Surface Ore Blending Yard",
    affectedEquipment: "High-Grade Surge Stockpile (STK-BAL-04)",
    affected_equipment: "High-Grade Surge Stockpile (STK-BAL-04)",
    productionImpactTpd: 120,
    production_impact_tpd: 120,
    expectedImpact: "-120 T/day Deficit",
    financialExposure: "₹0.17 Cr",
    financial_exposure: "₹0.17 Cr",
    recommendedAction: "Adjust reclaimer draw from Stockpile Stack #2 to stabilize blend.",
    recommended_action: "Adjust reclaimer draw from Stockpile Stack #2 to stabilize blend.",
    status: "ACTIVE",
    acknowledgementState: false,
    acknowledgement_state: false,
    escalationState: false,
    escalation_state: false,
    confidence: "88.0%"
  },

  // 2. Dongri Buzurg Mine
  {
    id: "ALT-DON-201",
    mineId: "dongri-buzurg",
    mine_id: "dongri-buzurg",
    mineName: "Dongri Buzurg Mine",
    mine_name: "Dongri Buzurg Mine",
    mine: "Dongri Buzurg Mine",
    state: "Maharashtra",
    title: "Dioxide Plant Beneficiation Feed Moisture Surge",
    description: "ROM feed moisture reached 12.8% vs statutory mill target of <8.5%, risking screen blinding in dry magnetic separation line.",
    primaryDriver: "ROM feed moisture excess (12.8% vs <8.5% mill spec)",
    severity: "HIGH",
    level: "High",
    category: "Production",
    source: "Beneficiation SCADA",
    sensorType: "Microwave Moisture Analyzer",
    sensor_type: "Microwave Moisture Analyzer",
    sensorId: "MST-MILL-01",
    sensor_id: "MST-MILL-01",
    riskScore: 76,
    risk_score: 76,
    probability: "74%",
    affectedSystem: "Manganese Dioxide Beneficiation Plant",
    affected_system: "Manganese Dioxide Beneficiation Plant",
    affectedEquipment: "High-Gradient Magnetic Separator (MILL-DON-01)",
    affected_equipment: "High-Gradient Magnetic Separator (MILL-DON-01)",
    productionImpactTpd: 640,
    production_impact_tpd: 640,
    expectedImpact: "-640 T/day Deficit",
    financialExposure: "₹0.93 Cr",
    financial_exposure: "₹0.93 Cr",
    recommendedAction: "Blend feed with covered dry high-grade stockpile (Stack #4) at 1:1 ratio.",
    recommended_action: "Blend feed with covered dry high-grade stockpile (Stack #4) at 1:1 ratio.",
    status: "ACTIVE",
    acknowledgementState: false,
    acknowledgement_state: false,
    escalationState: false,
    escalation_state: false,
    confidence: "94.0%"
  },
  {
    id: "ALT-DON-202",
    mineId: "dongri-buzurg",
    mine_id: "dongri-buzurg",
    mineName: "Dongri Buzurg Mine",
    mine_name: "Dongri Buzurg Mine",
    mine: "Dongri Buzurg Mine",
    state: "Maharashtra",
    title: "South-West Bench Slope Groundwater Hydrostatic Pressure",
    description: "Piezometer PIEZ-DON-03 indicated pore water pressure rise of +1.8 bar following catchment runoff influx.",
    primaryDriver: "Pore water pressure anomaly (+1.8 bar above statutory limit)",
    severity: "CRITICAL",
    level: "Critical",
    category: "Geotechnical",
    source: "Slope Stability Radar & Piezometer",
    sensorType: "Vibrating Wire Piezometer",
    sensor_type: "Vibrating Wire Piezometer",
    sensorId: "PIEZ-DON-03",
    sensor_id: "PIEZ-DON-03",
    riskScore: 86,
    risk_score: 86,
    probability: "84%",
    affectedSystem: "Opencast South-West Highwall",
    affected_system: "Opencast South-West Highwall",
    affectedEquipment: "Bench 4 Geotechnical Anchor Network",
    affected_equipment: "Bench 4 Geotechnical Anchor Network",
    productionImpactTpd: 880,
    production_impact_tpd: 880,
    expectedImpact: "-880 T/day Deficit",
    financialExposure: "₹1.28 Cr",
    financial_exposure: "₹1.28 Cr",
    recommendedAction: "Install horizontal depressurization weep-holes and restrict haulage to inner radius.",
    recommended_action: "Install horizontal depressurization weep-holes and restrict haulage to inner radius.",
    status: "ACTIVE",
    acknowledgementState: false,
    acknowledgement_state: false,
    escalationState: false,
    escalation_state: false,
    confidence: "96.5%"
  },
  {
    id: "ALT-DON-203",
    mineId: "dongri-buzurg",
    mine_id: "dongri-buzurg",
    mineName: "Dongri Buzurg Mine",
    mine_name: "Dongri Buzurg Mine",
    mine: "Dongri Buzurg Mine",
    state: "Maharashtra",
    title: "Komatsu HD785 Haul Road Mud Slick Traction Loss",
    description: "Sentinel-2 NDWI soil saturation index at 0.44 on main pit exit incline. Dumper cycle times extended by +5.8 min.",
    primaryDriver: "Haul road friction degradation (0.44 NDWI moisture slick)",
    severity: "ELEVATED",
    level: "Elevated",
    category: "Environmental",
    source: "Sentinel-2 Remote Sensing",
    sensorType: "Multi-Spectral NDWI & GPS Telemetry",
    sensor_type: "Multi-Spectral NDWI & GPS Telemetry",
    sensorId: "SAT-S2-DON",
    sensor_id: "SAT-S2-DON",
    riskScore: 62,
    risk_score: 62,
    probability: "60%",
    affectedSystem: "Main Pit Haulage Gradient",
    affected_system: "Main Pit Haulage Gradient",
    affectedEquipment: "Komatsu HD785 Fleet (DUMP-DON-102)",
    affected_equipment: "Komatsu HD785 Fleet (DUMP-DON-102)",
    productionImpactTpd: 380,
    production_impact_tpd: 380,
    expectedImpact: "-380 T/day Deficit",
    financialExposure: "₹0.55 Cr",
    financial_exposure: "₹0.55 Cr",
    recommendedAction: "Deploy CAT 16M motor grader with crushed aggregate ballast dressing.",
    recommended_action: "Deploy CAT 16M motor grader with crushed aggregate ballast dressing.",
    status: "ACTIVE",
    acknowledgementState: false,
    acknowledgement_state: false,
    escalationState: false,
    escalation_state: false,
    confidence: "92.0%"
  },

  // 3. Chikla Mine
  {
    id: "ALT-CHK-301",
    mineId: "chikla",
    mine_id: "chikla",
    mineName: "Chikla Mine",
    mine_name: "Chikla Mine",
    mine: "Chikla Mine",
    state: "Maharashtra",
    title: "Siliceous Ore Body Blend Ratio Fluctuation",
    description: "Feed silica variance spiked to 14.8% (tolerance: 10.5%), disrupting ferro-alloy grade dispatch specs.",
    primaryDriver: "XRF silica variance (14.8% vs 10.5% tolerance)",
    severity: "MEDIUM",
    level: "Medium",
    category: "Production",
    source: "XRF Online Analyzer",
    sensorType: "Energy Dispersive X-Ray Fluorescence",
    sensor_type: "Energy Dispersive X-Ray Fluorescence",
    sensorId: "XRF-CHK-01",
    sensor_id: "XRF-CHK-01",
    riskScore: 54,
    risk_score: 54,
    probability: "52%",
    affectedSystem: "Crushing & Blending Plant",
    affected_system: "Crushing & Blending Plant",
    affectedEquipment: "Secondary Cone Crusher Circuit (CR-CHK-02)",
    affected_equipment: "Secondary Cone Crusher Circuit (CR-CHK-02)",
    productionImpactTpd: 320,
    production_impact_tpd: 320,
    expectedImpact: "-320 T/day Deficit",
    financialExposure: "₹0.46 Cr",
    financial_exposure: "₹0.46 Cr",
    recommendedAction: "Re-route LHD dispatch to Stope 12B high-grade low-silica face.",
    recommended_action: "Re-route LHD dispatch to Stope 12B high-grade low-silica face.",
    status: "ACTIVE",
    acknowledgementState: false,
    acknowledgement_state: false,
    escalationState: false,
    escalation_state: false,
    confidence: "91.0%"
  },
  {
    id: "ALT-CHK-302",
    mineId: "chikla",
    mine_id: "chikla",
    mineName: "Chikla Mine",
    mine_name: "Chikla Mine",
    mine: "Chikla Mine",
    state: "Maharashtra",
    title: "Level 4 Sub-Level Stoping Crown Pillar Convergence",
    description: "Multipoint extensometer EXT-CHK-04 logged 4.1 mm micro-strain acceleration across 72 hours.",
    primaryDriver: "Crown pillar convergence rate (4.1 mm strain / 72h)",
    severity: "HIGH",
    level: "High",
    category: "Geotechnical",
    source: "Geotechnical Telemetry",
    sensorType: "Magnetic Extensometer Probe",
    sensor_type: "Magnetic Extensometer Probe",
    sensorId: "EXT-CHK-04",
    sensor_id: "EXT-CHK-04",
    riskScore: 74,
    risk_score: 74,
    probability: "72%",
    affectedSystem: "Level 4 Crown Support",
    affected_system: "Level 4 Crown Support",
    affectedEquipment: "Cable-Bolted Crown Stope (Stope-4B)",
    affected_equipment: "Cable-Bolted Crown Stope (Stope-4B)",
    productionImpactTpd: 580,
    production_impact_tpd: 580,
    expectedImpact: "-580 T/day Deficit",
    financialExposure: "₹0.84 Cr",
    financial_exposure: "₹0.84 Cr",
    recommendedAction: "Halt stoping in 4B and install additional resin-grouted steel cable anchors.",
    recommended_action: "Halt stoping in 4B and install additional resin-grouted steel cable anchors.",
    status: "ACTIVE",
    acknowledgementState: false,
    acknowledgement_state: false,
    escalationState: false,
    escalation_state: false,
    confidence: "94.2%"
  },
  {
    id: "ALT-CHK-303",
    mineId: "chikla",
    mine_id: "chikla",
    mineName: "Chikla Mine",
    mine_name: "Chikla Mine",
    mine: "Chikla Mine",
    state: "Maharashtra",
    title: "Submersible Dewatering Sump Pump Cavitation",
    description: "Vibration harmonics on Pump PUMP-CHK-02 indicated impeller cavitation under high discharge head.",
    primaryDriver: "Dewatering pump acoustic cavitation index 0.78",
    severity: "ELEVATED",
    level: "Elevated",
    category: "Hydrogeological",
    source: "Pump Vibration SCADA",
    sensorType: "Acoustic Cavitation Transducer",
    sensor_type: "Acoustic Cavitation Transducer",
    sensorId: "PUMP-CHK-02",
    sensor_id: "PUMP-CHK-02",
    riskScore: 60,
    risk_score: 60,
    probability: "58%",
    affectedSystem: "Incline Drainage Header",
    affected_system: "Incline Drainage Header",
    affectedEquipment: "150 kW Multi-Stage Centrifugal Pump (PUMP-CHK-02)",
    affected_equipment: "150 kW Multi-Stage Centrifugal Pump (PUMP-CHK-02)",
    productionImpactTpd: 260,
    production_impact_tpd: 260,
    expectedImpact: "-260 T/day Deficit",
    financialExposure: "₹0.38 Cr",
    financial_exposure: "₹0.38 Cr",
    recommendedAction: "Purge suction strainer and reduce valve throttling to stabilize NPSH.",
    recommended_action: "Purge suction strainer and reduce valve throttling to stabilize NPSH.",
    status: "ACTIVE",
    acknowledgementState: false,
    acknowledgement_state: false,
    escalationState: false,
    escalation_state: false,
    confidence: "90.5%"
  },

  // 4. Gumgaon Mine
  {
    id: "ALT-GUM-401",
    mineId: "gumgaon",
    mine_id: "gumgaon",
    mineName: "Gumgaon Mine",
    mine_name: "Gumgaon Mine",
    mine: "Gumgaon Mine",
    state: "Maharashtra",
    title: "6.6 kV Substation 3 Total Harmonic Distortion Spike",
    description: "THD on 6.6 kV winding hoist feeder increased to 8.2% (DGMS statutory limit: 5.0%).",
    primaryDriver: "Power grid harmonic distortion (8.2% THD vs 5.0% limit)",
    severity: "ELEVATED",
    level: "Elevated",
    category: "Electrical",
    source: "Power Quality SCADA",
    sensorType: "Digital Power Meter & Spectrum Analyzer",
    sensor_type: "Digital Power Meter & Spectrum Analyzer",
    sensorId: "USS-GUM-03",
    sensor_id: "USS-GUM-03",
    riskScore: 63,
    risk_score: 63,
    probability: "61%",
    affectedSystem: "Underground Power Distribution Grid",
    affected_system: "Underground Power Distribution Grid",
    affectedEquipment: "Main 6.6kV Substation (USS-03)",
    affected_equipment: "Main 6.6kV Substation (USS-03)",
    productionImpactTpd: 340,
    production_impact_tpd: 340,
    expectedImpact: "-340 T/day Deficit",
    financialExposure: "₹0.49 Cr",
    financial_exposure: "₹0.49 Cr",
    recommendedAction: "Engage active harmonic filter bank #2 and schedule thermographic transformer audit.",
    recommended_action: "Engage active harmonic filter bank #2 and schedule thermographic transformer audit.",
    status: "ACTIVE",
    acknowledgementState: false,
    acknowledgement_state: false,
    escalationState: false,
    escalation_state: false,
    confidence: "93.0%"
  },
  {
    id: "ALT-GUM-402",
    mineId: "gumgaon",
    mine_id: "gumgaon",
    mineName: "Gumgaon Mine",
    mine_name: "Gumgaon Mine",
    mine: "Gumgaon Mine",
    state: "Maharashtra",
    title: "Deep Shaft Cage Hoist Brake Line Pressure Anomaly",
    description: "Hydraulic brake back-pressure on friction winder dropped by 14% below statutory fail-safe threshold.",
    primaryDriver: "Hoist hydraulic brake pressure loss (122 bar vs 140 bar baseline)",
    severity: "CRITICAL",
    level: "Critical",
    category: "Mechanical",
    source: "Hoist Safety SCADA",
    sensorType: "Dual Piezo-Resistive Pressure Transducer",
    sensor_type: "Dual Piezo-Resistive Pressure Transducer",
    sensorId: "BRK-HOIST-01",
    sensor_id: "BRK-HOIST-01",
    riskScore: 88,
    risk_score: 88,
    probability: "86%",
    affectedSystem: "Vertical Shaft Hoisting System",
    affected_system: "Vertical Shaft Hoisting System",
    affectedEquipment: "Double-Drum Service Cage Hoist (HOIST-GUM-01)",
    affected_equipment: "Double-Drum Service Cage Hoist (HOIST-GUM-01)",
    productionImpactTpd: 950,
    production_impact_tpd: 950,
    expectedImpact: "-950 T/day Deficit",
    financialExposure: "₹1.38 Cr",
    financial_exposure: "₹1.38 Cr",
    recommendedAction: "Engage secondary mechanical caliper lock and cycle hydraulic fluid accumulator.",
    recommended_action: "Engage secondary mechanical caliper lock and cycle hydraulic fluid accumulator.",
    status: "ACTIVE",
    acknowledgementState: false,
    acknowledgement_state: false,
    escalationState: false,
    escalation_state: false,
    confidence: "97.0%"
  },

  // 5. Tirodi Mine
  {
    id: "ALT-TIR-501",
    mineId: "tirodi",
    mine_id: "tirodi",
    mineName: "Tirodi Mine",
    mine_name: "Tirodi Mine",
    mine: "Tirodi Mine",
    state: "Madhya Pradesh",
    title: "West Pit 8% Switchback Ramp Traction Loss",
    description: "Satellite NDWI soil moisture at 0.42 on pit switchback. Heavy dumper cycle times extended by +6.2 min.",
    primaryDriver: "Ramp soil saturation index (0.42 NDWI)",
    severity: "ELEVATED",
    level: "Elevated",
    category: "Environmental",
    source: "Sentinel-2 Remote Sensing",
    sensorType: "Multi-Spectral Soil Saturation Index",
    sensor_type: "Multi-Spectral Soil Saturation Index",
    sensorId: "SAT-S2-TIR",
    sensor_id: "SAT-S2-TIR",
    riskScore: 65,
    risk_score: 65,
    probability: "64%",
    affectedSystem: "Pit Haulage Transport Corridor",
    affected_system: "Pit Haulage Transport Corridor",
    affectedEquipment: "Main West Ramp (RAMP-TIR-01)",
    affected_equipment: "Main West Ramp (RAMP-TIR-01)",
    productionImpactTpd: 420,
    production_impact_tpd: 420,
    expectedImpact: "-420 T/day Deficit",
    financialExposure: "₹0.61 Cr",
    financial_exposure: "₹0.61 Cr",
    recommendedAction: "Deploy motor grader with crushed aggregate dressing on switchbacks 3 and 4.",
    recommended_action: "Deploy motor grader with crushed aggregate dressing on switchbacks 3 and 4.",
    status: "ACTIVE",
    acknowledgementState: false,
    acknowledgement_state: false,
    escalationState: false,
    escalation_state: false,
    confidence: "92.4%"
  },
  {
    id: "ALT-TIR-502",
    mineId: "tirodi",
    mine_id: "tirodi",
    mineName: "Tirodi Mine",
    mine_name: "Tirodi Mine",
    mine: "Tirodi Mine",
    state: "Madhya Pradesh",
    title: "Primary Gyratory Crusher Lubrication Pressure Drop",
    description: "Main bearing oil differential pressure decreased to 1.8 bar (normal: 2.8 bar) with oil temperature at 69°C.",
    primaryDriver: "Gyratory crusher lube pressure drop (1.8 bar vs 2.8 bar normal)",
    severity: "HIGH",
    level: "High",
    category: "Mechanical",
    source: "Crusher SCADA Lube Unit",
    sensorType: "Differential Pressure Sensor",
    sensor_type: "Differential Pressure Sensor",
    sensorId: "LUBE-CR-01",
    sensor_id: "LUBE-CR-01",
    riskScore: 79,
    risk_score: 79,
    probability: "77%",
    affectedSystem: "Primary Crushing Plant",
    affected_system: "Primary Crushing Plant",
    affectedEquipment: "Metso Gyratory Primary Crusher (CR-TIR-01)",
    affected_equipment: "Metso Gyratory Primary Crusher (CR-TIR-01)",
    productionImpactTpd: 710,
    production_impact_tpd: 710,
    expectedImpact: "-710 T/day Deficit",
    financialExposure: "₹1.03 Cr",
    financial_exposure: "₹1.03 Cr",
    recommendedAction: "Switch to auxiliary lube pump B and replace duplex oil filter cartridge.",
    recommended_action: "Switch to auxiliary lube pump B and replace duplex oil filter cartridge.",
    status: "ACTIVE",
    acknowledgementState: false,
    acknowledgement_state: false,
    escalationState: false,
    escalation_state: false,
    confidence: "94.8%"
  },

  // 6. Kandri Mine
  {
    id: "ALT-KAN-601",
    mineId: "kandri",
    mine_id: "kandri",
    mineName: "Kandri Mine",
    mine_name: "Kandri Mine",
    mine: "Kandri Mine",
    state: "Maharashtra",
    title: "Stope 4A Hanging Wall Extensometer Micro-Displacement Alert",
    description: "Multipoint borehole extensometer MPBX-04 measured 3.8 mm displacement over 48h in Stope 4A.",
    primaryDriver: "Stope 4A hanging wall micro-displacement (3.8 mm / 48h)",
    severity: "CRITICAL",
    level: "Critical",
    category: "Geotechnical",
    source: "DGMS Geotechnical Sensor",
    sensorType: "Multipoint Borehole Extensometer",
    sensor_type: "Multipoint Borehole Extensometer",
    sensorId: "MPBX-04",
    sensor_id: "MPBX-04",
    riskScore: 91,
    risk_score: 91,
    probability: "89%",
    affectedSystem: "Underground Stope Structural Support",
    affected_system: "Underground Stope Structural Support",
    affectedEquipment: "Stope 4A Hanging Wall Horizon",
    affected_equipment: "Stope 4A Hanging Wall Horizon",
    productionImpactTpd: 820,
    production_impact_tpd: 820,
    expectedImpact: "-820 T/day Deficit",
    financialExposure: "₹1.19 Cr",
    financial_exposure: "₹1.19 Cr",
    recommendedAction: "Halt production drilling in Stope 4A, install secondary resin cable bolts, notify Safety Officer.",
    recommended_action: "Halt production drilling in Stope 4A, install secondary resin cable bolts, notify Safety Officer.",
    status: "ACTIVE",
    acknowledgementState: false,
    acknowledgement_state: false,
    escalationState: false,
    escalation_state: false,
    confidence: "98.1%"
  },
  {
    id: "ALT-KAN-602",
    mineId: "kandri",
    mine_id: "kandri",
    mineName: "Kandri Mine",
    mine_name: "Kandri Mine",
    mine: "Kandri Mine",
    state: "Maharashtra",
    title: "Opencast Highwall Radar Micro-Strain Velocity Acceleration",
    description: "Interferometric slope stability radar detected 1.2 mm/day deformation vector on north-east bench face.",
    primaryDriver: "Highwall SSR slope deformation velocity (1.2 mm/day)",
    severity: "HIGH",
    level: "High",
    category: "Geotechnical",
    source: "Slope Stability Radar (SSR)",
    sensorType: "Ground-Based SAR Interferometry",
    sensor_type: "Ground-Based SAR Interferometry",
    sensorId: "SSR-KAN-01",
    sensor_id: "SSR-KAN-01",
    riskScore: 77,
    risk_score: 77,
    probability: "75%",
    affectedSystem: "North-East Opencast Highwall",
    affected_system: "North-East Opencast Highwall",
    affectedEquipment: "Bench 6 Critical Slope Area",
    affected_equipment: "Bench 6 Critical Slope Area",
    productionImpactTpd: 610,
    production_impact_tpd: 610,
    expectedImpact: "-610 T/day Deficit",
    financialExposure: "₹0.88 Cr",
    financial_exposure: "₹0.88 Cr",
    recommendedAction: "Establish 30m exclusion perimeter below Bench 6 and increase radar scan frequency to 2 min.",
    recommended_action: "Establish 30m exclusion perimeter below Bench 6 and increase radar scan frequency to 2 min.",
    status: "ACTIVE",
    acknowledgementState: false,
    acknowledgement_state: false,
    escalationState: false,
    escalation_state: false,
    confidence: "95.0%"
  },

  // 7. Munsar Mine
  {
    id: "ALT-MUN-702",
    mineId: "munsar",
    mine_id: "munsar",
    mineName: "Munsar Mine",
    mine_name: "Munsar Mine",
    mine: "Munsar Mine",
    state: "Maharashtra",
    title: "Jaw Crusher Eccentric Bushing Thermal Gradient",
    description: "Temperature probe on Jaw Crusher CR-MUN-01 main bearing reached 74.5°C during continuous shift crushing.",
    primaryDriver: "Jaw crusher eccentric bushing thermal elevation (74.5°C)",
    severity: "HIGH",
    level: "High",
    category: "Mechanical",
    source: "Crusher Bearing SCADA",
    sensorType: "Bearing Temperature RTD",
    sensor_type: "Bearing Temperature RTD",
    sensorId: "TEMP-CR-MUN",
    sensor_id: "TEMP-CR-MUN",
    riskScore: 72,
    risk_score: 72,
    probability: "70%",
    affectedSystem: "Primary Crushing Plant",
    affected_system: "Primary Crushing Plant",
    affectedEquipment: "Jaw Crusher (CR-MUN-01)",
    affected_equipment: "Jaw Crusher (CR-MUN-01)",
    productionImpactTpd: 480,
    production_impact_tpd: 480,
    expectedImpact: "-480 T/day Deficit",
    financialExposure: "₹0.70 Cr",
    financial_exposure: "₹0.70 Cr",
    recommendedAction: "Flush lubrication circuit with ISO VG 220 oil and verify grease injection frequency.",
    recommended_action: "Flush lubrication circuit with ISO VG 220 oil and verify grease injection frequency.",
    status: "ACTIVE",
    acknowledgementState: false,
    acknowledgement_state: false,
    escalationState: false,
    escalation_state: false,
    confidence: "91.8%"
  },

  // 8. Bhandara Mine
  {
    id: "ALT-BHA-802",
    mineId: "bhandara",
    mine_id: "bhandara",
    mineName: "Bhandara Mine (Beldongri)",
    mine_name: "Bhandara Mine (Beldongri)",
    mine: "Bhandara Mine (Beldongri)",
    state: "Maharashtra",
    title: "Pit Drainage Sump Groundwater Inflow Surge",
    description: "Pit bottom sump inflow increased to 340 m³/h vs rated pump battery discharge of 380 m³/h.",
    primaryDriver: "Pit bottom sump inflow volume (340 m³/h vs 380 m³/h capacity)",
    severity: "HIGH",
    level: "High",
    category: "Hydrogeological",
    source: "Pit Flow Sensor",
    sensorType: "Ultrasonic Flow Transmitter",
    sensor_type: "Ultrasonic Flow Transmitter",
    sensorId: "SUMP-BHA-01",
    sensor_id: "SUMP-BHA-01",
    riskScore: 71,
    risk_score: 71,
    probability: "69%",
    affectedSystem: "Pit Dewatering Circuit",
    affected_system: "Pit Dewatering Circuit",
    affectedEquipment: "Main Pit Sump Pump Station",
    affected_equipment: "Main Pit Sump Pump Station",
    productionImpactTpd: 390,
    production_impact_tpd: 390,
    expectedImpact: "-390 T/day Deficit",
    financialExposure: "₹0.57 Cr",
    financial_exposure: "₹0.57 Cr",
    recommendedAction: "Deploy standby diesel pump unit to prevent bench toe flooding.",
    recommended_action: "Deploy standby diesel pump unit to prevent bench toe flooding.",
    status: "ACTIVE",
    acknowledgementState: false,
    acknowledgement_state: false,
    escalationState: false,
    escalation_state: false,
    confidence: "93.4%"
  },

  // 9. Ukwa Mine
  {
    id: "ALT-UKW-902",
    mineId: "ukwa",
    mine_id: "ukwa",
    mineName: "Ukwa Mine",
    mine_name: "Ukwa Mine",
    mine: "Ukwa Mine",
    state: "Madhya Pradesh",
    title: "Main Underground Ventilation Fan 2 V-Belt Slip",
    description: "Airflow through Adit 2 dropped from 62 m³/s to 48 m³/s due to ventilation drive belt tension slack.",
    primaryDriver: "Adit airflow drop (48 m³/s vs 62 m³/s required)",
    severity: "HIGH",
    level: "High",
    category: "Environmental",
    source: "Ventilation SCADA",
    sensorType: "Thermal Anemometer Air Velocity Sensor",
    sensor_type: "Thermal Anemometer Air Velocity Sensor",
    sensorId: "FAN-UKW-02",
    sensor_id: "FAN-UKW-02",
    riskScore: 75,
    risk_score: 75,
    probability: "73%",
    affectedSystem: "Main Adit Ventilation Circuit",
    affected_system: "Main Adit Ventilation Circuit",
    affectedEquipment: "Primary Exhaust Axial Fan (FAN-UKW-02)",
    affected_equipment: "Primary Exhaust Axial Fan (FAN-UKW-02)",
    productionImpactTpd: 520,
    production_impact_tpd: 520,
    expectedImpact: "-520 T/day Deficit",
    financialExposure: "₹0.75 Cr",
    financial_exposure: "₹0.75 Cr",
    recommendedAction: "Engage standby auxiliary fan and adjust drive belt tensioning pulley.",
    recommended_action: "Engage standby auxiliary fan and adjust drive belt tensioning pulley.",
    status: "ACTIVE",
    acknowledgementState: false,
    acknowledgement_state: false,
    escalationState: false,
    escalation_state: false,
    confidence: "94.6%"
  },

  // 10. Ramtek Operations
  {
    id: "ALT-RAM-1002",
    mineId: "ramtek",
    mine_id: "ramtek",
    mineName: "Ramtek Operations",
    mine_name: "Ramtek Operations",
    mine: "Ramtek Operations",
    state: "Maharashtra",
    title: "Incline Haul Rope Tension Dynamic Load Drift",
    description: "Peak tensile stress on incline haulage wire rope spiked by +18% during loaded car ascent.",
    primaryDriver: "Incline rope dynamic tension spike (+18% peak load)",
    severity: "HIGH",
    level: "High",
    category: "Mechanical",
    source: "Incline Winder Load Cell",
    sensorType: "Tension Load Cell Pin",
    sensor_type: "Tension Load Cell Pin",
    sensorId: "ROPE-RAM-01",
    sensor_id: "ROPE-RAM-01",
    riskScore: 73,
    risk_score: 73,
    probability: "71%",
    affectedSystem: "Incline Tub Haulage System",
    affected_system: "Incline Tub Haulage System",
    affectedEquipment: "Main Incline 28mm Steel Wire Rope (ROPE-RAM-01)",
    affected_equipment: "Main Incline 28mm Steel Wire Rope (ROPE-RAM-01)",
    productionImpactTpd: 360,
    production_impact_tpd: 360,
    expectedImpact: "-360 T/day Deficit",
    financialExposure: "₹0.52 Cr",
    financial_exposure: "₹0.52 Cr",
    recommendedAction: "Inspect rope for broken wire clusters and limit car train load to 6 tubs.",
    recommended_action: "Inspect rope for broken wire clusters and limit car train load to 6 tubs.",
    status: "ACTIVE",
    acknowledgementState: false,
    acknowledgement_state: false,
    escalationState: false,
    escalation_state: false,
    confidence: "92.0%"
  }
];

/**
 * Generates the live operational threat vectors for the Risk Center with multi-physics scenario shocks.
 */
export function generateRiskMatrix(activeMineId = 'all', activeStress = null) {
  const normMine = activeMineId ? activeMineId.toLowerCase() : 'all';
  const scen = activeStress?.scenarioId ? activeStress.scenarioId.toUpperCase() : 'BASELINE';
  const scenSev = activeStress?.severity ? activeStress.severity.toUpperCase() : 'HIGH';

  let list = CANONICAL_MOIL_THREATS.map(t => {
    const copy = { ...t, timestamp: 'Live Telemetry Stream' };

    // Apply Scenario Shocks
    if (scen.includes('MONSOON')) {
      if (copy.category === 'Hydrogeological' || copy.category === 'Environmental') {
        copy.riskScore = Math.min(98, copy.riskScore + (scenSev === 'CRITICAL' ? 18 : 12));
        copy.risk_score = copy.riskScore;
        if (copy.severity === 'HIGH' || copy.severity === 'ELEVATED') {
          copy.severity = 'CRITICAL';
          copy.level = 'Critical';
        }
        copy.productionImpactTpd = Math.round(copy.productionImpactTpd * 1.45);
        copy.production_impact_tpd = copy.productionImpactTpd;
      }
    } else if (scen.includes('CRUSH')) {
      if (copy.category === 'Mechanical' || copy.title.includes('Crusher')) {
        copy.riskScore = Math.min(99, copy.riskScore + (scenSev === 'CRITICAL' ? 22 : 15));
        copy.risk_score = copy.riskScore;
        copy.severity = 'CRITICAL';
        copy.level = 'Critical';
        copy.productionImpactTpd = Math.round(copy.productionImpactTpd * 1.65);
        copy.production_impact_tpd = copy.productionImpactTpd;
      }
    } else if (scen.includes('MULTI')) {
      if (copy.category === 'Hydrogeological' || copy.category === 'Mechanical' || copy.category === 'Geotechnical') {
        copy.riskScore = Math.min(99, copy.riskScore + 15);
        copy.risk_score = copy.riskScore;
        if (copy.severity === 'HIGH') {
          copy.severity = 'CRITICAL';
          copy.level = 'Critical';
        }
        copy.productionImpactTpd = Math.round(copy.productionImpactTpd * 1.5);
        copy.production_impact_tpd = copy.productionImpactTpd;
      }
    }

    return copy;
  });

  if (normMine !== 'all') {
    list = list.filter(t => t.mineId === normMine || t.mine_id === normMine);
  }

  return list;
}
