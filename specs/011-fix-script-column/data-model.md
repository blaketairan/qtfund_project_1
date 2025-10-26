# Data Model: Fix Script Column Name Display

**Feature**: 011-fix-script-column  
**Date**: 2025-01-27  
**Purpose**: Define data structures for script column name lookup

## Entities

### Script Library Data

**Source**: Backend API (from ScriptManager component load)  
**Entity Name**: `ScriptLibraryItem`  
**Purpose**: Stores script configuration data for name lookup

#### Fields

| Field Name | Type | Required | Description | Used For |
|-----------|------|----------|-------------|----------|
| `id` | Number | Yes | Script ID | Column lookup key |
| `name` | String | Yes | Script display name | Column header |
| `description` | String | No | Script description | Fallback for column header |
| `code` | String | Yes | Python script code | Not used for columns |
| `created_at` | String | Yes | Creation timestamp | Not used for columns |

#### Validation Rules

1. **Script ID**: MUST be unique number
2. **Script Name**: MUST be non-empty string
3. **Lookup Key**: Use `id` to match against `selectedScriptIds`

---

### Script Column Configuration

**Source**: Derived from Script Library Data + User Selection  
**Entity Name**: `ScriptColumnConfig`  
**Purpose**: Defines which script columns to display and their headers

#### Fields

| Field Name | Type | Required | Description | Display Rules |
|-----------|------|----------|-------------|---------------|
| `scriptId` | Number/String | Yes | Script ID for API query | Not displayed |
| `columnName` | String | Yes | Display name for column header | Shown in table header |

#### Validation Rules

1. **Column Name Fallback Order**: 
   - Primary: `script.name`
   - Secondary: `script.description`
   - Tertiary: `Script ${scriptId}`
2. **Multiple Scripts**: Each selected script gets one column
3. **Name Uniqueness**: If two scripts have same name, both display (user's responsibility)

---

### Script Results (Existing)

**Source**: Backend API Response  
**Entity Name**: `ScriptResult`  
**Purpose**: Stores calculated script results (may be null)

#### Fields

| Field Name | Type | Required | Description |
|-----------|------|----------|-------------|
| `result` | Number/String | No | Calculated result value |
| `column_name` | String | No | Column name (may be missing) |
| `error` | Boolean | No | Error indicator |

#### Current Bug

When `ScriptResult` is `null`:
- No `result` value
- No `column_name` 
- Column header extraction fails
- Falls back to "Custom"

---

## Data Flow

### Current Flow (Buggy)

```
Backend returns stock with script_results: {2: null}
    ↓
StockTable extracts column names from script_results
    ↓
Tries to access null.column_name
    ↓
Returns undefined
    ↓
Falls back to "Custom"
    ↓
User sees generic "Custom" header
```

### New Flow (Fixed)

```
ScriptManager loads library: [{id: 2, name: "Momentum", ...}]
    ↓
DashboardPage stores library in state
    ↓
StockTable receives library as prop
    ↓
Backend returns stock with script_results: {2: null}
    ↓
StockTable looks up script ID 2 in library
    ↓
Finds script with name "Momentum"
    ↓
Uses "Momentum" as column header
    ↓
User sees correct script name
```

---

## State Management

### Component Props

**DashboardPage**:
- New state: `scriptLibrary` (array of script objects)
- Pass to StockTable as prop

**StockTable**:
- New prop: `scriptLibrary` (array of script objects)
- Use for column name lookup

**ScriptManager**:
- Already has scripts data
- No changes needed (optionally expose via callback)

---

## Code Changes

### Modified Components

**1. DashboardPage.jsx**:
```javascript
const [scriptLibrary, setScriptLibrary] = useState([]);

// Load script library (add useEffect)
useEffect(() => {
  loadScriptLibrary();
}, []);

const loadScriptLibrary = async () => {
  const response = await getScripts();
  if (response.code === 200 && response.data) {
    const scripts = Array.isArray(response.data) ? response.data : [];
    setScriptLibrary(scripts);
  }
};

// Pass to StockTable
<StockTable 
  visibleColumns={visibleColumns} 
  selectedScriptIds={selectedScriptIds}
  scriptLibrary={scriptLibrary}
/>
```

**2. StockTable.jsx**:
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

---

## Summary

- **Root Cause**: Column name extraction from nullable script_results
- **Solution**: Lookup script names from library data instead
- **Data Flow**: ScriptManager → DashboardPage → StockTable
- **Risk**: Low - simple lookup logic change

