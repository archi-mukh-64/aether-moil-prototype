import { apiClient } from './apiClient.js';

export const equipmentApi = {
  predictEquipment: async (payload, options = {}) => {
    const res = await apiClient.post('/equipment/predict', payload, options);
    return res.data;
  },

  getEquipmentFleet: async (mineId, options = {}) => {
    const res = await apiClient.get(`/mines/${mineId}/equipment`, options);
    return res.data?.fleet || [];
  }
};
