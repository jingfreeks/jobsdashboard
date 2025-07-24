import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const loginApi = createApi({
  reducerPath: 'loginApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    login: builder.mutation<{ email: string; name?: string }, { email: string; password: string }>(
      {
        async queryFn(credentials) {
          // Simulate API call, replace with real fetch in production
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              if (credentials.email === 'user@example.com' && credentials.password === 'password') {
                resolve({ data: { email: credentials.email, name: 'Demo User' } });
              } else {
                reject({ error: { message: 'Invalid credentials' } });
              }
            }, 1000);
          });
        },
      }
    ),
  }),
});

export const { useLoginMutation } = loginApi; 