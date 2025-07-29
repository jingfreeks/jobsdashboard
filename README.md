# Jobs Dashboard

A React-based job management dashboard with authentication and protected routes.

## Features

### Authentication
- **Protected Routes**: Users must be logged in to access the dashboard
- **Redux Persist Integration**: Authentication state is automatically persisted using Redux Persist
- **Automatic Redirects**: 
  - Logged-in users are automatically redirected to dashboard when trying to access login/register pages
  - Unauthenticated users are redirected to login when trying to access protected routes
- **Logout Functionality**: Proper logout that clears authentication state and redirects to login
- **Loading States**: Beautiful loading spinner while persisted state is being rehydrated

### Dashboard Components
- Company management with CRUD operations
- Job management
- Settings for various entities (banks, cities, states, skills, shifts, departments)

## Authentication Flow

1. **Login/Register**: Users authenticate through the login or register pages
2. **Token Storage**: Authentication token is stored in Redux state and automatically persisted
3. **Route Protection**: The `ProtectedRoute` component checks for valid authentication
4. **Automatic Redirects**: 
   - Authenticated users → Dashboard
   - Unauthenticated users → Login page
5. **State Persistence**: Redux Persist automatically saves and restores authentication state

## Technical Implementation

### Redux Persist Configuration
- **Automatic Persistence**: Authentication state is automatically saved to localStorage
- **Selective Persistence**: Only auth-related fields are persisted (user, token, userId, roles)
- **Loading States**: PersistGate shows loading spinner while rehydrating state
- **Clean Logout**: Properly purges persisted state on logout

### Protected Route Component
Located at `src/components/ProtectedRoute.tsx`, this component:
- Checks for authentication token in Redux state
- Redirects to login if no token is present
- Renders protected content if authenticated

### Authentication State Management
- **Redux Store**: Manages authentication state (user, token, userId, roles)
- **Redux Persist**: Automatically persists authentication data across browser sessions
- **RTK Query**: Handles API calls for login, logout, and registration
- **Utility Functions**: Helper functions for persistence operations

### Key Files
- `src/components/ProtectedRoute.tsx` - Route protection logic
- `src/components/LoadingSpinner.tsx` - Loading component for PersistGate
- `src/features/auth.tsx` - Redux slice for authentication state
- `src/config/store.ts` - Redux store with Persist configuration
- `src/utils/persistUtils.ts` - Persistence utility functions
- `src/App.tsx` - Route configuration with protected routes
- `src/pages/Login/Login.tsx` - Login component with authentication checks
- `src/pages/Register/Register.tsx` - Register component with authentication checks

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Access the application at `http://localhost:5173`

## Development

This project uses:
- React 19 with TypeScript
- Vite for build tooling
- Redux Toolkit for state management
- Redux Persist for state persistence
- React Router for navigation
- Tailwind CSS for styling

## Redux Persist Benefits

- **Automatic State Restoration**: No need to manually handle localStorage
- **Performance**: Only persists necessary data
- **Reliability**: Built-in error handling and fallbacks
- **Developer Experience**: Easy debugging and state inspection
- **Cross-tab Synchronization**: State stays in sync across browser tabs

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
