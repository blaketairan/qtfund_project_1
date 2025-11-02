# Quickstart: Backend Market Filter and Loading UX

**Feature**: 012-backend-filter-optimization  
**Date**: 2025-01-27  
**Time to Complete**: 10 minutes

---

## Overview

This feature moves market filtering from client-side to server-side, removes result limits, and enhances loading UX for long queries. All changes improve data accuracy and user experience without backend modifications.

---

## Prerequisites

- Running frontend development server
- Backend API `/api/stock-price/list` accessible
- Backend supports `market_code` parameter (already implemented)

---

## Quick Implementation Guide

### Step 1: Update DashboardPage (5 minutes)

**File**: `src/pages/DashboardPage.jsx`

**Changes**:
1. Remove client-side market filtering from `useEffect`
2. Pass `selectedMarkets` to StockTable

```javascript
// BEFORE: Remove this logic
useEffect(() => {
  const filtered = state.stocks.filter(stock => {
    const matchesSearch = !searchTerm || 
      stock.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.stock_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMarket = selectedMarkets.length === 0 || 
      selectedMarkets.includes(stock.market_code);
    return matchesSearch && matchesMarket; // Remove matchesMarket
  });
  dispatch({ type: 'SET_FILTERED_STOCKS', payload: filtered });
}, [searchTerm, selectedMarkets, state.stocks, dispatch]);

// AFTER: Remove market filtering
useEffect(() => {
  const filtered = state.stocks.filter(stock => {
    const matchesSearch = !searchTerm || 
      stock.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.stock_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  dispatch({ type: 'SET_FILTERED_STOCKS', payload: filtered });
}, [searchTerm, state.stocks, dispatch]); // Remove selectedMarkets

// Add selectedMarkets prop to StockTable
<StockTable 
  visibleColumns={visibleColumns} 
  selectedScriptIds={selectedScriptIds}
  scriptLibrary={scriptLibrary}
  selectedETFType={selectedETFType}
  selectedMarkets={selectedMarkets} // ADD THIS
/>
```

### Step 2: Update StockTable (5 minutes)

**File**: `src/components/dashboard/StockTable.jsx`

**Changes**:
1. Add `selectedMarkets` prop
2. Add to `useEffect` dependencies
3. Remove `limit` parameter
4. Add `market_code` to API options
5. Enhance loading UI

```javascript
// 1. Add to props
const StockTable = ({ 
  visibleColumns, 
  selectedScriptIds = [], 
  scriptLibrary = [], 
  selectedETFType = 'all',
  selectedMarkets = [] // ADD THIS
}) => {

// 2. Update useEffect dependencies
useEffect(() => {
  loadStocks();
}, [selectedScriptIds, selectedETFType, selectedMarkets]); // ADD selectedMarkets

// 3. Update loadStocks function
const loadStocks = async () => {
  setLoading(true);
  setError(null);
  try {
    const options = {}; // REMOVE: limit: 200
    
    // ADD: market_code parameter
    if (selectedMarkets && selectedMarkets.length > 0) {
      options.market_code = selectedMarkets.join(',');
    }
    
    if (selectedScriptIds && selectedScriptIds.length > 0) {
      options.script_ids = selectedScriptIds;
    }
    if (selectedETFType === 'etf') {
      options.is_etf = true;
    } else if (selectedETFType === 'stock') {
      options.is_etf = false;
    }
    
    const response = await fetchStockList(options);
    // ... rest of existing logic
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

// 4. Enhance loading UI (wrap table in relative div)
return (
  <div className="relative overflow-x-auto"> {/* ADD relative wrapper */}
    {loading && ( {/* ADD loading overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading stock data...</p>
        </div>
      </div>
    )}
    <table className="min-w-full divide-y divide-gray-200">
      {/* ... existing table code ... */}
    </table>
  </div>
);
```

---

## Testing Checklist

### Basic Functionality
- [ ] Select single market (SH) → Only Shanghai stocks displayed
- [ ] Select multiple markets (SH + SZ) → Both markets displayed
- [ ] Deselect all markets → All stocks displayed
- [ ] Loading spinner appears when filter changes
- [ ] Loading spinner disappears when data loads

### Combined Filters
- [ ] Market + ETF filter → Both work together
- [ ] Market + search → Backend filter + client search work
- [ ] All three filters → ETF + Market + Search all work

