# Implementation Tasks: Frontend Fix for Stock Dashboard API Response

**Feature**: 007-fix-decision  
**Created**: 2025-01-27  
**Total Tasks**: 3

## Summary

This fix updates the Stock Dashboard to handle the actual backend API response format (`response.data` as array) instead of the documented structure (`response.data.items`).

**Scope**: 1 component file modification

## Dependencies & Story Order

All tasks support **User Story 1** (Resolve Data Loading Issue).

**Story dependencies**: None - single user story, sequentially implemented.

## Parallel Execution Opportunities

None - all tasks must execute sequentially for this fix.

## MVP Scope

**MVP = Phase 1** (US1 - Fix Response Handling)

This is a complete fix delivering immediate production issue resolution.

## Implementation Strategy

1. **Phase 1**: Update response handling in StockTable.jsx
2. **Phase 2**: Test and validate fix
3. **Phase 3**: Deploy to production

---

## Phase 1: User Story 1 - Resolve Data Loading Issue

**Goal**: Dashboard successfully displays stock data by aligning response format expectations with actual backend implementation.

**Priority**: P1

**Why this priority**: This fixes the immediate production bug preventing users from viewing stock data.

**Independent Test**: Dashboard page loads and displays stock list without "Failed to load stock data" error.

**Acceptance Criteria**:
- Dashboard displays stock data without errors
- Zero "Failed to load stock data" errors in production
- All API calls successfully parse responses
- Response format handling is documented in code

---

### Implementation Tasks

- [ ] T001 [US1] Update StockTable.jsx loadStocks function to handle response.data as array in src/components/dashboard/StockTable.jsx
- [ ] T002 [US1] Add compatibility check for both data array and data.items in src/components/dashboard/StockTable.jsx
- [ ] T003 [US1] Build application and verify dashboard displays stock data correctly

---

## Task Summary

| Phase | Task ID | Description | Files |
|-------|---------|-------------|-------|
| US1 | T001 | Update loadStocks function response handling | src/components/dashboard/StockTable.jsx |
| US1 | T002 | Add compatibility check for array formats | src/components/dashboard/StockTable.jsx |
| US1 | T003 | Build and verify fix | - |

**Total**: 3 tasks

## Implementation Details

### T001: Update Response Handling

Modify the condition and data extraction logic:

```javascript
// Replace this:
if (response.code === 200 && response.data.items) {
  dispatch({ type: 'SET_STOCKS', payload: response.data.items });
  dispatch({ type: 'SET_FILTERED_STOCKS', payload: response.data.items });
} else {
  setError('Failed to load stock data');
}

// With this:
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
```

### T002: Add Compatibility

Ensure the code handles both formats:
- Current: `response.data` (array)
- Potential future: `response.data.items` (nested array)

### T003: Verification

Build and test:
```bash
npm run build
npm start
```

Visit `http://localhost:3000/dashboard` and verify stock data displays.

## Notes

- Single file change with low risk
- Backward compatible with potential future format changes
- Aligns with project constitution Principle VI
- Immediate fix for production issue
- No new dependencies required

