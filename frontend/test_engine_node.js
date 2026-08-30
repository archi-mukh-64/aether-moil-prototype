import { AlertForecastEngine, SCENARIO_PRESETS } from './src/services/alertForecastEngine.js';

const MINES = [
  'balaghat', 'tirodi', 'ukwa', 'munsar', 'kandri', 
  'gumgaon', 'chikla', 'dongri-buzurg', 'ramtek', 'bhandara'
];

console.log('Testing AlertForecastEngine in Node.js runtime...');

let passed = 0;
for (const m of MINES) {
  for (const s of SCENARIO_PRESETS) {
    const res = AlertForecastEngine.generateAlertForecast({
      mineId: m,
      scenarioId: s.id
    });
    
    if (!res || !res.forecast_points || res.forecast_points.length !== 14) {
      throw new Error(`Invalid forecast points for ${m} ${s.id}`);
    }
    if (!res.kpis || typeof res.kpis.avg_predicted_yield !== 'number') {
      throw new Error(`Invalid KPIs for ${m} ${s.id}`);
    }
    if (!res.waterfall_drivers || res.waterfall_drivers.length !== 5) {
      throw new Error(`Invalid waterfall drivers for ${m} ${s.id}`);
    }
    if (!res.ai_explanation || res.ai_explanation.length < 20) {
      throw new Error(`Invalid AI explanation for ${m} ${s.id}`);
    }
    passed++;
  }
}

console.log(`[PASS] ${passed} / ${passed} Node.js AlertForecastEngine executions passed without error!`);
