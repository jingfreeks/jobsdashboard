import React, { useState, useCallback, useMemo } from 'react';
import { PlusCircle, Search, Funnel } from 'lucide-react';
import { useJobOperations } from '@/hooks/useJobOperations';
import { useToast } from '@/hooks/useToast';
import { type Job } from '@/features/jobs';

const JobSelector = () => {
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showEditJobModal, setShowEditJobModal] = useState(false);
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

  // Use toast for notifications
  const { showSuccess, showError } = useToast();

  // Filtered jobs based on search and filters
  const filteredJobs = useMemo(() => {
    return (jobsWithDetails || []).filter((job: any) => {
      const matchesSearch = job.jobtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (job.companyname && job.companyname.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (job.cityname && job.cityname.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (job.departmentname && job.departmentname.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCompanyFilter = !selectedCompanyFilter || job.companyId === selectedCompanyFilter;
      const matchesCityFilter = !selectedCityFilter || job.cityId === selectedCityFilter;
      const matchesDepartmentFilter = !selectedDepartmentFilter || job.departmentId === selectedDepartmentFilter;
      return matchesSearch && matchesCompanyFilter && matchesCityFilter && matchesDepartmentFilter;
    });
  }, [jobsWithDetails, searchTerm, selectedCompanyFilter, selectedCityFilter, selectedDepartmentFilter]);

  // Memoized callbacks for better performance
  const handleAddJob = useCallback(() => setShowAddJobModal(true), []);

  const handleDeleteJob = useCallback(async (jobId: string) => {
    // Find the job title for the confirmation message
    const job = jobsWithDetails.find((j: any) => j._id === jobId);
    const jobTitle = job?.jobtitle || 'this job';
    
    // Show confirmation dialog
    const isConfirmed = window.confirm(`Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`);
    
    if (isConfirmed) {
      const success = await deleteJobById(jobId);
      if (!success) {
        showError('Failed to delete job. Please try again.');
      } else {
        showSuccess(`Job "${jobTitle}" has been deleted successfully.`);
      }
    }
  }, [deleteJobById, jobsWithDetails, showSuccess, showError]);

  const handleEditJob = useCallback((job: Job) => {
    setEditJob(job);
    setShowEditJobModal(true);
  }, []);

  const handleCloseAddJobModal = useCallback(() => {
    setShowAddJobModal(false);
  }, []);

  const handleCreateJob = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const jobData = {
      jobtitle: formData.get('jobtitle') as string,
      companyId: formData.get('companyId') as string || undefined,
      cityId: formData.get('cityId') as string || undefined,
      departmentId: formData.get('departmentId') as string || undefined,
      description: formData.get('description') as string || undefined,
      requirements: formData.get('requirements') as string || undefined,
      salary: formData.get('salary') as string || undefined,
      type: formData.get('type') as string || undefined,
      status: formData.get('status') as string || undefined,
    };

    if (jobData.jobtitle.trim()) {
      const result = await createJob(jobData);
      if (result) {
        setShowAddJobModal(false);
        showSuccess(`Job "${jobData.jobtitle.trim()}" has been created successfully.`);
      } else {
        showError('Failed to create job. Please try again.');
      }
    }
  }, [createJob, showSuccess, showError]);

  const handleCloseEditJobModal = useCallback(() => {
    setShowEditJobModal(false);
    setEditJob(null);
  }, []);

  const handleUpdateJob = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (editJob) {
      const formData = new FormData(e.target as HTMLFormElement);
      const jobData = {
        _id: editJob._id,
        jobtitle: formData.get('jobtitle') as string,
        companyId: formData.get('companyId') as string || undefined,
        cityId: formData.get('cityId') as string || undefined,
        departmentId: formData.get('departmentId') as string || undefined,
        description: formData.get('description') as string || undefined,
        requirements: formData.get('requirements') as string || undefined,
        salary: formData.get('salary') as string || undefined,
        type: formData.get('type') as string || undefined,
        status: formData.get('status') as string || undefined,
      };

      if (jobData.jobtitle.trim()) {
        const result = await updateJobById(jobData);
        if (result) {
          setShowEditJobModal(false);
          setEditJob(null);
          showSuccess(`Job "${jobData.jobtitle.trim()}" has been updated successfully.`);
        } else {
          showError('Failed to update job. Please try again.');
        }
      }
    }
  }, [editJob, updateJobById, showSuccess, showError]);

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading jobs. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {/* Toast notifications will appear here */}
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Jobs List</h2>
        <button
          onClick={handleAddJob}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          <PlusCircle className="w-5 h-5" /> Add Job
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow p-6 border border-slate-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Search jobs, companies, cities, or departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Funnel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white"
              value={selectedCompanyFilter}
              onChange={(e) => setSelectedCompanyFilter(e.target.value)}
            >
              <option value="">All Companies</option>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {(companies as any[])?.map((company: any) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Funnel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white"
              value={selectedCityFilter}
              onChange={(e) => setSelectedCityFilter(e.target.value)}
            >
              <option value="">All Cities</option>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {(cities as any[])?.map((city: any) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Funnel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white"
              value={selectedDepartmentFilter}
              onChange={(e) => setSelectedDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {(departments as any[])?.map((department: any) => (
                <option key={department._id} value={department._id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-slate-600">
          Showing {filteredJobs.length} of {jobsWithDetails?.length || 0} jobs
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
        <div className="grid grid-cols-5 gap-4 pb-3 border-b border-slate-200 mb-4">
          <div className="font-semibold text-slate-800">Job Title</div>
          <div className="font-semibold text-slate-800">Company</div>
          <div className="font-semibold text-slate-800">City</div>
          <div className="font-semibold text-slate-800">Department</div>
          <div className="font-semibold text-slate-800">Actions</div>
        </div>
        
        {filteredJobs.length === 0 ? (
          <div className="text-slate-400 italic text-center py-8">
            {jobsWithDetails?.length === 0 ? 'No jobs' : 'No jobs match your search criteria'}
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredJobs.map((job) => (
              <li key={job._id} className="flex items-center justify-between py-3">
                <div className="flex-1 grid grid-cols-5 gap-4">
                  <span className="truncate text-slate-800 font-medium">
                    {job.jobtitle}
                  </span>
                  <span className="truncate text-slate-600">
                    {job.companyname}
                  </span>
                  <span className="truncate text-slate-600">
                    {job.cityname}
                  </span>
                  <span className="truncate text-slate-600">
                    {job.departmentname}
                  </span>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleEditJob(job)}
                      className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded transition"
                      disabled={isDeleting}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition disabled:opacity-50"
                      disabled={isDeleting}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Job Modal */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseAddJobModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Create New Job
            </h3>
            <form onSubmit={handleCreateJob} className="flex flex-col gap-4">
              <input
                type="text"
                name="jobtitle"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Job Title"
                autoFocus
                required
                disabled={isAdding}
              />
              <select
                name="companyId"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                disabled={isAdding}
              >
                <option value="">Select Company</option>
                {(companies as any[])?.map((company: any) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
              <select
                name="cityId"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                disabled={isAdding}
              >
                <option value="">Select City</option>
                {(cities as any[])?.map((city: any) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>
              <select
                name="departmentId"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                disabled={isAdding}
              >
                <option value="">Select Department</option>
                {(departments as any[])?.map((department: any) => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
              </select>
              <textarea
                name="description"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Job Description"
                rows={3}
                disabled={isAdding}
              />
              <textarea
                name="requirements"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Job Requirements"
                rows={3}
                disabled={isAdding}
              />
              <input
                type="text"
                name="salary"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Salary Range"
                disabled={isAdding}
              />
              <select
                name="type"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                disabled={isAdding}
              >
                <option value="">Select Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
              <select
                name="status"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                disabled={isAdding}
              >
                <option value="">Select Status</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="On Hold">On Hold</option>
              </select>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseAddJobModal}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                  disabled={isAdding}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
                  disabled={isAdding}
                >
                  {isAdding ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditJobModal && editJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseEditJobModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-slate-800">Edit Job</h3>
            <form onSubmit={handleUpdateJob} className="flex flex-col gap-4">
              <input
                type="text"
                name="jobtitle"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Job Title"
                defaultValue={editJob.jobtitle}
                autoFocus
                required
                disabled={isUpdating}
              />
              <select
                name="companyId"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                defaultValue={editJob.companyId || ""}
                disabled={isUpdating}
              >
                <option value="">Select Company</option>
                {(companies as any[])?.map((company: any) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
              <select
                name="cityId"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                defaultValue={editJob.cityId || ""}
                disabled={isUpdating}
              >
                <option value="">Select City</option>
                {(cities as any[])?.map((city: any) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>
              <select
                name="departmentId"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                defaultValue={editJob.departmentId || ""}
                disabled={isUpdating}
              >
                <option value="">Select Department</option>
                {(departments as any[])?.map((department: any) => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
              </select>
              <textarea
                name="description"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Job Description"
                rows={3}
                defaultValue={editJob.description || ""}
                disabled={isUpdating}
              />
              <textarea
                name="requirements"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Job Requirements"
                rows={3}
                defaultValue={editJob.requirements || ""}
                disabled={isUpdating}
              />
              <input
                type="text"
                name="salary"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Salary Range"
                defaultValue={editJob.salary || ""}
                disabled={isUpdating}
              />
              <select
                name="type"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                defaultValue={editJob.type || ""}
                disabled={isUpdating}
              >
                <option value="">Select Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
              <select
                name="status"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                defaultValue={editJob.status || ""}
                disabled={isUpdating}
              >
                <option value="">Select Status</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="On Hold">On Hold</option>
              </select>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseEditJobModal}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSelector;
