
import {
  Briefcase,
  BarChart2,
  CalendarCheck2,
  Landmark,
  Building2,
  MapPin,
} from "lucide-react";

type SettingsSelectorProps = {
  onClick: (param:string) => void;
};
const SettingsSelector = (props: SettingsSelectorProps) => {
  const {
    onClick,
  } = props;
  return (
    <>
      <ul
        id="sidebar-settings-sublist"
        className="ml-8 mt-1 flex flex-col gap-1 border-l border-blue-100 pl-4"
      >
        <li>
          <button
            className="flex items-center gap-2 px-2 py-1 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition w-full text-sm"
            onClick={()=>onClick("bank")}
          >
            <Landmark className="w-4 h-4" /> Bank
          </button>
        </li>
        <li>
          <button
            className="flex items-center gap-2 px-2 py-1 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition w-full text-sm"
            onClick={()=>onClick("city")}
          >
            <Building2 className="w-4 h-4" /> City
          </button>
        </li>
        <li>
          <button
            className="flex items-center gap-2 px-2 py-1 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition w-full text-sm"
            onClick={()=>onClick("state")}
          >
            <MapPin className="w-4 h-4" /> State
          </button>
        </li>
        <li>
          <button
            className="flex items-center gap-2 px-2 py-1 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition w-full text-sm"
            onClick={()=>onClick("company")}
          >
            <Briefcase className="w-4 h-4" /> Company
          </button>
        </li>
        <li>
          <button
            className="flex items-center gap-2 px-2 py-1 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition w-full text-sm"
            onClick={()=>onClick("skills")}
          >
            <BarChart2 className="w-4 h-4" /> Skills
          </button>
        </li>
        <li>
          <button
            className="flex items-center gap-2 px-2 py-1 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition w-full text-sm"
            onClick={()=>onClick("shift")}
          >
            <CalendarCheck2 className="w-4 h-4" /> Shift
          </button>
        </li>
        <li>
          <button
            className="flex items-center gap-2 px-2 py-1 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition w-full text-sm"
            onClick={()=>onClick("department")}
          >
            <Building2 className="w-4 h-4" /> Department
          </button>
        </li>
      </ul>
    </>
  );
};
export default SettingsSelector;
