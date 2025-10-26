import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants.js';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a
        href={ROUTES.HOME}
        onClick={(e) => {
          e.preventDefault();
          navigate(ROUTES.HOME);
        }}
        style={{ color: '#007bff', textDecoration: 'none' }}
      >
        Go Home
      </a>
    </div>
  );
};

export default NotFoundPage;

