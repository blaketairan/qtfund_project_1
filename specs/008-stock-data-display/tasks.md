# Tasks: Stock Data Display on Dashboard

**Feature**: `008-stock-data-display`  
**Branch**: `008-stock-data-display`  
**Date**: 2025-01-27  
**Status**: Ready for Implementation

## Implementation Strategy

**MVP Scope**: User Story 1 (Price Data) + User Story 4 (Chinese Labels) - displays prices with Chinese column headers  
**Incremental Delivery**: Each user story can be implemented and tested independently  
**Parallel Opportunities**: Formatting verification tasks can be done in parallel

## Dependencies

### Story Completion Order

1. **Phase 2** (Foundational) - Verify existing infrastructure ✅
2. **Phase 3** (US4) - Chinese column labels (blocks visual testing)
3. **Phase 4** (US1+US2+US3) - Data display (can be parallel)
4. **Phase 5** (US5) - Missing data handling
5. **Phase 6** (Polish) - Final verification

### Story Dependencies

- US1, US2, US3 depend on US4 (need Chinese labels first for visual testing)
- US5 can be done in parallel with US1-US3 (error handling is independent)
- All stories depend on verification of existing services (Phase 2)

## Parallel Execution Examples

- **US1, US2, US3**: Price, change%, volume display - all format different fields, can verify in parallel
- **Verification tasks**: Test different data fields simultaneously
- **Formatting checks**: Use existing utilities, no dependencies

---

## Phase 1: Setup - Verify Existing Infrastructure

**Goal**: Verify existing code supports the required functionality

**Independent Test**: All existing services and components are functional

---

- [x] T001 [P] Verify API configuration points to correct backend in `src/config/apiConfig.js`
- [x] T002 [P] Verify stockService.js exports fetchStockList() in `src/services/stockService.js`
- [x] T003 [P] Verify numberFormat.js has formatCurrency function in `src/utils/numberFormat.js`
- [x] T004 [P] Verify numberFormat.js has formatPercentage function in `src/utils/numberFormat.js`
- [x] T005 [P] Verify numberFormat.js has formatVolume function in `src/utils/numberFormat.js`
- [x] T006 [P] Verify StockTable.jsx exists and imports required dependencies in `src/components/dashboard/StockTable.jsx`
- [x] T007 [P] Verify DashboardContext exports useDashboard hook in `src/context/DashboardContext.jsx`
- [x] T008 Verify build process with `npm run build`

---

## Phase 2: Foundational - Test API Connection

**Goal**: Verify backend API returns data in expected format

**Independent Test**: API endpoint returns stock data with required fields (symbol, stock_name, close_price, price_change_pct, volume, market_code)

**Status**: ⏭️ SKIPPED - Will be verified during remote deployment testing with actual API

---

- [⏭️] T009 [P] Test API endpoint /api/stock-price/list returns 200 status (Remote testing required)
- [⏭️] T010 [P] Verify API response contains 'code' field with value 200 (Remote testing required)
- [⏭️] T011 [P] Verify API response contains 'data' field with array of objects (Remote testing required)
- [⏭️] T012 [P] Verify each stock object has 'symbol' field (string) (Remote testing required)
- [⏭️] T013 [P] Verify each stock object has 'stock_name' field (string) (Remote testing required)
- [⏭️] T014 [P] Verify each stock object has 'close_price' field (number) (Remote testing required)
- [⏭️] T015 [P] Verify each stock object has 'price_change_pct' field (number) (Remote testing required)
- [⏭️] T016 [P] Verify each stock object has 'volume' field (number) (Remote testing required)
- [⏭️] T017 [P] Verify each stock object has 'market_code' field (string, enum SH/SZ/BJ) (Remote testing required)
- [⏭️] T018 Verify API response data is parseable JSON (Remote testing required)

---

## Phase 3: [US4] Display All Columns in Chinese

**Goal**: All column headers in the dashboard table must be displayed in Chinese language

**Independent Test**: Users view the table and see all column headers in Chinese (代码, 名称, 价格, 涨跌幅%, 成交量, 市场) instead of English

---

- [x] T019 [US4] Update column definitions array to use Chinese labels for 'symbol' key in `src/components/dashboard/StockTable.jsx`
- [x] T020 [US4] Update column label 'Symbol' to '代码' in columns array in `src/components/dashboard/StockTable.jsx`
- [x] T021 [US4] Update column label 'Name' to '名称' in columns array in `src/components/dashboard/StockTable.jsx`
- [x] T022 [US4] Update column label 'Price' to '价格' in columns array in `src/components/dashboard/StockTable.jsx`
- [x] T023 [US4] Update column label 'Change %' to '涨跌幅%' in columns array in `src/components/dashboard/StockTable.jsx`
- [x] T024 [US4] Update column label 'Volume' to '成交量' in columns array in `src/components/dashboard/StockTable.jsx`
- [x] T025 [US4] Update column label 'Market' to '市场' in columns array in `src/components/dashboard/StockTable.jsx`
- [x] T026 [US4] Verify table renders with Chinese column headers in browser

---

## Phase 4: [US1+US2+US3] Display Stock Data with Formatting

**Goal**: Display actual numerical values for price, change percentage, and volume with proper formatting

**Independent Test**: Users see formatted numeric values (¥12.34, 5.23%, 1.23万) in corresponding Chinese columns

---

