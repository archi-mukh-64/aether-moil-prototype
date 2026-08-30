import { apiClient } from './apiClient.js';

export const telemetryApi = {
  getTelemetrySnapshot: async (mineId = 'balaghat', options = {}) => {
    const res = await apiClient.get(`/telemetry?mine_id=${encodeURIComponent(mineId)}`, options);
    return res.data;
  }
};
