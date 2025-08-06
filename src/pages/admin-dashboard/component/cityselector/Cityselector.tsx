import { PlusCircle, Loader2 } from "lucide-react";
import { useCallback, memo, useMemo, Suspense, useState } from "react";
import { useCityOperations } from "@/hooks/useCityOperations";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ToastContainer";
import type { City } from "@/features/city";
import { useUploadImageMutation } from "@/features/city";
import { CityList, CityModal, LoadingSpinner, EmptyState } from "./component";
import { Cityselectorhooks } from "./hooks";

const Cityselector = () => {
  const {
    showAddCityModal,
    showEditCityModal,
    editCityId,
    editCityName,
    editStateId,
    newCityName,
    newStateId,
    newImage,
    newImagePreview,
    searchTerm,
    selectedStateFilter,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    setNewCityName,
    setNewStateId,
    setNewImage,
    setNewImagePreview,
    setEditCityName,
    setEditStateId,
    setSearchTerm,
    setStateFilter,
  } = Cityselectorhooks();

  // Use optimized city operations hook
  const {
    citiesWithStates,
    states,
    cityMap,
    isLoading,
    error,
    isAdding,
    isUpdating,
    isDeleting,
    createCity,
    updateCityById,
    deleteCityById,
  } = useCityOperations();

  // Use upload image mutation
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  // Use toast for notifications
  const { toasts, removeToast, showSuccess, showError } = useToast();

  // Delete confirmation modal state
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<string | null>(null);

  // Memoized callbacks for better performance
  const handleAddCity = useCallback(() => openAddModal(), [openAddModal]);

  const handleEditCity = useCallback((city: City) => {
    openEditModal(city._id, city.name, city.stateId || "");
  }, [openEditModal]);

  const handleDeleteCity = useCallback((cityId: string) => {
    setCityToDelete(cityId);
    setShowDeleteConfirmModal(true);
  }, []);

  const confirmDeleteCity = useCallback(async () => {
    if (cityToDelete) {
      const city = cityMap.get(cityToDelete);
      const cityName = city?.name || "this city";
      
      const success = await deleteCityById(cityToDelete);
      if (!success) {
        console.error("Failed to delete city");
        showError("Failed to delete city. Please try again.");
      } else {
        showSuccess(`City "${cityName}" has been deleted successfully.`);
      }
      setShowDeleteConfirmModal(false);
      setCityToDelete(null);
    }
  }, [cityToDelete, deleteCityById, cityMap, showSuccess, showError]);

  const cancelDeleteCity = useCallback(() => {
    setShowDeleteConfirmModal(false);
    setCityToDelete(null);
  }, []);

  const handleCreateCity = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (newCityName.trim()) {
        try {
          let imageUrl: string | undefined;
          
          // Upload image first if selected
          if (newImage) {
            const uploadResult = await uploadImage({
              file: newImage
            }).unwrap();
            imageUrl = (uploadResult as { url: string }).url;
          }
          
          // Create city with image URL
          const result = await createCity({ 
            name: newCityName.trim(),
            stateId: newStateId || undefined,
            image: imageUrl
          });
          
          if (result) {
            closeAddModal();
            showSuccess(`City "${newCityName.trim()}" has been created successfully.`);
          } else {
            showError("Failed to create city. Please try again.");
          }
        } catch (error) {
          console.error('Error creating city:', error);
          showError('Failed to create city. Please try again.');
        }
      }
    },
    [newCityName, newStateId, newImage, uploadImage, createCity, closeAddModal, showSuccess, showError]
  );

  const handleUpdateCity = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (editCityId && editCityName.trim()) {
        const result = await updateCityById({ 
          _id: editCityId, 
          name: editCityName.trim(),
          stateId: editStateId || undefined
        });
        if (result) {
          closeEditModal();
          showSuccess(`City "${editCityName.trim()}" has been updated successfully.`);
        } else {
          showError("Failed to update city. Please try again.");
        }
      }
    },
    [editCityId, editCityName, editStateId, updateCityById, closeEditModal, showSuccess, showError]
  );

  // Memoized computed values
  const hasCities = useMemo(() => citiesWithStates.length > 0, [citiesWithStates.length]);

  // Loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load cities. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">City List</h2>
        <button
          onClick={handleAddCity}
          disabled={isAdding}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          {isAdding ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <PlusCircle className="w-5 h-5" />
          )}
          {isAdding ? "Adding..." : "Add City"}
        </button>
      </div>

      {/* Add City Modal */}
      <CityModal
        isOpen={showAddCityModal}
        title="Create New City"
        cityName={newCityName}
        selectedStateId={newStateId}
        selectedImage={newImage}
        imagePreview={newImagePreview}
        states={states}
        onCityNameChange={setNewCityName}
        onStateChange={setNewStateId}
        onImageChange={setNewImage}
        onImagePreviewChange={setNewImagePreview}
        onSubmit={handleCreateCity}
        onClose={closeAddModal}
        isLoading={isAdding}
        isUploading={isUploading}
        submitText="Create"
        showImageUpload={true}
      />

      {/* Edit City Modal */}
      <CityModal
        isOpen={showEditCityModal}
        title="Edit City"
        cityName={editCityName}
        selectedStateId={editStateId}
        states={states}
        onCityNameChange={setEditCityName}
        onStateChange={setEditStateId}
        onSubmit={handleUpdateCity}
        onClose={closeEditModal}
        isLoading={isUpdating}
        submitText="Update"
        showImageUpload={false}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && cityToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Confirm Delete
            </h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete "{cityMap.get(cityToDelete)?.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={cancelDeleteCity}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCity}
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

      {/* City List or Empty State */}
      <Suspense fallback={<LoadingSpinner />}>
        {hasCities ? (
          <CityList
            citiesWithStates={citiesWithStates}
            states={states}
            searchTerm={searchTerm}
            selectedStateFilter={selectedStateFilter}
            onSearchChange={setSearchTerm}
            onStateFilterChange={setStateFilter}
            onEdit={handleEditCity}
            onDelete={handleDeleteCity}
            isDeleting={isDeleting}
          />
        ) : (
          <EmptyState />
        )}
      </Suspense>
    </div>
  );
};

export default memo(Cityselector);
