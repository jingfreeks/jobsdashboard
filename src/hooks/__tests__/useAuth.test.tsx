import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/config/apiSplice';
import { authReducer } from '@/features/auth';
import { useAuth } from '../useAuth';

// Mock dependencies
vi.mock('@/hooks/useToast', () => ({
  useToast: vi.fn(() => ({
    showError: vi.fn(),
  })),
}));

const mockLogout = vi.fn();
vi.mock('@/features/loginApiSlice', () => ({
  useLogoutMutation: vi.fn(() => [mockLogout]),
}));

vi.mock('@/utils/persistUtils', () => ({
  purgePersistedState: vi.fn().mockResolvedValue(true),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createTestStore();
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return logout and forceLogout functions', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: TestWrapper,
    });

    expect(result.current.logout).toBeDefined();
    expect(result.current.forceLogout).toBeDefined();
  });

  it('should handle successful logout', async () => {
    mockLogout.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({ success: true }),
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: TestWrapper,
    });

    await result.current.logout();

    expect(mockLogout).toHaveBeenCalledWith({});
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
}); 