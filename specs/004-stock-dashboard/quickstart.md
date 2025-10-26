# Stock Dashboard - Quickstart

**Feature**: 004-stock-dashboard  
**Date**: 2025-01-27

## Overview

Stock/ETF quantitative analysis dashboard with sortable tables, column customization, quantitative indicators, market filtering, and custom Python script execution.

## Prerequisites

- Backend service running on port 8000 (`qtfund_project_3`)
- Node.js and npm installed
- All dependencies installed (`npm install`)

## Setup

1. **Verify backend is running**:
   ```bash
   curl http://localhost:8000/api/health
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Start development server**:
   ```bash
   npm start
   ```

## Project Structure

```
src/
├── pages/
│   └── DashboardPage.jsx         # NEW
├── components/dashboard/
│   ├── StockTable.jsx             # NEW
│   ├── ColumnSettings.jsx         # NEW
│   ├── MarketFilter.jsx           # NEW
│   ├── SearchBar.jsx              # NEW
│   └── IndicatorDisplay.jsx       # NEW
├── services/
│   ├── stockService.js            # NEW
│   ├── calculationService.js      # NEW
│   └── scriptService.js           # NEW
├── context/
│   └── DashboardContext.jsx       # NEW
└── entities/
    └── stock.json                 # NEW
```

## Key Features

### 1. View Stock Table
- Loads stock data from backend API
- Sortable columns (click header)
- Smooth scrolling for 200+ stocks
- Real-time data updates every 30s

### 2. Customize Columns
- Toggle column visibility via settings panel
- Column preferences saved to localStorage
- Reset to default columns option

### 3. Market Filtering
- Filter by Shanghai (SH), Shenzhen (SZ), Beijing (BJ)
- Multi-select checkboxes
- Filter persists during session

### 4. Search Stocks
- Search by stock name or symbol
- Real-time filtering as you type
- Case-insensitive matching

### 5. Quantitative Indicators
- Momentum scores (26/29/31/34 days)
- Moving averages
- Calculated client-side from price data

### 6. Custom Python Scripts (Advanced)
- Open script editor
- Write Python code for custom calculations
- Backend executes in sandbox
- Results displayed in custom column

## Usage Examples

### Basic Dashboard
```
1. Navigate to /dashboard
2. View all stocks from three markets
3. Click column header to sort
4. Use search box to find "茅台"
```

### Custom Columns
```
1. Click column settings icon
2. Hide/unhide columns as needed
3. Settings saved automatically
4. Refresh page - settings persist
```

### Market Filtering
```
1. Select "Shanghai" checkbox
2. Table shows only SH stocks
3. Add "Shenzhen" for both markets
4. Remove checkboxes to show all
```

### Custom Python Script
```
1. Click "Add Custom Column"
2. Name: "My Indicator"
3. Script: return row.close_price / row.volume
4. Click "Execute"
5. New column appears with calculated values
```

## API Integration

Backend endpoints used:
- `GET /api/stock-price/list` - Fetch stock list
- `GET /api/stock-price/info/{symbol}` - Stock details
- `GET /api/stock-price/query?symbol=SH.600519` - Historical data
- `POST /api/custom-calculations/execute` - Execute Python scripts (NEW)

## Performance Targets

- Page load: <2 seconds
- Table render: <500ms for 200 stocks
- Column toggle: <200ms
- Sort: <100ms
- Search: <1 second
- API timeout: 5 seconds

## Troubleshooting

**Backend connection fails**:
- Verify backend running: `curl http://localhost:8000/api/health`
- Check port 8000 is not blocked
- Review backend logs for errors

**Table not rendering**:
- Check browser console for errors
- Verify API response format
- Inspect localStorage for corrupted column config

**Custom scripts fail**:
- Backend endpoint `/api/custom-calculations/execute` must be implemented
- Python syntax errors return 400 with details
- Check backend logs for sandbox errors

## Next Steps

After implementing frontend dashboard:
1. Implement backend Python script execution endpoint
2. Add comprehensive error handling
3. Implement polling for real-time updates
4. Test with all three markets (SH/SZ/BJ)

