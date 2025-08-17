import { apiSlice } from '@/config/apiSplice';

// Types
export interface Bank {
  _id: string;
  name: string;
}

export interface BankFormData {
  name: string;
}

export interface UpdateBankData extends BankFormData {
  _id: string;
}

//  Export transform function for testing
export const transformBanksResponse = (response: Bank[]): Bank[] => {
  return response.sort((a, b) => a.name.localeCompare(b.name));
};
// API slice with performance optimizations and optimistic updates
export const bankApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBanks: builder.query<Bank[], void>({
      query: () => '/bank',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      providesTags: ['Bank'] as any,
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
      // Transform and sort data for better performance
      transformResponse:transformBanksResponse
    }),
    addBank: builder.mutation<Bank, BankFormData>({
      query: (credentials) => ({
        url: '/bank',
        method: 'POST',
        body: credentials,
      }),
      // Optimistic update for better UX
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
        if (!credentials || !credentials.name) return; // Guard against null/undefined credentials
        const tempId = `temp-${Date.now()}`;
        const optimisticBank: Bank = {
          _id: tempId,
          name: credentials.name,
        };

        const patchResult = dispatch(
          bankApiSlice.util.updateQueryData('getBanks', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const banks = draft as any;
            banks.push(optimisticBank);
            banks.sort((a: Bank, b: Bank) => a.name.localeCompare(b.name));
          })
        );

        try {
          const { data: newBank } = await queryFulfilled;
          // Update with real data from server
          dispatch(
            bankApiSlice.util.updateQueryData('getBanks', undefined, (draft) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const banks = draft as any;
              const index = banks.findIndex((bank: Bank) => bank._id === tempId);
              if (index !== -1) {
                banks[index] = newBank;
              }
            })
          );
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invalidatesTags: ['Bank'] as any,
    }),
    updateBank: builder.mutation<Bank, UpdateBankData>({
      query: (credentials) => ({
        url: '/bank',
        method: 'PATCH',
        body: credentials,
      }),
      // Optimistic update
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
        if (!credentials || !credentials._id || !credentials.name) return; // Guard against null/undefined values
        const { _id, name } = credentials;
        const patchResult = dispatch(
          bankApiSlice.util.updateQueryData('getBanks', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const banks = draft as any;
            const bank = banks.find((b: Bank) => b._id === _id);
            if (bank) {
              bank.name = name;
              banks.sort((a: Bank, b: Bank) => a.name.localeCompare(b.name));
            }
          })
        );

        try {
          const { data: updatedBank } = await queryFulfilled;
          // Update with server response to ensure canonical data
          dispatch(
            bankApiSlice.util.updateQueryData('getBanks', undefined, (draft) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const banks = draft as any;
              const index = banks.findIndex((b: Bank) => b._id === _id);
              if (index !== -1) {
                banks[index] = updatedBank;
                banks.sort((a: Bank, b: Bank) => a.name.localeCompare(b.name));
              }
            })
          );
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invalidatesTags: ['Bank'] as any,
    }),
    deleteBank: builder.mutation<void, { _id: string }>({
      query: (credentials) => ({
        url: '/bank',
        method: 'DELETE',
        body: credentials,
      }),
      // Optimistic update
      async onQueryStarted({ _id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          bankApiSlice.util.updateQueryData('getBanks', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const banks = draft as any;
            const index = banks.findIndex((bank: Bank) => bank._id === _id);
            if (index !== -1) {
              banks.splice(index, 1);
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
      invalidatesTags: ['Bank'] as any,
    }),
  }),
  overrideExisting: true,
});

// Export hooks
export const {
  useGetBanksQuery,
  useAddBankMutation,
  useUpdateBankMutation,
  useDeleteBankMutation,
} = bankApiSlice;

// Performance-optimized selectors
export const selectBanksSorted = (data: Bank[] | undefined) => {
  if (!data) return [];
  return [...data].sort((a, b) => a.name.localeCompare(b.name));
};

export const selectBankById = (data: Bank[] | undefined, id: string) => {
  if (!data) return undefined;
  return data.find(bank => bank._id === id);
};