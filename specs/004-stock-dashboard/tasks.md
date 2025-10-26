# Tasks: Stock Dashboard Frontend

**Feature**: 004-stock-dashboard  
**Date**: 2025-01-27  
**Status**: Ready for Implementation

## Overview

Implement React-based quantitative analysis dashboard for stock/ETF data with sortable tables, customizable columns, quantitative indicators, search/filtering, and custom Python script execution via backend API.

**Total Tasks**: 64  
**Completed**: 63 (98.4%)  
**Cancelled**: 1 (data polling not needed for daily-level data)  
**MVP Scope**: Phase 1-3 (Setup + US1 - View Stock Data Table)  
**Estimated Time**: 3-5 days

## Dependency Graph

```
Setup (Phase 1)
  ↓
Foundational (Phase 2) - Dashboard infrastructure
  ↓
US1 - View Stock Data Table (Phase 3)
  ↓
US2 - Customize Column Display (Phase 4) [Depends on US1]
  ↓
US3 - View Quantitative Indicators (Phase 5) [Depends on US1]
  ↓
US4 - Search and Filter Stocks (Phase 6) [Depends on US1]
  ↓
US5 - Create Custom Calculated Columns (Phase 7) [Depends on US1-US3]
  ↓
Polish & Integration (Phase 8)
```

## Parallel Execution Opportunities

- **Phase 2**: Services and entities can be implemented in parallel
- **Phase 3**: Multiple dashboard components can be built in parallel
- **Phase 4**: ColumnSettings is independent and can be built in parallel with other components
- **Phase 5**: CalculationService can be built independently
- **Phase 6**: SearchBar and MarketFilter are independent, can be built in parallel
- **Phase 7**: ScriptEditor, ScriptManager, and services are independent modules

## Task List

### Phase 1: Setup (Project Initialization)

- [X] T001 Create directory structure for dashboard feature (src/components/dashboard/)
- [X] T002 Create src/pages/DashboardPage.jsx placeholder
- [X] T003 Create src/context/DashboardContext.jsx placeholder
- [X] T004 Create src/services/stockService.js placeholder
- [X] T005 Create src/services/calculationService.js placeholder
- [X] T006 Create src/services/scriptService.js placeholder
- [X] T007 Create src/services/scriptStorageService.js placeholder
- [X] T008 Create src/utils/numberFormat.js utility file
- [X] T009 Update src/utils/constants.js with dashboard endpoints

### Phase 2: Foundational (Blocking Prerequisites)

- [X] T010 [P] Create src/entities/stock.json with stock data schema
- [X] T011 [P] Implement DashboardContext in src/context/DashboardContext.jsx with state management
- [X] T012 [P] Implement stockService in src/services/stockService.js with API client methods
- [X] T013 [P] Implement calculationService in src/services/calculationService.js with quantitative calculations
- [X] T014 [P] Extend src/utils/constants.js with dashboard API endpoints
- [X] T015 [P] Implement numberFormat utility in src/utils/numberFormat.js
- [X] T016 Update App.jsx with dashboard route

### Phase 3: User Story 1 - View Stock Data Table [US1]

**Goal**: Users can view stock/ETF data in an interactive table with sortable columns.

**Independent Test**: Users can load the dashboard and see stock data in a table format.

- [X] T017 [US1] Create DashboardPage in src/pages/DashboardPage.jsx as main dashboard container
- [X] T018 [US1] Implement StockTable component in src/components/dashboard/StockTable.jsx with table structure
- [X] T019 [US1] Add API integration to fetch stock data on component mount in StockTable
- [X] T020 [US1] Implement sorting functionality (ascending/descending) in StockTable
- [X] T021 [US1] Add loading state display during data fetch in StockTable
- [X] T022 [US1] Add error handling for API failures in StockTable
- [X] T023 [US1] Implement pagination for large datasets in StockTable (simplified for 200 stocks)
- [X] T024 [US1] Connect DashboardContext to StockTable for data flow

### Phase 4: User Story 2 - Customize Column Display [US2]

**Goal**: Users can show or hide columns to customize the table view.

**Independent Test**: Users can open column settings panel, toggle columns on/off.

- [X] T025 [US2] Create ColumnSettings component in src/components/dashboard/ColumnSettings.jsx
- [X] T026 [US2] Implement column visibility toggle UI with checkboxes in ColumnSettings
- [X] T027 [US2] Add column visibility state management to DashboardContext (via DashboardPage state)
- [X] T028 [US2] Connect ColumnSettings to StockTable to control column display
- [X] T029 [US2] Implement localStorage persistence for column visibility settings
- [X] T030 [US2] Add Reset to Default button in ColumnSettings
- [X] T031 [US2] Restore column visibility from localStorage on dashboard load

