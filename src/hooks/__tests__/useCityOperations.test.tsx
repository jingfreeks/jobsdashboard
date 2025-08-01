import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/config/store';
import { useCityOperations } from '../useCityOperations';

// Mock the city API slice
vi.mock('@/features/city', () => ({
  useGetCitiesQuery: vi.fn(),
  useAddCityMutation: vi.fn(),
  useUpdateCityMutation: vi.fn(),
  useDeleteCityMutation: vi.fn(),
}));

// Mock the state API slice since useCityOperations also uses it
vi.mock('@/features/state', () => ({
  useGetStatesQuery: vi.fn(),
}));

describe('useCityOperations', () => {
  const mockCities = [
    { _id: '1', name: 'New York', stateId: 'state1' },
    { _id: '2', name: 'Los Angeles', stateId: 'state2' },
    { _id: '3', name: 'Chicago', stateId: 'state3' },
  ];

  const mockStates = [
    { _id: 'state1', name: 'New York State' },
    { _id: 'state2', name: 'California' },
    { _id: 'state3', name: 'Illinois' },
  ];

  const mockUseGetCitiesQuery = vi.fn();
  const mockUseGetStatesQuery = vi.fn();
  const mockUseAddCityMutation = vi.fn();
  const mockUseUpdateCityMutation = vi.fn();
  const mockUseDeleteCityMutation = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Setup default mocks
    mockUseGetCitiesQuery.mockReturnValue({
      data: mockCities,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseGetStatesQuery.mockReturnValue({
      data: mockStates,
      isLoading: false,
      error: null,
    });

    mockUseAddCityMutation.mockReturnValue([
      vi.fn().mockResolvedValue({ data: { _id: '4', name: 'Houston', stateId: 'state4' } }),
      { isLoading: false },
    ]);

    mockUseUpdateCityMutation.mockReturnValue([
      vi.fn().mockResolvedValue({ data: { _id: '1', name: 'New York Updated', stateId: 'state1' } }),
      { isLoading: false },
    ]);

    mockUseDeleteCityMutation.mockReturnValue([
      vi.fn().mockResolvedValue({ data: { success: true } }),
      { isLoading: false },
    ]);

    // Import and setup mocks
    const { useGetCitiesQuery, useAddCityMutation, useUpdateCityMutation, useDeleteCityMutation } = await import('@/features/city');
    const { useGetStatesQuery } = await import('@/features/state');
    
    vi.mocked(useGetCitiesQuery).mockImplementation(mockUseGetCitiesQuery);
    vi.mocked(useGetStatesQuery).mockImplementation(mockUseGetStatesQuery);
    vi.mocked(useAddCityMutation).mockImplementation(mockUseAddCityMutation);
    vi.mocked(useUpdateCityMutation).mockImplementation(mockUseUpdateCityMutation);
    vi.mocked(useDeleteCityMutation).mockImplementation(mockUseDeleteCityMutation);
  });

  // Helper function to render hook with Redux Provider
  const renderHookWithProvider = () => {
    return renderHook(() => useCityOperations(), {
      wrapper: ({ children }) => (
        <Provider store={store}>
          {children}
        </Provider>
      ),
    });
  };

  it('should return cities data and loading states', () => {
    const { result } = renderHookWithProvider();

    // The hook sorts cities alphabetically, so we need to check the sorted order
    const sortedMockCities = [...mockCities].sort((a, b) => a.name.localeCompare(b.name));
    expect(result.current.cities).toEqual(sortedMockCities);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAdding).toBe(false);
    expect(result.current.isUpdating).toBe(false);
    expect(result.current.isDeleting).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should return operation functions', () => {
    const { result } = renderHookWithProvider();

    expect(typeof result.current.createCity).toBe('function');
    expect(typeof result.current.updateCityById).toBe('function');
    expect(typeof result.current.deleteCityById).toBe('function');
    expect(typeof result.current.refetch).toBe('function');
  });

  it('should return city map for quick lookups', () => {
    const { result } = renderHookWithProvider();

    expect(result.current.cityMap).toBeInstanceOf(Map);
    expect(result.current.cityMap.get('1')).toEqual({ _id: '1', name: 'New York', stateId: 'state1' });
    expect(result.current.cityMap.get('2')).toEqual({ _id: '2', name: 'Los Angeles', stateId: 'state2' });
  });
}); 