import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCompanyOperations } from "../useCompanyOperations";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "@/config/apiSplice";

const mockCompanies = [
  { _id: "1", name: "Beta Corp", cityId: "101" },
  { _id: "2", name: "Alpha Inc", cityId: null },
];
const mockCities = [{ _id: "101", name: "Metro City" }];
const mockAdd = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
// Mock console.error to avoid noise in tests
const mockConsoleError = vi.fn();
const createTestStore = () => {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
};

// Mock dependencies from RTK Query
vi.mock("@/features/company", () => ({
  useGetCompaniesQuery: vi.fn(() => ({
    data: mockCompanies,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  })),
  useAddCompanyMutation: vi.fn(() => [mockAdd, { isLoading: false }]),
  useUpdateCompanyMutation: vi.fn(() => [mockUpdate, { isLoading: false }]),
  useDeleteCompanyMutation: vi.fn(() => [mockDelete, { isLoading: false }]),
}));
vi.mock("@/features/city", () => ({
  useGetCitiesQuery: vi.fn(() => ({
    data: mockCities,
  })),
}));
describe("useCompanyOperations", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(mockConsoleError);
  });

  describe("useCompanyOperations hook", () => {
    it("should return all expected properties and functions", async () => {
      const { useCompanyOperations } = await import("../useCompanyOperations");

      const { result } = renderHook(() => useCompanyOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      // Data properties
      expect(result.current.companies).toBeDefined();
      expect(result.current.isLoading).toBeDefined();
      expect(result.current.error).toBeDefined();

      // Loading states
      expect(result.current.isAdding).toBeDefined();
      expect(result.current.isUpdating).toBeDefined();
      expect(result.current.isDeleting).toBeDefined();

      // Operations
      expect(result.current.createCompany).toBeDefined();
      expect(result.current.updateCompanyById).toBeDefined();
      expect(result.current.deleteCompanyById).toBeDefined();
      expect(result.current.refetch).toBeDefined();
    });

    it("should return functions for all operations", async () => {
      const { useCompanyOperations } = await import("../useCompanyOperations");

      const { result } = renderHook(() => useCompanyOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      expect(typeof result.current.createCompany).toBe("function");
      expect(typeof result.current.updateCompanyById).toBe("function");
      expect(typeof result.current.deleteCompanyById).toBe("function");
      expect(typeof result.current.refetch).toBe("function");
    });
  });

  describe("Data and Loading States", () => {
    it("should return sorted company data", async () => {
      const { useCompanyOperations } = await import("../useCompanyOperations");

      const { result } = renderHook(() => useCompanyOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      expect(Array.isArray(result.current.companies)).toBe(true);
      expect(result.current.companies.length).toBe(2);

      // Check that banks are sorted alphabetically
      const companyNames = result.current.companies.map(
        (company) => company.name
      );
      expect(companyNames).toEqual(["Alpha Inc", "Beta Corp"]);
    });

    it("should return loading states", async () => {
      const { useBankOperations } = await import("../useBankOperations");

      const { result } = renderHook(() => useBankOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      expect(typeof result.current.isLoading).toBe("boolean");
      expect(typeof result.current.isAdding).toBe("boolean");
      expect(typeof result.current.isUpdating).toBe("boolean");
      expect(typeof result.current.isDeleting).toBe("boolean");
    });

    it("should return error state", async () => {
      const { useCompanyOperations } = await import("../useCompanyOperations");

      const { result } = renderHook(() => useCompanyOperations(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe("Company Operations", () => {
    describe("createCompany", () => {
      it("should successfully create a bank", async () => {
        const newCompany= { name: "New Company", cityId: "103" };
        const createCompany = { _id: "3", ...newCompany };

        mockAdd.mockReturnValue({
          unwrap: vi.fn().mockResolvedValue(createCompany),
        });

        const { useCompanyOperations } = await import("../useCompanyOperations");

        const { result } = renderHook(() => useCompanyOperations(), {
          wrapper: ({ children }) => (
            <Provider store={store}>{children}</Provider>
          ),
        });

        const response = await result.current.createCompany(newCompany);

        expect(mockAdd).toHaveBeenCalledWith(newCompany);
        expect(response).toEqual(createCompany);
        expect(mockConsoleError).not.toHaveBeenCalled();
      });

      it("should handle create company error", async () => {
        const newCompany= { name: "New Company" };
        const error = new Error("Failed to create bank");

        mockAdd.mockReturnValue({
          unwrap: vi.fn().mockRejectedValue(error),
        });

         const { useCompanyOperations } = await import("../useCompanyOperations");

        const { result } = renderHook(() => useCompanyOperations(), {
          wrapper: ({ children }) => (
            <Provider store={store}>{children}</Provider>
          ),
        });

        const response = await result.current.createCompany(newCompany);

        expect(mockAdd).toHaveBeenCalledWith(newCompany);
        expect(response).toBeNull();
        expect(mockConsoleError).toHaveBeenCalledWith(
          "Failed to create company:",
          error
        );
      });

      it("should handle create bank with empty data", async () => {
        const emptyCompany = { name: "" };

        mockAdd.mockReturnValue({
          unwrap: vi.fn().mockResolvedValue({ _id: "7", ...emptyCompany }),
        });

        const { useCompanyOperations } = await import("../useCompanyOperations");

        const { result } = renderHook(() => useCompanyOperations(), {
          wrapper: ({ children }) => (
            <Provider store={store}>{children}</Provider>
          ),
        });

        const response = await result.current.createCompany(emptyCompany);

        expect(mockAdd).toHaveBeenCalledWith(emptyCompany);
        expect(response).toEqual({ _id: "7", ...emptyCompany });
      });
    });

    // describe("updateBankById", () => {
    //   it("should successfully update a bank", async () => {
    //     const updateData = { _id: "1", name: "Updated Bank A", code: "UBA001" };
    //     const updatedBank = { ...updateData };

    //     mockUpdateBank.mockReturnValue({
    //       unwrap: vi.fn().mockResolvedValue(updatedBank),
    //     });

    //     const { useBankOperations } = await import("../useBankOperations");

    //     const { result } = renderHook(() => useBankOperations(), {
    //       wrapper: ({ children }) => (
    //         <Provider store={store}>{children}</Provider>
    //       ),
    //     });

    //     const response = await result.current.updateBankById(updateData);

    //     expect(mockUpdateBank).toHaveBeenCalledWith(updateData);
    //     expect(response).toEqual(updatedBank);
    //     expect(mockConsoleError).not.toHaveBeenCalled();
    //   });

    //   it("should handle update bank error", async () => {
    //     const updateData = { _id: "1", name: "Updated Bank A", code: "UBA001" };
    //     const error = new Error("Failed to update bank");

    //     mockUpdateBank.mockReturnValue({
    //       unwrap: vi.fn().mockRejectedValue(error),
    //     });

    //     const { useBankOperations } = await import("../useBankOperations");

    //     const { result } = renderHook(() => useBankOperations(), {
    //       wrapper: ({ children }) => (
    //         <Provider store={store}>{children}</Provider>
    //       ),
    //     });

    //     const response = await result.current.updateBankById(updateData);

    //     expect(mockUpdateBank).toHaveBeenCalledWith(updateData);
    //     expect(response).toBeNull();
    //     expect(mockConsoleError).toHaveBeenCalledWith(
    //       "Failed to update bank:",
    //       error
    //     );
    //   });

    //   it("should handle update bank with non-existent ID", async () => {
    //     const updateData = {
    //       _id: "999",
    //       name: "Non-existent Bank",
    //       code: "NEB999",
    //     };
    //     const error = new Error("Bank not found");

    //     mockUpdateBank.mockReturnValue({
    //       unwrap: vi.fn().mockRejectedValue(error),
    //     });

    //     const { useBankOperations } = await import("../useBankOperations");

    //     const { result } = renderHook(() => useBankOperations(), {
    //       wrapper: ({ children }) => (
    //         <Provider store={store}>{children}</Provider>
    //       ),
    //     });

    //     const response = await result.current.updateBankById(updateData);

    //     expect(mockUpdateBank).toHaveBeenCalledWith(updateData);
    //     expect(response).toBeNull();
    //     expect(mockConsoleError).toHaveBeenCalledWith(
    //       "Failed to update bank:",
    //       error
    //     );
    //   });
    // });

    // describe("deleteBankById", () => {
    //   it("should successfully delete a bank", async () => {
    //     const bankId = "1";

    //     mockDeleteBank.mockReturnValue({
    //       unwrap: vi.fn().mockResolvedValue({ success: true }),
    //     });

    //     const { useBankOperations } = await import("../useBankOperations");

    //     const { result } = renderHook(() => useBankOperations(), {
    //       wrapper: ({ children }) => (
    //         <Provider store={store}>{children}</Provider>
    //       ),
    //     });

    //     const response = await result.current.deleteBankById(bankId);

    //     expect(mockDeleteBank).toHaveBeenCalledWith({ _id: bankId });
    //     expect(response).toBe(true);
    //     expect(mockConsoleError).not.toHaveBeenCalled();
    //   });

    //   it("should handle delete bank error", async () => {
    //     const bankId = "1";
    //     const error = new Error("Failed to delete bank");

    //     mockDeleteBank.mockReturnValue({
    //       unwrap: vi.fn().mockRejectedValue(error),
    //     });

    //     const { useBankOperations } = await import("../useBankOperations");

    //     const { result } = renderHook(() => useBankOperations(), {
    //       wrapper: ({ children }) => (
    //         <Provider store={store}>{children}</Provider>
    //       ),
    //     });

    //     const response = await result.current.deleteBankById(bankId);

    //     expect(mockDeleteBank).toHaveBeenCalledWith({ _id: bankId });
    //     expect(response).toBe(false);
    //     expect(mockConsoleError).toHaveBeenCalledWith(
    //       "Failed to delete bank:",
    //       error
    //     );
    //   });

    //   it("should handle delete bank with non-existent ID", async () => {
    //     const bankId = "999";
    //     const error = new Error("Bank not found");

    //     mockDeleteBank.mockReturnValue({
    //       unwrap: vi.fn().mockRejectedValue(error),
    //     });

    //     const { useBankOperations } = await import("../useBankOperations");

    //     const { result } = renderHook(() => useBankOperations(), {
    //       wrapper: ({ children }) => (
    //         <Provider store={store}>{children}</Provider>
    //       ),
    //     });

    //     const response = await result.current.deleteBankById(bankId);

    //     expect(mockDeleteBank).toHaveBeenCalledWith({ _id: bankId });
    //     expect(response).toBe(false);
    //     expect(mockConsoleError).toHaveBeenCalledWith(
    //       "Failed to delete bank:",
    //       error
    //     );
    //   });

    //   it("should handle delete bank with empty ID", async () => {
    //     const bankId = "";
    //     const error = new Error("Invalid bank ID");

    //     mockDeleteBank.mockReturnValue({
    //       unwrap: vi.fn().mockRejectedValue(error),
    //     });

    //     const { useBankOperations } = await import("../useBankOperations");

    //     const { result } = renderHook(() => useBankOperations(), {
    //       wrapper: ({ children }) => (
    //         <Provider store={store}>{children}</Provider>
    //       ),
    //     });

    //     const response = await result.current.deleteBankById(bankId);

    //     expect(mockDeleteBank).toHaveBeenCalledWith({ _id: bankId });
    //     expect(response).toBe(false);
    //     expect(mockConsoleError).toHaveBeenCalledWith(
    //       "Failed to delete bank:",
    //       error
    //     );
    //   });
    // });
  });
  it("returns correct snapshot", () => {
    const { result } = renderHook(() => useCompanyOperations(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    expect(result.current).toMatchSnapshot();
  });

  it("sorts companies alphabetically", () => {
    const { result } = renderHook(() => useCompanyOperations(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    expect(result.current.companies[0].name).toBe("Alpha Inc");
    expect(result.current.companies[1].name).toBe("Beta Corp");
  });

  it("maps companies with city names", () => {
    const { result } = renderHook(() => useCompanyOperations(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    expect(result.current.companiesWithCities[0].cityname).toBe("Metro City");
    expect(result.current.companiesWithCities[1].cityname).toBe("No City");
  });



  it("updates company successfully", async () => {
    mockUpdate.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({ _id: "1", name: "Updated" }),
    });
    const { result } = renderHook(() => useCompanyOperations(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    const updated = await result.current.updateCompanyById({
      _id: "1",
      name: "Updated",
    });
    expect(updated?.name).toBe("Updated");
  });

  it("handles update company error", async () => {
    mockUpdate.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(new Error("fail")),
    });
    const { result } = renderHook(() => useCompanyOperations(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    const res = await result.current.updateCompanyById({
      _id: "1",
      name: "Bad Update",
    });
    expect(res).toBeNull();
  });

  it("deletes company successfully", async () => {
    mockDelete.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue(true),
    });
    const { result } = renderHook(() => useCompanyOperations(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    const res = await result.current.deleteCompanyById("1");
    expect(res).toBe(true);
  });

  it("handles delete company error", async () => {
    mockDelete.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(new Error("fail")),
    });
    const { result } = renderHook(() => useCompanyOperations(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    const res = await result.current.deleteCompanyById("1");
    expect(res).toBe(false);
  });
});
