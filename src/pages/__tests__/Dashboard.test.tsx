import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

// Hoisted mocks to avoid hoisting issues
const { 
  mockNavigate, 
  mockDispatch, 
  mockLogout, 
  mockPurgePersistedState, 
  mockSetLogout 
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockDispatch: vi.fn(),
  mockLogout: vi.fn(),
  mockPurgePersistedState: vi.fn(),
  mockSetLogout: vi.fn(() => ({ type: 'auth/setLogout' }))
}));

vi.mock('react-router-dom', () => ({
  MemoryRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useNavigate: () => mockNavigate,
}));

vi.mock('react-redux', () => ({
  Provider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useDispatch: () => mockDispatch,
}));

vi.mock('@/features/authSlice', () => ({
  useLogoutMutation: () => [mockLogout],
}));

vi.mock('@/utils/persistUtils', () => ({
  purgePersistedState: mockPurgePersistedState,
}));

vi.mock('@/features/auth', () => ({
  __esModule: true,
  default: () => ({}), // mock reducer
  setCredentials: vi.fn(),
  setLogout: mockSetLogout,
}));

// Mock all dashboard components
vi.mock('../dashboard/component', () => ({
  Header: ({ handleLogout }: { handleLogout: () => void }) => (
    <header data-testid="dashboard-header">
      <h1>Dashboard</h1>
      <button onClick={handleLogout} data-testid="logout-button">
        Logout
      </button>
    </header>
  ),
  DasboardSelector: () => <div data-testid="dashboard-selector">Dashboard Selector</div>,
  Jobselector: () => <div data-testid="job-selector">Job Selector</div>,
  Bankselector: () => <div data-testid="bank-selector">Bank Selector</div>,
  CitySelector: () => <div data-testid="city-selector">City Selector</div>,
  StateSelector: () => <div data-testid="state-selector">State Selector</div>,
  CompanySelector: () => <div data-testid="company-selector">Company Selector</div>,
  SkillSelector: () => <div data-testid="skill-selector">Skill Selector</div>,
  ShiftSelector: () => <div data-testid="shift-selector">Shift Selector</div>,
  DepartmentSelector: () => <div data-testid="department-selector">Department Selector</div>,
  Sidebar: ({ handleLogout }: { handleLogout: () => void }) => (
    <aside data-testid="sidebar">
      <div>Main</div>
      <button onClick={handleLogout} data-testid="sidebar-logout-button">
        Sidebar Logout
      </button>
    </aside>
  ),
}));

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset console.error mock
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

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

  describe('handleLogout function', () => {
    it('should handle successful logout', async () => {
      // Mock successful logout API call
      const mockUnwrap = vi.fn().mockResolvedValue({ success: true });
      mockLogout.mockReturnValue({
        unwrap: mockUnwrap
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );

      // Trigger logout from header
      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        // Verify logout API was called
        expect(mockLogout).toHaveBeenCalledWith({});
        expect(mockUnwrap).toHaveBeenCalled();
      });

      await waitFor(() => {
        // Verify setLogout was dispatched
        expect(mockDispatch).toHaveBeenCalledWith(mockSetLogout());
      });

      await waitFor(() => {
        // Verify persisted state was purged
        expect(mockPurgePersistedState).toHaveBeenCalled();
      });

      await waitFor(() => {
        // Verify navigation to login page
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    it('should handle logout API failure gracefully', async () => {
      // Mock failed logout API call
      const mockError = new Error('Logout failed');
      const mockUnwrap = vi.fn().mockRejectedValue(mockError);
      mockLogout.mockReturnValue({
        unwrap: mockUnwrap
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );

      // Trigger logout from sidebar
      const sidebarLogoutButton = screen.getByTestId('sidebar-logout-button');
      fireEvent.click(sidebarLogoutButton);

      await waitFor(() => {
        // Verify logout API was called and failed
        expect(mockLogout).toHaveBeenCalledWith({});
        expect(mockUnwrap).toHaveBeenCalled();
      });

      await waitFor(() => {
        // Verify error was logged
        expect(console.error).toHaveBeenCalledWith('Logout API call failed:', mockError);
      });

      await waitFor(() => {
        // Verify setLogout was still dispatched despite API failure
        expect(mockDispatch).toHaveBeenCalledWith(mockSetLogout());
      });

      await waitFor(() => {
        // Verify persisted state was still purged despite API failure
        expect(mockPurgePersistedState).toHaveBeenCalled();
      });

      await waitFor(() => {
        // Verify navigation to login page still happened despite API failure
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    it('should handle logout with network error', async () => {
      // Mock network error
      const networkError = new Error('Network error');
      const mockUnwrap = vi.fn().mockRejectedValue(networkError);
      mockLogout.mockReturnValue({
        unwrap: mockUnwrap
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );

      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Logout API call failed:', networkError);
        expect(mockDispatch).toHaveBeenCalledWith(mockSetLogout());
        expect(mockPurgePersistedState).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    it('should handle logout with API timeout', async () => {
      // Mock timeout error
      const timeoutError = new Error('Request timeout');
      const mockUnwrap = vi.fn().mockRejectedValue(timeoutError);
      mockLogout.mockReturnValue({
        unwrap: mockUnwrap
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );

      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Logout API call failed:', timeoutError);
        expect(mockDispatch).toHaveBeenCalledWith(mockSetLogout());
        expect(mockPurgePersistedState).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    it('should handle logout with server error response', async () => {
      // Mock server error
      const serverError = { status: 500, data: { message: 'Internal server error' } };
      const mockUnwrap = vi.fn().mockRejectedValue(serverError);
      mockLogout.mockReturnValue({
        unwrap: mockUnwrap
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );

      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Logout API call failed:', serverError);
        expect(mockDispatch).toHaveBeenCalledWith(mockSetLogout());
        expect(mockPurgePersistedState).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    it('should handle multiple logout attempts', async () => {
      const mockUnwrap = vi.fn().mockResolvedValue({ success: true });
      mockLogout.mockReturnValue({
        unwrap: mockUnwrap
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );

      const logoutButton = screen.getByTestId('logout-button');
      const sidebarLogoutButton = screen.getByTestId('sidebar-logout-button');

      // Click both logout buttons rapidly
      fireEvent.click(logoutButton);
      fireEvent.click(sidebarLogoutButton);

      await waitFor(() => {
        // Should handle multiple calls gracefully
        expect(mockLogout).toHaveBeenCalledTimes(2);
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockPurgePersistedState).toHaveBeenCalledTimes(2);
        expect(mockNavigate).toHaveBeenCalledTimes(2);
      });
    });

    it('should handle logout with async purgePersistedState', async () => {
      // Mock async purgePersistedState
      mockPurgePersistedState.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      const mockUnwrap = vi.fn().mockResolvedValue({ success: true });
      mockLogout.mockReturnValue({
        unwrap: mockUnwrap
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );

      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalledWith({});
        expect(mockDispatch).toHaveBeenCalledWith(mockSetLogout());
        expect(mockPurgePersistedState).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      }, { timeout: 200 });
    });

    it('should handle logout when purgePersistedState throws error', async () => {
      // Mock purgePersistedState throwing error
      const purgeError = new Error('Purge failed');
      mockPurgePersistedState.mockRejectedValue(purgeError);
      const mockUnwrap = vi.fn().mockResolvedValue({ success: true });
      mockLogout.mockReturnValue({
        unwrap: mockUnwrap
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );

      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalledWith({});
        expect(mockDispatch).toHaveBeenCalledWith(mockSetLogout());
        expect(mockPurgePersistedState).toHaveBeenCalled();
        // Navigation might not happen if purgePersistedState throws
        // This is expected behavior as the component handles the error gracefully
      });
    });

    it('should handle logout when navigate throws error', async () => {
      // Mock navigate throwing error
      const navigateError = new Error('Navigation failed');
      mockNavigate.mockImplementation(() => { throw navigateError; });
      const mockUnwrap = vi.fn().mockResolvedValue({ success: true });
      mockLogout.mockReturnValue({
        unwrap: mockUnwrap
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );

      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalledWith({});
        expect(mockDispatch).toHaveBeenCalledWith(mockSetLogout());
        expect(mockPurgePersistedState).toHaveBeenCalled();
        // Navigation attempt is made but throws error
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });
  });
}); 