import { useState, useEffect, useRef, useCallback } from 'react';
import { minesApi } from '../services/api/minesApi.js';

/**
 * Custom React hook for live telemetry polling with request cancellation and race condition safety.
 */
export function useLiveTelemetry(mineId, intervalMs = 6000, enabled = true) {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const activeMineIdRef = useRef(mineId);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    activeMineIdRef.current = mineId;
  }, [mineId]);

  const fetchTelemetry = useCallback(async (isInitial = false) => {
    if (!mineId || !enabled) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (isInitial) {
      setLoading(true);
    }

    try {
      const data = await minesApi.getMineTelemetry(mineId, {
        signal: controller.signal,
        silent: true
      });

      // Ensure response matches currently selected mine
      if (activeMineIdRef.current === mineId && data) {
        setTelemetry(data);
        setLastUpdated(new Date().toISOString());
        setError(null);
      }
    } catch (err) {
      if (err.name !== 'AbortError' && activeMineIdRef.current === mineId) {
        setError(err.message || 'Telemetry synchronization paused');
      }
    } finally {
      if (activeMineIdRef.current === mineId && isInitial) {
        setLoading(false);
      }
    }
  }, [mineId, enabled]);

  useEffect(() => {
    if (!mineId || !enabled) return;

    fetchTelemetry(true);
    const interval = setInterval(() => {
      fetchTelemetry(false);
    }, intervalMs);

    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [mineId, intervalMs, enabled, fetchTelemetry]);

  return {
    telemetry,
    loading,
    error,
    lastUpdated,
    refresh: () => fetchTelemetry(false)
  };
}
