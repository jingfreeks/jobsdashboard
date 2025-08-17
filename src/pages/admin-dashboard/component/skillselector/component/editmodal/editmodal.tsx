import { Loader2 } from "lucide-react";

interface editModalProps {
  handleCloseEditSkillModal: () => void;
  isUpdating: boolean;
  handleUpdateSkill:(e: React.FormEvent) => void | Promise<void>;
  editSkillName: string;
  setEditSkillName: (name: string) => void;
}
const EditModal = (props: editModalProps) => {
  const {
    handleCloseEditSkillModal,
    isUpdating,
    handleUpdateSkill,
    editSkillName,
    setEditSkillName,
  } = props;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={handleCloseEditSkillModal}
          disabled={isUpdating}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold disabled:opacity-50"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-slate-800">Edit Skill</h3>
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
  );
};
export default EditModal;
