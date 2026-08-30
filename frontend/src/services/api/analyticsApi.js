import { apiClient } from './apiClient.js';

export const analyticsApi = {
  getAnalytics: async (mineId = 'balaghat', options = {}) => {
    const res = await apiClient.get(`/analytics?mine_id=${encodeURIComponent(mineId)}`, options);
    return res.data;
  }
};
