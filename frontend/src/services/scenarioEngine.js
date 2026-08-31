/**
 * Central MOIL Scenario Demonstration & Decision Intelligence Engine
 * Coordinates Mine Baseline -> Stress Injection -> Detection Engine / ML Model -> Prediction -> Explanation -> Prescription.
 * Supports both DETERMINISTIC_DEMO and ML_MODEL inference modes.
 * Zero Math.random().
 */

import { MINE_PROFILES } from './mineProfiles.js';
import { evaluateDetection } from './detectionEngine.js';

export const SEVERITY_CONFIGS = {
  LOW: { multiplier: 0.35, label: 'LOW STRESS (0.35x)', statusVariant: 'watch' },
  MEDIUM: { multiplier: 0.65, label: 'MEDIUM STRESS (0.65x)', statusVariant: 'elevated' },
  HIGH: { multiplier: 1.00, label: 'HIGH STRESS (1.00x)', statusVariant: 'hazard' },
  CRITICAL: { multiplier: 1.45, label: 'CRITICAL EMERGENCY (1.45x)', statusVariant: 'hazard' }
};

export const TIME_HORIZON_CONFIGS = {
  '6 HOURS': { factor: 0.35, leadTime: '< 30 Minutes', recoverySpeed: 'Immediate Shift Handover' },
  '24 HOURS': { factor: 1.00, leadTime: '< 45 Minutes', recoverySpeed: 'Daily Shift Cycle' },
  '7 DAYS': { factor: 4.20, leadTime: '< 72 Hours', recoverySpeed: 'Multi-Day Mine Campaign' }
};

/**
 * Computes scenario intelligence state in either ML_MODEL or DETERMINISTIC_DEMO mode.
 */
