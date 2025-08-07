import { setupApiStore } from '@reduxjs/toolkit/query/react';
import { apiSlice } from '@/config/apiSplice';
import { onboardingApiSlice } from '../onboardingApiSlice';

const storeRef = setupApiStore(apiSlice);

describe('Onboarding API Slice', () => {
  const store = storeRef.store;

  beforeEach(() => {
    store.dispatch(apiSlice.util.resetApiState());
  });

  describe('getOnboarding', () => {
    it('should have the correct endpoint configuration', () => {
      const endpoint = onboardingApiSlice.endpoints.getOnboarding;
      
      expect(endpoint).toBeDefined();
      expect(endpoint.matchFulfilled).toBeDefined();
      expect(endpoint.matchPending).toBeDefined();
      expect(endpoint.matchRejected).toBeDefined();
    });

    it('should provide Onboarding tag', () => {
      const endpoint = onboardingApiSlice.endpoints.getOnboarding;
      const result = endpoint.providesTags;
      
      expect(result).toEqual(['Onboarding']);
    });
  });

  describe('updateOnboarding', () => {
    it('should have the correct endpoint configuration', () => {
      const endpoint = onboardingApiSlice.endpoints.updateOnboarding;
      
      expect(endpoint).toBeDefined();
      expect(endpoint.matchFulfilled).toBeDefined();
      expect(endpoint.matchPending).toBeDefined();
      expect(endpoint.matchRejected).toBeDefined();
    });

    it('should invalidate Onboarding tag', () => {
      const endpoint = onboardingApiSlice.endpoints.updateOnboarding;
      const result = endpoint.invalidatesTags;
      
      expect(result).toEqual(['Onboarding']);
    });
  });

  describe('createOnboarding', () => {
    it('should have the correct endpoint configuration', () => {
      const endpoint = onboardingApiSlice.endpoints.createOnboarding;
      
      expect(endpoint).toBeDefined();
      expect(endpoint.matchFulfilled).toBeDefined();
      expect(endpoint.matchPending).toBeDefined();
      expect(endpoint.matchRejected).toBeDefined();
    });

    it('should invalidate Onboarding tag', () => {
      const endpoint = onboardingApiSlice.endpoints.createOnboarding;
      const result = endpoint.invalidatesTags;
      
      expect(result).toEqual(['Onboarding']);
    });
  });

  describe('exported hooks', () => {
    it('should export useGetOnboardingQuery', () => {
      expect(onboardingApiSlice.useGetOnboardingQuery).toBeDefined();
    });

    it('should export useUpdateOnboardingMutation', () => {
      expect(onboardingApiSlice.useUpdateOnboardingMutation).toBeDefined();
    });

    it('should export useCreateOnboardingMutation', () => {
      expect(onboardingApiSlice.useCreateOnboardingMutation).toBeDefined();
    });
  });
}); 