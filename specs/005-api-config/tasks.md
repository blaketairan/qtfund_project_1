# Implementation Tasks: Centralized API Configuration

**Feature**: 005-api-config  
**Created**: 2025-01-27  
**Total Tasks**: 9

## Summary

This feature centralizes all API configuration (base URL, protocol, environment) into a single file (`src/config/apiConfig.js`) and refactors 4 service files to use this configuration.

**Scope**: 1 configuration file, 4 service files to refactor

## Dependencies & Story Order

All tasks support **User Story 1** (Unified API Configuration Management).

**Story dependencies**: None - single user story, sequentially implemented.

## Parallel Execution Opportunities

All refactoring tasks ([US1] tasks T004-T007) can be executed in parallel since they operate on different files with no dependencies between them.

## MVP Scope

**MVP = Phase 1 + Phase 2** (Setup + US1)

This delivers all functionality: centralized configuration and all service files refactored.

## Implementation Strategy

1. **Phase 1**: Create centralized configuration file (single source of truth)
2. **Phase 2**: Refactor all service files to use the centralized config
3. **Phase 3**: Verify and validate all changes

---

## Phase 1: Setup

**Goal**: Create directory structure and implementation foundation.

**Independent Test**: Configuration file exists at `src/config/apiConfig.js` and exports configuration object.

---

### Setup Tasks

- [ ] T001 Create src/config directory
- [ ] T002 Create src/config/apiConfig.js with basic configuration structure

---

## Phase 2: User Story 1 - Unified API Configuration Management

**Goal**: Developers can manage all backend API endpoints from a single configuration file instead of having them scattered across multiple service files.

**Priority**: P1

**Why this priority**: This improves maintainability - when API base URL changes, developers only need to update one file instead of multiple files, reducing errors and saving time.

**Independent Test**: After changing the API base URL in the config file, all API calls should use the new URL without modifying individual service files.

**Acceptance Criteria**:
- All API calls use URLs from centralized config (0 hardcoded URLs in service files)
- Changing API base URL requires modifying only 1 file
- Switching HTTP/HTTPS requires only protocol change in config
- Configuration file is easy to locate and update
- System handles missing/invalid configuration gracefully

---

### Configuration File Tasks

- [ ] T003 [US1] Implement environment detection in src/config/apiConfig.js
- [ ] T004 [US1] Export getApiBaseUrl() function in src/config/apiConfig.js

### Service Refactoring Tasks (Parallelizable)

- [ ] T005 [P] [US1] Refactor src/services/stockService.js to use apiConfig
- [ ] T006 [P] [US1] Refactor src/services/scriptService.js to use apiConfig
- [ ] T007 [P] [US1] Refactor src/services/scriptStorageService.js to use apiConfig
- [ ] T008 [P] [US1] Refactor src/utils/constants.js to use apiConfig

---

## Phase 3: Validation & Polish

**Goal**: Verify all changes work correctly and handle edge cases.

**Independent Test**: All API calls successfully use configuration from apiConfig.js, protocol can be switched, and base URL can be changed.

---

### Validation Tasks

- [ ] T009 Verify all API endpoints use centralized configuration and rebuild application

---

## Task Summary

| Phase | Task ID | Description | Files |
|-------|---------|-------------|-------|
| Setup | T001 | Create src/config directory | - |
| Setup | T002 | Create apiConfig.js | src/config/apiConfig.js |
| US1 | T003 | Implement environment detection | src/config/apiConfig.js |
| US1 | T004 | Export getApiBaseUrl() | src/config/apiConfig.js |
| US1 | T005 | Refactor stockService.js | src/services/stockService.js |
| US1 | T006 | Refactor scriptService.js | src/services/scriptService.js |
| US1 | T007 | Refactor scriptStorageService.js | src/services/scriptStorageService.js |
| US1 | T008 | Refactor constants.js | src/utils/constants.js |
| Polish | T009 | Verify and rebuild | - |

**Total**: 9 tasks

## Notes

- All [US1] tasks T005-T008 are parallelizable ([P] marker)
- No test tasks included per specification (manual verification)
- Configuration file structure defined in contracts/api-config-contracts.json
- Implementation examples provided in quickstart.md

