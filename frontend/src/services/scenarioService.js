import { MOCK_SCENARIOS, SCENARIO_MINES, SCENARIO_TYPES, INITIAL_AUDIT_LOGS } from '../data/mockScenarios.js';

/**
 * Scenario Service
 * Abstracted asynchronous interface for the MOIL Operational Scenario Lab.
 * Cleanly prepared for future FastAPI integration.
 */
export const ScenarioService = {
  async getMines() {
    return Promise.resolve(SCENARIO_MINES);
  },

  async getScenarioTypes() {
    return Promise.resolve(SCENARIO_TYPES);
  },

  async getScenarioById(scenarioId) {
    const scenario = MOCK_SCENARIOS.find(s => s.id === scenarioId) || MOCK_SCENARIOS[0];
    return Promise.resolve(scenario);
  },

  async runSimulation({ mineId, scenarioId, severity = 'HIGH', horizon = '24 HOURS' }) {
    const baseScenario = MOCK_SCENARIOS.find(s => s.id === scenarioId) || MOCK_SCENARIOS[0];
    const targetMine = SCENARIO_MINES.find(m => m.id === mineId) || SCENARIO_MINES[0];

    // Compute dynamic adjusted profile based on severity
    const severityProfile = baseScenario.profiles?.[severity] || baseScenario.profiles?.HIGH || {};

    const simulationResult = {
      ...baseScenario,
      targetMineObj: targetMine,
      targetMineName: targetMine.name,
      appliedSeverity: severity,
      appliedHorizon: horizon,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      prediction: {
        ...baseScenario.prediction,
        productionAtRisk: severityProfile.lossTonnes || baseScenario.prediction.productionAtRisk,
        productionAtRiskFormatted: `${(severityProfile.lossTonnes || baseScenario.prediction.productionAtRisk).toLocaleString()} T`,
        shortfallProbability: severityProfile.riskPct || baseScenario.prediction.shortfallProbability,
        modelConfidence: severityProfile.conf || baseScenario.prediction.modelConfidence,
        horizon: horizon,
        targetQuota: targetMine.baseOutput,
        unmitigatedYield: targetMine.baseOutput - (severityProfile.lossTonnes || baseScenario.prediction.productionAtRisk)
      }
    };

    return Promise.resolve(simulationResult);
  },

  async recordDecision(decisionData) {
    const logEntry = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-US', { hour12: false })} IST`,
      mine: decisionData.mine,
      scenario: decisionData.scenario,
      detectedSignal: decisionData.detectedSignal,
      prediction: decisionData.prediction,
      confidence: decisionData.confidence,
      recommendation: decisionData.recommendation,
      selectedOption: decisionData.selectedOption,
      simulationResult: decisionData.simulationResult,
      operatorDecision: decisionData.operatorDecision,
      operatorName: decisionData.operatorName,
      operatorNote: decisionData.operatorNote,
      expectedImpact: decisionData.expectedImpact,
      realizedOutcome: decisionData.realizedOutcome
    };

    return Promise.resolve(logEntry);
  },

  async getAuditLogs() {
    return Promise.resolve(INITIAL_AUDIT_LOGS);
  }
};
