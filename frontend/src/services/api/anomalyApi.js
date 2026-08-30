import { apiClient } from './apiClient.js';

export const anomalyApi = {
  detectAnomaly: async (payload, options = {}) => {
    const res = await apiClient.post('/anomaly/detect', payload, options);
    return res.data;
  }
};
