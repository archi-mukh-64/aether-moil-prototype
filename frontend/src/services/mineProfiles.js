/**
 * Comprehensive MOIL Mine Baseline Profiles & Equipment Fleet Generator
 * Re-exports the authoritative MOIL_MINE_REGISTRY with dynamic fleet generators.
 */

import { MOIL_MINE_REGISTRY } from './mineRegistry.js';

export { MOIL_MINE_REGISTRY };
export const MINE_PROFILES = MOIL_MINE_REGISTRY;

/**
 * Dynamically generates machine fleet for any selected mine asset.
 */
export function generateMineFleetAssets(mineId, activeStress = null) {
  const mine = MOIL_MINE_REGISTRY[mineId] || MOIL_MINE_REGISTRY.balaghat;
  const pfx = mineId === 'dongri-buzurg' ? 'DON' : (mine.shortName || mineId).slice(0, 3).toUpperCase();

  const isCrusherStress = activeStress?.scenarioId === 'CRUSHER' || activeStress?.scenarioId === 'MULTI_RISK';
  const isFleetStress = activeStress?.scenarioId === 'FLEET';
  const isMonsoonStress = activeStress?.scenarioId === 'MONSOON';

  const crusherHealth = isCrusherStress
    ? Math.max(38, Math.round(mine.crusherHealthBase - 32))
    : mine.crusherHealthBase;

  const crusherVib = isCrusherStress
    ? `${(mine.crusherVibBase || 2.1) + 2.8} mm/s (Peak FFT 42Hz)`
    : `${mine.crusherVibBase || 2.1} mm/s`;

  const crusherTemp = isCrusherStress
    ? `${(mine.crusherTempBase || 68) + 34}°C`
    : `${mine.crusherTempBase || 68}°C`;

  const isUnderground = (mine.mineType || mine.type || '').includes('Underground');

  return [
    {
      id: `CR-${pfx}-01`,
      name: `${mine.shortName} Primary Jaw Crusher (${mine.crusherCapacityTPH || 250} TPH)`,
      type: 'Crushing & Sizing Unit',
      health: crusherHealth,
      status: crusherHealth < 50 ? 'Critical' : crusherHealth < 75 ? 'Warning' : 'Optimal',
      vibration: crusherVib,
      temp: crusherTemp,
      pressure: '172 Bar',
      utilization: isCrusherStress ? '54.2%' : '88.5%',
      availability: isCrusherStress ? '68.0%' : '96.2%',
      operatingHours: '3,840 Hrs',
      criticality: 'High Priority (Single Line)',
      rulDays: isCrusherStress ? 4 : 48
    },
    {
      id: `DP-${pfx}-101`,
      name: `Heavy Haul Dumper Fleet (${mine.fleetCount || mine.fleetSize || 24} Units)`,
      type: 'Haulage Fleet Unit',
      health: isFleetStress ? 48 : 92,
      status: isFleetStress ? 'Warning' : 'Optimal',
      vibration: isFleetStress ? '3.8 mm/s' : '1.8 mm/s',
      temp: isFleetStress ? '96°C' : '82°C',
      pressure: isFleetStress ? '142 Bar (Seal Leak)' : '180 Bar',
      utilization: isFleetStress ? '42.0%' : '84.0%',
      availability: isFleetStress ? '50.0%' : `${mine.fleetAvailabilityBase}%`,
      operatingHours: '1,420 Hrs',
      criticality: 'Medium Priority',
      rulDays: isFleetStress ? 6 : 90
    },
    {
      id: `EX-${pfx}-01`,
      name: `${mine.shortName} Face Shovel / Loading Hoist`,
      type: isUnderground ? 'Underground Skip Winder Unit' : 'Face Shovel Excavator (2.5m³)',
      health: 88,
      status: 'Optimal',
      vibration: '1.4 mm/s',
      temp: '74°C',
      pressure: '185 Bar',
      utilization: '79.2%',
      availability: '93.5%',
      operatingHours: '2,180 Hrs',
      criticality: 'High Priority',
      rulDays: 72
    },
    {
      id: `PU-${pfx}-01`,
      name: `${mine.shortName} Sump Drainage Pump (${mine.maxDrainageCapacityM3h || 30} m³/h)`,
      type: 'Hydrogeological Drainage Unit',
      health: isMonsoonStress ? 64 : 96,
      status: isMonsoonStress ? 'Warning' : 'Optimal',
      vibration: isMonsoonStress ? '3.2 mm/s' : '1.2 mm/s',
      temp: isMonsoonStress ? '84°C' : '62°C',
      pressure: '190 Bar',
      utilization: isMonsoonStress ? '96.4% (Max Throughput)' : `${Math.round(((mine.drainageBaselineM3h || 10) / (mine.maxDrainageCapacityM3h || 30)) * 100)}% Nominal`,
      availability: '98.0%',
      operatingHours: '980 Hrs',
      criticality: 'Safety Critical (Sump)',
      rulDays: isMonsoonStress ? 12 : 120
    }
  ];
}
