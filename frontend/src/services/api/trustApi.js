import { apiClient } from './apiClient.js';

export const trustApi = {
  getTrustProfile: async (mineId = 'balaghat', options = {}) => {
    const res = await apiClient.get(`/trust?mine_id=${encodeURIComponent(mineId)}`, options);
    return res.data;
  }
};
