# Feature Specification: Stock Data Display on Dashboard

**Feature Branch**: `008-stock-data-display`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "前端dashboard页面目前只展示了股票列表。列表中有price、Change %、Volume等列，但没有数值，似乎后端接口没有返回数据，请增加实现。同时所有列名应使用中文。"

> **Note**: This specification MUST be placed in the target project's `specs/008-stock-data-display/` directory (e.g., `qtfund_project_1/specs/`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Stock Price Data (Priority: P1)

Users can view the latest stock prices in the dashboard table with actual numerical values displayed.

**Why this priority**: Price data is the fundamental information users need to see - without it, the dashboard has no value.

**Independent Test**: Users can load the dashboard and see numerical price values (not empty/null) in the price column for each stock.

**Acceptance Scenarios**:

1. **Given** the dashboard loads, **When** users view the stock table, **Then** they see actual price values (e.g., 12.34, 99.88) in the "价格" column
2. **Given** the backend API returns price data, **When** users refresh the page, **Then** all price values are populated with latest data
3. **Given** a stock has price data available, **When** users view it in the table, **Then** the price is displayed as a formatted number (e.g., 12.34, not 12.3400000)

---

### User Story 2 - View Price Change Percentage (Priority: P1)

Users can see how much each stock's price has changed on the current day, expressed as a percentage.

**Why this priority**: Change percentage is critical for stock analysis - users need to quickly identify which stocks are rising or falling.

**Independent Test**: Users can view the daily price change percentage for each stock, displayed as a percentage with appropriate formatting (green for positive, red for negative).

**Acceptance Scenarios**:

1. **Given** a stock has positive price change, **When** users view the "涨跌幅%" column, **Then** they see a positive percentage (e.g., +5.23%) displayed in green color
2. **Given** a stock has negative price change, **When** users view the "涨跌幅%" column, **Then** they see a negative percentage (e.g., -3.45%) displayed in red color
3. **Given** a stock has no price change, **When** users view the column, **Then** they see 0.00% in neutral color
4. **Given** price change data is missing, **When** users view the column, **Then** they see "--" or empty placeholder

---

### User Story 3 - View Trading Volume (Priority: P1)

Users can see the trading volume for each stock, indicating market activity level.

**Why this priority**: Volume is essential information for stock analysis - high volume indicates active trading and liquidity.

**Independent Test**: Users can view the trading volume for each stock, formatted appropriately (e.g., 1,234,567 or 1.23M for large numbers).

**Acceptance Scenarios**:

1. **Given** a stock has volume data, **When** users view the "成交量" column, **Then** they see the volume displayed with thousand separators (e.g., 1,234,567)
2. **Given** a stock has very large volume, **When** users view the column, **Then** they see abbreviated format (e.g., 1.23M for millions)
3. **Given** volume data is missing, **When** users view the column, **Then** they see "--" or empty placeholder

---

### User Story 4 - Display All Columns in Chinese (Priority: P2)

All column headers in the dashboard table must be displayed in Chinese language.

**Why this priority**: User requirement specifically states all column names should use Chinese for better localization.

**Independent Test**: Users view the table and see all column headers in Chinese instead of English.

**Acceptance Scenarios**:

1. **Given** the dashboard displays stock data, **When** users view the column headers, **Then** all headers are in Chinese (e.g., "代码", "名称", "价格", "涨跌幅%", "成交量", "市场")
2. **Given** users apply custom columns, **When** they toggle columns, **Then** all new columns also use Chinese headers
3. **Given** users sort by a column, **When** they click the header, **Then** the sorted header text remains in Chinese

---

### User Story 5 - Handle Missing Data Gracefully (Priority: P2)

When backend API fails to return data or returns incomplete data, the system should display appropriate placeholders without breaking the UI.

**Why this priority**: Real-world data is often incomplete - the UI must remain functional even when some fields are missing.

**Independent Test**: Users can view the table even when some stocks have missing price or volume data, with appropriate placeholders shown.

**Acceptance Scenarios**:

1. **Given** a stock has no price data from backend, **When** users view that row, **Then** the price column shows "--" instead of empty or crashing
2. **Given** API returns partial data (has stock names but no prices), **When** users view the table, **Then** stocks are still displayed with available data and "--" for missing fields
3. **Given** API connection fails, **When** users try to load the dashboard, **Then** they see an error message but the page doesn't crash

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display actual numerical price values from backend API in the dashboard table
- **FR-002**: System MUST display price change percentage for each stock, calculated from backend data
- **FR-003**: System MUST display trading volume for each stock from backend API
- **FR-004**: System MUST display all column headers in Chinese language
- **FR-005**: System MUST format numbers appropriately (prices with 2 decimals, volumes with thousand separators)
- **FR-006**: System MUST display green color for positive price changes and red color for negative changes
- **FR-007**: System MUST display "--" or empty placeholder when data is missing from backend
- **FR-008**: System MUST handle API errors gracefully and show user-friendly error messages
- **FR-009**: System MUST support sorting on price, change percentage, and volume columns
- **FR-010**: System MUST fetch latest stock data from backend API
- **FR-011**: System MUST display data loading state while fetching from backend

### Key Entities *(include if feature involves data)*

- **Stock Metadata**: Basic stock information (symbol, name, market code)
- **Price Data**: Current/latest trading price retrieved from backend
- **Change Data**: Price change amount and percentage for current trading day
- **Volume Data**: Trading volume and turnover data
- **Column Configuration**: Display settings including column visibility and order

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can see price values for at least 90% of stocks in the dashboard table
- **SC-002**: Price change percentages display correctly for all stocks with valid price data
- **SC-003**: Volume data displays for all stocks where available from backend
- **SC-004**: All column headers are displayed in Chinese language with no English text visible
- **SC-005**: Missing data displays as "--" with no blank or error states in the table
- **SC-006**: Sorting on price, change%, and volume columns works correctly with actual data
- **SC-007**: Color coding (green/red) for positive/negative changes displays correctly for all rows
- **SC-008**: Data loads within 3 seconds on initial page load
- **SC-009**: Number formatting (decimals, thousand separators) is consistent across all displayed values

