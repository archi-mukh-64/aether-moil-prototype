/**
 * MOIL Platform Formatting Utilities
 */

export const formatTonnage = (num) => {
  if (num === null || num === undefined) return '--';
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(num) + ' T';
};

export const formatCurrencyINR = (num) => {
  if (num === null || num === undefined) return '--';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

export const formatPercentage = (num, decimals = 1) => {
  if (num === null || num === undefined) return '--';
  return `${Number(num).toFixed(decimals)}%`;
};

export const formatMnGrade = (gradeVal) => {
  if (!gradeVal) return '--';
  return `${gradeVal}% Mn`;
};
