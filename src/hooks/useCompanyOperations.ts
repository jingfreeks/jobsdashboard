import { useCallback, useMemo } from 'react';
import {
  useGetCompaniesQuery,
  useAddCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  type Company,
  type CompanyFormData,
  type UpdateCompanyData,
} from '@/features/company';
import { useGetCitiesQuery } from '@/features/city';

export const useCompanyOperations = () => {
  const { data: companies = [], isLoading, error, refetch } = useGetCompaniesQuery(undefined) as { data: Company[], isLoading: boolean, error: unknown, refetch: () => void };
  const { data: cities = [] } = useGetCitiesQuery(undefined) as { data: Array<{ _id: string; name: string }> };
  const [addCompany, { isLoading: isAdding }] = useAddCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();
  const [deleteCompany, { isLoading: isDeleting }] = useDeleteCompanyMutation();

  // Memoized sorted companies for performance
  const sortedCompanies = useMemo(() => {
    return [...companies].sort((a, b) => a.name.localeCompare(b.name));
  }, [companies]);

  // Memoized company map for quick lookups
  const companyMap = useMemo(() => {
    return new Map(companies.map(company => [company._id, company]));
  }, [companies]);

  // Memoized city map for quick lookups
  const cityMap = useMemo(() => {
    return new Map(cities.map(city => [city._id, city]));
  }, [cities]);

  // Companies with city names for display
  const companiesWithCities = useMemo(() => {
    return companies.map(company => ({
      ...company,
      cityname: company.cityId && cityMap.get(company.cityId)?.name || 'No City'
    }));
  }, [companies, cityMap]);

  // Wrapped operations with error handling
  const createCompany = useCallback(async (data: CompanyFormData): Promise<Company | null> => {
    try {
      const result = await addCompany(data).unwrap() as Company;
      return result;
    } catch (error) {
      console.error('Failed to create company:', error);
      return null;
    }
  }, [addCompany]);

  const updateCompanyById = useCallback(async (data: UpdateCompanyData): Promise<Company | null> => {
    try {
      const result = await updateCompany(data).unwrap() as Company;
      return result;
    } catch (error) {
      console.error('Failed to update company:', error);
      return null;
    }
  }, [updateCompany]);

  const deleteCompanyById = useCallback(async (companyId: string): Promise<boolean> => {
    try {
      await deleteCompany({ _id: companyId }).unwrap();
      return true;
    } catch (error) {
      console.error('Failed to delete company:', error);
      return false;
    }
  }, [deleteCompany]);

  return {
    // Data
    companies: sortedCompanies,
    companiesWithCities,
    cities,
    companyMap,
    cityMap,
    
    // Loading states
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    
    // Error state
    error,
    
    // Operations
    createCompany,
    updateCompanyById,
    deleteCompanyById,
    refetch,
  };
}; 