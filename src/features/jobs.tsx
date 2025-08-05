import { apiSlice } from '@/config/apiSplice';

// Job interface
export interface Job {
  _id: string;
  jobtitle: string;
  companyId?: string;
  companyname?: string;
  cityId?: string;
  cityname?: string;
  departmentId?: string;
  departmentname?: string;
  description?: string;
  requirements?: string;
  salary?: string;
  type?: string; // full-time, part-time, contract, etc.
  status?: string; // active, inactive, draft, etc.
}

// Form data interfaces
export interface JobFormData {
  jobtitle: string;
  companyId?: string;
  cityId?: string;
  departmentId?: string;
  description?: string;
  requirements?: string;
  salary?: string;
  type?: string;
  status?: string;
}

export interface UpdateJobData extends JobFormData {
  _id: string;
}

export const jobsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<Job[], void>({
      query: () => '/jobs',
      keepUnusedDataFor: 120,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      providesTags: ['Jobs'] as any,
    }),

    getJobById: builder.query<Job, string>({
      query: (id) => `/jobs/${id}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      providesTags: (result, error, id) => [{ type: 'Jobs', id }] as any,
    }),

    addJob: builder.mutation<Job, JobFormData>({
      query: (credentials) => ({
        url: '/jobs',
        method: 'POST',
        body: { ...credentials },
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invalidatesTags: ['Jobs'] as any,
    }),

    updateJob: builder.mutation<Job, UpdateJobData>({
      query: (credentials) => ({
        url: `/jobs/${credentials._id}`,
        method: 'PATCH',
        body: { ...credentials },
      }),
       
      invalidatesTags: (result, error, { _id }) => [
        { type: 'Jobs', id: 'LIST' },
        { type: 'Jobs', id: _id },
      ] as any,
    }),

    deleteJob: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: 'DELETE',
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invalidatesTags: ['Jobs'] as any,
    }),

    getJobsByCompany: builder.query<Job[], string>({
      query: (companyId) => `/jobs/company/${companyId}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      providesTags: ['CompanyJobs'] as any,
    }),

    getJobsByCity: builder.query<Job[], string>({
      query: (cityId) => `/jobs/city/${cityId}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      providesTags: ['CityJobs'] as any,
    }),

    getJobsByDepartment: builder.query<Job[], string>({
      query: (departmentId) => `/jobs/department/${departmentId}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      providesTags: ['DepartmentJobs'] as any,
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useAddJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetJobsByCompanyQuery,
  useGetJobsByCityQuery,
  useGetJobsByDepartmentQuery,
} = jobsApiSlice;