# Research: Stock Data Display on Dashboard

**Feature**: 008-stock-data-display  
**Date**: 2025-01-27  
**Purpose**: Resolve technical decisions for displaying stock data with Chinese column headers

## Technology Choices

### Decision: Use Chinese Column Labels in StockTable Component

**What was chosen**: Hardcode Chinese column labels directly in `StockTable.jsx` component configuration.

**Rationale**: 
- Simple localization without introducing i18n libraries
- Column labels are static (not user-configurable)
- No dynamic content requiring translation infrastructure
- Matches existing code patterns in project (no i18n libraries present)

**Alternatives considered**:
- **i18next/react-i18next**: Rejected because adds complexity for simple static labels
- **Translation context/provider**: Rejected because adds unnecessary abstraction
- **Configuration file**: Rejected because column labels are UI-specific, not config data

---

### Decision: Use Existing Formatting Utilities

**What was chosen**: Continue using existing functions from `src/utils/numberFormat.js`:
- `formatCurrency()` - for prices (2 decimals, CNY currency)
- `formatPercentage()` - for change percentages
- `formatVolume()` - for trading volumes (万/亿 abbreviation)

**Rationale**:
- Utilities already implemented and tested
- Consistent formatting across application
- Appropriate for Chinese number formatting conventions
- No need to reinvent the wheel

**Alternatives considered**:
- **Custom formatting in component**: Rejected because violates DRY principle
- **New utility functions**: Rejected because existing functions cover all use cases

---

### Decision: Verify Backend API Response Format

**What was chosen**: Inspect actual API response from `/stock-price/list` endpoint to verify data fields match expected schema.

**Rationale**:
- User reports data not displaying - need to verify if issue is frontend or backend
- Must confirm API returns: `close_price`, `price_change_pct`, `volume` fields
- Verify field names match what StockTable.jsx expects (e.g., `close_price` vs `price`)

**Action required**: Check API response structure to confirm all required fields are present.

---

### Decision: Display "--" for Missing Data

**What was chosen**: Existing `numberFormat.js` functions already return "--" for null/undefined values.

**Rationale**:
- Consistent placeholder across all numeric fields
- Graceful degradation when data unavailable
- Matches Chinese display convention (dashes for missing data)
- Users can distinguish between zero (0.00%) and missing data (--)

**No alternatives needed**: Current implementation is correct.

---

### Decision: Maintain Existing Color Coding for Change Percentage

**What was chosen**: Continue using `text-green-600` for positive changes and `text-red-600` for negative changes.

**Rationale**:
- Standard financial data visualization convention
- Color already implemented in StockTable.jsx
- Clear visual distinction for users
- Matches industry standard (green up, red down in China)

**No alternatives needed**: Current implementation is correct.

---

## Data Flow Analysis

### Current Flow
1. DashboardPage.jsx loads → renders StockTable
2. StockTable calls `fetchStockList()` from stockService.js
3. stockService.js calls `/api/stock-price/list` endpoint
4. Response parsed and stored in DashboardContext
5. StockTable renders data with formatting utilities

### Potential Issues
- **Issue 1**: Backend API may return different field names than expected
- **Issue 2**: Backend API may not return data (empty/null values)
- **Issue 3**: API endpoint URL may be incorrect

### Verification Steps Needed
1. Check API response structure and field names
2. Verify API endpoint returns non-empty data arrays
3. Confirm field mapping between API and component

---

## Summary

All technical decisions are straightforward with no unknowns or NEEDS CLARIFICATION markers. The primary work is:
1. Update column labels from English to Chinese
2. Verify API response contains expected data fields
3. Ensure data formatting displays correctly with existing utilities

No additional research or dependencies required.

