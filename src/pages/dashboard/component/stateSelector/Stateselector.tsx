import { PlusCircle } from "lucide-react";


type statetypes={
    handleAddState: () => void;
    showAddStateModal: boolean;
    handleCloseAddStateModal: () => void;
    handleCreateState: (e: React.FormEvent) => void;
    newStateName: string;   
    setNewStateName: (name: string) => void;
    showEditStateModal: boolean;
    handleCloseEditStateModal: () => void;
    handleUpdateState: (e: React.FormEvent) => void;
    editStateName: string;
    setEditStateName: (name: string) => void;
    states: { id: string; name: string }[];
    handleEditState: (id: string) => void;
    handleDeleteState: (id: string) => void;
}
const StateSelector = (props:statetypes) => {
  const {
    handleAddState,
    showAddStateModal,
    handleCloseAddStateModal,
    handleCreateState,
    newStateName,
    setNewStateName,
    showEditStateModal,
    handleCloseEditStateModal,
    handleUpdateState,
    editStateName,
    setEditStateName,
    states,
    handleEditState,
    handleDeleteState,
  } = props;
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">State List</h2>
        <button
          onClick={handleAddState}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          <PlusCircle className="w-5 h-5" /> Add State
        </button>
      </div>
      {/* Add State Modal */}
      {showAddStateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseAddStateModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Create New State
            </h3>
            <form onSubmit={handleCreateState} className="flex flex-col gap-4">
              <input
                type="text"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="State Name"
                value={newStateName}
                onChange={(e) => setNewStateName(e.target.value)}
                autoFocus
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseAddStateModal}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit State Modal */}
      {showEditStateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseEditStateModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Edit State
            </h3>
            <form onSubmit={handleUpdateState} className="flex flex-col gap-4">
              <input
                type="text"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="State Name"
                value={editStateName}
                onChange={(e) => setEditStateName(e.target.value)}
                autoFocus
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseEditStateModal}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
        {states.length === 0 ? (
          <div className="text-slate-400 italic">No states</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {states.map((state) => (
              <li
                key={state.id}
                className="flex items-center justify-between py-3"
              >
                <span className="flex-1 truncate text-slate-800 font-medium">
                  {state.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditState(state.id)}
                    className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded transition"
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
                    onClick={() => handleDeleteState(state.id)}
                    className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition"
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
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default StateSelector;
