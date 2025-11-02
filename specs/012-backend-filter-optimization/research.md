# Research: Backend Market Filter and Loading UX

**Feature**: 012-backend-filter-optimization  
**Date**: 2025-01-27  
**Purpose**: Research backend filtering, long-running request handling, and loading UX patterns

---

## Decision 1: Market Filtering Strategy

**Decision**: Move market filtering from client-side to server-side by sending `market_code` parameter to backend API.

**Rationale**:
- **Data Completeness**: Client-side filtering with limit=200 causes incomplete data - switching markets shows empty results when limited data doesn't contain target market instruments
- **Performance**: Backend can efficiently filter at database level before applying expensive script calculations
- **Correctness**: Server-side filtering ensures users always see complete, accurate data for selected market
- **Scalability**: As data grows, server-side filtering becomes essential

**Alternatives Considered**:
1. **Increase client limit to 5000**: Would help but doesn't solve root problem; still risks incomplete data and increases memory usage
2. **Pagination with client-side filter**: Complex, requires multiple requests, poor UX
3. **Keep client-side filtering**: Status quo - rejected due to data completeness issues

**Implementation**:
- Remove client-side market filtering logic in `DashboardPage.jsx`
- Pass `selectedMarkets` to `StockTable` component
- `StockTable` sends `market_code` parameter to `fetchStockList`
- Backend filters data before returning results

---

## Decision 2: Request Timeout Configuration

**Decision**: Configure HTTP client timeout to 10 minutes (600,000ms) to support long-running queries with script calculations.

**Rationale**:
- **Backend Support**: Backend already supports 10-minute timeout for script execution
- **Real-World Scenarios**: Queries with multiple scripts and large datasets can legitimately take 5-8 minutes
- **User Experience**: Better to wait for correct data than to timeout prematurely and show error
- **Progressive Feedback**: Combined with loading animation, users understand system is working

**Alternatives Considered**:
1. **Keep default timeout (30s)**: Would cause premature failures on legitimate queries - rejected
2. **Implement pagination**: Adds complexity and doesn't help with script calculation time - deferred
3. **Background processing**: Would require backend job queue - too complex for current need

**Implementation**:
- No native timeout in browser `fetch()` - relies on browser defaults (~300s)
- For production, consider adding `AbortController` with 10-minute timeout
- Display persistent loading state to provide feedback during long waits

**Technical Note**:
```javascript
// Browser fetch has no built-in timeout, but can be added via AbortController
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minutes
fetch(url, { signal: controller.signal })
  .then(response => {
    clearTimeout(timeoutId);
    return response;
  });
```

---

## Decision 3: Loading UX Pattern

**Decision**: Use overlay loading spinner with persistent animation during API requests.

**Rationale**:
- **Visibility**: Overlay spinner clearly indicates system is working
- **Context Preservation**: Table remains visible beneath overlay, users maintain context
- **Progress Feedback**: Continuous animation reassures users during long waits
- **Interruption Handling**: Overlay prevents interaction during data load, avoiding race conditions

**Alternatives Considered**:
1. **Inline spinner**: Less visible, could be missed by users
2. **Progress bar with percentage**: Cannot accurately estimate progress for database queries
3. **Skeleton UI**: Good for initial load, but confusing during filter changes
4. **Toast notification**: Easy to dismiss or miss

**Implementation**:
- Add `loading` state to `StockTable` component (already exists)
- Display overlay with spinner when `loading === true`
- Show loading for entire request duration
- Hide overlay immediately when data arrives

**UX Considerations**:
- Add "Loading..." text below spinner for clarity
- Consider timeout message after 5 minutes: "This is taking longer than usual, please wait..."
- Ensure animation doesn't freeze or stutter during long waits

---

## Decision 4: Remove Limit Parameter

**Decision**: Remove `limit: 200` from API requests to allow backend to return complete datasets.

**Rationale**:
- **Data Completeness**: Artificial limits truncate results, users miss data
- **Backend Capability**: Backend can handle large result sets
- **Filter Accuracy**: With server-side filtering, result sets are typically smaller and more relevant
- **User Expectations**: Users expect to see all matching data, not arbitrary subset