- [x] T027 [P] [US1] Verify close_price displays using formatCurrency() function call in `src/components/dashboard/StockTable.jsx`
- [x] T028 [P] [US1] Verify price renders with ¥ currency symbol and 2 decimals (e.g., ¥12.34)
- [x] T029 [P] [US1] Test price formatting shows thousand separators for large numbers
- [x] T030 [P] [US2] Verify price_change_pct displays using formatPercentage() function call in `src/components/dashboard/StockTable.jsx`
- [x] T031 [P] [US2] Verify positive changes display in green color (text-green-600 class)
- [x] T032 [P] [US2] Verify negative changes display in red color (text-red-600 class)
- [x] T033 [P] [US2] Verify percentage shows with % symbol and 2 decimals (e.g., 5.23%)
- [x] T034 [P] [US2] Verify zero changes display in neutral color
- [x] T035 [P] [US3] Verify volume displays using formatVolume() function call in `src/components/dashboard/StockTable.jsx`
- [x] T036 [P] [US3] Verify large volumes use 万 abbreviation (e.g., 1.23万 for 12300)
- [x] T037 [P] [US3] Verify very large volumes use 亿 abbreviation (e.g., 1.23亿 for 123000000)
- [⏭️] T038 [US1] Verify price column sorts correctly with actual numeric values (Remote testing required)
- [⏭️] T039 [US2] Verify change percentage column sorts correctly with numeric values (Remote testing required)
- [⏭️] T040 [US3] Verify volume column sorts correctly with numeric values (Remote testing required)

---

## Phase 5: [US5] Handle Missing Data Gracefully

**Goal**: When backend API fails or returns incomplete data, display appropriate placeholders without breaking UI

**Independent Test**: Users can view table even when some stocks have missing price or volume data, with "--" placeholders shown

---

- [x] T041 [US5] Verify formatCurrency returns "--" for null/undefined close_price in `src/utils/numberFormat.js`
- [x] T042 [US5] Verify formatPercentage returns "--" for null/undefined price_change_pct in `src/utils/numberFormat.js`
- [x] T043 [US5] Verify formatVolume returns "--" for null/undefined volume in `src/utils/numberFormat.js`
- [⏭️] T044 [US5] Test table displays "--" for missing close_price field when API returns null (Remote testing required)
- [⏭️] T045 [US5] Test table displays "--" for missing price_change_pct when API returns null (Remote testing required)
- [⏭️] T046 [US5] Test table displays "--" for missing volume when API returns null (Remote testing required)
- [⏭️] T047 [US5] Test table handles partial data (some fields missing) without crashing (Remote testing required)
- [x] T048 [US5] Verify error message displays when API connection fails in StockTable component
- [x] T049 [US5] Verify "No stock data available" displays when API returns empty array
- [x] T050 [US5] Verify page doesn't crash when API returns malformed data

---

## Phase 6: Polish - Final Verification

**Goal**: Ensure all requirements met, consistent formatting, performance targets achieved

**Independent Test**: All success criteria pass, dashboard fully functional with Chinese labels and formatted data

---

- [⏭️] T051 Verify all column headers are in Chinese with no English text visible (Remote testing required)
- [⏭️] T052 Verify at least 90% of stocks display price values (not empty/null) (Remote testing required)
- [⏭️] T053 Verify price change percentages display correctly for all stocks with data (Remote testing required)
- [⏭️] T054 Verify volume displays for all stocks where available from backend (Remote testing required)
- [⏭️] T055 Verify missing data displays as "--" with no blank or error states (Remote testing required)
- [⏭️] T056 Verify sorting works on price, change%, and volume columns with actual data (Remote testing required)
- [⏭️] T057 Verify color coding (green/red) displays correctly for all rows (Remote testing required)
- [⏭️] T058 Verify data loads within 3 seconds on initial page load (Remote testing required)
- [x] T059 Verify number formatting (decimals, thousand separators) is consistent
- [x] T060 Verify page handles API errors gracefully with user-friendly messages
- [x] T061 Verify dashboard renders without console errors
- [x] T062 [P] Run production build to verify bundle size acceptable
- [⏭️] T063 [P] Test in multiple browsers (Chrome, Firefox, Safari) (Remote testing required)
- [⏭️] T064 [P] Test with different screen sizes (responsive layout) (Remote testing required)

---

## Summary

### Task Counts

- **Phase 1 (Setup)**: 8 tasks
- **Phase 2 (Foundational)**: 10 tasks
- **Phase 3 (US4 - Chinese Labels)**: 8 tasks
- **Phase 4 (US1+US2+US3 - Data Display)**: 14 tasks
- **Phase 5 (US5 - Missing Data)**: 10 tasks
- **Phase 6 (Polish)**: 14 tasks

**Total**: 64 tasks

### Per User Story

- **US1** (Price Data): 7 tasks in Phase 4
- **US2** (Change Percentage): 8 tasks in Phase 4
- **US3** (Volume): 5 tasks in Phase 4
- **US4** (Chinese Labels): 8 tasks in Phase 3
- **US5** (Missing Data): 10 tasks in Phase 5

### Parallel Opportunities

Tasks marked with [P] can be executed in parallel:
- All verification tasks in Phase 1 (8 tasks)
- All API field verification in Phase 2 (9 tasks)
- Data formatting tasks across US1, US2, US3 in Phase 4
- Error handling verification in Phase 5

### MVP Scope

Minimum viable implementation covers:
- Tasks T019-T026 (Chinese labels - US4)
- Tasks T027-T028 (Price display - US1)

This provides functional dashboard with Chinese headers showing actual price data.

### Format Validation

✅ All tasks follow checklist format with:
- Checkbox: `- [ ]`
- Task ID: T001-T064 (sequential)
- Parallel marker: [P] where applicable
- Story label: [US1], [US2], etc. for user story tasks
- Clear file paths in descriptions
- Specific actionable descriptions

