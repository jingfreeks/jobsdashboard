import { useCallback, useMemo } from 'react';
import { useGetSkillsQuery, useAddSkillMutation, useUpdateSkillMutation, useDeleteSkillMutation } from '@/features/skills';
import type { Skill, SkillFormData, UpdateSkillData } from '@/features/skills';

export const useSkillsOperations = () => {
  // API hooks
  const { 
    data: skills = [], 
    isLoading, 
    error, 
    refetch 
  } = useGetSkillsQuery(undefined) as { 
    data: Skill[]; 
    isLoading: boolean; 
    error: unknown;
    refetch: () => void;
  };

  const [addSkill, { isLoading: isAdding }] = useAddSkillMutation();
  const [updateSkill, { isLoading: isUpdating }] = useUpdateSkillMutation();
  const [deleteSkill, { isLoading: isDeleting }] = useDeleteSkillMutation();

  // Memoized sorted skills for better performance
  const sortedSkills = useMemo(() => {
    return [...skills].sort((a, b) => a.name.localeCompare(b.name));
  }, [skills]);

  // Memoized skill lookup for O(1) access
  const skillMap = useMemo(() => {
    return new Map(skills.map(skill => [skill._id, skill]));
  }, [skills]);

  // Optimized skill operations
  const createSkill = useCallback(async (data: SkillFormData): Promise<Skill | null> => {
    try {
      const result = await addSkill(data).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to create skill:', error);
      return null;
    }
  }, [addSkill]);

  const updateSkillById = useCallback(async (data: UpdateSkillData): Promise<Skill | null> => {
    try {
      const result = await updateSkill(data).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to update skill:', error);
      return null;
    }
  }, [updateSkill]);

  const deleteSkillById = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteSkill({ _id: id }).unwrap();
      return true;
    } catch (error) {
      console.error('Failed to delete skill:', error);
      return false;
    }
  }, [deleteSkill]);

  // Utility functions
  const getSkillById = useCallback((id: string): Skill | undefined => {
    return skillMap.get(id);
  }, [skillMap]);

  const searchSkills = useCallback((query: string): Skill[] => {
    if (!query.trim()) return sortedSkills;
    const lowerQuery = query.toLowerCase();
    return sortedSkills.filter(skill => 
      skill.name.toLowerCase().includes(lowerQuery)
    );
  }, [sortedSkills]);

  return {
    // Data
    skills: sortedSkills,
    isLoading,
    error,
    
    // Loading states
    isAdding,
    isUpdating,
    isDeleting,
    
    // Operations
    createSkill,
    updateSkillById,
    deleteSkillById,
    refetch,
    
    // Utilities
    getSkillById,
    searchSkills,
  };
}; 