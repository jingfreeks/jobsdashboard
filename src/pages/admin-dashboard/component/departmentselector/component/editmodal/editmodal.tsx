import { Loader2 } from "lucide-react";

interface EditModalProps {
  handleCloseEditDepartmentModal: () => void;
  handleUpdateDepartment: (e: React.FormEvent<HTMLFormElement>) => void;
  editDepartmentName: string;
  setEditDepartmentName: (name:string) => void;
  isUpdating: boolean;
}
const EditModal = (props:EditModalProps) => {
  const {
    handleCloseEditDepartmentModal,
    handleUpdateDepartment,
    editDepartmentName,
    setEditDepartmentName,
    isUpdating,
  } = props;
  return (
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
        <form onSubmit={handleUpdateDepartment} className="flex flex-col gap-4">
          <input
            type="text"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Department Name"
            value={editDepartmentName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditDepartmentName(e.target.value)}
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
              {isUpdating ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditModal;
