import { apiClient } from './api.js';
import { API_ENDPOINTS } from '../utils/constants.js';

export const authService = {
  async login(username, password) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH_LOGIN, {
        username,
        password,
        use_cookie: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH_LOGOUT, {});
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },

  async checkStatus() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS);
      return response;
    } catch (error) {
      return null;
    }
  },

  async testApiCall() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

