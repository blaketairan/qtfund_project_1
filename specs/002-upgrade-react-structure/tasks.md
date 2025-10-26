# Tasks: Upgrade to Production-Grade React Structure

**Input**: Design documents from `/specs/002-upgrade-react-structure/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Tests**: Not explicitly requested in specification - focusing on migration and verification

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Paths follow the repository structure:
- `src/` - Source code directory
- `src/pages/` - Page-level components
- `src/components/` - Reusable components
- `src/services/` - API and business logic
- `src/context/` - React context providers
- `src/utils/` - Utility functions
- `src/entities/` - Data entities (JSON schemas)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Backup original src/index.js to src/index.original.js
- [x] T002 Install React dependencies: react react-dom
- [x] T003 Install React Router: react-router-dom
- [x] T004 Install build tools: @babel/core @babel/preset-react babel-loader
- [x] T005 [P] Update webpack.config.js with Babel loader configuration
- [x] T006 [P] Create directory structure: src/components/{common,layout}
- [x] T007 [P] Create directory structure: src/pages
- [x] T008 [P] Create directory structure: src/{entities,services,utils,context}

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 [P] Create src/utils/constants.js with application constants
- [x] T010 [P] Create src/services/api.js for API client configuration
- [x] T011 [P] Create src/services/authService.js for authentication logic
- [x] T012 [P] Create src/context/AuthContext.jsx for global authentication state
- [x] T013 Install dependencies and verify build works
- [x] T014 Test that webpack compiles JSX successfully

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Maintain Existing Functionality (Priority: P1) 🎯 MVP

**Goal**: All existing functionality works identically after upgrade

**Independent Test**: Navigate through all pages (/, /login, /dashboard), perform login and logout flows, verify identical UI and behavior to original

### Migration Tasks

- [x] T015 [P] [US1] Extract HomePage component to src/pages/HomePage.jsx
- [x] T016 [P] [US1] Extract LoginPage component to src/pages/LoginPage.jsx
- [x] T017 [P] [US1] Extract DashboardPage component to src/pages/DashboardPage.jsx
- [x] T018 [US1] Migrate routing logic from index.js to React Router in src/App.jsx
- [x] T019 [US1] Implement 404 error handling in src/App.jsx with NotFound component
- [x] T020 [US1] Create src/App.jsx with BrowserRouter and route configuration
- [x] T021 [US1] Update src/index.js to render App component with React
- [x] T022 [US1] Test navigation between all pages
- [x] T023 [US1] Verify login flow works identically to original
- [x] T024 [US1] Verify dashboard displays correctly
- [x] T025 [US1] Verify logout functionality works
- [x] T026 [US1] Test API calls from dashboard match original behavior
- [x] T027 [US1] Verify all UI text and styling matches original exactly

**Checkpoint**: User Story 1 complete - all pages function identically to original

---

## Phase 4: User Story 2 - Improve Development Experience (Priority: P2)

**Goal**: Code is organized such that developers can easily add features and locate functionality

**Independent Test**: Add a test page component following the established structure and verify it integrates without modifying existing code

### Code Organization Tasks

- [x] T028 [P] [US2] Create src/components/common/ErrorMessage.jsx for reusable error display
- [x] T029 [P] [US2] Create src/components/layout/Layout.jsx for main app layout wrapper
- [x] T030 [P] [US2] Create src/entities/user.json with user entity schema definition
- [x] T031 [US2] Refactor LoginPage to use reusable ErrorMessage component
- [x] T032 [US2] Refactor DashboardPage to use Layout component for consistency
- [x] T033 [US2] Extract shared constants to src/utils/constants.js (API endpoints, routes)
- [x] T034 [US2] Create README.md documenting the new project structure
- [x] T035 [US2] Document how to add new pages following the structure in README.md
- [x] T036 [US2] Verify developer can understand structure by reviewing code organization

**Checkpoint**: Code is well-organized and documented for easy development

---

## Phase 5: User Story 3 - Enable Scalable Architecture (Priority: P2)

**Goal**: Architecture supports future growth without degradation

**Independent Test**: Add a new test route and verify existing routes continue to work independently

### Scalability Tasks

- [x] T037 [P] [US3] Ensure routes in App.jsx are modular and independently testable
- [x] T038 [P] [US3] Verify no global state pollution (check window object, etc.)
- [x] T039 [US3] Document component dependency graph in architecture notes
- [x] T040 [US3] Verify service layer (authService, api) follows single responsibility
- [x] T041 [US3] Ensure context providers don't have unnecessary dependencies
- [x] T042 [US3] Test that adding a new page doesn't affect existing pages
- [x] T043 [US3] Verify build process scales (no performance degradation)
- [x] T044 [US3] Document scalability patterns for future developers

**Checkpoint**: Architecture supports growth without refactoring existing code

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation across all features

- [x] T045 [P] Run quickstart.md validation checklist from specs documentation
- [x] T046 [P] Remove backup file src/index.original.js if migration successful
- [x] T047 Update package.json with project metadata and scripts
- [x] T048 Verify all files follow project constitution (file structure, no comments)
- [x] T049 Final visual comparison with original application
- [x] T050 Performance testing - ensure no degradation from original
- [x] T051 Integration testing - test all user flows end-to-end
- [x] T052 Build production bundle and verify output is correct
- [x] T053 [P] Create deployment notes documenting what changed and how to deploy

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel if staffed
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1 - MVP)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May reference US1 components but independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but independently testable

### Within Each User Story

- Component extraction can run in parallel
- Routing integration happens after component extraction
- Testing happens after implementation
- Core implementation before integration verification

### Parallel Opportunities

- Setup tasks T005-T008 can run in parallel (different configurations)
- Foundational tasks T009-T012 can run in parallel (different files)
- User Story 1 component extractions T015-T017 can run in parallel (different pages)
- User Story 2 component creation T028-T030 can run in parallel
- Polish tasks T045-T046 and T051-T053 can run in parallel

---

## Parallel Example: User Story 1

```bash
# All component extractions can run in parallel:
Task: "Extract HomePage component to src/pages/HomePage.jsx"
Task: "Extract LoginPage component to src/pages/LoginPage.jsx"  
Task: "Extract DashboardPage component to src/pages/DashboardPage.jsx"

# After components exist, routing tasks run:
Task: "Migrate routing logic to React Router"
Task: "Implement 404 error handling"
Task: "Create App.jsx with BrowserRouter"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test all flows independently
5. Verify identical functionality to original

This gives you a fully functional React app with identical behavior to the original

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP with full functionality!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Polish → Final deployment

Each phase adds value without breaking previous functionality

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Migration)
   - Developer B: User Story 2 (Organization) in parallel
   - Developer C: User Story 3 (Scalability) in parallel
3. Stories complete and integrate independently
4. Team reviews together for Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [US1], [US2], [US3] labels map to user stories for traceability
- Each user story is independently completable and testable
- Keep original behavior intact throughout migration
- Commit after each task or logical group
- Stop at any checkpoint to validate functionality
- Visual regression testing at each phase
- Maintain API contracts unchanged

