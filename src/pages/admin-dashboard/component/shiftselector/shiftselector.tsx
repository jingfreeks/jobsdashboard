import { PlusCircle, Loader2 } from "lucide-react";
import { useCallback, memo, useMemo, useState } from "react";
import { useShiftOperations } from "@/hooks/useShiftOperations";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ToastContainer";
import type { Shift } from "@/features/shift";

const ShiftSelector = () => {
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [newShiftName, setNewShiftName] = useState("");
  const [showEditShiftModal, setShowEditShiftModal] = useState(false);
  const [editShiftId, setEditShiftId] = useState<string | null>(null);
  const [editShiftName, setEditShiftName] = useState("");
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState<string | null>(null);

  // Use optimized shift operations hook
  const {
    shifts,
    isLoading,
    error,
    isAdding,
    isUpdating,
    isDeleting,
    createShift,
    updateShift,
    deleteShift,
    getShiftById,
  } = useShiftOperations();

  // Use toast for notifications
  const { toasts, removeToast, showSuccess, showError } = useToast();

  // Memoized callbacks for better performance
  const handleAddShift = useCallback(() => setShowAddShiftModal(true), []);

  const handleEditShift = useCallback((shift: Shift) => {
    setEditShiftId(shift._id);
    setEditShiftName(shift.title);
    setShowEditShiftModal(true);
  }, []);

  const handleDeleteShift = useCallback((shiftId: string) => {
    setShiftToDelete(shiftId);
    setShowDeleteConfirmModal(true);
  }, []);

  const confirmDeleteShift = useCallback(async () => {
    if (shiftToDelete) {
      const shift = getShiftById(shiftToDelete);
      const shiftName = shift?.title || "this shift";
      
      const success = await deleteShift({ _id: shiftToDelete });
      if (!success) {
        console.error("Failed to delete shift");
        showError("Failed to delete shift. Please try again.");
      } else {
        showSuccess(`Shift "${shiftName}" has been deleted successfully.`);
      }
      setShowDeleteConfirmModal(false);
      setShiftToDelete(null);
    }
  }, [shiftToDelete, deleteShift, getShiftById, showSuccess, showError]);

  const cancelDeleteShift = useCallback(() => {
    setShowDeleteConfirmModal(false);
    setShiftToDelete(null);
  }, []);

  const handleCreateShift = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (newShiftName.trim()) {
        const result = await createShift({ title: newShiftName.trim() });
        if (result) {
          setNewShiftName("");
          setShowAddShiftModal(false);
          showSuccess(`Shift "${newShiftName.trim()}" has been created successfully.`);
        } else {
          showError("Failed to create shift. Please try again.");
        }
      }
    },
    [newShiftName, createShift, showSuccess, showError]
  );

  const handleUpdateShift = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (editShiftId && editShiftName.trim()) {
        const result = await updateShift({
          _id: editShiftId,
          title: editShiftName.trim(),
        });
        if (result) {
          setShowEditShiftModal(false);
          setEditShiftId(null);
          setEditShiftName("");
          showSuccess(`Shift "${editShiftName.trim()}" has been updated successfully.`);
        } else {
          showError("Failed to update shift. Please try again.");
        }
      }
    },
    [editShiftId, editShiftName, updateShift, showSuccess, showError]
  );

  const handleCloseAddShiftModal = useCallback(() => {
    setShowAddShiftModal(false);
    setNewShiftName("");
  }, []);

  const handleCloseEditShiftModal = useCallback(() => {
    setShowEditShiftModal(false);
    setEditShiftId(null);
    setEditShiftName("");
  }, []);

  // Memoized computed values
  const hasShifts = useMemo(() => shifts.length > 0, [shifts.length]);

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-slate-600">Loading shifts...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading shifts. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Shift List</h2>
        <button
          onClick={handleAddShift}
          disabled={isAdding}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          {isAdding ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <PlusCircle className="w-5 h-5" />
          )}
          {isAdding ? "Adding..." : "Add Shift"}
        </button>
      </div>

      {/* Add Shift Modal */}
      {showAddShiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseAddShiftModal}
              disabled={isAdding}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold disabled:opacity-50"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Create New Shift
            </h3>
            <form onSubmit={handleCreateShift} className="flex flex-col gap-4">
              <input
                type="text"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Shift Name"
                value={newShiftName}
                onChange={(e) => setNewShiftName(e.target.value)}
                disabled={isAdding}
                autoFocus
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseAddShiftModal}
                  disabled={isAdding}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding || !newShiftName.trim()}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold flex items-center gap-2"
                >
                  {isAdding && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isAdding ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Shift Modal */}
      {showEditShiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseEditShiftModal}
              disabled={isUpdating}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold disabled:opacity-50"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Edit Shift
            </h3>
            <form onSubmit={handleUpdateShift} className="flex flex-col gap-4">
              <input
                type="text"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Shift Name"
                value={editShiftName}
                onChange={(e) => setEditShiftName(e.target.value)}
                disabled={isUpdating}
                autoFocus
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseEditShiftModal}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || !editShiftName.trim()}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold flex items-center gap-2"
                >
                  {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isUpdating ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && shiftToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Confirm Delete
            </h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete "{shifts.find(s => s._id === shiftToDelete)?.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={cancelDeleteShift}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteShift}
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
        {!hasShifts ? (
          <div className="text-slate-400 italic text-center py-8">
            No shifts found. Create your first shift to get started.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {shifts.map((shift) => (
              <li
                key={shift._id}
                className="flex items-center justify-between py-3"
              >
                <span className="flex-1 truncate text-slate-800 font-medium">
                  {shift.title}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditShift(shift)}
                    disabled={isUpdating || isDeleting}
                    className="text-blue-500 hover:text-blue-700 disabled:opacity-50 px-2 py-1 rounded transition"
                    title="Edit shift"
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
                    onClick={() => handleDeleteShift(shift._id)}
                    disabled={isUpdating || isDeleting}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50 px-2 py-1 rounded transition"
                    title="Delete shift"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
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
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default memo(ShiftSelector);
