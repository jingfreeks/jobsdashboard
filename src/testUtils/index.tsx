import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/config/apiSplice';
import { vi } from 'vitest';

// Mock data for companies
export const mockCompanies = [
  { _id: '1', name: 'Acme Corp', address: '123 Main St, Anytown, USA' },
  { _id: '2', name: 'Globex Inc', address: '456 Oak Ave, Somewhere, USA' },
  { _id: '3', name: 'Initech', address: '789 Pine Rd, Elsewhere, USA' },
];

// Mock data for cities
export const mockCities = [
  { _id: 'city1', name: 'Anytown' },
  { _id: 'city2', name: 'Somewhere' },
  { _id: 'city3', name: 'Elsewhere' },
];

// Mock data for departments
export const mockDepartments = [
  { _id: '1', name: 'Engineering' },
  { _id: '2', name: 'Marketing' },
  { _id: '3', name: 'Sales' },
];

// Create a dynamic companies state for testing
let testCompanies = [
  { _id: '1', name: 'Acme Corp', address: '123 Main St, Anytown, USA' },
  { _id: '2', name: 'Globex Inc', address: '456 Oak Ave, Somewhere, USA' },
  { _id: '3', name: 'Initech', address: '789 Pine Rd, Elsewhere, USA' },
];
let updateTrigger = 0;

// Create a dynamic departments state for testing
let testDepartments = [...mockDepartments];
let departmentUpdateTrigger = 0;

// Mock the useCompanyOperations hook with dynamic state
vi.mock('@/hooks/useCompanyOperations', () => ({
  useCompanyOperations: () => {
    // Force re-render by using a counter that changes when companies are updated
    const [, forceUpdate] = React.useState(0);
    
    const createCompany = vi.fn().mockImplementation(async (data: any) => {
      const newCompany = { 
        _id: `new-${Date.now()}`, 
        name: data.name,
        address: data.address || '',
        cityId: data.cityId || ''
      };
      testCompanies.push(newCompany);
      updateTrigger++;
      forceUpdate(updateTrigger);
      return newCompany;
    });

    const updateCompanyById = vi.fn().mockImplementation(async (data: any) => {
      const index = testCompanies.findIndex(c => c._id === data._id);
      if (index !== -1) {
        testCompanies[index] = { 
          ...testCompanies[index], 
          name: data.name,
          address: data.address || testCompanies[index].address,
          cityId: data.cityId || testCompanies[index].cityId
        };
        updateTrigger++;
        forceUpdate(updateTrigger);
        return testCompanies[index];
      }
      return null;
    });

    const deleteCompanyById = vi.fn().mockImplementation(async (id: string) => {
      const index = testCompanies.findIndex(c => c._id === id);
      if (index !== -1) {
        testCompanies.splice(index, 1);
        updateTrigger++;
        forceUpdate(updateTrigger);
        return true;
      }
      return false;
    });

    // Create companiesWithCities with city information
    const companiesWithCities = testCompanies.map(company => ({
      ...company,
      cityname: company.cityId ? mockCities.find(city => city._id === company.cityId)?.name || 'No City' : 'No City'
    }));

    return {
      companies: testCompanies,
      companiesWithCities,
      cities: mockCities,
      cityMap: new Map(mockCities.map(city => [city._id, city])),
      isLoading: false,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      error: null,
      createCompany,
      updateCompanyById,
      deleteCompanyById,
      refetch: vi.fn(),
    };
  },
}));

// Mock the useDepartmentOperations hook with dynamic state
vi.mock('@/hooks/useDepartmentOperations', () => ({
  useDepartmentOperations: () => {
    // Force re-render by using a counter that changes when departments are updated
    const [, forceUpdate] = React.useState(0);
    
    const createDepartment = vi.fn().mockImplementation(async (data: any) => {
      const newDepartment = { _id: `new-${Date.now()}`, name: data.name };
      testDepartments.push(newDepartment);
      departmentUpdateTrigger++;
      forceUpdate(departmentUpdateTrigger);
      return newDepartment;
    });

    const updateDepartmentById = vi.fn().mockImplementation(async (data: any) => {
      const index = testDepartments.findIndex(d => d._id === data._id);
      if (index !== -1) {
        testDepartments[index] = { ...testDepartments[index], name: data.name };
        departmentUpdateTrigger++;
        forceUpdate(departmentUpdateTrigger);
        return testDepartments[index];
      }
      return null;
    });

    const deleteDepartmentById = vi.fn().mockImplementation(async (id: string) => {
      const index = testDepartments.findIndex(d => d._id === id);
      if (index !== -1) {
        testDepartments.splice(index, 1);
        departmentUpdateTrigger++;
        forceUpdate(departmentUpdateTrigger);
        return true;
      }
      return false;
    });

    return {
      departments: testDepartments,
      departmentMap: new Map(testDepartments.map(department => [department._id, department])),
      isLoading: false,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      error: null,
      createDepartment,
      updateDepartmentById,
      deleteDepartmentById,
      refetch: vi.fn(),
    };
  },
}));

// Mock the useToast hook
vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    toasts: [],
    addToast: vi.fn(),
    removeToast: vi.fn(),
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showWarning: vi.fn(),
    showInfo: vi.fn(),
  }),
}));

// Reset test data before each test
beforeEach(() => {
  testCompanies = [...mockCompanies];
  updateTrigger = 0;
  testDepartments = [...mockDepartments];
  departmentUpdateTrigger = 0;
});

// Create a simple test store
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      auth: (state = { token: 'mock-token', user: null, userId: null, roles: [] }, action) => state,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST'],
        },
      }).concat(apiSlice.middleware),
    preloadedState,
  });
};

// Custom render function that includes providers
const customRender = (
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render }; 