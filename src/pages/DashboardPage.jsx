import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext.jsx';
import StockTable from '../components/dashboard/StockTable.jsx';
import ColumnSettings from '../components/dashboard/ColumnSettings.jsx';
import SearchBar from '../components/dashboard/SearchBar.jsx';
import MarketFilter from '../components/dashboard/MarketFilter.jsx';

const DashboardPage = () => {
  const { state, dispatch } = useDashboard();
  const [visibleColumns, setVisibleColumns] = useState([
    'symbol',
    'stock_name',
    'close_price',
    'price_change_pct',
    'volume',
    'market_code',
  ]);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarkets, setSelectedMarkets] = useState(['SH', 'SZ', 'BJ']);

  useEffect(() => {
    const filtered = state.stocks.filter(stock => {
      const matchesSearch = !searchTerm || 
        stock.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.stock_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesMarket = selectedMarkets.includes(stock.market_code);
      
      return matchesSearch && matchesMarket;
    });
    
    dispatch({ type: 'SET_FILTERED_STOCKS', payload: filtered });
  }, [state.stocks, searchTerm, selectedMarkets, dispatch]);

  useEffect(() => {
    const savedColumns = localStorage.getItem('dashboard_column_config');
    if (savedColumns) {
      try {
        const config = JSON.parse(savedColumns);
        const visible = config.filter(col => col.visible).map(col => col.key);
        setVisibleColumns(visible);
      } catch (err) {
        console.error('Failed to load column configuration:', err);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Stock Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Real-time stock data and quantitative analysis</p>
              </div>
              <button
                onClick={() => setShowColumnSettings(!showColumnSettings)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Column Settings
              </button>
            </div>
            <div className="space-y-3">
              <SearchBar onSearchChange={setSearchTerm} />
              <MarketFilter 
                selectedMarkets={selectedMarkets} 
                onMarketChange={setSelectedMarkets} 
              />
            </div>
          </div>
          {showColumnSettings && (
            <div className="p-6 border-b border-gray-200">
              <ColumnSettings visibleColumns={visibleColumns} onColumnsChange={setVisibleColumns} />
            </div>
          )}
          <div className="p-6">
            <StockTable visibleColumns={visibleColumns} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