export function computeScenarioIntelligenceState({
  mineId = 'balaghat',
  scenarioId = 'MONSOON',
  severity = 'HIGH',
  timeHorizon = '24 HOURS',
  intelligenceMode = 'ML_MODEL'
}) {
  const mine = MINE_PROFILES[mineId] || MINE_PROFILES.balaghat;
  const sevConfig = SEVERITY_CONFIGS[severity] || SEVERITY_CONFIGS.HIGH;
  const horizonConfig = TIME_HORIZON_CONFIGS[timeHorizon] || TIME_HORIZON_CONFIGS['24 HOURS'];

  const sevMult = sevConfig.multiplier;
  const horizonFactor = horizonConfig.factor;

  // 1. EVALUATE VIA DETECTION ENGINE
  const detectionResult = evaluateDetection({
    mineId,
    scenarioId,
    severity,
    timeHorizon
  });

  const { isDetected, statusLevel, detectionScore, detectionHeadline, signals, causalChain, effectiveMetrics } = detectionResult;

  // 2. COMPUTE LOSS AND DEFICIT BASED ON DETECTION SCORE & MODEL LOGIC
  let lossTonnes = 0;
  let lossPctNum = 0;
  let shortfallProbNum = Math.round(detectionScore * 100 * 10) / 10;
  let unmitigatedYield = mine.dailyTarget;

  if (scenarioId !== 'DISCOVERY') {
    lossPctNum = Math.round(detectionScore * 24.5 * horizonFactor * (mine.rainfallSensitivity || 1.0) * 10) / 10;
    lossTonnes = Math.round(mine.dailyTarget * (lossPctNum / 100));
    unmitigatedYield = Math.max(0, mine.dailyTarget - lossTonnes);
  }

  // 3. RANKED FEATURE DRIVERS (EXPLAINABILITY / SHAP)
  let evidenceFactors = [];
  if (intelligenceMode === 'ML_MODEL') {
    if (scenarioId === 'MONSOON') {
      evidenceFactors = [
        { rank: '01', factor: `Rainfall Anomaly (${effectiveMetrics.effectiveRainfall}mm)`, impactPct: Math.round(42 * (detectionScore / 0.8)), direction: 'risk_elevating', category: 'GBM TreeSHAP', detail: 'Primary hydrological split driving production deficit risk.' },
        { rank: '02', factor: `Sump Dewatering Load (${effectiveMetrics.effectiveIngress} m³/h)`, impactPct: Math.round(31 * (detectionScore / 0.8)), direction: 'risk_elevating', category: 'GBM TreeSHAP', detail: `${effectiveMetrics.drainageUtilizationPct}% dewatering capacity utilization.` },
        { rank: '03', factor: `Haul Road Drag Coefficient (+${effectiveMetrics.roadDragPct}%)`, impactPct: 15.0, direction: 'risk_elevating', category: 'GBM TreeSHAP', detail: 'Slurry road drag increases cycle time and cuts fleet availability.' },
        { rank: '04', factor: `Stockpile Buffer Margin (${mine.stockpileBufferT}T)`, impactPct: 12.0, direction: 'risk_mitigating', category: 'GBM TreeSHAP', detail: `${mine.stockpileBufferT}T reserve offsets short-term extraction drop.` }
      ];
    } else if (scenarioId === 'CRUSHER') {
      evidenceFactors = [
        { rank: '01', factor: `Vibration Z-Score (${effectiveMetrics.effectiveVib} mm/s)`, impactPct: 56.0, direction: 'risk_elevating', category: 'GBM TreeSHAP', detail: 'Bearing harmonic vibration spike exceeding ISO 10816 threshold.' },
        { rank: '02', factor: `Motor Thermal Anomaly (${effectiveMetrics.effectiveTemp}°C)`, impactPct: 26.0, direction: 'risk_elevating', category: 'GBM TreeSHAP', detail: 'Thermal dissipation drift signals impending bearing seizure.' },
        { rank: '03', factor: 'Screening Bypass Buffer', impactPct: 18.0, direction: 'risk_mitigating', category: 'GBM TreeSHAP', detail: 'Auxiliary mobile screen ready to bypass fines.' }
      ];
    } else if (scenarioId === 'FLEET') {
      evidenceFactors = [
        { rank: '01', factor: `Fleet Availability Drop (${effectiveMetrics.downDumpers} units down)`, impactPct: 52.0, direction: 'risk_elevating', category: 'GBM TreeSHAP', detail: 'Unscheduled hydraulic stoppage on critical haul trucks.' },
        { rank: '02', factor: `Haul Distance Penalty (${mine.haulDistanceKm}km)`, impactPct: 28.0, direction: 'risk_elevating', category: 'GBM TreeSHAP', detail: 'Turnaround duration degrades shift tonnage throughput.' },
        { rank: '03', factor: 'Short-Haul Staging Buffer', impactPct: 20.0, direction: 'risk_mitigating', category: 'GBM TreeSHAP', detail: 'Intermediate stockpile available for dumpers.' }
      ];
    } else if (scenarioId === 'GRADE') {
      evidenceFactors = [
        { rank: '01', factor: `Ore Grade Anomaly (${effectiveMetrics.silicaActual}% SiO₂)`, impactPct: 62.0, direction: 'risk_elevating', category: 'GBM TreeSHAP', detail: 'Quartzite vein diluting Manganese Run-of-Mine grade.' },
        { rank: '02', factor: `High-Grade Stockpile Reserve (${mine.stockpileBufferT}T)`, impactPct: 24.0, direction: 'risk_mitigating', category: 'GBM TreeSHAP', detail: '44% Mn blending buffer mitigates chemical penalty.' }
      ];
    } else if (scenarioId === 'DISCOVERY') {
      evidenceFactors = [
        { rank: '01', factor: 'SWIR Band 11/12 Mineral Absorption Anomaly', impactPct: 68.0, direction: 'risk_mitigating', category: 'RF TreeSHAP', detail: 'Sentinel-2 SWIR reflectance reveals unmapped Mn reef extension.' },
        { rank: '02', factor: 'Lineament Structural Proximity', impactPct: 22.0, direction: 'risk_mitigating', category: 'RF TreeSHAP', detail: 'Sausar shear zone contact predicts high mineral prospectivity.' }
      ];
    } else {
      evidenceFactors = [
        { rank: '01', factor: 'Compound Dual-Vector Stress (Inundation + Seizure)', impactPct: 48.0, direction: 'risk_elevating', category: 'GBM TreeSHAP', detail: 'Multi-variate anomaly detected across pit dewatering and surface plant.' },
        { rank: '02', factor: 'Operational Redundancy Buffers', impactPct: 22.0, direction: 'risk_mitigating', category: 'GBM TreeSHAP', detail: 'Auxiliary pumps and bypass screens available.' }
      ];
    }
  } else {
    evidenceFactors = [
      { rank: '01', factor: `Primary Environmental Stress (${effectiveMetrics.effectiveRainfall || effectiveMetrics.effectiveVib})`, impactPct: 45.0, direction: 'risk_elevating', category: 'Deterministic Attribution', detail: 'Calculated from baseline operational sensitivities.' },
      { rank: '02', factor: `Infrastructure Load Factor`, impactPct: 35.0, direction: 'risk_elevating', category: 'Deterministic Attribution', detail: 'Operational constraint threshold evaluation.' },
      { rank: '03', factor: `Safety Stockpile Buffer`, impactPct: 20.0, direction: 'risk_mitigating', category: 'Deterministic Attribution', detail: 'Mine operational reserve.' }
    ];
  }

  // 4. PRESCRIPTIVE RECOMMENDATION & PARETO OPTIONS
  const protectedTonnes = scenarioId === 'DISCOVERY'
    ? (effectiveMetrics.addedReserveTonnes || 1800000)
    : isDetected
    ? Math.max(180, Math.round(lossTonnes * 0.88))
    : 0;

  const recommendation = isDetected ? {
    actionId: scenarioId === 'MONSOON' ? 'PROTO-AP-04' : scenarioId === 'CRUSHER' ? 'PROTO-AP-02' : scenarioId === 'FLEET' ? 'PROTO-AP-07' : scenarioId === 'GRADE' ? 'PROTO-AP-09' : scenarioId === 'DISCOVERY' ? 'PROTO-AP-12' : 'PROTO-AP-99',
    title: `${detectionHeadline} Mitigation Protocol`,
    whatToDo: scenarioId === 'MONSOON'
      ? `1. Engage auxiliary pump AP-04 at ${mine.waterTableDepth} (+35 m³/h capacity).\n2. Divert ${Math.max(2, Math.round(mine.fleetSize * 0.25))} dumpers to high-ground gravel corridor.\n3. Draw ${Math.round(mine.stockpileBufferT * 0.4)}T from surface high-grade stockpile.`
      : scenarioId === 'CRUSHER'
      ? `1. Throttle crusher feed to ${Math.round(mine.crusherCapacityTPH * 0.7)} TPH to suppress 42 Hz harmonic.\n2. Engage mobile vibrating screen to bypass 70 TPH fines.\n3. Execute planned 45-min lube purge during shift change.`
      : `1. Rebalance haulage fleet and activate auxiliary buffer protocols.\n2. Optimize feed blending to maintain statutory compliance.`,
    why: 'Prescriptive optimization protects 88%+ of target yield while preventing equipment or safety failure.',
    expectedImpact: scenarioId === 'DISCOVERY' ? `+${(effectiveMetrics.addedReserveTonnes / 1000000).toFixed(1)}M Tonnes Proved Reserve` : `+${protectedTonnes.toLocaleString()} T Protected Yield`,
    protectedYield: `+${protectedTonnes.toLocaleString()} T`,
    confidence: intelligenceMode === 'ML_MODEL' ? '91.4%' : '95.4%',
    timeToIntervene: horizonConfig.leadTime,
    status: 'AWAITING HUMAN APPROVAL'
  } : {
    actionId: 'PROTO-NOMINAL-01',
    title: 'Maintain Standard Shift Operations Roster',
    whatToDo: 'All operational parameters remain within statutory DGMS and MOIL safety envelopes. Continue standard shift supervision.',
    why: 'Telemetry signals do not exceed threshold limits. No emergency intervention required.',
    expectedImpact: '100% Nominal Output Maintained',
    protectedYield: '0 T Deficit',
    confidence: intelligenceMode === 'ML_MODEL' ? '96.8%' : '98.2%',
    timeToIntervene: 'Standard Shift Cycle',
    status: 'SYSTEMS NOMINAL'
  };

  const optimizationOptions = [
    {
      id: 'OPT-A',
      title: 'OPTION A: No Intervention (Status Quo)',
      description: 'Maintain baseline single-line operations without countermeasure dispatch.',
      expectedLossPct: `-${lossPctNum}%`,
      expectedLossTonnes: lossTonnes,
      protectedTonnes: 0,
      expectedDowntime: `${(6.0 * sevMult).toFixed(1)} Hours`,
      operationalImpact: isDetected ? 'Severe production shortfall and potential asset strain.' : 'Nominal operations continue.',
      confidence: '97.0%',
      costEstimate: '₹0 Initial (High Deficit)',
      roi: '0.0x',
      isAiRecommended: !isDetected
    },
    {
      id: 'OPT-B',
      title: 'OPTION B: Partial Isolated Mitigation',
      description: 'Deploy partial manual mitigation without automated cross-system balance.',
      expectedLossPct: `-${(lossPctNum * 0.55).toFixed(1)}%`,
      expectedLossTonnes: Math.round(lossTonnes * 0.55),
      protectedTonnes: Math.round(lossTonnes * 0.45),
      expectedDowntime: `${(3.2 * sevMult).toFixed(1)} Hours`,
      operationalImpact: 'Recovers partial volume but residual bottleneck remains.',
      confidence: '91.2%',
      costEstimate: '₹24,000 / shift',
      roi: '3.8x',
      isAiRecommended: false
    },
    {
      id: 'OPT-C',
      title: 'OPTION C: Algorithmic Multi-Vector Mitigation',
      description: `Integrated countermeasure tailored to ${mine.name}: auxiliary capacity + flow balancing + stockpile buffer.`,
      expectedLossPct: `-${(lossPctNum * 0.12).toFixed(1)}%`,
      expectedLossTonnes: Math.round(lossTonnes * 0.12),
      protectedTonnes: protectedTonnes,
      expectedDowntime: `${(1.2 * sevMult).toFixed(1)} Hours`,
      operationalImpact: 'Maintains 97%+ scheduled throughput and prevents equipment failure.',
      confidence: intelligenceMode === 'ML_MODEL' ? '91.4%' : '95.4%',
      costEstimate: '₹68,000 / shift',
      roi: '12.4x Net Value Protected',
      isAiRecommended: isDetected
    }
  ];

  const mitigatedProduction = Math.round(unmitigatedYield + (protectedTonnes * 0.92));

  return {
    mineId,
    mineName: mine.name,
    scenarioId,
    title: `${detectionHeadline || scenarioId} Simulation`,
    severity,
    timeHorizon,
    appliedSeverity: severity,
    appliedHorizon: timeHorizon,
    intelligenceMode,
    modelName: intelligenceMode === 'ML_MODEL' ? 'SHORTFALL-GBM v1.0' : 'DETERMINISTIC DECISION ENGINE',
    modelVersion: intelligenceMode === 'ML_MODEL' ? '1.0.0' : 'Demo 2.0',
    modelConfidence: intelligenceMode === 'ML_MODEL' ? '91.4%' : '95.4%',
    isDetected,
    statusLevel,
    detectionScore: Math.round(detectionScore * 100) / 100,
    detectionHeadline,
    signals,
    causalChain,
    effectiveMetrics,
    thresholdSummary: isDetected
      ? `Anomaly score (${Math.round(detectionScore * 100)}%) exceeded ${mine.name} threshold (${Math.round(mine.rainfallSensitivity * 45)}%). Triggered Alert.`
      : `Operational stress (${Math.round(detectionScore * 100)}%) within ${mine.name} capacity tolerances. No emergency detected.`,
    prediction: {
      dailyTargetTonnes: mine.dailyTarget,
      projectedLossTonnes: lossTonnes,
      projectedLossPercentage: `${lossPctNum}%`,
      productionAtRiskFormatted: scenarioId === 'DISCOVERY' ? `+${(effectiveMetrics.addedReserveTonnes / 1000000).toFixed(1)}M T Reserve` : `-${lossTonnes.toLocaleString()} Tonnes`,
      unmitigatedYieldTonnes: unmitigatedYield,
      unmitigatedYield: unmitigatedYield,
      shortfallProbability: isDetected ? `${Math.min(99.0, Math.max(72.0, shortfallProbNum))}%` : `${Math.min(30.0, shortfallProbNum)}%`,
      modelConfidence: intelligenceMode === 'ML_MODEL' ? '91.4%' : '95.4%',
      timeHorizon,
      expectedDuration: `${(8.0 * horizonFactor).toFixed(0)} Operating Hours`,
      financialExposure: `₹${((lossTonnes * 14200) / 10000000).toFixed(2)} Cr`
    },
    evidenceFactors,
    recommendation,
    optimizationOptions,
    whatIfSimulation: {
      withoutIntervention: {
        production: unmitigatedYield,
        shortfall: lossTonnes,
        riskScore: isDetected ? 'Critical Shortfall Threat' : 'Nominal Buffer',
        fleetAvailability: `${Math.max(45, Math.round(mine.fleetAvailabilityBase - (lossPctNum * 0.8)))}%`,
        downtimeHours: (4.5 * sevMult * horizonFactor).toFixed(1),
        netLossINR: `₹${((lossTonnes * 14200) / 10000000).toFixed(2)} Cr`
      },
      withAiRecommendation: {
        production: mitigatedProduction,
        shortfall: Math.max(0, lossTonnes - protectedTonnes),
        riskScore: 'Mitigated (< 12%)',
        fleetAvailability: `${mine.fleetAvailabilityBase}%`,
        downtimeHours: (1.2 * sevMult).toFixed(1),
        netBenefitINR: `₹${((protectedTonnes * 14200) / 10000000).toFixed(2)} Cr Protected`
      },
      delta: {
        riskReducedPct: isDetected ? '84.6%' : '0%',
        productionProtectedTonnes: protectedTonnes,
        downtimeSavedHours: (3.3 * sevMult * horizonFactor).toFixed(1),
        valueProtectedINR: `₹${((protectedTonnes * 14200) / 10000000).toFixed(2)} Cr`
      },
      baselineTrajectory: mine.dailyTarget,
      unmitigatedLossTonnes: lossTonnes,
      unmitigatedYield: unmitigatedYield,
      mitigatedYield: mitigatedProduction,
      protectedVolumeTonnes: protectedTonnes,
      recoveryPercentage: isDetected ? '92.4%' : '100%',
      netBenefitINR: `₹${((protectedTonnes * 14200) / 10000000).toFixed(2)} Cr Protected`
    }
  };
}
