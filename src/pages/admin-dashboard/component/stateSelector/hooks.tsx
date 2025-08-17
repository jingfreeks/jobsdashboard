import { useState, useCallback } from "react";
import { useStateOperations } from "@/hooks/useStateOperations";
import { useToast } from "@/hooks/useToast";

export const useStateSelectorHooks = () => {
  const [showAddStateModal, setShowAddStateModal] = useState(false);
  const [showEditStateModal, setShowEditStateModal] = useState(false);
  const [newStateName, setNewStateName] = useState("");
  const [editStateId, setEditStateId] = useState<string | null>(null);
  const [editStateName, setEditStateName] = useState("");
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [stateToDelete, setStateToDelete] = useState<string | null>(null);

  const {
    states,
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    createState,
    updateStateById,
    deleteStateById,
  } = useStateOperations();

  const { toasts, removeToast, showSuccess, showError } = useToast();

  const handleAddState = useCallback(() => setShowAddStateModal(true), []);

  const handleCloseAddStateModal = useCallback(() => {
    setShowAddStateModal(false);
    setNewStateName("");
  }, []);

  const handleCloseEditStateModal = useCallback(() => {
    setShowEditStateModal(false);
    setEditStateId(null);
    setEditStateName("");
  }, []);

  const handleCreateState = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (newStateName.trim()) {
        const result = await createState({ name: newStateName.trim() });
        if (result) {
          showSuccess(
            `State "${newStateName.trim()}" has been created successfully.`
          );
          setNewStateName("");
          setShowAddStateModal(false);
        } else {
          showError("Failed to create state. Please try again.");
        }
      }
    },
    [newStateName, createState, showSuccess, showError]
  );

  const handleUpdateState = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (editStateId !== null && editStateName.trim()) {
        const result = await updateStateById({
          _id: editStateId,
          name: editStateName.trim(),
        });
        if (result) {
          showSuccess(
            `State "${editStateName.trim()}" has been updated successfully.`
          );
          setShowEditStateModal(false);
          setEditStateId(null);
          setEditStateName("");
        } else {
          showError("Failed to update state. Please try again.");
        }
      }
    },
    [editStateId, editStateName, updateStateById, showSuccess, showError]
  );

  const handleEditState = useCallback(
    (id: string) => {
      const state = states.find((s) => s._id === id);
      if (state) {
        setEditStateId(id);
        setEditStateName(state.name);
        setShowEditStateModal(true);
      }
    },
    [states]
  );

  const handleDeleteState = useCallback((stateId: string) => {
    setStateToDelete(stateId);
    setShowDeleteConfirmModal(true);
  }, []);

  const confirmDeleteState = useCallback(async () => {
    if (stateToDelete) {
      const state = states.find((s) => s._id === stateToDelete);
      const stateName = state?.name || "this state";

      const success = await deleteStateById(stateToDelete);
      if (!success) {
        console.error("Failed to delete state");
        showError("Failed to delete state. Please try again.");
      } else {
        showSuccess(`State "${stateName}" has been deleted successfully.`);
      }
      setShowDeleteConfirmModal(false);
      setStateToDelete(null);
    }
  }, [stateToDelete, deleteStateById, states, showSuccess, showError]);

  const cancelDeleteState = useCallback(() => {
    setShowDeleteConfirmModal(false);
    setStateToDelete(null);
  }, []);

  return {
    showAddStateModal,
    setShowAddStateModal,
    showEditStateModal,
    setShowEditStateModal,
    newStateName,
    setNewStateName,
    editStateId,
    setEditStateId,
    editStateName,
    setEditStateName,
    showDeleteConfirmModal,
    setShowDeleteConfirmModal,
    stateToDelete,
    setStateToDelete,
    states,
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    createState,
    updateStateById,
    deleteStateById,
    toasts,
    removeToast,
    showSuccess,
    showError,
    handleAddState,
    handleCloseAddStateModal,
    handleCloseEditStateModal,
    handleCreateState,
    handleUpdateState,
    handleEditState,
    handleDeleteState,
    confirmDeleteState,
    cancelDeleteState,
  };
};
