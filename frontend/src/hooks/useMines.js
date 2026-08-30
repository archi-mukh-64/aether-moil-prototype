import { useState, useEffect } from 'react';
import { TelemetryService } from '../services/telemetryService.js';

export const useMines = () => {
  const [mines, setMines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchMines = async () => {
      setLoading(true);
      try {
        const data = await TelemetryService.getMines();
        if (isMounted) {
          setMines(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) setLoading(false);
      }
    };
    fetchMines();
    return () => { isMounted = false; };
  }, []);

  return { mines, loading };
};
