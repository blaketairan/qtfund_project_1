import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants.js';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center', padding: '20px' }}>
      <h1 style={{ color: '#333' }}>Welcome to QTFund</h1>
      <p style={{ fontSize: '18px', color: '#666', margin: '30px 0' }}>
        A secure financial management system
      </p>
      <div style={{ margin: '30px 0' }}>
        <button
          onClick={() => navigate(ROUTES.LOGIN)}
          style={{
            padding: '12px 24px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            margin: '0 10px',
          }}
        >
          Login
        </button>
        <button
          onClick={() => navigate(ROUTES.DASHBOARD)}
          style={{
            padding: '12px 24px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            margin: '0 10px',
          }}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};

export default HomePage;

