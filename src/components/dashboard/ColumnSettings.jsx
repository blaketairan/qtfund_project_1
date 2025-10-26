import React, { useState, useEffect } from 'react';

const ColumnSettings = ({ visibleColumns, onColumnsChange }) => {
  const [columns, setColumns] = useState([
    { key: 'symbol', label: 'Symbol', visible: visibleColumns.includes('symbol') },
    { key: 'stock_name', label: 'Name', visible: visibleColumns.includes('stock_name') },
    { key: 'close_price', label: 'Price', visible: visibleColumns.includes('close_price') },
    { key: 'price_change_pct', label: 'Change %', visible: visibleColumns.includes('price_change_pct') },
    { key: 'volume', label: 'Volume', visible: visibleColumns.includes('volume') },
    { key: 'market_code', label: 'Market', visible: visibleColumns.includes('market_code') },
  ]);

  useEffect(() => {
    const savedColumns = localStorage.getItem('dashboard_column_config');
    if (savedColumns) {
      try {
        const config = JSON.parse(savedColumns);
        setColumns(config);
      } catch (err) {
        console.error('Failed to load column configuration:', err);
      }
    }
  }, []);

  const handleToggle = (key) => {
    const updatedColumns = columns.map(col =>
      col.key === key ? { ...col, visible: !col.visible } : col
    );
    setColumns(updatedColumns);
    const visibleCols = updatedColumns.filter(col => col.visible).map(col => col.key);
    onColumnsChange(visibleCols);
    localStorage.setItem('dashboard_column_config', JSON.stringify(updatedColumns));
  };

  const handleReset = () => {
    const defaultColumns = columns.map(col => ({ ...col, visible: true }));
    setColumns(defaultColumns);
    const visibleCols = defaultColumns.filter(col => col.visible).map(col => col.key);
    onColumnsChange(visibleCols);
    localStorage.setItem('dashboard_column_config', JSON.stringify(defaultColumns));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Column Settings</h3>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Reset to Default
        </button>
      </div>
      <div className="space-y-2">
        {columns.map(column => (
          <label key={column.key} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={column.visible}
              onChange={() => handleToggle(column.key)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{column.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ColumnSettings;

