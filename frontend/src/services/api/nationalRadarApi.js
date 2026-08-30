/**
 * National Radar API Service
 * Interacts with backend /api/national-radar endpoints with automatic local fallback.
 */
import { apiClient } from './apiClient.js';
import { calculateNationalRadarAnalysis, getNationalCrossMineCorrelations, simulateNationalCapitalAllocation, NATIONAL_RADAR_MODES } from '../nationalRadarEngine.js';

export const nationalRadarApi = {
  async getModes() {
    try {
      const res = await apiClient.get('/national-radar/modes');
      if (res && res.data) {
        return res.data;
      }
    } catch (e) {
      // fallback
    }
    return { modes: NATIONAL_RADAR_MODES };
  },

  async analyzeMode(modeId = 'NATIONAL_PERFORMANCE', scenarioId = null) {
    try {
      const endpoint = `/national-radar/analyze?mode=${encodeURIComponent(modeId)}${scenarioId ? `&scenario=${encodeURIComponent(scenarioId)}` : ''}`;
      const res = await apiClient.get(endpoint);
      if (res && res.data) {
        return res.data;
      }
    } catch (e) {
      // fallback
    }
    return {
      mode: modeId,
      modeConfig: NATIONAL_RADAR_MODES[modeId] || NATIONAL_RADAR_MODES.NATIONAL_PERFORMANCE,
      rankedMines: calculateNationalRadarAnalysis(modeId, null, { scenarioId }),
      driverWeights: (NATIONAL_RADAR_MODES[modeId] || NATIONAL_RADAR_MODES.NATIONAL_PERFORMANCE).driverWeights
    };
  },

  async getCorrelations() {
    try {
      const res = await apiClient.get('/national-radar/correlations');
      if (res && res.data) {
        return res.data;
      }
    } catch (e) {
      // fallback
    }
    return { correlations: getNationalCrossMineCorrelations() };
  },

  async simulateCapital(investCrores = 100) {
    try {
      const res = await apiClient.get(`/national-radar/what-if?invest_crores=${investCrores}`);
      if (res && res.data) {
        return res.data;
      }
    } catch (e) {
      // fallback
    }
    return simulateNationalCapitalAllocation(investCrores);
  }
};
