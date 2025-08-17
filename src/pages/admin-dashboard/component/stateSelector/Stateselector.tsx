import { PlusCircle } from "lucide-react";
import { memo } from "react";
import { useStateSelectorHooks } from "./hooks";
import ToastContainer from "@/components/ToastContainer";
import {
  StateItem,
  AddStateModal,
  EditStateModal,
  Loaders,
  ConfirmDelete,
} from "./component";

const StateSelector = () => {
  const hooks = useStateSelectorHooks();

  if (hooks.isLoading) {
    return <Loaders title="Loading states..." />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ToastContainer toasts={hooks.toasts} onRemoveToast={hooks.removeToast} />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">State List</h2>
        <button
          onClick={hooks.handleAddState}
          disabled={hooks.isAdding || hooks.isUpdating || hooks.isDeleting}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition disabled:opacity-50"
        >
          <PlusCircle className="w-5 h-5" /> Add State
        </button>
      </div>
      {/* <SettingsHeader
        isAdding={hooks.isAdding}
        handleAddAction={hooks.handleAddState}
        btnLabel="Add State"
        title="State List"
      /> */}
      <AddStateModal
        isOpen={hooks.showAddStateModal}
        onClose={hooks.handleCloseAddStateModal}
        onSubmit={hooks.handleCreateState}
        stateName={hooks.newStateName}
        setStateName={hooks.setNewStateName}
        isAdding={hooks.isAdding}
      />

      <EditStateModal
        isOpen={hooks.showEditStateModal}
        onClose={hooks.handleCloseEditStateModal}
        onSubmit={hooks.handleUpdateState}
        stateName={hooks.editStateName}
        setStateName={hooks.setEditStateName}
        isUpdating={hooks.isUpdating}
      />

      {/* Delete Confirmation Modal */}
      {hooks.showDeleteConfirmModal && hooks.stateToDelete && (
        <ConfirmDelete
          states={hooks.states}
          stateToDelete={hooks.stateToDelete}
          cancelDeleteState={hooks.cancelDeleteState}
          isDeleting={hooks.isDeleting}
          confirmDeleteState={hooks.confirmDeleteState}
        />
      )}

      <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
        {hooks.states.length === 0 ? (
          <div className="text-slate-400 italic">No states</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {hooks.states.map((state) => (
              <StateItem
                key={state._id}
                state={state}
                onEdit={hooks.handleEditState}
                onDelete={hooks.handleDeleteState}
                isDeleting={hooks.isDeleting}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default memo(StateSelector);
