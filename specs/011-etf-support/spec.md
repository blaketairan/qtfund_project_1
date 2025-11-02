# Feature Specification: ETF Support in Frontend Dashboard

**Feature Branch**: `011-etf-support`  
**Created**: 2025-01-27  
**Status**: ✅ Completed  
**Implemented**: 2025-01-27  
**Input**: User description: "需要在dashboard中添加ETF筛选功能，支持按ETF类型过滤股票列表"

> **Note**: This specification MUST be placed in the target project's `specs/011-etf-support/` directory (e.g., `qtfund_project_1/specs/`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filter Dashboard by ETF Type (Priority: P1)

Users can use a filter control to show only ETFs, only stocks, or both in the dashboard table.

**Why this priority**: This is the core requirement - users need to distinguish between ETFs and stocks in their analysis.

**Independent Test**: Users can select an ETF filter option and see the stock table update to show only the selected type of instruments.

**Acceptance Scenarios**:

1. **Given** users view the dashboard, **When** they see the market filter area, **Then** they also see an instrument type filter with options for ETFs, Stocks, and All
2. **Given** users select "ETFs only" filter, **When** the table loads, **Then** it displays only ETF instruments
3. **Given** users select "Stocks only" filter, **When** the table loads, **Then** it displays only non-ETF stock instruments
4. **Given** users select "All" filter, **When** the table loads, **Then** it displays both stocks and ETFs together
5. **Given** users change the ETF filter, **When** the filter updates, **Then** the table refreshes to show the filtered results

---

### User Story 2 - Distinguish ETFs in Table Display (Priority: P2)

Users can visually identify ETFs in the table (e.g., by icon, badge, or special styling).

**Why this priority**: Even when showing all types, users need to quickly identify which instruments are ETFs vs. stocks.

**Independent Test**: Users can view the table and identify ETFs without reading symbol names.

**Acceptance Scenarios**:

1. **Given** the table displays both stocks and ETFs, **When** users view a row, **Then** they can see a visual indicator (badge, icon, label) showing whether it's an ETF
2. **Given** users view ETF rows, **When** they scan the table, **Then** ETFs have a consistent visual marker across all ETF rows
3. **Given** users want to identify ETFs quickly, **When** they view the table, **Then** ETF rows stand out with the visual indicator

---

### User Story 3 - Apply ETF Filter with Other Filters (Priority: P1)

ETF filter works in combination with existing market and search filters.

**Why this priority**: Users often want to narrow down results using multiple criteria (e.g., Shanghai ETFs only).

**Independent Test**: Users can apply ETF filter together with market filter and search, and all filters work correctly together.

**Acceptance Scenarios**:

1. **Given** users select "ETFs only" and "Shanghai market", **When** the table loads, **Then** it shows only Shanghai ETFs
2. **Given** users select "Stocks only" and search for "平安", **When** results appear, **Then** they see only stock instruments matching "平安" (no ETFs)
3. **Given** users apply ETF filter, market filter, and search simultaneously, **When** they view results, **Then** all three filters are respected in the results

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a filter control for instrument type (ETF/Stock/All) in the dashboard filters area
- **FR-002**: System MUST send `is_etf` parameter to the backend API when ETF filter is selected
- **FR-003**: System MUST send correct `is_etf` value based on user's filter selection (true/false/not provided)
- **FR-004**: System MUST refresh table data when ETF filter selection changes
- **FR-005**: System MUST display visual indicator (badge, icon, or label) for ETF rows in the table
- **FR-006**: System MUST support combining ETF filter with market filter (SH/SZ/BJ)
- **FR-007**: System MUST support combining ETF filter with search functionality
- **FR-008**: System MUST persist ETF filter selection across page refreshes (optional)
- **FR-009**: System MUST handle ETF data in all existing features (sorting, column display, custom scripts)

### Key Entities *(include if feature involves data)*

- **Instrument Type Filter**: UI control allowing users to select ETF-only, Stock-only, or All instruments
- **ETF Indicator**: Visual element (badge, icon, or text) showing which table rows are ETFs
- **Filter State**: Current selection of ETF filter combined with other filters (market, search)
- **Filter Parameters**: API query parameters sent to backend including `is_etf`

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully filter to show only ETFs in the dashboard table
- **SC-002**: Users can successfully filter to show only stocks (excluding ETFs) in the table
- **SC-003**: Users can successfully view both stocks and ETFs when "All" option is selected
- **SC-004**: ETF rows have visible visual indicators distinguishing them from stocks
- **SC-005**: ETF filter works correctly when combined with market filter (SH/SZ/BJ)
- **SC-006**: ETF filter works correctly when combined with search functionality
- **SC-007**: Table refreshes within 2 seconds when ETF filter changes
- **SC-008**: All existing features (sorting, custom scripts, column display) continue to work for ETF data

