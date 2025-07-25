import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Dashboard from '../Dashboard';

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
}));

describe('Dashboard', () => {
  it('renders sidebar, chart, and logout button', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText(/Jobs CRM/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  it('navigates to /login on logout', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /Logout/i }));
    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });
}); 