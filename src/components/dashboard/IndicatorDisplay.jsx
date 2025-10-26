import React from 'react';
import { formatPercentage } from '../../utils/numberFormat.js';

const IndicatorDisplay = ({ stock, indicators }) => {
  const formatValue = (value) => {
    if (value === null || value === undefined) return '--';
    return formatPercentage(value);
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
      {indicators.momentum_26 && (
        <div className="bg-white px-4 py-2 rounded shadow-sm">
          <div className="text-xs text-gray-500">26-Day Momentum</div>
          <div className="text-sm font-semibold text-gray-900">
            {formatValue(indicators.momentum_26)}
          </div>
        </div>
      )}
      {indicators.momentum_29 && (
        <div className="bg-white px-4 py-2 rounded shadow-sm">
          <div className="text-xs text-gray-500">29-Day Momentum</div>
          <div className="text-sm font-semibold text-gray-900">
            {formatValue(indicators.momentum_29)}
          </div>
        </div>
      )}
      {indicators.momentum_31 && (
        <div className="bg-white px-4 py-2 rounded shadow-sm">
          <div className="text-xs text-gray-500">31-Day Momentum</div>
          <div className="text-sm font-semibold text-gray-900">
            {formatValue(indicators.momentum_31)}
          </div>
        </div>
      )}
      {indicators.momentum_34 && (
        <div className="bg-white px-4 py-2 rounded shadow-sm">
          <div className="text-xs text-gray-500">34-Day Momentum</div>
          <div className="text-sm font-semibold text-gray-900">
            {formatValue(indicators.momentum_34)}
          </div>
        </div>
      )}
      {indicators.ma_20 && (
        <div className="bg-white px-4 py-2 rounded shadow-sm">
          <div className="text-xs text-gray-500">MA-20</div>
          <div className="text-sm font-semibold text-gray-900">
            {formatValue(indicators.ma_20)}
          </div>
        </div>
      )}
      {indicators.ma_50 && (
        <div className="bg-white px-4 py-2 rounded shadow-sm">
          <div className="text-xs text-gray-500">MA-50</div>
          <div className="text-sm font-semibold text-gray-900">
            {formatValue(indicators.ma_50)}
          </div>
        </div>
      )}
    </div>
  );
};

export default IndicatorDisplay;

