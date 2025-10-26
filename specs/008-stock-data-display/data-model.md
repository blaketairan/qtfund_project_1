# Data Model: Stock Data Display

**Feature**: 008-stock-data-display  
**Date**: 2025-01-27  
**Purpose**: Define data structure and validation rules for stock data display

## Entities

### Stock Data (Display)

**Source**: Backend API `/api/stock-price/list`  
**Entity Name**: `StockDisplay`  
**Purpose**: Represents a single stock row displayed in the dashboard table

#### Fields

| Field Name | Type | Required | Description | Display Rules |
|-----------|------|----------|-------------|---------------|
| `symbol` | String | Yes | Stock identifier (e.g., "SH.600519") | Display as-is, no formatting |
| `stock_name` | String | Yes | Stock display name (e.g., "贵州茅台") | Display as-is |
| `close_price` | Number | Yes | Latest closing price | Format with `formatCurrency()`, 2 decimals |
| `price_change_pct` | Number | Yes | Daily price change percentage | Format with `formatPercentage()`, color code (green/red) |
| `volume` | Number | Yes | Trading volume in hands | Format with `formatVolume()`, use 万/亿 abbreviations |
| `market_code` | String | Yes | Market identifier ("SH", "SZ", "BJ") | Display as-is |

#### Validation Rules

1. **Required Field Check**: All fields above MUST be present in API response
2. **Numeric Validation**: `close_price`, `price_change_pct`, `volume` MUST be numbers (not null/undefined for display purposes)
3. **Market Code Enum**: `market_code` MUST be one of: "SH", "SZ", "BJ"
4. **Missing Data Handling**: If any field is null/undefined, display "--" (handled by formatting utilities)

#### State Transitions

No state transitions - this is a read-only display entity.

---

### Column Configuration (Display Settings)

**Source**: localStorage  
**Entity Name**: `ColumnConfig`  
**Purpose**: Controls which columns are visible in the table

#### Fields

| Field Name | Type | Required | Description | Display Rules |
|-----------|------|----------|-------------|---------------|
| `key` | String | Yes | Column identifier (e.g., "symbol", "close_price") | Used to map to data fields |
| `label` | String | Yes | Column header text | Displayed in Chinese |
| `visible` | Boolean | Yes | Whether column is shown | Controls column visibility |

#### Column Definitions

```javascript
const columns = [
  { key: 'symbol', label: '代码', visible: true },
  { key: 'stock_name', label: '名称', visible: true },
  { key: 'close_price', label: '价格', visible: true },
  { key: 'price_change_pct', label: '涨跌幅%', visible: true },
  { key: 'volume', label: '成交量', visible: true },
  { key: 'market_code', label: '市场', visible: true },
];
```

#### Validation Rules

1. **Column Keys**: MUST match field names in StockDisplay entity
2. **Labels**: MUST be in Chinese language
3. **Default Visibility**: All columns visible by default

---

## Data Flow

```
Backend API (/api/stock-price/list)
    ↓
    Returns: Array<StockDisplay>
    ↓
stockService.js (fetchStockList)
    ↓
    Parses JSON response
    ↓
DashboardContext (SET_STOCKS)
    ↓
    Stores in state.stocks
    ↓
StockTable Component
    ↓
    Renders with:
    - Chinese column labels
    - formatCurrency(close_price)
    - formatPercentage(price_change_pct)
    - formatVolume(volume)
```

---

## Relationships

### StockDisplay to ColumnConfig
- **Type**: One-to-many (one StockDisplay row maps to many visible columns)
- **Mapping**: Column `key` field maps to StockDisplay field name
- **Example**: ColumnConfig with key="close_price" → StockDisplay.close_price

### StockDisplay to Formatting Utils
- **Type**: Transformation
- **Mapping**: 
  - StockDisplay.close_price → formatCurrency() → "¥12.34"
  - StockDisplay.price_change_pct → formatPercentage() → "5.23%"
  - StockDisplay.volume → formatVolume() → "1.23万"

---

## Data Integrity

### Constraints

1. **API Response Shape**: MUST return `{ code: 200, data: Array<StockDisplay> }` or `{ code: 200, data: { items: Array<StockDisplay> } }`
2. **Empty Data Handling**: If API returns empty array → display "No stocks to display"
3. **Error Handling**: If API fails → display error message, do not crash table

### Edge Cases

1. **Missing Fields**: Display "--" for null/undefined values
2. **Zero Values**: Display "¥0.00" for prices, "0.00%" for changes (not "--")
3. **Negative Change**: Display with red color, format as "-3.45%"
4. **Very Large Volume**: Use 万/亿 abbreviations (e.g., "1.23亿")

---

## Summary

- **Primary Entity**: StockDisplay (stock row data from API)
- **Configuration Entity**: ColumnConfig (column visibility settings)
- **No complex state**: Read-only display with formatting transformations
- **Data source**: Backend API `/api/stock-price/list`
- **Storage**: React Context for data, localStorage for column preferences

