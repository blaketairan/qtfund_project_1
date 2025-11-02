# Implementation Plan: Backend Market Filter and Loading UX

**Feature**: 012-backend-filter-optimization  
**Date**: 2025-01-27  
**Status**: Planning

---

## Technical Context

### Technology Stack
- **Frontend Framework**: React 18.x with JSX
- **HTTP Client**: Browser native `fetch()` API
- **State Management**: React Context (`DashboardContext`)
- **UI Components**: Tailwind CSS for styling
- **Icons**: lucide-react (optional for loading spinner)

### Dependencies
- Existing `stockService.js` already supports `market_code` parameter
- `StockTable` component already has `loading` state management
- `MarketFilter` component already manages `selectedMarkets` state
- Backend API `/api/stock-price/list` supports server-side filtering

### Integration Points
- **StockTable.jsx**: Main component requiring changes
- **DashboardPage.jsx**: State management and prop passing
- **stockService.js**: HTTP timeout configuration (optional)

---

## Constitution Check

### Compliance Review

✅ **File Structure**: Changes affect existing files in proper structure
- `src/components/dashboard/StockTable.jsx` (component)
- `src/pages/DashboardPage.jsx` (page)
- `src/services/stockService.js` (service)

✅ **Code Clarity**: All changes focus on clear state management and API integration

✅ **Technology Stack**: Uses only existing dependencies (React, Tailwind CSS)

✅ **API Contract Validation**: Code will handle response format variations

✅ **Git Workflow**: Changes committed to main branch (no feature branches)

**Verdict**: ✅ NO VIOLATIONS - Proceed with implementation

---

## Architecture

### Current Flow (To Be Changed)
```
User selects market filter
  ↓
DashboardPage updates selectedMarkets state
  ↓
DashboardPage useEffect filters stocks client-side
  ↓
DashboardPage dispatches filtered stocks to context
  ↓
StockTable renders from context
```

### New Flow (Target)
```
User selects market filter
  ↓
DashboardPage updates selectedMarkets state
  ↓
DashboardPage passes selectedMarkets to StockTable
  ↓
StockTable useEffect triggers loadStocks()
  ↓
StockTable shows loading overlay
  ↓
API request with market_code parameter
  ↓
Backend filters and returns data
  ↓
StockTable hides loading overlay and renders data
```

---

## Implementation Strategy

### Phase 1: Backend Market Filtering

**Goal**: Move market filtering from client to server

**Changes**:
1. **DashboardPage.jsx**:
   - Remove client-side market filtering logic from `useEffect`
   - Pass `selectedMarkets` prop to `StockTable`

2. **StockTable.jsx**:
   - Add `selectedMarkets` to component props
   - Add `selectedMarkets` to `useEffect` dependencies
   - Build `market_code` parameter from `selectedMarkets` array
   - Send `market_code` to `fetchStockList`

