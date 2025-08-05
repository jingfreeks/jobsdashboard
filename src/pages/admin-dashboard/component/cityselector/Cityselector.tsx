import { PlusCircle, Search, Filter, Upload, X } from "lucide-react";
import { useState, useCallback, memo, useMemo } from "react";
import { useCityOperations } from "@/hooks/useCityOperations";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ToastContainer";
import type { City } from "@/features/city";
import { useUploadImageMutation } from "@/features/city";

// Memoized City Item Component
const CityItem = memo<{
  city: City & { statename: string };
  onEdit: (city: City) => void;
  onDelete: (cityId: string) => void;
  isDeleting: boolean;
}>(({ city, onEdit, onDelete, isDeleting }) => (
  <li className="flex items-center justify-between py-3">
    <div className="flex-1 grid grid-cols-4 gap-4">
      {/* City Image */}
      <div className="flex items-center">
        {city.image ? (
          <img
            src={city.image}
            alt={`${city.name} city`}
            className="w-12 h-12 object-cover rounded-lg border border-slate-200"
          />
        ) : (
          <div className="w-12 h-12 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
            <span className="text-slate-400 text-xs">No img</span>
          </div>
        )}
      </div>
      
      {/* City Name */}
      <span className="truncate text-slate-800 font-medium">
        {city.name}
      </span>
      
      {/* State */}
      <span className="truncate text-slate-600">
        {city.statename}
      </span>
      
      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => onEdit(city)}
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
          onClick={() => onDelete(city._id)}
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

CityItem.displayName = 'CityItem';

// Memoized Add City Modal Component
const AddCityModal = memo<{
  isOpen: boolean;
  newCityName: string;
  selectedStateId: string;
  selectedImage: File | null;
  imagePreview: string | null;
  states: Array<{ _id: string; name: string }> | undefined;
  onNewCityNameChange: (name: string) => void;
  onStateChange: (stateId: string) => void;
  onImageChange: (file: File | null) => void;
  onImagePreviewChange: (preview: string | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isAdding: boolean;
  isUploading: boolean;
}>(({ isOpen, newCityName, selectedStateId, selectedImage, imagePreview, states, onNewCityNameChange, onStateChange, onImageChange, onImagePreviewChange, onSubmit, onClose, isAdding, isUploading }) => {
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
          Create New City
        </h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="City Name"
            value={newCityName}
            onChange={(e) => onNewCityNameChange(e.target.value)}
            autoFocus
            required
            disabled={isAdding}
          />
          <select
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            value={selectedStateId}
            onChange={(e) => onStateChange(e.target.value)}
            disabled={isAdding}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state._id} value={state._id}>
                {state.name}
              </option>
            ))}
          </select>
          
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">City Image</label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    onImageChange(null);
                    onImagePreviewChange(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onImageChange(file);
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        onImagePreviewChange(e.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                  id="image-upload"
                  disabled={isAdding}
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer text-sm text-slate-600 hover:text-blue-600"
                >
                  Click to upload image
                </label>
              </div>
            )}
          </div>
          
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
              disabled={isAdding || isUploading}
            >
              {isAdding || isUploading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

AddCityModal.displayName = 'AddCityModal';

// Memoized Edit City Modal Component
const EditCityModal = memo<{
  isOpen: boolean;
  editCityName: string;
  selectedStateId: string;
  states: Array<{ _id: string; name: string }> | undefined;
  onEditCityNameChange: (name: string) => void;
  onStateChange: (stateId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isUpdating: boolean;
}>(({ isOpen, editCityName, selectedStateId, states, onEditCityNameChange, onStateChange, onSubmit, onClose, isUpdating }) => {
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
        <h3 className="text-xl font-bold mb-4 text-slate-800">Edit City</h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="City Name"
            value={editCityName}
            onChange={(e) => onEditCityNameChange(e.target.value)}
            autoFocus
            required
            disabled={isUpdating}
          />
          <select
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            value={selectedStateId}
            onChange={(e) => onStateChange(e.target.value)}
            disabled={isUpdating}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state._id} value={state._id}>
                {state.name}
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

EditCityModal.displayName = 'EditCityModal';

const CitySelector = () => {
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [showEditCityModal, setShowEditCityModal] = useState(false);
  const [editCityId, setEditCityId] = useState<string | null>(null);
  const [editCityName, setEditCityName] = useState("");
  const [editStateId, setEditStateId] = useState("");
  const [newCityName, setNewCityName] = useState("");
  const [newStateId, setNewStateId] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStateFilter, setSelectedStateFilter] = useState("");

  // Use optimized city operations hook
  const {
    citiesWithStates,
    states,
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

  // Filtered cities based on search and state filter
  const filteredCities = useMemo(() => {
    return citiesWithStates.filter(city => {
      const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           city.statename.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStateFilter = !selectedStateFilter || city.stateId === selectedStateFilter;
      return matchesSearch && matchesStateFilter;
    });
  }, [citiesWithStates, searchTerm, selectedStateFilter]);

  // Memoized callbacks for better performance
  const handleAddCity = useCallback(() => setShowAddCityModal(true), []);

  const handleDeleteCity = useCallback(async (cityId: string) => {
    // Find the city name for the confirmation message
    const city = citiesWithStates.find(c => c._id === cityId);
    const cityName = city?.name || 'this city';
    
    // Show confirmation dialog
    const isConfirmed = window.confirm(`Are you sure you want to delete "${cityName}"? This action cannot be undone.`);
    
    if (isConfirmed) {
      const success = await deleteCityById(cityId);
      if (!success) {
        console.error('Failed to delete city');
        showError('Failed to delete city. Please try again.');
      } else {
        showSuccess(`City "${cityName}" has been deleted successfully.`);
      }
    }
  }, [deleteCityById, citiesWithStates, showSuccess, showError]);

  const handleEditCity = useCallback((city: City) => {
    setEditCityId(city._id);
    setEditCityName(city.name);
    setEditStateId(city.stateId || "");
    setShowEditCityModal(true);
  }, []);

  const handleCloseAddCityModal = useCallback(() => {
    setShowAddCityModal(false);
    setNewCityName("");
    setNewStateId("");
    setNewImage(null);
    setNewImagePreview(null);
  }, []);

  const handleCreateCity = useCallback(async (e: React.FormEvent) => {
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
          setNewCityName("");
          setNewStateId("");
          setNewImage(null);
          setNewImagePreview(null);
          setShowAddCityModal(false);
          showSuccess(`City "${newCityName.trim()}" has been created successfully.`);
        } else {
          showError('Failed to create city. Please try again.');
        }
      } catch (error) {
        console.error('Error creating city:', error);
        showError('Failed to create city. Please try again.');
      }
    }
  }, [newCityName, newStateId, newImage, uploadImage, createCity, showSuccess, showError]);

  const handleCloseEditCityModal = useCallback(() => {
    setShowEditCityModal(false);
    setEditCityId(null);
    setEditCityName("");
    setEditStateId("");
  }, []);

  const handleUpdateCity = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (editCityId && editCityName.trim()) {
      const result = await updateCityById({ 
        _id: editCityId, 
        name: editCityName.trim(),
        stateId: editStateId || undefined
      });
      if (result) {
        setShowEditCityModal(false);
        setEditCityId(null);
        setEditCityName("");
        setEditStateId("");
        showSuccess(`City "${editCityName.trim()}" has been updated successfully.`);
      } else {
        showError('Failed to update city. Please try again.');
      }
    }
  }, [editCityId, editCityName, editStateId, updateCityById, showSuccess, showError]);

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-slate-600">Loading cities...</span>
        </div>
      </div>
    );
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
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          <PlusCircle className="w-5 h-5" /> Add City
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
              placeholder="Search cities or states..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          {/* State Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white"
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Results count */}
        <div className="mt-4 text-sm text-slate-600">
          Showing {filteredCities.length} of {citiesWithStates.length} cities
        </div>
      </div>

      {/* Add City Modal */}
      <AddCityModal
        isOpen={showAddCityModal}
        newCityName={newCityName}
        selectedStateId={newStateId}
        selectedImage={newImage}
        imagePreview={newImagePreview}
        states={states}
        onNewCityNameChange={setNewCityName}
        onStateChange={setNewStateId}
        onImageChange={setNewImage}
        onImagePreviewChange={setNewImagePreview}
        onSubmit={handleCreateCity}
        onClose={handleCloseAddCityModal}
        isAdding={isAdding}
        isUploading={isUploading}
      />

      {/* Edit City Modal */}
      <EditCityModal
        isOpen={showEditCityModal}
        editCityName={editCityName}
        selectedStateId={editStateId}
        states={states}
        onEditCityNameChange={setEditCityName}
        onStateChange={setEditStateId}
        onSubmit={handleUpdateCity}
        onClose={handleCloseEditCityModal}
        isUpdating={isUpdating}
      />

      <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 pb-3 border-b border-slate-200 mb-4">
          <div className="font-semibold text-slate-800">Image</div>
          <div className="font-semibold text-slate-800">City Name</div>
          <div className="font-semibold text-slate-800">State</div>
          <div className="font-semibold text-slate-800">Actions</div>
        </div>
        
        {filteredCities.length === 0 ? (
          <div className="text-slate-400 italic text-center py-8">
            {searchTerm || selectedStateFilter ? 'No cities match your search criteria' : 'No cities'}
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredCities.map((city) => (
              <CityItem
                key={city._id}
                city={city}
                onEdit={handleEditCity}
                onDelete={handleDeleteCity}
                isDeleting={isDeleting}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CitySelector;
