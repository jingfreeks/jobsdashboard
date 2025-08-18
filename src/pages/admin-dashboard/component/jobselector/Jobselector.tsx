 
import {
  Headers,
  SearchFilter,
  JobsList,
  AddModal,
  EditModal,
  Loading,
  Error
} from "./component";
import {useJobSelectorHooks} from "./hooks";
const JobSelector = () => {
  const hooks = useJobSelectorHooks();
  // Loading state
  if (hooks.isLoading) {
    return (
      <Loading />
    );
  }

  // Error state
  if (hooks.error) {
    return (
      <Error />
    );
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
      {/* Add Job Modal */}
      {hooks.showAddJobModal && (
        <AddModal
          isAdding={hooks.isAdding}
          handleCloseAddJobModal={hooks.handleCloseAddJobModal}
          handleCreateJob={hooks.handleCreateJob}
          companies={hooks.companies}
          cities={hooks.cities}
          departments={hooks.departments}
        />
      )}

      {/* Edit Job Modal */}
      {hooks.showEditJobModal && hooks.editJob && (
        <EditModal
          handleCloseEditJobModal={hooks.handleCloseEditJobModal}
          handleUpdateJob={hooks.handleUpdateJob}
          isUpdating={hooks.isUpdating}
          editJob={hooks.editJob}
          companies={hooks.companies}
          cities={hooks.cities}
          departments={hooks.departments}
        />
      )}
    </div>
  );
};

export default JobSelector;
