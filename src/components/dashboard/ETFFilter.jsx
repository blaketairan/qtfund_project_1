import React from 'react';

const ETFFilter = ({ selectedType, onTypeChange }) => {
  const options = [
    { value: 'all', label: '全部' },
    { value: 'etf', label: 'ETF' },
    { value: 'stock', label: '股票' }
  ];

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium text-gray-700">Type:</span>
      <div className="flex space-x-4">
        {options.map(option => (
          <label
            key={option.value}
            className="flex items-center cursor-pointer"
          >
            <input
              type="radio"
              name="etf-filter"
              value={option.value}
              checked={selectedType === option.value}
              onChange={() => onTypeChange(option.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ETFFilter;

