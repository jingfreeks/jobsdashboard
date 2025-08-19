import { useMemo } from 'react';
import { useGetShiftsQuery, useCreateShiftMutation, useUpdateShiftMutation, useDeleteShiftMutation } from '@/features/shift';
import type { Shift, ShiftFormData, UpdateShiftData, DeleteShiftData } from '@/features/shift';

export const useShiftOperations = () => {
  // RTK Query hooks
  const { data: shifts = [], isLoading, error } = useGetShiftsQuery();
  const [createShift, { isLoading: isAdding }] = useCreateShiftMutation();
  //const [updateShiftById, { isLoading: isUpdatingById }] = useUpdateShiftByIdMutation();
  const [updateShift, { isLoading: isUpdating }] = useUpdateShiftMutation();
  //const [deleteShiftById, { isLoading: isDeletingById }] = useDeleteShiftByIdMutation();
  const [deleteShift, { isLoading: isDeleting }] = useDeleteShiftMutation();

  // Memoized sorted shifts for better performance
  const sortedShifts = useMemo(() => {
    return [...shifts].sort((a, b) => a.title.localeCompare(b.title));
  }, [shifts]);

  const arrangeSortedShifts = useMemo(() => {
    return sortedShifts.map(shift => ({
      _id: shift._id,
      title: shift.title,
      name: shift.title,
    }));
  }, [sortedShifts]);
  // Memoized shift map for quick lookups
  const shiftMap = useMemo(() => {
    return new Map(shifts.map(shift => [shift._id, shift]));
  }, [shifts]);

  // Helper function to get shift by ID
  const getShiftById = (id: string): Shift | undefined => {
    return shiftMap.get(id);
  };

  // Create shift wrapper
  const createShiftOperation = async (shiftData: ShiftFormData): Promise<boolean> => {
    try {
      await createShift(shiftData).unwrap();
      return true;
    } catch (error) {
      console.error('Error creating shift:', error);
      return false;
    }
  };

  // Update shift by ID wrapper
  // const updateShiftByIdOperation = async (shiftData: UpdateShiftData): Promise<boolean> => {
  //   try {
  //     await updateShiftById(shiftData).unwrap();
  //     return true;
  //   } catch (error) {
  //     console.error('Error updating shift by ID:', error);
  //     return false;
  //   }
  // };

  // Update shift without ID wrapper
  const updateShiftOperation = async (shiftData: UpdateShiftData): Promise<boolean> => {
    try {
      await updateShift(shiftData).unwrap();
      return true;
    } catch (error) {
      console.error('Error updating shift:', error);
      return false;
    }
  };

  // Delete shift by ID wrapper
  // const deleteShiftByIdOperation = async (shiftData: DeleteShiftData): Promise<boolean> => {
  //   try {
  //     await deleteShiftById(shiftData).unwrap();
  //     return true;
  //   } catch (error) {
  //     console.error('Error deleting shift by ID:', error);
  //     return false;
  //   }
  // };

  // Delete shift without ID wrapper
  const deleteShiftOperation = async (shiftData: DeleteShiftData): Promise<boolean> => {
    try {
      await deleteShift(shiftData).unwrap();
      return true;
    } catch (error) {
      console.error('Error deleting shift:', error);
      return false;
    }
  };

  return {
    // Data
    shifts: arrangeSortedShifts,
    //shiftMap,
    
    // Loading states
    isLoading,
    isAdding,
    isUpdating: isUpdating,  // Combined loading state for both update operations
    isDeleting: isDeleting, // Combined loading state for both delete operations
    
    // Error state
    error,
    
    // Operations
    createShift: createShiftOperation,
    //updateShiftById: updateShiftByIdOperation,
    updateShift: updateShiftOperation,
    //deleteShiftById: deleteShiftByIdOperation,
    deleteShift: deleteShiftOperation,
    
    // Helper functions
    getShiftById,
  };
}; 