export const API_BASE_URL = '/api';

export const API_ENDPOINTS = {
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_LOGOUT: `${API_BASE_URL}/auth/logout`,
  USERS: `${API_BASE_URL}/users`,
  STOCK_LIST: 'https://qtfund.com/api/stock-price/list',
  STOCK_INFO: 'https://qtfund.com/api/stock-price/info',
  STOCK_QUERY: 'https://qtfund.com/api/stock-price/query',
  CUSTOM_CALCULATIONS_EXECUTE: 'https://qtfund.com/api/custom-calculations/execute',
  CUSTOM_CALCULATIONS_SCRIPTS: 'https://qtfund.com/api/custom-calculations/scripts',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
};

export const DEFAULT_CREDENTIALS = {
  USERNAME: 'admin',
  PASSWORD: 'admin123',
};

