import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { DashboardProvider } from './context/DashboardContext.jsx';
import { ROUTES } from './utils/constants.js';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DashboardProvider>
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </DashboardProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

