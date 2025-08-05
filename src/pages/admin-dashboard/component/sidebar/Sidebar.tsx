
import {
  User,
  Briefcase,
  BarChart2,
  LogOut,
  PlusCircle,
  CalendarCheck2,
  ChevronDown,
  Settings as SettingsIcon,
} from "lucide-react";
import {SettingsSelector} from '../../component'

type SidBarScreenProps = {
    selectedSection: "dashboard" | "jobs" | "settings";
    setSelectedSection: (section: "dashboard" | "jobs" | "settings") => void;
    handleSettingsClick: (data: string) => void;
    handleLogout: () => void;
}
const SidBarScreen = (props:SidBarScreenProps) => {
    const { selectedSection,setSelectedSection,handleSettingsClick,handleLogout } = props;

    return(
      <aside className="w-64 bg-gradient-to-b from-blue-50 via-white to-white border-r border-slate-200 flex flex-col min-h-screen shadow-lg">
        {/* Sidebar Header */}
        <nav className="flex-1 px-4 py-6">
          <div className="mb-3 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Main
          </div>
          <ul className="flex flex-col gap-1">
            <li>
              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-base transition w-full
                  ${
                    selectedSection === "dashboard"
                      ? "bg-blue-100 text-blue-700 shadow"
                      : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                onClick={() => setSelectedSection("dashboard")}
              >
                <BarChart2 className="w-5 h-5" /> Dashboard
              </button>
            </li>
            <li>
              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-base transition w-full
                  ${
                    selectedSection === "jobs"
                      ? "bg-blue-100 text-blue-700 shadow"
                      : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                onClick={() => setSelectedSection("jobs")}
              >
                <Briefcase className="w-5 h-5" /> Jobs
              </button>
            </li>
          </ul>
          <div className="my-5 border-t border-slate-100" />
          <div className="mb-3 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Settings
          </div>
          <ul className="flex flex-col gap-1">
            <li>
              <button
                className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-base text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition w-full justify-between"
                onClick={() => setSelectedSection("settings")}
                aria-expanded={selectedSection === "settings"}
                aria-controls="sidebar-settings-sublist"
              >
                <span className="flex items-center gap-3">
                  <SettingsIcon className="w-5 h-5" /> Settings
                </span>
                <ChevronDown
                  className={`w-4 h-4 ml-2 transition-transform ${
                    selectedSection === "settings" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {selectedSection === "settings" && (
                <SettingsSelector onClick={handleSettingsClick} />
              )}
            </li>
          </ul>
          <div className="my-5 border-t border-slate-100" />
          <div className="mb-3 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Management
          </div>
          <ul className="flex flex-col gap-1">
            <li>
              <button className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-base text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition w-full">
                <PlusCircle className="w-5 h-5" /> Add Job
              </button>
            </li>
            <li>
              <button className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-base text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition w-full">
                <CalendarCheck2 className="w-5 h-5" /> Schedule Interview
              </button>
            </li>
          </ul>
        </nav>
        {/* User mini-profile */}
        <div className="px-6 pb-8 mt-auto flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
              <User className="w-6 h-6" />
            </span>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-800 leading-tight">
                Jane Doe
              </span>
              <span className="text-xs text-slate-500">Admin</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full bg-red-50 hover:bg-red-100 text-red-600 rounded-md px-4 py-2 font-semibold transition mt-2"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>
    )
}
export default SidBarScreen;