import { PlusCircle } from "lucide-react";
import { useState, useCallback, memo } from "react";
import { useStateOperations } from "@/hooks/useStateOperations";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ToastContainer";
import { StateItem, AddStateModal, EditStateModal, Loaders } from "./component";

const StateSelector = () => {
  const [showAddStateModal, setShowAddStateModal] = useState(false);
  const [showEditStateModal, setShowEditStateModal] = useState(false);
  const [newStateName, setNewStateName] = useState("");
  const [editStateId, setEditStateId] = useState<string | null>(null);
  const [editStateName, setEditStateName] = useState("");

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

  const handleDeleteState = useCallback(
    async (stateId: string) => {
      const state = states.find((s) => s._id === stateId);
      const stateName = state?.name || "this state";
      const isConfirmed = window.confirm(
        `Are you sure you want to delete "${stateName}"? This action cannot be undone.`
      );

      if (isConfirmed) {
        const success = await deleteStateById(stateId);
        if (!success) {
          console.error("Failed to delete state");
          showError("Failed to delete state. Please try again.");
        } else {
          showSuccess(`State "${stateName}" has been deleted successfully.`);
        }
      }
    },
    [deleteStateById, states, showSuccess, showError]
  );

  if (isLoading) {
    return <Loaders title='Loading states...'/>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">State List</h2>
        <button
          onClick={handleAddState}
          disabled={isAdding || isUpdating || isDeleting}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition disabled:opacity-50"
        >
          <PlusCircle className="w-5 h-5" /> Add State
        </button>
      </div>

      <AddStateModal
        isOpen={showAddStateModal}
        onClose={handleCloseAddStateModal}
        onSubmit={handleCreateState}
        stateName={newStateName}
        setStateName={setNewStateName}
        isAdding={isAdding}
      />

      <EditStateModal
        isOpen={showEditStateModal}
        onClose={handleCloseEditStateModal}
        onSubmit={handleUpdateState}
        stateName={editStateName}
        setStateName={setEditStateName}
        isUpdating={isUpdating}
      />

      <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
        {states.length === 0 ? (
          <div className="text-slate-400 italic">No states</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {states.map((state) => (
              <StateItem
                key={state._id}
                state={state}
                onEdit={handleEditState}
                onDelete={handleDeleteState}
                isDeleting={isDeleting}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default memo(StateSelector);
