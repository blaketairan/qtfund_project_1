# Data Model: Stock Dashboard Frontend

**Feature**: 004-stock-dashboard  
**Date**: 2025-01-27

## Entities

### 1. Stock Data

Represents a single stock's price and trading data retrieved from backend API.

**Fields**:
- `symbol` (string, required): Stock identifier in format "MARKET.CODE" (e.g., "SH.600519")
- `stock_name` (string, required): Display name (e.g., "贵州茅台")
- `trade_date` (string ISO date, required): Trading date
- `open_price` (number, required): Opening price
- `high_price` (number, required): Highest price
- `low_price` (number, required): Lowest price  
- `close_price` (number, required): Closing price
- `volume` (number, required): Trading volume (in hands)
- `turnover` (number, required): Trading amount
- `price_change` (number, required): Price change amount
- `price_change_pct` (number, required): Price change percentage
- `market_code` (string, required): "SH", "SZ", or "BJ"
- `premium_rate` (number, optional): For funds

**Relationships**: Many-to-one with Market

**Validation**: 
- Symbol format: MARKET.CODE where MARKET is 2 letters, CODE is 6 digits
- Prices must be positive
- Volume and turnover must be non-negative

### 2. Stock Info

Metadata about stock from backend API.

**Fields**:
- `symbol` (string, required): Stock identifier
- `stock_name` (string, required): Display name
- `stock_code` (string, required): Code without market prefix (e.g., "600519")
- `market_code` (string, required): "SH", "SZ", or "BJ"
- `stock_type` (string, optional): "stock", "fund", "bond"
- `industry` (string, optional): Industry classification
- `sector` (string, optional): Sector classification
- `is_active` (string, required): "Y" or "N"
- `list_date` (string ISO date, optional): Listing date
- `delist_date` (string ISO date, optional): Delisting date

**Relationships**: One-to-many with Stock Data

### 3. Column Configuration

User's table column visibility settings stored in localStorage.

**Fields**:
- `columnId` (string, required): Unique column identifier
- `visible` (boolean, required): Whether column is displayed
- `width` (number, optional): Column width in pixels
- `sortDirection` (string, optional): "asc" | "desc" | null
- `custom` (boolean, optional): Whether column is user-created

**Storage**: localStorage key `dashboard_column_config`

**Relationships**: None (flat object structure)

### 4. Custom Script

User-written Python script for custom column calculations.

**Fields**:
- `id` (string, required): Unique identifier
- `name` (string, required): User-provided name for column
- `script` (string, required): Python code
- `columnId` (string, required): Generated column ID
- `created_at` (string ISO date, required): Creation timestamp

**Storage**: localStorage key `dashboard_custom_scripts`

**Relationships**: One-to-one with Column Configuration

### 5. Quantitative Indicator

Calculated metric like momentum or moving average.

**Fields**:
- `symbol` (string, required): Stock symbol
- `indicatorType` (string, required): "momentum", "ma", "rsi", etc.
- `period` (number, required): Time period (e.g., 26 for 26-day momentum)
- `value` (number, required): Calculated value
- `timestamp` (string ISO date, required): Calculation timestamp

**Relationships**: Many-to-one with Stock Data

### 6. Market Filter

User's market selection filter state.

**Fields**:
- `markets` (array of strings, required): Selected markets ["SH", "SZ", "BJ"]
- `defaultMarkets` (array of strings, optional): ["SH", "SZ", "BJ"]

**Storage**: React Context state (not persisted)

**Relationships**: Filters Stock Data

## State Management

### Dashboard Context State

```javascript
{
  stocks: StockData[],           // All fetched stocks
  filteredStocks: StockData[],   // Filtered/sorted display
  columnConfig: ColumnConfig[],   // Column visibility settings
  marketFilter: string[],        // Selected markets ["SH", "SZ", "BJ"]
  searchTerm: string,           // Search query
  sortColumn: string | null,    // Current sort column ID
  sortDirection: "asc" | "desc" | null,
  customScripts: CustomScript[],  // User-created Python scripts
  loading: boolean,              // API loading state
  error: string | null          // Error message
}
```

## Data Flow

1. **Initial Load**: 
   - Fetch stocks from `GET /api/stock-price/list` 
   - Restore column config from localStorage
   - Restore custom scripts from localStorage
   - Apply default market filter ["SH", "SZ", "BJ"]

2. **User Actions**:
   - Search: Filter `stocks` array by name/symbol → `filteredStocks`
   - Market Filter: Filter by `market_code` field
   - Sort: Sort `filteredStocks` array
   - Column Toggle: Update `columnConfig`, persist to localStorage
   - Custom Script: Send to backend, receive results, update display

3. **Data Refresh**: Poll backend API every 30s for updated stock prices

## Validation Rules

- Symbol format: `/^[A-Z]{2}\.\d{6}$/` (e.g., "SH.600519")
- Market codes: Must be "SH", "SZ", or "BJ"
- Prices: Must be positive numbers
- Percentages: Must be formatted with 2 decimal places
- Search term: Trimmed, case-insensitive matching
- Custom scripts: Must be valid Python syntax (backend validates)

