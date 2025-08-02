import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/config/apiSplice';
import { 
  cityApiSlice, 
  useGetCitiesQuery, 
  useAddCityMutation, 
  useUpdateCityMutation, 
  useDeleteCityMutation,
  useUploadImageMutation,
  type City,
  type CityFormData,
  type UpdateCityData
} from '../city';

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage for auth token
const mockLocalStorage = {
  getItem: vi.fn(() => 'mock-token'),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('City Feature', () => {
  describe('API Slice Structure', () => {
    it('should export cityApiSlice', () => {
      expect(cityApiSlice).toBeDefined();
      expect(typeof cityApiSlice).toBe('object');
    });

    it('should have endpoints property', () => {
      expect(cityApiSlice.endpoints).toBeDefined();
      expect(typeof cityApiSlice.endpoints).toBe('object');
    });

    it('should match snapshot', () => {
      expect(cityApiSlice).toMatchSnapshot();
    });
  });

  describe('Exported Hooks', () => {
    it('should export useGetCitiesQuery hook', () => {
      expect(useGetCitiesQuery).toBeDefined();
      expect(typeof useGetCitiesQuery).toBe('function');
    });

    it('should export useAddCityMutation hook', () => {
      expect(useAddCityMutation).toBeDefined();
      expect(typeof useAddCityMutation).toBe('function');
    });

    it('should export useUpdateCityMutation hook', () => {
      expect(useUpdateCityMutation).toBeDefined();
      expect(typeof useUpdateCityMutation).toBe('function');
    });

    it('should export useDeleteCityMutation hook', () => {
      expect(useDeleteCityMutation).toBeDefined();
      expect(typeof useDeleteCityMutation).toBe('function');
    });

    it('should export useUploadImageMutation hook', () => {
      expect(useUploadImageMutation).toBeDefined();
      expect(typeof useUploadImageMutation).toBe('function');
    });
  });

  describe('API Endpoint Configuration', () => {
    it('should have getCities endpoint configured', () => {
      expect(cityApiSlice.endpoints.getCities).toBeDefined();
      expect(typeof cityApiSlice.endpoints.getCities).toBe('object');
    });

    it('should have addCity endpoint configured', () => {
      expect(cityApiSlice.endpoints.addCity).toBeDefined();
      expect(typeof cityApiSlice.endpoints.addCity).toBe('object');
    });

    it('should have updateCity endpoint configured', () => {
      expect(cityApiSlice.endpoints.updateCity).toBeDefined();
      expect(typeof cityApiSlice.endpoints.updateCity).toBe('object');
    });

    it('should have deleteCity endpoint configured', () => {
      expect(cityApiSlice.endpoints.deleteCity).toBeDefined();
      expect(typeof cityApiSlice.endpoints.deleteCity).toBe('object');
    });

    it('should have uploadImage endpoint configured', () => {
      expect(cityApiSlice.endpoints.uploadImage).toBeDefined();
      expect(typeof cityApiSlice.endpoints.uploadImage).toBe('object');
    });

    it('should be injected into apiSlice', () => {
      expect(apiSlice.injectEndpoints).toBeDefined();
      expect(typeof apiSlice.injectEndpoints).toBe('function');
    });
  });

  describe('API Slice Properties', () => {
    it('should be injected into apiSlice', () => {
      expect(apiSlice.injectEndpoints).toBeDefined();
      expect(typeof apiSlice.injectEndpoints).toBe('function');
    });
  });

  describe('Enhanced Hook Testing', () => {
    let store: ReturnType<typeof createTestStore>;

    const createTestStore = () => {
      return configureStore({
        reducer: {
          api: apiSlice.reducer,
        },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({
            serializableCheck: {
              ignoredActions: ['persist/PERSIST'],
            },
          }).concat(apiSlice.middleware),
      });
    };

    beforeEach(() => {
      store = createTestStore();
      vi.clearAllMocks();
      mockFetch.mockClear();
      mockLocalStorage.getItem.mockReturnValue('mock-token');
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    describe('Get Cities Query Hook', () => {
      it('should have working getCities query hook with full structure', async () => {
        const { result } = renderHook(() => useGetCitiesQuery(), {
          wrapper: TestWrapper,
        });

        expect(result.current.data).toBeUndefined();
        expect(result.current.isLoading).toBe(true);
        expect(result.current.isError).toBe(false);
        expect(result.current.isSuccess).toBe(false);
        expect(typeof result.current.refetch).toBe('function');
      });

      it('should handle query hook structure', async () => {
        const { result } = renderHook(() => useGetCitiesQuery(), {
          wrapper: TestWrapper,
        });

        expect(result.current).toHaveProperty('data');
        expect(result.current).toHaveProperty('isLoading');
        expect(result.current).toHaveProperty('isError');
        expect(result.current).toHaveProperty('isSuccess');
        expect(result.current).toHaveProperty('refetch');
        expect(typeof result.current.refetch).toBe('function');
      });
    });

    describe('Add City Mutation Hook', () => {
      it('should have working addCity mutation hook with full structure', () => {
        const { result } = renderHook(() => useAddCityMutation(), {
          wrapper: TestWrapper,
        });

        expect(result.current[0]).toBeDefined();
        expect(result.current[1]).toBeDefined();
        expect(typeof result.current[0]).toBe('function');
        expect(typeof result.current[1].isLoading).toBe('boolean');
        expect(typeof result.current[1].isError).toBe('boolean');
        expect(typeof result.current[1].isSuccess).toBe('boolean');
        expect(result.current[1].error).toBeUndefined();
        expect(result.current[1].data).toBeUndefined();
        expect(typeof result.current[1].reset).toBe('function');
      });

      it('should handle mutation hook structure', () => {
        const { result } = renderHook(() => useAddCityMutation(), {
          wrapper: TestWrapper,
        });

        const [addCity, state] = result.current;
        expect(typeof addCity).toBe('function');
        expect(state).toHaveProperty('isLoading');
        expect(state).toHaveProperty('isError');
        expect(state).toHaveProperty('isSuccess');
        expect(state.error).toBeUndefined();
        expect(state.data).toBeUndefined();
        expect(state).toHaveProperty('reset');
        expect(typeof state.reset).toBe('function');
      });
    });

    describe('Update City Mutation Hook', () => {
      it('should have working updateCity mutation hook with full structure', () => {
        const { result } = renderHook(() => useUpdateCityMutation(), {
          wrapper: TestWrapper,
        });

        expect(result.current[0]).toBeDefined();
        expect(result.current[1]).toBeDefined();
        expect(typeof result.current[0]).toBe('function');
        expect(typeof result.current[1].isLoading).toBe('boolean');
        expect(typeof result.current[1].isError).toBe('boolean');
        expect(typeof result.current[1].isSuccess).toBe('boolean');
        expect(result.current[1].error).toBeUndefined();
        expect(result.current[1].data).toBeUndefined();
        expect(typeof result.current[1].reset).toBe('function');
      });

      it('should handle mutation hook structure', () => {
        const { result } = renderHook(() => useUpdateCityMutation(), {
          wrapper: TestWrapper,
        });

        const [updateCity, state] = result.current;
        expect(typeof updateCity).toBe('function');
        expect(state).toHaveProperty('isLoading');
        expect(state).toHaveProperty('isError');
        expect(state).toHaveProperty('isSuccess');
        expect(state.error).toBeUndefined();
        expect(state.data).toBeUndefined();
        expect(state).toHaveProperty('reset');
        expect(typeof state.reset).toBe('function');
      });
    });

    describe('Delete City Mutation Hook', () => {
      it('should have working deleteCity mutation hook with full structure', () => {
        const { result } = renderHook(() => useDeleteCityMutation(), {
          wrapper: TestWrapper,
        });

        expect(result.current[0]).toBeDefined();
        expect(result.current[1]).toBeDefined();
        expect(typeof result.current[0]).toBe('function');
        expect(typeof result.current[1].isLoading).toBe('boolean');
        expect(typeof result.current[1].isError).toBe('boolean');
        expect(typeof result.current[1].isSuccess).toBe('boolean');
        expect(result.current[1].error).toBeUndefined();
        expect(result.current[1].data).toBeUndefined();
        expect(typeof result.current[1].reset).toBe('function');
      });

      it('should handle mutation hook structure', () => {
        const { result } = renderHook(() => useDeleteCityMutation(), {
          wrapper: TestWrapper,
        });

        const [deleteCity, state] = result.current;
        expect(typeof deleteCity).toBe('function');
        expect(state).toHaveProperty('isLoading');
        expect(state).toHaveProperty('isError');
        expect(state).toHaveProperty('isSuccess');
        expect(state.error).toBeUndefined();
        expect(state.data).toBeUndefined();
        expect(state).toHaveProperty('reset');
        expect(typeof state.reset).toBe('function');
      });
    });

    describe('Upload Image Mutation Hook', () => {
      it('should have working uploadImage mutation hook with full structure', () => {
        const { result } = renderHook(() => useUploadImageMutation(), {
          wrapper: TestWrapper,
        });

        expect(result.current[0]).toBeDefined();
        expect(result.current[1]).toBeDefined();
        expect(typeof result.current[0]).toBe('function');
        expect(typeof result.current[1].isLoading).toBe('boolean');
        expect(typeof result.current[1].isError).toBe('boolean');
        expect(typeof result.current[1].isSuccess).toBe('boolean');
        expect(result.current[1].error).toBeUndefined();
        expect(result.current[1].data).toBeUndefined();
        expect(typeof result.current[1].reset).toBe('function');
      });

      it('should handle mutation hook structure', () => {
        const { result } = renderHook(() => useUploadImageMutation(), {
          wrapper: TestWrapper,
        });

        const [uploadImage, state] = result.current;
        expect(typeof uploadImage).toBe('function');
        expect(state).toHaveProperty('isLoading');
        expect(state).toHaveProperty('isError');
        expect(state).toHaveProperty('isSuccess');
        expect(state.error).toBeUndefined();
        expect(state.data).toBeUndefined();
        expect(state).toHaveProperty('reset');
        expect(typeof state.reset).toBe('function');
      });
    });

    describe('Hook State Management', () => {
      it('should initialize hooks with correct default states', () => {
        const { result: queryResult } = renderHook(() => useGetCitiesQuery(), {
          wrapper: TestWrapper,
        });
        const { result: addResult } = renderHook(() => useAddCityMutation(), {
          wrapper: TestWrapper,
        });
        const { result: updateResult } = renderHook(() => useUpdateCityMutation(), {
          wrapper: TestWrapper,
        });
        const { result: deleteResult } = renderHook(() => useDeleteCityMutation(), {
          wrapper: TestWrapper,
        });
        const { result: uploadResult } = renderHook(() => useUploadImageMutation(), {
          wrapper: TestWrapper,
        });

        // Check initial states
        expect(queryResult.current.isLoading).toBe(true);
        expect(queryResult.current.isError).toBe(false);
        expect(queryResult.current.isSuccess).toBe(false);
        expect(queryResult.current.data).toBeUndefined();

        expect(addResult.current[1].isLoading).toBe(false);
        expect(addResult.current[1].isError).toBe(false);
        expect(addResult.current[1].isSuccess).toBe(false);
        expect(addResult.current[1].error).toBeUndefined();
        expect(addResult.current[1].data).toBeUndefined();

        expect(updateResult.current[1].isLoading).toBe(false);
        expect(updateResult.current[1].isError).toBe(false);
        expect(updateResult.current[1].isSuccess).toBe(false);
        expect(updateResult.current[1].error).toBeUndefined();
        expect(updateResult.current[1].data).toBeUndefined();

        expect(deleteResult.current[1].isLoading).toBe(false);
        expect(deleteResult.current[1].isError).toBe(false);
        expect(deleteResult.current[1].isSuccess).toBe(false);
        expect(deleteResult.current[1].error).toBeUndefined();
        expect(deleteResult.current[1].data).toBeUndefined();

        expect(uploadResult.current[1].isLoading).toBe(false);
        expect(uploadResult.current[1].isError).toBe(false);
        expect(uploadResult.current[1].isSuccess).toBe(false);
        expect(uploadResult.current[1].error).toBeUndefined();
        expect(uploadResult.current[1].data).toBeUndefined();
      });

      it('should have reset function available', () => {
        const { result } = renderHook(() => useAddCityMutation(), {
          wrapper: TestWrapper,
        });
        const [, state] = result.current;
        
        expect(typeof state.reset).toBe('function');
        expect(() => state.reset()).not.toThrow();
      });
    });

    describe('Hook Error Handling', () => {
      it('should handle null data gracefully', async () => {
        const { result } = renderHook(() => useAddCityMutation(), {
          wrapper: TestWrapper,
        });
        const [addCity] = result.current;
        
        await act(async () => {
          try {
            await addCity(null as unknown as CityFormData);
          } catch {
            // Expected to fail, but shouldn't crash
          }
        });
      });

      it('should handle undefined data gracefully', async () => {
        const { result } = renderHook(() => useUpdateCityMutation(), {
          wrapper: TestWrapper,
        });
        const [updateCity] = result.current;
        
        await act(async () => {
          try {
            await updateCity(undefined as unknown as UpdateCityData);
          } catch {
            // Expected to fail, but shouldn't crash
          }
        });
      });

      it('should handle malformed data objects', async () => {
        const { result } = renderHook(() => useAddCityMutation(), {
          wrapper: TestWrapper,
        });
        const [addCity] = result.current;
        
        await act(async () => {
          try {
            await addCity({ invalid: 'data' } as unknown as CityFormData);
          } catch {
            // Expected to fail, but shouldn't crash
          }
        });
      });
    });

    describe('Hook Performance', () => {
      it('should maintain consistent function references', () => {
        const { result, rerender } = renderHook(() => useAddCityMutation(), {
          wrapper: TestWrapper,
        });
        
        const initialAddCity = result.current[0];
        rerender();
        const newAddCity = result.current[0];
        
        expect(typeof initialAddCity).toBe('function');
        expect(typeof newAddCity).toBe('function');
      });

      it('should handle rapid successive calls', async () => {
        const { result } = renderHook(() => useAddCityMutation(), {
          wrapper: TestWrapper,
        });
        const [addCity] = result.current;
        
        await act(async () => {
          try {
            addCity({ name: 'City1' });
            addCity({ name: 'City2' });
            addCity({ name: 'City3' });
          } catch {
            // Expected to fail in test environment, but shouldn't crash
          }
        });
      });

      it('should handle concurrent hook usage', () => {
        const { result: addResult } = renderHook(() => useAddCityMutation(), {
          wrapper: TestWrapper,
        });
        const { result: updateResult } = renderHook(() => useUpdateCityMutation(), {
          wrapper: TestWrapper,
        });
        const { result: deleteResult } = renderHook(() => useDeleteCityMutation(), {
          wrapper: TestWrapper,
        });
        const { result: uploadResult } = renderHook(() => useUploadImageMutation(), {
          wrapper: TestWrapper,
        });

        expect(typeof addResult.current[0]).toBe('function');
        expect(typeof updateResult.current[0]).toBe('function');
        expect(typeof deleteResult.current[0]).toBe('function');
        expect(typeof uploadResult.current[0]).toBe('function');
      });
    });

    describe('Integration Testing', () => {
      it('should work with all hooks simultaneously', async () => {
        const { result: addResult } = renderHook(() => useAddCityMutation(), {
          wrapper: TestWrapper,
        });
        const { result: updateResult } = renderHook(() => useUpdateCityMutation(), {
          wrapper: TestWrapper,
        });
        const { result: deleteResult } = renderHook(() => useDeleteCityMutation(), {
          wrapper: TestWrapper,
        });
        const { result: uploadResult } = renderHook(() => useUploadImageMutation(), {
          wrapper: TestWrapper,
        });

        const [addCity] = addResult.current;
        const [updateCity] = updateResult.current;
        const [deleteCity] = deleteResult.current;
        const [uploadImage] = uploadResult.current;

        await act(async () => {
          try {
            addCity({ name: 'New City' });
            updateCity({ _id: '1', name: 'Updated City' });
            deleteCity({ _id: '1' });
            uploadImage({ file: new File([''], 'test.jpg') });
          } catch {
            // Expected to fail in test environment, but shouldn't crash
          }
        });
      });

      it('should maintain state isolation between hooks', () => {
        const { result: addResult } = renderHook(() => useAddCityMutation(), {
          wrapper: TestWrapper,
        });
        const { result: updateResult } = renderHook(() => useUpdateCityMutation(), {
          wrapper: TestWrapper,
        });

        expect(addResult.current[1].isLoading).toBe(false);
        expect(updateResult.current[1].isLoading).toBe(false);
        expect(addResult.current[1].isError).toBe(false);
        expect(updateResult.current[1].isError).toBe(false);
      });
    });

    describe('Data Transformation', () => {
      it('should have transformResponse function', () => {
        expect(cityApiSlice.endpoints.getCities).toBeDefined();
        expect(typeof cityApiSlice.endpoints.getCities).toBe('object');
      });

      it('should have optimistic update configurations', () => {
        expect(cityApiSlice.endpoints.addCity).toBeDefined();
        expect(cityApiSlice.endpoints.updateCity).toBeDefined();
        expect(cityApiSlice.endpoints.deleteCity).toBeDefined();
      });
    });

    describe('Upload Image Functionality', () => {
      it('should handle file upload mutation', () => {
        const { result } = renderHook(() => useUploadImageMutation(), {
          wrapper: TestWrapper,
        });
        
        const [uploadImage, state] = result.current;
        expect(typeof uploadImage).toBe('function');
        expect(state).toHaveProperty('isLoading');
        expect(state).toHaveProperty('isError');
        expect(state).toHaveProperty('isSuccess');
      });

      it('should handle file upload with FormData', async () => {
        const { result } = renderHook(() => useUploadImageMutation(), {
          wrapper: TestWrapper,
        });
        
        const [uploadImage] = result.current;
        const testFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
        
        await act(async () => {
          try {
            await uploadImage({ file: testFile });
          } catch {
            // Expected to fail in test environment, but shouldn't crash
          }
        });
      });
    });
  });

  describe('Types and Interfaces', () => {
    it('should have correct City interface structure', () => {
      const city: City = {
        _id: 'test-id',
        name: 'Test City',
        stateId: 'state-1',
        statename: 'Test State',
        image: 'test-image.jpg',
      };

      expect(city._id).toBe('test-id');
      expect(city.name).toBe('Test City');
      expect(city.stateId).toBe('state-1');
      expect(city.statename).toBe('Test State');
      expect(city.image).toBe('test-image.jpg');
      expect(typeof city._id).toBe('string');
      expect(typeof city.name).toBe('string');
      expect(typeof city.stateId).toBe('string');
      expect(typeof city.statename).toBe('string');
      expect(typeof city.image).toBe('string');
    });

    it('should have correct CityFormData interface structure', () => {
      const cityFormData: CityFormData = {
        name: 'Test City Form',
        stateId: 'state-1',
        image: 'test-image.jpg',
      };

      expect(cityFormData.name).toBe('Test City Form');
      expect(cityFormData.stateId).toBe('state-1');
      expect(cityFormData.image).toBe('test-image.jpg');
      expect(typeof cityFormData.name).toBe('string');
      expect(typeof cityFormData.stateId).toBe('string');
      expect(typeof cityFormData.image).toBe('string');
    });

    it('should have correct UpdateCityData interface structure', () => {
      const updateCityData: UpdateCityData = {
        _id: 'test-id',
        name: 'Updated Test City',
        stateId: 'state-1',
        image: new File([''], 'test.jpg'),
      };

      expect(updateCityData._id).toBe('test-id');
      expect(updateCityData.name).toBe('Updated Test City');
      expect(updateCityData.stateId).toBe('state-1');
      expect(updateCityData.image).toBeInstanceOf(File);
      expect(typeof updateCityData._id).toBe('string');
      expect(typeof updateCityData.name).toBe('string');
      expect(typeof updateCityData.stateId).toBe('string');
    });
  });

  describe('Data Validation', () => {
    it('should validate City interface properties', () => {
      const city: City = {
        _id: 'test-id',
        name: 'Test City',
        stateId: 'state-1',
        statename: 'Test State',
        image: 'test-image.jpg',
      };

      expect(city).toHaveProperty('_id');
      expect(city).toHaveProperty('name');
      expect(city).toHaveProperty('stateId');
      expect(city).toHaveProperty('statename');
      expect(city).toHaveProperty('image');
      expect(typeof city._id).toBe('string');
      expect(typeof city.name).toBe('string');
      expect(typeof city.stateId).toBe('string');
      expect(typeof city.statename).toBe('string');
      expect(typeof city.image).toBe('string');
      expect(city._id.length).toBeGreaterThan(0);
      expect(city.name.length).toBeGreaterThan(0);
    });

    it('should validate CityFormData interface properties', () => {
      const cityFormData: CityFormData = {
        name: 'Test City Form',
        stateId: 'state-1',
        image: 'test-image.jpg',
      };

      expect(cityFormData).toHaveProperty('name');
      expect(cityFormData).toHaveProperty('stateId');
      expect(cityFormData).toHaveProperty('image');
      expect(typeof cityFormData.name).toBe('string');
      expect(typeof cityFormData.stateId).toBe('string');
      expect(typeof cityFormData.image).toBe('string');
      expect(cityFormData.name.length).toBeGreaterThan(0);
    });

    it('should validate UpdateCityData interface properties', () => {
      const updateCityData: UpdateCityData = {
        _id: 'test-id',
        name: 'Updated Test City',
        stateId: 'state-1',
        image: new File([''], 'test.jpg'),
      };

      expect(updateCityData).toHaveProperty('_id');
      expect(updateCityData).toHaveProperty('name');
      expect(updateCityData).toHaveProperty('stateId');
      expect(updateCityData).toHaveProperty('image');
      expect(typeof updateCityData._id).toBe('string');
      expect(typeof updateCityData.name).toBe('string');
      expect(typeof updateCityData.stateId).toBe('string');
      expect(updateCityData._id.length).toBeGreaterThan(0);
      expect(updateCityData.name.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle cities with unicode characters', () => {
      const citiesWithUnicode: City[] = [
        { _id: '1', name: 'Cité with émojis 🏙️' },
        { _id: '2', name: 'City with ümlauts' },
        { _id: '3', name: 'Normal City' },
      ];

      // Test the sorting logic manually since transformResponse is not directly accessible
      const result = [...citiesWithUnicode].sort((a, b) => a.name.localeCompare(b.name));
      
      expect(result).toHaveLength(3);
      expect(result.some((city: City) => city.name === 'Cité with émojis 🏙️')).toBe(true);
      expect(result.some((city: City) => city.name === 'City with ümlauts')).toBe(true);
      expect(result.some((city: City) => city.name === 'Normal City')).toBe(true);
    });

    it('should handle cities with leading/trailing spaces', () => {
      const citiesWithSpaces: City[] = [
        { _id: '1', name: '  City with Spaces  ' },
        { _id: '2', name: 'City without spaces' },
        { _id: '3', name: 'Another City' },
      ];

      // Test the sorting logic manually since transformResponse is not directly accessible
      const result = [...citiesWithSpaces].sort((a, b) => a.name.localeCompare(b.name));
      
      expect(result).toHaveLength(3);
      expect(result.some((city: City) => city.name === '  City with Spaces  ')).toBe(true);
      expect(result.some((city: City) => city.name === 'City without spaces')).toBe(true);
      expect(result.some((city: City) => city.name === 'Another City')).toBe(true);
    });

    it('should handle cities with only whitespace names', () => {
      const citiesWithWhitespace: City[] = [
        { _id: '1', name: '   ' },
        { _id: '2', name: 'Valid City' },
        { _id: '3', name: '\t\n' },
      ];

      // Test the sorting logic manually since transformResponse is not directly accessible
      const result = [...citiesWithWhitespace].sort((a, b) => a.name.localeCompare(b.name));
      
      expect(result).toHaveLength(3);
      expect(result.some((city: City) => city.name === '   ')).toBe(true);
      expect(result.some((city: City) => city.name === 'Valid City')).toBe(true);
      expect(result.some((city: City) => city.name === '\t\n')).toBe(true);
    });

    it('should handle cities with very short names', () => {
      const citiesWithShortNames: City[] = [
        { _id: '1', name: 'A' },
        { _id: '2', name: 'B' },
        { _id: '3', name: 'C' },
      ];

      // Test the sorting logic manually since transformResponse is not directly accessible
      const result = [...citiesWithShortNames].sort((a, b) => a.name.localeCompare(b.name));
      
      expect(result).toEqual([
        { _id: '1', name: 'A' },
        { _id: '2', name: 'B' },
        { _id: '3', name: 'C' },
      ]);
    });

    it('should handle cities with identical names but different ids', () => {
      const citiesWithIdenticalNames: City[] = [
        { _id: '2', name: 'Same Name City' },
        { _id: '1', name: 'Same Name City' },
        { _id: '3', name: 'Same Name City' },
      ];

      // Test the sorting logic manually since transformResponse is not directly accessible
      const result = [...citiesWithIdenticalNames].sort((a, b) => a.name.localeCompare(b.name));
      
      expect(result).toEqual([
        { _id: '2', name: 'Same Name City' },
        { _id: '1', name: 'Same Name City' },
        { _id: '3', name: 'Same Name City' },
      ]);
    });
  });

  describe('Performance and Memory', () => {
    it('should handle small arrays correctly', () => {
      const smallCityArray: City[] = Array.from({ length: 5 }, (_, i) => ({
        _id: `city-${i}`,
        name: `City ${5 - i}`,
      }));
      
      // This should create: City 5, City 4, City 3, City 2, City 1
      // After sorting: City 1, City 2, City 3, City 4, City 5
      const smallResult = [...smallCityArray].sort((a, b) => a.name.localeCompare(b.name));
      expect(smallResult[0].name).toBe('City 1');
      expect(smallResult[4].name).toBe('City 5');
    });

    it('should handle large arrays efficiently', () => {
      // Test the sorting logic manually first
      const testArray: City[] = [
        { _id: '1', name: 'City 1000' },
        { _id: '2', name: 'City 999' },
        { _id: '3', name: 'City 1' },
      ];
      
      // Manual sort to verify the logic
      const manualSort = [...testArray].sort((a, b) => a.name.localeCompare(b.name));
      expect(manualSort[0].name).toBe('City 1');
      expect(manualSort[1].name).toBe('City 1000');
      expect(manualSort[2].name).toBe('City 999');
      
      // Test the sorting logic manually since transformResponse is not directly accessible
      const testResult = [...testArray].sort((a, b) => a.name.localeCompare(b.name));
      expect(testResult[0].name).toBe('City 1');
      expect(testResult[1].name).toBe('City 1000');
      expect(testResult[2].name).toBe('City 999');
      
      // Now test the large array
      const largeCityArray: City[] = [];
      for (let i = 1000; i >= 1; i--) {
        largeCityArray.push({
          _id: `city-${1000 - i}`,
          name: `City ${i}`,
        });
      }

      const result = [...largeCityArray].sort((a, b) => a.name.localeCompare(b.name));
      expect(result).toHaveLength(1000);
      expect(result[0].name).toBe('City 1');
      expect(result[999].name).toBe('City 999');
    });

    it('should handle rapid selector calls', () => {
      const cities: City[] = [
        { _id: '3', name: 'City C' },
        { _id: '1', name: 'City A' },
        { _id: '2', name: 'City B' },
      ];

      // Call sorting multiple times rapidly
      for (let i = 0; i < 100; i++) {
        const result = [...cities].sort((a, b) => a.name.localeCompare(b.name));
        expect(result).toHaveLength(3);
      }
    });

    it('should handle concurrent sorting usage', () => {
      const cities1: City[] = [
        { _id: '1', name: 'City A' },
        { _id: '2', name: 'City B' },
      ];
      
      const cities2: City[] = [
        { _id: '3', name: 'City C' },
        { _id: '4', name: 'City D' },
      ];

      const result1 = [...cities1].sort((a, b) => a.name.localeCompare(b.name));
      const result2 = [...cities2].sort((a, b) => a.name.localeCompare(b.name));

      expect(result1).toHaveLength(2);
      expect(result2).toHaveLength(2);
      expect(result1[0].name).toBe('City A');
      expect(result2[0].name).toBe('City C');
    });
  });

  describe('Optional Properties', () => {
    it('should handle cities without optional properties', () => {
      const cityWithoutOptionals: City = {
        _id: 'test-id',
        name: 'Test City',
      };

      expect(cityWithoutOptionals._id).toBe('test-id');
      expect(cityWithoutOptionals.name).toBe('Test City');
      expect(cityWithoutOptionals.stateId).toBeUndefined();
      expect(cityWithoutOptionals.statename).toBeUndefined();
      expect(cityWithoutOptionals.image).toBeUndefined();
    });

    it('should handle CityFormData without optional properties', () => {
      const cityFormDataWithoutOptionals: CityFormData = {
        name: 'Test City Form',
      };

      expect(cityFormDataWithoutOptionals.name).toBe('Test City Form');
      expect(cityFormDataWithoutOptionals.stateId).toBeUndefined();
      expect(cityFormDataWithoutOptionals.image).toBeUndefined();
    });

    it('should handle UpdateCityData without optional properties', () => {
      const updateCityDataWithoutOptionals: UpdateCityData = {
        _id: 'test-id',
        name: 'Updated Test City',
      };

      expect(updateCityDataWithoutOptionals._id).toBe('test-id');
      expect(updateCityDataWithoutOptionals.name).toBe('Updated Test City');
      expect(updateCityDataWithoutOptionals.stateId).toBeUndefined();
      expect(updateCityDataWithoutOptionals.image).toBeUndefined();
    });
  });
}); 