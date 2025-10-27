# Tasks: ETF Support in Frontend Dashboard

**Feature**: 011-etf-support  
**Date**: 2025-01-27  
**Status**: Ready for Implementation

## Overview

Add ETF filtering capability to the stock dashboard. Users can filter by instrument type (ETFs, Stocks, or All), and ETFs are visually identified in the table with badges. The filter works in combination with existing market and search filters.

**Total Tasks**: 10  
**Completed**: 0 (0%)  
**MVP Scope**: User Stories 1 and 3 (core filtering)  
**Estimated Time**: 2-3 hours

## Dependency Graph

```
US1 - ETF Filter Control (Phase 1)
  ↓
US3 - Combined Filters (Phase 2) [Depends on US1]
  ↓
US2 - Visual Indicators (Phase 3) [Depends on US1]
  ↓
Testing & Integration (Phase 4)
```

## Parallel Execution Opportunities

- **Phase 1**: ETFFilter component and stockService update can be done in parallel
- **Phase 3**: ETF badge styling can be done independently after table integration

## Task List

### Phase 1: User Story 1 - Filter Dashboard by ETF Type [US1]

**Goal**: Users can use a filter control to show only ETFs, only stocks, or both in the dashboard table.

**Independent Test**: Select an ETF filter option and see the stock table update to show only the selected type of instruments.

- [X] T001 [US1] Create ETFFilter component in src/components/dashboard/ETFFilter.jsx
- [X] T002 [P] [US1] Add is_etf parameter support to fetchStockList in src/services/stockService.js
- [X] T003 [US1] Add selectedETFType state in DashboardPage.jsx
- [X] T004 [US1] Render ETFFilter component in filter area of DashboardPage.jsx
- [X] T005 [US1] Pass selectedETFType to StockTable in DashboardPage.jsx
- [X] T006 [US1] Modify loadStocks to include is_etf parameter in StockTable.jsx
- [ ] T007 [US1] Test ETF filter updates table data correctly

### Phase 2: User Story 3 - Apply ETF Filter with Other Filters [US3]

**Goal**: ETF filter works in combination with existing market and search filters.

**Independent Test**: Apply ETF filter together with market filter and search, verify all filters work correctly together.

- [ ] T008 [US3] Test ETF filter works with market filter (SH/SZ/BJ)
- [ ] T009 [US3] Test ETF filter works with search functionality

### Phase 3: User Story 2 - Distinguish ETFs in Table Display [US2]

**Goal**: Users can visually identify ETFs in the table with visual indicators.

**Independent Test**: View the table and identify ETFs without reading symbol names.

- [X] T010 [US2] Add ETF badge display in StockTable.jsx for rows where stock.is_etf is true

### Phase 4: Polish & Testing

**Goal**: Verify complete ETF filtering functionality and edge cases.

- [ ] T011 Test ETF filter persistence (optional localStorage)
- [ ] T012 Test sorting works with ETF data
- [ ] T013 Test custom script columns work with ETF data
- [ ] T014 Test ETF filter with limit and pagination parameters
- [ ] T015 Test all three filters (ETF + Market + Search) work together

## Implementation Strategy

### MVP Scope

Phase 1 and Phase 2 (US1 and US3) provide core filtering functionality. Phase 3 (US2) adds visual polish.

### Suggested Order

1. **Phase 1**: Implement ETF filter control and API integration
2. **Phase 2**: Verify filter combination with existing filters
3. **Phase 3**: Add visual indicators
4. **Phase 4**: Integration testing

### Independent Test Criteria

**US1 Test**: Select "ETF" filter, query stock list, verify only ETF instruments displayed.

**US2 Test**: View table with "All" filter, verify ETF rows have visible badges.

**US3 Test**: Select "ETFs only" + "Shanghai market", verify only Shanghai ETFs shown.

### Success Metrics

- Users can filter to show only ETFs in dashboard table
- Users can filter to show only stocks (excluding ETFs)
- Users can view both stocks and ETFs together
- ETF rows have visible visual indicators
- ETF filter works with market and search filters
- Table refreshes within 2 seconds when filter changes
- All existing features work with ETF data

## Notes

This feature follows the existing MarketFilter pattern for consistency. The ETFFilter component can be created by adapting MarketFilter code to radio button selection (single choice) instead of checkboxes (multiple choice).

