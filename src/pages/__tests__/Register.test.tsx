import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Register from '../Register/Register';
import { store } from '@/config/store';

// Mock useSignupMutation to avoid real API calls
vi.mock('@/features/authSlice', () => ({
  useSignupMutation: () => [vi.fn(), { isLoading: false, error: undefined }],
}));

// Mock setCredentials and selectIsAuthenticated to avoid Redux side effects
vi.mock('@/features/auth', () => ({
  __esModule: true,
  default: () => ({}), // mock reducer
  setCredentials: vi.fn(),
  selectIsAuthenticated: vi.fn(() => false), // Mock as not authenticated by default
}));

describe('Register', () => {
  it('renders register form fields and button', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign up with Email/i })).toBeInTheDocument();
    
    // Snapshot test
    expect(container).toMatchSnapshot();
  });

  it('shows validation error if fields are empty', async () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /Sign up with Email/i }));
    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
    
    // Snapshot test after validation errors
    expect(container).toMatchSnapshot();
  });

  it('matches register form snapshot', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </Provider>
    );
    expect(container).toMatchSnapshot();
  });
}); 