import { useMemo } from 'react';
import { 
  useGetJobsQuery, 
  useAddJobMutation, 
  useUpdateJobMutation, 
  useDeleteJobMutation,
  type Job,
  type JobFormData,
  type UpdateJobData
} from '@/features/jobs';
import { useGetCompaniesQuery } from '@/features/company';
import { useGetCitiesQuery } from '@/features/city';
import { useGetDepartmentsQuery } from '@/features/department';

export const useJobOperations = () => {
  // Fetch jobs data
  const { 
    data: jobs = [], 
    isLoading, 
    error, 
    refetch 
  } = useGetJobsQuery();

  // Fetch related data
  const { data: companies = [] } = useGetCompaniesQuery();
  const { data: cities = [] } = useGetCitiesQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();

  // Mutations
  const [addJob, { isLoading: isAdding }] = useAddJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();

  // Create maps for efficient lookups
  const companyMap = useMemo(() => {
    return new Map(companies.map(company => [company._id, company]));
  }, [companies]);

  const cityMap = useMemo(() => {
    return new Map(cities.map(city => [city._id, city]));
  }, [cities]);

  const departmentMap = useMemo(() => {
    return new Map(departments.map(department => [department._id, department]));
  }, [departments]);

  console.log('Company Map:', jobs[0]);
  // Enhanced jobs with related data
  const jobsWithDetails = useMemo(() => {
    return jobs.map(job => ({
      ...job,
      companyname: job.companyId && companyMap.get(job.companyId)?.name || 'No Company',
      cityname: job.cityId && cityMap.get(job.cityId)?.name || 'No City',
      departmentname: job.departmentId && departmentMap.get(job.departmentId)?.name || 'No Department'
    }));
  }, [jobs, companyMap, cityMap, departmentMap]);

  // Job operations
  const createJob = async (jobData: JobFormData): Promise<Job | null> => {
    try {
      const result = await addJob(jobData).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to create job:', error);
      return null;
    }
  };

  const updateJobById = async (jobData: UpdateJobData): Promise<Job | null> => {
    try {
      const result = await updateJob(jobData).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to update job:', error);
      return null;
    }
  };

  const deleteJobById = async (jobId: string): Promise<boolean> => {
    try {
      const result = await deleteJob(jobId).unwrap();
      return result.success;
    } catch (error) {
      console.error('Failed to delete job:', error);
      return false;
    }
  };

  return {
    // Data
    jobs,
    jobsWithDetails,
    companies,
    cities,
    departments,
    companyMap,
    cityMap,
    departmentMap,
    
    // Loading states
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    
    // Error state
    error,
    
    // Operations
    createJob,
    updateJobById,
    deleteJobById,
    refetch,
  };
}; 