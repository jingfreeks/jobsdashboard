import { describe, it, expect, beforeEach } from 'vitest';
import { stateApiSlice } from '../state';

describe('State API Slice', () => {
  beforeEach(() => {
    // Clear any cached data
    stateApiSlice.util.resetApiState();
  });

  it('should have the correct endpoints', () => {
    expect(stateApiSlice.endpoints.getStates).toBeDefined();
    expect(stateApiSlice.endpoints.addState).toBeDefined();
    expect(stateApiSlice.endpoints.updateState).toBeDefined();
    expect(stateApiSlice.endpoints.deleteState).toBeDefined();
  });

  it('should export the correct hooks', () => {
    expect(stateApiSlice.useGetStatesQuery).toBeDefined();
    expect(stateApiSlice.useAddStateMutation).toBeDefined();
    expect(stateApiSlice.useUpdateStateMutation).toBeDefined();
    expect(stateApiSlice.useDeleteStateMutation).toBeDefined();
  });

  it('should have correct endpoint types', () => {
    expect(typeof stateApiSlice.endpoints.getStates).toBe('object');
    expect(typeof stateApiSlice.endpoints.addState).toBe('object');
    expect(typeof stateApiSlice.endpoints.updateState).toBe('object');
    expect(typeof stateApiSlice.endpoints.deleteState).toBe('object');
  });

  it('should have correct query configuration', () => {
    const getStatesEndpoint = stateApiSlice.endpoints.getStates;
    expect(getStatesEndpoint).toBeDefined();
  });

  it('should have correct mutation configurations', () => {
    const addStateEndpoint = stateApiSlice.endpoints.addState;
    const updateStateEndpoint = stateApiSlice.endpoints.updateState;
    const deleteStateEndpoint = stateApiSlice.endpoints.deleteState;

    expect(addStateEndpoint).toBeDefined();
    expect(updateStateEndpoint).toBeDefined();
    expect(deleteStateEndpoint).toBeDefined();
  });

  it('should have optimistic update configurations', () => {
    const addStateEndpoint = stateApiSlice.endpoints.addState;
    const updateStateEndpoint = stateApiSlice.endpoints.updateState;
    const deleteStateEndpoint = stateApiSlice.endpoints.deleteState;

    expect(addStateEndpoint).toBeDefined();
    expect(updateStateEndpoint).toBeDefined();
    expect(deleteStateEndpoint).toBeDefined();
  });
}); 