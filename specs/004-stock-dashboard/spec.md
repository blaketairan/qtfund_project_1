# Feature Specification: Stock/ETF Quantitative Analysis Dashboard

**Feature Branch**: `004-stock-dashboard`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "实现股票/ETF量化分析仪表盘，基于后端数据服务提供实时数据展示、量化计算和交互功能"

## Clarifications

### Session 2025-01-27

- Q: Data source strategy - How should dashboard retrieve stock data? → A: Backend API only (real-time data from qtfund_project_3 on port 8000)
- Q: Custom script execution - How should custom quantitative calculations work? → A: Backend Python script execution (users write Python scripts, backend executes in sandbox for security)
- Q: Market coverage - Which markets should dashboard support? → A: All three markets (Shanghai/Shenzhen/Beijing) with user-selectable filters

## User Scenarios & Testing

### User Story 1 - View Stock Data Table (Priority: P1)

Users can view stock/ETF data in an interactive table with sortable columns and customizable column visibility.

**Why this priority**: This is the core viewing functionality - users need to see stock data before they can analyze it.

**Independent Test**: Users can load the dashboard and see stock data in a table format. The table displays stock symbols, names, prices, and returns.

**Acceptance Scenarios**:

1. **Given** the application loads, **When** users open the dashboard page, **Then** they see a table with stock data including symbol, name, latest price, and daily change
2. **Given** the table displays 200+ stocks, **When** users scroll through the table, **Then** the table renders smoothly without performance issues
3. **Given** column settings are saved from a previous session, **When** users return to the dashboard, **Then** their custom column visibility preferences are restored
4. **Given** users click a column header, **When** they click it, **Then** the table sorts ascending, and clicking again sorts descending

---

### User Story 2 - Customize Column Display (Priority: P1)

Users can show or hide columns to customize the table view according to their analysis needs.

**Why this priority**: Different users have different analysis needs. Customizing columns enables users to focus on relevant data.

**Independent Test**: Users can open column settings panel, toggle columns on/off, and see changes immediately reflected in the table.

**Acceptance Scenarios**:

1. **Given** all columns are visible, **When** a user unchecks "20-Day Return", **Then** that column disappears from the table immediately
2. **Given** some columns are hidden, **When** a user checks "60-Day Return", **Then** that column appears in the table
3. **Given** column settings are customized, **When** the user refreshes the page, **Then** custom column visibility is preserved
4. **Given** users have hidden many columns, **When** they click "Reset to Default", **Then** all default columns become visible again

---

### User Story 3 - View Quantitative Indicators (Priority: P1)

Users can view calculated quantitative indicators like momentum scores, moving averages, and rate of change indicators.

**Why this priority**: Quantitative indicators are essential for data analysis and informed decision-making.

**Independent Test**: Users can enable quantitative columns and see calculated values for each stock such as momentum scores and moving average status.

**Acceptance Scenarios**:

1. **Given** quantitative columns are configured, **When** a user enables "26-Day Momentum" column, **Then** they see calculated momentum scores for each stock
2. **Given** momentum calculation requires 26 days of data, **When** a stock has less than 26 days, **Then** that row shows 0 or empty value
3. **Given** quantitative indicators are calculated, **When** users sort by momentum score, **Then** stocks are ordered by highest to lowest momentum
4. **Given** users view multiple momentum columns (26/29/31/34 days), **When** they compare values, **Then** they can identify trends across different timeframes

---

### User Story 4 - Search and Filter Stocks (Priority: P2)

Users can search for specific stocks by name or symbol and filter by market or other criteria.

**Why this priority**: With hundreds of stocks, users need efficient ways to find specific instruments.

**Independent Test**: Users can type a stock name in the search box and see matching results immediately.

**Acceptance Scenarios**:

1. **Given** the table displays many stocks, **When** a user types "茅台" in the search box, **Then** only stocks containing "茅台" in name are shown
2. **Given** users want to filter by market, **When** they select "Shanghai" filter, **Then** only Shanghai-listed stocks are displayed
3. **Given** search results are displayed, **When** users clear the search, **Then** all stocks are shown again
4. **Given** no stocks match search criteria, **When** users search, **Then** a "No results" message is displayed

---

### User Story 5 - Create Custom Calculated Columns (Priority: P2)

