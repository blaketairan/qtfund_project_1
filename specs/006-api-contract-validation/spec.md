# Feature Specification: API Contract Validation Process

**Feature Branch**: `006-api-contract-validation`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "基于之前和你对话生成的前后端spec，实现之后出现了问题。请查看上面的历史对话，为避免以后类似问题，请总结学习经验。"

## Problem Summary

During implementation of the Stock Dashboard feature (004), a critical issue was discovered where the frontend was unable to load data despite the backend successfully returning data.

**Root Cause**: API response format mismatch between specification and actual backend implementation.

- **Specification documented**: `response.data.items` (array)
- **Backend actual return**: `response.data` (direct array)
- **Frontend expectation**: `response.data.items` (nested structure)

This caused the frontend validation logic to fail, displaying "Failed to load stock data" error.

## User Scenarios & Testing

### User Story 1 - Automated API Contract Validation (Priority: P1)

Development team can automatically verify that frontend and backend API contracts match before code deployment, preventing runtime data format mismatches.

**Why this priority**: This prevents production bugs caused by API contract mismatches, reducing debugging time and improving system reliability.

**Independent Test**: When frontend and backend have contract mismatches, the validation process detects and reports them before deployment.

**Acceptance Scenarios**:

1. **Given** API contracts are defined in contracts/, **When** backend implementation changes, **Then** validation process detects mismatches and reports errors
2. **Given** frontend code is updated, **When** it doesn't match the defined contract, **Then** validation fails and prevents deployment
3. **Given** both frontend and backend are updated, **When** running validation, **Then** it confirms contracts match and allows deployment
4. **Given** API response structure changes, **When** validation runs, **Then** it flags all affected frontend code locations

---

### User Story 2 - API Contract Documentation Standard (Priority: P2)

All API contracts MUST include complete, accurate response structure examples with exact data types and nested structures.

**Why this priority**: Clear, complete documentation prevents misunderstandings between frontend and backend teams.

**Independent Test**: API contract documentation can be used to generate valid mock data for testing.

**Acceptance Scenarios**:

1. **Given** API endpoint is documented, **When** reading the contract, **Then** developer can see exact expected response structure
2. **Given** response contains nested arrays, **When** documentation is reviewed, **Then** it clearly shows whether data is at `response.data` or `response.data.items`
3. **Given** multiple data fields exist, **When** contract is examined, **Then** all field types and structures are explicit

---

### Edge Cases

- What happens when API returns additional fields not in contract?
- How to handle optional vs required fields in contracts?
- What if response format varies by environment (dev vs production)?
- How to validate partial contract matches?

## Requirements

### Functional Requirements

- **FR-001**: System MUST validate API response structure matches documented contracts
- **FR-002**: Validation MUST check exact nesting levels (e.g., data vs data.items)
- **FR-003**: Validation MUST verify field types and data structures
- **FR-004**: System MUST detect when frontend code references non-existent response paths
- **FR-005**: System MUST provide clear error messages showing expected vs actual structure
- **FR-006**: API contract documentation MUST include complete response examples
- **FR-007**: Contracts MUST explicitly document whether arrays are direct or nested
- **FR-008**: System MUST validate before deployment to prevent production issues

### Non-Functional Requirements

- **NFR-001**: Validation MUST complete within development workflow timing (<30 seconds)
- **NFR-002**: Error messages MUST be clear enough for developers to fix without additional investigation
- **NFR-003**: Contract documentation MUST be machine-readable (JSON schema format)
- **NFR-004**: Validation process MUST be automatable in CI/CD pipeline

## Success Criteria

### Measurable Outcomes

- **SC-001**: Zero production API contract mismatches after implementation
- **SC-002**: API contract validation catches mismatches within 30 seconds
- **SC-003**: 100% of API endpoints have complete contract documentation
- **SC-004**: Developers can fix contract issues using validation error messages without asking questions
- **SC-005**: Frontend code never references non-existent response paths

### Key Entities

- **API Contract**: Documented structure defining request/response format with exact nesting levels
- **Contract Validation**: Automated process checking actual implementation matches contract
- **Response Structure**: Exact JSON hierarchy (e.g., `data.items` vs `data`)

## Assumptions

1. API contracts will be documented in JSON Schema format
2. Backend and frontend are developed by different teams or at different times
3. Manual review is insufficient for catching all contract mismatches
4. Automated validation will run as part of pre-deployment checks
5. Contract documentation must be maintained alongside code changes

## Lessons Learned

### Key Issue from Stock Dashboard Implementation

**Problem**: Frontend expected `response.data.items` but backend returned `response.data`

**Impact**: Production bug preventing data display despite backend working correctly

**Resolution**: Required code changes to handle actual backend response format

### Critical Contract Elements

1. **Exact Nesting Structure**: Must document whether data is direct (`data: [...]`) or nested (`data: { items: [...] }`)
2. **Array Locations**: Specify exact path to arrays (e.g., `response.data` vs `response.data.items`)
3. **Type Consistency**: Ensure field types match between contract and implementation
4. **Complete Examples**: Include full actual response examples, not just schemas

### Prevention Strategy

1. **Include Real Response Examples**: Always show actual backend responses in contracts
2. **Automated Validation**: Run validation tests before merging code
3. **Backend Contract Enforcement**: Backend should return exactly as documented
4. **Frontend Contract Adherence**: Frontend should parse exactly as documented
5. **Version Alignment**: Ensure frontend and backend use same contract version

## Implementation Guidelines for Future Features

### When Creating API Contracts

**Required Elements**:
- Complete actual response example (not just schema)
- Exact nesting structure documented
- Array location explicitly stated
- All field types specified
- Required vs optional fields identified

**Example Good Contract**:
```json
{
  "GET /api/stock-price/list": {
    "response": {
      "code": 200,
      "message": "success",
      "data": [...]
    },
    "note": "data is direct array, not nested as data.items"
  }
}
```

### When Implementing Frontend

**Validation Steps**:
1. Read contract documentation completely
2. Verify exact response structure with backend
3. Test with actual backend responses
4. Add validation for expected structure
5. Handle unexpected structures gracefully

### When Implementing Backend

**Compliance Steps**:
1. Follow documented contract exactly
2. Return structure matches specification
3. Test with contract examples
4. Update contracts when changing formats
5. Communicate changes to frontend team
