import { PlusCircle, Search, Filter, Loader2 } from "lucide-react";
import { useState, useCallback, memo, useMemo } from "react";
import { useCompanyOperations } from "@/hooks/useCompanyOperations";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ToastContainer";
import type { Company } from "@/features/company";

// Memoized Company Item Component
const CompanyItem = memo<{
  company: Company & { cityname: string };
  onEdit: (company: Company) => void;
  onDelete: (companyId: string) => void;
  isDeleting: boolean;
}>(({ company, onEdit, onDelete, isDeleting }) => (
  <li className="flex items-center justify-between py-3">
    <div className="flex-1 grid grid-cols-4 gap-4">
      {/* Company Name */}
      <span className="truncate text-slate-800 font-medium">
        {company.name}
      </span>
      
      {/* Address */}
      <span className="truncate text-slate-600">
        {company.address || 'No address'}
      </span>
      
      {/* City */}
      <span className="truncate text-slate-600">
        {company.cityname || 'No city assigned'}
      </span>
      
      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => onEdit(company)}
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
          onClick={() => onDelete(company._id)}
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
));

CompanyItem.displayName = 'CompanyItem';

// Memoized Add Company Modal Component
const AddCompanyModal = memo<{
  isOpen: boolean;
  newCompanyName: string;
  newCompanyAddress: string;
  selectedCityId: string;
  cities: Array<{ _id: string; name: string }> | undefined;
  onNewCompanyNameChange: (name: string) => void;
  onNewCompanyAddressChange: (address: string) => void;
  onCityChange: (cityId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isAdding: boolean;
}>(({ isOpen, newCompanyName, newCompanyAddress, selectedCityId, cities, onNewCompanyNameChange, onNewCompanyAddressChange, onCityChange, onSubmit, onClose, isAdding }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-slate-800">
          Create New Company
        </h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Company Name"
            value={newCompanyName}
            onChange={(e) => onNewCompanyNameChange(e.target.value)}
            autoFocus
            required
            disabled={isAdding}
          />
          <textarea
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 resize-none"
            placeholder="Company Address"
            value={newCompanyAddress}
            onChange={(e) => onNewCompanyAddressChange(e.target.value)}
            rows={3}
            disabled={isAdding}
          />
          <select
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            value={selectedCityId}
            onChange={(e) => onCityChange(e.target.value)}
            disabled={isAdding}
          >
            <option value="">Select City</option>
            {cities?.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>
          
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
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
  );
});

AddCompanyModal.displayName = 'AddCompanyModal';

// Memoized Edit Company Modal Component
const EditCompanyModal = memo<{
  isOpen: boolean;
  editCompanyName: string;
  editCompanyAddress: string;
  selectedCityId: string;
  cities: Array<{ _id: string; name: string }> | undefined;
  onEditCompanyNameChange: (name: string) => void;
  onEditCompanyAddressChange: (address: string) => void;
  onCityChange: (cityId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isUpdating: boolean;
}>(({ isOpen, editCompanyName, editCompanyAddress, selectedCityId, cities, onEditCompanyNameChange, onEditCompanyAddressChange, onCityChange, onSubmit, onClose, isUpdating }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-slate-800">Edit Company</h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Company Name"
            value={editCompanyName}
            onChange={(e) => onEditCompanyNameChange(e.target.value)}
            autoFocus
            required
            disabled={isUpdating}
          />
          <textarea
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 resize-none"
            placeholder="Company Address"
            value={editCompanyAddress}
            onChange={(e) => onEditCompanyAddressChange(e.target.value)}
            rows={3}
            disabled={isUpdating}
          />
          <select
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            value={selectedCityId}
            onChange={(e) => onCityChange(e.target.value)}
            disabled={isUpdating}
          >
            <option value="">Select City</option>
            {cities?.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
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
  );
});

EditCompanyModal.displayName = 'EditCompanyModal';

const CompanySelector = () => {
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [editCompanyId, setEditCompanyId] = useState<string | null>(null);
  const [editCompanyName, setEditCompanyName] = useState("");
  const [editCompanyAddress, setEditCompanyAddress] = useState("");
  const [editCompanyCityId, setEditCompanyCityId] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyAddress, setNewCompanyAddress] = useState("");
  const [newCompanyCityId, setNewCompanyCityId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCityFilter, setSelectedCityFilter] = useState("");
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);

  // Use optimized company operations hook
  const {
    companiesWithCities,
    cities,
    isLoading,
    error,
    isAdding,
    isUpdating,
    isDeleting,
    createCompany,
    updateCompanyById,
    deleteCompanyById,
  } = useCompanyOperations();

  // Use toast for notifications
  const { toasts, removeToast, showSuccess, showError } = useToast();

  // Filtered companies based on search and city filter
  const filteredCompanies = useMemo(() => {
    return (companiesWithCities || []).filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (company.address && company.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (company.cityname && company.cityname.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCityFilter = !selectedCityFilter || company.cityId === selectedCityFilter;
      return matchesSearch && matchesCityFilter;
    });
  }, [companiesWithCities, searchTerm, selectedCityFilter]);

  // Memoized callbacks for better performance
  const handleAddCompany = useCallback(() => setShowAddCompanyModal(true), []);

  const handleDeleteCompany = useCallback((companyId: string) => {
    setCompanyToDelete(companyId);
    setShowDeleteConfirmModal(true);
  }, []);

  const confirmDeleteCompany = useCallback(async () => {
    if (companyToDelete) {
      const company = companiesWithCities.find(c => c._id === companyToDelete);
      const companyName = company?.name || 'this company';
      
      const success = await deleteCompanyById(companyToDelete);
      if (!success) {
        console.error('Failed to delete company');
        showError('Failed to delete company. Please try again.');
      } else {
        showSuccess(`Company "${companyName}" has been deleted successfully.`);
      }
      setShowDeleteConfirmModal(false);
      setCompanyToDelete(null);
    }
  }, [companyToDelete, deleteCompanyById, companiesWithCities, showSuccess, showError]);

  const cancelDeleteCompany = useCallback(() => {
    setShowDeleteConfirmModal(false);
    setCompanyToDelete(null);
  }, []);

  const handleEditCompany = useCallback((company: Company) => {
    setEditCompanyId(company._id);
    setEditCompanyName(company.name);
    setEditCompanyAddress(company.address || "");
    setEditCompanyCityId(company.cityId || "");
    setShowEditCompanyModal(true);
  }, []);

  const handleCloseAddCompanyModal = useCallback(() => {
    setShowAddCompanyModal(false);
    setNewCompanyName("");
    setNewCompanyAddress("");
    setNewCompanyCityId("");
  }, []);

  const handleCreateCompany = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCompanyName.trim()) {
      const result = await createCompany({ 
        name: newCompanyName.trim(),
        address: newCompanyAddress.trim(),
        cityId: newCompanyCityId || undefined
      });
      
      if (result) {
        setNewCompanyName("");
        setNewCompanyAddress("");
        setNewCompanyCityId("");
        setShowAddCompanyModal(false);
        showSuccess(`Company "${newCompanyName.trim()}" has been created successfully.`);
      } else {
        showError('Failed to create company. Please try again.');
      }
    }
  }, [newCompanyName, newCompanyAddress, newCompanyCityId, createCompany, showSuccess, showError]);

  const handleCloseEditCompanyModal = useCallback(() => {
    setShowEditCompanyModal(false);
    setEditCompanyId(null);
    setEditCompanyName("");
    setEditCompanyAddress("");
    setEditCompanyCityId("");
  }, []);

  const handleUpdateCompany = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (editCompanyId && editCompanyName.trim()) {
      const result = await updateCompanyById({ 
        _id: editCompanyId, 
        name: editCompanyName.trim(),
        address: editCompanyAddress.trim(),
        cityId: editCompanyCityId || undefined
      });
      if (result) {
        setShowEditCompanyModal(false);
        setEditCompanyId(null);
        setEditCompanyName("");
        setEditCompanyAddress("");
        setEditCompanyCityId("");
        showSuccess(`Company "${editCompanyName.trim()}" has been updated successfully.`);
      } else {
        showError('Failed to update company. Please try again.');
      }
    }
  }, [editCompanyId, editCompanyName, editCompanyAddress, editCompanyCityId, updateCompanyById, showSuccess, showError]);

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-slate-600">Loading companies...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load companies. Please try again.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Company List</h2>
        <button
          onClick={handleAddCompany}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          <PlusCircle className="w-5 h-5" /> Add Company
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow p-6 border border-slate-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search companies, addresses, or cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          {/* City Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select
              value={selectedCityFilter}
              onChange={(e) => setSelectedCityFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white"
            >
              <option value="">All Cities</option>
              {cities?.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Results count */}
        <div className="mt-4 text-sm text-slate-600">
          Showing {filteredCompanies.length} of {companiesWithCities?.length || 0} companies
        </div>
      </div>

      {/* Add Company Modal */}
      <AddCompanyModal
        isOpen={showAddCompanyModal}
        newCompanyName={newCompanyName}
        newCompanyAddress={newCompanyAddress}
        selectedCityId={newCompanyCityId}
        cities={cities}
        onNewCompanyNameChange={setNewCompanyName}
        onNewCompanyAddressChange={setNewCompanyAddress}
        onCityChange={setNewCompanyCityId}
        onSubmit={handleCreateCompany}
        onClose={handleCloseAddCompanyModal}
        isAdding={isAdding}
      />

      {/* Edit Company Modal */}
      <EditCompanyModal
        isOpen={showEditCompanyModal}
        editCompanyName={editCompanyName}
        editCompanyAddress={editCompanyAddress}
        selectedCityId={editCompanyCityId}
        cities={cities}
        onEditCompanyNameChange={setEditCompanyName}
        onEditCompanyAddressChange={setEditCompanyAddress}
        onCityChange={setEditCompanyCityId}
        onSubmit={handleUpdateCompany}
        onClose={handleCloseEditCompanyModal}
        isUpdating={isUpdating}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && companyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Confirm Delete
            </h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete "{companiesWithCities.find(c => c._id === companyToDelete)?.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={cancelDeleteCompany}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCompany}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold flex items-center gap-2"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 pb-3 border-b border-slate-200 mb-4">
          <div className="font-semibold text-slate-800">Company Name</div>
          <div className="font-semibold text-slate-800">Address</div>
          <div className="font-semibold text-slate-800">City</div>
          <div className="font-semibold text-slate-800">Actions</div>
        </div>
        
        {filteredCompanies.length === 0 ? (
          <div className="text-slate-400 italic text-center py-8">
            {searchTerm || selectedCityFilter ? 'No companies match your search criteria' : 'No companies'}
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredCompanies.map((company) => (
              <CompanyItem
                key={company._id}
                company={company}
                onEdit={handleEditCompany}
                onDelete={handleDeleteCompany}
                isDeleting={isDeleting}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CompanySelector;
