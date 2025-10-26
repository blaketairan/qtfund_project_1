import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext.jsx';
import { fetchStockList } from '../../services/stockService.js';
import { formatCurrency, formatPercentage, formatVolume } from '../../utils/numberFormat.js';

const StockTable = ({ visibleColumns, selectedScriptIds = [], scriptLibrary = [] }) => {
  const { state, dispatch } = useDashboard();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    loadStocks();
  }, [selectedScriptIds]);

  const loadStocks = async () => {
    setLoading(true);
    setError(null);
    try {
      const options = { limit: 200 };
      if (selectedScriptIds && selectedScriptIds.length > 0) {
        options.script_ids = selectedScriptIds;
      }
      const response = await fetchStockList(options);
      if (response.code === 200 && response.data) {
        const items = Array.isArray(response.data) 
          ? response.data 
          : response.data.items;
        
        if (items && items.length > 0) {
          dispatch({ type: 'SET_STOCKS', payload: items });
          dispatch({ type: 'SET_FILTERED_STOCKS', payload: items });
        } else {
          setError('No stock data available');
        }
      } else {
        setError('Failed to load stock data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedStocks = [...state.filteredStocks].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  if (loading) {
    return <div className="p-8 text-center">Loading stock data...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  const columns = [
    { key: 'symbol', label: '代码' },
    { key: 'stock_name', label: '名称' },
    { key: 'close_price', label: '价格' },
    { key: 'price_change_pct', label: '涨跌幅%' },
    { key: 'volume', label: '成交量' },
    { key: 'market_code', label: '市场' },
  ];

  const getScriptColumns = () => {
    if (!selectedScriptIds || selectedScriptIds.length === 0) return [];
    
    console.log('getScriptColumns - selectedScriptIds:', selectedScriptIds);
    console.log('getScriptColumns - scriptLibrary:', scriptLibrary);
    
    return selectedScriptIds.map(scriptId => {
      const script = scriptLibrary.find(s => s.id == scriptId);
      console.log(`Looking up script ${scriptId}, found:`, script);
      
      const columnName = script?.name || script?.description || `Script ${scriptId}`;
      console.log(`Column name for ${scriptId}:`, columnName);
      
      return {
        scriptId,
        columnName
      };
    });
  };

  const scriptColumns = getScriptColumns();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(col => (
              visibleColumns.includes(col.key) && (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {sortColumn === col.key && (
                    <span className="ml-2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              )
            ))}
            {scriptColumns.map(col => (
              <th
                key={col.scriptId}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.columnName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedStocks.map((stock, index) => (
            <tr key={stock.symbol || index} className="hover:bg-gray-50">
              {visibleColumns.includes('symbol') && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {stock.symbol}
                </td>
              )}
              {visibleColumns.includes('stock_name') && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stock.stock_name}
                </td>
              )}
              {visibleColumns.includes('close_price') && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(stock.close_price)}
                </td>
              )}
              {visibleColumns.includes('price_change_pct') && (
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  stock.price_change_pct >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPercentage(stock.price_change_pct)}
                </td>
              )}
              {visibleColumns.includes('volume') && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatVolume(stock.volume)}
                </td>
              )}
              {visibleColumns.includes('market_code') && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stock.market_code}
                </td>
              )}
              {scriptColumns.map(col => {
                const scriptResult = stock.script_results?.[col.scriptId];
                const displayValue = typeof scriptResult === 'object' 
                  ? (scriptResult?.result ?? (scriptResult?.error ? '--' : '--'))
                  : (scriptResult ?? '--');
                return (
                  <td key={col.scriptId} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {typeof displayValue === 'number' ? displayValue.toFixed(4) : displayValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {sortedStocks.length === 0 && (
        <div className="text-center p-8 text-gray-500">No stocks to display</div>
      )}
    </div>
  );
};

export default StockTable;

