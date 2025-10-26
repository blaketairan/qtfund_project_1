# Quick Start: Dynamic Script Columns in List Query

**Feature**: 010-dynamic-column-scripts  
**Branch**: `010-dynamic-column-scripts`  
**Date**: 2025-01-27

## Overview

Redesign script workflow so calculations happen during stock list queries, not on script upload. Users save scripts, select which ones to display, and see calculated results only for stocks in the current query (respecting filters and limits).

## What Changed

### Current Behavior (To Be Fixed)

- User uploads script → Backend immediately calculates for ALL stocks
- Expensive, wasteful, doesn't respect query filters/limits
- Not aligned with user intent

### Target Behavior

- User saves script → No immediate calculation
- User selects scripts to display → Toggles script columns
- User queries stock list → Backend calculates ONLY for stocks in result
- Results include calculated columns for filtered/limited stock set

## Implementation Steps

### Step 1: Update Script Management

**File**: `src/components/dashboard/ScriptManager.jsx`

**Changes needed**:
1. Add checkbox for each saved script to toggle selection
2. Persist selected script IDs to localStorage
3. Show selection state visually (checked/unchecked)

**State to add**:
```javascript
const [selectedScriptIds, setSelectedScriptIds] = useState([]);
```

### Step 2: Update Stock Service

**File**: `src/services/stockService.js`

**Changes needed**:
1. Modify `fetchStockList` to accept `selectedScriptIds` parameter
2. Build query string with script IDs
3. Pass `script_ids` parameter to backend API

**Function signature update**:
```javascript
export const fetchStockList = async (options = {}) => {
  const params = new URLSearchParams();
  if (options.market_code) params.append('market_code', options.market_code);
  if (options.limit) params.append('limit', options.limit);
  if (options.offset) params.append('offset', options.offset);
  if (options.script_ids && options.script_ids.length > 0) {
    params.append('script_ids', options.script_ids.join(','));
  }
  // ... rest of function
};
```

### Step 3: Update StockTable Component

**File**: `src/components/dashboard/StockTable.jsx`

**Changes needed**:
1. Extract `script_results` from API response
2. Render dynamic script columns based on script_results
3. Display "--" for missing or error results

**Column rendering**:
```javascript
// Extract script columns from first stock's script_results
const scriptColumns = stocks[0]?.script_results ? 
  Object.keys(stocks[0].script_results) : [];

// Render script columns dynamically
{scriptColumns.map(scriptId => (
  <td key={scriptId}>
    {stock.script_results?.[scriptId]?.result || '--'}
  </td>
))}
```

### Step 4: Update DashboardPage Integration

**File**: `src/pages/DashboardPage.jsx`

**Changes needed**:
1. Load selected script IDs from localStorage
2. Pass selected script IDs to StockTable
3. Update loadStocks to include script IDs

## API Integration

### Request Format

```
GET /api/stock-price/list?limit=100&market_code=SH&script_ids=abc-123,def-456
```

### Response Format

```json
{
  "code": 200,
  "data": [
    {
      "symbol": "SH.600519",
      "stock_name": "贵州茅台",
      "close_price": 1623.45,
      "script_results": {
        "abc-123": {
          "result": 0.0012,
          "column_name": "Price/Volume Ratio",
          "error": false
        },
        "def-456": {
          "result": 1.84,
          "column_name": "Momentum",
          "error": false
        }
      }
    }
  ]
}
```

## Testing Checklist

### Script Management Tests

- [ ] Users can save scripts without triggering calculation
- [ ] Users can see all saved scripts in list
- [ ] Users can check/uncheck scripts to toggle selection
- [ ] Selected scripts persist across page refresh

### Script Column Display Tests

- [ ] Selected scripts appear as columns in table
- [ ] Script results display correctly for each stock
- [ ] Missing results show "--"
- [ ] Error results show "--"
- [ ] Multiple script columns display simultaneously

### Query Scope Tests

- [ ] Scripts calculate only for stocks in result (limit respected)
- [ ] Scripts calculate only for filtered stocks (market filter respected)
- [ ] Script calculations complete within 3 seconds
- [ ] Error for one stock doesn't break entire table

### Performance Tests

- [ ] Query with 1 script completes quickly
- [ ] Query with 5 scripts completes within 3 seconds
- [ ] Multiple queries don't slow down page
- [ ] No memory leaks with repeated queries

## Expected Results

### Before (Current)

1. Upload script → ALL stocks calculated (2000+ stocks)
2. Expensive, slow, wasteful
3. Ignores user's view filters

### After (Target)

1. Save script → No calculation
2. Select scripts → Just marks for display
3. Query list → ONLY visible stocks calculated (e.g., 100 stocks)
4. Efficient, fast, respects filters

## User Workflow

1. **Save Scripts**: Create and save scripts without execution
2. **Select Scripts**: Choose which scripts to display as columns
3. **Query Stocks**: Request stock list with filters
4. **See Results**: Calculated columns appear for stocks in result only

## Implementation Priority

**Phase 1** (US1): Script save without execution  
**Phase 2** (US2): Script selection UI  
**Phase 3** (US3): Dynamic column display in list query

## Related Files

- **Spec**: [spec.md](./spec.md)
- **Plan**: [plan.md](./plan.md)
- **Research**: [research.md](./research.md)
- **Data Model**: [data-model.md](./data-model.md)
- **Contracts**: [contracts/script-columns-api-contracts.json](./contracts/script-columns-api-contracts.json)

