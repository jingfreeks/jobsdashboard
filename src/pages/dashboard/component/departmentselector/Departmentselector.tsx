import { PlusCircle } from "lucide-react";
import { useState } from "react";


const DepartmentSelector = () => {
  const [departments, setDepartments] = useState([
    { id: "1", name: "Engineering" },
    { id: "2", name: "Marketing" },
    { id: "3", name: "Sales" },
  ]);
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [showEditDepartmentModal, setShowEditDepartmentModal] = useState(false);
  const [editDepartmentId, setEditDepartmentId] = useState<string | null>(null);
  const [editDepartmentName, setEditDepartmentName] = useState("");

  const handleAddDepartment = () => setShowAddDepartmentModal(true);
  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDepartmentName.trim()) {
      const newId = departments.length
        ? (Math.max(...departments.map((d) => parseInt(d.id))) + 1).toString()
        : "1";
      setDepartments([
        ...departments,
        { id: newId, name: newDepartmentName.trim() },
      ]);
      setNewDepartmentName("");
      setShowAddDepartmentModal(false);
    }
  };
  const handleEditDepartment = (id: string) => {
    const department = departments.find((d) => d.id === id);
    if (department) {
      setEditDepartmentId(id);
      setEditDepartmentName(department.name);
      setShowEditDepartmentModal(true);
    }
  };
  const handleUpdateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (editDepartmentId !== null && editDepartmentName.trim()) {
      setDepartments(
        departments.map((d) =>
          d.id === editDepartmentId
            ? { ...d, name: editDepartmentName.trim() }
            : d
        )
      );
      setShowEditDepartmentModal(false);
      setEditDepartmentId(null);
      setEditDepartmentName("");
    }
  };
  const handleDeleteDepartment = (id: string) => {
    setDepartments(departments.filter((d) => d.id !== id));
  };
  const handleCloseAddDepartmentModal = () => {
    setShowAddDepartmentModal(false);
    setNewDepartmentName("");
  };
  const handleCloseEditDepartmentModal = () => {
    setShowEditDepartmentModal(false);
    setEditDepartmentId(null);
    setEditDepartmentName("");
  };
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Department List</h2>
        <button
          onClick={handleAddDepartment}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          <PlusCircle className="w-5 h-5" /> Add Department
        </button>
      </div>
      {/* Add Department Modal */}
      {showAddDepartmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseAddDepartmentModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Create New Department
            </h3>
            <form
              onSubmit={handleCreateDepartment}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Department Name"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                autoFocus
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseAddDepartmentModal}
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
      {/* Edit Department Modal */}
      {showEditDepartmentModal && (
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
            <form
              onSubmit={handleUpdateDepartment}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Department Name"
                value={editDepartmentName}
                onChange={(e) => setEditDepartmentName(e.target.value)}
                autoFocus
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseEditDepartmentModal}
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
        {departments.length === 0 ? (
          <div className="text-slate-400 italic">No departments</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {departments.map((department) => (
              <li
                key={department.id}
                className="flex items-center justify-between py-3"
              >
                <span className="flex-1 truncate text-slate-800 font-medium">
                  {department.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditDepartment(department.id)}
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
                    onClick={() => handleDeleteDepartment(department.id)}
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
export default DepartmentSelector;
