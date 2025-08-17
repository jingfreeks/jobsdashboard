
import {
  SettingsHeader,
  SettingsLoader as Loaders,
} from "@/ui";
import { AddModal, EditModal, ConfirmDelete, Lists } from "./component";
import {useSkillSelectorHooks} from './hooks'

const SkillSelector = () => {
  const hooks=useSkillSelectorHooks()
  // Handlers for Skills
  const handleAddSkill = () => hooks.setShowAddSkillModal(true);

  if (hooks.isLoading) {
    return <Loaders label={"Loading skills..."} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <SettingsHeader
        isAdding={hooks.isAdding}
        handleAddAction={handleAddSkill}
        btnLabel="Add Skill"
        title="Skills List"
      />
      {/* Add Skill Modal */}
      {hooks.showAddSkillModal && (
        <AddModal
          handleCloseAddSkillModal={hooks.handleCloseAddSkillModal}
          isAdding={hooks.isAdding}
          handleCreateSkill={hooks.handleCreateSkill}
          newSkillName={hooks.newSkillName}
          setNewSkillName={hooks.setNewSkillName}
        />
      )}

      {/* Edit Skill Modal */}
      {hooks.showEditSkillModal && (
        <EditModal
          handleCloseEditSkillModal={hooks.handleCloseEditSkillModal}
          isUpdating={hooks.isUpdating}
          handleUpdateSkill={hooks.handleUpdateSkill}
          editSkillName={hooks.editSkillName}
          setEditSkillName={hooks.setEditSkillName}
        />
      )}

      {/* Delete Confirmation Modal */}
      {hooks.showDeleteConfirmModal && hooks.skillToDelete && (
        <ConfirmDelete
          skills={hooks.skills}
          skillToDelete={hooks.skillToDelete}
          cancelDeleteSkill={hooks.cancelDeleteSkill}
          isDeleting={hooks.isDeleting}
          confirmDeleteSkill={hooks.confirmDeleteSkill}
        />
      )}
      <Lists
        skills={hooks.skills}
        handleEditSkill={hooks.handleEditSkill}
        isUpdating={hooks.isUpdating}
        isDeleting={hooks.isDeleting}
        handleDeleteSkill={hooks.handleDeleteSkill}
      />
    </div>
  );
};

export default SkillSelector;
