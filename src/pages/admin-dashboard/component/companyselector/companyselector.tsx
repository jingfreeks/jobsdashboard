import ToastContainer from "@/components/ToastContainer";
import {
  AddCompanyModal,
  EditCompanyModal,
  SearchFilter,
  Header,
  ConfirmDelete,
  List,
  Loaders,
  ErrorMessage,
} from "./component";
import { useCompanySelectorHooks } from "./hooks";

const CompanySelector = () => {
  const hooks = useCompanySelectorHooks();

  if (hooks.isLoading) {
    return <Loaders />;
  }

  if (hooks.error) {
    return (
      <ErrorMessage
        message={"Failed to load companies. Please try again."}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ToastContainer toasts={hooks.toasts} onRemoveToast={hooks.removeToast} />
      <Header handleAddCompany={hooks.handleAddCompany} />

      <SearchFilter
        companiesWithCities={hooks.companiesWithCities}
        cities={hooks.cities}
        filteredCompanies={hooks.filteredCompanies}
        searchTerm={hooks.searchTerm}
        setSearchTerm={hooks.setSearchTerm}
        selectedCityFilter={hooks.selectedCityFilter}
        setSelectedCityFilter={hooks.setSelectedCityFilter}
      />

      <AddCompanyModal
        isOpen={hooks.showAddCompanyModal}
        newCompanyName={hooks.newCompanyName}
        newCompanyAddress={hooks.newCompanyAddress}
        selectedCityId={hooks.newCompanyCityId}
        cities={hooks.cities}
        onNewCompanyNameChange={hooks.setNewCompanyName}
        onNewCompanyAddressChange={hooks.setNewCompanyAddress}
        onCityChange={hooks.setNewCompanyCityId}
        onSubmit={hooks.handleCreateCompany}
        onClose={hooks.handleCloseAddCompanyModal}
        isAdding={hooks.isAdding}
      />

      <EditCompanyModal
        isOpen={hooks.showEditCompanyModal}
        editCompanyName={hooks.editCompanyName}
        editCompanyAddress={hooks.editCompanyAddress}
        selectedCityId={hooks.editCompanyCityId}
        cities={hooks.cities}
        onEditCompanyNameChange={hooks.setEditCompanyName}
        onEditCompanyAddressChange={hooks.setEditCompanyAddress}
        onCityChange={hooks.setEditCompanyCityId}
        onSubmit={hooks.handleUpdateCompany}
        onClose={hooks.handleCloseEditCompanyModal}
        isUpdating={hooks.isUpdating}
      />

      {hooks.showDeleteConfirmModal && hooks.companyToDelete && (
        <ConfirmDelete
          showDeleteConfirmModal={hooks.showDeleteConfirmModal}
          companyToDelete={hooks.companyToDelete}
          confirmDeleteCompany={hooks.confirmDeleteCompany}
          cancelDeleteCompany={hooks.cancelDeleteCompany}
          isDeleting={hooks.isDeleting}
          companiesWithCities={hooks.companiesWithCities}
        />
      )}

      <List
        filteredCompanies={hooks.filteredCompanies}
        searchTerm={hooks.searchTerm}
        selectedCityFilter={hooks.selectedCityFilter}
        handleEditCompany={hooks.handleEditCompany}
        handleDeleteCompany={hooks.handleDeleteCompany}
        isDeleting={hooks.isDeleting}
      />
    </div>
  );
};

export default CompanySelector;
