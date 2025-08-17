import { useState } from "react";
import { useDepartmentOperations } from "@/hooks/useDepartmentOperations";
import { useToast } from "@/hooks/useToast";

export const DepartmentHooks = () => {
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
  const [departmentToDelete, setDepartmentToDelete] = useState<string | null>(
    null
  );

  const handleAddDepartment = () => setShowAddDepartmentModal(true);
  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newDepartmentName.trim()) {
      try {
        await createDepartment({ name: newDepartmentName.trim() });
        showSuccess("Department created successfully");
        setNewDepartmentName("");
        setShowAddDepartmentModal(false);
      } catch {
        showError("Failed to create department");
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
        showSuccess("Department updated successfully");
        setShowEditDepartmentModal(false);
        setEditDepartmentId(null);
        setEditDepartmentName("");
      } catch {
        showError("Failed to update department");
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
        showSuccess("Department deleted successfully");
        setShowDeleteConfirmModal(false);
        setDepartmentToDelete(null);
      } catch {
        showError("Failed to delete department");
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
  return {
    departments,
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    createDepartment,
    updateDepartmentById,
    deleteDepartmentById,
    showSuccess,
    showError,
    showAddDepartmentModal,
    setShowAddDepartmentModal,
    newDepartmentName,
    setNewDepartmentName,
    showEditDepartmentModal,
    setShowEditDepartmentModal,
    editDepartmentId,
    setEditDepartmentId,
    editDepartmentName,
    setEditDepartmentName,
    showDeleteConfirmModal,
    setShowDeleteConfirmModal,
    departmentToDelete,
    setDepartmentToDelete,
    handleAddDepartment,
    handleCreateDepartment,
    handleEditDepartment,
    handleUpdateDepartment,
    handleDeleteDepartment,
    confirmDeleteDepartment,
    cancelDeleteDepartment,
    handleCloseAddDepartmentModal,
    handleCloseEditDepartmentModal,
  };
};
