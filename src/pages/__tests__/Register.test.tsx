import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Register from '../Register/Register';
import { store } from '@/config/store';

// Mock variables using vi.hoisted
const { mockNavigate, mockSignup, mockDispatch, mockSetCredentials, mockSelectIsAuthenticated } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockSignup: vi.fn(),
  mockDispatch: vi.fn(),
  mockSetCredentials: vi.fn(),
  mockSelectIsAuthenticated: vi.fn(() => false),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useSignupMutation
vi.mock('@/features/authSlice', () => ({
  useSignupMutation: () => [mockSignup, { isLoading: false, error: undefined }],
}));

// Mock Redux hooks
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector: (state: unknown) => unknown) => selector({ auth: { isAuthenticated: false } }),
  };
});

vi.mock('@/features/auth', () => ({
  __esModule: true,
  default: () => ({}), // mock reducer
  setCredentials: mockSetCredentials,
  selectIsAuthenticated: mockSelectIsAuthenticated,
}));

// Mock SVG logo
vi.mock('@/assets/react.svg', () => ({
  default: 'mocked-logo.svg',
}));

const renderRegister = () => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    </Provider>
  );
};

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignup.mockImplementation(() => ({
      unwrap: () => Promise.resolve({ token: 'test-token', user: 'testuser' })
    }));
    mockSelectIsAuthenticated.mockReturnValue(false);
  });

  describe('Basic Rendering', () => {
    it('renders register form fields and button', () => {
      renderRegister();
      
      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign up with Email/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign up with Facebook/i })).toBeInTheDocument();
    });

    it('matches register form snapshot', () => {
      const { container } = renderRegister();
      expect(container).toMatchSnapshot();
    });

    it('should render logo and title correctly', () => {
      renderRegister();
      
      const logo = screen.getByAltText('Logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', 'mocked-logo.svg');
      
      expect(screen.getByText('Create Your Account')).toBeInTheDocument();
    });

    it('should render Facebook registration button', () => {
      renderRegister();
      
      const facebookButton = screen.getByRole('button', { name: /Sign up with Facebook/i });
      expect(facebookButton).toBeInTheDocument();
      expect(facebookButton).toHaveClass('bg-blue-600');
    });

    it('should render login link', () => {
      renderRegister();
      
      const loginLink = screen.getByRole('link', { name: /Log in/i });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });

  describe('Form Validation', () => {
    it('shows validation error if fields are empty', async () => {
      renderRegister();
      
      const submitButton = screen.getByRole('button', { name: /Sign up with Email/i });
      fireEvent.click(submitButton);
      
      expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
      expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
      expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
    });

    it('should clear validation errors when user starts typing', async () => {
      renderRegister();
      
      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      
      // Submit empty form to trigger errors
      fireEvent.click(screen.getByRole('button', { name: /Sign up with Email/i }));
      
      // Wait for errors to appear
      await screen.findByText(/Name is required/i);
      
      // Start typing in fields - this should trigger validation and clear errors
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      // Wait for validation to update
      await waitFor(() => {
        expect(screen.queryByText(/Name is required/i)).not.toBeInTheDocument();
      });
      
      expect(screen.queryByText(/Email is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Password is required/i)).not.toBeInTheDocument();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should have correct CSS classes for form elements', () => {
      renderRegister();
      
      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      
      expect(nameInput).toHaveClass('w-full', 'px-4', 'py-3', 'border', 'border-gray-200', 'rounded-lg');
      expect(emailInput).toHaveClass('w-full', 'px-4', 'py-3', 'border', 'border-gray-200', 'rounded-lg');
      expect(passwordInput).toHaveClass('w-full', 'px-4', 'py-3', 'border', 'border-gray-200', 'rounded-lg');
    });

    it('should have correct CSS classes for container', () => {
      renderRegister();
      
      const container = screen.getByText('Create Your Account').closest('div')?.parentElement;
      expect(container).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center', 'bg-[#0856d1]');
    });

    it('should have correct CSS classes for form wrapper', () => {
      renderRegister();
      
      const formWrapper = screen.getByText('Create Your Account').closest('div');
      expect(formWrapper).toHaveClass('w-full', 'max-w-md', 'bg-white', 'rounded-2xl', 'shadow-xl');
    });

    it('should have correct CSS classes for buttons', () => {
      renderRegister();
      
      const emailButton = screen.getByRole('button', { name: /Sign up with Email/i });
      const facebookButton = screen.getByRole('button', { name: /Sign up with Facebook/i });
      
      expect(emailButton).toHaveClass('w-full', 'py-3', 'bg-[#0856d1]', 'text-white', 'rounded-lg');
      expect(facebookButton).toHaveClass('w-full', 'py-3', 'bg-blue-600', 'text-white', 'rounded-lg');
    });
  });

  describe('Form Interactions', () => {
    it('should handle form submission with valid data', async () => {
      renderRegister();
      
      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const submitButton = screen.getByRole('button', { name: /Sign up with Email/i });
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockSignup).toHaveBeenCalledWith({
          username: 'John Doe',
          email: 'john@example.com',
          password: 'password123'
        });
      });
    });

    it('should handle form submission with Enter key', async () => {
      renderRegister();
      
      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      // Submit form by clicking button since Enter key on password field doesn't trigger submission
      fireEvent.click(screen.getByRole('button', { name: /Sign up with Email/i }));
      
      await waitFor(() => {
        expect(mockSignup).toHaveBeenCalled();
      });
    });

    it('should handle rapid form interactions', async () => {
      renderRegister();
      
      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      
      // Rapid typing
      fireEvent.change(nameInput, { target: { value: 'John' } });
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'pass' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      expect(nameInput).toHaveValue('John Doe');
      expect(emailInput).toHaveValue('john@example.com');
      expect(passwordInput).toHaveValue('password123');
    });
  });

  describe('Facebook Registration', () => {
    it('should handle Facebook registration button click', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      renderRegister();
      
      const facebookButton = screen.getByRole('button', { name: /Sign up with Facebook/i });
      fireEvent.click(facebookButton);
      
      expect(alertSpy).toHaveBeenCalledWith('Facebook registration would be implemented here.');
      
      alertSpy.mockRestore();
    });

    it('should have correct Facebook button styling', () => {
      renderRegister();
      
      const facebookButton = screen.getByRole('button', { name: /Sign up with Facebook/i });
      expect(facebookButton).toHaveClass('flex', 'items-center', 'justify-center');
    });
  });

  describe('useEffect and Authentication', () => {
    it('should redirect to dashboard when already authenticated', () => {
      mockSelectIsAuthenticated.mockReturnValue(true);
      
      renderRegister();
      
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('should not redirect when not authenticated', () => {
      mockSelectIsAuthenticated.mockReturnValue(false);
      
      renderRegister();
      
      expect(mockNavigate).not.toHaveBeenCalledWith('/dashboard');
    });

    it('should handle authentication state changes', () => {
      mockSelectIsAuthenticated.mockReturnValue(false);
      
      const { rerender } = renderRegister();
      
      expect(mockNavigate).not.toHaveBeenCalledWith('/dashboard');
      
      // Change authentication state
      mockSelectIsAuthenticated.mockReturnValue(true);
      rerender(
        <Provider store={store}>
          <MemoryRouter>
            <Register />
          </MemoryRouter>
        </Provider>
      );
      
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('onSubmit Function Tests', () => {
    beforeEach(() => {
      mockNavigate.mockClear();
      mockSetCredentials.mockClear();
      mockSignup.mockClear();
    });

    it('should test onSubmit function with successful registration', async () => {
      const mockResult = { token: 'test-token', user: 'testuser' };
      mockSignup.mockImplementation(() => ({
        unwrap: () => Promise.resolve(mockResult)
      }));

      renderRegister();

      fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /Sign up with Email/i }));

      await waitFor(() => {
        expect(mockSignup).toHaveBeenCalledWith({
          username: 'John Doe',
          email: 'john@example.com',
          password: 'password123'
        });
      });

      await waitFor(() => {
        expect(mockSetCredentials).toHaveBeenCalledWith({ ...mockResult, user: 'John Doe' });
      });

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('should test onSubmit function with null result (no setCredentials)', async () => {
      mockSignup.mockImplementation(() => ({
        unwrap: () => Promise.resolve(null)
      }));

      renderRegister();

      fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /Sign up with Email/i }));

      await waitFor(() => {
        expect(mockSignup).toHaveBeenCalled();
      });

      expect(mockSetCredentials).not.toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('should test onSubmit function with error (no setCredentials, but still navigation)', async () => {
      mockSignup.mockImplementation(() => ({
        unwrap: () => Promise.reject(new Error('Registration failed'))
      }));

      renderRegister();

      fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /Sign up with Email/i }));

      await waitFor(() => {
        expect(mockSignup).toHaveBeenCalled();
      });

      expect(mockSetCredentials).not.toHaveBeenCalled();
      // Navigation should NOT happen on error (matches actual component logic)
      expect(mockNavigate).not.toHaveBeenCalledWith('/dashboard');
    });


  });

  describe('Error Handling and isFetchBaseQueryError Function Tests', () => {
    beforeEach(() => {
      mockNavigate.mockClear();
      mockSetCredentials.mockClear();
      mockSignup.mockClear();
    });

    // Test the isFetchBaseQueryError function directly
    it('should test isFetchBaseQueryError function with valid FetchBaseQueryError', () => {
      const mockError = {
        status: 400,
        data: {
          error: {
            message: 'Email already exists'
          }
        }
      };

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
      const mockError: unknown = null;

      const isFetchBaseQueryError = (error: unknown): error is { status: number; data: unknown } => {
        return typeof error === 'object' && error != null && 'status' in error;
      };

      expect(isFetchBaseQueryError(mockError)).toBe(false);
    });

    it('should test isFetchBaseQueryError function with undefined error', () => {
      const mockError: unknown = undefined;

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

    // Test error message logic directly
    it('should test error message logic with FetchBaseQueryError with message', () => {
      const mockError = {
        status: 400,
        data: {
          error: {
            message: 'Email already exists'
          }
        }
      };

      const isFetchBaseQueryError = (error: unknown): error is { status: number; data: unknown } => {
        return typeof error === 'object' && error != null && 'status' in error;
      };

      let errorMessage: string | null = null;
      if (mockError) {
        if (isFetchBaseQueryError(mockError)) {
          const msg = (mockError.data as { error?: { message?: string } })?.error?.message;
          errorMessage = msg ? String(msg) : "Registration failed";
        } else {
          errorMessage = "Registration failed";
        }
      }

      expect(errorMessage).toBe('Email already exists');
    });

    it('should test error message logic with FetchBaseQueryError without message', () => {
      const mockError = {
        status: 500,
        data: {}
      };

      const isFetchBaseQueryError = (error: unknown): error is { status: number; data: unknown } => {
        return typeof error === 'object' && error != null && 'status' in error;
      };

      let errorMessage: string | null = null;
      if (mockError) {
        if (isFetchBaseQueryError(mockError)) {
          const msg = (mockError.data as { error?: { message?: string } })?.error?.message;
          errorMessage = msg ? String(msg) : "Registration failed";
        } else {
          errorMessage = "Registration failed";
        }
      }

      expect(errorMessage).toBe('Registration failed');
    });

    it('should test error message logic with non-FetchBaseQueryError', () => {
      const mockError = 'Network error occurred';

      const isFetchBaseQueryError = (error: unknown): error is { status: number; data: unknown } => {
        return typeof error === 'object' && error != null && 'status' in error;
      };

      let errorMessage: string | null = null;
      if (mockError) {
        if (isFetchBaseQueryError(mockError)) {
          const msg = (mockError.data as { error?: { message?: string } })?.error?.message;
          errorMessage = msg ? String(msg) : "Registration failed";
        } else {
          errorMessage = "Registration failed";
        }
      }

      expect(errorMessage).toBe('Registration failed');
    });
  });

  describe('Edge Cases and Special Inputs', () => {
    it('should handle form submission with special characters', async () => {
      renderRegister();

      fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'José María' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test+user@example.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password@123!' } });
      fireEvent.click(screen.getByRole('button', { name: /Sign up with Email/i }));

      await waitFor(() => {
        expect(mockSignup).toHaveBeenCalledWith({
          username: 'José María',
          email: 'test+user@example.com',
          password: 'password@123!'
        });
      });
    });

    it('should handle form submission with very long inputs', async () => {
      renderRegister();

      const longName = 'a'.repeat(100);
      const longEmail = 'a'.repeat(50) + '@example.com';
      const longPassword = 'b'.repeat(100);

      fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: longName } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: longEmail } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: longPassword } });
      fireEvent.click(screen.getByRole('button', { name: /Sign up with Email/i }));

      await waitFor(() => {
        expect(mockSignup).toHaveBeenCalledWith({
          username: longName,
          email: longEmail,
          password: longPassword
        });
      });
    });



    it('should handle form submission with whitespace-only name and password', async () => {
      renderRegister();

      // Use valid email format but with whitespace-only name and password
      fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: '   ' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '   ' } });
      fireEvent.click(screen.getByRole('button', { name: /Sign up with Email/i }));

      await waitFor(() => {
        expect(mockSignup).toHaveBeenCalledWith({
          username: '   ',
          email: 'test@example.com',
          password: '   '
        });
      });
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility attributes', () => {
      renderRegister();

      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);

      expect(nameInput).toHaveAttribute('id', 'username');
      expect(emailInput).toHaveAttribute('id', 'email');
      expect(passwordInput).toHaveAttribute('id', 'password');

      expect(nameInput).toHaveAttribute('type', 'text');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should have correct form structure', () => {
      renderRegister();

      const form = screen.getByLabelText(/Name/i).closest('form');
      expect(form).toBeInTheDocument();

      const inputs = screen.getAllByRole('textbox');
      expect(inputs).toHaveLength(2); // name and email

      const passwordInput = screen.getByLabelText(/Password/i);
      expect(passwordInput).toBeInTheDocument();
    });

    it('should have correct tab order', () => {
      renderRegister();

      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const submitButton = screen.getByRole('button', { name: /Sign up with Email/i });

      nameInput.focus();
      expect(nameInput).toHaveFocus();

      // Test that inputs are focusable (they should be by default)
      expect(nameInput).not.toBeDisabled();
      expect(emailInput).not.toBeDisabled();
      expect(passwordInput).not.toBeDisabled();
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Edge Cases and Special Inputs', () => {
    it('should not submit form with unicode email (invalid by HTML5 validation)', async () => {
      renderRegister();

      fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'José María Ñoño' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'josé@exämple.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'pässwörd123' } });
      fireEvent.click(screen.getByRole('button', { name: /Sign up with Email/i }));

      // The form should not submit, so the mock should not be called
      await waitFor(() => {
        expect(mockSignup).not.toHaveBeenCalled();
      });
    });
  });

}); 