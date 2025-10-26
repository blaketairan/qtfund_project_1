# Data Model: Centralized API Configuration

**Feature**: 005-api-config  
**Created**: 2025-01-27

## Entity: API Configuration

### Definition

The API configuration entity manages all backend API connection settings in a centralized location.

### Fields

- **baseUrl** (string): The base domain for all API calls (e.g., "qtfund.com")
- **protocol** (string): The protocol to use for API calls ("http" or "https")
- **apiPath** (string): The base path for all API endpoints (e.g., "/api")
- **environment** (string): Current environment ("development" or "production")
- **fullBaseUrl** (string, computed): Combined protocol + baseUrl + apiPath for convenient usage

### Validation Rules

- **protocol**: Must be "http" or "https", defaults to "https"
- **baseUrl**: Must be a valid domain name (no protocol, no path), cannot be empty
- **apiPath**: Must start with "/", defaults to "/api"
- **environment**: Must be "development" or "production"

### State Transitions

Configuration is loaded once at application startup and remains constant during runtime.

**Initial State**: Configuration file defines environment and base settings

**Loading State**: Configuration is imported by service files

**Active State**: All API calls use the configuration

**Error State**: If configuration is invalid, fallback to production defaults

### Relationships

- **Imported by**: stockService.js, scriptService.js, scriptStorageService.js, constants.js
- **Defines**: All backend API endpoints for the application
- **Contains**: Base URL, protocol, and API path for constructing full URLs

## Entity: Service API Endpoints

### Definition

Individual API endpoints that services will call, constructed from base configuration.

### Fields

- **stockList** (string): Full URL for stock list endpoint
- **stockInfo** (string): Full URL for stock info endpoint
- **stockQuery** (string): Full URL for stock query endpoint
- **customCalculationsExecute** (string): Full URL for script execution endpoint
- **customCalculationsScripts** (string): Full URL for script CRUD endpoint

### Construction Pattern

```
{protocol}://{baseUrl}{apiPath}{endpoint}
```

Example: `https://qtfund.com/api/stock-price/list`

### Source of Truth

All endpoint paths are defined in the centralized configuration. Service files construct full URLs using the base configuration + endpoint paths.

## Configuration Structure

```javascript
{
  environment: "production" | "development",
  protocol: "http" | "https",
  baseUrl: string,
  apiPath: string,
  fullBaseUrl: string (computed)
}
```

### Example Configuration

```javascript
{
  environment: "production",
  protocol: "https",
  baseUrl: "qtfund.com",
  apiPath: "/api",
  fullBaseUrl: "https://qtfund.com/api"
}
```

