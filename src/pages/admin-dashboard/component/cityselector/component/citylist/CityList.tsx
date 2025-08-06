import { memo, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import type { City } from "@/features/city";
import { CityItem } from "../cityitem";

interface CityListProps {
  citiesWithStates: Array<City & { statename: string }>;
  states: Array<{ _id: string; name: string }> | undefined;
  searchTerm: string;
  selectedStateFilter: string;
  onSearchChange: (term: string) => void;
  onStateFilterChange: (stateId: string) => void;
  onEdit: (city: City) => void;
  onDelete: (cityId: string) => void;
  isDeleting: boolean;
}

const CityList = memo<CityListProps>(({ 
  citiesWithStates, 
  states, 
  searchTerm, 
  selectedStateFilter, 
  onSearchChange, 
  onStateFilterChange, 
  onEdit, 
  onDelete, 
  isDeleting 
}) => {
  // Filtered cities based on search and state filter
  const filteredCities = useMemo(() => {
    return citiesWithStates.filter(city => {
      const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           city.statename.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStateFilter = !selectedStateFilter || city.stateId === selectedStateFilter;
      return matchesSearch && matchesStateFilter;
    });
  }, [citiesWithStates, searchTerm, selectedStateFilter]);

  return (
    <>
      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow p-6 border border-slate-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search cities or states..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          {/* State Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select
              value={selectedStateFilter}
              onChange={(e) => onStateFilterChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white"
            >
              <option value="">All States</option>
              {states?.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Results count */}
        <div className="mt-4 text-sm text-slate-600">
          Showing {filteredCities.length} of {citiesWithStates.length} cities
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 pb-3 border-b border-slate-200 mb-4">
          <div className="font-semibold text-slate-800">Image</div>
          <div className="font-semibold text-slate-800">City Name</div>
          <div className="font-semibold text-slate-800">State</div>
          <div className="font-semibold text-slate-800">Actions</div>
        </div>
        
        {filteredCities.length === 0 ? (
          <div className="text-slate-400 italic text-center py-8">
            {searchTerm || selectedStateFilter ? 'No cities match your search criteria' : 'No cities'}
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredCities.map((city) => (
              <CityItem
                key={city._id}
                city={city}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={isDeleting}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
});

CityList.displayName = 'CityList';

export default CityList; 