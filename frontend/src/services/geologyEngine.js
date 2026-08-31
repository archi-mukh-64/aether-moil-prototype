/**
 * MOIL Geology & Depth Stratigraphy Calculation Engine
 * Deterministic, dependency-driven geological depth stratigraphy for Exploration Reserve Radar.
 * ZERO Math.random(). Fully reproducible and grounded in Sausar Belt geology.
 */

export const MINE_GEOLOGY_PROFILES = {
  // MADHYA PRADESH
  balaghat: {
    name: 'Balaghat Deep Shaft',
    formation: 'Mansar Formation & Gondite Horizon',
    baseDepthM: 185,
    maxMnGrade: 47.4,
    peakDepthM: 175,
    reefThicknessM: 9.8,
    phosphorusBase: 0.08,
    silicaBase: 12.4,
    prospectivityMultiplier: 1.15
  },
  ukwa: {
    name: 'Ukwa Low-Phosphorus',
    formation: 'Bharweli-Ukwa Schistose Low-Phosphorus Ore',
    baseDepthM: 110,
    maxMnGrade: 44.8,
    peakDepthM: 115,
    reefThicknessM: 8.5,
    phosphorusBase: 0.05,
    silicaBase: 14.0,
    prospectivityMultiplier: 1.05
  },
  tirodi: {
    name: 'Tirodi Manganese Lease',
    formation: 'Tirodi Biotite Gneiss & Braunite Veins',
    baseDepthM: 90,
    maxMnGrade: 39.4,
    peakDepthM: 95,
    reefThicknessM: 6.8,
    phosphorusBase: 0.12,
    silicaBase: 16.2,
    prospectivityMultiplier: 0.90
  },
  sitapatore: {
    name: 'Sitapatore Deposit',
    formation: 'Quartz-Mica Schist & Sub-Horizontal Gondite',
    baseDepthM: 80,
    maxMnGrade: 40.2,
    peakDepthM: 85,
    reefThicknessM: 7.0,
    phosphorusBase: 0.11,
    silicaBase: 15.8,
    prospectivityMultiplier: 0.92
  },

  // MAHARASHTRA
  chikla: {
    name: 'Chikla Mine',
    formation: 'Mansar Gondite & Supergene Braunite Lenticles',
    baseDepthM: 140,
    maxMnGrade: 45.2,
    peakDepthM: 145,
    reefThicknessM: 9.2,
    phosphorusBase: 0.09,
    silicaBase: 11.8,
    prospectivityMultiplier: 1.12
  },
  'dongri-buzurg': {
    name: 'Dongri Buzurg Opencast',
    formation: 'Bichua Dolomite & Supergene MnO₂',
    baseDepthM: 70,
    maxMnGrade: 49.5,
    peakDepthM: 65,
    reefThicknessM: 14.2,
    phosphorusBase: 0.06,
    silicaBase: 9.2,
    prospectivityMultiplier: 1.20
  },
  beldongri: {
    name: 'Beldongri Mine',
    formation: 'Mansar Schist Lenticular Manganese Bed',
    baseDepthM: 75,
    maxMnGrade: 42.0,
    peakDepthM: 75,
    reefThicknessM: 6.5,
    phosphorusBase: 0.10,
    silicaBase: 13.5,
    prospectivityMultiplier: 0.95
  },
  gumgaon: {
    name: 'Gumgaon Incline Mine',
    formation: 'Mansar Quartzite & Isoclinal Fold Manganese',
    baseDepthM: 120,
    maxMnGrade: 41.8,
    peakDepthM: 130,
    reefThicknessM: 7.2,
    phosphorusBase: 0.12,
    silicaBase: 18.4,
    prospectivityMultiplier: 0.95
  },
  kandri: {
    name: 'Kandri Mine',
    formation: 'Kandri Hill Mansar Gondite Horizon',
    baseDepthM: 105,
    maxMnGrade: 46.5,
    peakDepthM: 110,
    reefThicknessM: 11.0,
    phosphorusBase: 0.08,
    silicaBase: 10.8,
    prospectivityMultiplier: 1.14
  },
  munsar: {
    name: 'Munsar Mine',
    formation: 'Munsar Syncline Mansar Formation Ore',
    baseDepthM: 115,
    maxMnGrade: 43.6,
    peakDepthM: 125,
    reefThicknessM: 9.5,
    phosphorusBase: 0.09,
    silicaBase: 12.6,
    prospectivityMultiplier: 1.08
  },

  // REGIONAL OPERATIONS
  'ramtek-ops': {
    name: 'Ramtek Regional Operations',
    formation: 'Ramtek Regional Sausar Belt Cluster',
    baseDepthM: 105,
    maxMnGrade: 43.8,
    peakDepthM: 105,
    reefThicknessM: 9.8,
    phosphorusBase: 0.09,
    silicaBase: 12.3,
    prospectivityMultiplier: 1.05
  },
  'bhandara-ops': {
    name: 'Bhandara Regional Operations',
    formation: 'Bhandara High-Grade Gondite Corridor',
    baseDepthM: 95,
    maxMnGrade: 46.8,
    peakDepthM: 95,
    reefThicknessM: 13.0,
    phosphorusBase: 0.07,
    silicaBase: 10.5,
    prospectivityMultiplier: 1.15
  }
};

