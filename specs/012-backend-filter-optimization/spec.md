# Feature Specification: Backend Market Filter and Loading UX

**Feature Branch**: `012-backend-filter-optimization`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "市场筛选改为后端执行，移除limit，增加loading动画，支持长时间加载"

> **Note**: This specification MUST be placed in the target project's `specs/012-backend-filter-optimization/` directory (e.g., `qtfund_project_1/specs/`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Apply Market Filter via Backend API (Priority: P1)

Market selection triggers a backend API call with market_code parameter instead of filtering locally, ensuring users always see correct data for the selected market.

**Why this priority**: Frontend filtering causes data visibility issues - users see empty results when switching markets if the limited data doesn't contain the target market.

**Independent Test**: Users can select a market filter, and the system queries the backend with market_code parameter to retrieve only that market's data.

**Acceptance Scenarios**:

1. **Given** users select "Shanghai" market, **When** the filter changes, **Then** frontend sends market_code=SH parameter to backend API
2. **Given** users select "Shenzhen" market, **When** the filter changes, **Then** frontend sends market_code=SZ parameter to backend API
3. **Given** users select "All Markets", **When** the filter changes, **Then** frontend omits market_code parameter from API request
4. **Given** backend returns only SH market data, **When** users view results, **Then** they see all SH instruments (not subset limited by previous client-side approach)

---

### User Story 2 - Display Loading State During Long Queries (Priority: P1)

System shows a loading animation while waiting for backend response, especially during long queries that may take several minutes.

**Why this priority**: Without visual feedback, users don't know if the system is working or frozen during long data loads.

**Independent Test**: Users can see a loading indicator while the query is in progress, confirming the system is working.

**Acceptance Scenarios**:

1. **Given** users change market filter, **When** API request is sent, **Then** a loading spinner appears over the table
2. **Given** query takes 30 seconds to complete, **When** users wait, **Then** loading animation continues to display throughout
3. **Given** query takes 5 minutes to complete, **When** users wait, **Then** loading animation persists and doesn't disappear prematurely
4. **Given** API response is received, **When** data is ready, **Then** loading animation disappears and table shows results

---

### User Story 3 - Handle Extended Request Timeouts (Priority: P1)

Frontend supports waiting up to 10 minutes for API responses to accommodate large dataset queries with script calculations.

**Why this priority**: Backend now supports 10-minute queries - frontend must wait appropriately without timing out prematurely.

**Independent Test**: Frontend can successfully receive and display data from queries that take 5-8 minutes to complete.

**Acceptance Scenarios**:

1. **Given** query will take 8 minutes, **When** frontend waits, **Then** it doesn't timeout before receiving response
2. **Given** loading state is active for 5 minutes, **When** users view the screen, **Then** they see continuous feedback that system is working
3. **Given** API returns data after 7 minutes, **When** data arrives, **Then** frontend successfully renders the table
4. **Given** network connection is stable, **When** long query completes, **Then** all data is received and displayed correctly

---

### User Story 4 - Remove Limit Parameter from Queries (Priority: P2)

Frontend stops sending limit parameter to backend, allowing backend to return all matching data.

**Why this priority**: Removing artificial limits ensures users can access all available data matching their filters.

**Independent Test**: API requests do not include limit parameter, and backend returns complete datasets.

**Acceptance Scenarios**:

1. **Given** users query stock list, **When** frontend sends API request, **Then** no limit parameter is included
2. **Given** backend returns 1000+ records, **When** data arrives, **Then** frontend can display all records
3. **Given** users have multiple filters active, **When** query executes, **Then** all matching data is returned without truncation

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST send market_code parameter to backend API when market filter is selected
- **FR-002**: System MUST remove client-side market filtering logic
- **FR-003**: System MUST trigger new API request when market filter selection changes
- **FR-004**: System MUST display loading animation while API request is in progress
- **FR-005**: System MUST hide loading animation when API response is received
- **FR-006**: System MUST configure HTTP client timeout to 10 minutes (600 seconds)
- **FR-007**: System MUST remove limit parameter from API requests
- **FR-008**: System MUST handle large result sets (1000+ records) in table rendering
- **FR-009**: System MUST show appropriate loading animation for both quick (<1s) and slow (minutes) queries
- **FR-010**: System MUST preserve ETF filter and search functionality alongside market filter changes

### Key Entities *(include if feature involves data)*

- **Backend Market Filter**: API parameter (market_code) sent with query to filter results on server
- **Loading State**: UI state indicating API request is in progress
- **Extended Timeout**: HTTP client configuration allowing 10-minute request duration
- **Full Dataset**: Complete query results without pagination limits

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Market filter selection triggers backend API call with correct market_code parameter
- **SC-002**: Users can switch between markets and see correct data for each market (no empty results)
- **SC-003**: Loading animation displays within 100ms of filter change
- **SC-004**: Loading animation persists for the entire duration of API request (tested with 5+ minute queries)
- **SC-005**: Frontend successfully receives and renders responses from queries taking 5-8 minutes
- **SC-006**: All instruments matching filters are displayed (no limit-based truncation)
- **SC-007**: Table can render and display 1000+ records without performance issues
- **SC-008**: Users receive visual feedback during long queries (loading state doesn't freeze or disappear)

