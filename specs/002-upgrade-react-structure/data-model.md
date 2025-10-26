# Data Model: Upgrade to Production-Grade React Structure

**Feature**: 002-upgrade-react-structure  
**Date**: 2025-01-27

## Application State Model

### Authentication State

```json
{
  "isAuthenticated": "boolean - indicates if user is logged in",
  "user": {
    "username": "string - current user's username",
    "sessionToken": "string - authentication token (stored via cookies)"
  },
  "loading": "boolean - indicates if authentication is in progress",
  "error": "string|null - error message if authentication fails"
}
```

**State Management**:
- Current implementation: Global variables and DOM inspection
- Target implementation: React Context API for global auth state
- Persistence: Browser cookies (maintained from original implementation)

### Routing State

```json
{
  "currentPath": "string - current URL path",
  "history": "array - navigation history stack",
  "previousPath": "string|null - previous route before navigation"
}
```

**State Management**:
- Current implementation: Custom router class with history API
- Target implementation: React Router location and navigation state

### UI State (Per Page)

#### Login Page State
```json
{
  "username": "string - input field value",
  "password": "string - input field value",
  "message": "string|null - status message to display",
  "loading": "boolean - submit in progress"
}
```

#### Dashboard Page State
```json
{
  "userInfo": "string - user status display",
  "apiResult": "string|null - result of API test call",
  "loading": "boolean - data loading state"
}
```

**State Management**:
- Target implementation: React useState hooks for component-local state

## API Contract Entities

### User Entity

```json
{
  "username": "string - unique identifier",
  "sessionActive": "boolean - session validity"
}
```

### Authentication Request
```json
{
  "username": "string - login username",
  "password": "string - login password",
  "use_cookie": "boolean - whether to use cookie authentication"
}
```

### Authentication Response
```json
{
  "success": "boolean - authentication result",
  "message": "string - response message",
  "error": "string|null - error details if failed"
}
```

## Component Data Flow

### Landing Page → Login Navigation
**Flow**: Click Login button → Update route → Render LoginPage component

### Login → Dashboard Navigation
**Flow**: Submit credentials → API call → Update auth state → Redirect to dashboard → Render DashboardPage component

### Dashboard → Logout Flow
**Flow**: Click logout → API call → Clear auth state → Redirect to login → Render LoginPage component

### API Test Flow (Dashboard)
**Flow**: Click test button → API call to /api/users → Display result in UI

## State Persistence

**Current Implementation**:
- Authentication tokens stored via cookies from backend
- No local storage usage
- Session management handled by backend

**Target Implementation**:
- Maintain same cookie-based authentication
- Use React Context to sync auth state with cookies
- No change to backend API contract needed

## Component Props Interfaces

### App Component
```typescript
interface AppProps {
  // No props needed - root component
}
```

### LoginPage Component
```typescript
interface LoginPageProps {
  // No props - uses context for routing
}
```

**Local State**:
- username: string
- password: string
- message: string | null
- loading: boolean

### DashboardPage Component
```typescript
interface DashboardPageProps {
  // No props - uses context for routing
}
```

**Local State**:
- userInfo: string
- apiResult: string | null

## Context Providers

### AuthContext

```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    username: string;
  } | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  loading: boolean;
  error: string | null;
}
```

**Provider Location**: Wraps entire application at App level  
**Consumer**: All page components that need auth state

## Event Handlers

### Login Form Submit Handler
```typescript
onSubmit: (event: FormEvent) => Promise<void>
```
- Prevents default form submission
- Calls API with credentials
- Updates auth context on success
- Displays error on failure
- Redirects to dashboard on success

### Logout Handler
```typescript
onClick: () => Promise<void>
```
- Calls logout API
- Clears auth context
- Redirects to login page

### API Test Handler
```typescript
onClick: () => Promise<void>
```
- Calls /api/users endpoint
- Displays result in UI
- Handles errors gracefully

### Navigation Handlers
```typescript
onClick: (path: string) => void
```
- Updates URL via router
- Triggers component re-render
- Maintains history API behavior

## Entity Relationships

```
Application
├── AuthContext (global state)
│   └── User entity
├── Routes
│   ├── HomePage
│   ├── LoginPage
│   └── DashboardPage
└── Services
    ├── AuthService
    └── ApiService
```

## Data Validation

**No validation entities required** - this refactoring maintains exact same validation behavior:
- Form validation handled by HTML5 required attributes
- API validation handled by backend
- No new validation logic needed

