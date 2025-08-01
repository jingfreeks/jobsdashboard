import { useCallback, useMemo } from 'react';
import { useGetStatesQuery, useAddStateMutation, useUpdateStateMutation, useDeleteStateMutation, type State, type StateFormData, type UpdateStateData } from '@/features/state';

export const useStateOperations = () => {
  const { data: states = [], isLoading, error, refetch } = useGetStatesQuery();
  const [addState, { isLoading: isAdding }] = useAddStateMutation();
  const [updateState, { isLoading: isUpdating }] = useUpdateStateMutation();
  const [deleteState, { isLoading: isDeleting }] = useDeleteStateMutation();

  const sortedStates = useMemo(() => [...states].sort((a, b) => a.name.localeCompare(b.name)), [states]);
  const stateMap = useMemo(() => new Map(states.map(state => [state._id, state])), [states]);

  const createState = useCallback(async (data: StateFormData): Promise<State | null> => {
    try {
      const result = await addState(data).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to create state:', error);
      return null;
    }
  }, [addState]);

  const updateStateById = useCallback(async (data: UpdateStateData): Promise<State | null> => {
    try {
      const result = await updateState(data).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to update state:', error);
      return null;
    }
  }, [updateState]);

  const deleteStateById = useCallback(async (stateId: string): Promise<boolean> => {
    try {
      await deleteState({ _id: stateId }).unwrap();
      return true;
    } catch (error) {
      console.error('Failed to delete state:', error);
      return false;
    }
  }, [deleteState]);

  const getStateById = useCallback((id: string): State | undefined => {
    return stateMap.get(id);
  }, [stateMap]);

  const searchStates = useCallback((query: string): State[] => {
    const lowercaseQuery = query.toLowerCase();
    return sortedStates.filter(state => 
      state.name.toLowerCase().includes(lowercaseQuery)
    );
  }, [sortedStates]);

  return {
    states: sortedStates,
    stateMap,
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    error,
    createState,
    updateStateById,
    deleteStateById,
    refetch,
    getStateById,
    searchStates,
  };
}; 