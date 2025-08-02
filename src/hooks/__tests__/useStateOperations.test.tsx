import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/config/apiSplice';

// Mock console.error to avoid noise in tests
const mockConsoleError = vi.fn();

// Sample state data for testing
const mockStates = [
  { _id: '1', name: 'California' },
  { _id: '2', name: 'Texas' },
  { _id: '3', name: 'Florida' },
  { _id: '4', name: 'New York' },
  { _id: '5', name: 'Arizona' },
];

// Mock functions
const mockAddState = vi.fn();
const mockUpdateState = vi.fn();
const mockDeleteState = vi.fn();
const mockRefetch = vi.fn();

// Mock the state API slice with comprehensive mocks
vi.mock('@/features/state', () => ({
  useGetStatesQuery: vi.fn(() => ({
    data: mockStates,
    isLoading: false,
    error: null,
    refetch: mockRefetch,
  })),
  useAddStateMutation: vi.fn(() => [
    mockAddState,
    { isLoading: false, reset: vi.fn() }
  ]),
  useUpdateStateMutation: vi.fn(() => [
    mockUpdateState,
    { isLoading: false, reset: vi.fn() }
  ]),
  useDeleteStateMutation: vi.fn(() => [
    mockDeleteState,
    { isLoading: false, reset: vi.fn() }
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

describe('useStateOperations', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(mockConsoleError);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Hook Structure', () => {
    it('should return all expected properties and functions', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      // Data properties
      expect(result.current.states).toBeDefined();
      expect(result.current.stateMap).toBeDefined();
      
      // Loading states
      expect(result.current.isLoading).toBeDefined();
      expect(result.current.isAdding).toBeDefined();
      expect(result.current.isUpdating).toBeDefined();
      expect(result.current.isDeleting).toBeDefined();
      
      // Error state
      expect(result.current.error).toBeDefined();
      
      // Operations
      expect(result.current.createState).toBeDefined();
      expect(result.current.updateStateById).toBeDefined();
      expect(result.current.deleteStateById).toBeDefined();
      expect(result.current.refetch).toBeDefined();
      expect(result.current.getStateById).toBeDefined();
      expect(result.current.searchStates).toBeDefined();
    });

    it('should return sorted states alphabetically', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const sortedStates = [...mockStates].sort((a, b) => a.name.localeCompare(b.name));
      expect(result.current.states).toEqual(sortedStates);
    });

    it('should return state map for quick lookups', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      expect(result.current.stateMap).toBeInstanceOf(Map);
      expect(result.current.stateMap.get('1')).toEqual(mockStates[0]);
      expect(result.current.stateMap.get('2')).toEqual(mockStates[1]);
    });
  });

  describe('Create Operations', () => {
    it('should successfully create a state', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const newState = { _id: '6', name: 'Michigan' };
      mockAddState.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue(newState)
      });

      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const createData = { name: 'Michigan' };
      const createdResult = await result.current.createState(createData);

      expect(mockAddState).toHaveBeenCalledWith(createData);
      expect(createdResult).toEqual(newState);
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should handle create state error gracefully', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const createError = new Error('Create failed');
      mockAddState.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue(createError)
      });

      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const createData = { name: 'Michigan' };
      const createdResult = await result.current.createState(createData);

      expect(mockAddState).toHaveBeenCalledWith(createData);
      expect(createdResult).toBeNull();
      expect(mockConsoleError).toHaveBeenCalledWith('Failed to create state:', createError);
    });

    it('should handle create with empty name', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const createError = new Error('Name cannot be empty');
      mockAddState.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue(createError)
      });

      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const createData = { name: '' };
      const createdResult = await result.current.createState(createData);

      expect(mockAddState).toHaveBeenCalledWith(createData);
      expect(createdResult).toBeNull();
      expect(mockConsoleError).toHaveBeenCalledWith('Failed to create state:', createError);
    });

    it('should handle create with special characters', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const newState = { _id: '6', name: 'New Mexico' };
      mockAddState.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue(newState)
      });

      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const createData = { name: 'New Mexico' };
      const createdResult = await result.current.createState(createData);

      expect(mockAddState).toHaveBeenCalledWith(createData);
      expect(createdResult).toEqual(newState);
    });
  });

  describe('Update Operations', () => {
    it('should successfully update a state', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const updatedState = { _id: '1', name: 'California Updated' };
      mockUpdateState.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue(updatedState)
      });

      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const updateData = { _id: '1', name: 'California Updated' };
      const updatedResult = await result.current.updateStateById(updateData);

      expect(mockUpdateState).toHaveBeenCalledWith(updateData);
      expect(updatedResult).toEqual(updatedState);
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should handle update state error gracefully', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const updateError = new Error('Update failed');
      mockUpdateState.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue(updateError)
      });

      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const updateData = { _id: '1', name: 'California Updated' };
      const updatedResult = await result.current.updateStateById(updateData);

      expect(mockUpdateState).toHaveBeenCalledWith(updateData);
      expect(updatedResult).toBeNull();
      expect(mockConsoleError).toHaveBeenCalledWith('Failed to update state:', updateError);
    });

    it('should handle update with invalid state ID', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const updateError = new Error('State not found');
      mockUpdateState.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue(updateError)
      });

      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const updateData = { _id: '999', name: 'Non-existent State' };
      const updatedResult = await result.current.updateStateById(updateData);

      expect(mockUpdateState).toHaveBeenCalledWith(updateData);
      expect(updatedResult).toBeNull();
      expect(mockConsoleError).toHaveBeenCalledWith('Failed to update state:', updateError);
    });

    it('should handle update with network error', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const networkError = new Error('Network error');
      mockUpdateState.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue(networkError)
      });

      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const updateData = { _id: '1', name: 'California Updated' };
      const updatedResult = await result.current.updateStateById(updateData);

      expect(mockUpdateState).toHaveBeenCalledWith(updateData);
      expect(updatedResult).toBeNull();
      expect(mockConsoleError).toHaveBeenCalledWith('Failed to update state:', networkError);
    });

    it('should handle update with partial data', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const updatedState = { _id: '1', name: 'California Updated' };
      mockUpdateState.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue(updatedState)
      });

      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      // Test with partial update data (only name)
      const updateData = { _id: '1', name: 'California Updated' };
      const updatedResult = await result.current.updateStateById(updateData);

      expect(mockUpdateState).toHaveBeenCalledWith(updateData);
      expect(updatedResult).toEqual(updatedState);
    });
  });

  describe('Delete Operations', () => {
    it('should successfully delete a state', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      mockDeleteState.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({ success: true })
      });

      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const deleteResult = await result.current.deleteStateById('1');

      expect(mockDeleteState).toHaveBeenCalledWith({ _id: '1' });
      expect(deleteResult).toBe(true);
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should handle delete state error gracefully', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const deleteError = new Error('Delete failed');
      mockDeleteState.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue(deleteError)
      });

      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const deleteResult = await result.current.deleteStateById('1');

      expect(mockDeleteState).toHaveBeenCalledWith({ _id: '1' });
      expect(deleteResult).toBe(false);
      expect(mockConsoleError).toHaveBeenCalledWith('Failed to delete state:', deleteError);
    });

    it('should handle delete with invalid state ID', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const deleteError = new Error('State not found');
      mockDeleteState.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue(deleteError)
      });

      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const deleteResult = await result.current.deleteStateById('999');

      expect(mockDeleteState).toHaveBeenCalledWith({ _id: '999' });
      expect(deleteResult).toBe(false);
      expect(mockConsoleError).toHaveBeenCalledWith('Failed to delete state:', deleteError);
    });
  });

  describe('Utility Functions', () => {
    it('should get state by ID correctly', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      expect(result.current.getStateById('1')).toEqual(mockStates[0]);
      expect(result.current.getStateById('2')).toEqual(mockStates[1]);
      expect(result.current.getStateById('999')).toBeUndefined();
    });

    it('should search states correctly', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      // Case-insensitive search
      expect(result.current.searchStates('cal')).toEqual([mockStates[0]]);
      expect(result.current.searchStates('CAL')).toEqual([mockStates[0]]);
      expect(result.current.searchStates('tex')).toEqual([mockStates[1]]);
      expect(result.current.searchStates('flor')).toEqual([mockStates[2]]);
      expect(result.current.searchStates('nonexistent')).toEqual([]);
      expect(result.current.searchStates('')).toEqual(result.current.states);
    });

    it('should search states with partial matches', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      expect(result.current.searchStates('a')).toContain(mockStates[0]); // California
      expect(result.current.searchStates('a')).toContain(mockStates[1]); // Texas
      expect(result.current.searchStates('a')).toContain(mockStates[4]); // Arizona
    });

    it('should handle search with special characters', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      expect(result.current.searchStates('!@#')).toEqual([]);
      expect(result.current.searchStates('123')).toEqual([]);
    });
  });

  describe('Loading States', () => {
    it('should handle loading states correctly', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      // Mock loading states
      const { useGetStatesQuery, useAddStateMutation, useUpdateStateMutation, useDeleteStateMutation } = await import('@/features/state');
      
      vi.mocked(useGetStatesQuery).mockReturnValue({
        data: mockStates,
        isLoading: true,
        error: null,
        refetch: mockRefetch,
      });

      vi.mocked(useAddStateMutation).mockReturnValue([
        mockAddState,
        { isLoading: true, reset: vi.fn() }
      ]);

      vi.mocked(useUpdateStateMutation).mockReturnValue([
        mockUpdateState,
        { isLoading: true, reset: vi.fn() }
      ]);

      vi.mocked(useDeleteStateMutation).mockReturnValue([
        mockDeleteState,
        { isLoading: true, reset: vi.fn() }
      ]);

      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isAdding).toBe(true);
      expect(result.current.isUpdating).toBe(true);
      expect(result.current.isDeleting).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle query errors correctly', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const queryError = new Error('Query failed');
      const { useGetStatesQuery } = await import('@/features/state');
      
      vi.mocked(useGetStatesQuery).mockReturnValue({
        data: [],
        isLoading: false,
        error: queryError,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      expect(result.current.error).toBe(queryError);
      expect(result.current.states).toEqual([]);
    });
  });

  describe('Refetch Functionality', () => {
    it('should call refetch when requested', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      result.current.refetch();

      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty states array', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const { useGetStatesQuery } = await import('@/features/state');
      
      vi.mocked(useGetStatesQuery).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      expect(result.current.states).toEqual([]);
      expect(result.current.stateMap.size).toBe(0);
      expect(result.current.searchStates('any')).toEqual([]);
    });

    it('should handle states with duplicate names', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const duplicateStates = [
        { _id: '1', name: 'California' },
        { _id: '2', name: 'California' },
        { _id: '3', name: 'Texas' },
      ];

      const { useGetStatesQuery } = await import('@/features/state');
      
      vi.mocked(useGetStatesQuery).mockReturnValue({
        data: duplicateStates,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      expect(result.current.states).toHaveLength(3);
      expect(result.current.searchStates('California')).toHaveLength(2);
    });

    it('should handle states with very long names', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const longNameState = { _id: '1', name: 'A'.repeat(1000) };
      
      const { useGetStatesQuery } = await import('@/features/state');
      
      vi.mocked(useGetStatesQuery).mockReturnValue({
        data: [longNameState],
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      expect(result.current.states[0].name).toBe('A'.repeat(1000));
      expect(result.current.searchStates('A')).toHaveLength(1);
    });
  });

  describe('Performance and Memory', () => {
    it('should handle large number of states', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const largeStatesArray = Array.from({ length: 100 }, (_, i) => ({
        _id: i.toString(),
        name: `State ${i}`
      }));

      const { useGetStatesQuery } = await import('@/features/state');
      
      vi.mocked(useGetStatesQuery).mockReturnValue({
        data: largeStatesArray,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      expect(result.current.states).toHaveLength(100);
      expect(result.current.stateMap.size).toBe(100);
      expect(result.current.getStateById('50')).toEqual(largeStatesArray[50]);
    });

    it('should handle rapid search operations', async () => {
      const { useStateOperations } = await import('../useStateOperations');
      
      const { result } = renderHook(() => useStateOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      // Perform multiple searches rapidly
      for (let i = 0; i < 100; i++) {
        result.current.searchStates('a');
        result.current.getStateById('1');
      }

      // Should still work correctly
      expect(result.current.searchStates('cal')).toEqual([mockStates[0]]);
      expect(result.current.getStateById('1')).toEqual(mockStates[0]);
    });
  });
}); 