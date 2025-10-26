import { getApiBaseUrl } from '../config/apiConfig.js';

const API_BASE = getApiBaseUrl();

export const API_BASE_URL = '/api';

export const API_ENDPOINTS = {
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_LOGOUT: `${API_BASE_URL}/auth/logout`,
  USERS: `${API_BASE_URL}/users`,
  STOCK_LIST: `${API_BASE}/stock-price/list`,
  STOCK_INFO: `${API_BASE}/stock-price/info`,
  STOCK_QUERY: `${API_BASE}/stock-price/query`,
  CUSTOM_CALCULATIONS_EXECUTE: `${API_BASE}/custom-calculations/execute`,
  CUSTOM_CALCULATIONS_SCRIPTS: `${API_BASE}/custom-calculations/scripts`,
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

