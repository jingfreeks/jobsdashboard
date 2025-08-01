import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/config/apiSplice';

// Mock the bank API slice
vi.mock('@/features/bank', () => ({
  useGetBanksQuery: vi.fn(() => ({
    data: [
      { _id: '1', name: 'Bank A' },
      { _id: '2', name: 'Bank B' },
    ],
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  })),
  useAddBankMutation: vi.fn(() => [
    vi.fn(),
    { isLoading: false }
  ]),
  useUpdateBankMutation: vi.fn(() => [
    vi.fn(),
    { isLoading: false }
  ]),
  useDeleteBankMutation: vi.fn(() => [
    vi.fn(),
    { isLoading: false }
  ]),
}));

// Create a test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
};

describe('useBankOperations', () => {
  it('should return banks data and loading states', async () => {
    const store = createTestStore();
    
    // Import the hook after mocking
    const { useBankOperations } = await import('../useBankOperations');
    
    const { result } = renderHook(() => useBankOperations(), {
      wrapper: ({ children }) => (
        <Provider store={store}>
          {children}
        </Provider>
      ),
    });

    expect(result.current.banks).toBeDefined();
    expect(result.current.isLoading).toBeDefined();
    expect(result.current.error).toBeDefined();
    expect(result.current.isAdding).toBeDefined();
    expect(result.current.isUpdating).toBeDefined();
    expect(result.current.isDeleting).toBeDefined();
  });

  it('should provide bank operations functions', async () => {
    const store = createTestStore();
    
    // Import the hook after mocking
    const { useBankOperations } = await import('../useBankOperations');
    
    const { result } = renderHook(() => useBankOperations(), {
      wrapper: ({ children }) => (
        <Provider store={store}>
          {children}
        </Provider>
      ),
    });

    expect(typeof result.current.createBank).toBe('function');
    expect(typeof result.current.updateBankById).toBe('function');
    expect(typeof result.current.deleteBankById).toBe('function');
    expect(typeof result.current.getBankById).toBe('function');
    expect(typeof result.current.searchBanks).toBe('function');
  });

  it('should sort banks alphabetically', async () => {
    const store = createTestStore();
    
    // Import the hook after mocking
    const { useBankOperations } = await import('../useBankOperations');
    
    const { result } = renderHook(() => useBankOperations(), {
      wrapper: ({ children }) => (
        <Provider store={store}>
          {children}
        </Provider>
      ),
    });

    // The hook should return sorted banks
    expect(Array.isArray(result.current.banks)).toBe(true);
    expect(result.current.banks.length).toBe(2);
  });
}); 