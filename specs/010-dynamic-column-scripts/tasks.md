# Tasks: Dynamic Script Columns in List Query

**Feature**: 010-dynamic-column-scripts  
**Date**: 2025-01-27  
**Status**: Ready for Implementation

## Overview

Redesign script workflow to calculate scripts during stock list queries rather than on upload. Users can save scripts for later use, select which scripts to display as columns, and see calculated results only for stocks in the current query result set. This improves efficiency by calculating only what's needed for the current view, not all stocks at once.

**Total Tasks**: 12  
**Completed**: 0 (0%)  
**MVP Scope**: All 3 user stories (US1-US3) are required together  
**Estimated Time**: 1-2 days

## Dependency Graph

```
Foundational (State Management)
  ↓
US1 - Save Scripts Without Execution (Phase 1)
  ↓
US2 - Script Selection UI (Phase 2) [Depends on US1]
  ↓
US3 - Dynamic Column Display (Phase 3) [Depends on US1, US2]
  ↓
Integration & Testing (Phase 4)
```

## Parallel Execution Opportunities

- **Phase 2**: Script selection checkbox UI and localStorage persistence can be implemented together
- **Phase 3**: StockService update and StockTable rendering can be done in parallel
- **Phase 4**: Testing independent features can be done in parallel

## Task List

### Phase 1: Foundational - State Management Setup

**Goal**: Add infrastructure for tracking selected script IDs and persisting selections.

- [ ] T001 Add selectedScriptIds state management in DashboardPage.jsx
- [ ] T002 Load selected script IDs from localStorage on mount in DashboardPage.jsx
- [ ] T003 Save selected script IDs to localStorage on change in DashboardPage.jsx

### Phase 2: User Story 1 - Save Scripts Without Execution [US1]

**Goal**: Users can create and save calculation scripts without immediately executing them on all stocks.

**Independent Test**: Users can create a script, save it, and see it in their script library without triggering expensive calculations.

- [ ] T004 [US1] Remove immediate script execution on save in ScriptEditor.jsx
- [ ] T005 [US1] Verify script save only stores script data without calling execute API
- [ ] T006 [US1] Test that saved scripts appear in ScriptManager without triggering calculations

### Phase 3: User Story 2 - Select Scripts for Column Display [US2]

**Goal**: Users can select which saved scripts should be applied as columns when viewing the stock list.

**Independent Test**: Users can view their saved scripts, check/uncheck which ones to apply, and see those columns appear/disappear in the stock table.

- [ ] T007 [P] [US2] Add checkbox UI for script selection in ScriptManager.jsx
- [ ] T008 [P] [US2] Wire checkbox changes to selectedScriptIds state in DashboardPage.jsx
- [ ] T009 [US2] Persist script selection changes to localStorage immediately
- [ ] T010 [US2] Display visual indication of selected vs unselected scripts in ScriptManager.jsx

### Phase 4: User Story 3 - View Script Results as Columns [US3]

**Goal**: Users can see calculated script results as additional columns in the stock table returned from the list query.

**Independent Test**: Users select a script to display, query the stock list (e.g., first 100 stocks), and see calculated results for only those stocks as a new column.

- [ ] T011 [P] [US3] Modify fetchStockList to accept script_ids parameter in stockService.js
- [ ] T012 [P] [US3] Add script_ids to query parameters when building API request in stockService.js
- [ ] T013 [US3] Extract script_results from API response in StockTable.jsx
- [ ] T014 [US3] Render dynamic script columns based on script_results in StockTable.jsx
- [ ] T015 [US3] Display "--" for missing or error script results in StockTable.jsx
- [ ] T016 [US3] Pass selectedScriptIds to StockTable component in DashboardPage.jsx
- [ ] T017 [US3] Update loadStocks to include selectedScriptIds in StockTable.jsx

### Phase 5: Integration & Testing

**Goal**: Verify complete workflow and handle edge cases.

- [ ] T018 Test complete workflow: save script → select → query → display results
- [ ] T019 Test multiple script columns display simultaneously
- [ ] T020 Test script selection persists across page refresh
- [ ] T021 Test that scripts calculate only for stocks in query result (limit/filter respected)
- [ ] T022 Test error handling when script fails for individual stocks

## Implementation Strategy

### MVP Scope

All three user stories (US1, US2, US3) are required together to complete the feature:
- US1: Remove immediate execution (prerequisite)
- US2: Add selection UI (required for user interaction)
- US3: Display results (core value delivery)

### Suggested Order

1. **Phase 1**: Set up state management for selected scripts
2. **Phase 2**: Remove immediate execution (US1)
3. **Phase 3**: Add selection UI (US2)
4. **Phase 4**: Display dynamic columns (US3)
5. **Phase 5**: Integration testing

### Independent Test Criteria

**US1 Test**: Create a new script, click "Save" without clicking "Execute". Verify script appears in ScriptManager. Check browser network tab to confirm no execute API call was made.

**US2 Test**: Open ScriptManager, see list of saved scripts. Check one script checkbox. Verify checkbox stays checked. Refresh page, verify selection persists.

**US3 Test**: Select a script, query stock list with limit=100. Verify script column appears in table with calculated values for those 100 stocks only.

### Success Metrics

- Users can save scripts without triggering calculation
- Selected scripts persist across browser sessions
- Script columns appear in table for selected scripts
- Script calculations happen only for stocks in query result
- Multiple script columns display simultaneously
- Script execution errors don't break table (show "--")

## Notes

This feature modifies the workflow from "upload → calculate all" to "save → select → calculate visible". The backend API must support the `script_ids` query parameter and calculate scripts during list query, not on upload.

