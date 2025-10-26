# Feature Specification: Centralized API Configuration

**Feature Branch**: `005-api-config`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "搞一个配置文件统一管理后端域名及http/https。不要像现在分散到各个文件"

## User Scenarios & Testing

### User Story 1 - Unified API Configuration Management (Priority: P1)

Developers can manage all backend API endpoints from a single configuration file instead of having them scattered across multiple service files.

**Why this priority**: This improves maintainability - when API base URL changes, developers only need to update one file instead of multiple files, reducing errors and saving time.

**Independent Test**: After changing the API base URL in the config file, all API calls should use the new URL without modifying individual service files.

**Acceptance Scenarios**:

1. **Given** the centralized config file exists, **When** developers update the API base URL, **Then** all service files automatically use the new URL
2. **Given** API URLs are stored in the config file, **When** developers view service files, **Then** they reference the config instead of hardcoded URLs
3. **Given** the config supports environment-based URLs, **When** switching between development and production, **Then** different API base URLs are used automatically
4. **Given** the config file defines protocol (HTTP/HTTPS), **When** API calls are made, **Then** they use the correct protocol as specified in config

---

### Edge Cases

- What happens when the config file is missing or corrupted?
- How does the system handle missing API endpoint definitions?
- What happens when switching between HTTP and HTTPS?
- How does the system handle invalid URL format in config?

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide a centralized configuration file for all API endpoints
- **FR-002**: Configuration MUST define the API base URL (protocol + domain)
- **FR-003**: Configuration MUST support both HTTP and HTTPS protocols
- **FR-004**: Configuration MUST support environment-based configuration (dev/prod)
- **FR-005**: All service files MUST import and use the centralized configuration
- **FR-006**: Configuration MUST include all endpoints (stock data, custom calculations, scripts)
- **FR-007**: System MUST handle configuration loading errors gracefully
- **FR-008**: Configuration MUST be easily updatable without modifying service code

### Non-Functional Requirements

- **NFR-001**: Configuration loading MUST not impact application startup time
- **NFR-002**: Configuration changes MUST be immediately effective after restart
- **NFR-003**: Configuration file MUST be human-readable (JSON or similar)
- **NFR-004**: Configuration MUST validate URL format to prevent runtime errors

## Success Criteria

### Measurable Outcomes

- **SC-001**: All API calls use URLs from centralized config (0 hardcoded URLs in service files)
- **SC-002**: Changing API base URL requires modifying only 1 file
- **SC-003**: Switching between HTTP and HTTPS requires only protocol change in config
- **SC-004**: Configuration file is easy to locate and update
- **SC-005**: System handles missing or invalid configuration gracefully

### Key Entities

- **API Configuration**: Centralized file containing base URL, protocol, and all endpoint paths
- **Service Files**: Source files that import and use the API configuration
- **Environment Config**: Different configurations for development vs production environments

## Assumptions

1. Configuration will be stored in a single file (e.g., config/apiConfig.js)
2. All existing service files will be refactored to use the centralized config
3. The configuration will support both protocol (http/https) and base domain
4. Individual endpoints are defined as relative paths (e.g., "/api/stock-price/list")
5. Configuration loading happens at application startup
6. Environment can be determined from build process or environment variables
