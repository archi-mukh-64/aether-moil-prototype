import { useState, useEffect } from 'react';
import { TelemetryService } from '../services/telemetryService.js';

export const useTelemetry = (mineId) => {
  const [kpis, setKpis] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchTelemetry = async () => {
      setLoading(true);
      try {
        const [kpiData, forecastData] = await Promise.all([
          TelemetryService.getKPIs(mineId),
          TelemetryService.getForecastSeries(mineId)
        ]);
        if (isMounted) {
          setKpis(kpiData);
          setForecast(forecastData);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) setLoading(false);
      }
    };
    fetchTelemetry();
    return () => { isMounted = false; };
  }, [mineId]);

  return { kpis, forecast, loading };
};
