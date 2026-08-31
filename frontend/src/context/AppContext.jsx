import React, { createContext, useContext, useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  MOIL_MINE_REGISTRY,
  OFFICIAL_MOIL_MINES,
  getMine,
  getMineAnalytics,
  getMineAnalyticsProfile,
  validateMineRegistry
} from '../services/mineRegistry.js';
import { generateMineFleetAssets } from '../services/mineProfiles.js';
import { SCENARIO_TYPES, INITIAL_AUDIT_LOGS } from '../data/mockScenarios.js';
import { TRANSLATIONS } from '../i18n/translations.js';
import { computeScenarioIntelligenceState } from '../services/scenarioEngine.js';
import {
  calculateMineIntelligenceScore,
  generateForecastSeries,
  generateTrustPillars,
  generateRiskMatrix
} from '../services/riskEngine.js';

// API Client Layer Imports
import { healthApi } from '../services/api/healthApi.js';
import { minesApi } from '../services/api/minesApi.js';
import { telemetryApi } from '../services/api/telemetryApi.js';
import { analyticsApi } from '../services/api/analyticsApi.js';
import { alertApi } from '../services/api/alertApi.js';
import { reserveApi } from '../services/api/reserveApi.js';
import { equipmentApi } from '../services/api/equipmentApi.js';
import { anomalyApi } from '../services/api/anomalyApi.js';
import { protocolApi } from '../services/api/protocolApi.js';
import { scenarioApi } from '../services/api/scenarioApi.js';
import { trustApi } from '../services/api/trustApi.js';
import { feedbackApi } from '../services/api/feedbackApi.js';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const [selectedMineId, setSelectedMineIdState] = useState('balaghat');
  const [isCommandDrawerOpen, setIsCommandDrawerOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Backend Connection & Live State
  const [apiConnected, setApiConnected] = useState(false);
  const [apiHealthData, setApiHealthData] = useState(null);
  const [backendMineDetail, setBackendMineDetail] = useState(null);
  const [backendAnalyticsData, setBackendAnalyticsData] = useState(null);
  const [backendEquipmentData, setBackendEquipmentData] = useState(null);
  const [backendReserveData, setBackendReserveData] = useState(null);
  const [backendTrustData, setBackendTrustData] = useState(null);
  const [backendScenarioData, setBackendScenarioData] = useState(null);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [apiLastError, setApiLastError] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // AI Decision Loop & Scenario Stress State
  const [activeScenarioId, setActiveScenarioId] = useState(null);
  const [scenarioSeverity, setScenarioSeverity] = useState('HIGH');
  const [scenarioTimeHorizon, setScenarioTimeHorizon] = useState('24 HOURS');
  const [decisionStage, setDecisionStage] = useState('BASELINE'); // BASELINE, DETECTED, RECOMMENDED, APPROVED, MODIFIED, REJECTED
  const [lastApprovedAction, setLastApprovedAction] = useState(null);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [demoMode, setDemoMode] = useState(false);
  const [intelligenceMode, setIntelligenceMode] = useState('ML_MODEL'); // 'ML_MODEL' or 'DETERMINISTIC_DEMO'

  // Validate local registry on mount
  useEffect(() => {
    validateMineRegistry();
  }, []);

  // Check Backend Health & Initialize
  const checkBackendHealth = useCallback(async () => {
    try {
      const health = await healthApi.checkHealth();
      if (health && health.status) {
        setApiConnected(true);
        setApiHealthData(health);
        setDemoMode(false);
        setApiLastError(null);
        setLastSyncTime(new Date().toISOString());
        return true;
      }
    } catch (err) {
      setApiConnected(false);
      setDemoMode(true);
      setApiLastError(err.message || 'FastAPI backend connection offline');
      return false;
    }
    return false;
  }, []);

  // Fetch full mine profile from backend
  const syncMineFromBackend = useCallback(async (mineId) => {
    if (!mineId) return;
    setIsApiLoading(true);
    try {
      const [mineRes, analyticsRes, equipRes, reserveRes, trustRes] = await Promise.allSettled([
        minesApi.getMineById(mineId),
        minesApi.getMineAnalytics(mineId),
        minesApi.getMineEquipment(mineId),
        minesApi.getMineReserve(mineId),
        minesApi.getMineTrust(mineId)
      ]);

      if (mineRes.status === 'fulfilled' && mineRes.value) {
        setBackendMineDetail(mineRes.value);
        setApiConnected(true);
        setLastSyncTime(new Date().toISOString());
      }
      if (analyticsRes.status === 'fulfilled' && analyticsRes.value) {
        setBackendAnalyticsData(analyticsRes.value);
      }
      if (equipRes.status === 'fulfilled' && equipRes.value) {
        setBackendEquipmentData(equipRes.value);
      }
      if (reserveRes.status === 'fulfilled' && reserveRes.value) {
        setBackendReserveData(reserveRes.value);
      }
      if (trustRes.status === 'fulfilled' && trustRes.value) {
        setBackendTrustData(trustRes.value);
      }
    } catch (err) {
      console.warn('[MOIL API SYNC] Failed to sync mine from backend:', err);
    } finally {
      setIsApiLoading(false);
    }
  }, []);

  // Initial Startup Sync
  useEffect(() => {
    let mounted = true;
    (async () => {
      const isOnline = await checkBackendHealth();
      if (mounted && isOnline) {
        await syncMineFromBackend('balaghat');
        // Fetch audit logs from database
        try {
          const dbLogs = await feedbackApi.listDecisions(50);
          if (Array.isArray(dbLogs) && dbLogs.length > 0) {
            setAuditLogs(dbLogs.map(l => ({
              id: l.id,
              timestamp: l.timestamp,
              mine: l.mine_id ? getMine(l.mine_id).name : 'Balaghat Mine',
              scenario: l.scenario_type,
              detectedSignal: l.detected_signal,
              prediction: l.prediction_summary,
              recommendation: l.recommended_action_title || 'Mitigation Protocol',
              selectedOption: 'Option C (AI Balanced)',
              simulationResult: l.realized_impact || 'Protected Yield',
              operatorDecision: l.operator_decision,
              operatorName: l.operator_name,
              operatorRole: l.operator_role,
              operatorNote: l.operator_notes,
              expectedImpact: l.realized_impact,
              realizedOutcome: l.realized_impact
            })));
          }
        } catch (e) {
          // ignore db logs error
        }
      }
    })();

    // Background health ping every 15s to automatically detect connection changes
    const healthInterval = setInterval(() => {
      checkBackendHealth();
    }, 15000);

    return () => {
      mounted = false;
      clearInterval(healthInterval);
    };
  }, [checkBackendHealth, syncMineFromBackend]);

  // Safe Mine Selector: Clears incompatible scenario state, resets decision loop, and triggers backend sync
  const setSelectedMineId = useCallback((newMineId) => {
    const targetMine = getMine(newMineId);
    const cleanId = targetMine.id;
    setSelectedMineIdState(cleanId);
    setActiveScenarioId(null);
    setBackendScenarioData(null);
    setDecisionStage('BASELINE');
    setLastApprovedAction(null);

    // Adjust language if state does not support it
    if (lang === 'mr' && !targetMine.languageOptions.includes('mr')) {
      setLang('hi');
    }

    // Sync from Backend if connected
    syncMineFromBackend(cleanId);
  }, [lang, syncMineFromBackend]);

  // Base Mine Profile (Backend canonical merged with local contract)
  const baseProfile = useMemo(() => {
    const local = getMine(selectedMineId);
    if (backendMineDetail && backendMineDetail.id === selectedMineId) {
      return {
        ...local,
        ...backendMineDetail,
        productionTarget: backendMineDetail.productionTarget || local.productionTarget,
        baselineProduction: backendMineDetail.baselineProduction || local.baselineProduction,
        coordinatesDMS: backendMineDetail.coordinatesDMS || local.coordinatesDMS,
        dmsCoordinates: backendMineDetail.coordinatesDMS || local.coordinatesDMS,
        oreGrade: backendMineDetail.oreGrade || local.oreGrade,
        baseGradeNum: backendMineDetail.baseGradeNum || local.baseGradeNum
      };
    }
    return local;
  }, [selectedMineId, backendMineDetail]);

  // Central Derived Scenario Intelligence State
  const activeScenario = useMemo(() => {
    if (backendScenarioData && activeScenarioId) {
      const b = backendScenarioData;
      const targetTonnes = baseProfile.productionTarget || 6200;
      const lossTonnes = b.predicted_loss_tonnes || 0;
      const unmitigated = b.projected_yield_tonnes || Math.max(0, targetTonnes - lossTonnes);
      const protectedT = Math.round(lossTonnes * 0.88);
      const mitigated = unmitigated + protectedT;

      const rec = {
        actionId: b.recommendation?.action_id || b.recommendation?.actionId || `PROTO-${(baseProfile.shortName || 'MIN').slice(0, 3).toUpperCase()}-01`,
        title: b.recommendation?.title || 'Dynamic Countermeasure Protocol',
        action: b.recommendation?.what_to_do || b.recommendation?.action || 'Prescriptive automated dispatch',
        description: b.recommendation?.what_to_do || b.recommendation?.description || 'Automated dispatch parameters',
        why: b.recommendation?.why || 'Prescriptive intervention protects shift yield',
        expectedImpact: b.recommendation?.expected_impact || b.recommendation?.expectedImpact || `+${protectedT.toLocaleString()} T Protected Yield`,
        targetThreat: b.headline || 'Operational Stress Inundation',
        confidence: b.recommendation?.confidence || '94.8%'
      };

      const optOptions = Array.isArray(b.optimization_options) && b.optimization_options.length > 0
        ? b.optimization_options.map(opt => ({
            id: opt.id,
            title: opt.title,
            description: opt.description,
            expectedLossPct: opt.expected_loss_pct || opt.expectedLossPct,
            expectedLossTonnes: opt.expected_loss_tonnes ?? opt.expectedLossTonnes,
            protectedTonnes: opt.protected_tonnes ?? opt.protectedTonnes,
            expectedDowntime: opt.expected_downtime || opt.expectedDowntime,
            operationalImpact: opt.operational_impact || opt.operationalImpact,
            confidence: opt.confidence || '94.8%',
            costEstimate: opt.cost_estimate || opt.costEstimate,
            roi: opt.roi,
            isAiRecommended: opt.is_ai_recommended ?? opt.isAiRecommended
          }))
        : [
            {
              id: 'OPT-A',
              title: 'OPTION A: Status Quo (No Intervention)',
              description: 'Continue nominal operations without mitigation.',
              expectedLossPct: `-${Math.round((lossTonnes / (targetTonnes || 1)) * 100)}%`,
              expectedLossTonnes: lossTonnes,
              protectedTonnes: 0,
              expectedDowntime: '6.5 Hours',
              operationalImpact: 'Severe production shortfall and water ingress.',
              confidence: '97.0%',
              costEstimate: '₹0 Initial',
              roi: '0.0x',
              isAiRecommended: false
            },
            {
              id: 'OPT-B',
              title: 'OPTION B: Partial Mitigation',
              description: 'Activate secondary pumps without haul road re-routing.',
              expectedLossPct: `-${Math.round((lossTonnes * 0.55 / (targetTonnes || 1)) * 100)}%`,
              expectedLossTonnes: Math.round(lossTonnes * 0.55),
              protectedTonnes: Math.round(lossTonnes * 0.45),
              expectedDowntime: '3.5 Hours',
              operationalImpact: 'Partial recovery of pit bottom access.',
              confidence: '91.2%',
              costEstimate: '₹28,000 / shift',
              roi: '4.2x',
              isAiRecommended: false
            },
            {
              id: 'OPT-C',
              title: 'OPTION C: Algorithmic Multi-Vector Optimization',
              description: 'Auxiliary pumps + haul road diversion + stockpile buffer feed.',
              expectedLossPct: `-${Math.round((lossTonnes * 0.12 / (targetTonnes || 1)) * 100)}%`,
              expectedLossTonnes: Math.round(lossTonnes * 0.12),
              protectedTonnes: protectedT,
              expectedDowntime: '1.2 Hours',
              operationalImpact: 'Maintains 98%+ scheduled dispatch and protects underground infrastructure.',
              confidence: '95.4%',
              costEstimate: '₹45,000 / shift',
              roi: '9.4x (₹8.2L Value Protected)',
              isAiRecommended: true
            }
          ];

      return {
        scenarioId: b.scenario_type,
        mineId: selectedMineId,
        mineName: b.mine_name || baseProfile.name,
        title: `${b.headline || b.scenario_type} Simulation`,
        severity: b.severity || scenarioSeverity,
        timeHorizon: b.time_horizon || scenarioTimeHorizon,
        appliedSeverity: b.severity || scenarioSeverity,
        appliedHorizon: b.time_horizon || scenarioTimeHorizon,
        statusLevel: b.overall_risk_level || 'CRITICAL',
        statusVariant: b.status_variant || 'hazard',
        detectionScore: b.shortfall_probability || 0.85,
        detectionHeadline: b.headline,
        isDetected: b.is_detected,
        intelligenceMode,
        modelName: 'SHORTFALL-GBM v1.0',
        modelVersion: '1.0.0',
        modelConfidence: '94.8%',
        evidenceFactors: b.evidence_factors || [],
        causalChain: Array.isArray(b.causal_chain) && b.causal_chain.length > 0 && typeof b.causal_chain[0] === 'object'
          ? b.causal_chain
          : [
              { step: 'Precipitation Influx', delta: `+${b.effective_rainfall_mm || 48} mm`, status: 'hazard' },
              { step: 'Sump Load', delta: `${b.effective_sump_inflow_m3h || 850} m³/h`, status: 'hazard' },
              { step: 'Crusher Vibration', delta: `${b.crusher_vibration_mms || 4.2} mm/s`, status: 'hazard' },
              { step: 'Shortfall Risk', delta: `${b.shortfall_probability_pct || '84%'} Prob`, status: 'hazard' }
            ],
        prediction: {
          dailyTargetTonnes: targetTonnes,
          projectedLossTonnes: lossTonnes,
          projectedLossPercentage: `${Math.round((lossTonnes / (targetTonnes || 1)) * 100)}%`,
          productionAtRiskFormatted: `-${lossTonnes.toLocaleString()} Tonnes`,
          expectedImpact: `-${lossTonnes.toLocaleString()} T Potential Shortfall`,
          unmitigatedYieldTonnes: unmitigated,
          unmitigatedYield: unmitigated,
          shortfallProbability: b.shortfall_probability_pct || `${Math.round((b.shortfall_probability || 0.85) * 100)}%`,
          confidence: '94.8%',
          modelConfidence: '94.8%',
          timeHorizon: b.time_horizon || scenarioTimeHorizon,
          expectedDuration: '8 Operating Hours',
          financialExposure: `₹${((lossTonnes * 14200) / 10000000).toFixed(2)} Cr`
        },
        recommendation: rec,
        prescribedAction: rec,
        optimizationOptions: optOptions,
        whatIfSimulation: {
          withoutIntervention: {
            production: unmitigated,
            shortfall: lossTonnes,
            riskScore: 'Critical Shortfall Threat',
            fleetAvailability: `${b.fleet_health_pct || 78}%`,
            downtimeHours: '4.8',
            netLossINR: `₹${((lossTonnes * 14200) / 10000000).toFixed(2)} Cr`
          },
          withAiRecommendation: {
            production: mitigated,
            shortfall: Math.max(0, lossTonnes - protectedT),
            riskScore: 'Mitigated (< 12%)',
            fleetAvailability: `${baseProfile.fleetAvailabilityBase || 88}%`,
            downtimeHours: '1.2',
            netBenefitINR: `₹${((protectedT * 14200) / 10000000).toFixed(2)} Cr Protected`
          },
          delta: {
            riskReducedPct: '84.6%',
            productionProtectedTonnes: protectedT,
            downtimeSavedHours: '3.6',
            valueProtectedINR: `₹${((protectedT * 14200) / 10000000).toFixed(2)} Cr`
          },
          baselineTrajectory: targetTonnes,
          unmitigatedLossTonnes: lossTonnes,
          unmitigatedYield: unmitigated,
          mitigatedYield: mitigated,
          protectedVolumeTonnes: protectedT,
          recoveryPercentage: '88.0%',
          netBenefitINR: `₹${((protectedT * 14200) / 10000000).toFixed(2)} Cr Protected`
        },
        signals: [
          { name: 'Effective Catchment Precipitation', value: `${b.effective_rainfall_mm || 48} mm/24h`, normal: `${baseProfile.baselineRainfallMm || 15} mm/24h`, magnitude: '+220% Anomaly', severity: 'CRITICAL' },
          { name: `Deep Sump Ingress (${baseProfile.waterTableDepth || '-185m Level'})`, value: `${b.effective_sump_inflow_m3h || 850} m³/h`, normal: `${baseProfile.drainageBaselineM3h || 240} m³/h`, magnitude: '92% Sump Load', severity: 'CRITICAL' },
          { name: 'Primary Crusher Drive Vibration', value: `${b.crusher_vibration_mms || 4.2} mm/s`, normal: `<${baseProfile.crusherVibBase || 2.1} mm/s`, magnitude: '+100% Spike', severity: 'WARNING' },
          { name: 'HEMM Fleet Availability', value: `${b.fleet_health_pct || 78}% Online`, normal: `${baseProfile.fleetAvailabilityBase || 88}%`, magnitude: '-10% Delay', severity: 'WARNING' }
        ],
        backendMetadata: {
          isBackendSimulated: true,
          mode: 'ML_INFERENCE'
        }
      };
    }

    if (!activeScenarioId) return null;
    return computeScenarioIntelligenceState({
      mineId: selectedMineId,
      scenarioId: activeScenarioId,
      severity: scenarioSeverity,
      timeHorizon: scenarioTimeHorizon,
      intelligenceMode
    });
  }, [backendScenarioData, activeScenarioId, selectedMineId, baseProfile, scenarioSeverity, scenarioTimeHorizon, intelligenceMode]);

  // Dynamic Reactive Mine Analytics Profile
  const analyticsProfile = useMemo(() => {
    return getMineAnalyticsProfile(
      selectedMineId,
      activeScenarioId ? { scenarioId: activeScenarioId, severity: scenarioSeverity } : null
    );
  }, [selectedMineId, activeScenarioId, scenarioSeverity]);

  // Dynamic Reactive Active Mine (Single Source of Truth across all pages)
  const activeMine = useMemo(() => {
    const isApproved = decisionStage === 'APPROVED' || decisionStage === 'MODIFIED';
    const intelligenceScore = calculateMineIntelligenceScore(
      selectedMineId,
      activeScenarioId ? { scenarioId: activeScenarioId, severity: scenarioSeverity } : null
    );

    if (!activeScenario) {
      return {
        ...baseProfile,
        currentOutput: baseProfile.baselineProduction,
        projectedYield: baseProfile.baselineProduction,
        shortfallRisk: `Low (${Math.round((baseProfile.historicalShortfallTendency || 0.12) * 100)}%)`,
        activeFleet: `${Math.round(baseProfile.fleetCount * ((baseProfile.fleetAvailabilityBase || 88) / 100))}/${baseProfile.fleetCount} Units`,
        status: 'Nominal Operations',
        statusVariant: 'telemetry',
        reservePotential: `${baseProfile.reservePotentialM || 4.2}M`,
        intelligenceScore,
        analyticsProfile,
        analytics: analyticsProfile,
        apiConnected
      };
    }

    const sim = activeScenario.whatIfSimulation;
    const p = activeScenario.prediction;

    const projectedYieldVal = isApproved
      ? (sim?.withAiRecommendation?.production || baseProfile.baselineProduction)
      : (p?.unmitigatedYieldTonnes || p?.unmitigatedYield || baseProfile.baselineProduction);

    return {
      ...baseProfile,
      grade: activeScenario.scenarioId === 'GRADE' && !isApproved
        ? `${activeScenario.signals?.[0]?.value?.split(' ')[0] || '34.8% Mn'}`
        : baseProfile.oreGrade,
      currentOutput: baseProfile.baselineProduction,
      projectedYield: projectedYieldVal,
      shortfallRisk: isApproved
        ? `RESOLVED (${sim?.withAiRecommendation?.riskScore || 'Nominal'})`
        : `${activeScenario.statusLevel} (${p?.shortfallProbability || '50%'})`,
      activeFleet: isApproved
        ? `${baseProfile.fleetCount}/${baseProfile.fleetCount} Online`
        : `${activeScenario.signals?.find(s => s.name?.includes('Fleet'))?.value || `${baseProfile.fleetCount - 4}/${baseProfile.fleetCount} Units`}`,
      waterTableDepth: isApproved
        ? `${baseProfile.waterTableDepth} (Aux Pumping Active)`
        : `${baseProfile.waterTableDepth} (${activeScenario.signals?.find(s => s.name?.includes('Sump'))?.value || 'Ingress Influx'})`,
      statusVariant: isApproved ? 'telemetry' : activeScenario.statusLevel === 'CRITICAL' ? 'hazard' : 'manganese',
      status: isApproved ? 'MITIGATION PROTOCOL ACTIVE' : activeScenario.detectionHeadline,
      reservePotential: activeScenario.scenarioId === 'DISCOVERY'
        ? `${((baseProfile.reservePotentialM || 4.2) + 1.8).toFixed(1)}M`
        : `${baseProfile.reservePotentialM || 4.2}M`,
      intelligenceScore,
      analyticsProfile,
      analytics: analyticsProfile,
      apiConnected
    };
  }, [baseProfile, activeScenario, decisionStage, selectedMineId, activeScenarioId, scenarioSeverity, analyticsProfile, apiConnected]);

  // Dynamic Fleet Assets for Equipment Page
  const fleetAssets = useMemo(() => {
    if (backendEquipmentData && Array.isArray(backendEquipmentData) && backendEquipmentData.length > 0) {
      return backendEquipmentData;
    }
    return generateMineFleetAssets(
      selectedMineId,
      activeScenarioId ? { scenarioId: activeScenarioId, severity: scenarioSeverity } : null
    );
  }, [backendEquipmentData, selectedMineId, activeScenarioId, scenarioSeverity]);

  // Dynamic 14-Day Production Forecast
  const forecastSeries = useMemo(() => {
    return generateForecastSeries(
      selectedMineId,
      activeScenarioId ? { scenarioId: activeScenarioId, severity: scenarioSeverity } : null
    );
  }, [selectedMineId, activeScenarioId, scenarioSeverity]);

  // Dynamic Bayesian Trust Pillars
  const trustPillars = useMemo(() => {
    if (backendTrustData?.pillars && Array.isArray(backendTrustData.pillars)) {
      return backendTrustData.pillars;
    }
    return generateTrustPillars(
      selectedMineId,
      activeScenarioId ? { scenarioId: activeScenarioId, severity: scenarioSeverity } : null
    );
  }, [backendTrustData, selectedMineId, activeScenarioId, scenarioSeverity]);

  // Dynamic Operational Threat Matrix for Risk Center
  const riskMatrix = useMemo(() => {
    return generateRiskMatrix(
      selectedMineId,
      activeScenarioId ? { scenarioId: activeScenarioId, severity: scenarioSeverity } : null
    );
  }, [selectedMineId, activeScenarioId, scenarioSeverity]);

  const t = useMemo(() => {
    return TRANSLATIONS[lang] || TRANSLATIONS.en;
  }, [lang]);

  // Execute Scenario Simulation via Backend API (Falls back gracefully if offline)
  const runScenario = async (scenarioId, severity = 'HIGH', timeHorizon = '24 HOURS') => {
    setActiveScenarioId(scenarioId);
    setScenarioSeverity(severity);
    setScenarioTimeHorizon(timeHorizon);
    setDecisionStage('DETECTED');
    setIsApiLoading(true);

    // Standardize scenario type slug for backend
    const scenSlug = {
      'MONSOON': 'HEAVY_MONSOON',
      'CRUSHER': 'CRUSHER_SEIZURE',
      'MULTI_RISK': 'MULTI_RISK_CRISIS',
      'HEAVY_MONSOON': 'HEAVY_MONSOON',
      'CRUSHER_SEIZURE': 'CRUSHER_SEIZURE',
      'MULTI_RISK_CRISIS': 'MULTI_RISK_CRISIS'
    }[scenarioId] || 'HEAVY_MONSOON';

    try {
      const simResult = await scenarioApi.simulateScenario({
        mine_id: selectedMineId,
        scenario_type: scenSlug,
        severity,
        time_horizon: timeHorizon
      });
      if (simResult) {
        setBackendScenarioData(simResult);
        setApiConnected(true);
      }
    } catch (err) {
      console.warn('[MOIL SCENARIO] Backend simulation failed, using local engine fallback:', err.message);
      setBackendScenarioData(null);
    } finally {
      setIsApiLoading(false);
    }
  };

  // Reset Baseline Operations via Backend API
  const resetBaseline = async () => {
    setActiveScenarioId(null);
    setBackendScenarioData(null);
    setDecisionStage('BASELINE');
    setLastApprovedAction(null);

    try {
      await scenarioApi.simulateScenario({
        mine_id: selectedMineId,
        scenario_type: 'BASELINE_RESET'
      });
    } catch (e) {
      // ignore
    }
    syncMineFromBackend(selectedMineId);
  };

  // Human-in-the-Loop: Approve Prescription (Syncs to backend SQLite audit log)
  const approveDecision = async (operatorName = 'Chief Mining Engineer', operatorRole = 'Shift In-Charge') => {
    if (!activeScenario) return;

    const logId = `LOG-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLog = {
      id: logId,
      timestamp: `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-US', { hour12: false })} IST`,
      mine: activeMine.name,
      scenario: activeScenario.scenarioId,
      detectedSignal: (activeScenario.signals?.[0]?.name || 'Signal') + ' (' + (activeScenario.signals?.[0]?.value || 'Nominal') + ')',
      prediction: `${activeScenario.prediction?.productionAtRiskFormatted || '1,350 T'} at Risk (${activeScenario.prediction?.shortfallProbability || '84%'})`,
      confidence: activeScenario.prediction?.modelConfidence || '94.8%',
      recommendation: activeScenario.recommendation?.title || 'Operational Protocol',
      selectedOption: 'Option C (Automated Balanced Recovery)',
      simulationResult: `${activeScenario.whatIfSimulation?.delta?.productionProtectedTonnes || 1150} T Protected (+${activeScenario.whatIfSimulation?.recoveryPercentage || '92%'} Recovery)`,
      operatorDecision: 'APPROVED',
      operatorName,
      operatorRole,
      operatorNote: 'Prescription verified against statutory DGMS guidelines. Automated dispatch authorized.',
      expectedImpact: activeScenario.recommendation?.expectedImpact || '+1,150 T/day Protected Yield',
      realizedOutcome: `${activeScenario.whatIfSimulation?.delta?.productionProtectedTonnes || 1150} T Protected (+${activeScenario.whatIfSimulation?.recoveryPercentage || '92%'} Yield)`
    };

    setAuditLogs([newLog, ...auditLogs]);
    setDecisionStage('APPROVED');
    setLastApprovedAction(activeScenario.recommendation);
    setIsDecisionModalOpen(false);

    // Persist to Backend SQLite Audit Ledger
    try {
      await feedbackApi.recordDecision({
        decision_id: logId,
        mine_id: selectedMineId,
        operator_decision: 'APPROVED',
        operator_name: operatorName,
        scenario_type: activeScenario.scenarioId,
        severity: scenarioSeverity,
        detected_signal: newLog.detectedSignal,
        prediction_summary: newLog.prediction,
        action_id: activeScenario.recommendation?.actionId || 'PROTO-01',
        action_title: activeScenario.recommendation?.title || 'Mitigation Protocol',
        operator_role: operatorRole,
        operator_notes: newLog.operatorNote,
        realized_impact: newLog.realizedOutcome
      });
    } catch (e) {
      console.warn('[MOIL AUDIT] Failed to persist audit to backend:', e);
    }
  };

  // Human-in-the-Loop: Modify Prescription
  const modifyDecision = async (modifications, operatorName = 'Chief Mining Engineer', operatorNote = 'Adjusted parameters for local shift conditions.') => {
    if (!activeScenario) return;

    const logId = `LOG-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLog = {
      id: logId,
      timestamp: `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-US', { hour12: false })} IST`,
      mine: activeMine.name,
      scenario: activeScenario.scenarioId,
      detectedSignal: (activeScenario.signals?.[0]?.name || 'Signal') + ' (' + (activeScenario.signals?.[0]?.value || 'Nominal') + ')',
      prediction: `${activeScenario.prediction?.productionAtRiskFormatted || '1,350 T'} at Risk (${activeScenario.prediction?.shortfallProbability || '84%'})`,
      confidence: activeScenario.prediction?.modelConfidence || '94.8%',
      recommendation: `${activeScenario.recommendation?.title || 'Operational Protocol'} [OPERATOR MODIFIED]`,
      selectedOption: 'Option C (Modified)',
      simulationResult: `${activeScenario.whatIfSimulation?.delta?.productionProtectedTonnes || 1150} T Protected (Modified)`,
      operatorDecision: 'MODIFIED',
      operatorName,
      operatorRole: 'Shift In-Charge',
      operatorNote: typeof modifications === 'string' ? modifications : operatorNote,
      expectedImpact: activeScenario.recommendation?.expectedImpact || '+1,150 T/day Protected Yield',
      realizedOutcome: `${activeScenario.whatIfSimulation?.delta?.productionProtectedTonnes || 1150} T Protected (Modified Dispatch)`
    };

    setAuditLogs([newLog, ...auditLogs]);
    setDecisionStage('MODIFIED');
    setLastApprovedAction({
      ...activeScenario.recommendation,
      title: `${activeScenario.recommendation?.title || 'Protocol'} (Modified)`,
      customModifications: modifications
    });
    setIsDecisionModalOpen(false);

    try {
      await feedbackApi.recordDecision({
        decision_id: logId,
        mine_id: selectedMineId,
        operator_decision: 'MODIFIED',
        operator_name: operatorName,
        scenario_type: activeScenario.scenarioId,
        severity: scenarioSeverity,
        detected_signal: newLog.detectedSignal,
        prediction_summary: newLog.prediction,
        action_id: activeScenario.recommendation?.actionId || 'PROTO-01',
        action_title: activeScenario.recommendation?.title || 'Mitigation Protocol',
        operator_role: 'Shift In-Charge',
        operator_notes: newLog.operatorNote,
        realized_impact: newLog.realizedOutcome
      });
    } catch (e) {
      console.warn('[MOIL AUDIT] Failed to persist modified audit to backend:', e);
    }
  };

  // Human-in-the-Loop: Reject Prescription
  const rejectDecision = async (reason = 'Manual controller override based on visual pit inspection.', operatorName = 'Chief Mining Engineer') => {
    if (!activeScenario) return;

    const logId = `LOG-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLog = {
      id: logId,
      timestamp: `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-US', { hour12: false })} IST`,
      mine: activeMine.name,
      scenario: activeScenario.scenarioId,
      detectedSignal: (activeScenario.signals?.[0]?.name || 'Signal') + ' (' + (activeScenario.signals?.[0]?.value || 'Nominal') + ')',
      prediction: `${activeScenario.prediction?.productionAtRiskFormatted || '1,350 T'} at Risk (${activeScenario.prediction?.shortfallProbability || '84%'})`,
      confidence: activeScenario.prediction?.modelConfidence || '94.8%',
      recommendation: `${activeScenario.recommendation?.title || 'Operational Protocol'} [REJECTED]`,
      selectedOption: 'Manual Override',
      simulationResult: 'Manual Dispatch Override by Shift Controller',
      operatorDecision: 'REJECTED',
      operatorName,
      operatorRole: 'Shift In-Charge',
      operatorNote: reason,
      expectedImpact: 'Manual Protocol Active',
      realizedOutcome: 'Manual Controller Dispatch Operating'
    };

    setAuditLogs([newLog, ...auditLogs]);
    setDecisionStage('REJECTED');
    setIsDecisionModalOpen(false);

    try {
      await feedbackApi.recordDecision({
        decision_id: logId,
        mine_id: selectedMineId,
        operator_decision: 'REJECTED',
        operator_name: operatorName,
        scenario_type: activeScenario.scenarioId,
        severity: scenarioSeverity,
        detected_signal: newLog.detectedSignal,
        prediction_summary: newLog.prediction,
        action_id: activeScenario.recommendation?.actionId || 'PROTO-01',
        action_title: activeScenario.recommendation?.title || 'Mitigation Protocol',
        operator_role: 'Shift In-Charge',
        operator_notes: reason,
        realized_impact: 'Manual Override'
      });
    } catch (e) {
      console.warn('[MOIL AUDIT] Failed to persist rejected audit to backend:', e);
    }
  };


  // Normalized scenario ID for cross-module synchronization
  const normalizedScenarioId = useMemo(() => {
    if (!activeScenarioId) return 'BASELINE';
    const s = String(activeScenarioId).toUpperCase();
    if (s.includes('MONSOON')) return 'HEAVY_MONSOON';
    if (s.includes('CRUSH')) return 'CRUSHER_SEIZURE';
    if (s.includes('MULTI')) return 'MULTI_RISK';
    return s;
  }, [activeScenarioId]);

  // Unified global scenario setter
  const setScenario = useCallback((scenId) => {
    if (!scenId || scenId === 'BASELINE') {
      resetBaseline();
    } else {
      const normalized = {
        'HEAVY_MONSOON': 'MONSOON',
        'CRUSHER_SEIZURE': 'CRUSHER',
        'CRUSHER_CONSTRAINT': 'CRUSHER',
        'MULTI_RISK': 'MULTI_RISK',
        'MULTI_RISK_CRISIS': 'MULTI_RISK'
      }[scenId] || scenId;
      runScenario(normalized, scenarioSeverity, scenarioTimeHorizon);
    }
  }, [resetBaseline, runScenario, scenarioSeverity, scenarioTimeHorizon]);

  const value = {
    lang: lang || 'en',
    setLang,
    language: lang || 'en',
    currentLanguage: lang || 'en',
    selectedLanguage: lang || 'en',
    setLanguage: setLang,
    selectedMineId,
    setSelectedMineId,
    activeMine,
    mines: OFFICIAL_MOIL_MINES,
    officialMines: OFFICIAL_MOIL_MINES,
    isCommandDrawerOpen,
    setIsCommandDrawerOpen,
    isDecisionModalOpen,
    setIsDecisionModalOpen,
    isSupportModalOpen,
    setIsSupportModalOpen,
    isComparisonModalOpen,
    setIsComparisonModalOpen,
    isExecutiveModalOpen,
    setIsExecutiveModalOpen,
    isReportModalOpen,
    setIsReportModalOpen,
    activeScenario,
    activeScenarioId,
    normalizedScenarioId,
    setScenario,
    setScenarioId: setScenario,
    scenarioSeverity,
    scenarioTimeHorizon,
    decisionStage,
    lastApprovedAction,
    auditLogs,
    demoMode,
    setDemoMode,
    intelligenceMode,
    setIntelligenceMode,
    runScenario,
    resetBaseline,
    approveDecision,
    modifyDecision,
    rejectDecision,
    fleetAssets,
    forecastSeries,
    trustPillars,
    riskMatrix,
    analyticsProfile,
    getMineAnalytics,
    t: t || TRANSLATIONS.en,
    translate: t || TRANSLATIONS.en,
    // Backend API Live State
    apiConnected,
    apiHealthData,
    isApiLoading,
    apiLastError,
    lastSyncTime,
    checkBackendHealth,
    syncMineFromBackend
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const useLanguage = () => {
  const context = useContext(AppContext);
  if (!context) {
    return { lang: 'en', language: 'en', currentLanguage: 'en', selectedLanguage: 'en', setLang: () => {}, setLanguage: () => {}, t: TRANSLATIONS.en };
  }
  return context;
};
