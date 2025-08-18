/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search, Funnel } from "lucide-react";
import { type Job } from '@/features/jobs';

interface SearchFilterProps {
  jobsWithDetails: any[];
  companies: any[];
  cities: any[];
  departments: any[];
  selectedCompanyFilter: string;
  setSelectedCompanyFilter: (value: string) => void;
  selectedCityFilter: string;
  setSelectedCityFilter: (value: string) => void;
  selectedDepartmentFilter: string;
  setSelectedDepartmentFilter: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filteredJobs: Job[];
}
const SearchFilter = (props: SearchFilterProps) => {
  const {
    jobsWithDetails,
    companies,
    cities,
    departments,
    selectedCompanyFilter,
    setSelectedCompanyFilter,
    selectedCityFilter,
    setSelectedCityFilter,
    selectedDepartmentFilter,
    setSelectedDepartmentFilter,
    searchTerm,
    setSearchTerm,
    filteredJobs,
  } = props;
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-slate-100 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Search jobs, companies, cities, or departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Funnel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <select
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white"
            value={selectedCompanyFilter}
            onChange={(e) => setSelectedCompanyFilter(e.target.value)}
          >
            <option value="">All Companies</option>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {(companies as any[])?.map((company: any) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <Funnel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <select
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white"
            value={selectedCityFilter}
            onChange={(e) => setSelectedCityFilter(e.target.value)}
          >
            <option value="">All Cities</option>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {(cities as any[])?.map((city: any) => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <Funnel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <select
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white"
            value={selectedDepartmentFilter}
            onChange={(e) => setSelectedDepartmentFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {(departments as any[])?.map((department: any) => (
              <option key={department._id} value={department._id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 text-sm text-slate-600">
        Showing {filteredJobs.length} of {jobsWithDetails?.length || 0} jobs
      </div>
    </div>
  );
};
export default SearchFilter;