### Large Datasets
- [ ] Query returns 500+ rows → All displayed correctly
- [ ] Query returns 1000+ rows → Table renders smoothly
- [ ] Scroll performance is acceptable

### Long Queries
- [ ] Query taking 30 seconds → Loading persists
- [ ] Query taking 2 minutes → Loading still showing
- [ ] Query completes after long wait → Data displays correctly

### Error Handling
- [ ] Network error → Clear error message shown
- [ ] Empty results → "No stocks to display" message
- [ ] Backend error → User-friendly error message

---

## Common Issues & Solutions

### Issue: Loading overlay doesn't appear
**Solution**: Ensure `<div className="relative">` wrapper is present around table

### Issue: Loading overlay appears but never disappears
**Solution**: Check for JavaScript errors in console, verify API is responding

### Issue: Table doesn't update when market filter changes
**Solution**: Verify `selectedMarkets` in `useEffect` dependencies array

### Issue: Getting empty results
**Solution**: Check API request in Network tab - ensure `market_code` parameter is correct

### Issue: Query times out
**Solution**: This is expected for very large datasets with many scripts. Loading animation should persist. If needed, add explicit timeout handling in stockService.js

---

## API Request Examples

### Before (Client-side Filtering)
```
GET /api/stock-price/list?limit=200
# Frontend filters by market locally
```

### After (Server-side Filtering)
```
# Single market
GET /api/stock-price/list?market_code=SH

# Multiple markets
GET /api/stock-price/list?market_code=SH,SZ

# All markets
GET /api/stock-price/list

# Combined filters
GET /api/stock-price/list?market_code=SH&is_etf=true&script_ids=1
```

---

## Validation Steps

1. **Open Browser DevTools → Network Tab**
2. **Change market filter**
3. **Verify API request**:
   - Contains `market_code` parameter (if markets selected)
   - Does NOT contain `limit` parameter
   - Returns complete dataset

4. **Check Console**:
   - No JavaScript errors
   - Loading state transitions correctly

5. **Test UX**:
   - Loading spinner appears immediately
   - Data displays when loaded
   - Error messages are clear

---

## Performance Notes

### Expected Response Times

| Scenario | Expected Time |
|----------|--------------|
| No scripts | < 1 second |
| 1-2 scripts | 5-15 seconds |
| 3+ scripts | 30-300 seconds |
| Large dataset + scripts | Up to 10 minutes |

### Browser Performance

| Rows | Rendering Time | Scrolling |
|------|----------------|-----------|
| < 500 | Instant | Smooth |
| 500-1000 | < 1 second | Smooth |
| 1000-2000 | 1-2 seconds | Acceptable |
| 2000+ | 2-5 seconds | May lag |

**Note**: If performance issues with 2000+ rows, consider adding React virtualization.

---

## Rollback Plan

If issues arise:

1. **Revert DashboardPage.jsx**:
   - Add back client-side market filtering
   - Remove `selectedMarkets` prop from StockTable

2. **Revert StockTable.jsx**:
   - Remove `selectedMarkets` from props
   - Add back `limit: 200`
   - Remove `market_code` from API options

3. **Deploy Revert**:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

---

## Success Metrics

After deployment, verify:

- ✅ No empty results when switching markets
- ✅ Users can see all data (no 200-row limit)
- ✅ Loading animation appears during filter changes
- ✅ Long queries (5+ minutes) complete successfully
- ✅ Table displays 1000+ rows without issues
- ✅ Combined filters work correctly
- ✅ No increase in error rates
- ✅ No performance degradation

---

## Next Steps After Implementation

1. **Monitor Logs**: Watch for timeout errors or slow queries
2. **User Feedback**: Ask users if loading UX is clear
3. **Performance**: Monitor table rendering with large datasets
4. **Optional Enhancements**:
   - Add React virtualization for 2000+ rows
   - Add pagination for very large datasets
   - Add progress indicator (e.g., "Loaded X rows...")
   - Add cancel button for long-running queries

---

## Support

If you encounter issues:

1. Check browser console for errors
2. Check Network tab for API requests/responses
3. Verify backend supports `market_code` parameter
4. Test with smaller datasets first
5. Verify loading state transitions correctly

**Estimated Time**: 10 minutes  
**Risk**: Low  
**Rollback**: Easy (simple revert)

