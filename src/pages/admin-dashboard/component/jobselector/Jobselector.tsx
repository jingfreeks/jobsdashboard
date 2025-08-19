import {
  Headers,
  SearchFilter,
  JobsList,
  Modals,
  Loading,
  Error,
} from "./component";
import { useJobSelectorHooks } from "./hooks";
const JobSelector = () => {
  const hooks = useJobSelectorHooks();
  // Loading state
  if (hooks.isLoading) {
    return <Loading />;
  }

  // Error state
  if (hooks.error) {
    return <Error />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {/* Toast notifications will appear here */}
      </div>

      <Headers handleAddJob={hooks.handleAddJob} />
      {/* Search and Filter Section */}
      <SearchFilter
        jobsWithDetails={hooks.jobsWithDetails}
        companies={hooks.companies}
        cities={hooks.cities}
        departments={hooks.departments}
        selectedCompanyFilter={hooks.selectedCompanyFilter}
        setSelectedCompanyFilter={hooks.setSelectedCompanyFilter}
        selectedCityFilter={hooks.selectedCityFilter}
        setSelectedCityFilter={hooks.setSelectedCityFilter}
        selectedDepartmentFilter={hooks.selectedDepartmentFilter}
        setSelectedDepartmentFilter={hooks.setSelectedDepartmentFilter}
        searchTerm={hooks.searchTerm}
        setSearchTerm={hooks.setSearchTerm}
        filteredJobs={hooks.filteredJobs}
      />

      {/* Jobs List */}

      <JobsList
        filteredJobs={hooks.filteredJobs}
        handleEditJob={hooks.handleEditJob}
        handleDeleteJob={hooks.handleDeleteJob}
        isDeleting={hooks.isDeleting}
        jobsWithDetails={hooks.jobsWithDetails}
      />

      {/* Add and Edit Job Modal */}

      {hooks.isModalOpen && (
        <Modals
          handleCloseModal={hooks.handleCloseAddJobModal}
          handleActions={
            hooks.editJob ? hooks.handleUpdateJob : hooks.handleCreateJob
          }
          loaders={hooks.isAdding || hooks.isUpdating}
          companies={hooks.companies}
          shifts={hooks.shifts}
          cities={hooks.cities}
          departments={hooks.departments}
          title={hooks.editJob ? "Edit Job" : "Create New Job"}
          editJob={hooks.editJob}
          submitLabel={{
            loading: hooks.editJob ? "Updating" : "Creating...",
            label: hooks.editJob ? "Update" : "Create",
          }}
        />
      )}
    </div>
  );
};

export default JobSelector;
