const API_BASE = 'http://qtfund.com/api';

export const fetchStockList = async (options = {}) => {
  const params = new URLSearchParams();
  if (options.market_code) params.append('market_code', options.market_code);
  if (options.is_active !== undefined) params.append('is_active', options.is_active);
  if (options.limit) params.append('limit', options.limit);
  if (options.offset) params.append('offset', options.offset);

  const response = await fetch(`${API_BASE}/stock-price/list?${params}`);
  const data = await response.json();
  return data;
};

export const fetchStockInfo = async (symbol) => {
  const response = await fetch(`${API_BASE}/stock-price/info/${symbol}`);
  const data = await response.json();
  return data;
};

export const fetchStockHistory = async (symbol, options = {}) => {
  const params = new URLSearchParams({ symbol });
  if (options.start_date) params.append('start_date', options.start_date);
  if (options.end_date) params.append('end_date', options.end_date);
  if (options.limit) params.append('limit', options.limit);

  const response = await fetch(`${API_BASE}/stock-price/query?${params}`);
  const data = await response.json();
  return data;
};

