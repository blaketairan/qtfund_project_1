# Quick Start: ETF Support in Frontend Dashboard

**Feature**: 011-etf-support  
**Branch**: `011-etf-support`  
**Date**: 2025-01-27

## Overview

Add ETF filtering to the stock dashboard allowing users to filter instruments by type (ETFs, Stocks, or All). The filter integrates with existing market and search filters, and displays visual indicators for ETF rows.

## What's New

### User Features

1. **ETF Filter Control**: New filter allows selection of ETFs only, Stocks only, or All instruments
2. **Visual Indicators**: ETF rows display an "ETF" badge or label in the table
3. **Combined Filtering**: ETF filter works together with market (SH/SZ/BJ) and search filters

## Implementation Steps

### Step 1: Create ETFFilter Component

**File**: `src/components/dashboard/ETFFilter.jsx`

**Component structure**:
```javascript
const ETFFilter = ({ selectedType, onTypeChange }) => {
  const options = [
    { value: 'all', label: '全部' },
    { value: 'etf', label: 'ETF' },
    { value: 'stock', label: '股票' }
  ];
  
  return (
    <div>
      {/* Radio buttons or checkbox group */}
    </div>
  );
};
```

### Step 2: Add ETF Filter State to DashboardPage

**File**: `src/pages/DashboardPage.jsx`

**Add**:
```javascript
const [selectedETFType, setSelectedETFType] = useState('all');
```

**Render**:
```javascript
<ETFFilter 
  selectedType={selectedETFType}
  onTypeChange={setSelectedETFType}
/>
```

### Step 3: Update StockService

**File**: `src/services/stockService.js`

**Modify fetchStockList**:
```javascript
export const fetchStockList = async (options = {}) => {
  const params = new URLSearchParams();
  if (options.is_etf !== undefined) params.append('is_etf', options.is_etf);
  // ... rest of existing parameters
};
```

**Map filter type to parameter**:
```javascript
// In DashboardPage or StockTable
const apiOptions = { limit: 200 };
if (selectedETFType === 'etf') {
  apiOptions.is_etf = true;
} else if (selectedETFType === 'stock') {
  apiOptions.is_etf = false;
}
// Omit parameter for 'all'
```

### Step 4: Update StockTable

**File**: `src/components/dashboard/StockTable.jsx`

**Add ETF parameter to query**:
```javascript
const loadStocks = async () => {
  const options = { limit: 200 };
  if (selectedETFType === 'etf') {
    options.is_etf = true;
  } else if (selectedETFType === 'stock') {
    options.is_etf = false;
  }
  await fetchStockList(options);
};
```

**Add ETF visual indicator**:
```javascript
{/* In table row */}
{stock.is_etf && (
  <span className="badge bg-blue-100 text-blue-800">ETF</span>
)}
```

## API Integration

### Request Format

**ETFs Only**:
```
GET /api/stock-price/list?is_etf=true&limit=200
```

**Stocks Only**:
```
GET /api/stock-price/list?is_etf=false&limit=200
```

**All Instruments**:
```
GET /api/stock-price/list?limit=200
```

### Response Format

Backend returns instruments with `is_etf` field:
```json
{
  "code": 200,
  "data": [
    {
      "symbol": "SH.512880",
      "stock_name": "证券ETF",
      "is_etf": true,
      "close_price": 1.234,
      ...
    }
  ]
}
```

## Testing Checklist

### ETF Filter Functionality

- [ ] Users can select "ETF" filter and see only ETFs in table
- [ ] Users can select "股票" filter and see only stocks (no ETFs)
- [ ] Users can select "全部" filter and see all instruments
- [ ] Filter selection persists appropriately (or resets on page refresh)
- [ ] Table refreshes when filter changes

### Combined Filters

- [ ] ETF filter + Market filter work together (e.g., Shanghai ETFs only)
- [ ] ETF filter + Search filter work together
- [ ] All three filters (ETF + Market + Search) work together correctly

### Visual Indicators

- [ ] ETF rows display "ETF" badge or label
- [ ] Badge is visible and distinct from stock rows
- [ ] Badge doesn't break table layout
- [ ] Non-ETF rows don't show ETF badge

### Existing Features

- [ ] Sorting works with filtered results
- [ ] Column settings work with ETF filter
- [ ] Custom script columns work with ETF data
- [ ] Script selection and execution work for ETFs

## Expected Behavior

### Filter Selection: ETFs Only

1. User selects "ETF" option
2. DashboardPage updates state to "etf"
3. API request includes `is_etf=true`
4. Backend returns only ETF instruments
5. Table displays ETFs with "ETF" badges

### Filter Selection: Stocks Only

1. User selects "股票" option
2. API request includes `is_etf=false`
3. Backend returns only stock instruments
4. Table displays stocks without ETF badges

### Filter Selection: All

1. User selects "全部" option
2. API request omits `is_etf` parameter
3. Backend returns both stocks and ETFs
4. Table displays all instruments with ETF badges for ETFs

## Files to Create/Modify

**New Files**:
- `src/components/dashboard/ETFFilter.jsx`

**Modified Files**:
- `src/pages/DashboardPage.jsx` - Add filter state and ETFFilter component
- `src/services/stockService.js` - Add is_etf parameter support
- `src/components/dashboard/StockTable.jsx` - Add ETF parameter and badges

## Related Files

- **Spec**: [spec.md](./spec.md)
- **Plan**: [plan.md](./plan.md)
- **Research**: [research.md](./research.md)
- **Data Model**: [data-model.md](./data-model.md)
- **Contracts**: [contracts/etf-filter-contracts.json](./contracts/etf-filter-contracts.json)

