export const API_BASE_URL = '/api';

export const API_ENDPOINTS = {
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_LOGOUT: `${API_BASE_URL}/auth/logout`,
  USERS: `${API_BASE_URL}/users`,
  STOCK_LIST: 'http://localhost:8000/api/stock-price/list',
  STOCK_INFO: 'http://localhost:8000/api/stock-price/info',
  STOCK_QUERY: 'http://localhost:8000/api/stock-price/query',
  CUSTOM_CALCULATIONS_EXECUTE: 'http://localhost:8000/api/custom-calculations/execute',
  CUSTOM_CALCULATIONS_SCRIPTS: 'http://localhost:8000/api/custom-calculations/scripts',
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

