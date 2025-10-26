# Tasks: Fix Script Column Name Display

**Feature**: 011-fix-script-column  
**Date**: 2025-01-27  
**Status**: Ready for Implementation

## Overview

Fix the bug where dynamic script column headers show "Custom" instead of the actual script name when script results are null or missing. This bug fix ensures users can properly identify script-based columns in the stock table.

**Total Tasks**: 6  
**Completed**: 0 (0%)  
**MVP Scope**: Single user story (US1)  
**Estimated Time**: 30 minutes

## Dependency Graph

```
Setup (Load Script Library)
  ↓
US1 - Fix Column Name Display
  ↓
Testing & Validation
```

## Task List

### Phase 1: Setup - Load Script Library

**Goal**: Add script library state management in DashboardPage to provide script data to child components.

- [X] T001 Add scriptLibrary state in DashboardPage.jsx
- [X] T002 Load script library on component mount in DashboardPage.jsx
- [X] T003 Pass scriptLibrary prop to StockTable in DashboardPage.jsx

### Phase 2: User Story 1 - Fix Column Name Display [US1]

**Goal**: Users see proper script column names in table headers even when script results are null.

**Independent Test**: Select a script that returns null for some stocks. Verify the column header shows the script name (not "Custom").

- [X] T004 [US1] Update StockTable to accept scriptLibrary prop in StockTable.jsx
- [X] T005 [US1] Modify getScriptColumns to lookup names from library in StockTable.jsx
- [X] T006 [US1] Test column header displays correct script name when results are null

## Implementation Strategy

### MVP Scope

Single user story (US1) - fix the column name display bug.

### Suggested Order

1. **Phase 1**: Add script library loading in DashboardPage
2. **Phase 2**: Update StockTable to use library data for names
3. **Testing**: Verify column names display correctly

### Independent Test Criteria

**US1 Test**: Select a script that returns null for some stocks, query stock list, verify column header shows script name instead of "Custom".

### Success Metrics

- All script column headers display the correct script name
- Null script results display as "--" without breaking layout
- Multiple scripts each have distinct, identifiable names
- Column name changes reflect immediately when scripts selected/deselected

## Notes

This is a simple bug fix involving adding state management and modifying column extraction logic. The fix ensures script names are always available for column headers regardless of result data.

