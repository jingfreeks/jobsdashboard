import { apiSlice } from '@/config/apiSplice';

// Type definitions
export interface City {
  _id: string;
  name: string;
  stateId?: string;
  statename?: string;
  image?: string;
}

export interface CityFormData {
  name: string;
  stateId?: string;
  image?: string;
}

export interface UpdateCityData {
  _id: string;
  name: string;
  stateId?: string;
  image?: File;
}

export const cityApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query<City[], void>({
      query: () => '/city',
      transformResponse: (response: City[]) => {
        // Sort cities alphabetically by name
        return response.sort((a, b) => a.name.localeCompare(b.name));
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      providesTags: ['City'] as any,
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),
    addCity: builder.mutation<City, CityFormData>({
      query: (credentials) => ({
        url: '/city',
        method: 'POST',
        body: credentials,
      }),
      // Optimistic update
      async onQueryStarted({ name }, { dispatch, queryFulfilled }) {
        if (!name) return; // Guard against null/undefined name
        const patchResult = dispatch(
          cityApiSlice.util.updateQueryData('getCities', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cities = draft as any;
            const tempId = `temp-${Date.now()}`;
            cities.push({ _id: tempId, name });
            cities.sort((a: City, b: City) => a.name.localeCompare(b.name));
          })
        );

        try {
          const { data: newCity } = await queryFulfilled;
          // Replace temporary city with server response
          dispatch(
            cityApiSlice.util.updateQueryData('getCities', undefined, (draft) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const cities = draft as any;
              const index = cities.findIndex((c: City) => c._id.startsWith('temp-'));
              if (index !== -1) {
                cities[index] = newCity;
                cities.sort((a: City, b: City) => a.name.localeCompare(b.name));
              }
            })
          );
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invalidatesTags: ['City'] as any,
    }),
    updateCity: builder.mutation<City, UpdateCityData>({
      query: (credentials) => ({
        url: '/city',
        method: 'PATCH',
        body: credentials,
      }),
      // Optimistic update
      async onQueryStarted({ _id, name }, { dispatch, queryFulfilled }) {
        if (!_id || !name) return; // Guard against null/undefined values
        const patchResult = dispatch(
          cityApiSlice.util.updateQueryData('getCities', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cities = draft as any;
            const city = cities.find((c: City) => c._id === _id);
            if (city) {
              city.name = name;
              cities.sort((a: City, b: City) => a.name.localeCompare(b.name));
            }
          })
        );

        try {
          const { data: updatedCity } = await queryFulfilled;
          // Update with server response to ensure canonical data
          dispatch(
            cityApiSlice.util.updateQueryData('getCities', undefined, (draft) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const cities = draft as any;
              const index = cities.findIndex((c: City) => c._id === _id);
              if (index !== -1) {
                cities[index] = updatedCity;
                cities.sort((a: City, b: City) => a.name.localeCompare(b.name));
              }
            })
          );
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invalidatesTags: ['City'] as any,
    }),
    deleteCity: builder.mutation<{ success: boolean }, { _id: string }>({
      query: (credentials) => ({
        url: '/city',
        method: 'DELETE',
        body: credentials,
      }),
      // Optimistic update
      async onQueryStarted({ _id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cityApiSlice.util.updateQueryData('getCities', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cities = draft as any;
            const index = cities.findIndex((c: City) => c._id === _id);
            if (index !== -1) {
              cities.splice(index, 1);
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
      invalidatesTags: ['City'] as any,
    }),
    uploadImage: builder.mutation<{ url: string }, { file: File }>({
      query: credentials => {
        const formData = new FormData();
        console.log('credentials', credentials);
        formData.append('avatar', credentials.file);
        return {
          url: '/upload',
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCitiesQuery,
  useAddCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
  useUploadImageMutation,
} = cityApiSlice;