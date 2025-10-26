# Implementation Plan: Stock Dashboard Frontend

**Branch**: `004-stock-dashboard` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification for Stock/ETF Quantitative Analysis Dashboard with Python backend execution

## Summary

Implement a React-based quantitative analysis dashboard for stock/ETF data with sortable tables, customizable columns, quantitative indicators (momentum, moving averages), search and filtering, and custom Python script execution via backend API (qtfund_project_3 on port 8000). The dashboard supports all three markets (Shanghai/Shenzhen/Beijing) with real-time data fetching and persistent column configuration.

## Technical Context

**Language/Version**: JavaScript ES6+, React 18+, JSX
**Primary Dependencies**: React, @headlessui/react, lucide-react, react-router-dom, moment, recharts
**Storage**: localStorage (column configurations), Backend API (stock data, Python script execution, saved scripts CRUD)
**Testing**: Manual testing, build verification via webpack
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Frontend web application (React SPA)
**Performance Goals**: Table rendering <500ms for 200 stocks, sorting <100ms, API timeouts 5s max
**Constraints**: Build size <5MB, support 200+ stocks with smooth scrolling, real-time data updates every 30s
**Scale/Scope**: ~10 components, 1 new page, 3-5 services, localStorage only, no backend server required for frontend

## Constitution Check

**Status**: ✅ PASSED

### Checks Applied

1. **File Structure Compliance**: ✅
   - Uses existing structure: `src/pages/`, `src/components/`, `src/services/`
   - New dashboard page follows layout pattern
   - Components organized by feature (table, filters, indicators)

2. **No Comments Policy**: ✅
   - All code will be self-documenting
   - Descriptive naming: `StockTable`, `ColumnConfig`, `MarketFilter`
   - No TODO markers or inline comments

3. **Technology Stack Compliance**: ✅
   - Uses @headlessui/react for UI components
   - Uses lucide-react for icons
   - No new dependencies required
   - Avoids try/catch unless necessary

4. **JSX Validation**: ✅
   - Proper component composition
   - All tags properly closed
   - Nested structure validated

### Gates Passed

- **Gate 1 (Structure)**: Using existing `src/` structure ✅
- **Gate 2 (Technology)**: HeadlessUI + Lucide only ✅
- **Gate 3 (No Comments)**: Self-documenting code ✅
- **Gate 4 (Component Size)**: Dashboard broken into sub-components ✅

## Project Structure

### Documentation (this feature)

```text
specs/004-stock-dashboard/
├── spec.md              # Feature specification
├── plan.md            # This file (/speckit.plan command output)
├── research.md        # Phase 0 output (/speckit.plan command)
├── data-model.md      # Phase 1 output (/speckit.plan command)
├── quickstart.md      # Phase 1 output (/speckit.plan command)
├── contracts/         # Phase 1 output (/speckit.plan command)
│   └── api-contracts.json
└── tasks.md           # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── pages/
│   └── DashboardPage.jsx         # NEW: Stock dashboard main page
├── components/
│   └── dashboard/                # NEW: Dashboard-specific components
│       ├── StockTable.jsx        # Interactive data table
│       ├── ColumnSettings.jsx    # Column visibility toggle
│       ├── MarketFilter.jsx      # Market selection (SH/SZ/BJ)
│       ├── SearchBar.jsx         # Stock search by name/symbol
│       ├── ScriptEditor.jsx      # Python script editor
│       ├── ScriptManager.jsx    # Script CRUD management (NEW)
│       └── IndicatorDisplay.jsx  # Quantitative indicators display
├── services/
│   ├── stockService.js           # NEW: Stock data API client
│   ├── calculationService.js     # NEW: Quantitative calculations
│   ├── scriptService.js          # NEW: Python script execution API
│   └── scriptStorageService.js   # NEW: Script CRUD management API
├── context/
│   └── DashboardContext.jsx     # NEW: Dashboard state management
├── entities/
│   └── stock.json                # NEW: Stock data schema
└── utils/
    ├── constants.js              # Extended with dashboard URLs
    └── numberFormat.js           # NEW: Number/percentage formatters
```

**Structure Decision**: Frontend-only React SPA. Dashboard components organized under `src/components/dashboard/`. State managed via React Context. Data fetched from backend API (qtfund_project_3, port 8000). Uses localStorage for column configurations, backend API for script CRUD operations.

## Complexity Tracking

> No constitution violations detected - using standard React patterns, HeadlessUI components, and existing project structure.
