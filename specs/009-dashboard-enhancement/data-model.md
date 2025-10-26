# Data Model: Dashboard UI Enhancement

**Feature**: 009-dashboard-enhancement  
**Date**: 2025-01-27  
**Purpose**: Define UI state, navigation data, and script editor state

## Entities

### Navigation State

**Source**: React Router + AuthContext  
**Entity Name**: `NavigationState`  
**Purpose**: Tracks current page, user information, and authentication status

#### Fields

| Field Name | Type | Required | Description | Source |
|-----------|------|----------|-------------|---------|
| `currentPath` | String | Yes | Current route path (e.g., "/dashboard") | React Router |
| `isAuthenticated` | Boolean | Yes | User authentication status | AuthContext |
| `userInfo` | Object | No | Current user information (name, email) | AuthContext |
| `isVisible` | Boolean | Yes | Whether navigation bar should be visible | Route-based logic |

#### Navigation State Logic

```javascript
{
  currentPath: "/dashboard",
  isAuthenticated: true,
  userInfo: { name: "张三", email: "zhangsan@example.com" },
  isVisible: true  // false for login page only
}
```

---

### Script Editor State

**Source**: React Component State  
**Entity Name**: `ScriptEditorState`  
**Purpose**: Manages script editor panel visibility and content

#### Fields

| Field Name | Type | Required | Description | Display Rules |
|-----------|------|----------|-------------|---------------|
| `isOpen` | Boolean | Yes | Whether script editor panel is visible | Controls panel display |
| `scriptContent` | String | No | Current script code being edited | Shown in editor |
| `hasUnsavedChanges` | Boolean | No | Whether there are unsaved changes | Used to show warning |
| `activeColumns` | Array<String> | No | Custom columns created by scripts | Displayed in table |

#### Validation Rules

1. **Script Content**: CAN be empty when editor first opens
2. **Active Columns**: MUST be preserved across page refreshes (localStorage)
3. **Unsaved Changes**: SHOULD show warning before closing if true

---

### UI Theme State

**Source**: Tailwind CSS Classes  
**Entity Name**: `ThemeConfig`  
**Purpose**: Defines consistent styling across all components

#### Fields

| Field Name | Type | Required | Description |
|-----------|------|----------|-------------|
| `primaryColor` | String | Yes | Main brand color |
| `backgroundColor` | String | Yes | Background color scheme |
| `textColor` | String | Yes | Primary text color |
| `borderColor` | String | Yes | Border and divider colors |
| `interactiveColor` | String | Yes | Hover/active state colors |

#### Current Theme Values

```javascript
{
  primaryColor: "blue",
  backgroundColor: "gray-100 (light), gray-900 (dark)",
  textColor: "gray-900",
  borderColor: "gray-200",
  interactiveColor: "gray-50 (hover), blue-600 (active)"
}
```

---

### User Display Data

**Source**: AuthContext  
**Entity Name**: `UserDisplayData`  
**Purpose**: User information to display in navigation

#### Fields

| Field Name | Type | Required | Description | Display Rules |
|-----------|------|----------|-------------|---------------|
| `username` | String | Yes | User's display name | Shown in nav bar |
| `email` | String | No | User's email address | Optional, in dropdown |
| `isAuthenticated` | Boolean | Yes | Authentication status | Controls nav display |

#### Relationships

- **UserDisplayData** → **NavigationBar**: Displays user name and logout
- **UserDisplayData** → **AuthContext**: Read-only, managed by AuthContext

---

## Data Flow

### Navigation Bar Data Flow

```
AuthContext (isAuthenticated, userInfo)
    ↓
NavigationBar Component
    ↓
    Reads: isAuthenticated, userInfo
    Displays: User name, Logout button OR Login button
    Calls: logout() from AuthContext on button click
    ↓
React Router (on logout)
    ↓
    Navigates to /login
```

### Script Editor Data Flow

```
User clicks "Script Editor" button
    ↓
    Toggle: isOpen state
    ↓
    Panel opens/closes
    ↓
User edits script
    ↓
    Update: scriptContent state
    ↓
User saves script
    ↓
    Execute script via backend API
    ↓
    Add column to table: activeColumns
    ↓
localStorage: Persist activeColumns
```

---

## State Management

### Local Component State

**Components using local state**:
- `NavigationBar`: Menu dropdown open/closed
- `DashboardPage`: Script editor panel visibility
- `ScriptEditor`: Script content being edited

**State patterns**:
```javascript
const [isOpen, setIsOpen] = useState(false);
const [activeMenuItem, setActiveMenuItem] = useState(null);
const [userMenuOpen, setUserMenuOpen] = useState(false);
```

### Context State

**AuthContext** (existing):
- isAuthenticated
- userInfo
- logout()

**DashboardContext** (existing):
- stocks
- filteredStocks
- customScripts

### Persistent State (localStorage)

**Navigation preferences**: 
- None currently stored (all transient)

**Script editor state**:
- activeColumns: Array of active script columns
- scriptConfigurations: User's saved scripts

---

## Constraints

### Authentication Flow

1. **Logged In State**: Navigation shows username + logout button
2. **Logged Out State**: Navigation shows login button
3. **Logout Action**: Calls AuthContext.logout() → redirects to /login

### Script Editor Constraints

1. **Visibility**: Controlled by button click (panel open/close)
2. **Persistence**: Saved scripts persist in localStorage
3. **Backend Execution**: Scripts execute via existing script API
4. **Column Creation**: Active columns added to table dynamically

### UI Styling Constraints

1. **Tailwind Only**: Use existing Tailwind CSS classes
2. **Responsive**: Support mobile, tablet, desktop layouts
3. **Color Scheme**: Maintain existing gray palette
4. **Interactive States**: All buttons have hover/active states

---

## Summary

- **Navigation State**: Transient, managed by React Router + AuthContext
- **Script Editor State**: Persistent in localStorage, managed locally
- **User Display**: Read-only from AuthContext
- **UI Theme**: Static configuration, applied via Tailwind classes
- **No database**: All UI enhancement is frontend-only

