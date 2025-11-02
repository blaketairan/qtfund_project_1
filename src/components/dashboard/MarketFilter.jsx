import React, { useState, useRef, useEffect } from 'react';

const MarketFilter = ({ selectedMarkets, onMarketChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const markets = [
    { code: 'SH', label: 'Shanghai', name: '上海' },
    { code: 'SZ', label: 'Shenzhen', name: '深圳' },
    { code: 'BJ', label: 'Beijing', name: '北京' },
  ];

  const allMarketCodes = markets.map(m => m.code);
  const isAllSelected = selectedMarkets.length === markets.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (marketCode) => {
    const newMarkets = selectedMarkets.includes(marketCode)
      ? selectedMarkets.filter(m => m !== marketCode)
      : [...selectedMarkets, marketCode];
    onMarketChange(newMarkets);
  };

  const handleSelectAll = () => {
    onMarketChange(allMarketCodes);
  };

  const handleClearAll = () => {
    onMarketChange([]);
  };

  const getDisplayText = () => {
    if (selectedMarkets.length === 0) {
      return '选择市场';
    }
    if (isAllSelected) {
      return '全部市场';
    }
    return selectedMarkets
      .map(code => markets.find(m => m.code === code)?.name || code)
      .join(', ');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Market:</span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-64 bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <span className="block truncate">{getDisplayText()}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-64 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          <div className="px-3 py-2 border-b border-gray-200">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                全选
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-gray-600 hover:text-gray-800 font-medium"
              >
                清空
              </button>
            </div>
          </div>
          {markets.map((market) => (
            <div
              key={market.code}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
              onClick={() => handleToggle(market.code)}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedMarkets.includes(market.code)}
                  onChange={() => {}}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3 block font-normal">
                  {market.label} ({market.name})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketFilter;

