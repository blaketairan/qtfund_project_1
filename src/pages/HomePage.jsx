import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants.js';
import NavigationBar from '../components/layout/NavigationBar.jsx';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to QTFund</h1>
        <p className="text-lg text-gray-600 mb-8">
          A secure financial management system
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-base"
          >
            Login
          </button>
          <button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-base"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

