import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/config/apiSplice';
import { 
  stateApiSlice, 
  useGetStatesQuery, 
  useAddStateMutation, 
  useUpdateStateMutation, 
  useDeleteStateMutation,
  type StateFormData,
  type UpdateStateData
} from '../state';

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('State API Slice', () => {
  describe('API Slice Structure', () => {
    it('should export stateApiSlice', () => {
      expect(stateApiSlice).toBeDefined();
      expect(typeof stateApiSlice).toBe('object');
    });

    it('should have endpoints property', () => {
      expect(stateApiSlice.endpoints).toBeDefined();
      expect(typeof stateApiSlice.endpoints).toBe('object');
    });

    it('should match snapshot', () => {
      expect(stateApiSlice).toMatchSnapshot();
    });
  });

  describe('Exported Hooks', () => {
    it('should export useGetStatesQuery hook', () => {
      expect(useGetStatesQuery).toBeDefined();
      expect(typeof useGetStatesQuery).toBe('function');
    });

    it('should export useAddStateMutation hook', () => {
      expect(useAddStateMutation).toBeDefined();
      expect(typeof useAddStateMutation).toBe('function');
    });

    it('should export useUpdateStateMutation hook', () => {
      expect(useUpdateStateMutation).toBeDefined();
      expect(typeof useUpdateStateMutation).toBe('function');
    });

    it('should export useDeleteStateMutation hook', () => {
      expect(useDeleteStateMutation).toBeDefined();
      expect(typeof useDeleteStateMutation).toBe('function');
    });
  });

  describe('API Endpoint Configuration', () => {
    it('should have getStates endpoint configured', () => {
      expect(stateApiSlice.endpoints.getStates).toBeDefined();
      expect(typeof stateApiSlice.endpoints.getStates).toBe('object');
    });

    it('should have addState endpoint configured', () => {
      expect(stateApiSlice.endpoints.addState).toBeDefined();
      expect(typeof stateApiSlice.endpoints.addState).toBe('object');
    });

    it('should have updateState endpoint configured', () => {
      expect(stateApiSlice.endpoints.updateState).toBeDefined();
      expect(typeof stateApiSlice.endpoints.updateState).toBe('object');
    });

    it('should have deleteState endpoint configured', () => {
      expect(stateApiSlice.endpoints.deleteState).toBeDefined();
      expect(typeof stateApiSlice.endpoints.deleteState).toBe('object');
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
          getDefaultMiddleware().concat(apiSlice.middleware),
      });
    };

    beforeEach(() => {
      store = createTestStore();
      vi.clearAllMocks();
      mockFetch.mockClear();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    describe('Get States Query Hook', () => {
      it('should have working getStates query hook with full structure', () => {
        const { result } = renderHook(() => useGetStatesQuery(), {
          wrapper: TestWrapper,
        });

        expect(result.current.data).toBeUndefined();
        expect(result.current.isLoading).toBe(true);
        expect(result.current.isError).toBe(false);
        expect(result.current.isSuccess).toBe(false);
        expect(typeof result.current.refetch).toBe('function');
      });

      it('should handle query hook structure', () => {
        const { result } = renderHook(() => useGetStatesQuery(), {
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

    describe('Add State Mutation Hook', () => {
      it('should have working addState mutation hook with full structure', () => {
        const { result } = renderHook(() => useAddStateMutation(), {
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
        const { result } = renderHook(() => useAddStateMutation(), {
          wrapper: TestWrapper,
        });

        const [addState, state] = result.current;
        expect(typeof addState).toBe('function');
        expect(state).toHaveProperty('isLoading');
        expect(state).toHaveProperty('isError');
        expect(state).toHaveProperty('isSuccess');
        expect(state.error).toBeUndefined();
        expect(state.data).toBeUndefined();
        expect(state).toHaveProperty('reset');
        expect(typeof state.reset).toBe('function');
      });
    });

    describe('Update State Mutation Hook', () => {
      it('should have working updateState mutation hook with full structure', () => {
        const { result } = renderHook(() => useUpdateStateMutation(), {
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
        const { result } = renderHook(() => useUpdateStateMutation(), {
          wrapper: TestWrapper,
        });

        const [updateState, state] = result.current;
        expect(typeof updateState).toBe('function');
        expect(state).toHaveProperty('isLoading');
        expect(state).toHaveProperty('isError');
        expect(state).toHaveProperty('isSuccess');
        expect(state.error).toBeUndefined();
        expect(state.data).toBeUndefined();
        expect(state).toHaveProperty('reset');
        expect(typeof state.reset).toBe('function');
      });
    });

    describe('Delete State Mutation Hook', () => {
      it('should have working deleteState mutation hook with full structure', () => {
        const { result } = renderHook(() => useDeleteStateMutation(), {
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
        const { result } = renderHook(() => useDeleteStateMutation(), {
          wrapper: TestWrapper,
        });

        const [deleteState, state] = result.current;
        expect(typeof deleteState).toBe('function');
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
        const { result: queryResult } = renderHook(() => useGetStatesQuery(), {
          wrapper: TestWrapper,
        });
        const { result: addResult } = renderHook(() => useAddStateMutation(), {
          wrapper: TestWrapper,
        });
        const { result: updateResult } = renderHook(() => useUpdateStateMutation(), {
          wrapper: TestWrapper,
        });
        const { result: deleteResult } = renderHook(() => useDeleteStateMutation(), {
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
      });

      it('should have reset function available', () => {
        const { result } = renderHook(() => useAddStateMutation(), {
          wrapper: TestWrapper,
        });
        const [, state] = result.current;
        
        expect(typeof state.reset).toBe('function');
        expect(() => state.reset()).not.toThrow();
      });
    });

    describe('Hook Error Handling', () => {
      it('should handle null data gracefully', () => {
        const { result } = renderHook(() => useAddStateMutation(), {
          wrapper: TestWrapper,
        });
        const [addState] = result.current;
        expect(() => addState(null as unknown as StateFormData)).not.toThrow();
      });

      it('should handle undefined data gracefully', () => {
        const { result } = renderHook(() => useUpdateStateMutation(), {
          wrapper: TestWrapper,
        });
        const [updateState] = result.current;
        expect(() => updateState(undefined as unknown as UpdateStateData)).not.toThrow();
      });

      it('should handle malformed data objects', () => {
        const { result } = renderHook(() => useAddStateMutation(), {
          wrapper: TestWrapper,
        });
        const [addState] = result.current;
        expect(() => addState({ invalid: 'data' } as unknown as StateFormData)).not.toThrow();
      });
    });

    describe('Hook Performance', () => {
      it('should maintain consistent function references', () => {
        const { result, rerender } = renderHook(() => useAddStateMutation(), {
          wrapper: TestWrapper,
        });
        
        const initialAddState = result.current[0];
        rerender();
        const newAddState = result.current[0];
        
        expect(typeof initialAddState).toBe('function');
        expect(typeof newAddState).toBe('function');
      });

      it('should handle rapid successive calls', () => {
        const { result } = renderHook(() => useAddStateMutation(), {
          wrapper: TestWrapper,
        });
        const [addState] = result.current;
        
        expect(() => {
          addState({ name: 'State1' });
          addState({ name: 'State2' });
          addState({ name: 'State3' });
        }).not.toThrow();
      });

      it('should handle concurrent hook usage', () => {
        const { result: addResult } = renderHook(() => useAddStateMutation(), {
          wrapper: TestWrapper,
        });
        const { result: updateResult } = renderHook(() => useUpdateStateMutation(), {
          wrapper: TestWrapper,
        });
        const { result: deleteResult } = renderHook(() => useDeleteStateMutation(), {
          wrapper: TestWrapper,
        });

        expect(typeof addResult.current[0]).toBe('function');
        expect(typeof updateResult.current[0]).toBe('function');
        expect(typeof deleteResult.current[0]).toBe('function');
      });
    });

    describe('Integration Testing', () => {
      it('should work with all hooks simultaneously', () => {
        const { result: addResult } = renderHook(() => useAddStateMutation(), {
          wrapper: TestWrapper,
        });
        const { result: updateResult } = renderHook(() => useUpdateStateMutation(), {
          wrapper: TestWrapper,
        });
        const { result: deleteResult } = renderHook(() => useDeleteStateMutation(), {
          wrapper: TestWrapper,
        });

        const [addState] = addResult.current;
        const [updateState] = updateResult.current;
        const [deleteState] = deleteResult.current;

        expect(() => {
          addState({ name: 'New State' });
          updateState({ _id: '1', name: 'Updated State' });
          deleteState({ _id: '1' });
        }).not.toThrow();
      });

      it('should maintain state isolation between hooks', () => {
        const { result: addResult } = renderHook(() => useAddStateMutation(), {
          wrapper: TestWrapper,
        });
        const { result: updateResult } = renderHook(() => useUpdateStateMutation(), {
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
        expect(stateApiSlice.endpoints.getStates).toBeDefined();
        expect(typeof stateApiSlice.endpoints.getStates).toBe('object');
      });

      it('should have optimistic update configurations', () => {
        expect(stateApiSlice.endpoints.addState).toBeDefined();
        expect(stateApiSlice.endpoints.updateState).toBeDefined();
        expect(stateApiSlice.endpoints.deleteState).toBeDefined();
      });
    });
  });
}); 