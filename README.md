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

### Bank & City Management Features
- **Optimized CRUD Operations**: Both bank and city features use RTK Query with optimistic updates
- **Performance Optimizations**: Memoized components, custom hooks, and efficient state management
- **Toast Notifications**: Beautiful, non-intrusive notifications for all operations
- **Confirmation Dialogs**: Safe delete operations with confirmation prompts
- **Loading States**: Proper loading indicators for all async operations
- **Error Handling**: Comprehensive error handling with user-friendly messages

### City Feature Refactoring
The city feature has been completely refactored to match the bank feature's architecture:

#### **API Layer (`src/features/city.tsx`)**
- **RTK Query Integration**: Replaced local state with RTK Query for server-side data management
- **Optimistic Updates**: Instant UI feedback for create, update, and delete operations
- **Type Safety**: Full TypeScript interfaces for `City`, `CityFormData`, and `UpdateCityData`
- **Caching**: 5-minute cache duration with automatic invalidation
- **Error Recovery**: Automatic rollback of optimistic updates on API failures

#### **Custom Hook (`src/hooks/useCityOperations.ts`)**
- **Centralized Logic**: All city operations wrapped in a single hook
- **Performance Optimizations**: Memoized sorted cities and city map for quick lookups
- **Error Handling**: Comprehensive error handling with console logging
- **Loading States**: Individual loading states for each operation type

#### **UI Component (`src/pages/dashboard/component/cityselector/Cityselector.tsx`)**
- **Memoized Sub-components**: `CityItem`, `AddCityModal`, and `EditCityModal` for performance
- **Toast Integration**: Success and error notifications for all operations
- **Confirmation Dialogs**: Safe delete operations with city name display
- **Loading States**: Disabled buttons and loading text during operations
- **Responsive Design**: Mobile-friendly interface with proper accessibility

#### **Testing Coverage**
- **API Tests** (`src/features/__tests__/city.test.tsx`): Endpoint and hook export validation
- **Hook Tests** (`src/hooks/__tests__/useCityOperations.test.tsx`): Custom hook functionality testing
- **Snapshot Tests**: UI consistency validation
- **Integration Tests**: Full CRUD operation flow testing

### State Feature Refactoring
The state feature has been completely refactored to match the bank and city features' architecture:

#### **API Layer (`src/features/state.tsx`)**
- **RTK Query Integration**: Replaced local state with RTK Query for server-side data management
- **Optimistic Updates**: Instant UI feedback for create, update, and delete operations
- **Type Safety**: Full TypeScript interfaces for `State`, `StateFormData`, and `UpdateStateData`
- **Caching**: 5-minute cache duration with automatic invalidation
- **Error Recovery**: Automatic rollback of optimistic updates on API failures

#### **Custom Hook (`src/hooks/useStateOperations.ts`)**
- **Centralized Logic**: All state operations wrapped in a single hook
- **Performance Optimizations**: Memoized sorted states and state map for quick lookups
- **Error Handling**: Comprehensive error handling with console logging
- **Loading States**: Individual loading states for each operation type

#### **UI Component (`src/pages/dashboard/component/stateSelector/Stateselector.tsx`)**
- **Memoized Sub-components**: `StateItem`, `AddStateModal`, and `EditStateModal` for performance
- **Toast Integration**: Success and error notifications for all operations
- **Confirmation Dialogs**: Safe delete operations with state name display
- **Loading States**: Disabled buttons and loading text during operations
- **Responsive Design**: Mobile-friendly interface with proper accessibility

#### **Testing Coverage**
- **API Tests** (`src/features/__tests__/state.test.tsx`): Endpoint and hook export validation
- **Hook Tests** (`src/hooks/__tests__/useStateOperations.test.tsx`): Custom hook functionality testing
- **Snapshot Tests**: UI consistency validation
- **Integration Tests**: Full CRUD operation flow testing

## Authentication Flow

