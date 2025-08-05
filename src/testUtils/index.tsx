import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/config/apiSplice';
import { vi, beforeEach } from 'vitest';

// Mock the useJobOperations hook with dynamic state
vi.mock('@/hooks/useJobOperations', () => ({
  useJobOperations: () => {
    // Force re-render by using a counter that changes when jobs are updated
    const [, forceUpdate] = React.useState(0);
    
    const createJob = vi.fn().mockImplementation(async (data: any) => {
      const newJob = { 
        _id: `new-${Date.now()}`, 
        jobtitle: data.jobtitle,
        companyId: data.companyId || '',
        cityId: data.cityId || '',
        departmentId: data.departmentId || '',
        description: data.description || '',
        requirements: data.requirements || '',
        salary: data.salary || '',
        type: data.type || '',
        status: data.status || ''
      };
      testJobs.push(newJob);
      jobUpdateTrigger++;
      forceUpdate(jobUpdateTrigger);
      return newJob;
    });

    const updateJobById = vi.fn().mockImplementation(async (data: any) => {
      const index = testJobs.findIndex(j => j._id === data._id);
      if (index !== -1) {
        testJobs[index] = { 
          ...testJobs[index], 
          jobtitle: data.jobtitle,
          companyId: data.companyId || testJobs[index].companyId,
          cityId: data.cityId || testJobs[index].cityId,
          departmentId: data.departmentId || testJobs[index].departmentId,
          description: data.description || testJobs[index].description,
          requirements: data.requirements || testJobs[index].requirements,
          salary: data.salary || testJobs[index].salary,
          type: data.type || testJobs[index].type,
          status: data.status || testJobs[index].status
        };
        jobUpdateTrigger++;
        forceUpdate(jobUpdateTrigger);
        return testJobs[index];
      }
      return null;
    });

    const deleteJobById = vi.fn().mockImplementation(async (id: string) => {
      const index = testJobs.findIndex(j => j._id === id);
      if (index !== -1) {
        testJobs.splice(index, 1);
        jobUpdateTrigger++;
        forceUpdate(jobUpdateTrigger);
        return true;
      }
      return false;
    });

    // Create jobsWithDetails with related data
    const jobsWithDetails = testJobs.map(job => ({
      ...job,
      companyname: job.companyId ? mockCompanies.find(company => company._id === job.companyId)?.name || 'No Company' : 'No Company',
      cityname: job.cityId ? mockCities.find(city => city._id === job.cityId)?.name || 'No City' : 'No City',
      departmentname: job.departmentId ? mockDepartments.find(department => department._id === job.departmentId)?.name || 'No Department' : 'No Department'
    }));

    return {
      jobs: testJobs,
      jobsWithDetails,
      companies: mockCompanies,
      cities: mockCities,
      departments: mockDepartments,
      companyMap: new Map(mockCompanies.map(company => [company._id, company])),
      cityMap: new Map(mockCities.map(city => [city._id, city])),
      departmentMap: new Map(mockDepartments.map(department => [department._id, department])),
      isLoading: false,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      error: null,
      createJob,
      updateJobById,
      deleteJobById,
      refetch: vi.fn(),
    };
  },
}));

// Mock data for companies
export const mockCompanies = [
  { _id: '1', name: 'Acme Corp', address: '123 Main St, Anytown, USA', cityId: 'city1' },
  { _id: '2', name: 'Globex Inc', address: '456 Oak Ave, Somewhere, USA', cityId: 'city2' },
  { _id: '3', name: 'Initech', address: '789 Pine Rd, Elsewhere, USA', cityId: 'city3' },
];

// Mock data for cities
export const mockCities = [
  { _id: 'city1', name: 'Anytown' },
  { _id: 'city2', name: 'Somewhere' },
  { _id: 'city3', name: 'Elsewhere' },
];

// Mock data for jobs
export const mockJobs = [
  { _id: '1', jobtitle: 'Frontend Developer', companyId: '1', cityId: 'city1', departmentId: '1' },
  { _id: '2', jobtitle: 'Backend Engineer', companyId: '2', cityId: 'city2', departmentId: '2' },
  { _id: '3', jobtitle: 'Product Manager', companyId: '3', cityId: 'city3', departmentId: '3' },
];

// Mock data for departments
export const mockDepartments = [
  { _id: '1', name: 'Engineering' },
  { _id: '2', name: 'Marketing' },
  { _id: '3', name: 'Sales' },
];

// Create a dynamic companies state for testing
let testCompanies = [
  { _id: '1', name: 'Acme Corp', address: '123 Main St, Anytown, USA', cityId: 'city1' },
  { _id: '2', name: 'Globex Inc', address: '456 Oak Ave, Somewhere, USA', cityId: 'city2' },
  { _id: '3', name: 'Initech', address: '789 Pine Rd, Elsewhere, USA', cityId: 'city3' },
];
let updateTrigger = 0;

// Create a dynamic departments state for testing
let testDepartments = [...mockDepartments];
let departmentUpdateTrigger = 0;

// Create a dynamic jobs state for testing
let testJobs = [
  { _id: '1', jobtitle: 'Frontend Developer', companyId: '1', cityId: 'city1', departmentId: '1', description: '', requirements: '', salary: '', type: '', status: '' },
  { _id: '2', jobtitle: 'Backend Engineer', companyId: '2', cityId: 'city2', departmentId: '2', description: '', requirements: '', salary: '', type: '', status: '' },
  { _id: '3', jobtitle: 'Product Manager', companyId: '3', cityId: 'city3', departmentId: '3', description: '', requirements: '', salary: '', type: '', status: '' },
];
let jobUpdateTrigger = 0;

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
  testJobs = [
    { _id: '1', jobtitle: 'Frontend Developer', companyId: '1', cityId: 'city1', departmentId: '1', description: '', requirements: '', salary: '', type: '', status: '' },
    { _id: '2', jobtitle: 'Backend Engineer', companyId: '2', cityId: 'city2', departmentId: '2', description: '', requirements: '', salary: '', type: '', status: '' },
    { _id: '3', jobtitle: 'Product Manager', companyId: '3', cityId: 'city3', departmentId: '3', description: '', requirements: '', salary: '', type: '', status: '' },
  ];
  jobUpdateTrigger = 0;
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