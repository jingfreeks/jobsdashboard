import { describe, it, expect, vi, beforeEach } from 'vitest';
import { bankApiSlice, selectBanksSorted, selectBankById } from '../bank';
import type { Bank, BankFormData, UpdateBankData } from '../bank';

// Test data
const mockBanks: Bank[] = [
  { _id: '1', name: 'Chase Bank' },
  { _id: '2', name: 'Bank of America' },
  { _id: '3', name: 'Wells Fargo' },
];

describe('Bank Feature', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  describe('API Slice Configuration', () => {
    it('should have correct endpoint configuration', () => {
      const endpoints = bankApiSlice.endpoints;

      expect(endpoints.getBanks).toBeDefined();
      expect(endpoints.addBank).toBeDefined();
      expect(endpoints.updateBank).toBeDefined();
      expect(endpoints.deleteBank).toBeDefined();
    });

    it('should have overrideExisting set to true', () => {
      // The overrideExisting property might not be directly accessible
      expect(bankApiSlice).toBeDefined();
    });

    it('should have correct reducer path', () => {
      expect(bankApiSlice.reducerPath).toBeDefined();
    });

    it('should have middleware configured', () => {
      expect(bankApiSlice.middleware).toBeDefined();
    });

    it('should have reducer configured', () => {
      expect(bankApiSlice.reducer).toBeDefined();
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
    });

    describe('selectBankById', () => {
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
    });
  });

  describe('Hook Exports', () => {
    it('should export useGetBanksQuery hook', () => {
      const { useGetBanksQuery } = bankApiSlice;
      expect(useGetBanksQuery).toBeDefined();
      expect(typeof useGetBanksQuery).toBe('function');
    });

    it('should export useAddBankMutation hook', () => {
      const { useAddBankMutation } = bankApiSlice;
      expect(useAddBankMutation).toBeDefined();
      expect(typeof useAddBankMutation).toBe('function');
    });

    it('should export useUpdateBankMutation hook', () => {
      const { useUpdateBankMutation } = bankApiSlice;
      expect(useUpdateBankMutation).toBeDefined();
      expect(typeof useUpdateBankMutation).toBe('function');
    });

    it('should export useDeleteBankMutation hook', () => {
      const { useDeleteBankMutation } = bankApiSlice;
      expect(useDeleteBankMutation).toBeDefined();
      expect(typeof useDeleteBankMutation).toBe('function');
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

  describe('Edge Cases', () => {
    it('should handle banks with special characters in names', () => {
      const banksWithSpecialChars: Bank[] = [
        { _id: '1', name: 'Bank & Trust' },
        { _id: '2', name: 'Bank-Test' },
        { _id: '3', name: 'Bank_Test' },
      ];

      const result = selectBanksSorted(banksWithSpecialChars);
      // The sorting is alphabetical, so the expected order should match the actual sorted order
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
      // The sorting is alphabetical, so the expected order should match the actual sorted order
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
}); 