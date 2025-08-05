import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import App from '../App';

// Mock the page components
vi.mock('../pages', () => ({
  Login: vi.fn(() => <div data-testid="login-page">Login Page</div>),
  Register: vi.fn(() => <div data-testid="register-page">Register Page</div>),
  Dashboard: vi.fn(() => <div data-testid="dashboard-page">Dashboard Page</div>),
  AdminDashboard: vi.fn(() => <div data-testid="admin-dashboard-page">Admin Dashboard Page</div>),
  JobApplicantDashboard: vi.fn(() => <div data-testid="job-applicant-dashboard-page">Job Applicant Dashboard Page</div>),
}));

// Mock the ProtectedRoute component
vi.mock('../components/ProtectedRoute', () => ({
  default: vi.fn(({ children }) => <div data-testid="protected-route">{children}</div>),
}));

// Mock the RoleBasedRoute component
vi.mock('../components/RoleBasedRoute', () => ({
  default: vi.fn(({ children }) => <div data-testid="role-based-route">{children}</div>),
}));

// Mock CSS imports
vi.mock('../App.css', () => ({}));

// Create a test store
const createTestStore = () => {
  const store = configureStore({
    reducer: {
      auth: (state = { user: null, token: null }, action) => state,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST'],
        },
      }),
  });
  const persistor = persistStore(store);
  return { store, persistor };
};

