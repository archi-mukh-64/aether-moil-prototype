import { apiClient } from './apiClient.js';

export const reserveApi = {
  predictProspectivity: async (payload, options = {}) => {
    const res = await apiClient.post('/reserve/predict', payload, options);
    return res.data;
  },

  getReserveDetail: async (mineId, options = {}) => {
    const res = await apiClient.get(`/mines/${mineId}/reserve`, options);
    return res.data;
  }
};
