import React, { createContext, useContext, useReducer, useEffect } from 'react';

const DashboardContext = createContext();

const initialState = {
  stocks: [],
  filteredStocks: [],
  columnConfig: [],
  marketFilter: ['SH', 'SZ', 'BJ'],
  searchTerm: '',
  sortColumn: null,
  sortDirection: null,
  customScripts: [],
  loading: false,
  error: null,
};

const dashboardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STOCKS':
      return { ...state, stocks: action.payload };
    case 'SET_FILTERED_STOCKS':
      return { ...state, filteredStocks: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_MARKET_FILTER':
      return { ...state, marketFilter: action.payload };
    case 'SET_SORT':
      return { ...state, sortColumn: action.payload.column, sortDirection: action.payload.direction };
    case 'SET_COLUMN_CONFIG':
      return { ...state, columnConfig: action.payload };
    case 'SET_CUSTOM_SCRIPTS':
      return { ...state, customScripts: action.payload };
    default:
      return state;
  }
};

export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

