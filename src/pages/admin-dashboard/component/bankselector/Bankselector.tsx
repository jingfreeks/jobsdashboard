import { PlusCircle, Loader2 } from "lucide-react";
import { useCallback, memo, useMemo, Suspense } from "react";
import { useBankOperations } from "@/hooks/useBankOperations";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ToastContainer";
import type { Bank } from "@/features/bank";
import { BankList, BankModal, LoadingSpinner, EmptyState } from "./component";
import { Bankselectorhooks } from "./hooks";

const Bankselector = () => {
  const {
    showAddBankModal,
    showEditBankModal,
    editBankId,
    editBankName,
    newBankName,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    setNewBankName,
    setEditBankName,
  } = Bankselectorhooks();

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
    getBankById,
  } = useBankOperations();

  // Use toast for notifications
  const { toasts, removeToast, showSuccess, showError } = useToast();

  // Memoized callbacks for better performance
  const handleAddBank = useCallback(() => openAddModal(), [openAddModal]);

  const handleEditBank = useCallback((bank: Bank) => {
    openEditModal(bank._id, bank.name);
  }, [openEditModal]);

  const handleDeleteBank = useCallback(
    async (bankId: string) => {
      // Use optimized bank lookup
      const bank = getBankById(bankId);
      const bankName = bank?.name || "this bank";

      // Show confirmation dialog
      const isConfirmed = window.confirm(
        `Are you sure you want to delete "${bankName}"? This action cannot be undone.`
      );

      if (isConfirmed) {
        const success = await deleteBankById(bankId);
        if (!success) {
          console.error("Failed to delete bank");
          showError("Failed to delete bank. Please try again.");
        } else {
          showSuccess(`Bank "${bankName}" has been deleted successfully.`);
        }
      }
    },
    [deleteBankById, getBankById, showSuccess, showError]
  );

  const handleCreateBank = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (newBankName.trim()) {
        const result = await createBank({ name: newBankName.trim() });
        if (result) {
          closeAddModal();
          showSuccess(
            `Bank "${newBankName.trim()}" has been created successfully.`
          );
        } else {
          showError("Failed to create bank. Please try again.");
        }
      }
    },
    [newBankName, createBank, closeAddModal, showSuccess, showError]
  );

  const handleUpdateBank = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (editBankId && editBankName.trim()) {
        const result = await updateBankById({
          _id: editBankId,
          name: editBankName.trim(),
        });
        if (result) {
          closeEditModal();
          showSuccess(
            `Bank "${editBankName.trim()}" has been updated successfully.`
          );
        } else {
          showError("Failed to update bank. Please try again.");
        }
      }
    },
    [editBankId, editBankName, updateBankById, closeEditModal, showSuccess, showError]
  );

  // Memoized computed values
  const hasBanks = useMemo(() => banks.length > 0, [banks.length]);

  // Loading state
  if (isLoading) {
    return <LoadingSpinner />;
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
        <h2 className="text-2xl font-bold text-slate-800">Banks List</h2>
        <button
          onClick={handleAddBank}
          disabled={isAdding}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          {isAdding ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <PlusCircle className="w-5 h-5" />
          )}
          {isAdding ? "Adding..." : "Add Bank"}
        </button>
      </div>

      {/* Add Bank Modal */}
      <BankModal
        isOpen={showAddBankModal}
        title="Create New Bank"
        value={newBankName}
        onChange={setNewBankName}
        onSubmit={handleCreateBank}
        onClose={closeAddModal}
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
        onClose={closeEditModal}
        isLoading={isUpdating}
        submitText="Update"
      />

      {/* Bank List or Empty State */}
      <Suspense fallback={<LoadingSpinner />}>
       
          {hasBanks ? (
            <BankList
              banks={banks}
              onEdit={handleEditBank}
              onDelete={handleDeleteBank}
              isDeleting={isDeleting}
            />
          ) : (
            <EmptyState />
          )}
      </Suspense>
    </div>
  );
};

export default memo(Bankselector);
