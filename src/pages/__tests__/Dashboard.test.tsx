import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Dashboard from '../dashboard/Dashboard';
import { store } from '@/config/store';
import * as authActions from '@/features/auth';

// Mock recharts ResponsiveContainer to avoid rendering issues in tests
vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal();
  return typeof actual === 'object' && actual !== null
    ? {
        ...actual,
        ResponsiveContainer: ({ children }: React.PropsWithChildren<unknown>) => <div>{children}</div>,
      }
    : {
        ResponsiveContainer: ({ children }: React.PropsWithChildren<unknown>) => <div>{children}</div>,
      };
});

vi.mock('@/features/auth', () => ({
  __esModule: true,
  default: () => ({}), // mock reducer
  setCredentials: vi.fn(),
  setLogout: vi.fn(() => ({ type: 'auth/setLogout' })), // Return a proper action object
}));

describe('Dashboard', () => {
  it('renders dashboard header and sidebar', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );
    // Use more specific selectors to avoid multiple matches
    expect(screen.getByRole('heading', { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/Main/i)).toBeInTheDocument();
    
    // Snapshot test
    expect(container).toMatchSnapshot();
  });

  it('renders dashboard content sections', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );
    
    // Check for main dashboard elements using specific selectors
    expect(screen.getByRole('heading', { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/Main/i)).toBeInTheDocument();
    
    // Verify the auth actions are properly mocked
    expect(authActions.setLogout).toBeDefined();
    
    // Snapshot test
    expect(container).toMatchSnapshot();
  });

  it('matches dashboard layout snapshot', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );
    expect(container).toMatchSnapshot();
  });
}); 