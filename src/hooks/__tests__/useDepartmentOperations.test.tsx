// import { describe, it, expect, vi, beforeEach } from 'vitest';
// import { useDepartmentOperations } from '../useDepartmentOperations';

// // Mock the department API
// vi.mock('@/features/department', () => ({
//   useGetDepartmentsQuery: vi.fn(),
//   useAddDepartmentMutation: vi.fn(),
//   useUpdateDepartmentMutation: vi.fn(),
//   useDeleteDepartmentMutation: vi.fn(),
//   selectDepartmentsSorted: vi.fn((data) => data?.sort((a:{name:string}, b:{name:string}) => a.name.localeCompare(b.name)) || []),
//   selectDepartmentById: vi.fn((data, id) => data?.find((dept:{_id:string}) => dept._id === id)),
// }));

// describe('useDepartmentOperations', () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   it('should be defined', () => {
//     expect(useDepartmentOperations).toBeDefined();
//   });

//   it('should return a function', () => {
//     expect(typeof useDepartmentOperations).toBe('function');
//   });
// }); 

// useDepartmentOperations.test.tsx
import { renderHook, act } from "@testing-library/react";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { useDepartmentOperations } from "../useDepartmentOperations";
import {
  useGetDepartmentsQuery,
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  selectDepartmentsSorted,
  selectDepartmentById,
} from "@/features/department";

// 🔹 Mock RTK Query hooks
vi.mock("@/features/department", () => ({
  useGetDepartmentsQuery: vi.fn(),
  useAddDepartmentMutation: vi.fn(),
  useUpdateDepartmentMutation: vi.fn(),
  useDeleteDepartmentMutation: vi.fn(),
  selectDepartmentsSorted: vi.fn(),
  selectDepartmentById: vi.fn(),
}));

const mockDepartments = [
  { _id: "1", name: "HR" },
  { _id: "2", name: "Engineering" },
];

describe("useDepartmentOperations (Vitest)", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useGetDepartmentsQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockDepartments,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    (selectDepartmentsSorted as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (depts) => depts
    );

    (useAddDepartmentMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      vi.fn().mockReturnValue({
        unwrap: () => Promise.resolve({ _id: "3", name: "Finance" }),
      }),
      { isLoading: false },
    ]);

    (useUpdateDepartmentMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      vi.fn().mockReturnValue({
        unwrap: () => Promise.resolve({ _id: "1", name: "HR Updated" }),
      }),
      { isLoading: false },
    ]);

    (useDeleteDepartmentMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      vi.fn().mockReturnValue({
        unwrap: () => Promise.resolve(),
      }),
      { isLoading: false },
    ]);

    (selectDepartmentById as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (depts, id) => depts.find((d: any) => d._id === id)
    );
  });

  it("should return sorted departments and departmentMap", () => {
    const { result } = renderHook(() => useDepartmentOperations());

    expect(result.current.departments).toEqual(mockDepartments);
    expect(result.current.departmentMap.get("1")).toEqual(mockDepartments[0]);

    // 🔹 Snapshot
    expect(result.current).toMatchSnapshot();
  });

  it("should create a department", async () => {
    const { result } = renderHook(() => useDepartmentOperations());

    await act(async () => {
      const newDept = await result.current.createDepartment({ name: "Finance" });
      expect(newDept).toEqual({ _id: "3", name: "Finance" });
    });
  });

  it("should update a department", async () => {
    const { result } = renderHook(() => useDepartmentOperations());

    await act(async () => {
      const updatedDept = await result.current.updateDepartmentById({
        _id: "1",
        name: "HR Updated",
      });
      expect(updatedDept).toEqual({ _id: "1", name: "HR Updated" });
    });
  });

  it("should delete a department", async () => {
    const { result } = renderHook(() => useDepartmentOperations());

    await act(async () => {
      await expect(result.current.deleteDepartmentById("1")).resolves.toBeUndefined();
    });
  });

  it("should get a department by id", () => {
    const { result } = renderHook(() => useDepartmentOperations());

    const dept = result.current.getDepartmentById("2");
    expect(dept).toEqual({ _id: "2", name: "Engineering" });
  });

  it("should search departments by name", () => {
    const { result } = renderHook(() => useDepartmentOperations());

    const searchResults = result.current.searchDepartments("HR");
    expect(searchResults).toEqual([{ _id: "1", name: "HR" }]);

    const emptySearch = result.current.searchDepartments("");
    expect(emptySearch).toEqual(mockDepartments);
  });
});
