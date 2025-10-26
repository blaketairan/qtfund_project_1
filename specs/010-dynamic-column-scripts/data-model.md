# Data Model: Dynamic Script Columns

**Feature**: 010-dynamic-column-scripts  
**Date**: 2025-01-27  
**Purpose**: Define data structures for script selection and dynamic column display

## Entities

### Script Selection State

**Source**: localStorage + React Component State  
**Entity Name**: `ScriptSelectionState`  
**Purpose**: Tracks which scripts user has selected to display as columns

#### Fields

| Field Name | Type | Required | Description | Storage |
|-----------|------|----------|-------------|---------|
| `selectedScriptIds` | Array<String> | Yes | List of script IDs to display as columns | localStorage + state |
| `visibleScriptColumns` | Array<Object> | No | Metadata about visible script columns | Derived from selectedScriptIds |

#### Validation Rules

1. **Script IDs**: MUST be array of valid UUID strings
2. **Persistent**: MUST save to localStorage key 'dashboard_script_selections'
3. **Load on mount**: MUST restore from localStorage when app loads

---

### Script Column Data

**Source**: Backend API Response  
**Entity Name**: `ScriptColumnData`  
**Purpose**: Stores calculated script results returned from list query

#### Fields

| Field Name | Type | Required | Description | Display Rules |
|-----------|------|----------|-------------|---------------|
| `script_id` | String | Yes | ID of the script used for calculation | Not displayed |
| `script_result` | Number/String | Yes | Calculated result for this stock | Display as-is |
| `column_name` | String | Yes | Display name for the column | Shown as column header |
| `error` | Boolean | No | Whether calculation failed for this stock | Display "--" if true |

#### Validation Rules

1. **Result Type**: CAN be number, string, or null
2. **Error Handling**: If error=true, display "--"
3. **Missing Data**: If script_result is null, display "--"

---

### List Query Context

**Source**: API Request Parameters  
**Entity Name**: `QueryContext`  
**Purpose**: Defines which stocks script calculations should apply to

#### Fields

| Field Name | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `limit` | Number | No | Maximum number of stocks in result | 100 |
| `offset` | Number | No | Pagination offset | 0 |
| `market_code` | String | No | Filter by market (SH/SZ/BJ) | "SH" |
| `selectedScriptIds` | Array<String> | Yes | Script IDs to calculate | ["uuid-1", "uuid-2"] |

#### Validation Rules

1. **Script Calculation Scope**: Scripts MUST be calculated ONLY for stocks in result set
2. **Filtering**: If market_code specified, only those stocks get calculated
3. **Limiting**: If limit=100, only those 100 stocks get calculated

---

### Saved Script (Existing)

**Source**: Backend API  
**Entity Name**: `SavedScript`  
**Purpose**: User's saved calculation script

#### Fields

| Field Name | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String | Yes | Script ID (UUID) |
| `name` | String | Yes | Script display name |
| `description` | String | No | Script description |
| `code` | String | Yes | Python script code |
| `created_at` | String | Yes | Creation timestamp |

---

## Data Flow

### Current Flow (Before Fix)

```
User uploads script
    ↓
POST /api/scripts (save script)
    ↓
POST /api/scripts/{id}/execute (execute for ALL stocks)
    ↓
GET /api/stock-price/list (get stock data)
    ↓
Display stocks with script results
```

**Problem**: Expensive upfront calculation, doesn't respect query filters

### New Flow (After Fix)

```
User saves script
    ↓
POST /api/scripts (save script, NO execute)
    ↓
User selects scripts to display
    ↓
Store selected script IDs in localStorage
    ↓
GET /api/stock-price/list?script_ids=id1,id2&limit=100&market_code=SH
    ↓
Backend: Get stocks (respecting filters/limit) + Calculate scripts for those stocks ONLY
    ↓
Return stocks with script_result fields
    ↓
Display stocks with dynamic script columns
```

**Benefit**: Efficient, respects filters, calculates only what's visible

---

## State Management

### Local Component State

**Components using local state**:
- `ScriptManager`: Selected script IDs (syncs with localStorage)
- `StockTable`: Rendered script columns (derived from data)

**State patterns**:
```javascript
const [selectedScriptIds, setSelectedScriptIds] = useState([]);
const [savedScripts, setSavedScripts] = useState([]);
```

### Persistent State (localStorage)

**Script Selections**:
```javascript
localStorage.setItem('dashboard_script_selections', JSON.stringify(['id1', 'id2']));
```

**Load on mount**:
```javascript
const saved = localStorage.getItem('dashboard_script_selections');
if (saved) setSelectedScriptIds(JSON.parse(saved));
```

### Context State

**DashboardContext** (may need to extend):
- Add: `selectedScriptIds` - currently selected scripts
- Add: `setSelectedScriptIds()` - update selected scripts
- Or handle locally in ScriptManager

---

## API Integration

### Modified Endpoints

**GET /api/stock-price/list**:
- **New query parameter**: `script_ids` (comma-separated list of script IDs)
- **New response fields**: For each stock, include script_result objects
- **Behavior**: Calculate scripts for stocks in current query only

**Example Request**:
```
GET /api/stock-price/list?limit=100&market_code=SH&script_ids=abc-123,def-456
```

**Example Response**:
```json
{
  "code": 200,
  "data": [
    {
      "symbol": "SH.600519",
      "stock_name": "贵州茅台",
      "close_price": 1623.45,
      "script_results": {
        "abc-123": {"result": 0.0012, "column_name": "Price/Volume Ratio"},
        "def-456": {"result": 1.84, "column_name": "Momentum"}
      }
    }
  ]
}
```

---

## Constraints

### Query Calculation Rules

1. **Scope**: Scripts calculated ONLY for stocks in current query result
2. **Filtering**: If market_code=SH, scripts run only on SH stocks in result
3. **Limiting**: If limit=100, scripts run only on those 100 stocks
4. **Performance**: Script calculations should complete within query time (<3s)

### Error Handling

1. **Individual Failures**: If script fails for one stock, show "--" for that cell only
2. **Syntax Errors**: Validate before saving, don't allow saving invalid scripts
3. **API Failures**: If list query fails, show error message but don't crash
4. **Missing Results**: If script_result is missing, display "--"

---

## Summary

- **Selection State**: Persisted in localStorage, managed in React state
- **Query Context**: Passed as API parameters, determines calculation scope
- **Script Results**: Embedded in API response, displayed as dynamic columns
- **Backend Changes**: Required to support script_ids query parameter and calculate during list query

