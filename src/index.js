import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './utils/authContext';
import Layout from './Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import FundsPage from './pages/FundsPage';
import PortfoliosPage from './pages/PortfoliosPage';
import SettingsPage from './pages/SettingsPage';
import './styles/globals.css';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="funds"
              element={
                <ProtectedRoute>
                  <FundsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="portfolios"
              element={
                <ProtectedRoute>
                  <PortfoliosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);

console.log('QTFund Frontend initialized with React');
