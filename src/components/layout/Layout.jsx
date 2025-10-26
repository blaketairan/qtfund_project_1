import React from 'react';

const Layout = ({ title, children, showHeader = true }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {showHeader && (
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 m-0">{title || 'QTFund'}</h1>
        </div>
      )}
      {children}
    </div>
  );
};

export default Layout;

