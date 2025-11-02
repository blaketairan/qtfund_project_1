# Tasks: Backend Market Filter and Loading UX

**Feature**: 012-backend-filter-optimization  
**Date**: 2025-01-27  
**Status**: Ready for Implementation

## Overview

Move market filtering from client-side to server-side, remove result limits, enhance loading UX for long queries, and set default ETF filter. All changes improve data accuracy and user experience.

**Total Tasks**: 19  
**Completed**: 13 (68%)  
**MVP Scope**: User Stories 1, 2, and 4 (backend filtering + loading UX + remove limit)  
**Estimated Time**: 1-2 hours

## Dependency Graph

```
US1 - Backend Market Filter (Phase 1)
  ↓
US4 - Remove Limit Parameter (Phase 2) [Depends on US1]
  ↓
US2 - Loading Animation (Phase 3) [Depends on US1]
  ↓
US3 - Extended Timeout (Phase 4) [Optional, Depends on US2]
  ↓
Polish - Default ETF Filter (Phase 5)
```

## Parallel Execution Opportunities

- **Phase 1**: DashboardPage and StockTable changes can be done sequentially (same component flow)
- **Phase 3**: Loading UI enhancement independent after Phase 1
- **Phase 5**: Default ETF filter independent of other phases

## Task List

### Phase 1: User Story 1 - Backend Market Filter [US1]

**Goal**: Market selection triggers backend API call with market_code parameter instead of client-side filtering.

**Independent Test**: Select a market filter, verify API called with market_code parameter, see only that market's data.

- [X] T001 [US1] Remove client-side market filtering logic from DashboardPage.jsx useEffect
- [X] T002 [US1] Remove selectedMarkets from DashboardPage.jsx useEffect dependencies
- [X] T003 [US1] Add selectedMarkets prop to StockTable component in DashboardPage.jsx
- [X] T004 [US1] Add selectedMarkets to StockTable component props in src/components/dashboard/StockTable.jsx
- [X] T005 [US1] Add selectedMarkets to StockTable useEffect dependencies in src/components/dashboard/StockTable.jsx
- [X] T006 [US1] Build market_code parameter from selectedMarkets in StockTable loadStocks function
- [X] T007 [US1] Send market_code parameter to fetchStockList in StockTable.jsx
- [ ] T008 [US1] Test market filter triggers backend API call with correct market_code (requires remote testing)

### Phase 2: User Story 4 - Remove Limit Parameter [US4]

**Goal**: Frontend stops sending limit parameter, allowing backend to return all matching data.

**Independent Test**: API requests do not include limit parameter, backend returns complete datasets.

- [X] T009 [US4] Remove limit: 200 from options object in StockTable loadStocks function
- [ ] T010 [US4] Test query returns 1000+ records and displays all correctly (requires remote testing)

### Phase 3: User Story 2 - Loading Animation [US2]

**Goal**: Display loading animation during API requests, especially for long queries.

**Independent Test**: See loading indicator while query is in progress.

- [X] T011 [US2] Add relative wrapper div around table in StockTable.jsx return statement
- [X] T012 [US2] Add loading overlay with spinner and message in StockTable.jsx
- [ ] T013 [US2] Test loading animation appears during filter changes and persists until data loads (requires remote testing)

### Phase 4: User Story 3 - Extended Timeout [US3] (Optional)

**Goal**: Support 10-minute queries without premature timeout.

**Independent Test**: Frontend successfully receives data from queries taking 5-8 minutes.

- [ ] T014 [US3] Add AbortController with 10-minute timeout to fetchStockList in src/services/stockService.js (optional)
- [ ] T015 [US3] Test long query (5+ minutes) completes successfully

### Phase 5: Polish & Enhancements

**Goal**: Set default ETF filter and ensure all features work together.

- [X] T016 Set default selectedETFType to 'etf' in DashboardPage.jsx useState
- [ ] T017 Test default ETF filter is selected on page load (requires remote testing)
- [ ] T018 Test all filters work together (market + ETF + search) (requires remote testing)
- [ ] T019 Test table performance with 1000+ rows (requires remote testing)

## Implementation Strategy

### MVP Scope

Phase 1, Phase 2, and Phase 3 (US1, US4, US2) provide core functionality. Phase 4 (US3) is optional and should only be implemented if timeout issues occur. Phase 5 adds polish and default filter.

### Suggested Order

1. **Phase 1**: Implement backend market filtering
2. **Phase 2**: Remove limit parameter
3. **Phase 3**: Add loading animation
4. **Phase 5**: Set default ETF filter and test integration
5. **Phase 4**: Add explicit timeout only if needed

### Independent Test Criteria

**US1 Test**: Select "Shanghai" market, verify API called with `market_code=SH`, see only SH stocks.

**US2 Test**: Change filter, verify loading spinner appears and persists until data loads.

**US4 Test**: Query stock list, verify no limit parameter in request, see all matching data.

**Default ETF Test**: Load page, verify ETF filter is pre-selected.

### Success Metrics

- Market filter triggers backend API call with correct market_code
- No empty results when switching markets
- Loading animation displays during queries
- Loading persists for long queries (5+ minutes)
- All matching data returned (no limit truncation)
- Table renders 1000+ rows without issues
- Default ETF filter is selected on page load
- Combined filters work correctly
- No performance degradation

## Notes

This feature fixes data completeness issues by moving filtering to the backend and improves UX with loading feedback. The default ETF filter provides a better initial view for most users.

Browser default timeout (~300 seconds) should be sufficient for most queries. Only implement explicit 10-minute timeout (T014) if premature timeouts occur during testing.

