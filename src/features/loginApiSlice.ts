import {apiSlice} from '@/config/apiSplice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: '/auth',
        method: 'POST',
        body: {...credentials},
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
        // body: {...credentials},
      }),
    }),
    signup: builder.mutation({
      query: credentials => ({
        url: '/signup',
        method: 'POST',
        body: {...credentials},
      }),
    }),
  }),
  overrideExisting: true,
});

export const {useLoginMutation,useSignupMutation,useLogoutMutation} = authApiSlice || {};