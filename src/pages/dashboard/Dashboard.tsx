import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Header,
  DasboardSelector,
  Jobselector,
  Bankselector,
  CitySelector,
  StateSelector,
  CompanySelector,
  SkillSelector,
  ShiftSelector,
  DepartmentSelector,
  Sidebar,
} from "./component";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<
    "dashboard" | "jobs" | "settings"
  >("dashboard");

  const handleLogout = () => {
    navigate("/login");
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
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}

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
            {selectedSection === "dashboard" && <DasboardSelector />}
            {selectedSection === "jobs" && <Jobselector />}
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
  );
};

export default Dashboard;
