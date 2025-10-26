# Implementation Plan: Centralized API Configuration

**Branch**: `005-api-config` | **Date**: 2025-01-27 | **Spec**: [005-api-config/spec.md](spec.md)  
**Input**: Feature specification from `/specs/005-api-config/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create a centralized API configuration file to manage all backend API URLs and protocols (HTTP/HTTPS) in one place. Refactor existing service files (stockService.js, scriptService.js, scriptStorageService.js) and constants.js to import from the centralized config instead of hardcoding URLs.

## Technical Context

**Language/Version**: JavaScript (ES6+)  
**Primary Dependencies**: None (vanilla JavaScript configuration)  
**Storage**: File-based configuration (config/apiConfig.js or similar)  
**Testing**: Manual verification during implementation  
**Target Platform**: Web application (browser-based)  
**Project Type**: Web application  
**Performance Goals**: Configuration loading must not impact application startup time  
**Constraints**: Must support both HTTP and HTTPS, must handle environment-specific configs (dev/prod), must gracefully handle missing or invalid configuration  
**Scale/Scope**: 4 service files need refactoring, configuration file will be imported by all API service modules

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ File structure: Creating new config file in `src/config/` directory
- ✅ No comments policy: Configuration will use descriptive variable names
- ✅ Technology stack: No new dependencies needed, using existing JavaScript/ES6
- ✅ Code clarity: Configuration structure will be self-explanatory

No violations detected. Configuration management is a standard refactoring practice.

## Project Structure

### Documentation (this feature)

```text
specs/005-api-config/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── contracts/           # Phase 1 output (/speckit.plan command)
```

### Source Code (repository root)

```text
src/
├── config/
│   └── apiConfig.js     # Centralized API configuration (NEW)
├── services/
│   ├── stockService.js  # Refactor to use apiConfig
│   ├── scriptService.js # Refactor to use apiConfig
│   └── scriptStorageService.js # Refactor to use apiConfig
└── utils/
    └── constants.js     # Refactor to use apiConfig
```

**Structure Decision**: Single configuration file at `src/config/apiConfig.js` that exports API base URL and protocol. All service files import and use this configuration to construct full API URLs.

## Complexity Tracking

> **No violations - standard configuration refactoring**

## Implementation Approach

### Phase 0: Research & Design

1. **Research Configuration Patterns**: Study best practices for centralizing API configuration in JavaScript applications
2. **Design Configuration Structure**: Define the structure for the apiConfig.js file (base URL, protocol, endpoints, environment handling)

### Phase 1: Create Configuration File

1. **Create apiConfig.js**: Define centralized configuration with base URL and protocol settings
2. **Add Environment Support**: Implement environment detection (development vs production)
3. **Export Configuration**: Export an object with base URL, full endpoints, and protocol information

### Phase 2: Refactor Service Files

1. **Update stockService.js**: Replace hardcoded API_BASE with import from apiConfig
2. **Update scriptService.js**: Replace hardcoded API_BASE with import from apiConfig
3. **Update scriptStorageService.js**: Replace hardcoded API_BASE with import from apiConfig
4. **Update constants.js**: Refactor API_ENDPOINTS to use apiConfig base URL

### Phase 3: Validation & Testing

1. **Test Configuration Loading**: Verify config loads without errors
2. **Test All Endpoints**: Verify all API calls use correct URLs from config
3. **Test Protocol Switching**: Verify switching between HTTP and HTTPS works
4. **Test Environment Switching**: Verify different environments use correct base URLs

## Dependencies

- No external dependencies required
- Existing service files need refactoring
- No database changes required
- No UI changes required

## Success Criteria Validation

- **SC-001**: ✅ No hardcoded URLs in service files after refactoring
- **SC-002**: ✅ Changing API base URL requires modifying only apiConfig.js
- **SC-003**: ✅ Switching HTTP/HTTPS requires only protocol change in apiConfig.js
- **SC-004**: ✅ Configuration file is clearly located at src/config/apiConfig.js
- **SC-005**: ✅ Error handling for missing/invalid configuration will be implemented

## Next Steps

1. Generate research.md with configuration patterns
2. Create data-model.md defining the API config structure
3. Generate API contracts documentation
4. Create quickstart.md for implementation guide
5. Proceed to tasks generation with `/speckit.tasks`
