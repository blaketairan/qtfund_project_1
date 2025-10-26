import React from 'react';

const MarketFilter = ({ selectedMarkets, onMarketChange }) => {
  const markets = [
    { code: 'SH', label: 'Shanghai', name: '上海' },
    { code: 'SZ', label: 'Shenzhen', name: '深圳' },
    { code: 'BJ', label: 'Beijing', name: '北京' },
  ];

  const handleToggle = (marketCode) => {
    const newMarkets = selectedMarkets.includes(marketCode)
      ? selectedMarkets.filter(m => m !== marketCode)
      : [...selectedMarkets, marketCode];
    onMarketChange(newMarkets);
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium text-gray-700">Market:</span>
      <div className="flex space-x-2">
        {markets.map(market => (
          <label
            key={market.code}
            className="flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedMarkets.includes(market.code)}
              onChange={() => handleToggle(market.code)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">{market.label} ({market.name})</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MarketFilter;

