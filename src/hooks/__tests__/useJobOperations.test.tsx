/* eslint-disable @typescript-eslint/no-explicit-any */

// src/features/jobs/__tests__/useJobOperations.test.tsx
import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useJobOperations } from "../useJobOperations";
import type { Mock } from "vitest";
// Mock RTK Query hooks
vi.mock("@/features/jobs", () => ({
  useGetJobsQuery: vi.fn(),
  useAddJobMutation: vi.fn(),
  useUpdateJobMutation: vi.fn(),
  useDeleteJobMutation: vi.fn(),
}));

vi.mock("@/features/company", () => ({
  useGetCompaniesQuery: vi.fn(),
}));

vi.mock("@/features/city", () => ({
  useGetCitiesQuery: vi.fn(),
}));

vi.mock("@/features/department", () => ({
  useGetDepartmentsQuery: vi.fn(),
}));

// Import after mocks
import {
  useGetJobsQuery,
  useAddJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} from "@/features/jobs";
import { useGetCompaniesQuery } from "@/features/company";
import { useGetCitiesQuery } from "@/features/city";
import { useGetDepartmentsQuery } from "@/features/department";

describe("useJobOperations (Vitest)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps jobs with related company/city/department names", () => {
    (useGetJobsQuery as any).mockReturnValue({
      data: [
        { _id: "1", companyId: "c1", cityId: "ct1", departmentId: "d1" },
      ],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    (useGetCompaniesQuery as Mock).mockReturnValue({
      data: [{ _id: "c1", name: "OpenAI" }],
    });
    (useGetCitiesQuery as Mock).mockReturnValue({
      data: [{ _id: "ct1", name: "San Francisco" }],
    });
    (useGetDepartmentsQuery as Mock).mockReturnValue({
      data: [{ _id: "d1", name: "Engineering" }],
    });

    (useAddJobMutation as Mock).mockReturnValue([vi.fn(), { isLoading: false }]);
    (useUpdateJobMutation as Mock).mockReturnValue([vi.fn(), { isLoading: false }]);
    (useDeleteJobMutation as Mock).mockReturnValue([vi.fn(), { isLoading: false }]);

    const { result } = renderHook(() => useJobOperations());

    expect(result.current.jobsWithDetails[0]).toMatchObject({
      companyname: "OpenAI",
      cityname: "San Francisco",
      departmentname: "Engineering",
    });

    // snapshot check
    expect(result.current.jobsWithDetails).toMatchSnapshot();
  });

  it("creates a job successfully", async () => {
    const mockAdd = vi.fn().mockReturnValue({
      unwrap: () => Promise.resolve({ _id: "1", title: "New Job" }),
    });
    (useAddJobMutation as Mock).mockReturnValue([mockAdd, { isLoading: false }]);

    (useGetJobsQuery as Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    (useGetCompaniesQuery as Mock).mockReturnValue({ data: [] });
    (useGetCitiesQuery as Mock).mockReturnValue({ data: [] });
    (useGetDepartmentsQuery as Mock).mockReturnValue({ data: [] });
    (useUpdateJobMutation as Mock).mockReturnValue([vi.fn(), { isLoading: false }]);
    (useDeleteJobMutation as Mock).mockReturnValue([vi.fn(), { isLoading: false }]);

    const { result } = renderHook(() => useJobOperations());

    let job;
    await act(async () => {
      job = await result.current.createJob({ title: "New Job" } as any);
    });

    expect(mockAdd).toHaveBeenCalled();
    expect(job).toEqual({ _id: "1", title: "New Job" });
  });

  it("handles deleteJob failure gracefully", async () => {
    const mockDelete = vi.fn().mockReturnValue({
      unwrap: () => Promise.reject(new Error("Delete failed")),
    });
    (useDeleteJobMutation as Mock).mockReturnValue([mockDelete, { isLoading: false }]);

    (useGetJobsQuery as Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    (useGetCompaniesQuery as Mock).mockReturnValue({ data: [] });
    (useGetCitiesQuery as Mock).mockReturnValue({ data: [] });
    (useGetDepartmentsQuery as Mock).mockReturnValue({ data: [] });
    (useAddJobMutation as Mock).mockReturnValue([vi.fn(), { isLoading: false }]);
    (useUpdateJobMutation as Mock).mockReturnValue([vi.fn(), { isLoading: false }]);

    const { result } = renderHook(() => useJobOperations());

    let success;
    await act(async () => {
      success = await result.current.deleteJobById("1");
    });

    expect(success).toBe(false);
  });

  it("updates a job successfully with updateJobById", async () => {
    const payload = { _id: "1", title: "Updated" } as any;
    const updated = { _id: "1", title: "Updated", status: "ok" };

    const mockUpdate = vi.fn().mockReturnValue({
      unwrap: () => Promise.resolve(updated),
    });
    (useUpdateJobMutation as Mock).mockReturnValue([mockUpdate, { isLoading: false }]);

    // minimal mocks for other deps
    (useGetJobsQuery as Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    (useGetCompaniesQuery as Mock).mockReturnValue({ data: [] });
    (useGetCitiesQuery as Mock).mockReturnValue({ data: [] });
    (useGetDepartmentsQuery as Mock).mockReturnValue({ data: [] });
    (useAddJobMutation as Mock).mockReturnValue([vi.fn(), { isLoading: false }]);
    (useDeleteJobMutation as Mock).mockReturnValue([vi.fn(), { isLoading: false }]);

    const { result } = renderHook(() => useJobOperations());

    let res;
    await act(async () => {
      res = await result.current.updateJobById(payload);
    });

    expect(mockUpdate).toHaveBeenCalledWith(payload);
    expect(res).toEqual(updated);
  });

  it("returns null when updateJobById fails", async () => {
    const payload = { _id: "1", title: "Broken" } as any;

    const mockUpdate = vi.fn().mockReturnValue({
      unwrap: () => Promise.reject(new Error("Update failed")),
    });
    (useUpdateJobMutation as Mock).mockReturnValue([mockUpdate, { isLoading: false }]);

    // minimal mocks for other deps
    (useGetJobsQuery as Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    (useGetCompaniesQuery as Mock).mockReturnValue({ data: [] });
    (useGetCitiesQuery as Mock).mockReturnValue({ data: [] });
    (useGetDepartmentsQuery as Mock).mockReturnValue({ data: [] });
    (useAddJobMutation as Mock).mockReturnValue([vi.fn(), { isLoading: false }]);
    (useDeleteJobMutation as Mock).mockReturnValue([vi.fn(), { isLoading: false }]);

    const { result } = renderHook(() => useJobOperations());

    let res;
    await act(async () => {
      res = await result.current.updateJobById(payload);
    });

    expect(mockUpdate).toHaveBeenCalledWith(payload);
    expect(res).toBeNull();
  });
});
