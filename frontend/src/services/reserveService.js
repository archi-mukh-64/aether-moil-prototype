/**
 * Exploration & Geological Reserve Service
 * Ready for connection to FastAPI /api/reserves and /api/reserves/drill-probe
 */
export const ReserveService = {
  async getProspectiveZones(mineId) {
    return Promise.resolve([
      {
        id: 'ZONE-A1',
        name: 'North-Eastern Sausar Strike Extension',
        formation: 'Mansar Schist & Gondite Horizon',
        estimatedMn: '44.8% Mn',
        confidence: '92.4%',
        strikeLength: '3.4 km',
        depthRange: '45m - 220m',
        status: 'HIGH PROSPECT'
      },
      {
        id: 'ZONE-B2',
        name: 'Dongri-Buzurg Western Limb Syncline',
        formation: 'Bichua Dolomite & Peroxide Ore',
        estimatedMn: '48.2% MnO₂',
        confidence: '88.6%',
        strikeLength: '1.8 km',
        depthRange: '20m - 140m',
        status: 'DRILL READY'
      },
      {
        id: 'ZONE-C3',
        name: 'Tirodi Southern Fault Boundary',
        formation: 'Tirodi Biotite Gneiss & Siliceous Ore',
        estimatedMn: '36.5% Mn',
        confidence: '78.1%',
        strikeLength: '2.1 km',
        depthRange: '80m - 310m',
        status: 'EXPLORATORY'
      }
    ]);
  },

  async simulateDrillProbe(depth) {
    return Promise.resolve({
      strata: 'Mansar Formation (Gondite & Manganese Reef)',
      thickness: '8.4 meters',
      mnGrade: '45.6% Mn (High-Grade Metallurgical)',
      feContent: '6.2% Fe',
      phosphorus: '0.08% P (Low-Phosphorus Tier)',
      recoveryRate: '94.2%',
      coordinates: '21.8092° N, 80.1914° E',
      timestamp: new Date().toLocaleTimeString()
    });
  }
};
