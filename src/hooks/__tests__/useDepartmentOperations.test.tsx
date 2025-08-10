import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDepartmentOperations } from '../useDepartmentOperations';

// Mock the department API
vi.mock('@/features/department', () => ({
  useGetDepartmentsQuery: vi.fn(),
  useAddDepartmentMutation: vi.fn(),
  useUpdateDepartmentMutation: vi.fn(),
  useDeleteDepartmentMutation: vi.fn(),
  selectDepartmentsSorted: vi.fn((data) => data?.sort((a:{name:string}, b:{name:string}) => a.name.localeCompare(b.name)) || []),
  selectDepartmentById: vi.fn((data, id) => data?.find((dept:{_id:string}) => dept._id === id)),
}));

describe('useDepartmentOperations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useDepartmentOperations).toBeDefined();
  });

  it('should return a function', () => {
    expect(typeof useDepartmentOperations).toBe('function');
  });
}); 