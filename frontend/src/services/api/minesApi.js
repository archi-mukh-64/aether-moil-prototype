import { apiClient } from './apiClient.js';

export const minesApi = {
  getAllMines: async (options = {}) => {
    const res = await apiClient.get('/mines', options);
    return res.data?.mines || [];
  },

  getMineById: async (mineId, options = {}) => {
    const res = await apiClient.get(`/mines/${mineId}`, options);
    return res.data;
  },

  getMineTelemetry: async (mineId, options = {}) => {
    const res = await apiClient.get(`/mines/${mineId}/telemetry`, options);
    return res.data;
  },

  getMineAnalytics: async (mineId, options = {}) => {
    const res = await apiClient.get(`/mines/${mineId}/analytics`, options);
    return res.data;
  },

  getMineEquipment: async (mineId, options = {}) => {
    const res = await apiClient.get(`/mines/${mineId}/equipment`, options);
    return res.data?.fleet || [];
  },

  getMineReserve: async (mineId, options = {}) => {
    const res = await apiClient.get(`/mines/${mineId}/reserve`, options);
    return res.data;
  },

  getMineTrust: async (mineId, options = {}) => {
    const res = await apiClient.get(`/mines/${mineId}/trust`, options);
    return res.data;
  }
};
