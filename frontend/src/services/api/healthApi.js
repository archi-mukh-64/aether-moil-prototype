import { apiClient } from './apiClient.js';

export const healthApi = {
  checkHealth: async (options = {}) => {
    const res = await apiClient.get('/health', { ...options, silent: true });
    return res.data;
  }
};
