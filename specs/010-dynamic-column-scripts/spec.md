# Feature Specification: Dynamic Script Columns in List Query

**Feature Branch**: `010-dynamic-column-scripts`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "现在通过脚本增加列的逻辑比较奇怪，增加列之后，上传脚本的这个接口在对全部股票进行计算，这不是需求设计的初衷。我期望的是上传一个脚本增加一列之后，后续列表查询的时候能增加一列返回给前端展示，计算也是在查询列表时进行(list接口一并返回结果），并且计算范围也局限在列表将要返回的股票范围内（例如limit100，或者过滤了某些交易所的股票，则范围只在其中）。"

> **Note**: This specification MUST be placed in the target project's `specs/010-dynamic-column-scripts/` directory (e.g., `qtfund_project_1/specs/`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Save Script for Future Use (Priority: P1)

Users can create and save calculation scripts without immediately executing them on all stocks.

**Why this priority**: Current workflow forces immediate calculation on all stocks which is inefficient and not aligned with user intent.

**Independent Test**: Users can create a script, save it, and see it in their script library without triggering expensive calculations.

**Acceptance Scenarios**:

1. **Given** users want to create a custom calculation, **When** they write a Python script and click "Save Script", **Then** the script is saved with a name and description but NOT immediately executed
2. **Given** a script is saved, **When** users view their scripts, **Then** they see all saved scripts in a list with names and descriptions
3. **Given** users save a script, **When** they later return to the dashboard, **Then** their saved scripts persist and are available for use
4. **Given** users try to save an invalid script, **When** they submit, **Then** they see a syntax error message but the page doesn't crash

---

### User Story 2 - Select Scripts for Column Display (Priority: P1)

Users can select which saved scripts should be applied as columns when viewing the stock list.

**Why this priority**: Users need control over which calculations appear in their table view - not all scripts need to be visible at once.

**Independent Test**: Users can view their saved scripts, check/uncheck which ones to apply, and see those columns appear/disappear in the stock table.

**Acceptance Scenarios**:

1. **Given** users have saved multiple scripts, **When** they view the column settings, **Then** they see all saved scripts as selectable options
2. **Given** users want to add a script-based column, **When** they check a script option, **Then** that column appears in the stock table on next query
3. **Given** users want to remove a script-based column, **When** they uncheck a script option, **Then** that column disappears from the table
4. **Given** users select multiple scripts for display, **When** they load the stock table, **Then** all selected script columns appear with calculated values

---

### User Story 3 - View Script Results as Columns (Priority: P1)

Users can see calculated script results as additional columns in the stock table returned from the list query.

**Why this priority**: This is the core requirement - script calculations should happen during list query, not as a separate operation.

**Independent Test**: Users select a script to display, query the stock list (e.g., first 100 stocks), and see calculated results for only those stocks as a new column.

**Acceptance Scenarios**:

1. **Given** users have selected script "Price/Volume Ratio" for display, **When** they query stock list with limit=100, **Then** they see a new "Price/Volume Ratio" column with calculated values for those 100 stocks
2. **Given** users filter stocks by Shanghai market, **When** they query with a selected script, **Then** script results are calculated only for Shanghai stocks in the result set
3. **Given** script execution fails for a particular stock, **When** users view the table, **Then** that cell shows "--" or an error indicator without breaking the entire table
4. **Given** users query with multiple selected scripts, **When** they view results, **Then** they see multiple calculated columns, each showing results for the filtered/limited stock set

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to save scripts without executing them immediately
- **FR-002**: System MUST provide a script library showing all saved scripts with names and descriptions
- **FR-003**: System MUST allow users to select/deselect which scripts should be applied as columns
- **FR-004**: System MUST send selected script IDs as a parameter when querying stock list
- **FR-005**: System MUST display calculated script results as new columns in the stock table
- **FR-006**: System MUST only calculate scripts for stocks in the current query result set (respecting limit, market filter, etc.)
- **FR-007**: System MUST handle script execution errors gracefully (show "--" or error indicator per stock)
- **FR-008**: System MUST persist user's script column selections across page refreshes
- **FR-009**: System MUST validate script syntax before saving
- **FR-010**: System MUST support multiple selected scripts being applied simultaneously

### Key Entities *(include if feature involves data)*

- **Saved Script**: User-created calculation script stored with name, code, and description
- **Selected Script IDs**: List of script IDs user has chosen to display as columns
- **Script Result**: Calculated value for a specific stock from a specific script
- **Query Context**: Filter parameters (market_code, limit, offset) that determine which stocks to calculate for

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can save at least 10 scripts without triggering immediate calculation on all stocks
- **SC-002**: Selected scripts are calculated only for stocks in the current query result (e.g., if limit=100, only those 100 stocks)
- **SC-003**: When users filter by market (SH/SZ/BJ), script calculations apply only to filtered stocks
- **SC-004**: Multiple selected scripts (up to 5) can be calculated and displayed simultaneously
- **SC-005**: Script-based columns appear within 3 seconds of query completion
- **SC-006**: Script execution errors for individual stocks don't break the entire table display
- **SC-007**: User's script column selections persist across browser sessions
- **SC-008**: Script results are accurate and match backend calculations for at least 95% of valid cases

