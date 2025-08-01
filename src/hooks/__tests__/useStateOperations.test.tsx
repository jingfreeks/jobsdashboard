import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useStateOperations } from '../useStateOperations';
import type { State } from '@/features/state';

// Mock the state API slice
vi.mock('@/features/state', () => ({
  useGetStatesQuery: vi.fn(),
  useAddStateMutation: vi.fn(),
  useUpdateStateMutation: vi.fn(),
  useDeleteStateMutation: vi.fn(),
}));

const mockStates: State[] = [
  { _id: '1', name: 'California' },
  { _id: '2', name: 'Texas' },
  { _id: '3', name: 'Florida' },
];

const sortedMockStates: State[] = [
  { _id: '1', name: 'California' },
  { _id: '3', name: 'Florida' },
  { _id: '2', name: 'Texas' },
];

describe('useStateOperations', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Mock the RTK Query hooks
    const { useGetStatesQuery, useAddStateMutation, useUpdateStateMutation, useDeleteStateMutation } = await import('@/features/state');
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useGetStatesQuery as any).mockReturnValue({
      data: mockStates,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

     
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useAddStateMutation as any).mockReturnValue([
      vi.fn().mockResolvedValue({ data: { _id: '4', name: 'New York' } }),
      { isLoading: false }
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useUpdateStateMutation as any).mockReturnValue([
      vi.fn().mockResolvedValue({ data: { _id: '1', name: 'Updated California' } }),
      { isLoading: false }
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useDeleteStateMutation as any).mockReturnValue([
      vi.fn().mockResolvedValue({ data: undefined }),
      { isLoading: false }
    ]);
  });

  it('should return sorted states', () => {
    const { result } = renderHook(() => useStateOperations());
    
    expect(result.current.states).toEqual(sortedMockStates);
  });

  it('should return loading states', () => {
    const { result } = renderHook(() => useStateOperations());
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAdding).toBe(false);
    expect(result.current.isUpdating).toBe(false);
    expect(result.current.isDeleting).toBe(false);
  });

  it('should return error state', () => {
    const { result } = renderHook(() => useStateOperations());
    
    expect(result.current.error).toBe(null);
  });

  it('should return state map', () => {
    const { result } = renderHook(() => useStateOperations());
    
    expect(result.current.stateMap).toBeInstanceOf(Map);
    expect(result.current.stateMap.get('1')).toEqual({ _id: '1', name: 'California' });
    expect(result.current.stateMap.get('2')).toEqual({ _id: '2', name: 'Texas' });
  });

  it('should have createState function', () => {
    const { result } = renderHook(() => useStateOperations());
    
    expect(typeof result.current.createState).toBe('function');
  });

  it('should have updateStateById function', () => {
    const { result } = renderHook(() => useStateOperations());
    
    expect(typeof result.current.updateStateById).toBe('function');
  });

  it('should have deleteStateById function', () => {
    const { result } = renderHook(() => useStateOperations());
    
    expect(typeof result.current.deleteStateById).toBe('function');
  });

  it('should have getStateById function', () => {
    const { result } = renderHook(() => useStateOperations());
    
    expect(typeof result.current.getStateById).toBe('function');
    expect(result.current.getStateById('1')).toEqual({ _id: '1', name: 'California' });
    expect(result.current.getStateById('999')).toBeUndefined();
  });

  it('should have searchStates function', () => {
    const { result } = renderHook(() => useStateOperations());
    
    expect(typeof result.current.searchStates).toBe('function');
    expect(result.current.searchStates('cal')).toEqual([{ _id: '1', name: 'California' }]);
    expect(result.current.searchStates('tex')).toEqual([{ _id: '2', name: 'Texas' }]);
    expect(result.current.searchStates('nonexistent')).toEqual([]);
  });

  it('should have refetch function', () => {
    const { result } = renderHook(() => useStateOperations());
    
    expect(typeof result.current.refetch).toBe('function');
  });
}); 