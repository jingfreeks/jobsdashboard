
import {memo} from "react";
import type { Company } from "@/features/company";



const CompanyItem = memo<{
  company: Company & { cityname: string };
  onEdit: (company: Company) => void;
  onDelete: (companyId: string) => void;
  isDeleting: boolean;
}>(({ company, onEdit, onDelete, isDeleting }) => (
  <li className="flex items-center justify-between py-3">
    <div className="flex-1 grid grid-cols-4 gap-4">
      {/* Company Name */}
      <span className="truncate text-slate-800 font-medium">
        {company.name}
      </span>
      
      {/* Address */}
      <span className="truncate text-slate-600">
        {company.address || 'No address'}
      </span>
      
      {/* City */}
      <span className="truncate text-slate-600">
        {company.cityname || 'No city assigned'}
      </span>
      
      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => onEdit(company)}
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
          onClick={() => onDelete(company._id)}
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
    </div>
  </li>
));
CompanyItem.displayName = 'CompanyItem';
export default CompanyItem;