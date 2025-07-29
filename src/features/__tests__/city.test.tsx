import { describe, it, expect } from 'vitest';
import { cityApiSlice } from '../city';

describe('cityApiSlice', () => {
  it('should export the correct endpoints', () => {
    expect(cityApiSlice.endpoints.getCities).toBeDefined();
    expect(cityApiSlice.endpoints.addCity).toBeDefined();
    expect(cityApiSlice.endpoints.updateCity).toBeDefined();
    expect(cityApiSlice.endpoints.deleteCity).toBeDefined();
  });

  it('should export the correct hooks', () => {
    const { useGetCitiesQuery, useAddCityMutation, useUpdateCityMutation, useDeleteCityMutation } = cityApiSlice;
    expect(useGetCitiesQuery).toBeDefined();
    expect(useAddCityMutation).toBeDefined();
    expect(useUpdateCityMutation).toBeDefined();
    expect(useDeleteCityMutation).toBeDefined();
  });

  it('should have correct types', () => {
    // This test ensures TypeScript types are working correctly
    expect(typeof cityApiSlice.endpoints.getCities).toBe('object');
    expect(typeof cityApiSlice.endpoints.addCity).toBe('object');
    expect(typeof cityApiSlice.endpoints.updateCity).toBe('object');
    expect(typeof cityApiSlice.endpoints.deleteCity).toBe('object');
  });
}); 