Advanced users can create custom columns by writing Python-based calculation scripts.

**Why this priority**: Power users need flexibility to create their own quantitative indicators beyond predefined ones.

**Independent Test**: Users can open the script editor, write a Python calculation script, and see the result in a new column.

**Acceptance Scenarios**:

1. **Given** users want a custom indicator, **When** they open the script editor and write a formula, **Then** they can add a new column with their calculation
2. **Given** a custom script has syntax errors, **When** users try to save it, **Then** they see an error message pointing to the problem
3. **Given** custom columns are created, **When** users view the table, **Then** custom columns appear with calculated values
4. **Given** users save custom columns, **When** they return to the dashboard, **Then** custom columns and their scripts are preserved

---

### Edge Cases

- What happens when backend API returns no data?
- How does the system handle API timeout or connection failures (port 8000 unavailable)?
- What happens when users try to sort on a column with missing values?
- How does the system handle very large datasets (500+ stocks)?
- What happens if custom script causes an infinite loop?
- How does the system handle concurrent edits to column configurations?
- What happens when backend API is down - should system show error or empty state?
- How does system handle filtered results when no stocks match market filter?
- What happens when Python sandboxed script execution throws errors on backend?

## Requirements

### Functional Requirements

- **FR-001**: System MUST fetch stock data exclusively from backend API at qtfund_project_3 (port 8000)
- **FR-002**: System MUST display stock data in a sortable table format
- **FR-002a**: System MUST handle API failures gracefully with timeout and retry logic
- **FR-003**: System MUST support column visibility toggling
- **FR-004**: System MUST persist column visibility settings to localStorage
- **FR-005**: System MUST support single-column sorting (ascending/descending)
- **FR-006**: System MUST calculate quantitative indicators (momentum, moving averages, returns)
- **FR-007**: System MUST support custom Python-based column calculations (users write Python scripts, backend executes)
- **FR-008**: System MUST validate Python scripts before applying them
- **FR-008a**: System MUST execute Python scripts in backend sandboxed environment to prevent security vulnerabilities
- **FR-009**: System MUST cache calculation results to improve performance
- **FR-010**: System MUST support searching stocks by name or symbol
- **FR-011**: System MUST support filtering by market (Shanghai/Shenzhen/Beijing) with user-selectable market filters
- **FR-011a**: System MUST support all three markets (SH/SZ/BJ) from backend database
- **FR-012**: System MUST handle API errors gracefully with user-friendly messages
- **FR-013**: System MUST display loading states during data fetching
- **FR-014**: System MUST format numbers, percentages, and currencies appropriately

### Non-Functional Requirements

- **NFR-001**: Table rendering MUST complete within 500ms for 200 stocks
- **NFR-002**: Column toggling MUST update within 200ms
- **NFR-003**: Sorting operations MUST complete within 100ms
- **NFR-004**: Calculation cache MUST prevent redundant computations
- **NFR-005**: API responses MUST be handled within 5 seconds timeout
- **NFR-006**: Custom Python scripts MUST execute in backend sandboxed environment
- **NFR-007**: Application MUST work with backend service on port 8000
- **NFR-008**: All calculations MUST support at least 200 stocks with full history

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can view stock data table within 2 seconds of page load
- **SC-002**: Column toggling completes within 200ms of user action
- **SC-003**: Sorting completes within 100ms on datasets up to 500 stocks
- **SC-004**: Users can successfully create custom calculated columns
- **SC-005**: Quantitative indicators calculate accurately for 95% of valid data cases
- **SC-006**: Search returns results within 1 second on local data
- **SC-007**: Custom column settings persist across browser sessions
- **SC-008**: Application handles API failures gracefully without crashing
- **SC-009**: Backend API connection successfully retrieves data from port 8000 within 5 seconds

### Key Entities

- **Stock Data**: Price data retrieved from backend API including close price, volume, turnover, and price changes
- **Stock Info**: Basic stock information including symbol, name, market code, industry classification
- **Column Configuration**: User-defined table column settings including visibility, width, sort state
- **Quantitative Indicator**: Calculated metrics like momentum scores, moving averages, period returns
- **Custom Script**: User-written Python script for custom column calculations
- **Market Filter**: Filter criteria for selecting stocks from specific markets (Shanghai/Shenzhen/Beijing)
