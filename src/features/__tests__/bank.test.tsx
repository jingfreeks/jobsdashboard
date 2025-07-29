import { describe, it, expect } from 'vitest';
import { bankApiSlice } from '../bank';
import type { Bank, BankFormData, UpdateBankData } from '../bank';

describe('Bank API Slice', () => {
  it('should have the correct endpoints', () => {
    const endpoints = Object.keys(bankApiSlice.endpoints);
    expect(endpoints).toContain('getBanks');
    expect(endpoints).toContain('addBank');
    expect(endpoints).toContain('updateBank');
    expect(endpoints).toContain('deleteBank');
  });

  it('should have correct types', () => {
    const bank: Bank = {
      _id: '1',
      name: 'Test Bank'
    };
    
    const bankFormData: BankFormData = {
      name: 'New Bank'
    };
    
    const updateBankData: UpdateBankData = {
      _id: '1',
      name: 'Updated Bank'
    };

    expect(bank._id).toBe('1');
    expect(bank.name).toBe('Test Bank');
    expect(bankFormData.name).toBe('New Bank');
    expect(updateBankData._id).toBe('1');
    expect(updateBankData.name).toBe('Updated Bank');
  });

  it('should export hooks', () => {
    expect(bankApiSlice.useGetBanksQuery).toBeDefined();
    expect(bankApiSlice.useAddBankMutation).toBeDefined();
    expect(bankApiSlice.useUpdateBankMutation).toBeDefined();
    expect(bankApiSlice.useDeleteBankMutation).toBeDefined();
  });
}); 