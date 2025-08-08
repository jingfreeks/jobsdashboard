import { Loader2 } from "lucide-react";

interface ShiftProps {
  _id: string;
  title: string;
}

interface ConfirmDeleteProps {
  shifts: ShiftProps[];
  shiftToDelete: string;
  cancelDeleteShift: () => void;
  isDeleting: boolean;
  confirmDeleteShift: () => void;
}
const ConfirmDelete = (props: ConfirmDeleteProps) => {
  const {
    shifts,
    shiftToDelete,
    cancelDeleteShift,
    isDeleting,
    confirmDeleteShift,
  } = props;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <h3 className="text-xl font-bold mb-4 text-slate-800">
          Confirm Delete
        </h3>
        <p className="text-slate-600 mb-6">
          Are you sure you want to delete "
          {shifts.find((s) => s._id === shiftToDelete)?.title}"? This action
          cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={cancelDeleteShift}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteShift}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold flex items-center gap-2"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmDelete;
