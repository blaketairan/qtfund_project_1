# Quickstart: Centralized API Configuration

**Feature**: 005-api-config  
**Created**: 2025-01-27

## Overview

This feature centralizes all API configuration (base URL, protocol, environment) into a single file (`src/config/apiConfig.js`) and refactors existing service files to use this configuration instead of hardcoded URLs.

## Current State

API URLs are currently scattered across multiple files:
- `src/services/stockService.js`: `const API_BASE = 'https://qtfund.com/api';`
- `src/services/scriptService.js`: `const API_BASE = 'https://qtfund.com/api';`
- `src/services/scriptStorageService.js`: `const API_BASE = 'https://qtfund.com/api';`
- `src/utils/constants.js`: Hardcoded endpoints in `API_ENDPOINTS` object

## Implementation Steps

### 1. Create Configuration File

Create `src/config/apiConfig.js`:

```javascript
const isDev = process.env.NODE_ENV === 'development';

export const API_CONFIG = {
  environment: isDev ? 'development' : 'production',
  protocol: 'https',
  baseUrl: 'qtfund.com',
  apiPath: '/api',
};

export const getApiBaseUrl = () => {
  return `${API_CONFIG.protocol}://${API_CONFIG.baseUrl}${API_CONFIG.apiPath}`;
};
```

### 2. Refactor stockService.js

Replace hardcoded API_BASE with import:

```javascript
import { getApiBaseUrl } from '../config/apiConfig.js';

const API_BASE = getApiBaseUrl();

export const fetchStockList = async (options = {}) => {
  const params = new URLSearchParams();
  if (options.market_code) params.append('market_code', options.market_code);
  if (options.is_active !== undefined) params.append('is_active', options.is_active);
  if (options.limit) params.append('limit', options.limit);
  if (options.offset) params.append('offset', options.offset);

  const response = await fetch(`${API_BASE}/stock-price/list?${params}`);
  const data = await response.json();
  return data;
};
```

### 3. Refactor scriptService.js

Update to use centralized config:

```javascript
import { getApiBaseUrl } from '../config/apiConfig.js';

const API_BASE = getApiBaseUrl();

export const executeScript = async (scriptConfig) => {
  const { script, script_id, column_name, stock_symbols } = scriptConfig;
  
  const body = script_id 
    ? { script_id, column_name, stock_symbols }
    : { script, column_name, stock_symbols };

  const response = await fetch(`${API_BASE}/custom-calculations/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  return data;
};
```

### 4. Refactor scriptStorageService.js

Update to use centralized config:

```javascript
import { getApiBaseUrl } from '../config/apiConfig.js';

const API_BASE = getApiBaseUrl();

export const createScript = async (script) => {
  const response = await fetch(`${API_BASE}/custom-calculations/scripts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(script)
  });
  return await response.json();
};

export const getScripts = async () => {
  const response = await fetch(`${API_BASE}/custom-calculations/scripts`);
  return await response.json();
};

export const getScript = async (id) => {
  const response = await fetch(`${API_BASE}/custom-calculations/scripts/${id}`);
  return await response.json();
};

export const updateScript = async (id, script) => {
  const response = await fetch(`${API_BASE}/custom-calculations/scripts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(script)
  });
  return await response.json();
};

export const deleteScript = async (id) => {
  const response = await fetch(`${API_BASE}/custom-calculations/scripts/${id}`, {
    method: 'DELETE'
  });
  return await response.json();
};
```

### 5. Refactor constants.js

Update to use centralized config:

```javascript
import { getApiBaseUrl } from '../config/apiConfig.js';

const API_BASE = getApiBaseUrl();

export const API_BASE_URL = '/api';

export const API_ENDPOINTS = {
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_LOGOUT: `${API_BASE_URL}/auth/logout`,
  USERS: `${API_BASE_URL}/users`,
  STOCK_LIST: `${API_BASE}/stock-price/list`,
  STOCK_INFO: `${API_BASE}/stock-price/info`,
  STOCK_QUERY: `${API_BASE}/stock-price/query`,
  CUSTOM_CALCULATIONS_EXECUTE: `${API_BASE}/custom-calculations/execute`,
  CUSTOM_CALCULATIONS_SCRIPTS: `${API_BASE}/custom-calculations/scripts`,
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
};

export const DEFAULT_CREDENTIALS = {
  USERNAME: 'admin',
  PASSWORD: 'admin123',
};
```

## Verification

### 1. Check Configuration File

```bash
cat src/config/apiConfig.js
```

Verify the configuration structure is correct.

### 2. Test API Calls

Start the application:

```bash
npm start
```

Check browser console for API calls - they should all use the base URL from `apiConfig.js`.

### 3. Verify Protocol and Domain

Open developer tools → Network tab and verify all API requests go to:
- Protocol: `https`
- Domain: `qtfund.com`

### 4. Test Configuration Change

Update `src/config/apiConfig.js`:

```javascript
protocol: 'http',  // Temporarily change to http
```

Rebuild and verify requests use the new protocol.

## Switching Between HTTP and HTTPS

To switch protocols, modify only one line in `src/config/apiConfig.js`:

```javascript
protocol: 'https',  // or 'http'
```

All API calls will automatically use the new protocol.

## Changing API Base URL

To change the backend domain, modify only the baseUrl in `src/config/apiConfig.js`:

```javascript
baseUrl: 'localhost:8000',  // For local development
```

All API calls will automatically use the new base URL.

## Troubleshooting

### Issue: "Cannot find module '../config/apiConfig.js'"

**Solution**: Ensure the directory structure is correct:

```bash
mkdir -p src/config
```

### Issue: API calls still use old URLs

**Solution**: Rebuild the application:

```bash
npm run build
npm start
```

### Issue: Configuration not loading

**Solution**: Check the import path is correct in service files:

```javascript
import { getApiBaseUrl } from '../config/apiConfig.js';
```

## Next Steps

After completing this refactoring:

1. All API URLs are centralized in `src/config/apiConfig.js`
2. Changing protocol or base URL requires modifying only one file
3. Service files are cleaner and easier to maintain
4. Configuration is environment-aware (dev/prod)

