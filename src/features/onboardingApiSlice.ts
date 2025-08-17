import { apiSlice } from '@/config/apiSplice';

interface OnboardingResponse {
  id: string;
  userId: string;
  step: number;
  isComplete: boolean;
  preferences: {
    jobTypes?: string[];
    locations?: string[];
    salary?: {
      min?: number;
      max?: number;
    };
    skills?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export const onboardingApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getOnboarding: builder.query<OnboardingResponse, void>({
      query: () => ({
        url: '/onboarding',
        method: 'GET',
      }),
      providesTags: ['Onboarding'],
    }),
    getOnboardingById: builder.query<OnboardingResponse,{id:string}, void>({
      query: ({id}) => ({
        url: `/onboarding/${id}`,
        method: 'GET',
      }),
      providesTags: ['Onboarding'],
    }),
    updateOnboarding: builder.mutation<OnboardingResponse, Partial<OnboardingResponse>>({
      query: (data) => ({
        url: '/onboarding/',
        method: 'PUT',
        body: data,
      }),
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (onboardingApiSlice.util.updateQueryData as any)('getOnboarding', undefined, (draft: OnboardingResponse) => {
            if (draft) {
              Object.assign(draft, data);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Onboarding'],
    }),
    updateOnboardingById: builder.mutation<OnboardingResponse, { id: string; data: Partial<OnboardingResponse> }>({
      query: ({ id, data }) => ({
        url: `/onboarding/${id}`,
        method: 'PUT',
        body: data,
      }),
      async onQueryStarted({ data }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (onboardingApiSlice.util.updateQueryData as any)('getOnboarding', undefined, (draft: OnboardingResponse) => {
            if (draft) {
              Object.assign(draft, data);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Onboarding'],
    }),
    createOnboarding: builder.mutation<OnboardingResponse, Partial<OnboardingResponse>>({
      query: (data) => ({
        url: '/onboarding',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (onboardingApiSlice.util.updateQueryData as any)('getOnboarding', undefined, (draft: OnboardingResponse) => {
            if (draft) {
              Object.assign(draft, data);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Onboarding'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetOnboardingQuery,
  useUpdateOnboardingMutation,
  useUpdateOnboardingByIdMutation,
  useCreateOnboardingMutation,
} = onboardingApiSlice; 