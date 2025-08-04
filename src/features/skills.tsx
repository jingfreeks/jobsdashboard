import { apiSlice } from '@/config/apiSplice';

// Types
export interface Skill {
  _id: string;
  name: string;
}

export interface SkillFormData {
  name: string;
}

export interface UpdateSkillData extends SkillFormData {
  _id: string;
}

// API slice with performance optimizations and optimistic updates
export const skillsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSkills: builder.query<Skill[], void>({
      query: () => '/admin/skill',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      providesTags: ['Skill'] as any,
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
      // Transform and sort data for better performance
      transformResponse: (response: Skill[]) => {
        return response.sort((a, b) => a.name.localeCompare(b.name));
      },
    }),
    addSkill: builder.mutation<Skill, SkillFormData>({
      query: (credentials) => ({
        url: '/admin/skill',
        method: 'POST',
        body: credentials,
      }),
      // Optimistic update for better UX
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
        const tempId = `temp-${Date.now()}`;
        const optimisticSkill: Skill = {
          _id: tempId,
          name: credentials.name || '',
        };

        const patchResult = dispatch(
          skillsApiSlice.util.updateQueryData('getSkills', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const skills = draft as any;
            skills.push(optimisticSkill);
            skills.sort((a: Skill, b: Skill) => a.name.localeCompare(b.name));
          })
        );

        try {
          const { data: newSkill } = await queryFulfilled;
          // Update with real data from server
          dispatch(
            skillsApiSlice.util.updateQueryData('getSkills', undefined, (draft) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const skills = draft as any;
              const index = skills.findIndex((skill: Skill) => skill._id === tempId);
              if (index !== -1) {
                skills[index] = newSkill;
              }
            })
          );
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invalidatesTags: ['Skill'] as any,
    }),
    updateSkill: builder.mutation<Skill, UpdateSkillData>({
      query: (credentials) => ({
        url: '/admin/skill',
        method: 'PATCH',
        body: credentials,
      }),
      // Optimistic update
      async onQueryStarted({ _id, name }, { dispatch, queryFulfilled }) {
        if (!_id || !name) return; // Guard against null/undefined values
        const patchResult = dispatch(
          skillsApiSlice.util.updateQueryData('getSkills', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const skills = draft as any;
            const skill = skills.find((s: Skill) => s._id === _id);
            if (skill) {
              skill.name = name;
              skills.sort((a: Skill, b: Skill) => a.name.localeCompare(b.name));
            }
          })
        );

        try {
          const { data: updatedSkill } = await queryFulfilled;
          // Update with server response to ensure canonical data
          dispatch(
            skillsApiSlice.util.updateQueryData('getSkills', undefined, (draft) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const skills = draft as any;
              const index = skills.findIndex((s: Skill) => s._id === _id);
              if (index !== -1) {
                skills[index] = updatedSkill;
                skills.sort((a: Skill, b: Skill) => a.name.localeCompare(b.name));
              }
            })
          );
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invalidatesTags: ['Skill'] as any,
    }),
    deleteSkill: builder.mutation<void, { _id: string }>({
      query: (credentials) => ({
        url: '/admin/skill',
        method: 'DELETE',
        body: credentials,
      }),
      // Optimistic update
      async onQueryStarted({ _id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          skillsApiSlice.util.updateQueryData('getSkills', undefined, (draft) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const skills = draft as any;
            const index = skills.findIndex((skill: Skill) => skill._id === _id);
            if (index !== -1) {
              skills.splice(index, 1);
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
      invalidatesTags: ['Skill'] as any,
    }),
  }),
  overrideExisting: true,
});

// Export hooks
export const {
  useGetSkillsQuery,
  useAddSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} = skillsApiSlice;

// Performance-optimized selectors
export const selectSkillsSorted = (data: Skill[] | undefined) => {
  if (!data) return [];
  return [...data].sort((a, b) => a.name.localeCompare(b.name));
};

export const selectSkillById = (data: Skill[] | undefined, id: string) => {
  if (!data) return undefined;
  return data.find(skill => skill._id === id);
};