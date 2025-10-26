# Implementation Plan: Fix Script Column Name Display

**Branch**: `011-fix-script-column` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Fix bug where script column names don't display correctly when script results are null

## Summary

Fix the bug where dynamic script column headers show "Custom" instead of the actual script name when script results are null or missing. The issue occurs because the column name extraction logic in StockTable.jsx relies on script_results data that may be null for some stocks. We need to fetch script names from the script library instead of extracting them from the API response.

## Technical Context

**Language/Version**: JavaScript ES6+, React 18+, JSX  
**Primary Dependencies**: React, react-router-dom  
**Storage**: localStorage (selected scripts), In-memory (script library data)  
**Testing**: Manual testing, visual verification  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Frontend bug fix (React SPA)  
**Performance Goals**: No performance impact, same rendering speed  
**Constraints**: Must work with existing 010-dynamic-column-scripts feature  
**Scale/Scope**: Modify 2 components (ScriptManager, StockTable), add helper function

## Constitution Check

**Status**: ✅ PASSED

### Checks Applied

1. **File Structure Compliance**: ✅
   - Uses existing structure: `src/components/dashboard/`
   - No new files needed, only modifications
   - Follows existing component patterns

2. **No Comments Policy**: ✅
   - All code will be self-documenting
   - Descriptive function names
   - No inline comments or TODOs

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
- **Gate 4 (Component Size)**: Minor modifications only ✅

## Project Structure

### Documentation (this feature)

```text
specs/011-fix-script-column/
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
│       ├── ScriptManager.jsx    # MODIFY: Expose script list data
│       └── StockTable.jsx       # MODIFY: Get script names from library
```

**Structure Decision**: Frontend-only bug fix. No backend changes needed. Update StockTable to fetch script names from component props instead of API response.

## Complexity Tracking

> No constitution violations detected - using existing React patterns and component structure.
