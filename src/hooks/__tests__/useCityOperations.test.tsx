import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/config/apiSplice';

// Mock console.error to avoid noise in tests
const mockConsoleError = vi.fn();

// Sample city data for testing
const mockCities = [
  { _id: '1', name: 'New York', stateId: 'state1' },
  { _id: '2', name: 'Los Angeles', stateId: 'state2' },
  { _id: '3', name: 'Chicago', stateId: 'state3' },
  { _id: '4', name: 'Houston', stateId: 'state4' },
  { _id: '5', name: 'Phoenix', stateId: 'state5' },
];

const mockStates = [
  { _id: 'state1', name: 'New York State' },
  { _id: 'state2', name: 'California' },
  { _id: 'state3', name: 'Illinois' },
  { _id: 'state4', name: 'Texas' },
  { _id: 'state5', name: 'Arizona' },
];

// Mock functions
const mockAddCity = vi.fn();
const mockUpdateCity = vi.fn();
const mockDeleteCity = vi.fn();
const mockRefetch = vi.fn();

// Mock the city API slice with comprehensive mocks
vi.mock('@/features/city', () => ({
  useGetCitiesQuery: vi.fn(() => ({
    data: mockCities,
    isLoading: false,
    error: null,
    refetch: mockRefetch,
  })),
  useAddCityMutation: vi.fn(() => [
    mockAddCity,
    { isLoading: false, reset: vi.fn() }
  ]),
  useUpdateCityMutation: vi.fn(() => [
    mockUpdateCity,
    { isLoading: false, reset: vi.fn() }
  ]),
  useDeleteCityMutation: vi.fn(() => [
    mockDeleteCity,
    { isLoading: false, reset: vi.fn() }
  ]),
}));

