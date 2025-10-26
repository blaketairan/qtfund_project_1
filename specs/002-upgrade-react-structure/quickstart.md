# Quick Start Guide: Upgraded QTFund Frontend

**Feature**: 002-upgrade-react-structure  
**Date**: 2025-01-27

## Before Migration Checklist

- [ ] Current application is running and functional
- [ ] All user flows tested and documented
- [ ] Git branch created: `002-upgrade-react-structure`
- [ ] Backup of original `src/index.js` created

## Setup Commands

### Step 1: Install Dependencies

```bash
npm install react react-dom react-router-dom
npm install --save-dev @babel/core @babel/preset-react babel-loader
```

### Step 2: Update Webpack Configuration

Add babel loader for JSX transformation:

```javascript
module: {
  rules: [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react']
        }
      }
    }
  ]
}
```

### Step 3: Create Directory Structure

```bash
mkdir -p src/{components/{common,layout},pages,entities,services,utils,hooks,context}
```

## Project Structure After Upgrade

```
src/
├── components/
│   ├── common/
│   │   └── ErrorMessage.jsx       # Reusable error display
│   └── layout/
│       └── Layout.jsx                  # Main app layout
│
├── pages/
│   ├── HomePage.jsx               # Landing page
│   ├── LoginPage.jsx              # Login form
│   └── DashboardPage.jsx          # Protected dashboard
│
├── entities/
│   └── user.json                  # User entity schema
│
├── services/
│   ├── api.js                     # API client configuration
│   └── authService.js             # Authentication logic
│
├── utils/
│   ├── router.js                  # Router configuration
│   └── constants.js               # App constants
│
├── context/
│   └── AuthContext.jsx            # Authentication state
│
├── App.jsx                         # Root React component
└── index.js                       # Entry point (replaces old index.js)
```

## Key Files Overview

### `src/index.js` (New Entry Point)
- Imports React and ReactDOM
- Imports App component
- Renders App to DOM root

### `src/App.jsx` (Root Component)
- Sets up React Router
- Wraps app with AuthContext provider
- Defines all routes
- Handles 404 errors

### `src/pages/HomePage.jsx`
- Landing page component
- Login and Dashboard navigation buttons

### `src/pages/LoginPage.jsx`
- Login form component
- Uses AuthContext for login functionality
- Redirects to dashboard on success

### `src/pages/DashboardPage.jsx`
- Protected dashboard component
- Displays user info
- API test functionality
- Logout button

### `src/context/AuthContext.jsx`
- Manages global authentication state
- Provides login/logout functions
- Handles API calls to auth endpoints

### `src/services/authService.js`
- Centralized authentication API calls
- Handles login, logout, status checks

## Running the Application

### Development Mode
```bash
npm run dev
# or
npm start
```

### Production Build
```bash
npm run build
```

## Verification Steps

### 1. Test Landing Page
1. Navigate to `http://localhost:3000/`
2. Should see "Welcome to QTFund"
3. Should see Login and Dashboard buttons

### 2. Test Login Flow
1. Click "Login" button
2. Enter credentials: `admin` / `admin123`
3. Click "Login" button
4. Should redirect to dashboard
5. Should see "Welcome to QTFund!" message

### 3. Test Dashboard
1. Should see user info section
2. Should see API test section
3. Click "Test Protected API" button
4. Should see success or error message
5. Click "Logout" button
6. Should redirect to login page

### 4. Test Navigation
1. Use browser back/forward buttons
2. Directly navigate to `/dashboard` (should redirect if not authenticated)
3. Navigate to non-existent route (should show 404)

### 5. Test API Calls
1. Verify `/api/auth/login` call works
2. Verify `/api/auth/logout` call works
3. Verify `/api/users` call works

## Troubleshooting

### Issue: JSX not recognized
**Solution**: Ensure webpack.config.js has babel-loader configured

### Issue: Routes not working
**Solution**: Verify historyApiFallback is configured in webpack dev server

### Issue: Authentication not persisting
**Solution**: Check that cookies are being set by backend API

### Issue: Import errors
**Solution**: Ensure all file extensions (.jsx) are correct and imports match

## Development Workflow

### Adding a New Page
1. Create new component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation links as needed

### Modifying API Calls
1. Update relevant service in `src/services/`
2. Update component using the service

### Adding Shared Components
1. Create in `src/components/common/`
2. Import and use in pages

## Comparison: Before vs After

### Before (Single File)
- All logic in `src/index.js`
- Manual DOM manipulation
- Global state variables
- Custom routing class

### After (Structured)
- Separation of concerns
- React component architecture
- Context API for state
- React Router for routing
- Services layer for API calls

### Identical Behavior
- Same URLs
- Same UI appearance
- Same functionality
- Same API contracts

## Success Criteria Met

- [ ] All pages render correctly
- [ ] All navigation works
- [ ] Authentication flow works
- [ ] API calls function correctly
- [ ] No visual changes
- [ ] Build completes successfully
- [ ] Code is organized

## Next Steps

After migration is complete:
- Add unit tests for components
- Add integration tests for flows
- Consider adding TypeScript
- Consider adding state management library (Redux/Zustand) if needed
- Add error boundaries for better error handling

