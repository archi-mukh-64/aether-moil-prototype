import { MOCK_TELEMETRY } from '../data/mockTelemetry.js';

/**
 * Alert & Anomaly Service
 * Ready for connection to FastAPI /api/alerts and /api/explain/shap
 */
export const AlertService = {
  async getRiskMatrix() {
    return Promise.resolve(MOCK_TELEMETRY.riskMatrix);
  },

  async getShapAttributions(predictionId) {
    return Promise.resolve([
      { name: 'Monsoon Rainfall Influx (>65mm)', value: '+34.2%', direction: 'positive', impact: 'Elevates shortfall deficit risk significantly', category: 'Environmental' },
      { name: 'Primary Crusher CR-01 Harmonic (4.8mm/s)', value: '+22.5%', direction: 'positive', impact: 'Limits ore processing throughput by 45 TPH', category: 'Equipment' },
      { name: 'Shaft 2 Deep Sump Water Ingress (28 m³/h)', value: '+18.1%', direction: 'positive', impact: 'Restricts skip hoisting frequency at -185m', category: 'Hydrogeological' },
      { name: 'High-Grade Surface Stockpile Blending (44% Mn)', value: '-14.6%', direction: 'negative', impact: 'Buffers daily manganese target quota', category: 'Operational' },
      { name: 'Auxiliary Submersible Pump Readiness', value: '-8.4%', direction: 'negative', impact: 'Accelerates emergency dewatering rate', category: 'Operational' }
    ]);
  }
};
