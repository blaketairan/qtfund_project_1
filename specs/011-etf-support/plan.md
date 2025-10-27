# Implementation Plan: ETF Support in Frontend Dashboard

**Branch**: `011-etf-support` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Add ETF filtering functionality to dashboard

## Summary

Add ETF filtering capability to the stock dashboard allowing users to filter instruments by type (ETFs, Stocks, or All). The filter sends `is_etf` parameter to backend API and displays visual indicators for ETF rows in the table. The filter works in combination with existing market and search filters.

## Technical Context

**Language/Version**: JavaScript ES6+, React 18+, JSX  
**Primary Dependencies**: React, react-router-dom  
**Storage**: localStorage (optional filter persistence), Backend API (stock data with ETF filtering)  
**Testing**: Manual testing, visual verification  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Frontend enhancement (React SPA)  
**Performance Goals**: Filter updates table within 2 seconds  
**Constraints**: Must work with existing search and market filters  
**Scale/Scope**: Add 1 new component (ETFFilter), modify 2-3 components (DashboardPage, StockTable, StockService)

## Constitution Check

**Status**: ✅ PASSED

### Checks Applied

1. **File Structure Compliance**: ✅
   - Uses existing structure: `src/components/dashboard/`
   - Follows pattern of existing MarketFilter component
   - No new major structural changes

2. **No Comments Policy**: ✅
   - All code will be self-documenting
   - Descriptive component names: `ETFFilter`
   - No TODO markers or inline comments

3. **Technology Stack Compliance**: ✅
   - Uses existing React patterns
   - No new dependencies
   - Consistent with current codebase

4. **JSX Validation**: ✅
   - Proper component composition
   - All tags properly closed
   - Follows existing patterns

### Gates Passed

- **Gate 1 (Structure)**: Using existing structure ✅
- **Gate 2 (Technology)**: Existing React stack ✅
- **Gate 3 (No Comments)**: Self-documenting code ✅
- **Gate 4 (Component Size)**: Focused changes only ✅

## Project Structure

### Documentation (this feature)

```text
specs/011-etf-support/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── components/
│   └── dashboard/
│       ├── ETFFilter.jsx         # NEW: ETF filter component
│       └── StockTable.jsx        # MODIFY: Add ETF badge/indicator
├── services/
│   └── stockService.js           # MODIFY: Add is_etf parameter
└── pages/
    └── DashboardPage.jsx         # MODIFY: Add ETF filter state and integration
```

**Structure Decision**: Follow existing filter pattern (like MarketFilter). Create new ETFFilter component, modify services to pass parameter, update table to show ETF indicators.

## Complexity Tracking

> No constitution violations detected - using existing React patterns and component structure.
