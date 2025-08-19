import React, { useState, useCallback, useMemo } from "react";
import { useJobOperations } from "@/hooks/useJobOperations";
import {useShiftOperations} from "@/hooks/useShiftOperations";
import { useToast } from "@/hooks/useToast";
import { type Job } from "@/features/jobs";

export const useJobSelectorHooks = () => {
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showEditJobModal, setShowEditJobModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("");
  const [selectedCityFilter, setSelectedCityFilter] = useState("");
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState("");

  // Use job operations hook
  const {
    jobsWithDetails,
    companies,
    cities,
    departments,
    isLoading,
    error,
    isAdding,
    isUpdating,
    isDeleting,
    createJob,
    updateJobById,
    deleteJobById,
  } = useJobOperations();
  const {shifts} = useShiftOperations();
  // Use toast for notifications
  const { showSuccess, showError } = useToast();

  const filteredJobs = useMemo(() => {
    return (jobsWithDetails || []).filter((job: Job) => {
      const matchesSearch =
        job.jobtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.companyname &&
          job.companyname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.cityname &&
          job.cityname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.departmentname &&
          job.departmentname.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCompanyFilter =
        !selectedCompanyFilter || job.companyId === selectedCompanyFilter;
      const matchesCityFilter =
        !selectedCityFilter || job.cityId === selectedCityFilter;
      const matchesDepartmentFilter =
        !selectedDepartmentFilter ||
        job.departmentId === selectedDepartmentFilter;
      return (
        matchesSearch &&
        matchesCompanyFilter &&
        matchesCityFilter &&
        matchesDepartmentFilter
      );
    });
  }, [
    jobsWithDetails,
    searchTerm,
    selectedCompanyFilter,
    selectedCityFilter,
    selectedDepartmentFilter,
  ]);

  // Memoized callbacks for better performance
  const handleAddJob = useCallback(() => setIsModalOpen(true), []);

  const handleDeleteJob = useCallback(
    async (jobId: string) => {
      // Find the job title for the confirmation message
      const job = jobsWithDetails.find((j: Job) => j._id === jobId);
      const jobTitle = job?.jobtitle || "this job";

      // Show confirmation dialog
      const isConfirmed = window.confirm(
        `Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`
      );

      if (isConfirmed) {
        const success = await deleteJobById(jobId);
        if (!success) {
          showError("Failed to delete job. Please try again.");
        } else {
          showSuccess(`Job "${jobTitle}" has been deleted successfully.`);
        }
      }
    },
    [deleteJobById, jobsWithDetails, showSuccess, showError]
  );

  const handleEditJob = useCallback((job: Job) => {
    setEditJob(job);
    setIsModalOpen(true);
  }, []);

  const handleCloseAddJobModal = useCallback(() => {
    setIsModalOpen(false);
    setEditJob(null);
  }, []);

  const handleCreateJob = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const jobData = {
        jobtitle: formData.get("jobtitle") as string,
        compId: (formData.get("companyId") as string) || undefined,
        cityId: (formData.get("cityId") as string) || undefined,
        deptId: (formData.get("departmentId") as string) || undefined,
        description: (formData.get("jobDescription") as string) || undefined,
        requirements: (formData.get("jobRequirements") as string) || undefined,
        salaryrange: (formData.get("salary") as string) || undefined,
        jobType: (formData.get("type") as string) || undefined,
        status: (formData.get("status") as string) || undefined,
        shiftId: (formData.get("shiftId") as string) || undefined,
      };
      if (jobData.jobtitle.trim()) {
        const result = await createJob(jobData);
        if (result) {
          setShowAddJobModal(false);
          setIsModalOpen(false)
          showSuccess(
            `Job "${jobData.jobtitle.trim()}" has been created successfully.`
          );
        } else {
          showError("Failed to create job. Please try again.");
        }
      }
    },
    [createJob, showSuccess, showError]
  );

  const handleCloseEditJobModal = useCallback(() => {
    setShowEditJobModal(false);
    setEditJob(null);
  }, []);

  const handleUpdateJob = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (editJob) {
        const formData = new FormData(e.target as HTMLFormElement);
        const jobData = {
          _id: editJob._id,
          jobtitle: formData.get("jobtitle") as string,
          companyId: (formData.get("companyId") as string) || undefined,
          cityId: (formData.get("cityId") as string) || undefined,
          departmentId: (formData.get("departmentId") as string) || undefined,
          description: (formData.get("description") as string) || undefined,
          requirements: (formData.get("requirements") as string) || undefined,
          salary: (formData.get("salary") as string) || undefined,
          type: (formData.get("type") as string) || undefined,
          status: (formData.get("status") as string) || undefined,
        };

        if (jobData.jobtitle.trim()) {
          const result = await updateJobById(jobData);
          if (result) {
            setShowEditJobModal(false);
            setIsModalOpen(false)
            setEditJob(null);
            showSuccess(
              `Job "${jobData.jobtitle.trim()}" has been updated successfully.`
            );
          } else {
            showError("Failed to update job. Please try again.");
          }
        }
      }
    },
    [editJob, updateJobById, showSuccess, showError]
  );
  return {
    showAddJobModal,
    setShowAddJobModal,
    showEditJobModal,
    setShowEditJobModal,
    editJob,
    setEditJob,
    searchTerm,
    setSearchTerm,
    selectedCompanyFilter,
    setSelectedCompanyFilter,
    selectedCityFilter,
    setSelectedCityFilter,
    selectedDepartmentFilter,
    setSelectedDepartmentFilter,
    jobsWithDetails,
    companies,
    cities,
    departments,
    isLoading,
    error,
    isAdding,
    isUpdating,
    isDeleting,
    createJob,
    updateJobById,
    deleteJobById,
    showSuccess,
    showError,
    filteredJobs,
    handleAddJob,
    handleDeleteJob,
    handleEditJob,
    handleCloseAddJobModal,
    handleCreateJob,
    handleCloseEditJobModal,
    handleUpdateJob,
    isModalOpen, setIsModalOpen,
    shifts
  };
};
