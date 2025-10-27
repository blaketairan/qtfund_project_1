# Data Model: ETF Support in Frontend Dashboard

**Feature**: 011-etf-support  
**Date**: 2025-01-27  
**Purpose**: Define data structures for ETF filtering and display

## Entities

### ETF Filter State

**Source**: React Component State  
**Entity Name**: `ETFFilterState`  
**Purpose**: Tracks user's ETF filter selection

#### Fields

| Field Name | Type | Required | Description | Values |
|-----------|------|----------|-------------|--------|
| `selectedType` | String | Yes | Current filter selection | "all", "etf", "stock" |
| `apiParameter` | String/Null | No | API query parameter value | "true", "false", null |

#### Validation Rules

1. **Selection**: MUST be one of "all", "etf", "stock"
2. **API Parameter**: 
   - "all" → null (omit parameter)
   - "etf" → "is_etf=true"
   - "stock" → "is_etf=false"
3. **Default**: Default value is "all"

---

### Stock Data (Enhanced)

**Source**: Backend API Response  
**Entity Name**: `StockData`  
**Purpose**: Stock/instrument data with ETF support

#### New Field

| Field Name | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `is_etf` | Boolean | No | Whether instrument is an ETF | true, false |

#### Existing Fields (Unchanged)

- `symbol`, `stock_name`, `market_code`, `close_price`, `price_change_pct`, `volume`, etc.

#### Validation Rules

1. **ETF Flag**: If `is_etf` is missing, assume false (stock)
2. **Symbol Types**: ETF symbols may have different format patterns
3. **Compatibility**: All existing fields remain unchanged

---

### Filter Parameters

**Source**: API Request Construction  
**Entity Name**: `FilterParameters`  
**Purpose**: Combined filter parameters sent to backend

#### Fields

| Field Name | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `market_code` | String | No | Market filter (SH/SZ/BJ) | "SH" |
| `is_etf` | Boolean/String | No | ETF filter | true, false |
| `limit` | Number | No | Result limit | 200 |
| `offset` | Number | No | Pagination offset | 0 |
| `search` | String | No | Search term (client-side) | "平安" |

#### Validation Rules

1. **Combination**: All parameters work together
2. **is_etf Format**: Can be boolean true/false or string "true"/"false"
3. **Default Behavior**: If `is_etf` omitted, return both stocks and ETFs

---

## Data Flow

### Filter Application Flow

```
User selects ETF filter ("ETF")
    ↓
DashboardPage updates selectedETFType state
    ↓
StockTable receives selectedETFType prop
    ↓
StockService sends API request with is_etf=true
    ↓
Backend returns filtered results (only ETFs)
    ↓
StockTable displays results with ETF badges
```

### Combined Filter Flow

```
User applies multiple filters:
  - ETF filter: "ETF"
  - Market filter: "SH"
  - Search: "平安"
    ↓
API request: GET /api/stock-price/list?is_etf=true&market_code=SH
    ↓
Backend returns: Shanghai ETFs matching "平安"
    ↓
Frontend filters by search term (client-side)
    ↓
Display results
```

---

## State Management

### Component State

**DashboardPage.jsx**:
```javascript
const [selectedETFType, setSelectedETFType] = useState('all');
```

**ETFFilter.jsx**:
- Receives `selectedType` and `onTypeChange` as props
- No internal state needed (controlled component)

**StockTable.jsx**:
- Uses `selectedETFType` to determine API parameters
- Displays ETF badges based on `stock.is_etf` field

### Optional Persistence

```javascript
// Load on mount
const saved = localStorage.getItem('dashboard_etf_filter');
if (saved) setSelectedETFType(saved);

// Save on change
localStorage.setItem('dashboard_etf_filter', selectedETFType);
```

---

## API Integration

### Modified Endpoints

**GET /api/stock-price/list**:
- **New query parameter**: `is_etf` (boolean/string)
- **Behavior**: Filter results by instrument type
- **Values**: 
  - `is_etf=true` → Return only ETFs
  - `is_etf=false` → Return only stocks (non-ETF)
  - Omitted → Return all instruments

### Request Examples

```
# ETFs only
GET /api/stock-price/list?is_etf=true

# Stocks only
GET /api/stock-price/list?is_etf=false

# All instruments (default)
GET /api/stock-price/list

# Combined filters
GET /api/stock-price/list?is_etf=true&market_code=SH&limit=100
```

### Response Format

No changes to response structure. Existing format:
```json
{
  "code": 200,
  "data": [
    {
      "symbol": "SH.512880",
      "stock_name": "证券ETF",
      "is_etf": true,
      "close_price": 1.234,
      ...
    }
  ]
}
```

---

## Visual Design

### ETFFilter Component

**Layout**: Radio button group or checkbox group

**Options**:
- ○ 全部 (All)
- ● ETF (ETFs only)
- ○ 股票 (Stocks only)

**Styling**: Use Tailwind classes consistent with MarketFilter

### ETF Badge in Table

**Location**: In row, next to symbol or in separate column

**Display Options**:
1. Badge: `<span class="badge">ETF</span>`
2. Label: `<span class="text-sm">ETF</span>`
3. Icon: ETF icon with text

**Styling**: 
- Blue or green badge
- Small, unobtrusive
- Consistent spacing

---

## Constraints

### Filter Combination Rules

1. **All filters work together**: ETF + Market + Search
2. **Client-side search**: Applied after API returns results
3. **Market filter**: Works on backend (via API)
4. **ETF filter**: Works on backend (via API)

### Backward Compatibility

1. **Default behavior**: If no ETF filter, show all instruments (as before)
2. **Missing is_etf field**: Assume false (treat as stock)
3. **Existing features**: Sorting, custom scripts, column display all work

---

## Summary

- **Filter State**: "all", "etf", or "stock" selection
- **API Parameter**: `is_etf=true/false` boolean
- **Visual Indicator**: Badge/label "ETF" in table rows
- **Combined Filters**: Works with market and search filters
- **Backend Support**: Assumes backend supports `is_etf` parameter

