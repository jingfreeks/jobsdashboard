import {
  CompanyItem,
} from "../";
import type { Company as Companyitem} from "@/features/company";

type CompanySelectorProps = {
  filteredCompanies: Companyitem[];
  searchTerm: string;
  selectedCityFilter: string;
  handleEditCompany: (company: Companyitem) => void;
  handleDeleteCompany: (companyId: string) => void;
  isDeleting: boolean;
};
const List = (props:CompanySelectorProps) => {
    const {
    filteredCompanies,
    searchTerm,
    selectedCityFilter,
    handleEditCompany,
    handleDeleteCompany,
    isDeleting,
  } = props;
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
      {/* Table Header */}
      <div className="grid grid-cols-4 gap-4 pb-3 border-b border-slate-200 mb-4">
        <div className="font-semibold text-slate-800">Company Name</div>
        <div className="font-semibold text-slate-800">Address</div>
        <div className="font-semibold text-slate-800">City</div>
        <div className="font-semibold text-slate-800">Actions</div>
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="text-slate-400 italic text-center py-8">
          {searchTerm || selectedCityFilter
            ? "No companies match your search criteria"
            : "No companies"}
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {filteredCompanies.map((company: Companyitem) => {
            // Ensure cityname is always a string
            const companyWithCityname = {
              ...company,
              cityname: company.cityname ?? "",
            };
            return (
              <CompanyItem
                key={company._id}
                company={companyWithCityname}
                onEdit={handleEditCompany}
                onDelete={handleDeleteCompany}
                isDeleting={isDeleting}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};
export default List;
