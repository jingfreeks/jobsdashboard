import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../config/store';

interface OnboardingData {
  id?: string|number;
  userId?: string;
  step?: number;
  isComplete?: boolean;
  preferences?: {
    jobTypes?: string[];
    locations?: string[];
    salary?: {
      min?: number;
      max?: number;
    };
    skills?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}

interface OnboardingState {
  data: OnboardingData | null;
  loading: boolean;
  error: string | null;
}

const initialState: OnboardingState = {
  data: null,
  loading: false,
  error: null,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setOnboardingData: (state, action: PayloadAction<OnboardingData>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setOnboardingLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setOnboardingError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearOnboardingData: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
    updateOnboardingStep: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.step = action.payload;
      }
    },
    updateOnboardingPreferences: (state, action: PayloadAction<Partial<OnboardingData['preferences']>>) => {
      if (state.data) {
        state.data.preferences = {
          ...state.data.preferences,
          ...action.payload,
        };
      }
    },
  },
});

export const {
  setOnboardingData,
  setOnboardingLoading,
  setOnboardingError,
  clearOnboardingData,
  updateOnboardingStep,
  updateOnboardingPreferences,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;

// Selectors
export const selectOnboardingData = (state: RootState) => state.onboarding.data;
export const selectOnboardingLoading = (state: RootState) => state.onboarding.loading;
export const selectOnboardingError = (state: RootState) => state.onboarding.error;
export const selectOnboardingStep = (state: RootState) => state.onboarding.data?.step || 0;
export const selectOnboardingComplete = (state: RootState) => state.onboarding.data?.isComplete || false;
export const selectOnboardingPreferences = (state: RootState) => state.onboarding.data?.preferences; 