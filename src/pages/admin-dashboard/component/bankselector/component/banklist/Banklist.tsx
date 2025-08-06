import { memo } from "react";
import { BankItem } from "../bankitem";
import type { Bank } from "@/features/bank";

// Bank List Component
const BankList = memo(({
  banks,
  onEdit,
  onDelete,
  isDeleting,
}: {
  banks: Bank[];
  onEdit: (bank: Bank) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) => (
  <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
    <ul className="divide-y divide-slate-100" role="list">
      {banks.map((bank) => (
        <BankItem
          key={bank._id}
          bank={bank}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </ul>
  </div>
));

BankList.displayName = "BankList";

export default BankList;
