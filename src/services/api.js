const API_BASE_URL = '/api';

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error(data.error || data.message || 'API request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};

const apiRequest = async (endpoint, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return handleResponse(response);
};

export const authAPI = {
  login: (credentials) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...credentials, use_cookie: true }),
    }),
  
  logout: () => 
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
  
  checkAuth: () => 
    apiRequest('/auth/check'),
};

export const userAPI = {
  getUsers: () => 
    apiRequest('/users'),
  
  getUser: (id) => 
    apiRequest(`/users/${id}`),
  
  createUser: (userData) => 
    apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  updateUser: (id, userData) => 
    apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  
  deleteUser: (id) => 
    apiRequest(`/users/${id}`, {
      method: 'DELETE',
    }),
};

export const fundAPI = {
  getFunds: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/funds${queryString ? `?${queryString}` : ''}`);
  },
  
  getFund: (id) => 
    apiRequest(`/funds/${id}`),
  
  createFund: (fundData) => 
    apiRequest('/funds', {
      method: 'POST',
      body: JSON.stringify(fundData),
    }),
  
  updateFund: (id, fundData) => 
    apiRequest(`/funds/${id}`, {
      method: 'PUT',
      body: JSON.stringify(fundData),
    }),
  
  deleteFund: (id) => 
    apiRequest(`/funds/${id}`, {
      method: 'DELETE',
    }),
  
  getFundHistory: (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/funds/${id}/history${queryString ? `?${queryString}` : ''}`);
  },
};

export const transactionAPI = {
  getTransactions: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/transactions${queryString ? `?${queryString}` : ''}`);
  },
  
  getTransaction: (id) => 
    apiRequest(`/transactions/${id}`),
  
  createTransaction: (transactionData) => 
    apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    }),
  
  cancelTransaction: (id) => 
    apiRequest(`/transactions/${id}/cancel`, {
      method: 'POST',
    }),
};

export const portfolioAPI = {
  getPortfolios: () => 
    apiRequest('/portfolios'),
  
  getPortfolio: (id) => 
    apiRequest(`/portfolios/${id}`),
  
  createPortfolio: (portfolioData) => 
    apiRequest('/portfolios', {
      method: 'POST',
      body: JSON.stringify(portfolioData),
    }),
  
  updatePortfolio: (id, portfolioData) => 
    apiRequest(`/portfolios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(portfolioData),
    }),
  
  deletePortfolio: (id) => 
    apiRequest(`/portfolios/${id}`, {
      method: 'DELETE',
    }),
  
  getPortfolioPerformance: (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/portfolios/${id}/performance${queryString ? `?${queryString}` : ''}`);
  },
};

export default {
  auth: authAPI,
  user: userAPI,
  fund: fundAPI,
  transaction: transactionAPI,
  portfolio: portfolioAPI,
};

