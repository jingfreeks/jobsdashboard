import { User, BarChart2, Bell } from "lucide-react";
import { useState } from "react";
import { Notification, Profile } from "@/ui";

type HeaderProps = {
  setShowProfile: (value: boolean) => void;
  showProfile: boolean;
  handleLogout: () => void;
};

const Header = (props: HeaderProps) => {
  const { setShowProfile, showProfile, handleLogout } = props;
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = [
    { id: 1, message: "New job application received", time: "2m ago" },
    { id: 2, message: "Interview scheduled for John Doe", time: "1h ago" },
    { id: 3, message: "Offer sent to Jane Smith", time: "3h ago" },
  ];
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
          {showNotifications && <Notification data={notifications} />}
        </div>
        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-lg focus:outline-none"
          >
            <User className="w-6 h-6" />
          </button>
          {showProfile && <Profile handleLogout={handleLogout} />}
        </div>
      </div>
    </header>
  );
};
export default Header;
