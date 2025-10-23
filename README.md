# QTFund Frontend - Enterprise Grade

A professional React-based financial management system for tracking and managing fund investments.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Alert.jsx       # Alert notifications
│   ├── Button.jsx      # Button component with variants
│   ├── Card.jsx        # Card container component
│   ├── Input.jsx       # Form input component
│   ├── Loading.jsx     # Loading spinner
│   ├── Modal.jsx       # Modal dialog (HeadlessUI)
│   ├── Navbar.jsx      # Navigation bar
│   ├── ProtectedRoute.jsx  # Route protection
│   └── Table.jsx       # Data table component
├── entities/           # JSON schema definitions
│   ├── fund.json       # Fund entity schema
│   ├── portfolio.json  # Portfolio entity schema
│   ├── transaction.json # Transaction entity schema
│   └── user.json       # User entity schema
├── pages/              # Page components
│   ├── Dashboard.jsx   # Dashboard page
│   ├── FundsPage.jsx   # Funds listing and management
│   ├── HomePage.jsx    # Landing page
│   ├── LoginPage.jsx   # Login page
│   ├── PortfoliosPage.jsx  # Portfolio management
│   └── SettingsPage.jsx    # User settings
├── services/           # API services
│   └── api.js         # API client and endpoints
├── styles/            # Global styles
│   └── globals.css    # Tailwind CSS imports
├── utils/             # Utility functions
│   └── authContext.js # Authentication context
├── Layout.jsx         # Main layout component
└── index.js          # Application entry point
```

## Technology Stack

### Core
- **React 18.2** - UI library
- **React Router DOM 6** - Client-side routing
- **React DOM** - React renderer

### UI Components & Styling
- **@headlessui/react** - Unstyled, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **lucide-react** - Icon library

### Build Tools
- **Webpack 5** - Module bundler
- **Babel** - JavaScript transpiler
- **PostCSS** - CSS processing

### Available Libraries
- **moment** - Date manipulation
- **date-fns** - Modern date utility
- **recharts** - Chart library
- **react-quill** - Rich text editor
- **react-hook-form** - Form validation
- **lodash** - Utility functions
- **react-markdown** - Markdown renderer
- **three.js** - 3D graphics
- **react-leaflet** - Map integration
- **@hello-pangea/dnd** - Drag and drop

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Build

Create production build:

```bash
npm run build
```

## Features

### Authentication
- Protected routes with automatic redirection
- Cookie-based authentication
- Auth context for global state management

### Pages
1. **Home Page** - Landing page with feature showcase
2. **Login Page** - User authentication
3. **Dashboard** - Overview of portfolio performance and activity
4. **Funds** - Browse and search available funds
5. **Portfolios** - Manage investment portfolios
6. **Settings** - User preferences and account settings

### Components
- Modular, reusable components
- Consistent design system
- Accessible UI with HeadlessUI
- Responsive design with Tailwind CSS

### API Integration
- Centralized API client
- Error handling
- RESTful endpoints for:
  - Authentication
  - Users
  - Funds
  - Transactions
  - Portfolios

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check auth status

### Users
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Funds
- `GET /api/funds` - List funds
- `GET /api/funds/:id` - Get fund details
- `POST /api/funds` - Create fund
- `PUT /api/funds/:id` - Update fund
- `DELETE /api/funds/:id` - Delete fund
- `GET /api/funds/:id/history` - Get fund history

### Transactions
- `GET /api/transactions` - List transactions
- `GET /api/transactions/:id` - Get transaction details
- `POST /api/transactions` - Create transaction
- `POST /api/transactions/:id/cancel` - Cancel transaction

### Portfolios
- `GET /api/portfolios` - List portfolios
- `GET /api/portfolios/:id` - Get portfolio details
- `POST /api/portfolios` - Create portfolio
- `PUT /api/portfolios/:id` - Update portfolio
- `DELETE /api/portfolios/:id` - Delete portfolio
- `GET /api/portfolios/:id/performance` - Get portfolio performance

## Default Credentials

```
Username: admin
Password: admin123
```

## Design Principles

1. **Component-Based Architecture** - Small, focused, reusable components
2. **Clean Code** - Self-documenting code without inline comments
3. **Type Safety** - JSON schemas for data entities
4. **Separation of Concerns** - Clear separation between UI, logic, and data
5. **Accessibility** - WCAG compliant with HeadlessUI components
6. **Responsive Design** - Mobile-first approach with Tailwind CSS

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC

