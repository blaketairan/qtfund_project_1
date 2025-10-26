# QTFund Frontend

A production-grade React frontend application for financial management.

## Project Structure

This project follows a modular architecture for maintainability and scalability:

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components (ErrorMessage, etc.)
│   └── layout/         # Layout components (Layout wrapper)
├── pages/              # Page-level components
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   └── DashboardPage.jsx
├── entities/           # Data entity definitions (JSON schemas)
│   └── user.json
├── services/           # API and business logic
│   ├── api.js          # API client configuration
│   └── authService.js  # Authentication logic
├── context/            # React Context providers
│   └── AuthContext.jsx # Global authentication state
├── utils/              # Utility functions and constants
│   └── constants.js    # Application constants
├── App.jsx             # Root component with routing
└── index.js            # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
# or
npm start
```

Access the application at `http://localhost:3000`

### Production Build

```bash
npm run build
```

Build output is in the `dist/` directory.

## Available Scripts

### npm Scripts

- `npm start` - Start development server
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production

### Operation Scripts

The `bin/` directory contains shell scripts for managing the application:

- `./bin/setup.sh` - Install dependencies and prepare environment
- `./bin/start.sh` - Start the application (webpack dev server)
- `./bin/health.sh` - Check application health status
- `./bin/stop.sh` - Stop the application

**Quick Start**:
```bash
./bin/setup.sh   # Install dependencies
./bin/start.sh   # Start application
./bin/health.sh  # Check status
./bin/stop.sh    # Stop application
```

## Project Architecture

### Components

- **Pages** (`src/pages/`) - Top-level route components representing full pages
- **Components** (`src/components/`) - Reusable UI elements
  - `common/` - Shared components used across pages
  - `layout/` - Layout wrappers and structure components

### Services

- **API Client** (`src/services/api.js`) - Centralized API request handling
- **Auth Service** (`src/services/authService.js`) - Authentication-specific API calls

### State Management

- **AuthContext** (`src/context/AuthContext.jsx`) - Global authentication state
  - `isAuthenticated` - Current auth status
  - `login(username, password)` - Login function
  - `logout()` - Logout function
  - `checkAuthStatus()` - Verify auth status
  - `testApiCall()` - Test API connectivity

### Routing

Implemented using React Router:
- `/` - Home page
- `/login` - Login page
- `/dashboard` - Protected dashboard

### Constants

Application-wide constants are defined in `src/utils/constants.js`:
- API endpoints
- Route paths
- Default configuration values

## Adding New Features

### Adding a New Page

1. Create component in `src/pages/YourPage.jsx`
2. Add route in `src/App.jsx`:
   ```jsx
   <Route path="/your-path" element={<YourPage />} />
   ```
3. Add navigation link in relevant page components

### Adding a New API Service

1. Create service file in `src/services/yourService.js`
2. Import and use `apiClient` from `api.js`
3. Define endpoints in `src/utils/constants.js`
4. Export functions from your service

### Adding a New Reusable Component

1. Determine if it's common or page-specific
   - Common: `src/components/common/`
   - Page-specific: `src/components/[page-name]/`
2. Follow existing component patterns
3. Export default component

### Adding a New Entity

1. Create JSON schema in `src/entities/entityName.json`
2. Follow JSON Schema draft-07 format
3. Include complete property definitions

## Environment Configuration

The application communicates with backend APIs at configured endpoints. Backend configuration is maintained separately.

## Code Style

This project follows React best practices:
- Functional components with hooks
- React Context for global state
- Separation of concerns (UI, logic, data)
- Self-explanatory code without comments

## License

ISC

