# Implementation Plan: Frontend Fix for Stock Dashboard API Response

**Branch**: `007-fix-decision` | **Date**: 2025-01-27 | **Spec**: [007-fix-decision/spec.md](spec.md)  
**Input**: Fix decision analysis from `/specs/007-fix-decision/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Fix the Stock Dashboard data loading issue by updating frontend to handle actual backend response format (`response.data` array) instead of documented structure (`response.data.items`). This aligns with project constitution Principle VI that prioritizes actual backend responses over documented structure.

## Technical Context

**Language/Version**: JavaScript (ES6+), React  
**Primary Dependencies**: React, React Router, existing dashboard components  
**Storage**: No storage changes required  
**Testing**: Manual verification in browser  
**Target Platform**: Web application (browser-based)  
**Project Type**: Web application  
**Performance Goals**: Fix must not impact performance (negligible response time for array check)  
**Constraints**: Must handle both current format (`data` array) and potential future format (`data.items` array), must not break existing functionality  
**Scale/Scope**: Single component file change (`StockTable.jsx`), affects only dashboard data display

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ File structure: Modifying existing component file in `src/components/dashboard/`
- ✅ No comments policy: Code changes will be self-explanatory
- ✅ Technology stack: No new dependencies, using existing React/JS
- ✅ Code clarity: Validation logic will be clear and descriptive
- ✅ API Contract Validation (Principle VI): Fix aligns with "actual backend responses take precedence over documented structure"

No violations detected. Fix directly follows Principle VI guidance.

## Project Structure

### Documentation (this feature)

```text
specs/007-fix-decision/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── contracts/           # Phase 1 output (/speckit.plan command)
```

### Source Code (repository root)

```text
src/
└── components/
    └── dashboard/
        └── StockTable.jsx  # Update to handle actual response format
```

**Structure Decision**: Single file modification in existing component structure. No new files or architecture changes needed.

## Implementation Approach

### Phase 1: Update Response Handling Logic

Update `src/components/dashboard/StockTable.jsx` loadStocks function to:

1. Remove hardcoded assumption of `response.data.items`
2. Handle `response.data` as array (actual backend format)
3. Add fallback for `response.data.items` (future compatibility)
4. Improve error messages for debugging

### Key Implementation Details

**Current Code (Line 22)**:
```javascript
if (response.code === 200 && response.data.items) {
  dispatch({ type: 'SET_STOCKS', payload: response.data.items });
}
```

**Updated Code**:
```javascript
if (response.code === 200 && response.data) {
  const items = Array.isArray(response.data) 
    ? response.data 
    : response.data.items;
  
  if (items && items.length > 0) {
    dispatch({ type: 'SET_STOCKS', payload: items });
    dispatch({ type: 'SET_FILTERED_STOCKS', payload: items });
  } else {
    setError('No stock data available');
  }
}
```

### Phase 2: Testing & Validation

1. Build application with changes
2. Test in browser: Navigate to `/dashboard`
3. Verify: Dashboard displays stock data without errors
4. Verify: No console errors
5. Check network tab: API response is processed correctly

## Dependencies

- No external dependencies required
- No new npm packages needed
- Existing services and context unchanged
- No database changes

## Success Criteria Validation

- **SC-001**: ✅ Dashboard displays stock data
- **SC-002**: ✅ No "Failed to load stock data" errors
- **SC-003**: ✅ All API calls successfully parse responses
- **SC-004**: ✅ Response format handling code is clear
- **SC-005**: ✅ Fix aligns with Principle VI

## Risk Assessment

**Low Risk Factors**:
- Single file change
- Isolated to data loading logic
- Backward compatible with potential future format
- No breaking changes to other components

**Mitigation**:
- Test in development before deploying
- Verify API call succeeds first
- Check browser console for errors

## Next Steps

1. Generate research.md with response handling patterns
2. Create data-model.md for response structure
3. Generate quickstart.md for testing guide
4. Proceed to tasks generation with `/speckit.tasks`
