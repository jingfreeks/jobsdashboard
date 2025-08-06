import { memo } from "react";
import type { City } from "@/features/city";

interface CityItemProps {
  city: City & { statename: string };
  onEdit: (city: City) => void;
  onDelete: (cityId: string) => void;
  isDeleting: boolean;
}

const CityItem = memo<CityItemProps>(({ city, onEdit, onDelete, isDeleting }) => (
  <li className="flex items-center justify-between py-3">
    <div className="flex-1 grid grid-cols-4 gap-4">
      {/* City Image */}
      <div className="flex items-center">
        {city.image ? (
          <img
            src={city.image}
            alt={`${city.name} city`}
            className="w-12 h-12 object-cover rounded-lg border border-slate-200"
          />
        ) : (
          <div className="w-12 h-12 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
            <span className="text-slate-400 text-xs">No img</span>
          </div>
        )}
      </div>
      
      {/* City Name */}
      <span className="truncate text-slate-800 font-medium">
        {city.name}
      </span>
      
      {/* State */}
      <span className="truncate text-slate-600">
        {city.statename}
      </span>
      
      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => onEdit(city)}
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
          onClick={() => onDelete(city._id)}
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

CityItem.displayName = 'CityItem';

export default CityItem; 