import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSkillsOperations } from "@/hooks/useSkillsOperations";
import { useToast } from "@/hooks/useToast";

const SkillSelector = () => {
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


  // Handlers for Skills
  const handleAddSkill = () => setShowAddSkillModal(true);

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillName.trim()) {
      const result = await createSkill({ name: newSkillName.trim() });
      if (result) {
        showSuccess(`Skill "${newSkillName.trim()}" has been created successfully.`);
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
        showSuccess(`Skill "${editSkillName.trim()}" has been updated successfully.`);
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
      const skill = skills.find(s => s._id === skillToDelete);
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

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-slate-600">Loading skills...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Skills List</h2>
        <button
          onClick={handleAddSkill}
          disabled={isAdding}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          {isAdding ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <PlusCircle className="w-5 h-5" />
          )}
          {isAdding ? "Adding..." : "Add Skill"}
        </button>
      </div>

      {/* Add Skill Modal */}
      {showAddSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseAddSkillModal}
              disabled={isAdding}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold disabled:opacity-50"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Create New Skill
            </h3>
            <form onSubmit={handleCreateSkill} className="flex flex-col gap-4">
              <input
                type="text"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Skill Name"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                disabled={isAdding}
                autoFocus
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseAddSkillModal}
                  disabled={isAdding}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding || !newSkillName.trim()}
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

      {/* Edit Skill Modal */}
      {showEditSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseEditSkillModal}
              disabled={isUpdating}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold disabled:opacity-50"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Edit Skill
            </h3>
            <form onSubmit={handleUpdateSkill} className="flex flex-col gap-4">
              <input
                type="text"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Skill Name"
                value={editSkillName}
                onChange={(e) => setEditSkillName(e.target.value)}
                disabled={isUpdating}
                autoFocus
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseEditSkillModal}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || !editSkillName.trim()}
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
      {showDeleteConfirmModal && skillToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Confirm Delete
            </h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete "{skills.find(s => s._id === skillToDelete)?.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={cancelDeleteSkill}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteSkill}
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
        {skills.length === 0 ? (
          <div className="text-slate-400 italic text-center py-8">
            No skills found. Create your first skill to get started.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {skills.map((skill) => (
              <li
                key={skill._id}
                className="flex items-center justify-between py-3"
              >
                <span className="flex-1 truncate text-slate-800 font-medium">
                  {skill.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditSkill(skill._id)}
                    disabled={isUpdating || isDeleting}
                    className="text-blue-500 hover:text-blue-700 disabled:opacity-50 px-2 py-1 rounded transition"
                    title="Edit skill"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSkill(skill._id)}
                    disabled={isUpdating || isDeleting}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50 px-2 py-1 rounded transition"
                    title="Delete skill"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
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

export default SkillSelector;
