import { PlusCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useDepartmentOperations } from "@/hooks/useDepartmentOperations";
import { useToast } from "@/hooks/useToast";
import LoadingSpinner from "@/components/LoadingSpinner";

const DepartmentSelector = () => {
  const {
    departments,
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    createDepartment,
    updateDepartmentById,
    deleteDepartmentById,
  } = useDepartmentOperations();

  const { showSuccess, showError } = useToast();

  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [showEditDepartmentModal, setShowEditDepartmentModal] = useState(false);
  const [editDepartmentId, setEditDepartmentId] = useState<string | null>(null);
  const [editDepartmentName, setEditDepartmentName] = useState("");
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<string | null>(null);

  const handleAddDepartment = () => setShowAddDepartmentModal(true);
  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newDepartmentName.trim()) {
      try {
        await createDepartment({ name: newDepartmentName.trim() });
        showSuccess('Department created successfully');
        setNewDepartmentName("");
        setShowAddDepartmentModal(false);
      } catch (error) {
        showError('Failed to create department');
      }
    }
  };
  const handleEditDepartment = (id: string) => {
    const department = departments.find((d) => d._id === id);
    if (department) {
      setEditDepartmentId(id);
      setEditDepartmentName(department.name);
      setShowEditDepartmentModal(true);
    }
  };
  const handleUpdateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editDepartmentId !== null && editDepartmentName.trim()) {
      try {
        await updateDepartmentById({
          _id: editDepartmentId,
          name: editDepartmentName.trim(),
        });
        showSuccess('Department updated successfully');
        setShowEditDepartmentModal(false);
        setEditDepartmentId(null);
        setEditDepartmentName("");
      } catch (error) {
        showError('Failed to update department');
      }
    }
  };
  const handleDeleteDepartment = (id: string) => {
    setDepartmentToDelete(id);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteDepartment = async () => {
    if (departmentToDelete) {
      try {
        await deleteDepartmentById(departmentToDelete);
        showSuccess('Department deleted successfully');
        setShowDeleteConfirmModal(false);
        setDepartmentToDelete(null);
      } catch (error) {
        showError('Failed to delete department');
      }
    }
  };

  const cancelDeleteDepartment = () => {
    setShowDeleteConfirmModal(false);
    setDepartmentToDelete(null);
  };
  const handleCloseAddDepartmentModal = () => {
    setShowAddDepartmentModal(false);
    setNewDepartmentName("");
  };
  const handleCloseEditDepartmentModal = () => {
    setShowEditDepartmentModal(false);
    setEditDepartmentId(null);
    setEditDepartmentName("");
  };
  if (isLoading) {
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Department List</h2>
        <button
          onClick={handleAddDepartment}
          disabled={isAdding}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          {isAdding ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <PlusCircle className="w-5 h-5" />
          )}
          {isAdding ? 'Adding...' : 'Add Department'}
        </button>
      </div>
      {/* Add Department Modal */}
      {showAddDepartmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseAddDepartmentModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Create New Department
            </h3>
            <form
              onSubmit={handleCreateDepartment}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Department Name"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                autoFocus
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseAddDepartmentModal}
                  disabled={isAdding}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold flex items-center gap-2"
                >
                  {isAdding && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isAdding ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Department Modal */}
      {showEditDepartmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseEditDepartmentModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Edit Department
            </h3>
            <form
              onSubmit={handleUpdateDepartment}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Department Name"
                value={editDepartmentName}
                onChange={(e) => setEditDepartmentName(e.target.value)}
                autoFocus
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseEditDepartmentModal}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold flex items-center gap-2"
                >
                  {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isUpdating ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && departmentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Confirm Delete
            </h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete "{departments.find(d => d._id === departmentToDelete)?.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={cancelDeleteDepartment}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteDepartment}
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
        {departments.length === 0 ? (
          <div className="text-slate-400 italic">No departments</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {departments.map((department) => (
              <li
                key={department._id}
                className="flex items-center justify-between py-3"
              >
                <span className="flex-1 truncate text-slate-800 font-medium">
                  {department.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditDepartment(department._id)}
                    disabled={isUpdating || isDeleting}
                    className="text-blue-500 hover:text-blue-700 disabled:text-blue-300 px-2 py-1 rounded transition"
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
                    onClick={() => handleDeleteDepartment(department._id)}
                    disabled={isUpdating || isDeleting}
                    className="text-red-500 hover:text-red-700 disabled:text-red-300 px-2 py-1 rounded transition"
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
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default DepartmentSelector;
