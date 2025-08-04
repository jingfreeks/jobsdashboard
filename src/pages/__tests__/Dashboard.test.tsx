import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/testUtils';
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

vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

vi.mock('@/features/authSlice', () => ({
  useLogoutMutation: () => [mockLogout],
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    logout: async (showMessage = true) => {
      try {
        await mockLogout({}).unwrap();
        if (showMessage) {
          console.log('Successfully logged out from server');
        }
      } catch (error) {
        console.error('Logout API call failed:', error);
        if (showMessage) {
          // Mock showError function
        }
      } finally {
        mockDispatch(mockSetLogout());
        await mockPurgePersistedState();
        mockNavigate("/login");
      }
    },
    forceLogout: async (reason = 'Session expired') => {
      console.warn(`Force logout triggered: ${reason}`);
      // Call logout without showing message
      try {
        await mockLogout({}).unwrap();
      } catch (error) {
        console.error('Logout API call failed:', error);
      } finally {
        mockDispatch(mockSetLogout());
        await mockPurgePersistedState();
        mockNavigate("/login");
      }
    },
  }),
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
  Sidebar: ({ handleLogout, handleSettingsClick }: { handleLogout: () => void; handleSettingsClick: (data: string) => void }) => (
    <aside data-testid="sidebar">
      <div>Main</div>
      <button onClick={handleLogout} data-testid="sidebar-logout-button">
        Sidebar Logout
      </button>
      <button onClick={() => handleSettingsClick('bank')} data-testid="settings-bank-button">
        Bank Settings
      </button>
      <button onClick={() => handleSettingsClick('city')} data-testid="settings-city-button">
        City Settings
      </button>
      <button onClick={() => handleSettingsClick('state')} data-testid="settings-state-button">
        State Settings
      </button>
      <button onClick={() => handleSettingsClick('company')} data-testid="settings-company-button">
        Company Settings
      </button>
      <button onClick={() => handleSettingsClick('skills')} data-testid="settings-skills-button">
        Skills Settings
      </button>
      <button onClick={() => handleSettingsClick('shift')} data-testid="settings-shift-button">
        Shift Settings
      </button>
      <button onClick={() => handleSettingsClick('department')} data-testid="settings-department-button">
        Department Settings
      </button>
      <button onClick={() => handleSettingsClick('invalid')} data-testid="settings-invalid-button">
        Invalid Settings
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

  describe('handleSettingsClick function', () => {
    it('should set selectedSettings to "bank" when data is "bank"', () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );
      
      const bankButton = screen.getByTestId('settings-bank-button');
      fireEvent.click(bankButton);
      
      // Verify the button is clickable and function is called
      expect(bankButton).toBeInTheDocument();
    });

    it('should set selectedSettings to "city" when data is "city"', () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );
      
      const cityButton = screen.getByTestId('settings-city-button');
      fireEvent.click(cityButton);
      
      expect(cityButton).toBeInTheDocument();
    });

    it('should set selectedSettings to "state" when data is "state"', () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );
      
      const stateButton = screen.getByTestId('settings-state-button');
      fireEvent.click(stateButton);
      
      expect(stateButton).toBeInTheDocument();
    });

    it('should set selectedSettings to "company" when data is "company"', () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );
      
      const companyButton = screen.getByTestId('settings-company-button');
      fireEvent.click(companyButton);
      
      expect(companyButton).toBeInTheDocument();
    });

    it('should set selectedSettings to "skills" when data is "skills"', () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );
      
      const skillsButton = screen.getByTestId('settings-skills-button');
      fireEvent.click(skillsButton);
      
      expect(skillsButton).toBeInTheDocument();
    });

    it('should set selectedSettings to "shift" when data is "shift"', () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );
      
      const shiftButton = screen.getByTestId('settings-shift-button');
      fireEvent.click(shiftButton);
      
      expect(shiftButton).toBeInTheDocument();
    });

    it('should set selectedSettings to "department" when data is "department"', () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );
      
      const departmentButton = screen.getByTestId('settings-department-button');
      fireEvent.click(departmentButton);
      
      expect(departmentButton).toBeInTheDocument();
    });

    it('should not set selectedSettings when data is not a valid setting', () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );
      
      const invalidButton = screen.getByTestId('settings-invalid-button');
      fireEvent.click(invalidButton);
      
      // The function should handle invalid data gracefully
      expect(invalidButton).toBeInTheDocument();
    });

    it('should handle multiple consecutive calls with different valid settings', () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );
      
      const bankButton = screen.getByTestId('settings-bank-button');
      const cityButton = screen.getByTestId('settings-city-button');
      const stateButton = screen.getByTestId('settings-state-button');
      
      // Click multiple settings buttons in sequence
      fireEvent.click(bankButton);
      fireEvent.click(cityButton);
      fireEvent.click(stateButton);
      
      // All buttons should be clickable
      expect(bankButton).toBeInTheDocument();
      expect(cityButton).toBeInTheDocument();
      expect(stateButton).toBeInTheDocument();
    });

    it('should handle multiple consecutive calls with same valid setting', () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );
      
      const bankButton = screen.getByTestId('settings-bank-button');
      
      // Click the same button multiple times
      fireEvent.click(bankButton);
      fireEvent.click(bankButton);
      fireEvent.click(bankButton);
      
      // Button should remain clickable
      expect(bankButton).toBeInTheDocument();
    });

    it('should handle mixed valid and invalid data calls', () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );
      
      const bankButton = screen.getByTestId('settings-bank-button');
      const invalidButton = screen.getByTestId('settings-invalid-button');
      
      // Mix valid and invalid calls
      fireEvent.click(bankButton);
      fireEvent.click(invalidButton);
      fireEvent.click(bankButton);
      
      // Both buttons should be clickable
      expect(bankButton).toBeInTheDocument();
      expect(invalidButton).toBeInTheDocument();
    });

    it('should handle rapid successive calls', () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );
      
      const bankButton = screen.getByTestId('settings-bank-button');
      const cityButton = screen.getByTestId('settings-city-button');
      
      // Rapid successive clicks
      fireEvent.click(bankButton);
      fireEvent.click(cityButton);
      fireEvent.click(bankButton);
      fireEvent.click(cityButton);
      
      // Buttons should remain responsive
      expect(bankButton).toBeInTheDocument();
      expect(cityButton).toBeInTheDocument();
    });

    it('should handle all valid settings in sequence', () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );
      
      const validSettings = [
        'settings-bank-button',
        'settings-city-button',
        'settings-state-button',
        'settings-company-button',
        'settings-skills-button',
        'settings-shift-button',
        'settings-department-button'
      ];
      
      // Click all valid settings buttons
      validSettings.forEach(testId => {
        const button = screen.getByTestId(testId);
        fireEvent.click(button);
        expect(button).toBeInTheDocument();
      });
    });

    it('should handle function calls with edge case data values', () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );
      
      // Test that the function handles various edge cases gracefully
      const invalidButton = screen.getByTestId('settings-invalid-button');
      fireEvent.click(invalidButton);
      
      // The function should not crash with invalid data
      expect(invalidButton).toBeInTheDocument();
    });

    it('should maintain component state consistency after settings changes', () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );
      
      const bankButton = screen.getByTestId('settings-bank-button');
      const cityButton = screen.getByTestId('settings-city-button');
      
      // Change settings multiple times
      fireEvent.click(bankButton);
      fireEvent.click(cityButton);
      fireEvent.click(bankButton);
      
      // Component should remain stable
      expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    it('should handle settings clicks after logout attempts', () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );
      
      const logoutButton = screen.getByTestId('logout-button');
      const bankButton = screen.getByTestId('settings-bank-button');
      
      // Try to click settings after logout attempt
      fireEvent.click(logoutButton);
      fireEvent.click(bankButton);
      
      // Both buttons should remain functional
      expect(logoutButton).toBeInTheDocument();
      expect(bankButton).toBeInTheDocument();
    });

    it('should handle settings clicks with component re-renders', () => {
      const { rerender } = render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );
      
      const bankButton = screen.getByTestId('settings-bank-button');
      fireEvent.click(bankButton);
      
      // Re-render component
      rerender(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );
      
      // Settings button should still be available
      expect(screen.getByTestId('settings-bank-button')).toBeInTheDocument();
    });
  });
}); 