import { User, BarChart2, Bell } from "lucide-react";
import { useState } from "react";

type HeaderProps = {
  handleLogout: () => void;
};

const Header = (props: HeaderProps) => {
  const { handleLogout } = props;
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const notifications = [
    { id: 1, message: "New job application received", time: "2m ago" },
    { id: 2, message: "Interview scheduled for John Doe", time: "1h ago" },
    { id: 3, message: "Offer sent to Jane Smith", time: "3h ago" },
  ];
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfile(false); // Close profile when opening notifications
  };
  
  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowNotifications(false); // Close notifications when opening profile
  };
  
  return (
    <header className="w-full bg-white/90 border-b border-slate-200 px-10 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-600">
          <BarChart2 className="w-5 h-5" data-testid="barchart2-icon" />
        </span>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Notifications Bell */}
        <div className="relative">
          <button 
            className="relative p-2 rounded-full hover:bg-blue-50 transition"
            onClick={toggleNotifications}
            data-testid="notification-button"
          >
            <Bell className="w-6 h-6 text-blue-700" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
              {notifications.length}
            </span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2">
              <div data-testid="notification-dropdown">
                {notifications.map((notification) => (
                  <div key={notification.id} data-testid={`notification-${notification.id}`}>
                    {notification.message} - {notification.time}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-lg focus:outline-none hover:bg-blue-200 transition"
            onClick={toggleProfile}
            data-testid="profile-button"
          >
            <User className="w-6 h-6" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-full mt-2">
              <div data-testid="profile-dropdown">
                <button data-testid="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
