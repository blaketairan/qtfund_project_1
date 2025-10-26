# Feature Specification: Fix Script Column Name Display

**Feature Branch**: `011-fix-script-column`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: Fix script column name display when script_result is null

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Display Script Column Names Correctly (Priority: P1)

Users can see proper script column names in the table even when script execution returns null results.

**Why this priority**: Without proper column names, users cannot identify what each calculated column represents, reducing the usefulness of the script results feature.

**Independent Test**: Users select a script to display, query the stock list, and see the script's column name correctly displayed in the table header even if some stocks have null results.

**Acceptance Scenarios**:

1. **Given** users select a script "Momentum" to display, **When** they query the stock list, **Then** they see a column header "Momentum" (or the script's configured name) in the table
2. **Given** a script returns null for some stocks, **When** users view the table, **Then** those cells show "--" or "N/A" but the column header still displays the correct script name
3. **Given** users select multiple scripts, **When** they query the list, **Then** each script column displays its own distinct name in the header
4. **Given** a script has a custom column name configured, **When** users query the list, **Then** the table header shows the custom name instead of a generic "Custom" label

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the correct script column name in table headers
- **FR-002**: System MUST handle null script results gracefully by showing "--" or "N/A" in the cell
- **FR-003**: System MUST not break or hide column headers when script results are null for some stocks
- **FR-004**: System MUST show different column names for different selected scripts
- **FR-005**: System MUST use the script's configured name or description as the column header

### Key Entities *(include if feature involves data)*

- **Script Result**: Contains calculation result, column name, and error status for each stock
- **Script Column**: Dynamic column generated from selected script, displays in table with header name
- **Script Configuration**: User-defined name and description stored in script library

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All script column headers display the correct script name (not generic "Custom" label)
- **SC-002**: Null script results display as "--" or "N/A" without breaking column layout
- **SC-003**: Multiple script columns each have distinct, identifiable names
- **SC-004**: Column name changes are reflected immediately when scripts are selected/deselected
- **SC-005**: Users can identify which column corresponds to which script by reading the header name

## Edge Cases

1. **Script returns null for some stocks**: Show null value indicator without hiding column
2. **Script returns null for all stocks**: Still show column header with script name
3. **Multiple scripts selected with same name**: Display distinct identifiers or duplicate names
4. **Script without configured name**: Use fallback naming (e.g., "Script ID 1")
