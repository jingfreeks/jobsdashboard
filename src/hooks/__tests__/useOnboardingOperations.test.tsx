/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useOnboardingOperations } from "../useOnboardingOperations";
import {
  useGetOnboardingQuery,
  useUpdateOnboardingMutation,
  useCreateOnboardingMutation,
} from "@/features/onboardingApiSlice";
import {
  setOnboardingLoading,
  setOnboardingError,
  setOnboardingData,
  clearOnboardingData,
  updateOnboardingStep
} from "@/features/onboarding";

// Mock redux
const mockDispatch = vi.fn();
vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

// Mock RTK query hooks
vi.mock("@/features/onboardingApiSlice", () => ({
  useGetOnboardingQuery: vi.fn(),
  useUpdateOnboardingMutation: vi.fn(),
  useCreateOnboardingMutation: vi.fn(),
}));

describe("useOnboardingOperations (Vite + Vitest)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should expose default values from useGetOnboardingQuery", () => {
    (useGetOnboardingQuery as any).mockReturnValue({
      data: { name: "test" },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    (useUpdateOnboardingMutation as any).mockReturnValue([vi.fn(), { isLoading: false }]);
    (useCreateOnboardingMutation as any).mockReturnValue([vi.fn(), { isLoading: false }]);

    const { result } = renderHook(() => useOnboardingOperations());

    expect(result.current.onboardingData).toEqual({ name: "test" });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should dispatch setOnboardingLoading and setOnboardingData when fetchOnboarding succeeds", async () => {
    const refetchMock = vi.fn().mockResolvedValue({ data: { foo: "bar" } });
    (useGetOnboardingQuery as any).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: refetchMock,
    });
    (useUpdateOnboardingMutation as any).mockReturnValue([vi.fn(), { isLoading: false }]);
    (useCreateOnboardingMutation as any).mockReturnValue([vi.fn(), { isLoading: false }]);

    const { result } = renderHook(() => useOnboardingOperations());

    await act(async () => {
      await result.current.fetchOnboarding();
    });

    expect(mockDispatch).toHaveBeenCalledWith(setOnboardingLoading(true));
    expect(refetchMock).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(
    expect.objectContaining({
        type: setOnboardingData.type,
        payload: { foo: "bar" },
    })
);
    expect(mockDispatch).toHaveBeenCalledWith(setOnboardingLoading(false));
  });

  it("should handle saveOnboarding success", async () => {
    const updateMock = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve({ id: 1 }) });
    (useGetOnboardingQuery as any).mockReturnValue({ data: null, isLoading: false, error: null, refetch: vi.fn() });
    (useUpdateOnboardingMutation as any).mockReturnValue([updateMock, { isLoading: false }]);
    (useCreateOnboardingMutation as any).mockReturnValue([vi.fn(), { isLoading: false }]);

    const { result } = renderHook(() => useOnboardingOperations());

    const res = await act(async () => result.current.saveOnboarding({ id: 1 }));

    expect(updateMock).toHaveBeenCalledWith({ id: 1 });
    expect(mockDispatch).toHaveBeenCalledWith(setOnboardingData({ id: 1 }));
    expect(res).toEqual({ id: 1 });
  });

  it("should handle saveOnboarding error", async () => {
    const updateMock = vi.fn().mockReturnValue({
      unwrap: () => Promise.reject(new Error("save failed")),
    });
    (useGetOnboardingQuery as any).mockReturnValue({ data: null, isLoading: false, error: null, refetch: vi.fn() });
    (useUpdateOnboardingMutation as any).mockReturnValue([updateMock, { isLoading: false }]);
    (useCreateOnboardingMutation as any).mockReturnValue([vi.fn(), { isLoading: false }]);

    const { result } = renderHook(() => useOnboardingOperations());

    await expect(result.current.saveOnboarding({})).rejects.toThrow("save failed");

    expect(mockDispatch).toHaveBeenCalledWith(setOnboardingError("save failed"));
  });

  it("should dispatch updateStep, updatePreferences, and clearData", () => {
    (useGetOnboardingQuery as any).mockReturnValue({ data: null, isLoading: false, error: null, refetch: vi.fn() });
    (useUpdateOnboardingMutation as any).mockReturnValue([vi.fn(), { isLoading: false }]);
    (useCreateOnboardingMutation as any).mockReturnValue([vi.fn(), { isLoading: false }]);

    const { result } = renderHook(() => useOnboardingOperations());

    act(() => {
      result.current.updateStep(2);
      result.current.updatePreferences({ darkMode: true });
      result.current.clearData();
    });

    expect(mockDispatch).toHaveBeenCalledWith(updateOnboardingStep(2));
    expect(mockDispatch).toHaveBeenCalledWith(clearOnboardingData());
  });
});
