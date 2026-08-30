import { apiClient } from './apiClient.js';

export const feedbackApi = {
  submitFeedback: async (payload, options = {}) => {
    const res = await apiClient.post('/feedback', payload, options);
    return res.data;
  },

  listFeedback: async (limit = 50, options = {}) => {
    const res = await apiClient.get(`/feedback?limit=${limit}`, options);
    return res.data || [];
  },

  recordDecision: async (payload, options = {}) => {
    const res = await apiClient.post('/feedback/decision', payload, options);
    return res.data;
  },

  listDecisions: async (limit = 50, options = {}) => {
    const res = await apiClient.get(`/feedback/decisions?limit=${limit}`, options);
    return res.data || [];
  }
};
