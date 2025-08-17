/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RoleBasedRoute from '../RoleBasedRoute';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => {
      mockNavigate(to);
      return <div data-testid="navigate" data-to={to}>Navigate to {to}</div>;
    },
  };
});

// Create a test store
const createTestStore = (userRoles: string[] = []) => {
  const store = configureStore({
    reducer: {
      auth: (state = { user: null, token: null, userId: null, roles: userRoles }) => state,
    },
  });
  return store;
};

// Test wrapper component
const TestWrapper = ({ children, userRoles = [] }: { children: React.ReactNode; userRoles?: string[] }) => {
  const store = createTestStore(userRoles);
  
  return (
    <Provider store={store}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </Provider>
  );
};

describe('RoleBasedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Structure and Rendering', () => {
    it('renders children when user has required role', () => {
      render(
        <TestWrapper userRoles={['admin']}>
          <RoleBasedRoute allowedRoles={['admin']}>
            <div data-testid="protected-content">Admin Content</div>
          </RoleBasedRoute>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('matches component snapshot when user has required role', () => {
      const { container } = render(
        <TestWrapper userRoles={['admin']}>
          <RoleBasedRoute allowedRoles={['admin']}>
            <div data-testid="protected-content">Admin Content</div>
          </RoleBasedRoute>
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders children when user has multiple roles and one matches', () => {
      render(
        <TestWrapper userRoles={['user', 'admin', 'moderator']}>
          <RoleBasedRoute allowedRoles={['admin']}>
            <div data-testid="protected-content">Admin Content</div>
          </RoleBasedRoute>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('renders children when user has role that matches any of the allowed roles', () => {
      render(
        <TestWrapper userRoles={['moderator']}>
          <RoleBasedRoute allowedRoles={['admin', 'moderator', 'user']}>
            <div data-testid="protected-content">Moderator Content</div>
          </RoleBasedRoute>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.getByText('Moderator Content')).toBeInTheDocument();
    });
  });

  describe('Access Control', () => {
    it('redirects to login when user has no required role', () => {
      render(
        <TestWrapper userRoles={['user']}>
          <RoleBasedRoute allowedRoles={['admin']}>
            <div data-testid="protected-content">Admin Content</div>
          </RoleBasedRoute>
        </TestWrapper>
      );
      
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
    });

    it('redirects to custom fallback path when user has no required role', () => {
      render(
        <TestWrapper userRoles={['user']}>
          <RoleBasedRoute allowedRoles={['admin']} fallbackPath="/unauthorized">
            <div data-testid="protected-content">Admin Content</div>
          </RoleBasedRoute>
        </TestWrapper>
      );
      
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/unauthorized');
    });

    it('redirects when user has no roles', () => {
      render(
        <TestWrapper userRoles={[]}>
          <RoleBasedRoute allowedRoles={['admin']}>
            <div data-testid="protected-content">Admin Content</div>
          </RoleBasedRoute>
        </TestWrapper>
      );
      
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
    });

    it('allows access when user has exact role match', () => {
      render(
        <TestWrapper userRoles={['admin']}>
          <RoleBasedRoute allowedRoles={['admin']}>
            <div data-testid="protected-content">Admin Content</div>
          </RoleBasedRoute>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });
  });

  describe('Role Matching Logic', () => {
    it('handles case-insensitive role matching', () => {
      render(
        <TestWrapper userRoles={['Admin']}>
          <RoleBasedRoute allowedRoles={['admin']}>
            <div data-testid="protected-content">Admin Content</div>
          </RoleBasedRoute>
        </TestWrapper>
      );
      
      // Should match due to case-insensitive comparison
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });

    it('handles multiple allowed roles correctly', () => {
      render(
        <TestWrapper userRoles={['user']}>
          <RoleBasedRoute allowedRoles={['admin', 'user', 'moderator']}>
            <div data-testid="protected-content">User Content</div>
          </RoleBasedRoute>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });

    it('handles empty allowed roles array', () => {
      render(
        <TestWrapper userRoles={['admin']}>
          <RoleBasedRoute allowedRoles={[]}>
            <div data-testid="protected-content">Content</div>
          </RoleBasedRoute>
        </TestWrapper>
      );
      
      // Should redirect when no roles are allowed
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles undefined user roles gracefully', () => {
      render(
        <TestWrapper userRoles={undefined as any}>
          <RoleBasedRoute allowedRoles={['admin']}>
            <div data-testid="protected-content">Admin Content</div>
          </RoleBasedRoute>
        </TestWrapper>
      );
      
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
    });

    it('handles null user roles gracefully', () => {
      render(
        <TestWrapper userRoles={null as any}>
          <RoleBasedRoute allowedRoles={['admin']}>
            <div data-testid="protected-content">Admin Content</div>
          </RoleBasedRoute>
        </TestWrapper>
      );
      
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
    });

    it('handles non-array user roles gracefully', () => {
      render(
        <TestWrapper userRoles={'admin' as any}>
          <RoleBasedRoute allowedRoles={['admin']}>
            <div data-testid="protected-content">Admin Content</div>
          </RoleBasedRoute>
        </TestWrapper>
      );
      
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
    });
  });

  describe('Redux Integration', () => {
    it('works correctly with Redux store state changes', () => {
      const { rerender } = render(
        <TestWrapper userRoles={['user']}>
          <RoleBasedRoute allowedRoles={['admin']}>
            <div data-testid="protected-content">Admin Content</div>
          </RoleBasedRoute>
        </TestWrapper>
      );
      
      // Initially should redirect
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      
      // Rerender with admin role
      rerender(
        <TestWrapper userRoles={['admin']}>
          <RoleBasedRoute allowedRoles={['admin']}>
            <div data-testid="protected-content">Admin Content</div>
          </RoleBasedRoute>
        </TestWrapper>
      );
      
      // Now should show content
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });

    it('handles Redux store without auth state gracefully', () => {
      const store = configureStore({
        reducer: {
          auth: (state = {},) => state,
        },
      });
      
      render(
        <Provider store={store}>
          <MemoryRouter>
            <RoleBasedRoute allowedRoles={['admin']}>
              <div data-testid="protected-content">Admin Content</div>
            </RoleBasedRoute>
          </MemoryRouter>
        </Provider>
      );
      
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
    });
  });

  describe('Props Validation', () => {
    it('handles missing children prop gracefully', () => {
      render(
        <TestWrapper userRoles={['admin']}>
          <RoleBasedRoute allowedRoles={['admin']} children={undefined}>
            {/* No children */}
          </RoleBasedRoute>
        </TestWrapper>
      );
      
      // Should not crash and should allow access
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });

    it('handles missing allowedRoles prop gracefully', () => {
      render(
        <TestWrapper userRoles={['admin']}>
          <RoleBasedRoute allowedRoles={undefined as any}>
            <div data-testid="protected-content">Admin Content</div>
          </RoleBasedRoute>
        </TestWrapper>
      );
      
      // Should redirect when no roles are allowed
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
    });
  });
}); 