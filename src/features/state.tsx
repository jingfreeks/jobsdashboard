import { apiSlice } from '@/config/apiSplice';

export interface State {
  _id: string;
  name: string;
}

export interface StateFormData {
  name: string;
}

export interface UpdateStateData {
  _id: string;
  name: string;
}

export const stateApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStates: builder.query<State[], void>({
      query: () => '/states',
      transformResponse: (response: State[]) => response.sort((a, b) => a.name.localeCompare(b.name)),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      providesTags: ['State'] as any,
      keepUnusedDataFor: 300,
    }),
    addState: builder.mutation<State, StateFormData>({
      query: (credentials) => ({
        url: '/states',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted({ name }, { dispatch, queryFulfilled }) {
        if (!name) return; // Guard against null/undefined name
        const tempId = `temp-${Date.now()}`;
        const optimisticState: State = { _id: tempId, name };
        const patchResult = dispatch(
          stateApiSlice.util.updateQueryData('getStates', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const states = draft as any;
            states.push(optimisticState);
            states.sort((a: State, b: State) => a.name.localeCompare(b.name));
          })
        );
        try {
          const { data: newState } = await queryFulfilled;
          dispatch(
            stateApiSlice.util.updateQueryData('getStates', undefined, (draft) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const states = draft as any;
              const index = states.findIndex((state: State) => state._id === tempId);
              if (index !== -1) {
                states[index] = newState;
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invalidatesTags: ['State'] as any,
    }),
    updateState: builder.mutation<State, UpdateStateData>({
      query: (credentials) => ({
        url: '/states',
        method: 'PATCH',
        body: credentials,
      }),
      async onQueryStarted({ _id, name }, { dispatch, queryFulfilled }) {
        if (!_id || !name) return; // Guard against null/undefined values
        const patchResult = dispatch(
          stateApiSlice.util.updateQueryData('getStates', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const states = draft as any;
            const state = states.find((s: State) => s._id === _id);
            if (state) {
              state.name = name;
              states.sort((a: State, b: State) => a.name.localeCompare(b.name));
            }
          })
        );
        try {
          const { data: updatedState } = await queryFulfilled;
          dispatch(
            stateApiSlice.util.updateQueryData('getStates', undefined, (draft) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const states = draft as any;
              const index = states.findIndex((s: State) => s._id === _id);
              if (index !== -1) {
                states[index] = updatedState;
                states.sort((a: State, b: State) => a.name.localeCompare(b.name));
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invalidatesTags: ['State'] as any,
    }),
    deleteState: builder.mutation<void, { _id: string }>({
      query: (credentials) => ({
        url: '/states',
        method: 'DELETE',
        body: credentials,
      }),
      async onQueryStarted({ _id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          stateApiSlice.util.updateQueryData('getStates', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const states = draft as any;
            const index = states.findIndex((s: State) => s._id === _id);
            if (index !== -1) {
              states.splice(index, 1);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invalidatesTags: ['State'] as any,
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetStatesQuery,
  useAddStateMutation,
  useUpdateStateMutation,
  useDeleteStateMutation,
} = stateApiSlice;
