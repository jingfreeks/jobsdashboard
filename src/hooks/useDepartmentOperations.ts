import { useMemo } from 'react';
import {
  useGetDepartmentsQuery,
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  selectDepartmentsSorted,
  selectDepartmentById,
  type Department,
  type DepartmentFormData,
  type UpdateDepartmentData,
} from '@/features/department';

export const useDepartmentOperations = () => {
  const {
    data: departments = [],
    isLoading,
    error,
    refetch,
  } = useGetDepartmentsQuery();

  const [addDepartment, { isLoading: isAdding }] = useAddDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();
  const [deleteDepartment, { isLoading: isDeleting }] = useDeleteDepartmentMutation();

  // Memoized sorted departments for performance
  const sortedDepartments = useMemo(() => selectDepartmentsSorted(departments), [departments]);

  // Memoized department map for quick lookups
  const departmentMap = useMemo(() => {
    const map = new Map<string, Department>();
    departments.forEach(dept => map.set(dept._id, dept));
    return map;
  }, [departments]);

  // Create a new department
  const createDepartment = async (departmentData: DepartmentFormData): Promise<Department | null> => {
    try {
      const result = await addDepartment(departmentData).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to create department:', error);
      throw error;
    }
  };

  // Update an existing department
  const updateDepartmentById = async (departmentData: UpdateDepartmentData): Promise<Department | null> => {
    try {
      const result = await updateDepartment(departmentData).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to update department:', error);
      throw error;
    }
  };

  // Delete a department
  const deleteDepartmentById = async (id: string): Promise<void> => {
    try {
      await deleteDepartment({ _id: id }).unwrap();
    } catch (error) {
      console.error('Failed to delete department:', error);
      throw error;
    }
  };

  // Get a department by ID
  const getDepartmentById = (id: string): Department | undefined => {
    return selectDepartmentById(departments, id);
  };

  // Search departments by name
  const searchDepartments = (searchTerm: string): Department[] => {
    if (!searchTerm.trim()) return sortedDepartments;
    const term = searchTerm.toLowerCase();
    return sortedDepartments.filter(dept => 
      dept.name.toLowerCase().includes(term)
    );
  };

  return {
    // Data
    departments: sortedDepartments,
    departmentMap,
    
    // Loading states
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    
    // Error state
    error,
    
    // Operations
    createDepartment,
    updateDepartmentById,
    deleteDepartmentById,
    getDepartmentById,
    searchDepartments,
    
    // Utilities
    refetch,
  };
}; 