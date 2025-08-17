import { memo, useMemo } from "react";
import ToastContainer from "@/components/ToastContainer";
import { AddModal, EditModal, ConfirmDelete, Lists } from "./component";
import {
  SettingsHeader,
  SettingsLoader as Loaders,
  SettingsError as Error,
} from "@/ui";
import { useShiftSelectorHooks } from "./hooks";

const ShiftSelector = () => {
  const hooks = useShiftSelectorHooks();
  // Memoized computed values
  const hasShifts = useMemo(
    () => hooks.shifts.length > 0,
    [hooks.shifts.length]
  );

  // Loading state
  if (hooks.isLoading) {
    return <Loaders label="Loading shifts..." />;
  }

  // Error state
  if (hooks.error) {
    return <Error label="Error loading shifts. Please try again." />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Toast Container */}
      <ToastContainer toasts={hooks.toasts} onRemoveToast={hooks.removeToast} />
      <SettingsHeader
        isAdding={hooks.isAdding}
        handleAddAction={hooks.handleAddShift}
        btnLabel="Add Shift"
        title="Shift List"
      />
      {/* Add Shift Modal */}
      {hooks.showAddShiftModal && (
        <AddModal
          handleCloseAddShiftModal={hooks.handleCloseAddShiftModal}
          isAdding={hooks.isAdding}
          handleCreateShift={hooks.handleCreateShift}
          newShiftName={hooks.newShiftName}
          setNewShiftName={hooks.setNewShiftName}
        />
      )}

      {/* Edit Shift Modal */}
      {hooks.showEditShiftModal && (
        <EditModal
          handleCloseEditShiftModal={hooks.handleCloseEditShiftModal}
          isUpdating={hooks.isUpdating}
          handleUpdateShift={hooks.handleUpdateShift}
          editShiftName={hooks.editShiftName}
          setEditShiftName={hooks.setEditShiftName}
        />
      )}

      {/* Delete Confirmation Modal */}
      {hooks.showDeleteConfirmModal && hooks.shiftToDelete && (
        <ConfirmDelete
          shifts={hooks.shifts}
          shiftToDelete={hooks.shiftToDelete}
          cancelDeleteShift={hooks.cancelDeleteShift}
          isDeleting={hooks.isDeleting}
          confirmDeleteShift={hooks.confirmDeleteShift}
        />
      )}
      <Lists
        hasShifts={hasShifts}
        shifts={hooks.shifts}
        handleEditShift={hooks.handleEditShift}
        isUpdating={hooks.isUpdating}
        isDeleting={hooks.isDeleting}
        handleDeleteShift={hooks.handleDeleteShift}
      />
    </div>
  );
};

export default memo(ShiftSelector);
