import { PlusCircle } from "lucide-react";
import { useState, useCallback, memo } from "react";
import { useBankOperations } from "@/hooks/useBankOperations";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ToastContainer";
import type { Bank } from "@/features/bank";

// Memoized Bank Item Component
const BankItem = memo(({ 
  bank, 
  onEdit, 
  onDelete, 
  isDeleting 
}: { 
  bank: Bank; 
  onEdit: (bank: Bank) => void; 
  onDelete: (id: string) => void; 
  isDeleting: boolean;
}) => (
  <li className="flex items-center justify-between py-3">
    <span className="flex-1 truncate text-slate-800 font-medium">
      {bank.name}
    </span>
    <div className="flex gap-2">
      <button
        onClick={() => onEdit(bank)}
        className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded transition"
        disabled={isDeleting}
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
        onClick={() => onDelete(bank._id)}
        className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition disabled:opacity-50"
        disabled={isDeleting}
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
));

BankItem.displayName = 'BankItem';

// Memoized Modal Component
const BankModal = memo(({ 
  isOpen, 
  title, 
  value, 
  onChange, 
  onSubmit, 
  onClose, 
  isLoading, 
  submitText 
}: {
  isOpen: boolean;
  title: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isLoading: boolean;
  submitText: string;
}) => {
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
        <h3 className="text-xl font-bold mb-4 text-slate-800">{title}</h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Bank Name"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoFocus
            required
            disabled={isLoading}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? `${submitText}...` : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

BankModal.displayName = 'BankModal';

const Bankselector = () => {
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [showEditBankModal, setShowEditBankModal] = useState(false);
  const [editBankId, setEditBankId] = useState<string | null>(null);
  const [editBankName, setEditBankName] = useState("");
  const [newBankName, setNewBankName] = useState("");

  // Use optimized bank operations hook
  const {
    banks,
    isLoading,
    error,
    isAdding,
    isUpdating,
    isDeleting,
    createBank,
    updateBankById,
    deleteBankById,
  } = useBankOperations();

  // Use toast for notifications
  const { toasts, removeToast, showSuccess, showError } = useToast();

  // Memoized callbacks for better performance
  const handleAddBank = useCallback(() => setShowAddBankModal(true), []);

  const handleEditBank = useCallback((bank: Bank) => {
    setEditBankId(bank._id);
    setEditBankName(bank.name);
    setShowEditBankModal(true);
  }, []);

  const handleDeleteBank = useCallback(async (bankId: string) => {
    // Find the bank name for the confirmation message
    const bank = banks.find(b => b._id === bankId);
    const bankName = bank?.name || 'this bank';
    
    // Show confirmation dialog
    const isConfirmed = window.confirm(`Are you sure you want to delete "${bankName}"? This action cannot be undone.`);
    
    if (isConfirmed) {
      const success = await deleteBankById(bankId);
      if (!success) {
        console.error('Failed to delete bank');
        showError('Failed to delete bank. Please try again.');
      } else {
        showSuccess(`Bank "${bankName}" has been deleted successfully.`);
      }
    }
  }, [deleteBankById, banks, showSuccess, showError]);

  const handleCloseAddBankModal = useCallback(() => {
    setShowAddBankModal(false);
    setNewBankName("");
  }, []);

  const handleCloseEditBankModal = useCallback(() => {
    setShowEditBankModal(false);
    setEditBankId(null);
    setEditBankName("");
  }, []);

  const handleCreateBank = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (newBankName.trim()) {
      const result = await createBank({ name: newBankName.trim() });
      if (result) {
        setNewBankName("");
        setShowAddBankModal(false);
        showSuccess(`Bank "${newBankName.trim()}" has been created successfully.`);
      } else {
        showError('Failed to create bank. Please try again.');
      }
    }
  }, [newBankName, createBank, showSuccess, showError]);

  const handleUpdateBank = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (editBankId && editBankName.trim()) {
      const result = await updateBankById({ _id: editBankId, name: editBankName.trim() });
      if (result) {
        setShowEditBankModal(false);
        setEditBankId(null);
        setEditBankName("");
        showSuccess(`Bank "${editBankName.trim()}" has been updated successfully.`);
      } else {
        showError('Failed to update bank. Please try again.');
      }
    }
  }, [editBankId, editBankName, updateBankById, showSuccess, showError]);

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-slate-600">Loading banks...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading banks. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      
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
      <BankModal
        isOpen={showAddBankModal}
        title="Create New Bank"
        value={newBankName}
        onChange={setNewBankName}
        onSubmit={handleCreateBank}
        onClose={handleCloseAddBankModal}
        isLoading={isAdding}
        submitText="Create"
      />

      {/* Edit Bank Modal */}
      <BankModal
        isOpen={showEditBankModal}
        title="Edit Bank"
        value={editBankName}
        onChange={setEditBankName}
        onSubmit={handleUpdateBank}
        onClose={handleCloseEditBankModal}
        isLoading={isUpdating}
        submitText="Update"
      />

      <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
        {banks.length === 0 ? (
          <div className="text-slate-400 italic">No banks found</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {banks.map((bank) => (
              <BankItem
                key={bank._id}
                bank={bank}
                onEdit={handleEditBank}
                onDelete={handleDeleteBank}
                isDeleting={isDeleting}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default memo(Bankselector);
