export const formatCurrency = (value, decimals = 2) => {
  if (value === null || value === undefined) return '--';
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '--';
  return `${value.toFixed(decimals)}%`;
};

export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined) return '--';
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

export const formatVolume = (value) => {
  if (value === null || value === undefined) return '--';
  if (value >= 100000000) return `${(value / 100000000).toFixed(2)}亿`;
  if (value >= 10000) return `${(value / 10000).toFixed(2)}万`;
  return value.toString();
};

