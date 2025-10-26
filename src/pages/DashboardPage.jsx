import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES } from '../utils/constants.js';

const DashboardPage = () => {
  const [userInfo, setUserInfo] = useState('Loading...');
  const [apiResult, setApiResult] = useState('');
  const { logout, checkAuthStatus, testApiCall } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    setUserInfo('Checking...');
    const response = await checkAuthStatus();
    if (response) {
      setUserInfo('<span style="color: green;">Authenticated</span>');
    } else {
      setUserInfo('<span style="color: red;">Not authenticated</span>');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleTestApi = async () => {
    setApiResult('Testing...');
    try {
      const response = await testApiCall();
      setApiResult('<span style="color: green;">API call successful!</span>');
    } catch (error) {
      setApiResult(`<span style="color: red;">API call failed: ${error.message}</span>`);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '10px', borderBottom: '1px solid #ddd' }}>
        <h1 style={{ color: '#333', margin: '0' }}>QTFund Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3 style={{ marginTop: '0', color: '#333' }}>Welcome to QTFund!</h3>
        <p>You have successfully logged in. This is a protected page that requires authentication.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: 'white', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h4 style={{ marginTop: '0', color: '#333' }}>Test API Call</h4>
          <button
            onClick={handleTestApi}
            style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
          >
            Test Protected API
          </button>
          <div id="apiResult" style={{ marginTop: '10px', fontSize: '14px' }} dangerouslySetInnerHTML={{ __html: apiResult }} />
        </div>
        <div style={{ background: 'white', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h4 style={{ marginTop: '0', color: '#333' }}>User Info</h4>
          <p>Username: <span id="userInfo" dangerouslySetInnerHTML={{ __html: userInfo }} /></p>
          <button
            onClick={loadUserInfo}
            style={{ padding: '8px 16px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
          >
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

