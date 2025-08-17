import { memo } from "react";
import type { State } from "@/features/state";

// Memoized State Item Component
const StateItem = 
  ({
    state,
    onEdit,
    onDelete,
    isDeleting,
  }: {
    state: State;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    isDeleting: boolean;
  }) => (
    <li className="flex items-center justify-between py-3">
      <span className="flex-1 truncate text-slate-800 font-medium">
        {state.name}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(state._id)}
          disabled={isDeleting}
          className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded transition disabled:opacity-50"
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
          onClick={() => onDelete(state._id)}
          disabled={isDeleting}
          className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition disabled:opacity-50"
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
  )

export default memo(StateItem);