**Logic**:
```javascript
// In StockTable.jsx
const loadStocks = async () => {
  setLoading(true);
  setError(null);
  try {
    const options = {}; // Remove limit
    
    // Add market_code if markets selected
    if (selectedMarkets && selectedMarkets.length > 0) {
      options.market_code = selectedMarkets.join(',');
    }
    
    // Add other filters...
    if (selectedScriptIds && selectedScriptIds.length > 0) {
      options.script_ids = selectedScriptIds;
    }
    if (selectedETFType === 'etf') {
      options.is_etf = true;
    } else if (selectedETFType === 'stock') {
      options.is_etf = false;
    }
    
    const response = await fetchStockList(options);
    // ... handle response
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Phase 2: Remove Limit Parameter

**Goal**: Allow backend to return complete datasets

**Changes**:
1. **StockTable.jsx**:
   - Remove `limit: 200` from options object
   - Remove any offset-based pagination logic

**Impact**:
- Backend returns all matching data
- Table may need to render 1000+ rows
- Monitor performance and add virtualization if needed

### Phase 3: Enhanced Loading UX

**Goal**: Provide clear feedback during long queries

**Changes**:
1. **StockTable.jsx**:
   - Enhance loading state display
   - Add overlay spinner with message
   - Ensure animation persists for entire request duration

**UI Implementation**:
```jsx
{loading && (
  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">Loading stock data...</p>
    </div>
  </div>
)}
```

### Phase 4: Extended Timeout (Optional)

**Goal**: Support 10-minute queries without premature timeout

**Changes**:
1. **stockService.js** (Optional):
   - Add `AbortController` with 10-minute timeout
   - Wrap fetch calls with timeout logic

**Implementation** (if needed):
```javascript
export const fetchStockList = async (options = {}) => {
  const params = new URLSearchParams();
  // ... build params
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minutes
  
  try {
    const response = await fetch(
      `${API_BASE}/stock-price/list?${params}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    const data = await response.json();
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out after 10 minutes');
    }
    throw err;
  }
};
```

**Note**: Browser default timeouts (~300s) may be sufficient. Implement explicit timeout only if premature timeouts occur.

---

## File Changes

### Modified Files

#### 1. `src/pages/DashboardPage.jsx`

**Changes**:
- Remove client-side market filtering `useEffect`
- Add `selectedMarkets` prop to `StockTable`

**Before**:
```javascript
useEffect(() => {
  const filtered = state.stocks.filter(stock => {
    const matchesSearch = !searchTerm || 
      stock.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.stock_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMarket = selectedMarkets.length === 0 || 
      selectedMarkets.includes(stock.market_code);
    return matchesSearch && matchesMarket;
  });
  dispatch({ type: 'SET_FILTERED_STOCKS', payload: filtered });
}, [searchTerm, selectedMarkets, state.stocks, dispatch]);
```

**After**:
```javascript
useEffect(() => {
  const filtered = state.stocks.filter(stock => {
    const matchesSearch = !searchTerm || 
      stock.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.stock_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch; // Market filtering removed
  });
  dispatch({ type: 'SET_FILTERED_STOCKS', payload: filtered });
}, [searchTerm, state.stocks, dispatch]); // selectedMarkets removed from dependencies
```

**StockTable prop**:
```javascript
<StockTable 
  visibleColumns={visibleColumns} 
  selectedScriptIds={selectedScriptIds}
  scriptLibrary={scriptLibrary}
  selectedETFType={selectedETFType}
  selectedMarkets={selectedMarkets} // NEW PROP
/>
```

#### 2. `src/components/dashboard/StockTable.jsx`

**Changes**:
- Add `selectedMarkets` to props
- Add to `useEffect` dependencies
- Remove `limit` from options
- Add `market_code` parameter
- Enhance loading UI

**Props**:
```javascript
const StockTable = ({ 
  visibleColumns, 
  selectedScriptIds = [], 
  scriptLibrary = [], 
  selectedETFType = 'all',
  selectedMarkets = [] // NEW PROP
}) => {
```

**useEffect**:
```javascript
useEffect(() => {
  loadStocks();
}, [selectedScriptIds, selectedETFType, selectedMarkets]); // Add selectedMarkets
```

**loadStocks function**:
```javascript
const loadStocks = async () => {
  setLoading(true);
  setError(null);
  try {
    const options = {}; // Remove limit: 200
    
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
    // ... handle response as before
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

**Loading UI**:
```javascript
return (
  <div className="relative overflow-x-auto">
    {loading && (
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

#### 3. `src/services/stockService.js` (Optional)

**Changes**: Add explicit 10-minute timeout if needed

**Implementation**: See Phase 4 above

**When to implement**: Only if premature timeouts occur during testing

---

## Data Model

### Market Filter Parameter

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `market_code` | String | No | Comma-separated market codes | "SH,SZ" |

**Values**:
- Single market: `"SH"`, `"SZ"`, `"BJ"`
- Multiple markets: `"SH,SZ"`, `"SH,BJ"`, `"SZ,BJ"`
- All markets: Omit parameter (empty)

### Loading State

| State | Type | Description |
|-------|------|-------------|
| `loading` | Boolean | True during API request |
| `error` | String/Null | Error message if request fails |

**State Flow**:
1. User changes filter → `loading = true`
2. API request in progress → `loading = true`
3. Response received → `loading = false`
4. Error occurs → `loading = false`, `error = message`

---

## Testing Strategy

### Unit Testing (Manual)

1. **Single Market Filter**:
   - Select "Shanghai" → Verify API called with `market_code=SH`
   - Verify only SH stocks displayed

2. **Multiple Market Filter**:
   - Select "Shanghai" + "Shenzhen" → Verify `market_code=SH,SZ`
   - Verify both markets displayed

3. **All Markets**:
   - Deselect all markets → Verify `market_code` omitted
   - Verify all stocks displayed

4. **Combined Filters**:
   - Select market + ETF filter → Verify both parameters sent
   - Select market + search → Verify backend filter + client search work

5. **Loading UX**:
   - Change filter → Verify loading overlay appears
   - Wait for response → Verify loading persists until data arrives
   - Data received → Verify loading disappears

6. **Large Datasets**:
   - Query returning 1000+ rows → Measure render time
   - Verify table displays all data correctly

### Edge Cases

1. **Rapid Filter Changes**:
   - Change filter multiple times quickly
   - Verify latest request wins (no race conditions)

2. **Network Errors**:
   - Simulate network failure
   - Verify error message displayed

3. **Empty Results**:
   - Filter to market with no data
   - Verify "No stocks to display" message

4. **Long Queries**:
   - Query with multiple scripts (5+ minutes)
   - Verify loading persists entire duration
   - Verify data displays correctly when complete

---

## Performance Considerations

### Table Rendering
- **Current**: Simple array mapping
- **Adequate for**: <2000 rows
- **If issues arise**: Add React virtualization (`react-window`)

### API Request
- **Timeout**: 10 minutes (browser default ~300s)
- **Explicit timeout**: Add if premature failures occur
- **Loading feedback**: Continuous animation reassures users

### Memory Usage
- **Previous**: Limited to 200 rows
- **New**: Potentially 1000-5000 rows
- **Impact**: Minimal - React handles efficiently
- **Monitoring**: Watch browser memory in DevTools

---

## Deployment Notes

### Breaking Changes
- None - all changes are enhancements

### Backward Compatibility
- Backend already supports `market_code` parameter
- Removing `limit` parameter is supported by backend
- All existing filters continue to work

### Rollback Plan
If issues arise:
1. Revert to client-side market filtering
2. Add back `limit: 200` parameter
3. Remove loading overlay enhancements

### Monitoring
- Monitor API response times
- Watch for timeout errors
- Check table rendering performance
- Verify user feedback on loading UX

---

## Success Criteria

- ✅ Market filter triggers backend API call
- ✅ All matching data returned (no limit truncation)
- ✅ Loading animation displays during queries
- ✅ Loading persists for long queries (5+ minutes)
- ✅ Table renders 1000+ rows without issues
- ✅ Combined filters (market + ETF + search) work correctly
- ✅ No performance degradation
- ✅ Clear error messages on failures

---

## Summary

This implementation moves market filtering to the backend, removes artificial limits, and enhances loading UX for long queries. All changes are backward-compatible and focused on improving data accuracy and user experience.

**Estimated Implementation Time**: 1-2 hours  
**Risk Level**: Low  
**Dependencies**: None  
**Testing Required**: Yes (remote testing per user's workflow)
