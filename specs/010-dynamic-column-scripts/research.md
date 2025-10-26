# Research: Dynamic Script Columns

**Feature**: 010-dynamic-column-scripts  
**Date**: 2025-01-27  
**Purpose**: Technical decisions for script column workflow redesign

## Technology Choices

### Decision: Calculate Scripts During List Query

**What was chosen**: Pass selected script IDs as query parameters to the stock list API, calculate only for stocks in the current result set.

**Rationale**: 
- User requirement: scripts should be calculated during list query, not on upload
- Efficiency: only calculate for visible stocks (limit, filters applied)
- Scalability: avoids calculating for thousands of stocks unnecessarily
- Alignment with intended workflow

**Alternatives considered**:
- **Keep current approach (calculate on upload)**: Rejected because not aligned with user requirements
- **Separate calculation endpoint**: Rejected because user wants results in list query
- **Frontend calculation**: Rejected because scripts are Python (backend execution required)

---

### Decision: Use localStorage for Script Selection Persistence

**What was chosen**: Store selected script IDs in localStorage to persist across page refreshes.

**Rationale**:
- Simple persistence without backend changes
- Local state management aligns with user experience
- Fast loading, no API calls needed
- Consistent with existing column configuration pattern

**Alternatives considered**:
- **Backend storage**: Considered but requires backend API changes
- **Session storage**: Rejected because users want persistence
- **User preferences API**: Considered but not needed for this feature

---

### Decision: Send Script IDs as Query Parameters

**What was chosen**: Pass selected script IDs as array parameter in list API query.

**Rationale**:
- RESTful approach to extending list query
- Backend can filter and calculate efficiently
- Supports multiple scripts simultaneously
- Matches user requirement for integrated calculation

**Alternatives considered**:
- **Separate script results endpoint**: Rejected because user wants in list response
- **POST request with body**: Rejected because GET is simpler for list queries
- **WebSocket for results**: Rejected because adds complexity

---

### Decision: Handle Script Errors Gracefully Per Stock

**What was chosen**: Display "--" or error indicator for individual stocks where script fails, don't fail the entire query.

**Rationale**:
- User requirement: errors shouldn't break table
- Better UX: partial data is better than no data
- Common pattern in data visualization
- Allows users to see which stocks have calculation issues

**Alternatives considered**:
- **Fail entire query if any stock fails**: Rejected because poor UX
- **Retry failed stocks**: Rejected because adds complexity
- **Skip failed stocks silently**: Rejected because users should know

---

## Workflow Changes

### Current Workflow (To Be Changed)

```
User uploads script
    ↓
Backend calculates for ALL stocks immediately
    ↓
Scripts all executed upfront (expensive, wasteful)
```

**Problem**: Calculates for all stocks even if user only viewing 100, wastes resources.

### New Workflow (Target)

```
User saves script (no execution)
    ↓
User selects scripts to display
    ↓
User queries stock list with filters
    ↓
Backend calculates ONLY for stocks in result set
    ↓
Results returned with calculated columns
```

**Benefit**: Only calculates what's needed, respects filters and limits.

---

## State Management

### Script Selection State

```javascript
{
  selectedScriptIds: ['script-id-1', 'script-id-2'],
  persisted in localStorage as: 'dashboard_script_selections'
}
```

### API Request Format

```
GET /api/stock-price/list?limit=100&market_code=SH&script_ids=id1,id2
```

Backend processes:
- Get stocks matching filters/limit
- Calculate selected scripts for those stocks only
- Return stocks with additional script_result fields

---

## Integration Points

### 1. ScriptManager Component
- Add checkbox UI for script selection
- Save selections to localStorage
- Display selection state (selected/unselected)

### 2. StockTable Component
- Handle dynamic script columns in data
- Display script results as additional columns
- Show "--" for missing/failed calculations

### 3. Stock Service
- Modify fetchStockList to accept script_ids parameter
- Build query string with script IDs
- Pass parameter to backend API

### 4. Dashboard Context
- Manage selectedScriptIds state
- Persist to localStorage
- Load on component mount

---

## Summary

All technical decisions are straightforward with no unknowns. The primary work is modifying existing components to support script selection and query parameter passing.

No additional research required - standard React state management and API integration patterns.

