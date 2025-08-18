/* eslint-disable @typescript-eslint/no-explicit-any */
// useShiftOperations.test.tsx
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useShiftOperations } from "../useShiftOperations";
import {
  useGetShiftsQuery,
  useCreateShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
} from "@/features/shift";
import type { Mock } from "vitest";
vi.mock("@/features/shift", () => ({
  useGetShiftsQuery: vi.fn(),
  useCreateShiftMutation: vi.fn(),
  useUpdateShiftMutation: vi.fn(),
  useDeleteShiftMutation: vi.fn(),
}));

describe("useShiftOperations", () => {
  const mockShifts = [
    { _id: "2", title: "Night Shift" },
    { _id: "1", title: "Day Shift" },
  ];

  const mockCreate = vi.fn();
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useGetShiftsQuery as Mock).mockReturnValue({
      data: mockShifts,
      isLoading: false,
      error: null,
    });

    (useCreateShiftMutation as Mock).mockReturnValue([
      mockCreate,
      { isLoading: false },
    ]);
    (useUpdateShiftMutation as Mock).mockReturnValue([
      mockUpdate,
      { isLoading: false },
    ]);
    (useDeleteShiftMutation as Mock).mockReturnValue([
      mockDelete,
      { isLoading: false },
    ]);
  });

  it("should return sorted shifts", () => {
    const { result } = renderHook(() => useShiftOperations());
    expect(result.current.shifts.map((s) => s.title)).toEqual([
      "Day Shift",
      "Night Shift",
    ]);
  });

  it("should get shift by id", () => {
    const { result } = renderHook(() => useShiftOperations());
    const shift = result.current.getShiftById("1");
    expect(shift?.title).toBe("Day Shift");
  });

  it("should call createShift successfully", async () => {
    mockCreate.mockReturnValue({ unwrap: () => Promise.resolve(true) });

    const { result } = renderHook(() => useShiftOperations());

    let success: boolean = false;
    await act(async () => {
      success = await result.current.createShift({ title: "New Shift" } as any);
    });

    expect(success).toBe(true);
    expect(mockCreate).toHaveBeenCalledWith({ title: "New Shift" });
  });

  it("should call updateShift successfully", async () => {
    mockUpdate.mockReturnValue({ unwrap: () => Promise.resolve(true) });

    const { result } = renderHook(() => useShiftOperations());

    let success: boolean = false;
    await act(async () => {
      success = await result.current.updateShift({
        _id: "1",
        title: "Updated",
      } as any);
    });

    expect(success).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith({ _id: "1", title: "Updated" });
  });

  it("should call deleteShift successfully", async () => {
    mockDelete.mockReturnValue({ unwrap: () => Promise.resolve(true) });

    const { result } = renderHook(() => useShiftOperations());

    let success: boolean = false;
    await act(async () => {
      success = await result.current.deleteShift({ _id: "1" } as any);
    });

    expect(success).toBe(true);
    expect(mockDelete).toHaveBeenCalledWith({ _id: "1" });
  });

  it("should handle createShift error", async () => {
    mockCreate.mockReturnValue({ unwrap: () => Promise.reject(new Error("fail")) });

    const { result } = renderHook(() => useShiftOperations());

    let success: boolean = true;
    await act(async () => {
      success = await result.current.createShift({ title: "Bad Shift" } as any);
    });

    expect(success).toBe(false);
  });
});
