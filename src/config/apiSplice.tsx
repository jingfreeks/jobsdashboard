/* eslint-disable @typescript-eslint/no-explicit-any */
import {setCredentials, setLogout} from '@/features/auth';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
   
  prepareHeaders: (headers, {getState}: any) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithAuth = async (
  args: string,
  api: any,
  extraOptions: string,
) => {
  let result: any = await baseQuery(args, api, extraOptions);
  
  console.log('Base query result:', result);
  // Handle token expiration (401 Unauthorized) or forbidden (403)
  if (result?.error?.originalStatus === 401 || result?.error?.originalStatus === 403) {
    console.warn('Token expired or invalid, attempting refresh...');
    
    // Try to refresh the token
    const refreshResult = await baseQuery('/refresh', api, extraOptions);

    if (refreshResult?.data) {
      const currentAuth = api.getState().auth;
      // Store the new token
      api.dispatch(setCredentials({
        user: currentAuth.user,
        accessToken: (refreshResult.data as any).accessToken,
        userId: currentAuth.userId,
        roles: currentAuth.roles
      }));
      // Retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, trigger automatic logout
      console.error('Token refresh failed, logging out user');
      
      // Dispatch logout action to clear auth state
      api.dispatch(setLogout());
      
      // Set a flag in localStorage to trigger logout on next render
      localStorage.setItem('forceLogout', 'true');
      localStorage.setItem('logoutReason', 'Token expired');
      
      // Redirect to login page
      window.location.href = '/login';
    }
  }
  
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth as any,
  reducerPath: 'api',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endpoints: _ => ({}),
  tagTypes: ['City', 'Jobs', 'MyJobs', 'JobDetails', 'Profile', 'Bank', 'State', 'Shift', 'Onboarding'] as const,
  keepUnusedDataFor: 60,
});