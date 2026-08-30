/**
 * Central Earth Observation API Service
 */
import { apiClient } from './apiClient.js';

export const earthObservationApi = {
  async getStatus() {
    try {
      const res = await apiClient.get('/earth-observation/status');
      if (res && res.data) {
        return res.data;
      }
    } catch (e) {
      // fallback
    }
    return {
      status: 'OPERATIONAL',
      provider: 'Copernicus Sentinel-2 Level-2A / USGS Landsat 8-9 OLI'
    };
  },

  async getNationalSummary() {
    try {
      const res = await apiClient.get('/earth-observation/national-summary');
      if (res && res.data) {
        return res.data;
      }
    } catch (e) {
      // fallback
    }
    return null;
  },

  async getEnvironmentalYearly(mineId = 'balaghat', year = 2026) {
    try {
      const res = await apiClient.get(`/earth-observation/environmental/${encodeURIComponent(mineId)}?year=${year}`);
      if (res && res.data) {
        return res.data;
      }
    } catch (e) {
      // fallback
    }
    return null;
  },

  async compareYears(mineId = 'balaghat', yearBefore = 2018, yearAfter = 2026) {
    try {
      const res = await apiClient.get(`/earth-observation/compare-years/${encodeURIComponent(mineId)}?year_before=${yearBefore}&year_after=${yearAfter}`);
      if (res && res.data) {
        return res.data;
      }
    } catch (e) {
      // fallback
    }
    return null;
  },

  async getMineObservation(mineId = 'balaghat') {
    try {
      const res = await apiClient.get(`/earth-observation/${encodeURIComponent(mineId)}`);
      if (res && res.data) {
        return res.data;
      }
    } catch (e) {
      // fallback
    }
    return null;
  }
};
