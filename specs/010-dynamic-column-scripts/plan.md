# Implementation Plan: Dynamic Script Columns in List Query

**Branch**: `010-dynamic-column-scripts` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Redesign script workflow to calculate scripts during list query, not on upload

## Summary

Redesign the script workflow to calculate scripts during the stock list query rather than on upload. Users can save scripts for later use, select which scripts to display as columns, and see calculated results only for stocks in the current query result set. This improves efficiency by calculating only what's needed for the current view, not all stocks at once.

## Technical Context

**Language/Version**: JavaScript ES6+, React 18+, JSX  
**Primary Dependencies**: React, react-router-dom, Backend API integration  
**Storage**: localStorage (script selections, column preferences), Backend API (script CRUD, stock list with calculations)  
**Testing**: Manual testing, API integration testing  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Frontend application enhancement (React SPA)  
**Performance Goals**: Script calculations complete within query time (<3 seconds), smooth table updates  
**Constraints**: Must work with existing backend list API, must support filter/limit parameters  
**Scale/Scope**: Modify 2-3 components (ScriptManager, StockTable), update API integration, state management changes

## Constitution Check

**Status**: ✅ PASSED

### Checks Applied

1. **File Structure Compliance**: ✅
   - Uses existing structure: `src/components/dashboard/`, `src/services/`
   - Existing ScriptEditor and ScriptManager components
   - No new major structural changes

2. **No Comments Policy**: ✅
   - All code will be self-documenting
   - Descriptive naming for script selection state
   - No TODO markers or inline comments

3. **Technology Stack Compliance**: ✅
   - Uses existing React patterns and services
   - Backend API integration
   - localStorage for persistence
   - No new major dependencies

4. **JSX Validation**: ✅
   - Proper component composition
   - All tags properly closed
   - State management follows existing patterns

### Gates Passed

- **Gate 1 (Structure)**: Using existing structure ✅
- **Gate 2 (Technology)**: Existing React stack ✅
- **Gate 3 (No Comments)**: Self-documenting code ✅
- **Gate 4 (Component Size)**: Focused changes to existing components ✅

## Project Structure

### Documentation (this feature)

```text
specs/010-dynamic-column-scripts/
├── spec.md              # Feature specification
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── script-columns-api-contracts.json
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── dashboard/
│       ├── ScriptManager.jsx    # MODIFY: Add script selection UI
│       └── StockTable.jsx       # MODIFY: Handle dynamic script columns
├── services/
│   ├── stockService.js         # MODIFY: Pass script IDs to list API
│   └── scriptStorageService.js # REFERENCE: Script CRUD operations
└── context/
    └── DashboardContext.jsx    # MODIFY: Manage selected script IDs state
```

**Structure Decision**: Frontend-only modifications. Update existing components to support script selection and dynamic column display. Script calculations happen on backend during list query. Use localStorage to persist selected script IDs.

## Complexity Tracking

> No constitution violations detected - using existing React patterns, state management, and API services.

