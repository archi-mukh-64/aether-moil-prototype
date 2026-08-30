import { MOCK_TELEMETRY } from '../data/mockTelemetry.js';

/**
 * Equipment Fleet & IoT Diagnostics Service
 * Ready for connection to FastAPI /api/equipment and /api/equipment/rul
 */
export const EquipmentService = {
  async getFleetAssets(mineId) {
    return Promise.resolve(MOCK_TELEMETRY.fleetAssets);
  },

  async getAssetDiagnostics(assetId) {
    const asset = MOCK_TELEMETRY.fleetAssets.find(a => a.id === assetId) || MOCK_TELEMETRY.fleetAssets[0];
    return Promise.resolve(asset);
  }
};
