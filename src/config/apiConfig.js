const isDev = process.env.NODE_ENV === 'development';

export const API_CONFIG = {
  environment: isDev ? 'development' : 'production',
  protocol: 'https',
  baseUrl: 'qtfund.com',
  apiPath: '/api',
};

export const getApiBaseUrl = () => {
  return `${API_CONFIG.protocol}://${API_CONFIG.baseUrl}${API_CONFIG.apiPath}`;
};

