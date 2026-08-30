import { apiClient } from './apiClient.js';

export const scenarioApi = {
  simulateScenario: async (payload, options = {}) => {
    const res = await apiClient.post('/scenarios/simulate', payload, options);
    return res.data;
  }
};
