# Research: Fix Script Column Name Display

**Feature**: 011-fix-script-column  
**Date**: 2025-01-27  
**Purpose**: Technical decisions for fixing script column name display bug

## Bug Analysis

### Problem

When `script_results` contains null values (e.g., `{2: null}`), the column name extraction fails:

```javascript
// Current problematic code in StockTable.jsx
const getScriptColumns = () => {
  const firstStock = sortedStocks[0];
  if (!firstStock?.script_results) return [];
  
  return Object.keys(firstStock.script_results).map(scriptId => ({
    scriptId,
    columnName: firstStock.script_results[scriptId]?.column_name || 'Custom'
  }));
};
```

**Issue**: When `script_results[scriptId]` is `null`, trying to access `?.column_name` returns `undefined`, so it falls back to `'Custom'`.

### Decision: Fetch Script Names from Script Manager

**What was chosen**: Pass the script library data from ScriptManager to StockTable as props, so it can look up script names even when results are null.

**Rationale**:
- Script library already contains all script information (id, name, description)
- No additional API calls needed
- Clean separation: ScriptManager manages script data, StockTable displays it
- Follows React data flow patterns

**Alternatives considered**:
- **Backend fix**: Have backend always return column_name even for null results
  - Rejected: Backend may legitimately not have column_name for failed executions
- **Extract from first non-null result**: Keep current logic but scan all stocks
  - Rejected: Inefficient and still fails if all results are null
- **Store in state**: Duplicate script data in StockTable state
  - Rejected: Violates DRY principle, ScriptManager already has this data

---

## Data Flow Changes

### Current Flow (Broken)

```
User selects script ID 2
    ↓
StockTable queries with script_ids=2
    ↓
Backend returns stocks with script_results: {2: null}
    ↓
StockTable tries to extract column name from null
    ↓
Fails, shows "Custom"
```

### New Flow (Fixed)

```
User selects script ID 2
    ↓
ScriptManager loads scripts library
    ↓
ScriptManager passes scripts data to StockTable
    ↓
StockTable queries with script_ids=2
    ↓
Backend returns stocks with script_results: {2: null}
    ↓
StockTable looks up script name by ID from library
    ↓
Shows correct script name in header
```

---

## Implementation Strategy

### Component Communication

**Props to Add**:
- `StockTable`: Add `scriptLibrary` prop (array of script objects)
- Pass script library from DashboardPage via ScriptManager load

**Data Structure**:
```javascript
scriptLibrary = [
  {id: 2, name: "Momentum", description: "...", code: "..."},
  {id: 3, name: "Price/Volume", description: "...", code: "..."}
]
```

### Code Changes

**StockTable.jsx**:
```javascript
const StockTable = ({ visibleColumns, selectedScriptIds = [], scriptLibrary = [] }) => {
  const getScriptColumns = () => {
    if (!selectedScriptIds || selectedScriptIds.length === 0) return [];
    
    return selectedScriptIds.map(scriptId => {
      const script = scriptLibrary.find(s => s.id === scriptId);
      return {
        scriptId,
        columnName: script?.name || script?.description || `Script ${scriptId}`
      };
    });
  };
};
```

**DashboardPage.jsx**:
- Load script library in useEffect
- Store in state
- Pass to both ScriptManager and StockTable

---

## Summary

- **Root Cause**: Column name extraction depends on script_results data that may be null
- **Solution**: Fetch script names from script library instead of API response
- **Changes**: Minimal - add props and modify column extraction logic
- **Risk**: Low - bug fix, no new functionality

No additional research needed - straightforward bug fix with clear solution.

