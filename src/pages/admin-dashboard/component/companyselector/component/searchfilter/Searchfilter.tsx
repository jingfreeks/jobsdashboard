import { Search, Filter } from "lucide-react";
import type { Company } from "@/features/company";

type SearchFilterProps = {
  companiesWithCities: Company[];
  cities: { _id: string; name: string }[];
  filteredCompanies: Company[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCityFilter: string;
  setSelectedCityFilter: (cityId: string) => void;
};
const SearchFilter = (props: SearchFilterProps) => {
  const {
    companiesWithCities,
    cities,
    filteredCompanies,
    searchTerm,
    setSearchTerm,
    selectedCityFilter,
    setSelectedCityFilter,
  } = props;
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-slate-100 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search companies, addresses, or cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* City Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <select
            value={selectedCityFilter}
            onChange={(e) => setSelectedCityFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white"
          >
            <option value="">All Cities</option>
            {cities?.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mt-4 text-sm text-slate-600">
        Showing {filteredCompanies.length} of {companiesWithCities?.length || 0}{" "}
        companies
      </div>
    </div>
  );
};
export default SearchFilter;
