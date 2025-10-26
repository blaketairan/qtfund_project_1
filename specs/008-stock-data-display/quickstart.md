# Quick Start: Stock Data Display on Dashboard

**Feature**: 008-stock-data-display  
**Branch**: `008-stock-data-display`  
**Date**: 2025-01-27

## Overview

This feature enhances the stock dashboard to display actual stock price data with Chinese column headers. The table currently shows empty values - this implementation ensures all data fields are properly populated and formatted.

## What Changed

### Files Modified

- `src/components/dashboard/StockTable.jsx` - Update column labels to Chinese

### Files Referenced (No Changes)

- `src/services/stockService.js` - Already implements `fetchStockList()` API call
- `src/utils/numberFormat.js` - Already has formatting utilities
- `src/context/DashboardContext.jsx` - Already manages stock data state

## Implementation Steps

### Step 1: Update Column Labels

Update the column definitions in `StockTable.jsx`:

**Before:**
```javascript
const columns = [
  { key: 'symbol', label: 'Symbol' },
  { key: 'stock_name', label: 'Name' },
  { key: 'close_price', label: 'Price' },
  { key: 'price_change_pct', label: 'Change %' },
  { key: 'volume', label: 'Volume' },
  { key: 'market_code', label: 'Market' },
];
```

**After:**
```javascript
const columns = [
  { key: 'symbol', label: '代码' },
  { key: 'stock_name', label: '名称' },
  { key: 'close_price', label: '价格' },
  { key: 'price_change_pct', label: '涨跌幅%' },
  { key: 'volume', label: '成交量' },
  { key: 'market_code', label: '市场' },
];
```

### Step 2: Verify Data Display

Check that the following are working:

1. **API Response Structure**: Verify `/api/stock-price/list` returns data in correct format
   ```javascript
   {
     code: 200,
     data: [
       {
         symbol: "SH.600519",
         stock_name: "贵州茅台",
         close_price: 1623.45,
         price_change_pct: 2.34,
         volume: 1256789,
         market_code: "SH"
       }
     ]
   }
   ```

2. **Formatting Functions**: Confirm these work correctly:
   - `formatCurrency(stock.close_price)` → "¥1,623.45"
   - `formatPercentage(stock.price_change_pct)` → "2.34%"
   - `formatVolume(stock.volume)` → "125.68万"

3. **Color Coding**: Verify positive changes show green, negative show red
4. **Missing Data**: Verify null/undefined values display "--"

## Testing Checklist

### Functional Tests

- [ ] Dashboard loads without errors
- [ ] Stock table displays with Chinese column headers
- [ ] Price values are numeric (not empty/null)
- [ ] Change percentage displays with +/- sign and color coding
- [ ] Volume displays with proper formatting
- [ ] Sorting works on all columns
- [ ] Missing data displays as "--"
- [ ] Error message shows when API fails

### Visual Tests

- [ ] All column headers are in Chinese (代码, 名称, 价格, 涨跌幅%, 成交量, 市场)
- [ ] Positive changes are green
- [ ] Negative changes are red
- [ ] Numbers have proper formatting (decimals, thousand separators)
- [ ] Large volumes use 万/亿 abbreviations

### Edge Cases

- [ ] Empty API response → shows "No stocks to display"
- [ ] Partial data (some fields null) → shows "--" for missing fields
- [ ] Zero price shows "¥0.00" not "--"
- [ ] Very large volume (100M+) formats correctly

## Verification Steps

1. Start the application: `npm start`
2. Navigate to Dashboard page
3. Verify column headers are in Chinese
4. Verify actual numeric values display for prices
5. Verify change percentages show with color coding
6. Verify volumes show with proper formatting
7. Test sorting on various columns
8. Test with missing/null data to verify "--" display

## API Verification

Test API endpoint manually:

```bash
# Check API response structure
curl -X GET "https://qtfund.com/api/stock-price/list?limit=10"

# Expected response:
{
  "code": 200,
  "data": [...]
}
```

## Troubleshooting

### Issue: Column headers still in English
**Solution**: Make sure StockTable.jsx was updated with Chinese labels

### Issue: No data displaying (all empty)
**Check**: 
1. API endpoint URL is correct in `apiConfig.js`
2. Backend API is running on qtfund.com
3. API response contains the expected fields

### Issue: Wrong data format
**Check**:
1. API returns `close_price` (not `price`)
2. API returns `price_change_pct` (not `change_pct`)
3. Verify field names match what StockTable expects

### Issue: Formatting not working
**Check**:
1. Import statements in StockTable.jsx include formatting functions
2. Functions are called: `formatCurrency()`, `formatPercentage()`, `formatVolume()`

## Deployment

No special deployment steps required. Changes are frontend-only.

1. Build: `npm run build`
2. Deploy: Follow existing deployment process for frontend assets

## Success Criteria Met

✅ All column headers display in Chinese  
✅ Price values display with 2 decimals (¥12.34 format)  
✅ Change percentages display with color coding (green/red)  
✅ Volumes display with 万/亿 abbreviations  
✅ Missing data displays as "--"  
✅ Sorting works on all columns  

## Related Files

- **Spec**: [spec.md](./spec.md) - Full feature specification
- **Plan**: [plan.md](./plan.md) - Implementation plan
- **Research**: [research.md](./research.md) - Technical decisions
- **Data Model**: [data-model.md](./data-model.md) - Data structures
- **Contracts**: [contracts/display-contracts.json](./contracts/display-contracts.json) - API contracts

