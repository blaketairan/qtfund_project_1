import React from 'react';

const Layout = ({ title, children, showHeader = true }) => {
  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      {showHeader && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          paddingBottom: '10px',
          borderBottom: '1px solid #ddd',
        }}>
          <h1 style={{ color: '#333', margin: '0' }}>{title || 'QTFund'}</h1>
        </div>
      )}
      {children}
    </div>
  );
};

export default Layout;

