import { memo } from "react";

// Memoized Add State Modal Component
const AddStateModal = 
  ({
    isOpen,
    onClose,
    onSubmit,
    stateName,
    setStateName,
    isAdding,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    stateName: string;
    setStateName: (name: string) => void;
    isAdding: boolean;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
          <button
            onClick={onClose}
            disabled={isAdding}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold disabled:opacity-50"
          >
            &times;
          </button>
          <h3 className="text-xl font-bold mb-4 text-slate-800">
            Create New State
          </h3>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="State Name"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              disabled={isAdding}
              autoFocus
              required
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isAdding}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAdding}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
              >
                {isAdding ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
export default memo(AddStateModal);
