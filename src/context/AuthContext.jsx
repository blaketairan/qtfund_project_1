import React, { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../services/authService.js';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(username, password);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setIsAuthenticated(false);
      navigate(ROUTES.LOGIN);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await authService.checkStatus();
      setIsAuthenticated(response !== null);
      return response;
    } catch (err) {
      setIsAuthenticated(false);
      return null;
    }
  }, []);

  const testApiCall = useCallback(async () => {
    try {
      return await authService.testApiCall();
    } catch (err) {
      throw err;
    }
  }, []);

  const value = {
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    checkAuthStatus,
    testApiCall,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

