/**
 * Central API Client for MOIL Mining Intelligence Platform
 * Handles HTTP requests, abort timeouts, JSON parsing, structured error interception, and request tracing.
 */

const RAW_API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) 
  ? import.meta.env.VITE_API_BASE_URL 
  : '/api';

// Normalize by stripping any trailing slash
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '');
const FALLBACK_API_BASE_URL = 'http://127.0.0.1:8000/api';
const DEFAULT_TIMEOUT_MS = 8000;

export class APIError extends Error {
  constructor(message, status = 500, data = null, requestId = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
    this.requestId = requestId;
    this.isApiError = true;
  }
}

async function request(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let url = `${API_BASE_URL}${cleanEndpoint}`;
  const timeoutMs = options.timeout || DEFAULT_TIMEOUT_MS;
  const requestId = options.requestId || `client-req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Request-ID': requestId,
    ...(options.headers || {})
  };

  const startTime = performance.now();

  try {
    const fetchOptions = {
      method: options.method || 'GET',
      headers,
      signal: options.signal ? options.signal : controller.signal
    };

    if (options.body && options.method !== 'GET') {
      fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
    }

    let response;
    try {
      response = await fetch(url, fetchOptions);
    } catch (primaryFetchErr) {
      // In local development only, if relative /api failed due to direct file preview, try direct backend URL
      if (typeof import.meta !== 'undefined' && import.meta.env?.DEV && url.startsWith('/api')) {
        url = `${FALLBACK_API_BASE_URL}${cleanEndpoint}`;
        response = await fetch(url, fetchOptions);
      } else {
        throw primaryFetchErr;
      }
    }
    clearTimeout(timeoutId);

    const elapsedMs = Math.round(performance.now() - startTime);

    let responseData = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json().catch(() => null);
    } else {
      const text = await response.text().catch(() => '');
      responseData = text ? { raw: text } : null;
    }

    if (!response.ok) {
      const errorMsg = responseData?.detail || responseData?.message || `HTTP ${response.status}: ${response.statusText}`;
      if (import.meta.env.DEV) {
        console.warn(`[MOIL API] ${options.method || 'GET'} ${url} -> ${response.status} (${elapsedMs}ms):`, errorMsg);
      }
      throw new APIError(errorMsg, response.status, responseData, requestId);
    }

    if (import.meta.env.DEV && !options.silent) {
      console.debug(`[MOIL API] ${options.method || 'GET'} ${url} -> 200 (${elapsedMs}ms)`);
    }

    return {
      success: true,
      status: response.status,
      data: responseData,
      requestId,
      elapsedMs
    };
  } catch (err) {
    clearTimeout(timeoutId);
    const elapsedMs = Math.round(performance.now() - startTime);

    if (err.name === 'AbortError') {
      const timeoutError = new APIError(`Request timeout after ${timeoutMs}ms`, 408, null, requestId);
      if (import.meta.env.DEV) {
        console.warn(`[MOIL API TIMEOUT] ${options.method || 'GET'} ${url} (${elapsedMs}ms)`);
      }
      throw timeoutError;
    }

    if (err.isApiError) {
      throw err;
    }

    // Network disconnection / Backend offline error
    const netError = new APIError(
      err.message || 'FastAPI backend connection unavailable',
      0,
      { isOffline: true },
      requestId
    );
    throw netError;
  }
}

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
  getBaseUrl: () => API_BASE_URL
};
