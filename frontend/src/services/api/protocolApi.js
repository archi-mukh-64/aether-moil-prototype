import { apiClient } from './apiClient.js';

export const protocolApi = {
  optimizeProtocol: async (payload, options = {}) => {
    const res = await apiClient.post('/protocol/optimize', payload, options);
    return res.data;
  }
};