// Mock the state API slice
vi.mock('@/features/state', () => ({
  useGetStatesQuery: vi.fn(() => ({
    data: mockStates,
    isLoading: false,
    error: null,
  })),
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

describe('useCityOperations', () => {
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
      const { useCityOperations } = await import('../useCityOperations');
      
      const { result } = renderHook(() => useCityOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      // Data properties
      expect(result.current.cities).toBeDefined();
      expect(result.current.citiesWithStates).toBeDefined();
      expect(result.current.states).toBeDefined();
      expect(result.current.cityMap).toBeDefined();
      expect(result.current.stateMap).toBeDefined();
      
      // Loading states
      expect(result.current.isLoading).toBeDefined();
      expect(result.current.isAdding).toBeDefined();
      expect(result.current.isUpdating).toBeDefined();
      expect(result.current.isDeleting).toBeDefined();
      
      // Error state
      expect(result.current.error).toBeDefined();
      
      // Operations
      expect(result.current.createCity).toBeDefined();
      expect(result.current.updateCityById).toBeDefined();
      expect(result.current.deleteCityById).toBeDefined();
      expect(result.current.refetch).toBeDefined();
    });

    it('should return sorted cities alphabetically', async () => {
      const { useCityOperations } = await import('../useCityOperations');
      
      const { result } = renderHook(() => useCityOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const sortedCities = [...mockCities].sort((a, b) => a.name.localeCompare(b.name));
      expect(result.current.cities).toEqual(sortedCities);
    });

    it('should return cities with state names', async () => {
      const { useCityOperations } = await import('../useCityOperations');
      
      const { result } = renderHook(() => useCityOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      expect(result.current.citiesWithStates).toHaveLength(mockCities.length);
      expect(result.current.citiesWithStates[0]).toHaveProperty('statename');
      // Cities are sorted alphabetically, so Chicago (state3) comes first
      expect(result.current.citiesWithStates[0].statename).toBe('Illinois');
    });

    it('should return city and state maps for quick lookups', async () => {
      const { useCityOperations } = await import('../useCityOperations');
      
      const { result } = renderHook(() => useCityOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      expect(result.current.cityMap).toBeInstanceOf(Map);
      expect(result.current.stateMap).toBeInstanceOf(Map);
      expect(result.current.cityMap.get('1')).toEqual(mockCities[0]);
      expect(result.current.stateMap.get('state1')).toEqual(mockStates[0]);
    });
  });

  describe('Update Operations', () => {
    it('should successfully update a city', async () => {
      const { useCityOperations } = await import('../useCityOperations');
      
      const updatedCity = { _id: '1', name: 'New York Updated', stateId: 'state1' };
      mockUpdateCity.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue(updatedCity)
      });

      const { result } = renderHook(() => useCityOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const updateData = { _id: '1', name: 'New York Updated', stateId: 'state1' };
      const updatedResult = await result.current.updateCityById(updateData);

      expect(mockUpdateCity).toHaveBeenCalledWith(updateData);
      expect(updatedResult).toEqual(updatedCity);
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should handle update city error gracefully', async () => {
      const { useCityOperations } = await import('../useCityOperations');
      
      const updateError = new Error('Update failed');
      mockUpdateCity.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue(updateError)
      });

      const { result } = renderHook(() => useCityOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const updateData = { _id: '1', name: 'New York Updated', stateId: 'state1' };
      const updatedResult = await result.current.updateCityById(updateData);

      expect(mockUpdateCity).toHaveBeenCalledWith(updateData);
      expect(updatedResult).toBeNull();
      expect(mockConsoleError).toHaveBeenCalledWith('Failed to update city:', updateError);
    });

    it('should handle update with invalid city ID', async () => {
      const { useCityOperations } = await import('../useCityOperations');
      
      const updateError = new Error('City not found');
      mockUpdateCity.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue(updateError)
      });

      const { result } = renderHook(() => useCityOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const updateData = { _id: '999', name: 'Non-existent City', stateId: 'state1' };
      const updatedResult = await result.current.updateCityById(updateData);

      expect(mockUpdateCity).toHaveBeenCalledWith(updateData);
      expect(updatedResult).toBeNull();
      expect(mockConsoleError).toHaveBeenCalledWith('Failed to update city:', updateError);
    });

    it('should handle update with network error', async () => {
      const { useCityOperations } = await import('../useCityOperations');
      
      const networkError = new Error('Network error');
      mockUpdateCity.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue(networkError)
      });

      const { result } = renderHook(() => useCityOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const updateData = { _id: '1', name: 'New York Updated', stateId: 'state1' };
      const updatedResult = await result.current.updateCityById(updateData);

      expect(mockUpdateCity).toHaveBeenCalledWith(updateData);
      expect(updatedResult).toBeNull();
      expect(mockConsoleError).toHaveBeenCalledWith('Failed to update city:', networkError);
    });

    it('should handle update with partial data', async () => {
      const { useCityOperations } = await import('../useCityOperations');
      
      const updatedCity = { _id: '1', name: 'New York Updated', stateId: 'state1' };
      mockUpdateCity.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue(updatedCity)
      });

      const { result } = renderHook(() => useCityOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      // Test with partial update data (only name)
      const updateData = { _id: '1', name: 'New York Updated' };
      const updatedResult = await result.current.updateCityById(updateData);

      expect(mockUpdateCity).toHaveBeenCalledWith(updateData);
      expect(updatedResult).toEqual(updatedCity);
    });

    it('should handle update with empty name', async () => {
      const { useCityOperations } = await import('../useCityOperations');
      
      const updateError = new Error('Name cannot be empty');
      mockUpdateCity.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue(updateError)
      });

      const { result } = renderHook(() => useCityOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const updateData = { _id: '1', name: '', stateId: 'state1' };
      const updatedResult = await result.current.updateCityById(updateData);

      expect(mockUpdateCity).toHaveBeenCalledWith(updateData);
      expect(updatedResult).toBeNull();
      expect(mockConsoleError).toHaveBeenCalledWith('Failed to update city:', updateError);
    });
  });

  describe('Create Operations', () => {
    it('should successfully create a city', async () => {
      const { useCityOperations } = await import('../useCityOperations');
      
      const newCity = { _id: '6', name: 'Miami', stateId: 'state6' };
      mockAddCity.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue(newCity)
      });

      const { result } = renderHook(() => useCityOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const createData = { name: 'Miami', stateId: 'state6' };
      const createdResult = await result.current.createCity(createData);

      expect(mockAddCity).toHaveBeenCalledWith(createData);
      expect(createdResult).toEqual(newCity);
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should handle create city error gracefully', async () => {
      const { useCityOperations } = await import('../useCityOperations');
      
      const createError = new Error('Create failed');
      mockAddCity.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue(createError)
      });

      const { result } = renderHook(() => useCityOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const createData = { name: 'Miami', stateId: 'state6' };
      const createdResult = await result.current.createCity(createData);

      expect(mockAddCity).toHaveBeenCalledWith(createData);
      expect(createdResult).toBeNull();
      expect(mockConsoleError).toHaveBeenCalledWith('Failed to create city:', createError);
    });
  });

  describe('Delete Operations', () => {
    it('should successfully delete a city', async () => {
      const { useCityOperations } = await import('../useCityOperations');
      
      mockDeleteCity.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({ success: true })
      });

      const { result } = renderHook(() => useCityOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const deleteResult = await result.current.deleteCityById('1');

      expect(mockDeleteCity).toHaveBeenCalledWith({ _id: '1' });
      expect(deleteResult).toBe(true);
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should handle delete city error gracefully', async () => {
      const { useCityOperations } = await import('../useCityOperations');
      
      const deleteError = new Error('Delete failed');
      mockDeleteCity.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue(deleteError)
      });

      const { result } = renderHook(() => useCityOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const deleteResult = await result.current.deleteCityById('1');

      expect(mockDeleteCity).toHaveBeenCalledWith({ _id: '1' });
      expect(deleteResult).toBe(false);
      expect(mockConsoleError).toHaveBeenCalledWith('Failed to delete city:', deleteError);
    });
  });

  describe('Loading States', () => {
    it('should handle loading states correctly', async () => {
      const { useCityOperations } = await import('../useCityOperations');
      
      // Mock loading states
      const { useGetCitiesQuery, useAddCityMutation, useUpdateCityMutation, useDeleteCityMutation } = await import('@/features/city');
      
      vi.mocked(useGetCitiesQuery).mockReturnValue({
        data: mockCities,
        isLoading: true,
        error: null,
        refetch: mockRefetch,
      });

      vi.mocked(useAddCityMutation).mockReturnValue([
        mockAddCity,
        { isLoading: true, reset: vi.fn() }
      ]);

      vi.mocked(useUpdateCityMutation).mockReturnValue([
        mockUpdateCity,
        { isLoading: true, reset: vi.fn() }
      ]);

      vi.mocked(useDeleteCityMutation).mockReturnValue([
        mockDeleteCity,
        { isLoading: true, reset: vi.fn() }
      ]);

      const { result } = renderHook(() => useCityOperations(), {
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
      const { useCityOperations } = await import('../useCityOperations');
      
      const queryError = new Error('Query failed');
      const { useGetCitiesQuery } = await import('@/features/city');
      
      vi.mocked(useGetCitiesQuery).mockReturnValue({
        data: [],
        isLoading: false,
        error: queryError,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useCityOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      expect(result.current.error).toBe(queryError);
      expect(result.current.cities).toEqual([]);
    });
  });

  describe('Refetch Functionality', () => {
    it('should call refetch when requested', async () => {
      const { useCityOperations } = await import('../useCityOperations');
      
      const { result } = renderHook(() => useCityOperations(), {
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
}); 