/**
 * Deterministically calculates geological interval and assay metrics at any exploration depth.
 * @param {string} mineId - Target mine identifier
 * @param {number} depthM - Continuous drilling depth in meters (30m - 350m)
 * @param {string} band - Selected remote sensing band (SWIR, NDVI, NDWI, LITHOLOGY)
 */
export function calculateGeologyAtDepth(mineId = 'balaghat', depthM = 120, band = 'SWIR') {
  const profile = MINE_GEOLOGY_PROFILES[mineId] || MINE_GEOLOGY_PROFILES.balaghat;

  // Normalized depth relative to peak manganese reef depth
  const deltaDepth = Math.abs(depthM - profile.peakDepthM);

  // Gaussian bell curve for % Mn Grade centered at peakDepthM
  const gaussianFactor = Math.exp(-Math.pow(deltaDepth / 55, 2));

  // Deterministic secondary sinusoids to model natural mineral banding and interbedded quartzite lenses
  const ripple = Math.sin(depthM * 0.14) * 1.8 + Math.cos(depthM * 0.05) * 1.2;

  // Calculated Mn Grade %
  let mnGrade = (profile.maxMnGrade - 18.0) * gaussianFactor + 22.0 + ripple;
  mnGrade = Math.min(52.0, Math.max(18.5, Math.round(mnGrade * 10) / 10));

  // Calculated Silica SiO2 % (inversely related to Mn grade)
  let silica = profile.silicaBase + (1.0 - gaussianFactor) * 22.0 - ripple * 0.8;
  silica = Math.min(46.0, Math.max(7.5, Math.round(silica * 10) / 10));

  // Calculated Phosphorus P %
  let phosphorus = profile.phosphorusBase + (deltaDepth / 250) * 0.06;
  phosphorus = Math.round(phosphorus * 1000) / 1000;

  // Calculated Iron Fe %
  let iron = 4.2 + (gaussianFactor * 2.6) + Math.cos(depthM * 0.08) * 0.6;
  iron = Math.round(iron * 10) / 10;

  // Band-specific spectral absorption / reflection signature
  let spectralIndex = 0.65;
  let bandLabel = 'Sentinel-2 Band 12 (SWIR 2.19µm)';
  let absorptionFeature = 'Al-OH / Hydrothermal Gondite Absorption';

  if (band === 'SWIR') {
    spectralIndex = 0.42 + gaussianFactor * 0.48;
    bandLabel = 'Sentinel-2 SWIR B11/B12 (2.19µm)';
    absorptionFeature = 'Manganese Supergene Hydroxide Absorption Peak';
  } else if (band === 'NDVI') {
    spectralIndex = Math.max(0.12, 0.45 - (depthM / 400) * 0.3);
    bandLabel = 'Vegetation Density Index (NIR/Red)';
    absorptionFeature = 'Surface Overburden Biomass Index';
  } else if (band === 'NDWI') {
    spectralIndex = 0.28 + (deltaDepth < 30 ? 0.35 : 0.1);
    bandLabel = 'Water & Hydrogeological Ingress Index';
    absorptionFeature = 'Sub-surface Fractured Aquifer Indicator';
  } else if (band === 'LITHOLOGY') {
    spectralIndex = 0.55 + gaussianFactor * 0.38;
    bandLabel = 'Lithological Quartzite-Gondite Ratio';
    absorptionFeature = 'Mansar Formation Bedding Contact';
  }

  // Model Prospectivity Index
  const prospectivityScore = Math.min(99.4, Math.max(45.0, Math.round((gaussianFactor * 65 + 32) * profile.prospectivityMultiplier * 10) / 10));

  // Model Confidence
  const confidencePct = Math.round((88.0 + gaussianFactor * 9.5) * 10) / 10;

  // Stratigraphy Layer Classification
  let stratumLayer = 'Footwall Mica Schist & Quartzite';
  let rockDensity = 2.65;
  let layerStatus = 'Overburden Host Rock';

  if (deltaDepth <= 15) {
    stratumLayer = 'High-Grade Massive Braunite / Pyrolusite Horizon';
    rockDensity = 4.35;
    layerStatus = 'Target Ore Reef (Primary Grade)';
  } else if (deltaDepth <= 40) {
    stratumLayer = 'Interbedded Gondite (Mn Silicate) with Quartzite Lenses';
    rockDensity = 3.65;
    layerStatus = 'Secondary Economic Mineralization';
  } else if (depthM < profile.peakDepthM) {
    stratumLayer = 'Hanging Wall Dolomitic Marble & Chlorite Schist';
    rockDensity = 2.85;
    layerStatus = 'Cap Rock / Structural Contact';
  }

  return {
    mineId,
    mineName: profile.name,
    formation: profile.formation,
    depthM,
    band,
    bandLabel,
    absorptionFeature,
    spectralIndex: Math.round(spectralIndex * 100) / 100,
    mnGrade,
    silica,
    phosphorus,
    iron,
    prospectivityScore,
    confidencePct,
    stratumLayer,
    rockDensity,
    layerStatus,
    peakDepthM: profile.peakDepthM,
    reefThicknessM: profile.reefThicknessM
  };
}
