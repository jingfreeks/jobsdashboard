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
  console.log(result);
  if (result?.error?.originalStatus === 403) {
    const refereshResult = await baseQuery('/refresh', api, extraOptions);

    if (refereshResult?.data) {
      const currentAuth = api.getState().auth;
      //store the new token
      api.dispatch(setCredentials({
        user: currentAuth.user,
        accessToken: (refereshResult.data as any).accessToken,
        userId: currentAuth.userId,
        roles: currentAuth.roles
      }));
      //retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(setLogout());
    }
  }
  return result;
};

export const apiSlice = createApi<any, any>({
  baseQuery: baseQueryWithAuth,
  reducerPath: 'api',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endpoints: _ => ({}),
  tagTypes: ['City', 'Jobs', 'MyJobs', 'JobDetails', 'Profile'] as any,
});