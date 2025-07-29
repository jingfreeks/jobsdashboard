import { PlusCircle } from "lucide-react";
import { useState, useCallback, memo } from "react";
import { useCityOperations } from "@/hooks/useCityOperations";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ToastContainer";
import type { City } from "@/features/city";

// Memoized City Item Component
const CityItem = memo<{
  city: City;
  onEdit: (city: City) => void;
  onDelete: (cityId: string) => void;
  isDeleting: boolean;
}>(({ city, onEdit, onDelete, isDeleting }) => (
  <li className="flex items-center justify-between py-3">
    <span className="flex-1 truncate text-slate-800 font-medium">
      {city.name}
    </span>
    <div className="flex gap-2">
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
  </li>
));

CityItem.displayName = 'CityItem';

// Memoized Add City Modal Component
const AddCityModal = memo<{
  isOpen: boolean;
  newCityName: string;
  onNewCityNameChange: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isAdding: boolean;
}>(({ isOpen, newCityName, onNewCityNameChange, onSubmit, onClose, isAdding }) => {
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

AddCityModal.displayName = 'AddCityModal';

// Memoized Edit City Modal Component
const EditCityModal = memo<{
  isOpen: boolean;
  editCityName: string;
  onEditCityNameChange: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isUpdating: boolean;
}>(({ isOpen, editCityName, onEditCityNameChange, onSubmit, onClose, isUpdating }) => {
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
  const [newCityName, setNewCityName] = useState("");

  // Use optimized city operations hook
  const {
    cities,
    isLoading,
    error,
    isAdding,
    isUpdating,
    isDeleting,
    createCity,
    updateCityById,
    deleteCityById,
  } = useCityOperations();

  // Use toast for notifications
  const { toasts, removeToast, showSuccess, showError } = useToast();

  // Memoized callbacks for better performance
  const handleAddCity = useCallback(() => setShowAddCityModal(true), []);

  const handleDeleteCity = useCallback(async (cityId: string) => {
    // Find the city name for the confirmation message
    const city = cities.find(c => c._id === cityId);
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
  }, [deleteCityById, cities, showSuccess, showError]);

  const handleEditCity = useCallback((city: City) => {
    setEditCityId(city._id);
    setEditCityName(city.name);
    setShowEditCityModal(true);
  }, []);

  const handleCloseAddCityModal = useCallback(() => {
    setShowAddCityModal(false);
    setNewCityName("");
  }, []);

  const handleCreateCity = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCityName.trim()) {
      const result = await createCity({ name: newCityName.trim() });
      if (result) {
        setNewCityName("");
        setShowAddCityModal(false);
        showSuccess(`City "${newCityName.trim()}" has been created successfully.`);
      } else {
        showError('Failed to create city. Please try again.');
      }
    }
  }, [newCityName, createCity, showSuccess, showError]);

  const handleCloseEditCityModal = useCallback(() => {
    setShowEditCityModal(false);
    setEditCityId(null);
    setEditCityName("");
  }, []);

  const handleUpdateCity = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (editCityId && editCityName.trim()) {
      const result = await updateCityById({ _id: editCityId, name: editCityName.trim() });
      if (result) {
        setShowEditCityModal(false);
        setEditCityId(null);
        setEditCityName("");
        showSuccess(`City "${editCityName.trim()}" has been updated successfully.`);
      } else {
        showError('Failed to update city. Please try again.');
      }
    }
  }, [editCityId, editCityName, updateCityById, showSuccess, showError]);

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load cities. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
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

      {/* Add City Modal */}
      <AddCityModal
        isOpen={showAddCityModal}
        newCityName={newCityName}
        onNewCityNameChange={setNewCityName}
        onSubmit={handleCreateCity}
        onClose={handleCloseAddCityModal}
        isAdding={isAdding}
      />

      {/* Edit City Modal */}
      <EditCityModal
        isOpen={showEditCityModal}
        editCityName={editCityName}
        onEditCityNameChange={setEditCityName}
        onSubmit={handleUpdateCity}
        onClose={handleCloseEditCityModal}
        isUpdating={isUpdating}
      />

      <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
        {cities.length === 0 ? (
          <div className="text-slate-400 italic">No cities</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {cities.map((city) => (
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
