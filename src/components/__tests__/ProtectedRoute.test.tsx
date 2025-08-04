import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth';
import ProtectedRoute from '../ProtectedRoute';
import type { RootState } from '@/config/store';

// Mock component to render inside ProtectedRoute
const MockComponent = () => <div>Protected Content</div>;

const createTestStore = (initialAuthState: RootState['auth']) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: initialAuthState,
    },
  });
};

const renderWithProviders = (component: React.ReactElement, store: ReturnType<typeof configureStore>) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('ProtectedRoute', () => {
  it('should render children when user is authenticated', () => {
    const store = createTestStore({
      user: 'testuser',
      token: 'valid-token',
      userId: '123',
      roles: ['user'],
    });

    const { container } = renderWithProviders(
      <ProtectedRoute>
        <MockComponent />
      </ProtectedRoute>,
      store
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should redirect to login when user is not authenticated', () => {
    const store = createTestStore({
      user: null,
      token: null,
      userId: null,
      roles: [],
    });

    const { container } = renderWithProviders(
      <ProtectedRoute>
        <MockComponent />
      </ProtectedRoute>,
      store
    );

    // The component should not render the protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('matches protected route snapshot when authenticated', () => {
    const store = createTestStore({
      user: 'testuser',
      token: 'valid-token',
      userId: '123',
      roles: ['user'],
    });

    const { container } = renderWithProviders(
      <ProtectedRoute>
        <MockComponent />
      </ProtectedRoute>,
      store
    );

    expect(container).toMatchSnapshot();
  });

  it('matches protected route snapshot when not authenticated', () => {
    const store = createTestStore({
      user: null,
      token: null,
      userId: null,
      roles: [],
    });

    const { container } = renderWithProviders(
      <ProtectedRoute>
        <MockComponent />
      </ProtectedRoute>,
      store
    );

    expect(container).toMatchSnapshot();
  });
}); 