import { apiClient } from './apiClient.js';

export const alertApi = {
  predictShortfall: async (payload, options = {}) => {
    const res = await apiClient.post('/alert/predict', payload, options);
    return res.data;
  },

  listAlerts: async (params = {}, options = {}) => {
    const res = await apiClient.get('/alert/list', { params, ...options });
    return res.data;
  },

  acknowledgeAlert: async (payload, options = {}) => {
    const res = await apiClient.post('/alert/acknowledge', payload, options);
    return res.data;
  },

  resolveAlert: async (payload, options = {}) => {
    const res = await apiClient.post('/alert/resolve', payload, options);
    return res.data;
  },

  escalateAlert: async (payload, options = {}) => {
    const res = await apiClient.post('/alert/escalate', payload, options);
    return res.data;
  },

  generateAlert: async (payload, options = {}) => {
    const res = await apiClient.post('/alert/generate', payload, options);
    return res.data;
  },

  refreshAlerts: async (options = {}) => {
    const res = await apiClient.post('/alert/refresh', {}, options);
    return res.data;
  },

  get14DayForecast: async (payload, options = {}) => {
    const res = await apiClient.post('/forecast/14-day', payload, options);
    return res.data;
  }
};
