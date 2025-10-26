# Data Model: Frontend Fix for API Response Handling

**Feature**: 007-fix-decision  
**Created**: 2025-01-27

## API Response Structure

### Current Backend Response (Actual)

```json
{
  "code": 200,
  "data": [
    {
      "symbol": "SZ.000004",
      "stock_name": "*ST国华",
      "is_active": "Y",
      "market_code": "SZ",
      "last_sync_date": "2025-10-24T00:00:00"
    }
  ]
}
```

**Key Characteristics**:
- `code`: Response status code (200 for success)
- `data`: Direct array of stock items
- No `items` wrapper around the array

### Documented Contract Response (Not Used)

```json
{
  "code": 200,
  "data": {
    "items": [...],
    "total": 100,
    "offset": 0,
    "limit": 200
  }
}
```

**Key Characteristics**:
- `code`: Response status code
- `data`: Object containing `items` array
- Additional pagination metadata (`total`, `offset`, `limit`)

## Frontend Handling Logic

### Response Validation Flow

1. **Check response.code === 200** (success)
2. **Check response.data exists** (has data)
3. **Determine data structure**:
   - If `Array.isArray(response.data)` → use `response.data` directly
   - Else if `response.data.items` → use `response.data.items`
4. **Validate array has items**: `items && items.length > 0`
5. **Dispatch to Redux store**: Update stocks and filtered stocks state

### Data Structure Evolution

**Current State**: Backend returns direct array
```javascript
response.data = [item1, item2, ...]
```

**Potential Future State**: Backend returns nested structure
```javascript
response.data = { items: [item1, item2, ...], total: 100 }
```

**Fix Handles Both**: Code checks both formats for robustness

## Stock Data Entity

Each item in the array represents a stock with these fields:

- `symbol` (string): Stock identifier (e.g., "SZ.000004")
- `stock_name` (string): Display name (e.g., "*ST国华")
- `is_active` (string): Active status ("Y" or "N")
- `market_code` (string): Market identifier ("SH", "SZ", "BJ")
- `last_sync_date` (string): Last synchronization date

## Error Handling

### Empty Response
```javascript
if (!items || items.length === 0) {
  setError('No stock data available');
}
```

### Malformed Response
```javascript
if (!response.data) {
  setError('Failed to load stock data');
}
```

### Non-200 Status
```javascript
if (response.code !== 200) {
  setError('Failed to load stock data');
}
```

