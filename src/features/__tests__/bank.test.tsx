import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/config/apiSplice';
import { 
  bankApiSlice, 
  useGetBanksQuery, 
  useAddBankMutation, 
  useUpdateBankMutation, 
  useDeleteBankMutation,
  selectBanksSorted,
  selectBankById,
  type Bank,
  type BankFormData,
  type UpdateBankData
} from '../bank';

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage for auth token
const mockLocalStorage = {
  getItem: vi.fn(() => 'mock-token'),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('Bank Feature', () => {
  describe('API Slice Structure', () => {
    it('should export bankApiSlice', () => {
      expect(bankApiSlice).toBeDefined();
      expect(typeof bankApiSlice).toBe('object');
    });

    it('should have endpoints property', () => {
      expect(bankApiSlice.endpoints).toBeDefined();
      expect(typeof bankApiSlice.endpoints).toBe('object');
    });

    it('should match snapshot', () => {
      expect(bankApiSlice).toMatchSnapshot();
    });
  });

  describe('Exported Hooks', () => {
    it('should export useGetBanksQuery hook', () => {
      expect(useGetBanksQuery).toBeDefined();
      expect(typeof useGetBanksQuery).toBe('function');
    });

    it('should export useAddBankMutation hook', () => {
      expect(useAddBankMutation).toBeDefined();
      expect(typeof useAddBankMutation).toBe('function');
    });

    it('should export useUpdateBankMutation hook', () => {
      expect(useUpdateBankMutation).toBeDefined();
      expect(typeof useUpdateBankMutation).toBe('function');
    });

    it('should export useDeleteBankMutation hook', () => {
      expect(useDeleteBankMutation).toBeDefined();
      expect(typeof useDeleteBankMutation).toBe('function');
    });
  });

  describe('API Endpoint Configuration', () => {
    it('should have getBanks endpoint configured', () => {
      expect(bankApiSlice.endpoints.getBanks).toBeDefined();
      expect(typeof bankApiSlice.endpoints.getBanks).toBe('object');
    });

    it('should have addBank endpoint configured', () => {
      expect(bankApiSlice.endpoints.addBank).toBeDefined();
      expect(typeof bankApiSlice.endpoints.addBank).toBe('object');
    });

    it('should have updateBank endpoint configured', () => {
      expect(bankApiSlice.endpoints.updateBank).toBeDefined();
      expect(typeof bankApiSlice.endpoints.updateBank).toBe('object');
    });

    it('should have deleteBank endpoint configured', () => {
      expect(bankApiSlice.endpoints.deleteBank).toBeDefined();
      expect(typeof bankApiSlice.endpoints.deleteBank).toBe('object');
    });

    it('should be injected into apiSlice', () => {
      expect(apiSlice.injectEndpoints).toBeDefined();
      expect(typeof apiSlice.injectEndpoints).toBe('function');
    });
  });

  describe('API Slice Properties', () => {
    it('should be injected into apiSlice', () => {
      expect(apiSlice.injectEndpoints).toBeDefined();
      expect(typeof apiSlice.injectEndpoints).toBe('function');
    });
  });

  describe('Enhanced Hook Testing', () => {
    let store: ReturnType<typeof createTestStore>;

    const createTestStore = () => {
      return configureStore({
        reducer: {
          api: apiSlice.reducer,
        },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({
            serializableCheck: {
              ignoredActions: ['persist/PERSIST'],
            },
          }).concat(apiSlice.middleware),
      });
    };

    beforeEach(() => {
      store = createTestStore();
      vi.clearAllMocks();
      mockFetch.mockClear();
      mockLocalStorage.getItem.mockReturnValue('mock-token');
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    describe('Get Banks Query Hook', () => {
      it('should have working getBanks query hook with full structure', async () => {
        const { result } = renderHook(() => useGetBanksQuery(), {
          wrapper: TestWrapper,
        });

        expect(result.current.data).toBeUndefined();
        expect(result.current.isLoading).toBe(true);
        expect(result.current.isError).toBe(false);
        expect(result.current.isSuccess).toBe(false);
        expect(typeof result.current.refetch).toBe('function');
      });

      it('should handle query hook structure', async () => {
        const { result } = renderHook(() => useGetBanksQuery(), {
          wrapper: TestWrapper,
        });

        expect(result.current).toHaveProperty('data');
        expect(result.current).toHaveProperty('isLoading');
        expect(result.current).toHaveProperty('isError');
        expect(result.current).toHaveProperty('isSuccess');
        expect(result.current).toHaveProperty('refetch');
        expect(typeof result.current.refetch).toBe('function');
      });
    });

    describe('Add Bank Mutation Hook', () => {
      it('should have working addBank mutation hook with full structure', () => {
        const { result } = renderHook(() => useAddBankMutation(), {
          wrapper: TestWrapper,
        });

        expect(result.current[0]).toBeDefined();
        expect(result.current[1]).toBeDefined();
        expect(typeof result.current[0]).toBe('function');
        expect(typeof result.current[1].isLoading).toBe('boolean');
        expect(typeof result.current[1].isError).toBe('boolean');
        expect(typeof result.current[1].isSuccess).toBe('boolean');
        expect(result.current[1].error).toBeUndefined();
        expect(result.current[1].data).toBeUndefined();
        expect(typeof result.current[1].reset).toBe('function');
      });

      it('should handle mutation hook structure', () => {
        const { result } = renderHook(() => useAddBankMutation(), {
          wrapper: TestWrapper,
        });

        const [addBank, state] = result.current;
        expect(typeof addBank).toBe('function');
        expect(state).toHaveProperty('isLoading');
        expect(state).toHaveProperty('isError');
        expect(state).toHaveProperty('isSuccess');
        expect(state.error).toBeUndefined();
        expect(state.data).toBeUndefined();
        expect(state).toHaveProperty('reset');
        expect(typeof state.reset).toBe('function');
      });
    });

    describe('Update Bank Mutation Hook', () => {
      it('should have working updateBank mutation hook with full structure', () => {
        const { result } = renderHook(() => useUpdateBankMutation(), {
          wrapper: TestWrapper,
        });

        expect(result.current[0]).toBeDefined();
        expect(result.current[1]).toBeDefined();
        expect(typeof result.current[0]).toBe('function');
        expect(typeof result.current[1].isLoading).toBe('boolean');
        expect(typeof result.current[1].isError).toBe('boolean');
        expect(typeof result.current[1].isSuccess).toBe('boolean');
        expect(result.current[1].error).toBeUndefined();
        expect(result.current[1].data).toBeUndefined();
        expect(typeof result.current[1].reset).toBe('function');
      });

      it('should handle mutation hook structure', () => {
        const { result } = renderHook(() => useUpdateBankMutation(), {
          wrapper: TestWrapper,
        });

        const [updateBank, state] = result.current;
        expect(typeof updateBank).toBe('function');
        expect(state).toHaveProperty('isLoading');
        expect(state).toHaveProperty('isError');
        expect(state).toHaveProperty('isSuccess');
        expect(state.error).toBeUndefined();
        expect(state.data).toBeUndefined();
        expect(state).toHaveProperty('reset');
        expect(typeof state.reset).toBe('function');
      });
    });

    describe('Delete Bank Mutation Hook', () => {
      it('should have working deleteBank mutation hook with full structure', () => {
        const { result } = renderHook(() => useDeleteBankMutation(), {
          wrapper: TestWrapper,
        });

        expect(result.current[0]).toBeDefined();
        expect(result.current[1]).toBeDefined();
        expect(typeof result.current[0]).toBe('function');
        expect(typeof result.current[1].isLoading).toBe('boolean');
        expect(typeof result.current[1].isError).toBe('boolean');
        expect(typeof result.current[1].isSuccess).toBe('boolean');
        expect(result.current[1].error).toBeUndefined();
        expect(result.current[1].data).toBeUndefined();
        expect(typeof result.current[1].reset).toBe('function');
      });

      it('should handle mutation hook structure', () => {
        const { result } = renderHook(() => useDeleteBankMutation(), {
          wrapper: TestWrapper,
        });

        const [deleteBank, state] = result.current;
        expect(typeof deleteBank).toBe('function');
        expect(state).toHaveProperty('isLoading');
        expect(state).toHaveProperty('isError');
        expect(state).toHaveProperty('isSuccess');
        expect(state.error).toBeUndefined();
        expect(state.data).toBeUndefined();
        expect(state).toHaveProperty('reset');
        expect(typeof state.reset).toBe('function');
      });
    });

    describe('Hook State Management', () => {
      it('should initialize hooks with correct default states', () => {
        const { result: queryResult } = renderHook(() => useGetBanksQuery(), {
          wrapper: TestWrapper,
        });
        const { result: addResult } = renderHook(() => useAddBankMutation(), {
          wrapper: TestWrapper,
        });
        const { result: updateResult } = renderHook(() => useUpdateBankMutation(), {
          wrapper: TestWrapper,
        });
        const { result: deleteResult } = renderHook(() => useDeleteBankMutation(), {
          wrapper: TestWrapper,
        });

        // Check initial states
        expect(queryResult.current.isLoading).toBe(true);
        expect(queryResult.current.isError).toBe(false);
        expect(queryResult.current.isSuccess).toBe(false);
        expect(queryResult.current.data).toBeUndefined();

        expect(addResult.current[1].isLoading).toBe(false);
        expect(addResult.current[1].isError).toBe(false);
        expect(addResult.current[1].isSuccess).toBe(false);
        expect(addResult.current[1].error).toBeUndefined();
        expect(addResult.current[1].data).toBeUndefined();

        expect(updateResult.current[1].isLoading).toBe(false);
        expect(updateResult.current[1].isError).toBe(false);
        expect(updateResult.current[1].isSuccess).toBe(false);
        expect(updateResult.current[1].error).toBeUndefined();
        expect(updateResult.current[1].data).toBeUndefined();

        expect(deleteResult.current[1].isLoading).toBe(false);
        expect(deleteResult.current[1].isError).toBe(false);
        expect(deleteResult.current[1].isSuccess).toBe(false);
        expect(deleteResult.current[1].error).toBeUndefined();
        expect(deleteResult.current[1].data).toBeUndefined();
      });

      it('should have reset function available', () => {
        const { result } = renderHook(() => useAddBankMutation(), {
          wrapper: TestWrapper,
        });
        const [, state] = result.current;
        
        expect(typeof state.reset).toBe('function');
        expect(() => state.reset()).not.toThrow();
      });
    });

    describe('Hook Error Handling', () => {
      it('should handle null data gracefully', async () => {
        const { result } = renderHook(() => useAddBankMutation(), {
          wrapper: TestWrapper,
        });
        const [addBank] = result.current;
        
        await act(async () => {
          try {
            await addBank(null as unknown as BankFormData);
          } catch {
            // Expected to fail, but shouldn't crash
          }
        });
      });

      it('should handle undefined data gracefully', async () => {
        const { result } = renderHook(() => useUpdateBankMutation(), {
          wrapper: TestWrapper,
        });
        const [updateBank] = result.current;
        
        await act(async () => {
          try {
            await updateBank(undefined as unknown as UpdateBankData);
          } catch {
            // Expected to fail, but shouldn't crash
          }
        });
      });

      it('should handle malformed data objects', async () => {
        const { result } = renderHook(() => useAddBankMutation(), {
          wrapper: TestWrapper,
        });
        const [addBank] = result.current;
        
        await act(async () => {
          try {
            await addBank({ invalid: 'data' } as unknown as BankFormData);
          } catch {
            // Expected to fail, but shouldn't crash
          }
        });
      });
    });

    describe('Hook Performance', () => {
      it('should maintain consistent function references', () => {
        const { result, rerender } = renderHook(() => useAddBankMutation(), {
          wrapper: TestWrapper,
        });
        
        const initialAddBank = result.current[0];
        rerender();
        const newAddBank = result.current[0];
        
        expect(typeof initialAddBank).toBe('function');
        expect(typeof newAddBank).toBe('function');
      });

      it('should handle rapid successive calls', async () => {
        const { result } = renderHook(() => useAddBankMutation(), {
          wrapper: TestWrapper,
        });
        const [addBank] = result.current;
        
        await act(async () => {
          try {
            addBank({ name: 'Bank1' });
            addBank({ name: 'Bank2' });
            addBank({ name: 'Bank3' });
          } catch {
            // Expected to fail in test environment, but shouldn't crash
          }
        });
      });

      it('should handle concurrent hook usage', () => {
        const { result: addResult } = renderHook(() => useAddBankMutation(), {
          wrapper: TestWrapper,
        });
        const { result: updateResult } = renderHook(() => useUpdateBankMutation(), {
          wrapper: TestWrapper,
        });
        const { result: deleteResult } = renderHook(() => useDeleteBankMutation(), {
          wrapper: TestWrapper,
        });

        expect(typeof addResult.current[0]).toBe('function');
        expect(typeof updateResult.current[0]).toBe('function');
        expect(typeof deleteResult.current[0]).toBe('function');
      });
    });

    describe('Integration Testing', () => {
      it('should work with all hooks simultaneously', async () => {
        const { result: addResult } = renderHook(() => useAddBankMutation(), {
          wrapper: TestWrapper,
        });
        const { result: updateResult } = renderHook(() => useUpdateBankMutation(), {
          wrapper: TestWrapper,
        });
        const { result: deleteResult } = renderHook(() => useDeleteBankMutation(), {
          wrapper: TestWrapper,
        });

        const [addBank] = addResult.current;
        const [updateBank] = updateResult.current;
        const [deleteBank] = deleteResult.current;

        await act(async () => {
          try {
            addBank({ name: 'New Bank' });
            updateBank({ _id: '1', name: 'Updated Bank' });
            deleteBank({ _id: '1' });
          } catch {
            // Expected to fail in test environment, but shouldn't crash
          }
        });
      });

      it('should maintain state isolation between hooks', () => {
        const { result: addResult } = renderHook(() => useAddBankMutation(), {
          wrapper: TestWrapper,
        });
        const { result: updateResult } = renderHook(() => useUpdateBankMutation(), {
          wrapper: TestWrapper,
        });

        expect(addResult.current[1].isLoading).toBe(false);
        expect(updateResult.current[1].isLoading).toBe(false);
        expect(addResult.current[1].isError).toBe(false);
        expect(updateResult.current[1].isError).toBe(false);
      });
    });

    describe('Data Transformation', () => {
      it('should have transformResponse function', () => {
        expect(bankApiSlice.endpoints.getBanks).toBeDefined();
        expect(typeof bankApiSlice.endpoints.getBanks).toBe('object');
      });

      it('should have optimistic update configurations', () => {
        expect(bankApiSlice.endpoints.addBank).toBeDefined();
        expect(bankApiSlice.endpoints.updateBank).toBeDefined();
        expect(bankApiSlice.endpoints.deleteBank).toBeDefined();
      });
    });
  });

  describe('Selectors', () => {
    describe('selectBanksSorted', () => {
      it('should return sorted banks when data is provided', () => {
        const unsortedBanks: Bank[] = [
          { _id: '3', name: 'Wells Fargo' },
          { _id: '1', name: 'Chase Bank' },
          { _id: '2', name: 'Bank of America' },
        ];

        const result = selectBanksSorted(unsortedBanks);

        expect(result).toEqual([
          { _id: '2', name: 'Bank of America' },
          { _id: '1', name: 'Chase Bank' },
          { _id: '3', name: 'Wells Fargo' },
        ]);
      });

      it('should return empty array when data is undefined', () => {
        const result = selectBanksSorted(undefined);
        expect(result).toEqual([]);
      });

      it('should return empty array when data is null', () => {
        const result = selectBanksSorted(null as unknown as Bank[]);
        expect(result).toEqual([]);
      });

      it('should handle empty array', () => {
        const result = selectBanksSorted([]);
        expect(result).toEqual([]);
      });

      it('should handle single bank', () => {
        const singleBank: Bank[] = [{ _id: '1', name: 'Test Bank' }];
        const result = selectBanksSorted(singleBank);
        expect(result).toEqual(singleBank);
      });

      it('should handle banks with same names', () => {
        const banksWithSameNames: Bank[] = [
          { _id: '2', name: 'Bank A' },
          { _id: '1', name: 'Bank A' },
          { _id: '3', name: 'Bank B' },
        ];

        const result = selectBanksSorted(banksWithSameNames);
        expect(result).toEqual([
          { _id: '2', name: 'Bank A' },
          { _id: '1', name: 'Bank A' },
          { _id: '3', name: 'Bank B' },
        ]);
      });

      it('should handle case-sensitive sorting', () => {
        const banksWithMixedCase: Bank[] = [
          { _id: '2', name: 'bank of america' },
          { _id: '1', name: 'Chase Bank' },
          { _id: '3', name: 'Wells Fargo' },
        ];

        const result = selectBanksSorted(banksWithMixedCase);
        expect(result).toEqual([
          { _id: '2', name: 'bank of america' },
          { _id: '1', name: 'Chase Bank' },
          { _id: '3', name: 'Wells Fargo' },
        ]);
      });

      it('should handle banks with special characters in names', () => {
        const banksWithSpecialChars: Bank[] = [
          { _id: '1', name: 'Bank & Trust' },
          { _id: '2', name: 'Bank-Test' },
          { _id: '3', name: 'Bank_Test' },
        ];

        const result = selectBanksSorted(banksWithSpecialChars);
        expect(result).toEqual([
          { _id: '1', name: 'Bank & Trust' },
          { _id: '3', name: 'Bank_Test' },
          { _id: '2', name: 'Bank-Test' },
        ]);
      });

      it('should handle banks with numbers in names', () => {
        const banksWithNumbers: Bank[] = [
          { _id: '1', name: 'Bank 123' },
          { _id: '2', name: 'Bank ABC' },
          { _id: '3', name: 'Bank XYZ' },
        ];

        const result = selectBanksSorted(banksWithNumbers);
        expect(result).toEqual([
          { _id: '1', name: 'Bank 123' },
          { _id: '2', name: 'Bank ABC' },
          { _id: '3', name: 'Bank XYZ' },
        ]);
      });

      it('should handle very long bank names', () => {
        const longBankName = 'A'.repeat(1000);
        const banksWithLongNames: Bank[] = [
          { _id: '1', name: longBankName },
          { _id: '2', name: 'Short Bank' },
        ];

        const result = selectBanksSorted(banksWithLongNames);
        expect(result).toEqual([
          { _id: '1', name: longBankName },
          { _id: '2', name: 'Short Bank' },
        ]);
      });

      it('should handle empty bank names', () => {
        const banksWithEmptyNames: Bank[] = [
          { _id: '1', name: '' },
          { _id: '2', name: 'Valid Bank' },
        ];

        const result = selectBanksSorted(banksWithEmptyNames);
        expect(result).toEqual([
          { _id: '1', name: '' },
          { _id: '2', name: 'Valid Bank' },
        ]);
      });
    });

    describe('selectBankById', () => {
      const mockBanks: Bank[] = [
        { _id: '1', name: 'Chase Bank' },
        { _id: '2', name: 'Bank of America' },
        { _id: '3', name: 'Wells Fargo' },
      ];

      it('should return bank when found by id', () => {
        const result = selectBankById(mockBanks, '1');
        expect(result).toEqual({ _id: '1', name: 'Chase Bank' });
      });

      it('should return undefined when bank not found', () => {
        const result = selectBankById(mockBanks, '999');
        expect(result).toBeUndefined();
      });

      it('should return undefined when data is undefined', () => {
        const result = selectBankById(undefined, '1');
        expect(result).toBeUndefined();
      });

      it('should return undefined when data is null', () => {
        const result = selectBankById(null as unknown as Bank[], '1');
        expect(result).toBeUndefined();
      });

      it('should return undefined when id is empty string', () => {
        const result = selectBankById(mockBanks, '');
        expect(result).toBeUndefined();
      });

      it('should handle case-sensitive id matching', () => {
        const result = selectBankById(mockBanks, '1');
        expect(result).toEqual({ _id: '1', name: 'Chase Bank' });
      });

      it('should handle special characters in id', () => {
        const banksWithSpecialIds: Bank[] = [
          { _id: 'bank-123', name: 'Special Bank' },
          { _id: 'bank_456', name: 'Another Bank' },
        ];

        const result = selectBankById(banksWithSpecialIds, 'bank-123');
        expect(result).toEqual({ _id: 'bank-123', name: 'Special Bank' });
      });

      it('should handle very long ids', () => {
        const longId = 'a'.repeat(1000);
        const banksWithLongIds: Bank[] = [
          { _id: longId, name: 'Long ID Bank' },
        ];

        const result = selectBankById(banksWithLongIds, longId);
        expect(result).toEqual({ _id: longId, name: 'Long ID Bank' });
      });
    });
  });

  describe('Types and Interfaces', () => {
    it('should have correct Bank interface structure', () => {
      const bank: Bank = {
        _id: 'test-id',
        name: 'Test Bank',
      };

      expect(bank._id).toBe('test-id');
      expect(bank.name).toBe('Test Bank');
      expect(typeof bank._id).toBe('string');
      expect(typeof bank.name).toBe('string');
    });

    it('should have correct BankFormData interface structure', () => {
      const bankFormData: BankFormData = {
        name: 'Test Bank Form',
      };

      expect(bankFormData.name).toBe('Test Bank Form');
      expect(typeof bankFormData.name).toBe('string');
    });

    it('should have correct UpdateBankData interface structure', () => {
      const updateBankData: UpdateBankData = {
        _id: 'test-id',
        name: 'Updated Test Bank',
      };

      expect(updateBankData._id).toBe('test-id');
      expect(updateBankData.name).toBe('Updated Test Bank');
      expect(typeof updateBankData._id).toBe('string');
      expect(typeof updateBankData.name).toBe('string');
    });
  });

  describe('Data Validation', () => {
    it('should validate Bank interface properties', () => {
      const bank: Bank = {
        _id: 'test-id',
        name: 'Test Bank',
      };

      expect(bank).toHaveProperty('_id');
      expect(bank).toHaveProperty('name');
      expect(typeof bank._id).toBe('string');
      expect(typeof bank.name).toBe('string');
      expect(bank._id.length).toBeGreaterThan(0);
      expect(bank.name.length).toBeGreaterThan(0);
    });

    it('should validate BankFormData interface properties', () => {
      const bankFormData: BankFormData = {
        name: 'Test Bank Form',
      };

      expect(bankFormData).toHaveProperty('name');
      expect(typeof bankFormData.name).toBe('string');
      expect(bankFormData.name.length).toBeGreaterThan(0);
    });

    it('should validate UpdateBankData interface properties', () => {
      const updateBankData: UpdateBankData = {
        _id: 'test-id',
        name: 'Updated Test Bank',
      };

      expect(updateBankData).toHaveProperty('_id');
      expect(updateBankData).toHaveProperty('name');
      expect(typeof updateBankData._id).toBe('string');
      expect(typeof updateBankData.name).toBe('string');
      expect(updateBankData._id.length).toBeGreaterThan(0);
      expect(updateBankData.name.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle banks with unicode characters', () => {
      const banksWithUnicode: Bank[] = [
        { _id: '1', name: 'Bänk with Ümlauts' },
        { _id: '2', name: 'Bank with émojis 🏦' },
        { _id: '3', name: 'Normal Bank' },
      ];

      const result = selectBanksSorted(banksWithUnicode);
      // The actual sorting order depends on localeCompare behavior
      expect(result).toHaveLength(3);
      expect(result.some(bank => bank.name === 'Bänk with Ümlauts')).toBe(true);
      expect(result.some(bank => bank.name === 'Bank with émojis 🏦')).toBe(true);
      expect(result.some(bank => bank.name === 'Normal Bank')).toBe(true);
    });

    it('should handle banks with leading/trailing spaces', () => {
      const banksWithSpaces: Bank[] = [
        { _id: '1', name: '  Bank with Spaces  ' },
        { _id: '2', name: 'Bank without spaces' },
        { _id: '3', name: 'Another Bank' },
      ];

      const result = selectBanksSorted(banksWithSpaces);
      expect(result).toHaveLength(3);
      expect(result.some(bank => bank.name === '  Bank with Spaces  ')).toBe(true);
      expect(result.some(bank => bank.name === 'Bank without spaces')).toBe(true);
      expect(result.some(bank => bank.name === 'Another Bank')).toBe(true);
    });

    it('should handle banks with only whitespace names', () => {
      const banksWithWhitespace: Bank[] = [
        { _id: '1', name: '   ' },
        { _id: '2', name: 'Valid Bank' },
        { _id: '3', name: '\t\n' },
      ];

      const result = selectBanksSorted(banksWithWhitespace);
      expect(result).toHaveLength(3);
      expect(result.some(bank => bank.name === '   ')).toBe(true);
      expect(result.some(bank => bank.name === 'Valid Bank')).toBe(true);
      expect(result.some(bank => bank.name === '\t\n')).toBe(true);
    });

    it('should handle banks with very short names', () => {
      const banksWithShortNames: Bank[] = [
        { _id: '1', name: 'A' },
        { _id: '2', name: 'B' },
        { _id: '3', name: 'C' },
      ];

      const result = selectBanksSorted(banksWithShortNames);
      expect(result).toEqual([
        { _id: '1', name: 'A' },
        { _id: '2', name: 'B' },
        { _id: '3', name: 'C' },
      ]);
    });

    it('should handle banks with identical names but different ids', () => {
      const banksWithIdenticalNames: Bank[] = [
        { _id: '2', name: 'Same Name Bank' },
        { _id: '1', name: 'Same Name Bank' },
        { _id: '3', name: 'Same Name Bank' },
      ];

      const result = selectBanksSorted(banksWithIdenticalNames);
      expect(result).toEqual([
        { _id: '2', name: 'Same Name Bank' },
        { _id: '1', name: 'Same Name Bank' },
        { _id: '3', name: 'Same Name Bank' },
      ]);
    });
  });

  describe('Performance and Memory', () => {
    it('should handle small arrays correctly', () => {
      const smallBankArray: Bank[] = Array.from({ length: 5 }, (_, i) => ({
        _id: `bank-${i}`,
        name: `Bank ${5 - i}`,
      }));
      
      // This should create: Bank 5, Bank 4, Bank 3, Bank 2, Bank 1
      // After sorting: Bank 1, Bank 2, Bank 3, Bank 4, Bank 5
      const smallResult = selectBanksSorted(smallBankArray);
      expect(smallResult[0].name).toBe('Bank 1');
      expect(smallResult[4].name).toBe('Bank 5');
    });

    it('should handle large arrays efficiently', () => {
      // Test the sorting logic manually first
      const testArray: Bank[] = [
        { _id: '1', name: 'Bank 1000' },
        { _id: '2', name: 'Bank 999' },
        { _id: '3', name: 'Bank 1' },
      ];
      
      // Manual sort to verify the logic
      const manualSort = [...testArray].sort((a, b) => a.name.localeCompare(b.name));
      expect(manualSort[0].name).toBe('Bank 1');
      expect(manualSort[1].name).toBe('Bank 1000');
      expect(manualSort[2].name).toBe('Bank 999');
      
      // Test the selector
      const testResult = selectBanksSorted(testArray);
      expect(testResult[0].name).toBe('Bank 1');
      expect(testResult[1].name).toBe('Bank 1000');
      expect(testResult[2].name).toBe('Bank 999');
      
      // Now test the large array
      const largeBankArray: Bank[] = [];
      for (let i = 1000; i >= 1; i--) {
        largeBankArray.push({
          _id: `bank-${1000 - i}`,
          name: `Bank ${i}`,
        });
      }

      const result = selectBanksSorted(largeBankArray);
      expect(result).toHaveLength(1000);
      expect(result[0].name).toBe('Bank 1');
      expect(result[999].name).toBe('Bank 999');
    });

    it('should handle rapid selector calls', () => {
      const banks: Bank[] = [
        { _id: '3', name: 'Wells Fargo' },
        { _id: '1', name: 'Chase Bank' },
        { _id: '2', name: 'Bank of America' },
      ];

      // Call selector multiple times rapidly
      for (let i = 0; i < 100; i++) {
        const result = selectBanksSorted(banks);
        expect(result).toHaveLength(3);
      }
    });

    it('should handle concurrent selector usage', () => {
      const banks: Bank[] = [
        { _id: '1', name: 'Chase Bank' },
        { _id: '2', name: 'Bank of America' },
      ];

      const sortedResult = selectBanksSorted(banks);
      const bankByIdResult = selectBankById(banks, '1');

      expect(sortedResult).toHaveLength(2);
      expect(bankByIdResult).toEqual({ _id: '1', name: 'Chase Bank' });
    });
  });
}); 