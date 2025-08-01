import { useCallback, useMemo } from 'react';
import {
  useGetCitiesQuery,
  useAddCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
  type City,
  type CityFormData,
  type UpdateCityData,
} from '@/features/city';
import { useGetStatesQuery } from '@/features/state';

export const useCityOperations = () => {
  const { data: cities = [], isLoading, error, refetch } = useGetCitiesQuery(undefined) as { data: City[], isLoading: boolean, error: unknown, refetch: () => void };
  const { data: states = [] } = useGetStatesQuery(undefined) as { data: Array<{ _id: string; name: string }> };
  const [addCity, { isLoading: isAdding }] = useAddCityMutation();
  const [updateCity, { isLoading: isUpdating }] = useUpdateCityMutation();
  const [deleteCity, { isLoading: isDeleting }] = useDeleteCityMutation();

  // Memoized sorted cities for performance
  const sortedCities = useMemo(() => {
    return [...cities].sort((a, b) => a.name.localeCompare(b.name));
  }, [cities]);

  // Memoized city map for quick lookups
  const cityMap = useMemo(() => {
    return new Map(cities.map(city => [city._id, city]));
  }, [cities]);

  // Memoized state map for quick lookups
  const stateMap = useMemo(() => {
    return new Map(states.map(state => [state._id, state]));
  }, [states]);

  // Memoized cities with state names
  const citiesWithStates = useMemo(() => {
    return sortedCities.map(city => ({
      ...city,
      statename: city.stateId && stateMap.get(city.stateId)?.name || 'Unknown State'
    }));
  }, [sortedCities, stateMap]);

  // Wrapped operations with error handling
  const createCity = useCallback(async (data: CityFormData): Promise<City | null> => {
    try {
      const result = await addCity(data).unwrap() as City;
      return result;
    } catch (error) {
      console.error('Failed to create city:', error);
      return null;
    }
  }, [addCity]);

  const updateCityById = useCallback(async (data: UpdateCityData): Promise<City | null> => {
    try {
      const result = await updateCity(data).unwrap() as City;
      return result;
    } catch (error) {
      console.error('Failed to update city:', error);
      return null;
    }
  }, [updateCity]);

  const deleteCityById = useCallback(async (cityId: string): Promise<boolean> => {
    try {
      await deleteCity({ _id: cityId }).unwrap();
      return true;
    } catch (error) {
      console.error('Failed to delete city:', error);
      return false;
    }
  }, [deleteCity]);

  return {
    // Data
    cities: sortedCities,
    citiesWithStates,
    states,
    cityMap,
    stateMap,
    
    // Loading states
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    
    // Error state
    error,
    
    // Operations
    createCity,
    updateCityById,
    deleteCityById,
    refetch,
  };
}; 