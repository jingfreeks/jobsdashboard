import { apiSlice } from '@/config/apiSplice';

// Types
export interface Department {
  _id: string;
  name: string;
}

export interface DepartmentFormData {
  name: string;
}

export interface UpdateDepartmentData extends DepartmentFormData {
  _id: string;
}

// API slice with performance optimizations and optimistic updates
export const departmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<Department[], void>({
      query: () => '/dept',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      providesTags: ['Department'] as any,
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
      // Transform and sort data for better performance
      transformResponse: (response: Department[]) => {
        return response.sort((a, b) => a.name.localeCompare(b.name));
      },
    }),
    addDepartment: builder.mutation<Department, DepartmentFormData>({
      query: (credentials) => ({
        url: '/dept',
        method: 'POST',
        body: credentials,
      }),
      // Optimistic update for better UX
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
        const tempId = `temp-${Date.now()}`;
        const optimisticDepartment: Department = {
          _id: tempId,
          name: credentials.name || '',
        };

        const patchResult = dispatch(
          departmentApiSlice.util.updateQueryData('getDepartments', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const departments = draft as any;
            departments.push(optimisticDepartment);
            departments.sort((a: Department, b: Department) => a.name.localeCompare(b.name));
          })
        );

        try {
          const { data: newDepartment } = await queryFulfilled;
          // Update with real data from server
          dispatch(
            departmentApiSlice.util.updateQueryData('getDepartments', undefined, (draft) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const departments = draft as any;
              const index = departments.findIndex((dept: Department) => dept._id === tempId);
              if (index !== -1) {
                departments[index] = newDepartment;
              }
            })
          );
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invalidatesTags: ['Department'] as any,
    }),
    updateDepartment: builder.mutation<Department, UpdateDepartmentData>({
      query: (credentials) => ({
        url: '/dept',
        method: 'PATCH',
        body: credentials,
      }),
      // Optimistic update
      async onQueryStarted({ _id, name }, { dispatch, queryFulfilled }) {
        if (!_id || !name) return; // Guard against null/undefined values
        const patchResult = dispatch(
          departmentApiSlice.util.updateQueryData('getDepartments', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const departments = draft as any;
            const department = departments.find((d: Department) => d._id === _id);
            if (department) {
              department.name = name;
              departments.sort((a: Department, b: Department) => a.name.localeCompare(b.name));
            }
          })
        );

        try {
          const { data: updatedDepartment } = await queryFulfilled;
          // Update with server response to ensure canonical data
          dispatch(
            departmentApiSlice.util.updateQueryData('getDepartments', undefined, (draft) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const departments = draft as any;
              const index = departments.findIndex((d: Department) => d._id === _id);
              if (index !== -1) {
                departments[index] = updatedDepartment;
                departments.sort((a: Department, b: Department) => a.name.localeCompare(b.name));
              }
            })
          );
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invalidatesTags: ['Department'] as any,
    }),
    deleteDepartment: builder.mutation<void, { _id: string }>({
      query: (credentials) => ({
        url: '/dept',
        method: 'DELETE',
        body: credentials,
      }),
      // Optimistic update
      async onQueryStarted({ _id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          departmentApiSlice.util.updateQueryData('getDepartments', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const departments = draft as any;
            const index = departments.findIndex((dept: Department) => dept._id === _id);
            if (index !== -1) {
              departments.splice(index, 1);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invalidatesTags: ['Department'] as any,
    }),
  }),
  overrideExisting: true,
});

// Export hooks
export const {
  useGetDepartmentsQuery,
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApiSlice;

// Performance-optimized selectors
export const selectDepartmentsSorted = (data: Department[] | undefined) => {
  if (!data) return [];
  return [...data].sort((a, b) => a.name.localeCompare(b.name));
};

export const selectDepartmentById = (data: Department[] | undefined, id: string) => {
  if (!data) return undefined;
  return data.find(department => department._id === id);
};