### Phase 5: User Story 3 - View Quantitative Indicators [US3]

**Goal**: Users can view calculated quantitative indicators like momentum scores and moving averages.

**Independent Test**: Users can enable quantitative columns and see calculated values.

- [X] T032 [US3] Implement momentum calculation (26-day) in calculationService
- [X] T033 [US3] Implement moving average calculations in calculationService
- [X] T034 [US3] Add rate of change calculations in calculationService
- [X] T035 [US3] Create IndicatorDisplay component in src/components/dashboard/IndicatorDisplay.jsx
- [X] T036 [US3] Integrate quantitative indicators into StockTable display
- [X] T037 [US3] Add caching for calculation results in DashboardContext (via state management)
- [X] T038 [US3] Handle missing data gracefully in indicator calculations

### Phase 6: User Story 4 - Search and Filter Stocks [US4]

**Goal**: Users can search for specific stocks by name/symbol and filter by market.

**Independent Test**: Users can type a stock name and see matching results immediately.

- [X] T039 [US4] Create SearchBar component in src/components/dashboard/SearchBar.jsx
- [X] T040 [US4] Implement search by name/symbol filtering in SearchBar
- [X] T041 [US4] Create MarketFilter component in src/components/dashboard/MarketFilter.jsx
- [X] T042 [US4] Implement multi-select market filter (SH/SZ/BJ) in MarketFilter
- [X] T043 [US4] Connect search and market filters to DashboardContext
- [X] T044 [US4] Implement debounced search (300ms) in SearchBar
- [X] T045 [US4] Add no results message when search returns empty (handled by StockTable)
- [X] T046 [US4] Add clear search functionality in SearchBar

### Phase 7: User Story 5 - Create Custom Calculated Columns [US5]

**Goal**: Advanced users can create custom columns by writing Python scripts.

**Independent Test**: Users can open script editor, write Python code, and see results in new column.

- [X] T047 [US5] Create ScriptEditor component in src/components/dashboard/ScriptEditor.jsx
- [X] T048 [US5] Implement Python script editor with syntax highlighting placeholder in ScriptEditor
- [X] T049 [US5] Create ScriptManager component in src/components/dashboard/ScriptManager.jsx
- [X] T050 [US5] Implement script CRUD operations in scriptStorageService
- [X] T051 [US5] Implement script execution API client in scriptService
- [X] T052 [US5] Add script validation before execution in ScriptEditor
- [X] T053 [US5] Integrate ScriptEditor with StockTable to display custom columns
- [X] T054 [US5] Add error display for script execution errors in ScriptEditor
- [X] T055 [US5] Implement script persistence (save/load) in ScriptEditor
- [X] T056 [US5] Connect ScriptManager to scriptStorageService for CRUD operations

### Phase 8: Polish & Integration

- [X] T057 Add comprehensive error handling across all components
- [X] T058 Implement responsive design for mobile devices (using Tailwind CSS responsive classes)
- [X] T059 Add loading skeletons for better UX during API calls
- [CANCELLED] T060 Test data refresh polling (30s interval) - NOT NEEDED: Daily-level data, not real-time
- [X] T061 Add accessibility attributes (ARIA labels, keyboard navigation)
- [X] T062 Optimize performance with React.memo where appropriate
- [X] T063 Add TypeScript type definitions (if applicable) - NOT APPLICABLE (JavaScript project)
- [X] T064 Verify all components follow constitution (no comments, HeadlessUI patterns)

## Implementation Strategy

### MVP (Minimum Viable Product)
Focus on **Phase 1-3**: Setup + View Stock Data Table only.

**MVP delivers**:
- Basic dashboard page with stock table
- Data fetching from backend API
- Sortable columns
- Loading states
- Error handling

**Estimated time**: 1-2 days

### Incremental Delivery
1. **Week 1**: MVP (US1) + Column Display (US2) + Quantitative Indicators (US3)
2. **Week 2**: Search/Filter (US4) + Custom Scripts (US5) + Polish

### Success Criteria
- ✅ All user stories independently testable
- ✅ No breaking changes to existing functionality
- ✅ Performance targets met (<500ms table render for 200 stocks)
- ✅ All constitution requirements satisfied

## Notes

- Backend API dependencies: Stock list, Python script execution endpoints must be available
- All custom scripts execute on backend (sandboxed), frontend only displays results
- localStorage used for column configurations only
- Scripts stored via backend API CRUD operations
- Market filtering supports all three markets (SH/SZ/BJ)

