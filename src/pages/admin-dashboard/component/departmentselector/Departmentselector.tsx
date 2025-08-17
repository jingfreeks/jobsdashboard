import {DepartmentHooks} from './hooks'
import LoadingSpinner from "@/components/LoadingSpinner";
import { AddModal, Header, EditModal, ConfirmModal, Lists } from "./component";

const DepartmentSelector = () => {
  const hooks=DepartmentHooks()
  if (hooks.isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Header handleAddDepartment={hooks.handleAddDepartment} isAdding={hooks.isAdding} />
      {/* Add Department Modal */}
      {hooks.showAddDepartmentModal && (
        <AddModal
          handleCloseAddDepartmentModal={hooks.handleCloseAddDepartmentModal}
          handleCreateDepartment={hooks.handleCreateDepartment}
          newDepartmentName={hooks.newDepartmentName}
          setNewDepartmentName={hooks.setNewDepartmentName}
          isAdding={hooks.isAdding}
        />
      )}
      {/* Edit Department Modal */}
      {hooks.showEditDepartmentModal && (
        <EditModal
          handleCloseEditDepartmentModal={hooks.handleCloseEditDepartmentModal}
          handleUpdateDepartment={hooks.handleUpdateDepartment}
          editDepartmentName={hooks.editDepartmentName}
          setEditDepartmentName={hooks.setEditDepartmentName}
          isUpdating={hooks.isUpdating}
        />
      )}
      {/* Delete Confirmation Modal */}
      {hooks.showDeleteConfirmModal && hooks.departmentToDelete && (
        <ConfirmModal
          departments={hooks.departments}
          departmentToDelete={hooks.departmentToDelete}
          cancelDeleteDepartment={hooks.cancelDeleteDepartment}
          isDeleting={hooks.isDeleting}
          confirmDeleteDepartment={hooks.confirmDeleteDepartment}
        />
      )}
      <Lists
        departments={hooks.departments}
        handleEditDepartment={hooks.handleEditDepartment}
        isUpdating={hooks.isUpdating}
        isDeleting={hooks.isDeleting}
        handleDeleteDepartment={hooks.handleDeleteDepartment}
      />
    </div>
  );
};
export default DepartmentSelector;
