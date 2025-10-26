# Quick Start: Fix Script Column Name Display

**Feature**: 011-fix-script-column  
**Branch**: `011-fix-script-column`  
**Date**: 2025-01-27

## Overview

Bug fix: When script results are null in the API response, column headers show "Custom" instead of the actual script name. The fix involves fetching script names from the script library data instead of extracting them from the nullable script_results.

## The Bug

### Current Behavior

1. User selects script ID 2 ("Momentum")
2. Backend returns `script_results: {2: null}`
3. StockTable tries to extract column name from null
4. Gets undefined, falls back to "Custom"
5. User sees "Custom" header ❌

### Root Cause

```javascript
// Current buggy code in StockTable.jsx
const getScriptColumns = () => {
  const firstStock = sortedStocks[0];
  return Object.keys(firstStock.script_results).map(scriptId => ({
    scriptId,
    columnName: firstStock.script_results[scriptId]?.column_name || 'Custom'
    // ↑ This fails when script_results[scriptId] is null
  }));
};
```

## The Fix

### New Behavior

1. User selects script ID 2 ("Momentum")
2. ScriptManager loads library: `[{id: 2, name: "Momentum"}]`
3. DashboardPage stores library in state
4. StockTable receives library as prop
5. StockTable looks up script ID 2 in library
6. Finds "Momentum", uses as column header
7. User sees "Momentum" header ✅

### Code Changes

**1. DashboardPage.jsx** - Add script library state and loading:

```javascript
const [scriptLibrary, setScriptLibrary] = useState([]);

useEffect(() => {
  const loadScriptLibrary = async () => {
    const response = await getScripts();
    if (response.code === 200 && response.data) {
      const scripts = Array.isArray(response.data) ? response.data : [];
      setScriptLibrary(scripts);
    }
  };
  loadScriptLibrary();
}, []);

// Pass to StockTable
<StockTable 
  visibleColumns={visibleColumns}
  selectedScriptIds={selectedScriptIds}
  scriptLibrary={scriptLibrary}
/>
```

**2. StockTable.jsx** - Modify column extraction:

```javascript
const StockTable = ({ visibleColumns, selectedScriptIds = [], scriptLibrary = [] }) => {
  const getScriptColumns = () => {
    if (!selectedScriptIds || selectedScriptIds.length === 0) return [];
    
    return selectedScriptIds.map(scriptId => {
      const script = scriptLibrary.find(s => s.id == scriptId);
      return {
        scriptId,
        columnName: script?.name || script?.description || `Script ${scriptId}`
      };
    });
  };
  
  // ... rest of component
};
```

## Testing

### Test Case 1: Single Script with Null Results

1. Select a script that returns null for some stocks
2. Query stock list
3. **Expected**: Column header shows script name (not "Custom")
4. Cells with null results show "--"

### Test Case 2: Multiple Scripts

1. Select multiple scripts
2. Query stock list
3. **Expected**: Each column header shows respective script name
4. Some results may be null, headers still correct

### Test Case 3: Script Without Name

1. Create script with only description, no name
2. Select and query
3. **Expected**: Column header shows description or "Script ID"

### Test Case 4: Mixed Results

1. Select script where some stocks return results, others return null
2. Query stock list
3. **Expected**: 
   - Column header shows script name consistently
   - Cells with results show values
   - Cells with null show "--"

## Files to Modify

- `src/pages/DashboardPage.jsx` - Add script library state management
- `src/components/dashboard/StockTable.jsx` - Update column name extraction logic

## Expected Impact

- **User Experience**: Better - see actual script names instead of "Custom"
- **Performance**: No change
- **Data Flow**: ScriptManager → DashboardPage → StockTable
- **Breaking Changes**: None

## Related Files

- **Spec**: [spec.md](./spec.md)
- **Plan**: [plan.md](./plan.md)
- **Research**: [research.md](./research.md)
- **Data Model**: [data-model.md](./data-model.md)

