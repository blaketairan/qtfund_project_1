import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const NavigationBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            QTFund
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              isActive('/') 
                ? 'text-blue-700 bg-blue-50 border-b-2 border-blue-700' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            首页
          </Link>
          <Link
            to="/dashboard"
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              isActive('/dashboard')
                ? 'text-blue-700 bg-blue-50 border-b-2 border-blue-700'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            仪表盘
          </Link>
        </div>

        <div className="flex items-center">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                <span>用户</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {userMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0" 
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                      用户名
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      退出
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              登录
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;

