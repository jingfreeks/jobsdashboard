import { Loader2 } from "lucide-react";
import { useCallback, memo, useMemo, Suspense, useState } from "react";
import { useBankOperations } from "@/hooks/useBankOperations";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ToastContainer";
import type { Bank } from "@/features/bank";
import {
  BankList,
  BankModal,
  LoadingSpinner,
  EmptyState,
} from "./component";
import { SettingsHeader } from "@/ui";
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

  // Delete confirmation modal state
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [bankToDelete, setBankToDelete] = useState<string | null>(null);

  // Memoized callbacks for better performance
  const handleAddBank = useCallback(() => openAddModal(), [openAddModal]);

  const handleEditBank = useCallback(
    (bank: Bank) => {
      openEditModal(bank._id, bank.name);
    },
    [openEditModal]
  );

  const handleDeleteBank = useCallback((bankId: string) => {
    setBankToDelete(bankId);
    setShowDeleteConfirmModal(true);
  }, []);

  const confirmDeleteBank = useCallback(async () => {
    if (bankToDelete) {
      const bank = getBankById(bankToDelete);
      const bankName = bank?.name || "this bank";

      const success = await deleteBankById(bankToDelete);
      if (!success) {
        console.error("Failed to delete bank");
        showError("Failed to delete bank. Please try again.");
      } else {
        showSuccess(`Bank "${bankName}" has been deleted successfully.`);
      }
      setShowDeleteConfirmModal(false);
      setBankToDelete(null);
    }
  }, [bankToDelete, deleteBankById, getBankById, showSuccess, showError]);

  const cancelDeleteBank = useCallback(() => {
    setShowDeleteConfirmModal(false);
    setBankToDelete(null);
  }, []);

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
    [
      editBankId,
      editBankName,
      updateBankById,
      closeEditModal,
      showSuccess,
      showError,
    ]
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
      <SettingsHeader
        isAdding={isAdding}
        handleAddAction={handleAddBank}
        btnLabel="Add Bank"
        title="Banks List"
      />
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && bankToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Confirm Delete
            </h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete "
              {banks.find((b) => b._id === bankToDelete)?.name}"? This action
              cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={cancelDeleteBank}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                data-testid="confirm-delete-bank-testId"
                onClick={confirmDeleteBank}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold flex items-center gap-2"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

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
