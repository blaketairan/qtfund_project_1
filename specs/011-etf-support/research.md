# Research: ETF Support in Frontend Dashboard

**Feature**: 011-etf-support  
**Date**: 2025-01-27  
**Purpose**: Technical decisions for ETF filtering implementation

## Technology Choices

### Decision: Follow Existing Filter Pattern

**What was chosen**: Create `ETFFilter` component following the same pattern as `MarketFilter` component.

**Rationale**:
- Consistency: Users are already familiar with MarketFilter pattern
- Reusability: MarketFilter has proven, tested pattern
- Maintainability: Keep codebase patterns consistent
- Fast implementation: Can copy and adapt existing working code

**Alternatives considered**:
- **Dropdown select**: Rejected because MarketFilter uses checkbox pattern
- **Separate filter area**: Rejected because violates existing UI layout
- **Tab-based filter**: Rejected because doesn't fit with existing controls

---

### Decision: Send is_etf as Boolean Query Parameter

**What was chosen**: Send `is_etf=true` or `is_etf=false` to backend API, omit parameter for "All" option.

**Rationale**:
- Backend API supports this parameter (from backend research)
- Clear and explicit filtering
- Standard REST query parameter pattern
- Easy to test and debug

**Alternatives considered**:
- **String enum**: Send `etf_type=etf|stock|all` - Rejected because less clear
- **Separate endpoints**: Rejected because violates API consistency
- **Client-side filtering**: Rejected because backend should handle filtering for consistency

---

### Decision: Visual ETF Indicator with Badge

**What was chosen**: Add "ETF" badge/text indicator to ETF rows in the table, similar to market code display.

**Rationale**:
- Visible and clear to users
- Doesn't disrupt existing table layout
- Consistent with existing visual elements
- Low implementation overhead

**Alternatives considered**:
- **Icon only**: Rejected because text is more universally understood
- **Color coding**: Rejected because of accessibility concerns
- **Separate column**: Rejected because takes up table space

---

### Decision: Store Filter Selection Optionally in localStorage

**What was chosen**: Optionally persist ETF filter choice in localStorage, not required for MVP.

**Rationale**:
- Nice-to-have feature, not core requirement
- Avoid adding unnecessary persistence layer
- Can add later if users request it
- Keep initial implementation simple

**Alternatives considered**:
- **Always persist**: Rejected because adds complexity
- **Never persist**: Considered but optional persistence is safer

---

### Decision: Filter Works with Existing Filters

**What was chosen**: ETF filter works in combination with market filter and search filter simultaneously.

**Rationale**:
- User expectation: filters should work together
- Consistent with standard filter behavior
- More useful for users (e.g., "Shanghai ETFs only")
- Backend supports combining filters

**Alternatives considered**:
- **Exclusive filters**: Rejected because limits user flexibility
- **Single filter at a time**: Rejected because reduces functionality

---

## Backend API Integration

### Current Backend Support

Based on existing `stockService.js`:
- Backend supports `is_active` parameter (Y/N)
- Market filtering works with `market_code` parameter
- Assumption: Backend supports `is_etf` parameter for ETF filtering

### API Request Format

**ETF Filter Selected**:
```
GET /api/stock-price/list?is_etf=true&limit=200
```

**Stock Filter Selected**:
```
GET /api/stock-price/list?is_etf=false&limit=200
```

**All Instruments**:
```
GET /api/stock-price/list?limit=200
```

### Response Format

No changes expected. Backend returns same stock data structure:
```json
{
  "code": 200,
  "data": [
    {
      "symbol": "SH.512880",
      "stock_name": "证券ETF",
      "is_etf": true,
      ...
    }
  ]
}
```

---

## Component Design

### ETFFilter Component

**Props**:
- `selectedType` (string): "all", "etf", "stock"
- `onTypeChange` (function): Callback when filter changes

**UI**:
- Three radio buttons or checkbox group
- Labels: "全部", "ETF", "股票"
- Default: "全部"

**State Management**:
- State managed in DashboardPage
- Passed to StockTable via props
- Sent to API via stockService

### Visual Indicator in Table

**Location**: In each row where ETF data is present

**Display**: "ETF" badge or text next to symbol or in new column

**Implementation**:
```javascript
{stock.is_etf && (
  <span className="badge">ETF</span>
)}
```

---

## Summary

All technical decisions are straightforward:
- **Filter pattern**: Copy MarketFilter
- **API parameter**: `is_etf=true/false`
- **Visual indicator**: Badge/label "ETF"
- **Filter combination**: Works with existing filters
- **Persistence**: Optional localStorage

No additional research needed - standard filter implementation.

