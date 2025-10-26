# Research: Stock Dashboard Frontend

**Feature**: 004-stock-dashboard  
**Date**: 2025-01-27  
**Status**: Complete

## Overview

Research conducted to resolve NEEDS CLARIFICATION items and validate technical decisions for the Stock Dashboard frontend implementation.

## Decisions Made

### Decision 1: Backend API Integration

**Chosen**: Direct backend API calls to qtfund_project_3 (port 8000)

**Rationale**: 
- Backend already provides comprehensive stock data via REST API
- Supports all required operations (query, list, filter by market)
- Real-time data access without local data storage needed
- Consistent with existing architecture pattern (dashboard fetches from API)

**Alternatives Considered**:
- Local JSON data files: Rejected - requires periodic sync, stale data risk
- Caching strategy: Accepted as NFR but not primary data source
- WebSocket updates: Deferred - polling is sufficient for MVP

### Decision 2: State Management

**Chosen**: React Context API for dashboard state

**Rationale**:
- Dashboard state is component-local (no global app state needed)
- Context API sufficient for column configurations and filter state
- Avoids Redux complexity for moderate state management
- Consistent with existing auth context pattern

**Alternatives Considered**:
- Redux: Rejected - overkill for dashboard-scoped state
- localStorage only: Rejected - need reactive updates, localStorage is for persistence
- Local state only: Rejected - column configs shared across multiple components

### Decision 3: Table Component

**Chosen**: HeadlessUI Table components with custom implementation

**Rationale**:
- HeadlessUI provides base components (follows constitution)
- Custom table implementation needed for sortable columns
- React performance with React.memo for large datasets
- Virtual scrolling not needed (<500 stocks typical)

**Alternatives Considered**:
- react-table: Rejected - external dependency not on approved list
- Ant Design Table: Rejected - not @headlessui/react
- Virtual scrolling: Rejected - 200 stocks manageable without

### Decision 4: Column Persistence

**Chosen**: localStorage with React Context synchronization

**Rationale**:
- localStorage provides cross-session persistence
- Context provides reactive updates during session
- No backend storage needed (user-specific, no sync required)
- Simple implementation, constitution compliant

**Alternatives Considered**:
- Backend storage: Rejected - adds complexity, backend doesn't support user-specific configs
- SessionStorage: Rejected - users expect preferences to persist across sessions
- Cookies: Rejected - localStorage sufficient, no server-side reading needed

### Decision 5: Python Script Integration

**Chosen**: Backend execution via API endpoint

**Rationale**:
- Users write Python scripts (natural for backend)
- Backend sandboxes execution for security
- Frontend only handles script editing and result display
- No client-side Python execution complexity

**Alternatives Considered**:
- Browser JavaScript: Rejected - chosen Python in clarifications
- WebAssembly: Rejected - excessive for calculation-only use case
- Serverless functions: Not available in current architecture

### Decision 6: Market Filtering

**Chosen**: Multi-select filter for SH/SZ/BJ markets

**Rationale**:
- All three markets supported from backend database
- User-selectable (can filter by any combination)
- Backend API supports filtering by market_code parameter
- UI uses checkbox group from HeadlessUI

**Alternatives Considered**:
- Single market only: Rejected - requirements specify all three markets
- Dropdown: Chosen over radio buttons for multi-select capability
- Separate tabs: Rejected - single table with filters is simpler

## Technology Choices

### Packages Used (All Installed)

- **React**: Core framework
- **@headlessui/react**: UI components (Table, Checkbox, Input)
- **lucide-react**: Icons (Search, Filter, Table icons)
- **react-router-dom**: Routing (already in use)
- **moment**: Date formatting for indicators
- **localStorage API**: Persistence (native browser API)

### No New Dependencies Required

All functionality achievable with existing installed packages. No package.json changes needed.

## Performance Considerations

**Table Rendering**:
- React.memo for table rows to prevent unnecessary re-renders
- Debounced search (300ms) to reduce filtering computations
- Pagination deferred - inline rendering for <500 stocks sufficient

**API Calls**:
- Single bulk fetch at page load (no per-stock requests)
- Polling interval 30s for data freshness
- Timeout handling with user-friendly error messages

**Memory**:
- Cache calculation results in component state
- Cleanup on unmount to prevent memory leaks

## Security Considerations

- All user Python scripts executed on backend (sandboxed)
- Frontend only sends scripts to backend, no direct execution
- No XSS risk - HeadlessUI components handle escaping
- localStorage data validated before restoring

## Integration Points

**Backend API (qtfund_project_3, port 8000)**:
- `GET /api/stock-price/list` - Fetch stock list
- `GET /api/stock-price/info/{symbol}` - Stock details
- `GET /api/stock-price/query` - Historical data
- `POST /api/custom-calculations/execute` - Execute Python scripts (NEW - to be implemented in backend)

**Frontend Services**:
- `stockService.js` - Handles stock data fetching and caching
- `calculationService.js` - Client-side quantitative calculations
- `scriptService.js` - Python script submission and result retrieval

## Research Status

All clarifications resolved. Technical context complete. Ready for Phase 1 design.

