import { apiSlice } from '@/config/apiSplice';

// Type definitions
export interface Company {
  _id: string;
  name: string;
  address?: string;
  cityId?: string;
  cityname?: string;
}

export interface CompanyFormData {
  name: string;
  address?: string;
  cityId?: string;
}

export interface UpdateCompanyData extends CompanyFormData {
  _id: string;
}

export const companyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCompanies: builder.query<Company[], void>({
      query: () => '/company',
      transformResponse: (response: Company[]) => {
        // Sort companies alphabetically by name
        return response.sort((a, b) => a.name.localeCompare(b.name));
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      providesTags: ['Company'] as any,
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),
    addCompany: builder.mutation<Company, CompanyFormData>({
      query: (credentials) => ({
        url: '/company',
        method: 'POST',
        body: credentials,
      }),
      // Optimistic update
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
        if (!credentials || !credentials.name) return; // Guard against null/undefined credentials
        const { name } = credentials;
        const patchResult = dispatch(
          companyApiSlice.util.updateQueryData('getCompanies', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const companies = draft as any;
            const tempId = `temp-${Date.now()}`;
            companies.push({ _id: tempId, name });
            companies.sort((a: Company, b: Company) => a.name.localeCompare(b.name));
          })
        );

        try {
          const { data: newCompany } = await queryFulfilled;
          // Replace temporary company with server response
          dispatch(
            companyApiSlice.util.updateQueryData('getCompanies', undefined, (draft) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const companies = draft as any;
              const index = companies.findIndex((c: Company) => c._id.startsWith('temp-'));
              if (index !== -1) {
                companies[index] = newCompany;
                companies.sort((a: Company, b: Company) => a.name.localeCompare(b.name));
              }
            })
          );
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invalidatesTags: ['Company'] as any,
    }),
    updateCompany: builder.mutation<Company, UpdateCompanyData>({
      query: (credentials) => ({
        url: '/company',
        method: 'PATCH',
        body: credentials,
      }),
      // Optimistic update
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
        if (!credentials || !credentials._id || !credentials.name) return; // Guard against null/undefined values
        const { _id, name } = credentials;
        const patchResult = dispatch(
          companyApiSlice.util.updateQueryData('getCompanies', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const companies = draft as any;
            const company = companies.find((c: Company) => c._id === _id);
            if (company) {
              company.name = name;
              companies.sort((a: Company, b: Company) => a.name.localeCompare(b.name));
            }
          })
        );

        try {
          const { data: updatedCompany } = await queryFulfilled;
          // Update with server response to ensure canonical data
          dispatch(
            companyApiSlice.util.updateQueryData('getCompanies', undefined, (draft) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const companies = draft as any;
              const index = companies.findIndex((c: Company) => c._id === _id);
              if (index !== -1) {
                companies[index] = updatedCompany;
                companies.sort((a: Company, b: Company) => a.name.localeCompare(b.name));
              }
            })
          );
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invalidatesTags: ['Company'] as any,
    }),
    deleteCompany: builder.mutation<{ success: boolean }, { _id: string }>({
      query: (credentials) => ({
        url: '/company',
        method: 'DELETE',
        body: credentials,
      }),
      // Optimistic update
      async onQueryStarted({ _id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          companyApiSlice.util.updateQueryData('getCompanies', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const companies = draft as any;
            const index = companies.findIndex((c: Company) => c._id === _id);
            if (index !== -1) {
              companies.splice(index, 1);
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
      invalidatesTags: ['Company'] as any,
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCompaniesQuery,
  useAddCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companyApiSlice;

// Performance-optimized selectors
export const selectCompaniesSorted = (data: Company[] | undefined) => {
  if (!data) return [];
  return [...data].sort((a, b) => a.name.localeCompare(b.name));
};

export const selectCompanyById = (data: Company[] | undefined, id: string) => {
  if (!data) return undefined;
  return data.find(company => company._id === id);
};