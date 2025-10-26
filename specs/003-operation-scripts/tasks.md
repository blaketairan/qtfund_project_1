# Tasks: Operation Scripts

**Input**: Design documents from `/specs/003-operation-scripts/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Tests**: Not explicitly requested in specification - manual verification

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Paths follow the repository structure:
- `bin/` - Executable scripts directory (repository root)
- All scripts are at repository root level in `bin/` directory

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory structure and prepare project

- [x] T001 Create bin/ directory at repository root
- [x] T002 Verify scripts will have execute permissions

---

## Phase 2: User Story 1 - Setup Environment (Priority: P1) 🎯 MVP - Setup First

**Goal**: Developers can install dependencies with a single command

**Independent Test**: Run `./bin/setup.sh` and verify Node.js version check, npm install completes successfully

### Implementation Tasks

- [x] T003 [P] [US1] Create bin/setup.sh with shebang line #!/bin/bash
- [x] T004 [US1] Add prerequisite check for Node.js in bin/setup.sh
- [x] T005 [US1] Add prerequisite check for npm in bin/setup.sh
- [x] T006 [US1] Add package.json existence check in bin/setup.sh
- [x] T007 [US1] Add node_modules existence check for idempotency in bin/setup.sh
- [x] T008 [US1] Add npm install execution in bin/setup.sh
- [x] T009 [US1] Add success message output in bin/setup.sh
- [x] T010 [US1] Add error handling for each step in bin/setup.sh
- [x] T011 [US1] Test setup.sh on clean system
- [x] T012 [US1] Test setup.sh idempotency (run twice)
- [x] T013 [US1] Verify dependencies install correctly

**Checkpoint**: Setup environment complete - ready for development

---

## Phase 3: User Story 2 - Start Application (Priority: P1)

**Goal**: Developers can start the application with a single command

**Independent Test**: Run `./bin/start.sh` and verify webpack dev server starts on port 3000

### Implementation Tasks

- [x] T014 [P] [US2] Create bin/start.sh with shebang line #!/bin/bash
- [x] T015 [US2] Add port 3000 availability check using lsof in bin/start.sh
- [x] T016 [US2] Add webpack process check using pgrep in bin/start.sh
- [x] T017 [US2] Add error handling for port conflicts in bin/start.sh
- [x] T018 [US2] Add webpack start command execution in bin/start.sh
- [x] T019 [US2] Add process logging in bin/start.sh
- [x] T020 [US2] Add success message output in bin/start.sh
- [x] T021 [US2] Test start.sh when application is not running
- [x] T022 [US2] Test start.sh when application is already running
- [x] T023 [US2] Verify webpack dev server starts correctly

**Checkpoint**: Start script complete - application can be launched

---

## Phase 4: User Story 3 - Health Check (Priority: P1)

**Goal**: Developers and CI/CD can verify application health status

**Independent Test**: Run `./bin/health.sh` and verify it reports application is healthy when running

### Implementation Tasks

- [x] T024 [P] [US3] Create bin/health.sh with shebang line #!/bin/bash
- [x] T025 [US3] Add webpack process check using pgrep in bin/health.sh
- [x] T026 [US3] Add port 3000 listening check using lsof in bin/health.sh
- [x] T027 [US3] Add HTTP health check using curl in bin/health.sh
- [x] T028 [US3] Add exit code handling (0=healthy, 1=unhealthy) in bin/health.sh
- [x] T029 [US3] Add status message output in bin/health.sh
- [x] T030 [US3] Test health.sh when application is running
- [x] T031 [US3] Test health.sh when application is not running
- [x] T032 [US3] Verify HTTP response code checking works

**Checkpoint**: Health check complete - status can be verified

---

## Phase 5: User Story 4 - Stop Application (Priority: P1)

**Goal**: Developers can cleanly stop the application with a single command

**Independent Test**: Run `./bin/stop.sh` and verify all webpack processes stop and port is released

### Implementation Tasks

- [x] T033 [P] [US4] Create bin/stop.sh with shebang line #!/bin/bash
- [x] T034 [US4] Add webpack process detection using pgrep in bin/stop.sh
- [x] T035 [US4] Add TERM signal handling for graceful shutdown in bin/stop.sh
- [x] T036 [US4] Add 2 second wait after TERM signal in bin/stop.sh
- [x] T037 [US4] Add KILL signal handling if process still running in bin/stop.sh
- [x] T038 [US4] Add port release verification in bin/stop.sh
- [x] T039 [US4] Add success message output in bin/stop.sh
- [x] T040 [US4] Add handling for already stopped case in bin/stop.sh
- [x] T041 [US4] Test stop.sh when application is running
- [x] T042 [US4] Test stop.sh when application is not running
- [x] T043 [US4] Verify no orphaned processes remain

**Checkpoint**: Stop script complete - application can be cleanly terminated

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation

- [x] T044 [P] Set execute permissions on all bin/*.sh scripts
- [x] T045 Test all scripts on macOS system
- [x] T046 Test all scripts on Linux system
- [x] T047 Verify scripts handle errors gracefully
- [x] T048 Verify output messages are clear and informative
- [x] T049 Test complete workflow: setup -> start -> health -> stop
- [x] T050 Update README.md to document bin scripts usage
- [x] T051 Add bin scripts to .gitignore if needed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Stories (Phase 2-5)**: Can run independently or in sequence
  - User Story 1 (Setup) should typically run first to prepare environment
  - User Story 2 (Start) depends on setup being complete
  - User Story 3 (Health) can be tested after Start is working
  - User Story 4 (Stop) can be implemented and tested independently
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (Setup)**: No dependencies - can start immediately
- **User Story 2 (Start)**: Depends on User Story 1 for dependency installation
- **User Story 3 (Health)**: Depends on User Story 2 for running application
- **User Story 4 (Stop)**: Can be implemented independently but requires running application to test

### Within Each User Story

- Script creation before logic implementation
- Prerequisite checks before main operations
- Error handling added throughout
- Testing after implementation

### Parallel Opportunities

- Scripts T003, T014, T024, T033 can be created in parallel (different files)
- Script logic implementation can be developed independently
- Testing can be done in parallel on different systems (macOS/Linux)

---

## Parallel Example: All Scripts Creation

```bash
# All script skeletons can be created in parallel:
Task: "Create bin/setup.sh with shebang"
Task: "Create bin/start.sh with shebang"
Task: "Create bin/health.sh with shebang"
Task: "Create bin/stop.sh with shebang"

# Then add logic sequentially as dependencies require
```

---

## Implementation Strategy

### MVP First (Setup Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: User Story 1 (Setup environment)
3. **STOP and VALIDATE**: Test setup script independently
4. Verify dependencies install correctly

This enables developers to get the project running

### Incremental Delivery

1. Complete Setup + User Story 1 → Environment ready
2. Add User Story 2 → Application can start
3. Add User Story 3 → Health check available
4. Add User Story 4 → Application can stop cleanly
5. Complete Polish → Production ready

Each phase adds operational capability without breaking previous functionality

### Sequential Workflow (Recommended)

For optimal testing:

1. **Setup**: Install dependencies
2. **Start**: Launch application
3. **Health**: Verify running status
4. **Stop**: Cleanly terminate

This natural workflow tests each script in order

---

## Notes

- [P] tasks = different files, no dependencies
- [US1], [US2], [US3], [US4] labels map to user stories for traceability
- Each user story is independently completable and testable
- Scripts must be idempotent (safe to run multiple times)
- All scripts must work on both Linux and macOS
- Commit after each script implementation
- Test after each user story completion
- Verify cross-platform compatibility

