import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Login from '../Login';
import { store } from '@/config/store';

// Mock useLoginMutation to avoid real API calls
vi.mock('@/features/loginApiSlice', () => ({
  useLoginMutation: () => [vi.fn(), { isLoading: false, error: undefined }],
}));

// Mock setCredentials to avoid Redux side effects
vi.mock('@/features/auth', () => ({
  __esModule: true,
  default: () => ({}), // mock reducer
  setCredentials: vi.fn(),
}));

describe('Login', () => {
  it('renders login form fields and button', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
  });

  it('shows validation error if fields are empty', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /Log in/i }));
    expect(await screen.findByText(/Username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
  });
}); 