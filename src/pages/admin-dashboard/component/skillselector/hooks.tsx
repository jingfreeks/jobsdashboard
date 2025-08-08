import { useState } from "react";
import { useSkillsOperations } from "@/hooks/useSkillsOperations";
import { useToast } from "@/hooks/useToast";

export const useSkillSelectorHooks = () => {
  const {
    skills,
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    createSkill,
    updateSkillById,
    deleteSkillById,
  } = useSkillsOperations();

  const { showSuccess, showError } = useToast();

  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [showEditSkillModal, setShowEditSkillModal] = useState(false);
  const [editSkillId, setEditSkillId] = useState<string | null>(null);
  const [editSkillName, setEditSkillName] = useState("");
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillName.trim()) {
      const result = await createSkill({ name: newSkillName.trim() });
      if (result) {
        showSuccess(
          `Skill "${newSkillName.trim()}" has been created successfully.`
        );
        setNewSkillName("");
        setShowAddSkillModal(false);
      } else {
        showError("Failed to create skill. Please try again.");
      }
    }
  };

  const handleEditSkill = (id: string) => {
    const skill = skills.find((s) => s._id === id);
    if (skill) {
      setEditSkillId(id);
      setEditSkillName(skill.name);
      setShowEditSkillModal(true);
    }
  };

  const handleUpdateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editSkillId !== null && editSkillName.trim()) {
      const result = await updateSkillById({
        _id: editSkillId,
        name: editSkillName.trim(),
      });
      if (result) {
        showSuccess(
          `Skill "${editSkillName.trim()}" has been updated successfully.`
        );
        setShowEditSkillModal(false);
        setEditSkillId(null);
        setEditSkillName("");
      } else {
        showError("Failed to update skill. Please try again.");
      }
    }
  };

  const handleDeleteSkill = (id: string) => {
    setSkillToDelete(id);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteSkill = async () => {
    if (skillToDelete) {
      const skill = skills.find((s) => s._id === skillToDelete);
      if (skill) {
        const success = await deleteSkillById(skillToDelete);
        if (!success) {
          console.error("Failed to delete skill");
          showError("Failed to delete skill. Please try again.");
        } else {
          showSuccess(`Skill "${skill.name}" has been deleted successfully.`);
        }
      }
      setShowDeleteConfirmModal(false);
      setSkillToDelete(null);
    }
  };

  const cancelDeleteSkill = () => {
    setShowDeleteConfirmModal(false);
    setSkillToDelete(null);
  };

  const handleCloseAddSkillModal = () => {
    setShowAddSkillModal(false);
    setNewSkillName("");
  };

  const handleCloseEditSkillModal = () => {
    setShowEditSkillModal(false);
    setEditSkillId(null);
    setEditSkillName("");
  };
  return {
    skills,
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    createSkill,
    updateSkillById,
    deleteSkillById,
    showSuccess,
    showError,
    showAddSkillModal,
    setShowAddSkillModal,
    newSkillName,
    setNewSkillName,
    showEditSkillModal,
    setShowEditSkillModal,
    editSkillId,
    setEditSkillId,
    editSkillName,
    setEditSkillName,
    showDeleteConfirmModal,
    setShowDeleteConfirmModal,
    skillToDelete,
    setSkillToDelete,
    handleCreateSkill,
    handleEditSkill,
    handleUpdateSkill,
    handleDeleteSkill,
    confirmDeleteSkill,
    cancelDeleteSkill,
    handleCloseAddSkillModal,
    handleCloseEditSkillModal,
  };
};
