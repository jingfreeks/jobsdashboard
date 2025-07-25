import { PlusCircle } from "lucide-react";


type Shifttype={
    handleAddShift: () => void;
    showAddShiftModal: boolean;
    handleCloseAddShiftModal: () => void;
    handleCreateShift: (e: React.FormEvent) => void;
    newShiftName: string;
    setNewShiftName: (name: string) => void;
    handleEditShift: (id: string) => void;
    showEditShiftModal: boolean;
    handleCloseEditShiftModal: () => void;
    handleUpdateShift: (e: React.FormEvent) => void;
    editShiftName: string;
    setEditShiftName: (name: string) => void;
    shifts: { id: string; name: string }[];
    handleDeleteShift: (id: string) => void;    
}
const ShiftSelector = (props:Shifttype) => {
  const {
    handleAddShift,
    showAddShiftModal,
    handleCloseAddShiftModal,
    handleCreateShift,
    newShiftName,setNewShiftName,
    handleEditShift,
    showEditShiftModal,
    handleCloseEditShiftModal,
    handleUpdateShift,
    editShiftName,
    setEditShiftName,
    shifts,
    handleDeleteShift,
  } = props;
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Shift List</h2>
        <button
          onClick={handleAddShift}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          <PlusCircle className="w-5 h-5" /> Add Shift
        </button>
      </div>
      {/* Add Shift Modal */}
      {showAddShiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseAddShiftModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Create New Shift
            </h3>
            <form onSubmit={handleCreateShift} className="flex flex-col gap-4">
              <input
                type="text"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Shift Name"
                value={newShiftName}
                onChange={(e) => setNewShiftName(e.target.value)}
                autoFocus
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseAddShiftModal}
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
      {/* Edit Shift Modal */}
      {showEditShiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseEditShiftModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Edit Shift
            </h3>
            <form onSubmit={handleUpdateShift} className="flex flex-col gap-4">
              <input
                type="text"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Shift Name"
                value={editShiftName}
                onChange={(e) => setEditShiftName(e.target.value)}
                autoFocus
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseEditShiftModal}
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
        {shifts.length === 0 ? (
          <div className="text-slate-400 italic">No shifts</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {shifts.map((shift) => (
              <li
                key={shift.id}
                className="flex items-center justify-between py-3"
              >
                <span className="flex-1 truncate text-slate-800 font-medium">
                  {shift.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditShift(shift.id)}
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
                    onClick={() => handleDeleteShift(shift.id)}
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
export default ShiftSelector;
