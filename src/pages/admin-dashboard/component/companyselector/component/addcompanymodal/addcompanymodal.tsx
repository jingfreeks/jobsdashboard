import { memo } from "react";


const AddCompanyModal = memo<{
  isOpen: boolean;
  newCompanyName: string;
  newCompanyAddress: string;
  selectedCityId: string;
  cities: Array<{ _id: string; name: string }> | undefined;
  onNewCompanyNameChange: (name: string) => void;
  onNewCompanyAddressChange: (address: string) => void;
  onCityChange: (cityId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isAdding: boolean;
}>(({ isOpen, newCompanyName, newCompanyAddress, selectedCityId, cities, onNewCompanyNameChange, onNewCompanyAddressChange, onCityChange, onSubmit, onClose, isAdding }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-slate-800">
          Create New Company
        </h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Company Name"
            value={newCompanyName}
            onChange={(e) => onNewCompanyNameChange(e.target.value)}
            autoFocus
            required
            disabled={isAdding}
          />
          <textarea
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 resize-none"
            placeholder="Company Address"
            value={newCompanyAddress}
            onChange={(e) => onNewCompanyAddressChange(e.target.value)}
            rows={3}
            disabled={isAdding}
          />
          <select
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            value={selectedCityId}
            onChange={(e) => onCityChange(e.target.value)}
            disabled={isAdding}
          >
            <option value="">Select City</option>
            {cities?.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>
          
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              disabled={isAdding}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
              disabled={isAdding}
            >
              {isAdding ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

AddCompanyModal.displayName = 'AddCompanyModal';

export default AddCompanyModal;