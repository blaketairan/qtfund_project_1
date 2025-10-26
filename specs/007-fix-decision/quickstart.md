# Quickstart: Frontend Fix for Stock Dashboard

**Feature**: 007-fix-decision  
**Created**: 2025-01-27

## Overview

This fix updates the Stock Dashboard component to correctly handle the actual backend API response format. The backend returns stock data as `response.data` (array), but the frontend was expecting `response.data.items`.

## Current Issue

**Problem**: Dashboard shows "Failed to load stock data" error despite backend returning data successfully.

**Root Cause**: API response format mismatch
- Backend returns: `{ code: 200, data: [...] }`
- Frontend expects: `{ code: 200, data: { items: [...] } }`

## Implementation Steps

### 1. Update StockTable.jsx

Open `src/components/dashboard/StockTable.jsx` and modify the `loadStocks` function:

**Find this code** (around line 20-27):
```javascript
const loadStocks = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetchStockList({ limit: 200 });
    if (response.code === 200 && response.data.items) {
      dispatch({ type: 'SET_STOCKS', payload: response.data.items });
      dispatch({ type: 'SET_FILTERED_STOCKS', payload: response.data.items });
    } else {
      setError('Failed to load stock data');
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

**Replace with**:
```javascript
const loadStocks = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetchStockList({ limit: 200 });
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
```

### 2. Build and Test

```bash
npm run build
npm start
```

### 3. Verify Fix

1. Navigate to `http://localhost:3000/dashboard`
2. Verify dashboard displays stock table with data
3. Check browser console - no errors should appear
4. Verify API call in Network tab shows successful response

## Verification Checklist

- [ ] Dashboard loads without "Failed to load stock data" error
- [ ] Stock table displays stock items
- [ ] No console errors in browser DevTools
- [ ] Network tab shows 200 response from API
- [ ] Stock data appears correctly formatted

## Testing Scenarios

### Scenario 1: Successful Data Load
1. Open dashboard page
2. **Expected**: Stock table appears with data
3. **Actual**: ✅ (should pass after fix)

### Scenario 2: Empty Response
1. Mock API to return empty array
2. **Expected**: "No stock data available" message
3. **Actual**: ✅ (should pass after fix)

### Scenario 3: Error Response
1. Mock API to return error
2. **Expected**: Appropriate error message displayed
3. **Actual**: ✅ (should pass after fix)

## Troubleshooting

### Issue: Dashboard still shows error

**Check**:
- Browser console for specific error messages
- Network tab to verify API call succeeds
- API response format in Network tab preview

**Solution**: Verify code changes saved and app rebuilt

### Issue: Stock table is empty but no error

**Check**:
- API response contains data
- response.code is 200
- items array is not empty

**Solution**: Check API endpoint is returning data correctly

## Expected Behavior After Fix

- Dashboard loads stock data successfully
- Stock table displays all stock items
- No "Failed to load stock data" error
- Data formatting works correctly (prices, percentages, etc.)
- Search and filter functionality works

## Rollback Plan

If fix causes issues, revert the change in StockTable.jsx:

```javascript
if (response.code === 200 && response.data.items) {
  dispatch({ type: 'SET_STOCKS', payload: response.data.items });
}
```

However, this will bring back the original error, so investigation should continue.

