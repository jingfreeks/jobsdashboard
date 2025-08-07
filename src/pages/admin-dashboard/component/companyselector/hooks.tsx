import { useState, useCallback, useMemo } from "react";
import { useCompanyOperations } from "@/hooks/useCompanyOperations";
import { useToast } from "@/hooks/useToast";
import type { Company } from "@/features/company";

export const useCompanySelectorHooks = () => {
  // Modal and form state
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

  // Data and toast hooks
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
  const { toasts, removeToast, showSuccess, showError } = useToast();

  // Memoized filtered companies for performance
  const filteredCompanies = useMemo(() => {
    if (!companiesWithCities) return [];
    const search = searchTerm.trim().toLowerCase();
    return companiesWithCities.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(search) ||
        (company.address && company.address.toLowerCase().includes(search)) ||
        (company.cityname && company.cityname.toLowerCase().includes(search));
      const matchesCityFilter =
        !selectedCityFilter || company.cityId === selectedCityFilter;
      return matchesSearch && matchesCityFilter;
    });
  }, [companiesWithCities, searchTerm, selectedCityFilter]);

  // Handlers
  const handleAddCompany = useCallback(() => setShowAddCompanyModal(true), []);

  const handleCreateCompany = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const name = newCompanyName.trim();
      if (!name) return;
      const result = await createCompany({
        name,
        address: newCompanyAddress.trim(),
        cityId: newCompanyCityId || undefined,
      });
      if (result) {
        setNewCompanyName("");
        setNewCompanyAddress("");
        setNewCompanyCityId("");
        setShowAddCompanyModal(false);
        showSuccess(`Company "${name}" has been created successfully.`);
      } else {
        showError("Failed to create company. Please try again.");
      }
    },
    [
      newCompanyName,
      createCompany,
      newCompanyAddress,
      newCompanyCityId,
      showSuccess,
      showError,
    ]
  );

  const handleUpdateCompany = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const name = editCompanyName.trim();
      if (!editCompanyId || !name) return;
      const result = await updateCompanyById({
        _id: editCompanyId,
        name,
        address: editCompanyAddress.trim(),
        cityId: editCompanyCityId || undefined,
      });
      if (result) {
        setShowEditCompanyModal(false);
        setEditCompanyId(null);
        setEditCompanyName("");
        setEditCompanyAddress("");
        setEditCompanyCityId("");
        showSuccess(`Company "${name}" has been updated successfully.`);
      } else {
        showError("Failed to update company. Please try again.");
      }
    },
    [
      editCompanyId,
      editCompanyName,
      updateCompanyById,
      editCompanyAddress,
      editCompanyCityId,
      showSuccess,
      showError,
    ]
  );

  const confirmDeleteCompany = useCallback(async () => {
    if (!companyToDelete) return;
    const company = companiesWithCities?.find((c) => c._id === companyToDelete);
    const companyName = company?.name || "this company";
    const success = await deleteCompanyById(companyToDelete);
    if (success) {
      showSuccess(`Company "${companyName}" has been deleted successfully.`);
    } else {
      showError("Failed to delete company. Please try again.");
    }
    setShowDeleteConfirmModal(false);
    setCompanyToDelete(null);
  }, [
    companyToDelete,
    companiesWithCities,
    deleteCompanyById,
    showError,
    showSuccess,
  ]);

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

  const handleCloseEditCompanyModal = useCallback(() => {
    setShowEditCompanyModal(false);
    setEditCompanyId(null);
    setEditCompanyName("");
    setEditCompanyAddress("");
    setEditCompanyCityId("");
  }, []);

  const handleDeleteCompany = useCallback(
    (companyId: string) => {
      setCompanyToDelete(companyId);
      setShowDeleteConfirmModal(true);
    },
    []
  );

  // Return all state and handlers
  return {
    // Modal state
    showAddCompanyModal,
    setShowAddCompanyModal,
    showEditCompanyModal,
    setShowEditCompanyModal,
    showDeleteConfirmModal,
    setShowDeleteConfirmModal,
    // Company form state
    editCompanyId,
    setEditCompanyId,
    editCompanyName,
    setEditCompanyName,
    editCompanyAddress,
    setEditCompanyAddress,
    editCompanyCityId,
    setEditCompanyCityId,
    newCompanyName,
    setNewCompanyName,
    newCompanyAddress,
    setNewCompanyAddress,
    newCompanyCityId,
    setNewCompanyCityId,
    // Filters
    searchTerm,
    setSearchTerm,
    selectedCityFilter,
    setSelectedCityFilter,
    // Delete
    companyToDelete,
    setCompanyToDelete,
    // Data
    filteredCompanies,
    companiesWithCities,
    cities,
    isLoading,
    error,
    isAdding,
    isUpdating,
    isDeleting,
    toasts,
    removeToast,
    // Handlers
    handleAddCompany,
    handleCreateCompany,
    handleUpdateCompany,
    confirmDeleteCompany,
    cancelDeleteCompany,
    handleEditCompany,
    handleCloseAddCompanyModal,
    handleCloseEditCompanyModal,
    handleDeleteCompany,
  };
};
