import { useCallback,useState } from "react";
import { useShiftOperations } from "@/hooks/useShiftOperations";
import { useToast } from "@/hooks/useToast";
import type { Shift } from "@/features/shift";

export const useShiftSelectorHooks = () => {
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [newShiftName, setNewShiftName] = useState("");
  const [showEditShiftModal, setShowEditShiftModal] = useState(false);
  const [editShiftId, setEditShiftId] = useState<string | null>(null);
  const [editShiftName, setEditShiftName] = useState("");
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState<string | null>(null);

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
          showSuccess(
            `Shift "${newShiftName.trim()}" has been created successfully.`
          );
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
          showSuccess(
            `Shift "${editShiftName.trim()}" has been updated successfully.`
          );
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
  return {
    showAddShiftModal,
    setShowAddShiftModal,
    newShiftName,
    setNewShiftName,
    showEditShiftModal,
    setShowEditShiftModal,
    editShiftId,
    setEditShiftId,
    editShiftName,
    setEditShiftName,
    showDeleteConfirmModal,
    setShowDeleteConfirmModal,
    shiftToDelete,
    setShiftToDelete,
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
    toasts,
    removeToast,
    showSuccess,
    showError,
    handleAddShift,
    handleEditShift,
    handleDeleteShift,
    confirmDeleteShift,
    cancelDeleteShift,
    handleCreateShift,
    handleUpdateShift,
    handleCloseAddShiftModal,
    handleCloseEditShiftModal,
  };
};