1. **Login/Register**: Users authenticate through the login or register pages
2. **Token Storage**: Authentication token is stored in Redux state and automatically persisted
3. **Route Protection**: The `ProtectedRoute` component checks for valid authentication
4. **Automatic Redirects**: 
   - Authenticated users → Dashboard
   - Unauthenticated users → Login page
5. **State Persistence**: Redux Persist automatically saves and restores authentication state

## Technical Implementation

### Architecture Overview
The application follows a modern React architecture with:
- **Component-Based UI**: Reusable, memoized components for optimal performance
- **Custom Hooks**: Centralized business logic with proper separation of concerns
- **RTK Query**: Server state management with caching and synchronization
- **Redux Persist**: Client-side state persistence across sessions
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first styling with custom design system

### Redux Persist Configuration
- **Automatic Persistence**: Authentication state is automatically saved to localStorage
- **Selective Persistence**: Only auth-related fields are persisted (user, token, userId, roles)
- **Loading States**: PersistGate shows loading spinner while rehydrating state
- **Clean Logout**: Properly purges persisted state on logout

### Toast Notification System
- **Custom Toast Component**: Beautiful, animated notifications with icons
- **Multiple Types**: Success (green), error (red), warning (yellow), info (blue)
- **Auto-dismiss**: Toasts automatically disappear after 3 seconds
- **Manual Control**: Users can close toasts manually
- **Multiple Toasts**: Support for displaying multiple notifications simultaneously
- **Responsive Design**: Works well on all screen sizes

### Performance Optimizations
- **Memoized Components**: React.memo for sub-components to prevent unnecessary re-renders
- **Custom Hooks**: Centralized logic with useCallback and useMemo for performance
- **Optimistic Updates**: Instant UI feedback with automatic rollback on errors
- **Efficient Caching**: RTK Query caching with proper invalidation strategies
- **Lazy Loading**: Components and data loaded only when needed

### Protected Route Component
Located at `src/components/ProtectedRoute.tsx`, this component:
- Checks for authentication token in Redux state
- Redirects to login if no token is present
- Renders protected content if authenticated

### Authentication State Management
- **Redux Store**: Manages authentication state (user, token, userId, roles)
- **Redux Persist**: Automatically persists authentication data across browser sessions
- **RTK Query**: Handles API calls for login, logout, and registration

### Data Management Architecture
- **RTK Query**: Centralized API management with automatic caching and synchronization
- **Optimistic Updates**: Instant UI feedback with automatic error recovery
- **Type Safety**: Full TypeScript support throughout the application
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Proper loading indicators for all async operations

### Testing Strategy
- **Unit Tests**: Individual component and hook testing with Vitest
- **Snapshot Tests**: UI consistency validation across changes
- **Integration Tests**: Full feature workflow testing
- **Mock Strategy**: Comprehensive mocking of external dependencies
- **Test Coverage**: High coverage for critical user paths
- **Utility Functions**: Helper functions for persistence operations

## Development Guidelines

### Code Organization
- **Feature-Based Structure**: Each feature has its own directory with components, hooks, and tests
- **Shared Components**: Reusable UI components in `src/components`
- **Custom Hooks**: Business logic hooks in `src/hooks`
- **API Slices**: RTK Query endpoints in `src/features`
- **Type Definitions**: TypeScript interfaces alongside their implementations

### Performance Best Practices
- **Memoization**: Use React.memo, useCallback, and useMemo appropriately
- **Optimistic Updates**: Provide instant feedback with automatic error recovery
- **Efficient Re-renders**: Minimize unnecessary component re-renders
- **Lazy Loading**: Load components and data only when needed
- **Caching Strategy**: Implement proper caching with RTK Query

### Testing Standards
- **Unit Tests**: Test individual components and hooks in isolation
- **Snapshot Tests**: Ensure UI consistency across changes
- **Integration Tests**: Test complete user workflows
- **Mock Strategy**: Mock external dependencies consistently
- **Coverage Goals**: Maintain high test coverage for critical paths

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
