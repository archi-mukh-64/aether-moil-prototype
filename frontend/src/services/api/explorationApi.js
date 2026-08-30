/**
 * AI Exploration & Virtual Core Drill API Service
 */
import { apiClient } from './apiClient.js';

export const explorationApi = {
  async getTargets(mineId = 'balaghat') {
    try {
      const res = await apiClient.get(`/exploration/targets/${encodeURIComponent(mineId)}`);
      if (res && res.data) {
        return res.data;
      }
    } catch (e) {
      // fallback
    }
    return null;
  },

  async runScan(mineId = 'balaghat') {
    try {
      const res = await apiClient.post(`/exploration/scan?mine_id=${encodeURIComponent(mineId)}`);
      if (res && res.data) {
        return res.data;
      }
    } catch (e) {
      // fallback
    }
    return null;
  },

  async virtualDrill(mineId = 'balaghat', depthM = 145) {
    try {
      const res = await apiClient.get(`/exploration/drill/${encodeURIComponent(mineId)}?depth_m=${depthM}`);
      if (res && res.data) {
        return res.data;
      }
    } catch (e) {
      // fallback
    }
    return null;
  }
};
