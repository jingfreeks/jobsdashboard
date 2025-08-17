import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthMonitor } from "@/components/AuthMonitor";
import {
  Header,
  DasboardSelector,
  JobSelector,
  Bankselector,
  CitySelector,
  StateSelector,
  CompanySelector,
  SkillSelector,
  ShiftSelector,
  DepartmentSelector,
  Sidebar,
} from "./component";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [selectedSection, setSelectedSection] = useState<
    "dashboard" | "jobs" | "settings"
  >("dashboard");

  const handleLogout = async () => {
    await logout(true); // Show message for manual logout
  };

  const [selectedSettings, setSelectedSettings] = useState<
    | "bank"
    | "city"
    | "state"
    | "company"
    | "skills"
    | "shift"
    | "department"
    | null
  >(null);
  const handleSettingsClick = (data: string) => {
    if (
      data === "bank" ||
      data === "city" ||
      data === "state" ||
      data === "company" ||
      data === "skills" ||
      data === "shift" ||
      data === "department"
    ) {
      setSelectedSettings(data);
    }
  };

  return (
    <>
      <AuthMonitor />
      <div className="flex min-h-screen bg-slate-100">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Topbar */}
          <Header handleLogout={handleLogout} />
          <div className="flex flex-row w-full">
          <Sidebar
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            handleSettingsClick={handleSettingsClick}
            handleLogout={handleLogout}
          />
          {/* Content */}

          <main className="flex-1 p-10 bg-slate-100">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600">Manage jobs, companies, and system settings</p>
            </div>
            {selectedSection === "dashboard" && <DasboardSelector />}
            {selectedSection === "jobs" && <JobSelector />}
            {selectedSection === "settings" && selectedSettings === "bank" && (
              <Bankselector />
            )}
            {selectedSection === "settings" && selectedSettings === "city" && (
              <CitySelector />
            )}
            {selectedSection === "settings" && selectedSettings === "state" && (
              <StateSelector />
            )}
            {selectedSection === "settings" &&
              selectedSettings === "company" && <CompanySelector />}
            {selectedSection === "settings" &&
              selectedSettings === "skills" && <SkillSelector />}
            {selectedSection === "settings" && selectedSettings === "shift" && (
              <ShiftSelector />
            )}
            {selectedSection === "settings" &&
              selectedSettings === "department" && <DepartmentSelector />}
          </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard; 