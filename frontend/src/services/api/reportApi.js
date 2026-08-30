/**
 * MOIL Reports API Client Layer
 * Connects to /api/reports/national-pdf, /api/reports/mine-pdf/{mine_id},
 * /api/reports/national-ppt, and /api/reports/mine-ppt/{mine_id}
 */

import { apiClient } from './apiClient.js';

const getReportBaseUrl = () => {
  const customBase = apiClient.getBaseUrl();
  return customBase ? `${customBase}/reports` : '/api/reports';
};

async function fetchBlobWithFallback(endpoint) {
  const baseUrl = getReportBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/pdf, application/vnd.openxmlformats-officedocument.presentationml.presentation, */*'
    }
  });

  if (!res.ok) {
    throw new Error(`Report generation returned HTTP ${res.status}: ${res.statusText}`);
  }
  return await res.blob();
}

export const reportApi = {
  /**
   * Downloads the authoritative MOIL National 10-Mine PDF Assessment Report
   */
  async downloadNationalReport(language = 'en') {
    try {
      const blob = await fetchBlobWithFallback(`/national-pdf?language=${language}`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MOIL_National_Mining_Intelligence_Report_${language.toUpperCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return true;
    } catch (err) {
      console.error('[MOIL REPORT API] Failed to download national PDF report:', err);
      throw err;
    }
  },

  /**
   * Downloads the individual mine SCADA assessment PDF
   */
  async downloadMineReport(mineId, language = 'en') {
    try {
      const blob = await fetchBlobWithFallback(`/mine-pdf/${mineId}?language=${language}`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MOIL_${(mineId || 'MINE').toUpperCase()}_Assessment_Report_${language.toUpperCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return true;
    } catch (err) {
      console.error('[MOIL REPORT API] Failed to download mine PDF report:', err);
      throw err;
    }
  },

  /**
   * Downloads the executive presentation slide deck (.pptx)
   */
  async downloadNationalPresentation(language = 'en') {
    try {
      const blob = await fetchBlobWithFallback(`/national-ppt?language=${language}`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MOIL_National_Executive_Presentation_${language.toUpperCase()}.pptx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return true;
    } catch (err) {
      console.error('[MOIL REPORT API] Failed to download presentation deck:', err);
      throw err;
    }
  },

  /**
   * Downloads the individual mine presentation slide deck (.pptx)
   */
  async downloadMinePresentation(mineId, language = 'en') {
    try {
      const blob = await fetchBlobWithFallback(`/mine-ppt/${mineId}?language=${language}`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MOIL_${(mineId || 'MINE').toUpperCase()}_Executive_Presentation_${language.toUpperCase()}.pptx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return true;
    } catch (err) {
      console.error('[MOIL REPORT API] Failed to download mine presentation deck:', err);
      throw err;
    }
  }
};
