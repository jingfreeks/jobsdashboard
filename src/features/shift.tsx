import { apiSlice } from '@/config/apiSplice';

// TypeScript interfaces
export interface Shift {
  _id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShiftFormData {
  title: string;
}

export interface UpdateShiftData {
  _id: string;
  title: string;
}

export interface UpdateShiftWithoutIdData {
  title: string;
}

export interface DeleteShiftData {
  _id: string;
}

// RTK Query API slice with injected endpoints
export const shiftApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all shifts
    getShifts: builder.query<Shift[], void>({
      query: () => '/shift',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      providesTags: ['Shift'] as any,
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
      // Transform and sort data for better performance
      transformResponse: (response: Shift[]) => {
        return response.sort((a, b) => a.title.localeCompare(b.title));
      },
    }),

    // Create new shift
    createShift: builder.mutation<Shift, ShiftFormData>({
      query: (credentials) => ({
        url: '/shift',
        method: 'POST',
        body: credentials,
      }),
      // Optimistic update for better UX
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
        if (!credentials || !credentials.title) return; // Guard against null/undefined credentials
        const tempId = `temp-${Date.now()}`;
        const optimisticShift: Shift = {
          _id: tempId,
          title: credentials.title,
        };

        const patchResult = dispatch(
          shiftApiSlice.util.updateQueryData('getShifts', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const shifts = draft as any;
            shifts.push(optimisticShift);
            shifts.sort((a: Shift, b: Shift) => a.title.localeCompare(b.title));
          })
        );

        try {
          const { data: newShift } = await queryFulfilled;
          // Update with real data from server
          dispatch(
            shiftApiSlice.util.updateQueryData('getShifts', undefined, (draft) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const shifts = draft as any;
              const index = shifts.findIndex((shift: Shift) => shift._id === tempId);
              if (index !== -1) {
                shifts[index] = newShift;
              }
            })
          );
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invalidatesTags: ['Shift'] as any,
    }),

    // Update shift by ID
    updateShiftById: builder.mutation<Shift, UpdateShiftData>({
      query: ({ _id, ...credentials }) => ({
        url: `/shift/${_id}`,
        method: 'PATCH',
        body: credentials,
      }),
      // Optimistic update
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
        if (!credentials || !credentials._id || !credentials.title) return; // Guard against null/undefined values
        const { _id, title } = credentials;
        const patchResult = dispatch(
          shiftApiSlice.util.updateQueryData('getShifts', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const shifts = draft as any;
            const shift = shifts.find((s: Shift) => s._id === _id);
            if (shift) {
              shift.title = title;
              shifts.sort((a: Shift, b: Shift) => a.title.localeCompare(b.title));
            }
          })
        );

        try {
          const { data: updatedShift } = await queryFulfilled;
          // Update with server response to ensure canonical data
          dispatch(
            shiftApiSlice.util.updateQueryData('getShifts', undefined, (draft) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const shifts = draft as any;
              const index = shifts.findIndex((s: Shift) => s._id === _id);
              if (index !== -1) {
                shifts[index] = updatedShift;
                shifts.sort((a: Shift, b: Shift) => a.title.localeCompare(b.title));
              }
            })
          );
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invalidatesTags: ['Shift'] as any,
    }),

    // Update shift without ID (for bulk updates or when ID is in body)
    updateShift: builder.mutation<Shift, UpdateShiftData>({
      query: (credentials) => ({
        url: '/shift',
        method: 'PATCH',
        body: credentials,
      }),
      // Optimistic update
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
        if (!credentials || !credentials._id || !credentials.title) return; // Guard against null/undefined values
        const { _id, title } = credentials;
        const patchResult = dispatch(
          shiftApiSlice.util.updateQueryData('getShifts', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const shifts = draft as any;
            const shift = shifts.find((s: Shift) => s._id === _id);
            if (shift) {
              shift.title = title;
              shifts.sort((a: Shift, b: Shift) => a.title.localeCompare(b.title));
            }
          })
        );

        try {
          const { data: updatedShift } = await queryFulfilled;
          // Update with server response to ensure canonical data
          dispatch(
            shiftApiSlice.util.updateQueryData('getShifts', undefined, (draft) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const shifts = draft as any;
              const index = shifts.findIndex((s: Shift) => s._id === _id);
              if (index !== -1) {
                shifts[index] = updatedShift;
                shifts.sort((a: Shift, b: Shift) => a.title.localeCompare(b.title));
              }
            })
          );
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invalidatesTags: ['Shift'] as any,
    }),

    // Delete shift by ID
    deleteShiftById: builder.mutation<{ success: boolean }, DeleteShiftData>({
      query: ({ _id }) => ({
        url: `/shift/${_id}`,
        method: 'DELETE',
      }),
      // Optimistic update
      async onQueryStarted({ _id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          shiftApiSlice.util.updateQueryData('getShifts', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const shifts = draft as any;
            const index = shifts.findIndex((shift: Shift) => shift._id === _id);
            if (index !== -1) {
              shifts.splice(index, 1);
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
      invalidatesTags: ['Shift'] as any,
    }),

    // Delete shift without ID (for when ID is in body)
    deleteShift: builder.mutation<{ success: boolean }, DeleteShiftData>({
      query: (credentials) => ({
        url: '/shift',
        method: 'DELETE',
        body: credentials,
      }),
      // Optimistic update
      async onQueryStarted({ _id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          shiftApiSlice.util.updateQueryData('getShifts', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const shifts = draft as any;
            const index = shifts.findIndex((shift: Shift) => shift._id === _id);
            if (index !== -1) {
              shifts.splice(index, 1);
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
      invalidatesTags: ['Shift'] as any,
    }),
  }),
  overrideExisting: true,
});

// Export hooks
export const {
  useGetShiftsQuery,
  useCreateShiftMutation,
  useUpdateShiftByIdMutation,
  useUpdateShiftMutation,
  useDeleteShiftByIdMutation,
  useDeleteShiftMutation,
} = shiftApiSlice;

// Performance-optimized selectors
export const selectShiftsSorted = (data: Shift[] | undefined) => {
  if (!data) return [];
  return [...data].sort((a, b) => a.title.localeCompare(b.title));
};

export const selectShiftById = (data: Shift[] | undefined, id: string) => {
  if (!data) return undefined;
  return data.find(shift => shift._id === id);
};