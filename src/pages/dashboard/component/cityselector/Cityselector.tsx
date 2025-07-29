import { PlusCircle } from "lucide-react";
import { useState } from "react";

const CitySelector = () => {
  const [newCityName, setNewCityName] = useState("");
  const [editCityId, setEditCityId] = useState<string | null>(null);
  const [editCityName, setEditCityName] = useState("");
  const [showEditCityModal, setShowEditCityModal] = useState(false);
  const [cities, setCities] = useState([
    { id: "1", name: "New York" },
    { id: "2", name: "Los Angeles" },
    { id: "3", name: "Chicago" },
  ]);
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const handleAddCity = () => setShowAddCityModal(true);
  const handleDeleteCity = (id: string) => {
    setCities(cities.filter((c) => c.id !== id));
  };
  const handleEditCity = (id: string) => {
    const city = cities.find((c) => c.id === id);
    if (city) {
      setEditCityId(id);
      setEditCityName(city.name);
      setShowEditCityModal(true);
    }
  };

  const handleCloseAddCityModal = () => {
    setShowAddCityModal(false);
    setNewCityName("");
  };

  const handleCreateCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCityName.trim()) {
      const newId = cities.length
        ? (Math.max(...cities.map((c) => parseInt(c.id))) + 1).toString()
        : "1";
      setCities([...cities, { id: newId, name: newCityName.trim() }]);
      setNewCityName("");
      setShowAddCityModal(false);
    }
  };
  const handleCloseEditCityModal = () => {
    setShowEditCityModal(false);
    setEditCityId(null);
    setEditCityName("");
  };
  const handleUpdateCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (editCityId !== null && editCityName.trim()) {
      setCities(
        cities.map((c) =>
          c.id === editCityId ? { ...c, name: editCityName.trim() } : c
        )
      );
      setShowEditCityModal(false);
      setEditCityId(null);
      setEditCityName("");
    }
  };
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">City List</h2>
        <button
          onClick={handleAddCity}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          <PlusCircle className="w-5 h-5" /> Add City
        </button>
      </div>
      {/* Add City Modal */}
      {showAddCityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseAddCityModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Create New City
            </h3>
            <form onSubmit={handleCreateCity} className="flex flex-col gap-4">
              <input
                type="text"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="City Name"
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                autoFocus
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseAddCityModal}
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
      {/* Edit City Modal */}
      {showEditCityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseEditCityModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-slate-800">Edit City</h3>
            <form onSubmit={handleUpdateCity} className="flex flex-col gap-4">
              <input
                type="text"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="City Name"
                value={editCityName}
                onChange={(e) => setEditCityName(e.target.value)}
                autoFocus
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseEditCityModal}
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
        {cities.length === 0 ? (
          <div className="text-slate-400 italic">No cities</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {cities.map((city) => (
              <li
                key={city.id}
                className="flex items-center justify-between py-3"
              >
                <span className="flex-1 truncate text-slate-800 font-medium">
                  {city.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCity(city.id)}
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
                    onClick={() => handleDeleteCity(city.id)}
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
export default CitySelector;
