import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/config/apiSplice';
import type { Skill } from '@/features/skills';

// Mock console.error to avoid noise in tests
const mockConsoleError = vi.fn();

// Sample skills data for testing
const mockSkills: Skill[] = [
  { _id: '1', name: 'JavaScript' },
  { _id: '2', name: 'React' },
  { _id: '3', name: 'Node.js' },
  { _id: '4', name: 'TypeScript' },
  { _id: '5', name: 'Python' },
];

// Mock functions
const mockAddSkill = vi.fn();
const mockUpdateSkill = vi.fn();
const mockDeleteSkill = vi.fn();
const mockRefetch = vi.fn();

// Mock the skills API slice
vi.mock('@/features/skills', () => ({
  useGetSkillsQuery: vi.fn(() => ({
    data: mockSkills,
    isLoading: false,
    error: null,
    refetch: mockRefetch,
  })),
  useAddSkillMutation: vi.fn(() => [
    mockAddSkill,
    { isLoading: false }
  ]),
  useUpdateSkillMutation: vi.fn(() => [
    mockUpdateSkill,
    { isLoading: false }
  ]),
  useDeleteSkillMutation: vi.fn(() => [
    mockDeleteSkill,
    { isLoading: false }
  ]),
}));

// Create a test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
};

describe('useSkillsOperations', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(mockConsoleError);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Hook Structure', () => {
    it('should return all expected properties and functions', async () => {
      const { useSkillsOperations } = await import('../useSkillsOperations');
      
      const { result } = renderHook(() => useSkillsOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      // Data properties
      expect(result.current.skills).toBeDefined();
      expect(result.current.isLoading).toBeDefined();
      expect(result.current.error).toBeDefined();
      
      // Loading states
      expect(result.current.isAdding).toBeDefined();
      expect(result.current.isUpdating).toBeDefined();
      expect(result.current.isDeleting).toBeDefined();
      
      // Operations
      expect(result.current.createSkill).toBeDefined();
      expect(result.current.updateSkillById).toBeDefined();
      expect(result.current.deleteSkillById).toBeDefined();
      expect(result.current.refetch).toBeDefined();
      
      // Utilities
      expect(result.current.getSkillById).toBeDefined();
      expect(result.current.searchSkills).toBeDefined();
    });

    it('should return functions for all operations', async () => {
      const { useSkillsOperations } = await import('../useSkillsOperations');
      
      const { result } = renderHook(() => useSkillsOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      expect(typeof result.current.createSkill).toBe('function');
      expect(typeof result.current.updateSkillById).toBe('function');
      expect(typeof result.current.deleteSkillById).toBe('function');
      expect(typeof result.current.refetch).toBe('function');
      expect(typeof result.current.getSkillById).toBe('function');
      expect(typeof result.current.searchSkills).toBe('function');
    });
  });

  describe('Data and Loading States', () => {
    it('should return sorted skills data', async () => {
      const { useSkillsOperations } = await import('../useSkillsOperations');
      
      const { result } = renderHook(() => useSkillsOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      expect(Array.isArray(result.current.skills)).toBe(true);
      expect(result.current.skills.length).toBe(5);
      
      // Check that skills are sorted alphabetically
      const skillNames = result.current.skills.map(skill => skill.name);
      expect(skillNames).toEqual([
        'JavaScript',
        'Node.js',
        'Python',
        'React',
        'TypeScript'
      ]);
    });

    it('should return loading states', async () => {
      const { useSkillsOperations } = await import('../useSkillsOperations');
      
      const { result } = renderHook(() => useSkillsOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.isAdding).toBe('boolean');
      expect(typeof result.current.isUpdating).toBe('boolean');
      expect(typeof result.current.isDeleting).toBe('boolean');
    });

    it('should return error state', async () => {
      const { useSkillsOperations } = await import('../useSkillsOperations');
      
      const { result } = renderHook(() => useSkillsOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('Skill Operations', () => {
    describe('createSkill', () => {
      it('should successfully create a skill', async () => {
        const newSkill = { name: 'Vue.js' };
        const createdSkill = { _id: '6', ...newSkill };
        
        mockAddSkill.mockReturnValue({
          unwrap: vi.fn().mockResolvedValue(createdSkill)
        });

        const { useSkillsOperations } = await import('../useSkillsOperations');
        
        const { result } = renderHook(() => useSkillsOperations(), {
          wrapper: ({ children }) => (
            <Provider store={store}>
              {children}
            </Provider>
          ),
        });

        const response = await result.current.createSkill(newSkill);
        
        expect(mockAddSkill).toHaveBeenCalledWith(newSkill);
        expect(response).toEqual(createdSkill);
        expect(mockConsoleError).not.toHaveBeenCalled();
      });

      it('should handle create skill error', async () => {
        const newSkill = { name: 'Vue.js' };
        const error = new Error('Failed to create skill');
        
        mockAddSkill.mockReturnValue({
          unwrap: vi.fn().mockRejectedValue(error)
        });

        const { useSkillsOperations } = await import('../useSkillsOperations');
        
        const { result } = renderHook(() => useSkillsOperations(), {
          wrapper: ({ children }) => (
            <Provider store={store}>
              {children}
            </Provider>
          ),
        });

        const response = await result.current.createSkill(newSkill);
        
        expect(mockAddSkill).toHaveBeenCalledWith(newSkill);
        expect(response).toBeNull();
        expect(mockConsoleError).toHaveBeenCalledWith('Failed to create skill:', error);
      });
    });

    describe('updateSkillById', () => {
      it('should successfully update a skill', async () => {
        const updateData = { _id: '1', name: 'JavaScript ES6' };
        const updatedSkill = { ...updateData };
        
        mockUpdateSkill.mockReturnValue({
          unwrap: vi.fn().mockResolvedValue(updatedSkill)
        });

        const { useSkillsOperations } = await import('../useSkillsOperations');
        
        const { result } = renderHook(() => useSkillsOperations(), {
          wrapper: ({ children }) => (
            <Provider store={store}>
              {children}
            </Provider>
          ),
        });

        const response = await result.current.updateSkillById(updateData);
        
        expect(mockUpdateSkill).toHaveBeenCalledWith(updateData);
        expect(response).toEqual(updatedSkill);
        expect(mockConsoleError).not.toHaveBeenCalled();
      });

      it('should handle update skill error', async () => {
        const updateData = { _id: '1', name: 'JavaScript ES6' };
        const error = new Error('Failed to update skill');
        
        mockUpdateSkill.mockReturnValue({
          unwrap: vi.fn().mockRejectedValue(error)
        });

        const { useSkillsOperations } = await import('../useSkillsOperations');
        
        const { result } = renderHook(() => useSkillsOperations(), {
          wrapper: ({ children }) => (
            <Provider store={store}>
              {children}
            </Provider>
          ),
        });

        const response = await result.current.updateSkillById(updateData);
        
        expect(mockUpdateSkill).toHaveBeenCalledWith(updateData);
        expect(response).toBeNull();
        expect(mockConsoleError).toHaveBeenCalledWith('Failed to update skill:', error);
      });
    });

    describe('deleteSkillById', () => {
      it('should successfully delete a skill', async () => {
        const skillId = '1';
        
        mockDeleteSkill.mockReturnValue({
          unwrap: vi.fn().mockResolvedValue({ success: true })
        });

        const { useSkillsOperations } = await import('../useSkillsOperations');
        
        const { result } = renderHook(() => useSkillsOperations(), {
          wrapper: ({ children }) => (
            <Provider store={store}>
              {children}
            </Provider>
          ),
        });

        const response = await result.current.deleteSkillById(skillId);
        
        expect(mockDeleteSkill).toHaveBeenCalledWith({ _id: skillId });
        expect(response).toBe(true);
        expect(mockConsoleError).not.toHaveBeenCalled();
      });

      it('should handle delete skill error', async () => {
        const skillId = '1';
        const error = new Error('Failed to delete skill');
        
        mockDeleteSkill.mockReturnValue({
          unwrap: vi.fn().mockRejectedValue(error)
        });

        const { useSkillsOperations } = await import('../useSkillsOperations');
        
        const { result } = renderHook(() => useSkillsOperations(), {
          wrapper: ({ children }) => (
            <Provider store={store}>
              {children}
            </Provider>
          ),
        });

        const response = await result.current.deleteSkillById(skillId);
        
        expect(mockDeleteSkill).toHaveBeenCalledWith({ _id: skillId });
        expect(response).toBe(false);
        expect(mockConsoleError).toHaveBeenCalledWith('Failed to delete skill:', error);
      });
    });
  });

  describe('Utility Functions', () => {
    describe('getSkillById', () => {
      it('should return skill by ID', async () => {
        const { useSkillsOperations } = await import('../useSkillsOperations');
        
        const { result } = renderHook(() => useSkillsOperations(), {
          wrapper: ({ children }) => (
            <Provider store={store}>
              {children}
            </Provider>
          ),
        });

        const skill = result.current.getSkillById('1');
        expect(skill).toEqual({ _id: '1', name: 'JavaScript' });
      });

      it('should return undefined for non-existent ID', async () => {
        const { useSkillsOperations } = await import('../useSkillsOperations');
        
        const { result } = renderHook(() => useSkillsOperations(), {
          wrapper: ({ children }) => (
            <Provider store={store}>
              {children}
            </Provider>
          ),
        });

        const skill = result.current.getSkillById('999');
        expect(skill).toBeUndefined();
      });
    });

    describe('searchSkills', () => {
      it('should return all skills when query is empty', async () => {
        const { useSkillsOperations } = await import('../useSkillsOperations');
        
        const { result } = renderHook(() => useSkillsOperations(), {
          wrapper: ({ children }) => (
            <Provider store={store}>
              {children}
            </Provider>
          ),
        });

        const skills = result.current.searchSkills('');
        expect(skills).toHaveLength(5);
        expect(skills).toEqual(result.current.skills);
      });

      it('should return filtered skills for exact match', async () => {
        const { useSkillsOperations } = await import('../useSkillsOperations');
        
        const { result } = renderHook(() => useSkillsOperations(), {
          wrapper: ({ children }) => (
            <Provider store={store}>
              {children}
            </Provider>
          ),
        });

        const skills = result.current.searchSkills('JavaScript');
        expect(skills).toHaveLength(1);
        expect(skills[0].name).toBe('JavaScript');
      });

      it('should return filtered skills for partial match', async () => {
        const { useSkillsOperations } = await import('../useSkillsOperations');
        
        const { result } = renderHook(() => useSkillsOperations(), {
          wrapper: ({ children }) => (
            <Provider store={store}>
              {children}
            </Provider>
          ),
        });

        const skills = result.current.searchSkills('Script');
        expect(skills).toHaveLength(2); // JavaScript and TypeScript
        expect(skills.map(skill => skill.name)).toEqual(['JavaScript', 'TypeScript']);
      });

      it('should return filtered skills for case-insensitive search', async () => {
        const { useSkillsOperations } = await import('../useSkillsOperations');
        
        const { result } = renderHook(() => useSkillsOperations(), {
          wrapper: ({ children }) => (
            <Provider store={store}>
              {children}
            </Provider>
          ),
        });

        const skills = result.current.searchSkills('javascript');
        expect(skills).toHaveLength(1);
        expect(skills[0].name).toBe('JavaScript');
      });

      it('should return empty array for non-matching query', async () => {
        const { useSkillsOperations } = await import('../useSkillsOperations');
        
        const { result } = renderHook(() => useSkillsOperations(), {
          wrapper: ({ children }) => (
            <Provider store={store}>
              {children}
            </Provider>
          ),
        });

        const skills = result.current.searchSkills('NonExistent');
        expect(skills).toHaveLength(0);
      });
    });
  });

  describe('Refetch Function', () => {
    it('should call refetch function', async () => {
      const { useSkillsOperations } = await import('../useSkillsOperations');
      
      const { result } = renderHook(() => useSkillsOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      result.current.refetch();
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network error');
      
      mockAddSkill.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue(networkError)
      });

      const { useSkillsOperations } = await import('../useSkillsOperations');
      
      const { result } = renderHook(() => useSkillsOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const response = await result.current.createSkill({ name: 'Test Skill' });
      
      expect(response).toBeNull();
      expect(mockConsoleError).toHaveBeenCalledWith('Failed to create skill:', networkError);
    });

    it('should handle server errors gracefully', async () => {
      const serverError = { status: 500, data: { message: 'Internal server error' } };
      
      mockUpdateSkill.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue(serverError)
      });

      const { useSkillsOperations } = await import('../useSkillsOperations');
      
      const { result } = renderHook(() => useSkillsOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const response = await result.current.updateSkillById({ _id: '1', name: 'Updated Skill' });
      
      expect(response).toBeNull();
      expect(mockConsoleError).toHaveBeenCalledWith('Failed to update skill:', serverError);
    });

    it('should handle timeout errors gracefully', async () => {
      const timeoutError = new Error('Request timeout');
      
      mockDeleteSkill.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue(timeoutError)
      });

      const { useSkillsOperations } = await import('../useSkillsOperations');
      
      const { result } = renderHook(() => useSkillsOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>
            {children}
          </Provider>
        ),
      });

      const response = await result.current.deleteSkillById('1');
      
      expect(response).toBe(false);
      expect(mockConsoleError).toHaveBeenCalledWith('Failed to delete skill:', timeoutError);
    });
  });
}); 