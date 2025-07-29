import { useCallback, useMemo } from 'react';
import { useGetBanksQuery, useAddBankMutation, useUpdateBankMutation, useDeleteBankMutation } from '@/features/bank';
import type { Bank, BankFormData, UpdateBankData } from '@/features/bank';

export const useBankOperations = () => {
  // API hooks
  const { 
    data: banks = [], 
    isLoading, 
    error, 
    refetch 
  } = useGetBanksQuery(undefined) as { 
    data: Bank[]; 
    isLoading: boolean; 
    error: unknown;
    refetch: () => void;
  };

  const [addBank, { isLoading: isAdding }] = useAddBankMutation();
  const [updateBank, { isLoading: isUpdating }] = useUpdateBankMutation();
  const [deleteBank, { isLoading: isDeleting }] = useDeleteBankMutation();

  // Memoized sorted banks for better performance
  const sortedBanks = useMemo(() => {
    return [...banks].sort((a, b) => a.name.localeCompare(b.name));
  }, [banks]);

  // Memoized bank lookup for O(1) access
  const bankMap = useMemo(() => {
    return new Map(banks.map(bank => [bank._id, bank]));
  }, [banks]);

  // Optimized bank operations
  const createBank = useCallback(async (data: BankFormData): Promise<Bank | null> => {
    try {
      const result = await addBank(data).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to create bank:', error);
      return null;
    }
  }, [addBank]);

  const updateBankById = useCallback(async (data: UpdateBankData): Promise<Bank | null> => {
    try {
      const result = await updateBank(data).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to update bank:', error);
      return null;
    }
  }, [updateBank]);

  const deleteBankById = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteBank({ _id: id }).unwrap();
      return true;
    } catch (error) {
      console.error('Failed to delete bank:', error);
      return false;
    }
  }, [deleteBank]);

  // Utility functions
  const getBankById = useCallback((id: string): Bank | undefined => {
    return bankMap.get(id);
  }, [bankMap]);

  const searchBanks = useCallback((query: string): Bank[] => {
    if (!query.trim()) return sortedBanks;
    const lowerQuery = query.toLowerCase();
    return sortedBanks.filter(bank => 
      bank.name.toLowerCase().includes(lowerQuery)
    );
  }, [sortedBanks]);

  return {
    // Data
    banks: sortedBanks,
    isLoading,
    error,
    
    // Loading states
    isAdding,
    isUpdating,
    isDeleting,
    
    // Operations
    createBank,
    updateBankById,
    deleteBankById,
    refetch,
    
    // Utilities
    getBankById,
    searchBanks,
  };
}; 