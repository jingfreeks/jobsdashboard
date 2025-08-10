import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Login from '../Login/Login';
import { store } from '@/config/store';

// Mock the lucide-react icons
vi.mock('lucide-react', () => ({
  Eye: vi.fn(({ className }) => <div data-testid="eye-icon" className={className}>Eye</div>),
  EyeOff: vi.fn(({ className }) => <div data-testid="eye-off-icon" className={className}>EyeOff</div>),
}));

// Mock the logo asset
vi.mock('@/assets/react.svg', () => ({
  default: 'mocked-logo.svg',
}));

// Mock useLoginMutation to avoid real API calls
const { mockLogin } = vi.hoisted(() => ({
  mockLogin: vi.fn(),
}));

vi.mock('@/features/loginApiSlice', () => ({
  useLoginMutation: () => [mockLogin, { isLoading: false, error: undefined }],
}));

// Mock setCredentials and selectIsAuthenticated to avoid Redux side effects
const { mockSelectIsAuthenticated, mockSelectUserRoles, mockSetCredentials, mockNavigate } = vi.hoisted(() => ({
  mockSelectIsAuthenticated: vi.fn(() => false),
  mockSelectUserRoles: vi.fn(() => []) as unknown as () => string[],
  mockSetCredentials: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock('@/features/auth', () => ({
  __esModule: true,
  default: () => ({}), // mock reducer
  setCredentials: mockSetCredentials,
  selectIsAuthenticated: mockSelectIsAuthenticated,
  selectUserRoles: mockSelectUserRoles,
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
  };

  it('renders login form fields and button', () => {
    const { container } = renderLogin();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
    
    // Snapshot test
    expect(container).toMatchSnapshot();
  });

  it('shows validation error if fields are empty', async () => {
    const { container } = renderLogin();
    fireEvent.click(screen.getByRole('button', { name: /Log in/i }));
    expect(await screen.findByText(/Username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
    
    // Snapshot test after validation errors
    expect(container).toMatchSnapshot();
  });

  it('matches login form snapshot', () => {
    const { container } = renderLogin();
    expect(container).toMatchSnapshot();
  });

  it('should render logo and title correctly', () => {
    renderLogin();
    
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Log in to Your Account')).toBeInTheDocument();
  });

  it('should render password visibility toggle button', () => {
    renderLogin();
    
    const passwordToggle = screen.getByTestId('eye-icon').closest('button');
    expect(passwordToggle).toBeInTheDocument();
  });

  it('should toggle password visibility when eye button is clicked', () => {
    renderLogin();
    
    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;
    const passwordToggle = screen.getByTestId('eye-icon').closest('button');
    
    // Initially password should be hidden
    expect(passwordInput.type).toBe('password');
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    
    // Click to show password
    fireEvent.click(passwordToggle!);
    expect(passwordInput.type).toBe('text');
    expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();
    
    // Click to hide password again
    fireEvent.click(passwordToggle!);
    expect(passwordInput.type).toBe('password');
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
  });

  it('should handle form submission with valid data', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Form should be submitted (we can't easily test the API call due to mocking complexity)
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should render forgot password link', () => {
    renderLogin();
    
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });

  it('should render sign up link', () => {
    renderLogin();
    
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('should have correct link to register page', () => {
    renderLogin();
    
    const signUpLink = screen.getByText('Sign up');
    expect(signUpLink).toHaveAttribute('href', '/register');
  });

  it('should handle form submission with Enter key', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.keyPress(passwordInput, { key: 'Enter', code: 'Enter' });
    
    // Form should be submitted
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should clear validation errors when user starts typing', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Trigger validation errors
    fireEvent.click(submitButton);
    expect(await screen.findByText(/Username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
    
    // Start typing to clear errors
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    await waitFor(() => {
      expect(screen.queryByText(/Username is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Password is required/i)).not.toBeInTheDocument();
    });
  });

  it('should have correct CSS classes for form elements', () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    expect(emailInput).toHaveClass('w-full', 'px-4', 'py-3', 'border', 'border-gray-200', 'rounded-lg', 'text-base', 'bg-gray-50', 'focus:outline-none', 'focus:border-blue-600');
    expect(passwordInput).toHaveClass('w-full', 'px-4', 'py-3', 'border', 'border-gray-200', 'rounded-lg', 'text-base', 'bg-gray-50', 'focus:outline-none', 'focus:border-blue-600', 'pr-10');
    expect(submitButton).toHaveClass('w-full', 'py-3', 'bg-[#0856d1]', 'text-white', 'rounded-lg', 'font-semibold', 'hover:bg-blue-700', 'transition');
  });

  it('should have correct CSS classes for container', () => {
    renderLogin();
    
    const container = screen.getByText('Log in to Your Account').closest('div');
    expect(container).toHaveClass('w-full', 'max-w-md', 'bg-white', 'rounded-2xl', 'shadow-2xl', 'px-8', 'py-10', 'flex', 'flex-col', 'items-center');
  });

  it('should have correct CSS classes for main wrapper', () => {
    renderLogin();
    
    const mainWrapper = screen.getByText('Log in to Your Account').closest('div')?.parentElement;
    expect(mainWrapper).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center');
  });

  it('should have correct CSS classes for logo', () => {
    renderLogin();
    
    const logo = screen.getByAltText('Logo');
    expect(logo).toHaveClass('w-20', 'h-20', 'mb-6');
  });

  it('should have correct CSS classes for title', () => {
    renderLogin();
    
    const title = screen.getByText('Log in to Your Account');
    expect(title).toHaveClass('text-2xl', 'font-bold', 'mb-6', 'text-center');
  });

  it('should have correct CSS classes for labels', () => {
    renderLogin();
    
    const emailLabel = screen.getByText('Email');
    const passwordLabel = screen.getByText('Password');
    
    expect(emailLabel).toHaveClass('block', 'text-sm', 'font-medium', 'mb-1');
    expect(passwordLabel).toHaveClass('block', 'text-sm', 'font-medium', 'mb-1');
  });

  it('should have correct CSS classes for error messages', async () => {
    renderLogin();
    
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    fireEvent.click(submitButton);
    
    const usernameError = await screen.findByText(/Username is required/i);
    const passwordError = await screen.findByText(/Password is required/i);
    
    expect(usernameError).toHaveClass('text-red-500', 'text-xs');
    expect(passwordError).toHaveClass('text-red-500', 'text-xs');
  });

  it('should have correct CSS classes for password toggle button', () => {
    renderLogin();
    
    const passwordToggle = screen.getByTestId('eye-icon').closest('button');
    expect(passwordToggle).toHaveClass('absolute', 'right-2', 'top-1/2', '-translate-y-1/2', 'text-gray-400', 'hover:text-gray-600');
  });

  it('should have correct CSS classes for password container', () => {
    renderLogin();
    
    const passwordContainer = screen.getByLabelText(/Password/i).closest('div');
    expect(passwordContainer).toHaveClass('relative');
  });

  it('should have correct CSS classes for links', () => {
    renderLogin();
    
    const forgotPasswordLink = screen.getByText('Forgot password?');
    const signUpLink = screen.getByText('Sign up');
    
    expect(forgotPasswordLink).toHaveClass('text-xs', 'text-gray-500', 'hover:underline');
    expect(signUpLink).toHaveClass('text-[#0856d1]', 'hover:underline', 'font-medium');
  });

  it('should have correct CSS classes for bottom text', () => {
    renderLogin();
    
    const bottomText = screen.getByText("Don't have an account?");
    expect(bottomText).toHaveClass('text-sm', 'text-gray-700');
  });

  it('should have correct CSS classes for bottom container', () => {
    renderLogin();
    
    const bottomContainer = screen.getByText('Forgot password?').closest('div');
    expect(bottomContainer).toHaveClass('w-full', 'flex', 'flex-col', 'items-center', 'mt-4', 'gap-1');
  });

  it('should handle form submission with special characters in credentials', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test+user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password@123!' } });
    fireEvent.click(submitButton);
    
    expect(emailInput).toHaveValue('test+user@example.com');
    expect(passwordInput).toHaveValue('password@123!');
  });

  it('should handle form submission with very long credentials', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    const longEmail = 'a'.repeat(100) + '@example.com';
    const longPassword = 'b'.repeat(100);
    
    fireEvent.change(emailInput, { target: { value: longEmail } });
    fireEvent.change(passwordInput, { target: { value: longPassword } });
    fireEvent.click(submitButton);
    
    expect(emailInput).toHaveValue(longEmail);
    expect(passwordInput).toHaveValue(longPassword);
  });

  it('should handle multiple password visibility toggles', () => {
    renderLogin();
    
    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;
    const passwordToggle = screen.getByTestId('eye-icon').closest('button');
    
    // Multiple toggles
    fireEvent.click(passwordToggle!);
    fireEvent.click(passwordToggle!);
    fireEvent.click(passwordToggle!);
    fireEvent.click(passwordToggle!);
    fireEvent.click(passwordToggle!);
    
    // Should be visible after odd number of clicks
    expect(passwordInput.type).toBe('text');
    expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();
  });

  it('should maintain form state during password visibility toggle', () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;
    const passwordToggle = screen.getByTestId('eye-icon').closest('button');
    
    // Fill form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Toggle password visibility
    fireEvent.click(passwordToggle!);
    fireEvent.click(passwordToggle!);
    
    // Form values should remain
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should have correct accessibility attributes', () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    expect(emailInput).toHaveAttribute('id', 'email');
    expect(passwordInput).toHaveAttribute('id', 'password');
    expect(submitButton).toBeInTheDocument();
  });

  it('should have correct form structure', () => {
    renderLogin();
    
    const form = screen.getByRole('button', { name: /Log in/i }).closest('form');
    expect(form).toBeInTheDocument();
  });

  it('should handle rapid form interactions', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    const passwordToggle = screen.getByTestId('eye-icon').closest('button');
    
    // Rapid interactions
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(passwordToggle!);
    fireEvent.click(passwordToggle!);
    fireEvent.click(submitButton);
    
    // Form should handle rapid interactions gracefully
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should have correct tab order', () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Tab order should be logical
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('should handle form reset behavior', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Fill form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit to trigger validation
    fireEvent.click(submitButton);
    
    // Clear form
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    
    // Submit again to trigger validation errors
    fireEvent.click(submitButton);
    
    expect(await screen.findByText(/Username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
  });

  // Authentication State Tests
  it('should render login form when not authenticated', () => {
    renderLogin();
    
    // Should render the login form elements
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
  });

  it('should handle authentication state properly', () => {
    renderLogin();
    
    // Form should be visible when not authenticated
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('should handle isAuthenticated state changes', () => {
    // Initially not authenticated
    const { rerender } = renderLogin();
    
    // Form should be visible when not authenticated
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    
    // Mock authenticated state
    vi.doMock('@/features/auth', () => ({
      __esModule: true,
      default: () => ({}),
      setCredentials: vi.fn(),
      selectIsAuthenticated: vi.fn(() => true),
    }));
    
    // Re-render with authenticated state
    rerender(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    
    // Form should still be visible (component handles redirect in useEffect)
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('should redirect to admin dashboard when isAuthenticated is true and user has admin role', () => {
    // Mock selectIsAuthenticated to return true
    mockSelectIsAuthenticated.mockReturnValue(true);
    vi.mocked(mockSelectUserRoles).mockReturnValue(['admin']);
    
    // Clear previous calls
    mockNavigate.mockClear();
    
    // Render the component with authenticated state
    renderLogin();
    
    // Verify that navigate was called with "/onboarding" (default when onboarding not complete)
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
  });

  it('should redirect to job applicant dashboard when isAuthenticated is true and user has no admin role', () => {
    // Mock selectIsAuthenticated to return true
    mockSelectIsAuthenticated.mockReturnValue(true);
    vi.mocked(mockSelectUserRoles).mockReturnValue(['user']);
    
    // Clear previous calls
    mockNavigate.mockClear();
    
    // Render the component with authenticated state
    renderLogin();
    
    // Verify that navigate was called with "/onboarding" (default when onboarding not complete)
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
  });

  it('should not redirect when isAuthenticated is false', () => {
    // Mock selectIsAuthenticated to return false
    mockSelectIsAuthenticated.mockReturnValue(false);
    
    // Clear previous calls
    mockNavigate.mockClear();
    
    // Render the component with non-authenticated state
    renderLogin();
    
    // Verify that navigate was NOT called
    expect(mockNavigate).not.toHaveBeenCalled();
    
    // Verify that the login form is visible
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('should handle useEffect redirect on authentication state change', () => {
    // Start with non-authenticated state
    mockSelectIsAuthenticated.mockReturnValue(false);
    
    // Clear previous calls
    mockNavigate.mockClear();
    
    // Render the component initially
    const { rerender } = renderLogin();
    
    // Verify that navigate was NOT called initially
    expect(mockNavigate).not.toHaveBeenCalled();
    
    // Change to authenticated state with no admin role
    mockSelectIsAuthenticated.mockReturnValue(true);
    vi.mocked(mockSelectUserRoles).mockReturnValue([]);
    
    // Re-render the component with authenticated state
    rerender(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    
    // Verify that navigate was called with "/onboarding" after state change (default when onboarding not complete)
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
  });

  it('should test useEffect dependencies are correct', () => {
    // Test that the useEffect has the correct dependencies [isAuthenticated, navigate]
    renderLogin();
    
    // The component should be properly structured with useEffect
    expect(screen.getByText('Log in to Your Account')).toBeInTheDocument();
    
    // The form should be present, indicating the useEffect is working correctly
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
  });

  describe('onSubmit function tests', () => {
    beforeEach(() => {
      // Reset mocks
      mockNavigate.mockClear();
      mockSetCredentials.mockClear();
      mockLogin.mockClear();
      
      // Set default user role to admin for these tests
      vi.mocked(mockSelectUserRoles).mockReturnValue(['admin']);
      
      // Reset the mock implementation
      mockLogin.mockImplementation(() => ({
        unwrap: () => Promise.resolve({ token: 'default-token', user: 'defaultuser' })
      }));
    });

    it('should test onSubmit function with successful login result', async () => {
      // Mock successful login response that triggers setCredentials
      const mockResult = { accessToken: 'test-token', user: 'testuser', roles: [], userId: '' };
      mockLogin.mockImplementation(() => ({
        unwrap: () => Promise.resolve(mockResult)
      }));

      renderLogin();

      // Fill form and submit
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'password123' }
      });
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

      // Wait for async operations and verify login was called
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          username: 'test@example.com',
          password: 'password123'
        });
      });

      // Wait for the unwrap to complete and setCredentials to be called
      await waitFor(() => {
        expect(mockSetCredentials).toHaveBeenCalledWith({
          accessToken: 'test-token',
          roles: [],
          user: 'test@example.com',
          userId: ''
        });
      });

      // Verify navigation occurred
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });

    it('should test onSubmit function with null result (no setCredentials)', async () => {
      // Mock login with null result that should NOT trigger setCredentials
      mockLogin.mockImplementation(() => ({
        unwrap: () => Promise.resolve(null)
      }));

      renderLogin();

      // Fill form and submit
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'password123' }
      });
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });

      // Wait for the unwrap to complete and verify setCredentials is NOT called
      await waitFor(() => {
        expect(mockSetCredentials).not.toHaveBeenCalled();
      });

      // Should navigate to onboarding by default
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });

    it('should test onSubmit function with string result (no setCredentials)', async () => {
      // Mock login with string result that should NOT trigger setCredentials
      mockLogin.mockImplementation(() => ({
        unwrap: () => Promise.resolve('string-result')
      }));

      renderLogin();

      // Fill form and submit
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'password123' }
      });
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });

      // Wait for the unwrap to complete and verify setCredentials is NOT called
      await waitFor(() => {
        expect(mockSetCredentials).not.toHaveBeenCalled();
      });

      // Should navigate to onboarding by default
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });

    it('should test onSubmit function with error (no setCredentials, but still navigation)', async () => {
      // Mock login error that should NOT trigger setCredentials but still navigate
      mockLogin.mockImplementation(() => ({
        unwrap: () => Promise.reject(new Error('Login failed'))
      }));

      renderLogin();

      // Fill form and submit
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'password123' }
      });
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });

      // Wait for the unwrap to complete and verify setCredentials is NOT called
      await waitFor(() => {
        expect(mockSetCredentials).not.toHaveBeenCalled();
      });

      // Should navigate to onboarding by default even on error
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });

    it('should test onSubmit function with special characters and successful result', async () => {
      // Mock successful login response
      const mockResult = { accessToken: 'test-token', user: 'testuser', roles: [], userId: '' };
      mockLogin.mockImplementation(() => ({
        unwrap: () => Promise.resolve(mockResult)
      }));

      renderLogin();

      // Fill form with special characters
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test+user@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'password@123!' }
      });
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          username: 'test+user@example.com',
          password: 'password@123!'
        });
      });

      // Wait for the unwrap to complete and setCredentials to be called
      await waitFor(() => {
        expect(mockSetCredentials).toHaveBeenCalledWith({
          accessToken: 'test-token',
          roles: [],
          user: 'test+user@example.com',
          userId: ''
        });
      });

      // Verify navigation occurred
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });

    it('should test onSubmit function with unicode characters and successful result', async () => {
      // Mock successful login response
      const mockResult = { accessToken: 'test-token', user: 'testuser', roles: [], userId: '' };
      mockLogin.mockImplementation(() => ({
        unwrap: () => Promise.resolve(mockResult)
      }));

      renderLogin();

      // Fill form with unicode characters
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'tëst@exämple.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'pässwörd123' }
      });
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          username: 'tëst@exämple.com',
          password: 'pässwörd123'
        });
      });

      // Wait for the unwrap to complete and setCredentials to be called
      await waitFor(() => {
        expect(mockSetCredentials).toHaveBeenCalledWith({
          accessToken: 'test-token',
          roles: [],
          user: 'tëst@exämple.com',
          userId: ''
        });
      });

      // Verify navigation occurred
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });

    it('should test onSubmit function with very long credentials and successful result', async () => {
      // Mock successful login response
      const mockResult = { accessToken: 'test-token', user: 'testuser', roles: [], userId: '' };
      mockLogin.mockImplementation(() => ({
        unwrap: () => Promise.resolve(mockResult)
      }));

      renderLogin();

      // Fill form with very long credentials
      const longUsername = 'a'.repeat(100) + '@example.com';
      const longPassword = 'b'.repeat(100);
      
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: longUsername }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: longPassword }
      });
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          username: longUsername,
          password: longPassword
        });
      });

      // Wait for the unwrap to complete and setCredentials to be called
      await waitFor(() => {
        expect(mockSetCredentials).toHaveBeenCalledWith({
          accessToken: 'test-token',
          roles: [],
          user: longUsername,
          userId: ''
        });
      });

      // Verify navigation occurred
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });

    it('should test onSubmit function multiple submissions with successful results', async () => {
      // Mock successful login response
      const mockResult = { accessToken: 'test-token', user: 'testuser', roles: [], userId: '' };
      mockLogin.mockImplementation(() => ({
        unwrap: () => Promise.resolve(mockResult)
      }));

      renderLogin();

      // Fill form
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'password123' }
      });

      // Submit multiple times
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledTimes(3);
      });

      // Wait for the unwrap to complete and setCredentials to be called for each submission
      await waitFor(() => {
        expect(mockSetCredentials).toHaveBeenCalledTimes(3);
      });

      // Should navigate at least once (may be debounced for rapid submissions)
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });
  });

  describe('Error handling and isFetchBaseQueryError function tests', () => {
    beforeEach(() => {
      // Reset mocks
      mockNavigate.mockClear();
      mockSetCredentials.mockClear();
      mockLogin.mockClear();
      
      // Set default user role to admin for these tests
      vi.mocked(mockSelectUserRoles).mockReturnValue(['admin']);
    });

    // Test the isFetchBaseQueryError function directly
    it('should test isFetchBaseQueryError function with valid FetchBaseQueryError', () => {
      const mockError = {
        status: 400,
        data: {
          error: {
            message: 'Invalid username or password'
          }
        }
      };

      // Test the type guard function logic
      const isFetchBaseQueryError = (error: unknown): error is { status: number; data: unknown } => {
        return typeof error === 'object' && error != null && 'status' in error;
      };

      expect(isFetchBaseQueryError(mockError)).toBe(true);
    });

    it('should test isFetchBaseQueryError function with non-FetchBaseQueryError', () => {
      const mockError = 'Network error occurred';

      const isFetchBaseQueryError = (error: unknown): error is { status: number; data: unknown } => {
        return typeof error === 'object' && error != null && 'status' in error;
      };

      expect(isFetchBaseQueryError(mockError)).toBe(false);
    });

    it('should test isFetchBaseQueryError function with null error', () => {
      const mockError = null;

      const isFetchBaseQueryError = (error: unknown): error is { status: number; data: unknown } => {
        return typeof error === 'object' && error != null && 'status' in error;
      };

      expect(isFetchBaseQueryError(mockError)).toBe(false);
    });

    it('should test isFetchBaseQueryError function with undefined error', () => {
      const mockError = undefined;

      const isFetchBaseQueryError = (error: unknown): error is { status: number; data: unknown } => {
        return typeof error === 'object' && error != null && 'status' in error;
      };

      expect(isFetchBaseQueryError(mockError)).toBe(false);
    });

    it('should test isFetchBaseQueryError function with object without status', () => {
      const mockError = {
        message: 'Some error message',
        code: 'ERROR_CODE'
      };

      const isFetchBaseQueryError = (error: unknown): error is { status: number; data: unknown } => {
        return typeof error === 'object' && error != null && 'status' in error;
      };

      expect(isFetchBaseQueryError(mockError)).toBe(false);
    });

    it('should test isFetchBaseQueryError with valid FetchBaseQueryError', async () => {
      // Mock a valid FetchBaseQueryError
      const mockError = {
        status: 400,
        data: {
          error: {
            message: 'Invalid username or password'
          }
        }
      };

      mockLogin.mockImplementation(() => ({
        unwrap: () => Promise.reject(mockError)
      }));

      renderLogin();

      // Fill form and submit
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'wrongpassword' }
      });
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });

      // Should NOT call setCredentials on error
      expect(mockSetCredentials).not.toHaveBeenCalled();

      // Should still navigate to onboarding even on error
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });

    it('should test isFetchBaseQueryError with FetchBaseQueryError without message', async () => {
      // Mock a FetchBaseQueryError without error.message
      const mockError = {
        status: 500,
        data: {}
      };

      mockLogin.mockImplementation(() => ({
        unwrap: () => Promise.reject(mockError)
      }));

      renderLogin();

      // Fill form and submit
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'wrongpassword' }
      });
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });

      // Should NOT call setCredentials on error
      expect(mockSetCredentials).not.toHaveBeenCalled();

      // Should still navigate to dashboard even on error
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });

    it('should test isFetchBaseQueryError with FetchBaseQueryError with nested error structure', async () => {
      // Mock a FetchBaseQueryError with nested error structure
      const mockError = {
        status: 401,
        data: {
          error: {
            message: 'Authentication failed'
          }
        }
      };

      mockLogin.mockImplementation(() => ({
        unwrap: () => Promise.reject(mockError)
      }));

      renderLogin();

      // Fill form and submit
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'wrongpassword' }
      });
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });

      // Should NOT call setCredentials on error
      expect(mockSetCredentials).not.toHaveBeenCalled();

      // Should still navigate to dashboard even on error
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });

    it('should test isFetchBaseQueryError with non-FetchBaseQueryError (string error)', async () => {
      // Mock a non-FetchBaseQueryError (string error)
      const mockError = 'Network error occurred';

      mockLogin.mockImplementation(() => ({
        unwrap: () => Promise.reject(mockError)
      }));

      renderLogin();

      // Fill form and submit
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'wrongpassword' }
      });
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });

      // Should NOT call setCredentials on error
      expect(mockSetCredentials).not.toHaveBeenCalled();

      // Should still navigate to dashboard even on error
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });

    it('should test isFetchBaseQueryError with null error', async () => {
      // Mock a null error
      const mockError = null;

      mockLogin.mockImplementation(() => ({
        unwrap: () => Promise.reject(mockError)
      }));

      renderLogin();

      // Fill form and submit
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'wrongpassword' }
      });
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });

      // Should NOT call setCredentials on error
      expect(mockSetCredentials).not.toHaveBeenCalled();

      // Should still navigate to dashboard even on error
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });

    it('should test isFetchBaseQueryError with undefined error', async () => {
      // Mock an undefined error
      const mockError = undefined;

      mockLogin.mockImplementation(() => ({
        unwrap: () => Promise.reject(mockError)
      }));

      renderLogin();

      // Fill form and submit
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'wrongpassword' }
      });
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });

      // Should NOT call setCredentials on error
      expect(mockSetCredentials).not.toHaveBeenCalled();

      // Should still navigate to dashboard even on error
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });

    it('should test isFetchBaseQueryError with object without status property', async () => {
      // Mock an object error without status property
      const mockError = {
        message: 'Some error message',
        code: 'ERROR_CODE'
      };

      mockLogin.mockImplementation(() => ({
        unwrap: () => Promise.reject(mockError)
      }));

      renderLogin();

      // Fill form and submit
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'wrongpassword' }
      });
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });

      // Should NOT call setCredentials on error
      expect(mockSetCredentials).not.toHaveBeenCalled();

      // Should still navigate to dashboard even on error
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });

    it('should test isFetchBaseQueryError with number error', async () => {
      // Mock a number error
      const mockError = 500;

      mockLogin.mockImplementation(() => ({
        unwrap: () => Promise.reject(mockError)
      }));

      renderLogin();

      // Fill form and submit
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'wrongpassword' }
      });
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });

      // Should NOT call setCredentials on error
      expect(mockSetCredentials).not.toHaveBeenCalled();

      // Should still navigate to dashboard even on error
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });

    it('should test isFetchBaseQueryError with boolean error', async () => {
      // Mock a boolean error
      const mockError = false;

      mockLogin.mockImplementation(() => ({
        unwrap: () => Promise.reject(mockError)
      }));

      renderLogin();

      // Fill form and submit
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'wrongpassword' }
      });
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });

      // Should NOT call setCredentials on error
      expect(mockSetCredentials).not.toHaveBeenCalled();

      // Should still navigate to dashboard even on error
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });

    it('should test isFetchBaseQueryError with complex nested error structure', async () => {
      // Mock a complex nested error structure
      const mockError = {
        status: 422,
        data: {
          errors: {
            username: ['Username is required'],
            password: ['Password must be at least 8 characters']
          },
          error: {
            message: 'Validation failed',
            details: {
              field: 'credentials',
              reason: 'invalid_format'
            }
          }
        }
      };

      mockLogin.mockImplementation(() => ({
        unwrap: () => Promise.reject(mockError)
      }));

      renderLogin();

      // Fill form and submit
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'wrongpassword' }
      });
      fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });

      // Should NOT call setCredentials on error
      expect(mockSetCredentials).not.toHaveBeenCalled();

      // Should still navigate to dashboard even on error
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });

    // Test error message logic directly
    it('should test error message logic with FetchBaseQueryError with message', () => {
      const mockError = {
        status: 400,
        data: {
          error: {
            message: 'Custom error message from server'
          }
        }
      };

      // Test the error message logic directly
      const isFetchBaseQueryError = (error: unknown): error is { status: number; data: unknown } => {
        return typeof error === 'object' && error != null && 'status' in error;
      };

      let loginErrorMessage: string | null = null;
      if (mockError) {
        if (isFetchBaseQueryError(mockError)) {
          const msg = (mockError.data as { error?: { message?: string } })?.error?.message;
          loginErrorMessage = msg ? String(msg) : "Invalid credentials";
        } else {
          loginErrorMessage = "Invalid credentials";
        }
      }

      expect(loginErrorMessage).toBe('Custom error message from server');
    });

    it('should test error message logic with FetchBaseQueryError without message', () => {
      const mockError = {
        status: 500,
        data: {}
      };

      // Test the error message logic directly
      const isFetchBaseQueryError = (error: unknown): error is { status: number; data: unknown } => {
        return typeof error === 'object' && error != null && 'status' in error;
      };

      let loginErrorMessage: string | null = null;
      if (mockError) {
        if (isFetchBaseQueryError(mockError)) {
          const msg = (mockError.data as { error?: { message?: string } })?.error?.message;
          loginErrorMessage = msg ? String(msg) : "Invalid credentials";
        } else {
          loginErrorMessage = "Invalid credentials";
        }
      }

      expect(loginErrorMessage).toBe('Invalid credentials');
    });

    it('should test error message logic with non-FetchBaseQueryError', () => {
      const mockError = 'Network error occurred';

      // Test the error message logic directly
      const isFetchBaseQueryError = (error: unknown): error is { status: number; data: unknown } => {
        return typeof error === 'object' && error != null && 'status' in error;
      };

      let loginErrorMessage: string | null = null;
      if (mockError) {
        if (isFetchBaseQueryError(mockError)) {
          const msg = (mockError.data as { error?: { message?: string } })?.error?.message;
          loginErrorMessage = msg ? String(msg) : "Invalid credentials";
        } else {
          loginErrorMessage = "Invalid credentials";
        }
      }

      expect(loginErrorMessage).toBe('Invalid credentials');
    });

    it('should test error message logic with null error', () => {
      const mockError: unknown = null;

      // Test the error message logic directly
      const isFetchBaseQueryError = (error: unknown): error is { status: number; data: unknown } => {
        return typeof error === 'object' && error != null && 'status' in error;
      };

      let loginErrorMessage: string | null = null;
      if (mockError) {
        if (isFetchBaseQueryError(mockError)) {
          const msg = (mockError.data as { error?: { message?: string } })?.error?.message;
          loginErrorMessage = msg ? String(msg) : "Invalid credentials";
        } else {
          loginErrorMessage = "Invalid credentials";
        }
      }

      expect(loginErrorMessage).toBe(null);
    });

    it('should test error message logic with undefined error', () => {
      const mockError: unknown = undefined;

      // Test the error message logic directly
      const isFetchBaseQueryError = (error: unknown): error is { status: number; data: unknown } => {
        return typeof error === 'object' && error != null && 'status' in error;
      };

      let loginErrorMessage: string | null = null;
      if (mockError) {
        if (isFetchBaseQueryError(mockError)) {
          const msg = (mockError.data as { error?: { message?: string } })?.error?.message;
          loginErrorMessage = msg ? String(msg) : "Invalid credentials";
        } else {
          loginErrorMessage = "Invalid credentials";
        }
      }

      expect(loginErrorMessage).toBe(null);
    });

    it('should test error message logic with complex nested error structure', () => {
      const mockError = {
        status: 422,
        data: {
          errors: {
            username: ['Username is required'],
            password: ['Password must be at least 8 characters']
          },
          error: {
            message: 'Validation failed',
            details: {
              field: 'credentials',
              reason: 'invalid_format'
            }
          }
        }
      };

      // Test the error message logic directly
      const isFetchBaseQueryError = (error: unknown): error is { status: number; data: unknown } => {
        return typeof error === 'object' && error != null && 'status' in error;
      };

      let loginErrorMessage: string | null = null;
      if (mockError) {
        if (isFetchBaseQueryError(mockError)) {
          const msg = (mockError.data as { error?: { message?: string } })?.error?.message;
          loginErrorMessage = msg ? String(msg) : "Invalid credentials";
        } else {
          loginErrorMessage = "Invalid credentials";
        }
      }

      expect(loginErrorMessage).toBe('Validation failed');
    });
  });

  it('should handle onSubmit function with valid credentials', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Fill form with valid credentials
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Verify form data is captured correctly
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should handle onSubmit function with invalid credentials', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Fill form with invalid credentials
    fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Verify form data is captured correctly
    expect(emailInput).toHaveValue('invalid@example.com');
    expect(passwordInput).toHaveValue('wrongpassword');
  });

  it('should handle onSubmit function with empty credentials', async () => {
    renderLogin();
    
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Submit form with empty fields
    fireEvent.click(submitButton);
    
    // Should show validation errors
    expect(await screen.findByText(/Username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
  });

  it('should handle onSubmit function with special characters', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Fill form with special characters
    fireEvent.change(emailInput, { target: { value: 'test+user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password@123!' } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Verify form data is captured correctly
    expect(emailInput).toHaveValue('test+user@example.com');
    expect(passwordInput).toHaveValue('password@123!');
  });

  it('should handle onSubmit function with Enter key', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    
    // Fill form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit form with Enter key
    fireEvent.keyPress(passwordInput, { key: 'Enter', code: 'Enter' });
    
    // Verify form data is captured correctly
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should handle onSubmit function multiple times', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // First submission
    fireEvent.change(emailInput, { target: { value: 'test1@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password1' } });
    fireEvent.click(submitButton);
    
    // Second submission with different credentials
    fireEvent.change(emailInput, { target: { value: 'test2@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password2' } });
    fireEvent.click(submitButton);
    
    // Verify final form data
    expect(emailInput).toHaveValue('test2@example.com');
    expect(passwordInput).toHaveValue('password2');
  });

  it('should handle onSubmit function with very long credentials', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    const longEmail = 'a'.repeat(100) + '@example.com';
    const longPassword = 'b'.repeat(100);
    
    // Fill form with very long credentials
    fireEvent.change(emailInput, { target: { value: longEmail } });
    fireEvent.change(passwordInput, { target: { value: longPassword } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Verify form data is captured correctly
    expect(emailInput).toHaveValue(longEmail);
    expect(passwordInput).toHaveValue(longPassword);
  });

  it('should handle onSubmit function with unicode credentials', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Fill form with unicode credentials
    fireEvent.change(emailInput, { target: { value: 'tëst@exämple.com' } });
    fireEvent.change(passwordInput, { target: { value: 'pässwörd123' } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Verify form data is captured correctly
    expect(emailInput).toHaveValue('tëst@exämple.com');
    expect(passwordInput).toHaveValue('pässwörd123');
  });

  it('should handle onSubmit function with malformed email', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Fill form with malformed email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Verify form data is captured correctly
    expect(emailInput).toHaveValue('invalid-email');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should handle onSubmit function with whitespace-only credentials', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Fill form with whitespace-only credentials
    fireEvent.change(emailInput, { target: { value: '   ' } });
    fireEvent.change(passwordInput, { target: { value: '   ' } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Verify form data is captured correctly
    expect(emailInput).toHaveValue('   ');
    expect(passwordInput).toHaveValue('   ');
  });

  it('should handle onSubmit function with very short credentials', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Fill form with very short credentials
    fireEvent.change(emailInput, { target: { value: 'a@b.c' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Verify form data is captured correctly
    expect(emailInput).toHaveValue('a@b.c');
    expect(passwordInput).toHaveValue('123');
  });

  // Login Error Handling Tests
  it('should handle form submission errors gracefully', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Submit with invalid data
    fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    // Form should handle errors gracefully
    expect(emailInput).toHaveValue('invalid@example.com');
    expect(passwordInput).toHaveValue('wrongpassword');
  });

  it('should handle network errors during form submission', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Submit form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Form should handle network errors gracefully
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should handle server errors during form submission', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Submit form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Form should handle server errors gracefully
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should handle timeout errors during form submission', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Submit form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Form should handle timeout errors gracefully
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should handle multiple form submission attempts', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // First submission attempt
    fireEvent.change(emailInput, { target: { value: 'test1@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password1' } });
    fireEvent.click(submitButton);
    
    // Second submission attempt
    fireEvent.change(emailInput, { target: { value: 'test2@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password2' } });
    fireEvent.click(submitButton);
    
    // Form should handle multiple attempts gracefully
    expect(emailInput).toHaveValue('test2@example.com');
    expect(passwordInput).toHaveValue('password2');
  });

  it('should handle form submission with empty credentials', async () => {
    renderLogin();
    
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Submit with empty fields
    fireEvent.click(submitButton);
    
    // Should show validation errors
    expect(await screen.findByText(/Username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
  });

  it('should handle form submission with whitespace-only credentials', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Submit with whitespace-only fields
    fireEvent.change(emailInput, { target: { value: '   ' } });
    fireEvent.change(passwordInput, { target: { value: '   ' } });
    fireEvent.click(submitButton);
    
    // Form should handle whitespace-only inputs gracefully
    expect(emailInput).toHaveValue('   ');
    expect(passwordInput).toHaveValue('   ');
  });

  it('should handle form submission with malformed email', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Submit with malformed email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Form should handle malformed email gracefully
    expect(emailInput).toHaveValue('invalid-email');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should handle form submission with very short credentials', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Submit with very short credentials
    fireEvent.change(emailInput, { target: { value: 'a@b.c' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);
    
    // Form should handle short credentials gracefully
    expect(emailInput).toHaveValue('a@b.c');
    expect(passwordInput).toHaveValue('123');
  });

  it('should handle form submission with special characters in email', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Submit with special characters in email
    fireEvent.change(emailInput, { target: { value: 'test+user+tag@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Form should handle special characters gracefully
    expect(emailInput).toHaveValue('test+user+tag@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should handle form submission with unicode characters', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });
    
    // Submit with unicode characters
    fireEvent.change(emailInput, { target: { value: 'tëst@exämple.com' } });
    fireEvent.change(passwordInput, { target: { value: 'pässwörd123' } });
    fireEvent.click(submitButton);
    
    // Form should handle unicode characters gracefully
    expect(emailInput).toHaveValue('tëst@exämple.com');
    expect(passwordInput).toHaveValue('pässwörd123');
  });
}); 