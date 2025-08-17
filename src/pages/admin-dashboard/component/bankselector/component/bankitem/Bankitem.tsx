import { memo, useCallback } from "react";
import { Edit, Trash2, Loader2 } from "lucide-react";
import type { Bank } from "@/features/bank";

interface BankItemProps {
  bank: Bank;
  onEdit: (bank: Bank) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const BankItem = memo(({ bank, onEdit, onDelete, isDeleting }: BankItemProps) => {
  const handleEdit = useCallback(() => {
    onEdit(bank);
  }, [onEdit, bank]);

  const handleDelete = useCallback(() => {
    onDelete(bank._id);
  }, [onDelete, bank._id]);

  return (
    <li className="flex items-center justify-between py-3">
      <span 
        className="flex-1 truncate text-slate-800 font-medium"
        title={bank.name}
      >
        {bank.name}
      </span>
      <div className="flex gap-2">
        <button
          onClick={handleEdit}
          disabled={isDeleting}
          className="text-blue-500 hover:text-blue-700 disabled:opacity-50 px-2 py-1 rounded transition"
          aria-label={`Edit ${bank.name}`}
          title={`Edit ${bank.name}`}
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-500 hover:text-red-700 disabled:opacity-50 px-2 py-1 rounded transition"
          aria-label={`Delete ${bank.name}`}
          title={`Delete ${bank.name}`}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </li>
  );
});

BankItem.displayName = 'BankItem';

export default BankItem;