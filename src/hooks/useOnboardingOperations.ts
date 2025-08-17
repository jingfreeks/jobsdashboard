/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useGetOnboardingQuery, useUpdateOnboardingMutation, useCreateOnboardingMutation } from '@/features/onboardingApiSlice';
import {
  setOnboardingData,
  setOnboardingLoading,
  setOnboardingError,
  clearOnboardingData,
  updateOnboardingStep,
  updateOnboardingPreferences,
} from '@/features/onboarding';
import type { AppDispatch } from '@/config/store';

export const useOnboardingOperations = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // RTK Query hooks
  const { data: onboardingData, isLoading, error, refetch } = useGetOnboardingQuery();
  const [updateOnboarding, { isLoading: isUpdating }] = useUpdateOnboardingMutation();
  const [createOnboarding, { isLoading: isCreating }] = useCreateOnboardingMutation();

  // Local state management
  const setLoading = useCallback((loading: boolean) => {
    dispatch(setOnboardingLoading(loading));
  }, [dispatch]);

  const setError = useCallback((error: string) => {
    dispatch(setOnboardingError(error));
  }, [dispatch]);

  const setData = useCallback((data: any) => {
    dispatch(setOnboardingData(data));
  }, [dispatch]);

  const clearData = useCallback(() => {
    dispatch(clearOnboardingData());
  }, [dispatch]);

  const updateStep = useCallback((step: number) => {
    dispatch(updateOnboardingStep(step));
  }, [dispatch]);

  const updatePreferences = useCallback((preferences: any) => {
    dispatch(updateOnboardingPreferences(preferences));
  }, [dispatch]);

  // Combined operations
  const fetchOnboarding = useCallback(async () => {
    try {
      setLoading(true);
      const result = await refetch();
      if (result.data) {
        setData(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch onboarding data');
    } finally {
      setLoading(false);
    }
  }, [refetch, setLoading, setData, setError]);

  const saveOnboarding = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const result = await updateOnboarding(data).unwrap();
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save onboarding data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateOnboarding, setLoading, setData, setError]);

  const createNewOnboarding = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const result = await createOnboarding(data).unwrap();
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create onboarding data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createOnboarding, setLoading, setData, setError]);

  return {
    // Data
    onboardingData,
    isLoading: isLoading || isUpdating || isCreating,
    error,
    
    // Actions
    fetchOnboarding,
    saveOnboarding,
    createNewOnboarding,
    updateStep,
    updatePreferences,
    clearData,
    
    // Direct API hooks (for advanced usage)
    refetch,
    updateOnboarding,
    createOnboarding,
  };
}; 