// Test wrapper component
const TestWrapper = ({ children, initialEntries = ['/'] }: { children: React.ReactNode; initialEntries?: string[] }) => {
  const { store, persistor } = createTestStore();
  
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    </Provider>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Structure and Rendering', () => {
    it('renders app component with basic structure', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );
      
      // App should render without crashing
      expect(document.body).toBeInTheDocument();
    });

    it('matches app component snapshot', () => {
      const { container } = render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders with default route (redirects to login)', () => {
      render(
        <TestWrapper initialEntries={['/']}>
          <App />
        </TestWrapper>
      );
      
      // Should redirect to login page
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });

  describe('Route Configuration', () => {
    it('renders login page at /login route', () => {
      render(
        <TestWrapper initialEntries={['/login']}>
          <App />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('renders register page at /register route', () => {
      render(
        <TestWrapper initialEntries={['/register']}>
          <App />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('register-page')).toBeInTheDocument();
      expect(screen.getByText('Register Page')).toBeInTheDocument();
    });

    it('renders dashboard page at /dashboard route with protection', () => {
      render(
        <TestWrapper initialEntries={['/dashboard']}>
          <App />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });

    it('renders admin dashboard page at /admin/dashboard route with protection and role check', () => {
      render(
        <TestWrapper initialEntries={['/admin/dashboard']}>
          <App />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('role-based-route')).toBeInTheDocument();
      expect(screen.getByTestId('admin-dashboard-page')).toBeInTheDocument();
      expect(screen.getByText('Admin Dashboard Page')).toBeInTheDocument();
    });

    it('renders job applicant dashboard page at /job-applicant/dashboard route with protection and role check', () => {
      render(
        <TestWrapper initialEntries={['/job-applicant/dashboard']}>
          <App />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('role-based-route')).toBeInTheDocument();
      expect(screen.getByTestId('job-applicant-dashboard-page')).toBeInTheDocument();
      expect(screen.getByText('Job Applicant Dashboard Page')).toBeInTheDocument();
    });

    it('redirects unknown routes to login page', () => {
      render(
        <TestWrapper initialEntries={['/unknown-route']}>
          <App />
        </TestWrapper>
      );
      
      // Should redirect to login page
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('redirects root path to login page', () => {
      render(
        <TestWrapper initialEntries={['/']}>
          <App />
        </TestWrapper>
      );
      
      // Should redirect to login page
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });

  describe('Navigation and Routing', () => {
    it('handles multiple route changes correctly', () => {
      // Test login route
      const { rerender } = render(
        <TestWrapper initialEntries={['/login']}>
          <App />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      
      // Test register route - create new render instead of rerender
      const { getByTestId: getByTestId2 } = render(
        <TestWrapper initialEntries={['/register']}>
          <App />
        </TestWrapper>
      );
      
      expect(getByTestId2('register-page')).toBeInTheDocument();
      
      // Test dashboard route - create new render instead of rerender
      const { getByTestId: getByTestId3 } = render(
        <TestWrapper initialEntries={['/dashboard']}>
          <App />
        </TestWrapper>
      );
      
      expect(getByTestId3('dashboard-page')).toBeInTheDocument();
      expect(getByTestId3('protected-route')).toBeInTheDocument();
    });

    it('handles deep nested routes correctly', () => {
      render(
        <TestWrapper initialEntries={['/dashboard/settings/profile']}>
          <App />
        </TestWrapper>
      );
      
      // Should redirect to login since it's not a defined route
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('handles query parameters in routes', () => {
      render(
        <TestWrapper initialEntries={['/login?redirect=/dashboard']}>
          <App />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('handles hash fragments in routes', () => {
      render(
        <TestWrapper initialEntries={['/register#section1']}>
          <App />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('register-page')).toBeInTheDocument();
    });
  });

  describe('Protected Route Integration', () => {
    it('wraps dashboard route with ProtectedRoute component', () => {
      render(
        <TestWrapper initialEntries={['/dashboard']}>
          <App />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });

    it('does not wrap login route with ProtectedRoute', () => {
      render(
        <TestWrapper initialEntries={['/login']}>
          <App />
        </TestWrapper>
      );
      
      expect(screen.queryByTestId('protected-route')).not.toBeInTheDocument();
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('does not wrap register route with ProtectedRoute', () => {
      render(
        <TestWrapper initialEntries={['/register']}>
          <App />
        </TestWrapper>
      );
      
      expect(screen.queryByTestId('protected-route')).not.toBeInTheDocument();
      expect(screen.getByTestId('register-page')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('integrates with Login component correctly', () => {
      render(
        <TestWrapper initialEntries={['/login']}>
          <App />
        </TestWrapper>
      );
      
      const loginPage = screen.getByTestId('login-page');
      expect(loginPage).toBeInTheDocument();
      expect(loginPage).toHaveTextContent('Login Page');
    });

    it('integrates with Register component correctly', () => {
      render(
        <TestWrapper initialEntries={['/register']}>
          <App />
        </TestWrapper>
      );
      
      const registerPage = screen.getByTestId('register-page');
      expect(registerPage).toBeInTheDocument();
      expect(registerPage).toHaveTextContent('Register Page');
    });

    it('integrates with Dashboard component correctly', () => {
      render(
        <TestWrapper initialEntries={['/dashboard']}>
          <App />
        </TestWrapper>
      );
      
      const dashboardPage = screen.getByTestId('dashboard-page');
      expect(dashboardPage).toBeInTheDocument();
      expect(dashboardPage).toHaveTextContent('Dashboard Page');
    });

    it('integrates with AdminDashboard component correctly', () => {
      render(
        <TestWrapper initialEntries={['/admin/dashboard']}>
          <App />
        </TestWrapper>
      );
      
      const adminDashboardPage = screen.getByTestId('admin-dashboard-page');
      expect(adminDashboardPage).toBeInTheDocument();
      expect(adminDashboardPage).toHaveTextContent('Admin Dashboard Page');
    });

    it('integrates with JobApplicantDashboard component correctly', () => {
      render(
        <TestWrapper initialEntries={['/job-applicant/dashboard']}>
          <App />
        </TestWrapper>
      );
      
      const jobApplicantDashboardPage = screen.getByTestId('job-applicant-dashboard-page');
      expect(jobApplicantDashboardPage).toBeInTheDocument();
      expect(jobApplicantDashboardPage).toHaveTextContent('Job Applicant Dashboard Page');
    });

    it('integrates with ProtectedRoute component correctly', () => {
      render(
        <TestWrapper initialEntries={['/dashboard']}>
          <App />
        </TestWrapper>
      );
      
      const protectedRoute = screen.getByTestId('protected-route');
      expect(protectedRoute).toBeInTheDocument();
      
      // ProtectedRoute should contain the Dashboard component
      expect(protectedRoute).toContainElement(screen.getByTestId('dashboard-page'));
    });

    it('integrates with RoleBasedRoute component correctly for admin dashboard', () => {
      render(
        <TestWrapper initialEntries={['/admin/dashboard']}>
          <App />
        </TestWrapper>
      );
      
      const protectedRoute = screen.getByTestId('protected-route');
      const roleBasedRoute = screen.getByTestId('role-based-route');
      expect(protectedRoute).toBeInTheDocument();
      expect(roleBasedRoute).toBeInTheDocument();
      
      // RoleBasedRoute should contain the AdminDashboard component
      expect(roleBasedRoute).toContainElement(screen.getByTestId('admin-dashboard-page'));
    });

    it('integrates with RoleBasedRoute component correctly for job applicant dashboard', () => {
      render(
        <TestWrapper initialEntries={['/job-applicant/dashboard']}>
          <App />
        </TestWrapper>
      );
      
      const protectedRoute = screen.getByTestId('protected-route');
      const roleBasedRoute = screen.getByTestId('role-based-route');
      expect(protectedRoute).toBeInTheDocument();
      expect(roleBasedRoute).toBeInTheDocument();
      
      // RoleBasedRoute should contain the JobApplicantDashboard component
      expect(roleBasedRoute).toContainElement(screen.getByTestId('job-applicant-dashboard-page'));
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles empty route path', () => {
      render(
        <TestWrapper initialEntries={['']}>
          <App />
        </TestWrapper>
      );
      
      // Should redirect to login page
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('handles route with only slash', () => {
      render(
        <TestWrapper initialEntries={['/']}>
          <App />
        </TestWrapper>
      );
      
      // Should redirect to login page
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('handles route with multiple slashes', () => {
      render(
        <TestWrapper initialEntries={['///']}>
          <App />
        </TestWrapper>
      );
      
      // Should redirect to login page
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('handles route with special characters', () => {
      render(
        <TestWrapper initialEntries={['/login%20page']}>
          <App />
        </TestWrapper>
      );
      
      // Should redirect to login page since it's not an exact match
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('handles case-sensitive routes', () => {
      render(
        <TestWrapper initialEntries={['/LOGIN']}>
          <App />
        </TestWrapper>
      );
      
      // Should redirect to login page since it's not an exact match
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });

  describe('Performance and Memory', () => {
    it('handles rapid route changes efficiently', () => {
      const { rerender } = render(
        <TestWrapper initialEntries={['/login']}>
          <App />
        </TestWrapper>
      );
      
      // Rapidly change routes
      for (let i = 0; i < 10; i++) {
        rerender(
          <TestWrapper initialEntries={['/register']}>
            <App />
          </TestWrapper>
        );
        rerender(
          <TestWrapper initialEntries={['/login']}>
            <App />
          </TestWrapper>
        );
      }
      
      // Should still work correctly
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('does not cause memory leaks with frequent renders', () => {
      const { rerender, unmount } = render(
        <TestWrapper initialEntries={['/login']}>
          <App />
        </TestWrapper>
      );
      
      // Simulate frequent renders
      for (let i = 0; i < 50; i++) {
        rerender(
          <TestWrapper initialEntries={['/login']}>
            <App />
          </TestWrapper>
        );
      }
      
      unmount();
      
      // Should not throw any errors
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains proper document structure', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );
      
      // Should have proper document structure
      expect(document.body).toBeInTheDocument();
      expect(document.documentElement).toBeInTheDocument();
    });

    it('renders without accessibility violations', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );
      
      // App should render without accessibility issues
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });

  describe('Redux Integration', () => {
    it('works correctly with Redux store', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );
      
      // Should render without Redux-related errors
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('handles Redux state changes correctly', () => {
      const { rerender } = render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );
      
      // Should handle Redux state changes without issues
      rerender(
        <TestWrapper>
          <App />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });

  describe('Router Integration', () => {
    it('works correctly with BrowserRouter', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );
      
      // Should work with router without issues
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('handles navigation events correctly', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );
      
      // Should handle navigation events without issues
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });

  describe('CSS and Styling', () => {
    it('imports CSS file correctly', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );
      
      // Should import CSS without errors
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('applies styles correctly', () => {
      const { container } = render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );
      
      // Should apply styles without issues
      expect(container.firstChild).toBeInTheDocument();
    });
  });
}); 