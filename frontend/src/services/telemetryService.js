import { MOCK_TELEMETRY } from '../data/mockTelemetry.js';
import { MOIL_MINES } from '../data/mockMines.js';

/**
 * Telemetry Service
 * Ready for seamless connection to FastAPI /api/mines and /api/telemetry
 */
export const TelemetryService = {
  async getMines() {
    return Promise.resolve(MOIL_MINES);
  },

  async getMineById(mineId) {
    const mine = MOIL_MINES.find(m => m.id === mineId) || MOIL_MINES[0];
    return Promise.resolve(mine);
  },

  async getKPIs(mineId) {
    return Promise.resolve(MOCK_TELEMETRY.kpis);
  },

  async getForecastSeries(mineId) {
    return Promise.resolve(MOCK_TELEMETRY.forecastSeries);
  },

  async getTrustPillars(mineId) {
    return Promise.resolve(MOCK_TELEMETRY.trustPillars);
  }
};
