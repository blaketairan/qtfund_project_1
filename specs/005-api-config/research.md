# Technical Research: Centralized API Configuration

**Feature**: 005-api-config  
**Created**: 2025-01-27

## Configuration File Location

**Decision**: Create configuration file at `src/config/apiConfig.js`

**Rationale**: 
- Follows standard project structure pattern (`src/config/`)
- Keeps configuration separate from services and utilities
- Easy to locate and maintain
- Consistent with existing codebase structure (src/services/, src/utils/)

**Alternatives considered**:
- `src/config.js` - Too generic, doesn't indicate it's API-specific
- `src/services/apiConfig.js` - Conflicts with service layer separation
- `src/utils/apiConfig.js` - Not a utility, it's application configuration
- Root directory - Doesn't follow project's src/ structure

## Configuration Structure

**Decision**: Use JavaScript module exports with environment detection

**Rationale**:
- No need for additional dependencies (pure JavaScript)
- Simple import/export pattern already used in project
- Allows environment-based configuration
- Easy to read and modify
- Supports both protocol and base URL configuration

**Alternatives considered**:
- JSON file - Requires parsing, no environment support without additional logic
- Environment variables - Would require build-time configuration changes
- XML/YAML - Unnecessary complexity for simple key-value config

## Protocol and Base URL Management

**Decision**: Store protocol and base URL separately, combine when needed

**Rationale**:
- Easy to switch between HTTP and HTTPS
- Clean separation of concerns
- Supports both relative and absolute URLs
- Simplifies validation

**Alternatives considered**:
- Storing full URL (https://qtfund.com/api) - Harder to modify protocol only
- URL object - Overkill for simple configuration
- Multiple base URLs for each service - Unnecessary duplication

## Environment Detection

**Decision**: Use process.env.NODE_ENV or default to production

**Rationale**:
- Standard Node.js/bundler approach
- Simple and reliable
- No additional dependencies
- Production-safe default

**Alternatives considered**:
- Window.location for environment - Too complex, unnecessary
- Separate config files per environment - Overkill for this use case
- External configuration service - Unnecessary for static configuration

## Error Handling Strategy

**Decision**: Provide default configuration and throw descriptive errors

**Rationale**:
- Graceful degradation with sensible defaults
- Clear error messages help debugging
- Prevents silent failures
- Maintains application stability

**Alternatives considered**:
- Fail fast without defaults - Too brittle for production
- Silent failures - Makes debugging difficult
- External validation - Adds unnecessary complexity

## Integration with Existing Services

**Decision**: Import base URL and construct full endpoints in each service file

**Rationale**:
- Services maintain control over their specific endpoints
- Base URL is centralized
- Easy to understand what each service is calling
- Follows existing service file patterns

**Alternatives considered**:
- Pre-constructed full URLs in config - Less flexible for query params
- Central endpoint registry - Overengineered for current needs
- Service-specific configs - Defeats the purpose of centralization