**Alternatives Considered**:
1. **Implement pagination**: Adds UI complexity and multiple API calls - deferred for future enhancement
2. **Increase limit to 5000**: Still arbitrary, doesn't solve fundamental issue
3. **Virtual scrolling**: UI optimization that can be added later if needed

**Implementation**:
- Remove `limit` parameter from `options` object in `StockTable.loadStocks()`
- Remove any offset-based pagination logic
- Test with large datasets (1000+ records) to ensure table rendering performance

**Performance Considerations**:
- Monitor table rendering performance with 1000+ rows
- React virtualization (e.g., `react-window`) can be added if performance degrades
- Current implementation should handle 1000-2000 rows without issues

---

## Decision 5: Market Filter Interaction

**Decision**: Market filter now triggers immediate API request instead of client-side filtering.

**Rationale**:
- **Consistency**: All filters (market, ETF, search) should behave consistently
- **Data Accuracy**: Backend filtering ensures correct results
- **Performance**: Single request with all filters is more efficient than client-side processing

**Implementation**:
- Remove market filtering logic from `DashboardPage.jsx` `useEffect`
- Pass `selectedMarkets` as prop to `StockTable`
- `StockTable` includes `selectedMarkets` in `useEffect` dependencies
- Trigger `loadStocks()` when `selectedMarkets` changes
- Send `market_code` parameter to backend (comma-separated for multiple markets)

**Edge Cases**:
- **Multiple markets selected**: Send comma-separated codes (e.g., `market_code=SH,SZ`)
- **No markets selected**: Omit `market_code` parameter (show all markets)
- **All markets selected**: Omit `market_code` parameter

---

## Technical Considerations

### Browser Fetch Timeout
- Browser `fetch()` has no built-in timeout mechanism
- Browser default timeout varies (Chrome: ~300s, Firefox: ~300s)
- For explicit control, use `AbortController` pattern
- Current implementation relies on browser defaults, which are sufficient for 10-minute queries

### React Re-rendering Performance
- Rendering 1000+ rows in table can be CPU-intensive
- Current implementation uses simple array mapping - adequate for <2000 rows
- If performance issues arise, consider:
  - React virtualization (`react-window` or `react-virtualized`)
  - Pagination (backend or frontend)
  - Progressive rendering

### Error Handling
- Network failures should show clear error message
- Timeout errors should provide guidance (e.g., "Query timed out, try filtering by market")
- Backend errors should display user-friendly messages

---

## Integration Points

### Modified Components
1. **StockTable.jsx**:
   - Add `selectedMarkets` prop
   - Add to `useEffect` dependencies
   - Remove `limit` from API options
   - Send `market_code` parameter

2. **DashboardPage.jsx**:
   - Remove client-side market filtering
   - Pass `selectedMarkets` to StockTable

3. **stockService.js**:
   - Already supports `market_code` parameter
   - No changes needed

### Unchanged Components
- **MarketFilter.jsx**: No changes (UI remains same)
- **ETFFilter.jsx**: No changes
- **SearchBar.jsx**: Search remains client-side (fast filter on already-loaded data)

---

## Testing Strategy

### Functional Testing
1. Select single market → verify correct data
2. Select multiple markets → verify combined data
3. Deselect all markets → verify all data shown
4. Combine market + ETF filter → verify both work
5. Combine market + search → verify both work

### Performance Testing
1. Load 1000+ records → measure rendering time
2. Long query (5 minutes) → verify loading animation persists
3. Quick query (<1s) → verify loading animation appears/disappears smoothly

### Edge Case Testing
1. Network timeout → verify error handling
2. Backend error → verify error message
3. Empty result set → verify appropriate message
4. Rapid filter changes → verify latest request wins

---

## Summary

This feature improves data accuracy and user experience by:
1. Moving market filtering to backend for complete, accurate data
2. Removing artificial result limits
3. Adding persistent loading animation for long queries
4. Supporting 10-minute query timeouts

All decisions are based on real user issues (incomplete data, long waits without feedback) and backend capabilities (10-minute timeout support).

