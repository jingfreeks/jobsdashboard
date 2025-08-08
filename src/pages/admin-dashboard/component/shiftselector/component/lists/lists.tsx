import { Loader2 } from "lucide-react";

interface shiftProps {
  _id: string;
  title: string;
}

interface Listprops {
  hasShifts: boolean;
  shifts: shiftProps[];
  handleEditShift: (shift:shiftProps) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  handleDeleteShift: (name: string) => void;
}
const Lists = (props: Listprops) => {
  const {
    hasShifts,
    shifts,
    handleEditShift,
    isUpdating,
    isDeleting,
    handleDeleteShift,
  } = props;
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
      {!hasShifts ? (
        <div className="text-slate-400 italic text-center py-8">
          No shifts found. Create your first shift to get started.
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {shifts.map((shift) => (
            <li
              key={shift._id}
              className="flex items-center justify-between py-3"
            >
              <span className="flex-1 truncate text-slate-800 font-medium">
                {shift.title}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditShift(shift)}
                  disabled={isUpdating || isDeleting}
                  className="text-blue-500 hover:text-blue-700 disabled:opacity-50 px-2 py-1 rounded transition"
                  title="Edit shift"
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
                  onClick={() => handleDeleteShift(shift._id)}
                  disabled={isUpdating || isDeleting}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50 px-2 py-1 rounded transition"
                  title="Delete shift"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
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
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Lists;
