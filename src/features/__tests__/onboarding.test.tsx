import { configureStore } from '@reduxjs/toolkit';
import onboardingReducer, {
  setOnboardingData,
  setOnboardingLoading,
  setOnboardingError,
  clearOnboardingData,
  updateOnboardingStep,
  updateOnboardingPreferences,
  selectOnboardingData,
  selectOnboardingLoading,
  selectOnboardingError,
  selectOnboardingStep,
  selectOnboardingComplete,
  selectOnboardingPreferences,
} from '../onboarding';

describe('Onboarding Slice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        onboarding: onboardingReducer,
      },
    });
  });

  describe('initial state', () => {
    it('should have the correct initial state', () => {
      const state = store.getState().onboarding;
      expect(state).toEqual({
        data: null,
        loading: false,
        error: null,
      });
    });
  });

  describe('setOnboardingData', () => {
    it('should set onboarding data and clear loading and error', () => {
      const mockData = {
        id: '1',
        userId: 'user1',
        step: 2,
        isComplete: false,
        preferences: {
          jobTypes: ['full-time'],
          locations: ['New York'],
        },
      };

      store.dispatch(setOnboardingData(mockData));

      const state = store.getState().onboarding;
      expect(state.data).toEqual(mockData);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('setOnboardingLoading', () => {
    it('should set loading state and clear error when loading starts', () => {
      // First set an error
      store.dispatch(setOnboardingError('Some error'));
      
      // Then set loading to true
      store.dispatch(setOnboardingLoading(true));

      const state = store.getState().onboarding;
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should set loading to false', () => {
      store.dispatch(setOnboardingLoading(false));

      const state = store.getState().onboarding;
      expect(state.loading).toBe(false);
    });
  });

  describe('setOnboardingError', () => {
    it('should set error and clear loading', () => {
      // First set loading to true
      store.dispatch(setOnboardingLoading(true));
      
      // Then set an error
      store.dispatch(setOnboardingError('Test error'));

      const state = store.getState().onboarding;
      expect(state.error).toBe('Test error');
      expect(state.loading).toBe(false);
    });
  });

  describe('clearOnboardingData', () => {
    it('should clear all onboarding state', () => {
      // First set some data, loading, and error
      store.dispatch(setOnboardingData({ id: '1', step: 1 }));
      store.dispatch(setOnboardingLoading(true));
      store.dispatch(setOnboardingError('Error'));

      // Then clear everything
      store.dispatch(clearOnboardingData());

      const state = store.getState().onboarding;
      expect(state.data).toBe(null);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('updateOnboardingStep', () => {
    it('should update step when data exists', () => {
      const mockData = { id: '1', step: 1 };
      store.dispatch(setOnboardingData(mockData));
      
      store.dispatch(updateOnboardingStep(3));

      const state = store.getState().onboarding;
      expect(state.data?.step).toBe(3);
    });

    it('should not update step when no data exists', () => {
      store.dispatch(updateOnboardingStep(3));

      const state = store.getState().onboarding;
      expect(state.data).toBe(null);
    });
  });

  describe('updateOnboardingPreferences', () => {
    it('should update preferences when data exists', () => {
      const mockData = {
        id: '1',
        preferences: { jobTypes: ['part-time'] },
      };
      store.dispatch(setOnboardingData(mockData));
      
      store.dispatch(updateOnboardingPreferences({ jobTypes: ['full-time'], locations: ['NYC'] }));

      const state = store.getState().onboarding;
      expect(state.data?.preferences).toEqual({
        jobTypes: ['full-time'],
        locations: ['NYC'],
      });
    });

    it('should not update preferences when no data exists', () => {
      store.dispatch(updateOnboardingPreferences({ jobTypes: ['full-time'] }));

      const state = store.getState().onboarding;
      expect(state.data).toBe(null);
    });
  });

  describe('selectors', () => {
    it('should select onboarding data', () => {
      const mockData = { id: '1', step: 1 };
      store.dispatch(setOnboardingData(mockData));

      const result = selectOnboardingData(store.getState());
      expect(result).toEqual(mockData);
    });

    it('should select loading state', () => {
      store.dispatch(setOnboardingLoading(true));

      const result = selectOnboardingLoading(store.getState());
      expect(result).toBe(true);
    });

    it('should select error state', () => {
      store.dispatch(setOnboardingError('Test error'));

      const result = selectOnboardingError(store.getState());
      expect(result).toBe('Test error');
    });

    it('should select onboarding step', () => {
      const mockData = { id: '1', step: 2 };
      store.dispatch(setOnboardingData(mockData));

      const result = selectOnboardingStep(store.getState());
      expect(result).toBe(2);
    });

    it('should return 0 for step when no data exists', () => {
      const result = selectOnboardingStep(store.getState());
      expect(result).toBe(0);
    });

    it('should select onboarding complete status', () => {
      const mockData = { id: '1', isComplete: true };
      store.dispatch(setOnboardingData(mockData));

      const result = selectOnboardingComplete(store.getState());
      expect(result).toBe(true);
    });

    it('should return false for complete when no data exists', () => {
      const result = selectOnboardingComplete(store.getState());
      expect(result).toBe(false);
    });

    it('should select onboarding preferences', () => {
      const mockPreferences = { jobTypes: ['full-time'] };
      const mockData = { id: '1', preferences: mockPreferences };
      store.dispatch(setOnboardingData(mockData));

      const result = selectOnboardingPreferences(store.getState());
      expect(result).toEqual(mockPreferences);
    });
  });
}); 