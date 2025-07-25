import { User, BarChart2, Bell } from "lucide-react";


type HeaderProps = {  setShowNotifications: (value: boolean) => void;
  notifications: { id: number; message: string; time: string }[];
  showNotifications: boolean;
  setShowProfile: (value: boolean) => void;
  showProfile: boolean;
  handleLogout: () => void;
};

const Header = (props: HeaderProps) => {
  const {
    setShowNotifications,
    notifications,
    showNotifications,
    setShowProfile,
    showProfile,
    handleLogout,
  } = props;
  return (
    <header className="w-full bg-white/90 border-b border-slate-200 px-10 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-600">
          <BarChart2 className="w-5 h-5" />
        </span>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-blue-50 transition"
          >
            <Bell className="w-6 h-6 text-blue-700" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
              {notifications.length}
            </span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
              <div className="p-4 border-b border-slate-100 font-semibold text-slate-700">
                Notifications
              </div>
              <ul className="max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="px-4 py-2 hover:bg-slate-50 text-slate-700 flex justify-between"
                  >
                    <span>{n.message}</span>
                    <span className="text-xs text-slate-400 ml-2">{n.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-lg focus:outline-none"
          >
            <User className="w-6 h-6" />
          </button>
          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
              <div className="p-4 border-b border-slate-100">
                <span className="block font-semibold text-slate-800">
                  Jane Doe
                </span>
                <span className="block text-xs text-slate-500">Admin</span>
              </div>
              <ul>
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700">
                    Profile
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700">
                    Settings
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
