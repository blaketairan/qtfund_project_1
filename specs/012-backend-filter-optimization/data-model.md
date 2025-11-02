# Data Model: Backend Market Filter and Loading UX

**Feature**: 012-backend-filter-optimization  
**Date**: 2025-01-27  
**Purpose**: Define data structures for backend market filtering and loading states

---

## Entities

### Market Filter State

**Source**: React Component State (DashboardPage)  
**Entity Name**: `MarketFilterState`  
**Purpose**: Tracks selected market codes for filtering

#### Fields

| Field Name | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `selectedMarkets` | String[] | Yes | Array of selected market codes | ["SH", "SZ"] |

#### Validation Rules

1. **Values**: Each element must be one of: "SH", "SZ", "BJ"
2. **Empty Array**: Indicates all markets selected (no filter)
3. **Uniqueness**: Array should contain no duplicates

---

### API Request Parameters

**Source**: API Request Construction  
**Entity Name**: `StockListRequestParams`  
**Purpose**: Query parameters sent to stock list API

#### Fields

| Field Name | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `market_code` | String | No | Comma-separated market codes | "SH,SZ" |
| `is_etf` | Boolean | No | Filter by ETF status | true |
| `script_ids` | Number[] | No | Script IDs for calculations | [1, 2, 3] |

#### Validation Rules

1. **market_code Format**: Comma-separated values from ["SH", "SZ", "BJ"]
2. **market_code Omitted**: When empty array or all markets selected
3. **Combination**: All parameters work together (market + ETF + scripts)

#### Examples

```javascript
// Single market
{ market_code: "SH" }

// Multiple markets
{ market_code: "SH,SZ" }

// All markets (omit parameter)
{}

// Combined filters
{ 
  market_code: "SH", 
  is_etf: true, 
  script_ids: [1, 2] 
}
```

---

### Loading State

**Source**: React Component State (StockTable)  
**Entity Name**: `LoadingState`  
**Purpose**: Tracks API request status and provides UI feedback

#### Fields

| Field Name | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| `loading` | Boolean | Yes | Whether API request is in progress | true |
| `error` | String/Null | Yes | Error message if request failed | null |

#### State Transitions

```
Initial State
  loading: true
  error: null
    ↓
API Request Started
  loading: true
  error: null
    ↓
Success → API Response Received
  loading: false
  error: null
    ↓
Error → Request Failed
  loading: false
  error: "Error message"
```

#### Validation Rules

1. **Loading Duration**: Can persist for up to 10 minutes
2. **Error Message**: Should be user-friendly, not technical stack trace
3. **Reset**: Error cleared when new request starts

---

### HTTP Timeout Configuration

**Source**: API Service Configuration  
**Entity Name**: `TimeoutConfig`  
**Purpose**: Configure extended timeout for long-running queries

#### Fields

| Field Name | Type | Required | Description | Value |
|-----------|------|----------|-------------|-------|
| `timeout` | Number | Yes | Timeout in milliseconds | 600000 |

#### Implementation

```javascript
const timeout = 600000; // 10 minutes
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), timeout);

fetch(url, { signal: controller.signal })
  .finally(() => clearTimeout(timeoutId));
```

---

## Data Flow

### Market Filter Selection Flow

```
User selects market in MarketFilter
  ↓
DashboardPage.selectedMarkets = ["SH"]
  ↓
StockTable receives selectedMarkets prop
  ↓
StockTable.useEffect triggered
  ↓
StockTable.loadStocks() called
  ↓
Build API params: { market_code: "SH" }
  ↓
fetchStockList(params)
  ↓
Backend filters data by market_code
  ↓
Return filtered results
  ↓
StockTable renders data
```

### Loading State Flow

```
User changes filter
  ↓
setLoading(true)
setError(null)
  ↓
Display loading overlay
  ↓
API request in progress (0-10 minutes)
  ↓
Loading animation persists
  ↓
Response received OR Error occurred
  ↓
setLoading(false)
  ↓
Hide loading overlay
  ↓
Display data OR error message
```

---

## Component State Management

### DashboardPage State

```javascript
const [selectedMarkets, setSelectedMarkets] = useState(['SH', 'SZ', 'BJ']);
```

**Purpose**: Track which markets are selected in filter  
**Updates**: Via MarketFilter onMarketChange callback  
**Passed To**: StockTable component

### StockTable State

```javascript
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

**Purpose**: Track API request status  
**Updates**: 
- `loading`: true before request, false after
- `error`: null before request, error message if failed  
**Used For**: Conditional rendering of loading overlay and error messages

---

## API Integration

### Modified Endpoints

**GET /api/stock-price/list**

**Query Parameters**:
- `market_code` (string, optional): Comma-separated market codes
- `is_etf` (boolean, optional): Filter by ETF status
- `script_ids` (array, optional): Script IDs for calculations

**Behavior**:
- **With market_code**: Return only instruments from specified markets
- **Without market_code**: Return instruments from all markets
- **Timeout**: Backend supports up to 10 minutes for complex queries

### Request Examples

```
# Single market
GET /api/stock-price/list?market_code=SH

# Multiple markets
GET /api/stock-price/list?market_code=SH,SZ

# All markets
GET /api/stock-price/list

# Combined filters
GET /api/stock-price/list?market_code=SH&is_etf=true&script_ids=1&script_ids=2
```

### Response Format

No changes to response structure. Existing format:

```json
{
  "code": 200,
  "data": [
    {
      "symbol": "SH.600000",
      "stock_name": "浦发银行",
      "market_code": "SH",
      "close_price": 7.89,
      "price_change_pct": 1.23,
      "volume": 12345678,
      "is_etf": false,
      "script_results": {
        "1": 0.1234,
        "2": -0.0567
      }
    }
  ]
}
```

---

## UI State Mapping

### Loading Overlay

**Condition**: `loading === true`

**Display**:
```jsx
<div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
  <div className="text-center">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <p className="mt-4 text-gray-600">Loading stock data...</p>
  </div>
</div>
```

### Error State

**Condition**: `error !== null && !loading`

**Display**:
```jsx
<div className="p-8 text-center text-red-600">{error}</div>
```

### Empty State

**Condition**: `!loading && !error && stocks.length === 0`

**Display**:
```jsx
<div className="text-center p-8 text-gray-500">No stocks to display</div>
```

---

## Constraints

### Browser Limitations

1. **Default Timeout**: ~300 seconds (5 minutes) in most browsers
2. **Explicit Timeout**: Can be extended via AbortController
3. **Memory**: Large datasets (5000+ rows) may impact performance

### Performance Considerations

1. **Table Rendering**: <2000 rows should render without issues
2. **React Re-renders**: Minimize by proper `useEffect` dependencies
3. **API Latency**: 10-minute queries are acceptable with loading feedback

### Backward Compatibility

1. **API**: Backend already supports `market_code` parameter
2. **No limit**: Backend handles queries without limit parameter
3. **Response Format**: Unchanged, existing parsing logic works

---

## Summary

Key data structures:
- **Market Filter**: String array of selected markets
- **API Parameters**: `market_code` as comma-separated string
- **Loading State**: Boolean + error message for UI feedback
- **Timeout**: 10-minute window for long queries

All changes maintain backward compatibility while enabling complete data access and better UX for long-running queries.

