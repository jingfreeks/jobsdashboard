import { PlusCircle } from "lucide-react";
import { useState } from "react";


const Bankselector = () => {
 
  const handleAddBank = () => setShowAddBankModal(true);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [editBankId, setEditBankId] = useState<string | null>(null);
  const [showEditBankModal, setShowEditBankModal] = useState(false);
  const [editBankName, setEditBankName] = useState("");
  const [newBankName, setNewBankName] = useState("");
  const [banks, setBanks] = useState([
    { id: "1", name: "Bank of America" },
    { id: "2", name: "Chase Bank" },
    { id: "3", name: "Wells Fargo" },
  ]);
  const handleEditBank = (id: string) => {
    const bank = banks.find((b) => b.id === id);
    if (bank) {
      setEditBankId(id);
      setEditBankName(bank.name);
      setShowEditBankModal(true);
    }
  };
  const handleDeleteBank = (id: string) => {
    setBanks(banks.filter((b) => b.id !== id));
  };
  const handleCloseAddBankModal = () => {
    setShowAddBankModal(false);
    setNewBankName("");
  };

  const handleCloseEditBankModal = () => {
    setShowEditBankModal(false);
    setEditBankId(null);
    setEditBankName("");
  };

  const handleCreateBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBankName.trim()) {
      const newId = banks.length
        ? (Math.max(...banks.map((b) => parseInt(b.id))) + 1).toString()
        : "1";
      setBanks([...banks, { id: newId, name: newBankName.trim() }]);
      setNewBankName("");
      setShowAddBankModal(false);
    }
  };

  const handleUpdateBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (editBankId !== null && editBankName.trim()) {
      setBanks(
        banks.map((b) =>
          b.id === editBankId ? { ...b, name: editBankName.trim() } : b
        )
      );
      setShowEditBankModal(false);
      setEditBankId(null);
      setEditBankName("");
    }
  };
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Bank List</h2>
        <button
          onClick={handleAddBank}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          <PlusCircle className="w-5 h-5" /> Add Bank
        </button>
      </div>
      {/* Add Bank Modal */}
      {showAddBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseAddBankModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Create New Bank
            </h3>
            <form onSubmit={handleCreateBank} className="flex flex-col gap-4">
              <input
                type="text"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Bank Name"
                value={newBankName}
                onChange={(e) => setNewBankName(e.target.value)}
                autoFocus
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseAddBankModal}
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
      {/* Edit Bank Modal */}
      {showEditBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseEditBankModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-slate-800">Edit Bank</h3>
            <form onSubmit={handleUpdateBank} className="flex flex-col gap-4">
              <input
                type="text"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Bank Name"
                value={editBankName}
                onChange={(e) => setEditBankName(e.target.value)}
                autoFocus
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseEditBankModal}
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
        {banks.length === 0 ? (
          <div className="text-slate-400 italic">No banks</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {banks.map((bank) => (
              <li
                key={bank.id}
                className="flex items-center justify-between py-3"
              >
                <span className="flex-1 truncate text-slate-800 font-medium">
                  {bank.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditBank(bank.id)}
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
                    onClick={() => handleDeleteBank(bank.id)}
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
export default Bankselector;
