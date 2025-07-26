import { useNavigate } from "react-router-dom";
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
import { useState } from "react";
import {
  Header,
  DasboardSelector,
  SettingsSelector,
  Jobselector,
  Bankselector,
  CitySelector,
  StateSelector,
  CompanySelector,
  SkillSelector,
  ShiftSelector,
  DepartmentSelector,
} from "./component";

const data = [
  { name: "Jan", jobs: 12 },
  { name: "Feb", jobs: 18 },
  { name: "Mar", jobs: 9 },
  { name: "Apr", jobs: 15 },
  { name: "May", jobs: 20 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [selectedSection, setSelectedSection] = useState<
    "dashboard" | "jobs" | "settings"
  >("dashboard");
  const [jobs, setJobs] = useState([
    { id: "1", title: "Frontend Developer" },
    { id: "2", title: "Backend Engineer" },
    { id: "3", title: "Product Manager" },
  ]);
  const activities = [
    {
      id: 1,
      activity: "You added a new job: Frontend Developer",
      time: "Today, 09:00",
    },
    {
      id: 2,
      activity: "Interview completed: Backend Engineer",
      time: "Yesterday, 15:30",
    },
    {
      id: 3,
      activity: "Offer accepted: Product Manager",
      time: "Yesterday, 11:10",
    },
  ];
  const tasks = [
    { id: 1, task: "Follow up with recruiter", due: "Today" },
    { id: 2, task: "Prepare for interview", due: "Tomorrow" },
    { id: 3, task: "Review candidate resumes", due: "This week" },
  ];
  const handleLogout = () => {
    navigate("/login");
  };
  // Job actions
  const handleEditJob = (id: string) => {
    const job = jobs.find((j) => j.id === id);
    if (job) {
      setEditJobId(id);
      setEditJobTitle(job.title);
      setShowEditJobModal(true);
    }
  };
  const handleDeleteJob = (id: string) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState("");
  const handleAddJob = () => {
    setShowAddJobModal(true);
  };
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (newJobTitle.trim()) {
      const newId = jobs.length
        ? (Math.max(...jobs.map((j) => parseInt(j.id))) + 1).toString()
        : "1";
      setJobs([...jobs, { id: newId, title: newJobTitle.trim() }]);
      setNewJobTitle("");
      setShowAddJobModal(false);
    }
  };
  const handleCloseModal = () => {
    setShowAddJobModal(false);
    setNewJobTitle("");
  };
  const [showEditJobModal, setShowEditJobModal] = useState(false);
  const [editJobId, setEditJobId] = useState<string | null>(null);
  const [editJobTitle, setEditJobTitle] = useState("");
  const handleUpdateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (editJobId !== null && editJobTitle.trim()) {
      setJobs(
        jobs.map((j) =>
          j.id === editJobId ? { ...j, title: editJobTitle.trim() } : j
        )
      );
      setShowEditJobModal(false);
      setEditJobId(null);
      setEditJobTitle("");
    }
  };
  const handleCloseEditModal = () => {
    setShowEditJobModal(false);
    setEditJobId(null);
    setEditJobTitle("");
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
  const [banks, setBanks] = useState([
    { id: "1", name: "Bank of America" },
    { id: "2", name: "Chase Bank" },
    { id: "3", name: "Wells Fargo" },
  ]);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [newBankName, setNewBankName] = useState("");
  const [showEditBankModal, setShowEditBankModal] = useState(false);
  const [editBankId, setEditBankId] = useState<string | null>(null);
  const [editBankName, setEditBankName] = useState("");

  const [cities, setCities] = useState([
    { id: "1", name: "New York" },
    { id: "2", name: "Los Angeles" },
    { id: "3", name: "Chicago" },
  ]);
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [showEditCityModal, setShowEditCityModal] = useState(false);
  const [editCityId, setEditCityId] = useState<string | null>(null);
  const [editCityName, setEditCityName] = useState("");

  const [states, setStates] = useState([
    { id: "1", name: "California" },
    { id: "2", name: "Texas" },
    { id: "3", name: "Florida" },
  ]);
  const [showAddStateModal, setShowAddStateModal] = useState(false);
  const [newStateName, setNewStateName] = useState("");
  const [showEditStateModal, setShowEditStateModal] = useState(false);
  const [editStateId, setEditStateId] = useState<string | null>(null);
  const [editStateName, setEditStateName] = useState("");

  const [companies, setCompanies] = useState([
    { id: "1", name: "Acme Corp" },
    { id: "2", name: "Globex Inc" },
    { id: "3", name: "Initech" },
  ]);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [editCompanyId, setEditCompanyId] = useState<string | null>(null);
  const [editCompanyName, setEditCompanyName] = useState("");

  // Skills state
  const [skills, setSkills] = useState([
    { id: "1", name: "JavaScript" },
    { id: "2", name: "React" },
    { id: "3", name: "Node.js" },
  ]);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [showEditSkillModal, setShowEditSkillModal] = useState(false);
  const [editSkillId, setEditSkillId] = useState<string | null>(null);
  const [editSkillName, setEditSkillName] = useState("");
  // Shift state
  const [shifts, setShifts] = useState([
    { id: "1", name: "Morning" },
    { id: "2", name: "Evening" },
    { id: "3", name: "Night" },
  ]);
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [newShiftName, setNewShiftName] = useState("");
  const [showEditShiftModal, setShowEditShiftModal] = useState(false);
  const [editShiftId, setEditShiftId] = useState<string | null>(null);
  const [editShiftName, setEditShiftName] = useState("");
  // Department state
  const [departments, setDepartments] = useState([
    { id: '1', name: 'Engineering' },
    { id: '2', name: 'Marketing' },
    { id: '3', name: 'Sales' },
  ]);
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [showEditDepartmentModal, setShowEditDepartmentModal] = useState(false);
  const [editDepartmentId, setEditDepartmentId] = useState<string | null>(null);
  const [editDepartmentName, setEditDepartmentName] = useState("");
  const handleSettingsClick = (data: string) => {
    if (
      data === 'bank' ||
      data === 'city' ||
      data === 'state' ||
      data === 'company' ||
      data === 'skills' ||
      data === 'shift' ||
      data === 'department'
    ) {
      setSelectedSettings(data);
    }
  };
  const handleAddBank = () => setShowAddBankModal(true);
  const handleCreateBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBankName.trim()) {
      const newId = banks.length
        ? (Math.max(...banks.map((b) => parseInt(b.id))) + 1).toString()
        : "1";
      setBanks([...banks, { id: newId, name: newBankName.trim() }]);
      setNewBankName("");
      setShowAddBankModal(false);
    }
  };
  const handleEditBank = (id: string) => {
    const bank = banks.find((b) => b.id === id);
    if (bank) {
      setEditBankId(id);
      setEditBankName(bank.name);
      setShowEditBankModal(true);
    }
  };
  const handleUpdateBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (editBankId !== null && editBankName.trim()) {
      setBanks(
        banks.map((b) =>
          b.id === editBankId ? { ...b, name: editBankName.trim() } : b
        )
      );
      setShowEditBankModal(false);
      setEditBankId(null);
      setEditBankName("");
    }
  };
  const handleDeleteBank = (id: string) => {
    setBanks(banks.filter((b) => b.id !== id));
  };
  const handleCloseAddBankModal = () => {
    setShowAddBankModal(false);
    setNewBankName("");
  };
  const handleCloseEditBankModal = () => {
    setShowEditBankModal(false);
    setEditBankId(null);
    setEditBankName("");
  };

  //const handleCityClick = () => setSelectedSettings("city");
  const handleAddCity = () => setShowAddCityModal(true);
  const handleCreateCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCityName.trim()) {
      const newId = cities.length
        ? (Math.max(...cities.map((c) => parseInt(c.id))) + 1).toString()
        : "1";
      setCities([...cities, { id: newId, name: newCityName.trim() }]);
      setNewCityName("");
      setShowAddCityModal(false);
    }
  };
  const handleEditCity = (id: string) => {
    const city = cities.find((c) => c.id === id);
    if (city) {
      setEditCityId(id);
      setEditCityName(city.name);
      setShowEditCityModal(true);
    }
  };
  const handleUpdateCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (editCityId !== null && editCityName.trim()) {
      setCities(
        cities.map((c) =>
          c.id === editCityId ? { ...c, name: editCityName.trim() } : c
        )
      );
      setShowEditCityModal(false);
      setEditCityId(null);
      setEditCityName("");
    }
  };
  const handleDeleteCity = (id: string) => {
    setCities(cities.filter((c) => c.id !== id));
  };
  const handleCloseAddCityModal = () => {
    setShowAddCityModal(false);
    setNewCityName("");
  };
  const handleCloseEditCityModal = () => {
    setShowEditCityModal(false);
    setEditCityId(null);
    setEditCityName("");
  };

  const handleAddState = () => setShowAddStateModal(true);
  const handleCreateState = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStateName.trim()) {
      const newId = states.length
        ? (Math.max(...states.map((s) => parseInt(s.id))) + 1).toString()
        : "1";
      setStates([...states, { id: newId, name: newStateName.trim() }]);
      setNewStateName("");
      setShowAddStateModal(false);
    }
  };
  const handleEditState = (id: string) => {
    const state = states.find((s) => s.id === id);
    if (state) {
      setEditStateId(id);
      setEditStateName(state.name);
      setShowEditStateModal(true);
    }
  };
  const handleUpdateState = (e: React.FormEvent) => {
    e.preventDefault();
    if (editStateId !== null && editStateName.trim()) {
      setStates(
        states.map((s) =>
          s.id === editStateId ? { ...s, name: editStateName.trim() } : s
        )
      );
      setShowEditStateModal(false);
      setEditStateId(null);
      setEditStateName("");
    }
  };
  const handleDeleteState = (id: string) => {
    setStates(states.filter((s) => s.id !== id));
  };
  const handleCloseAddStateModal = () => {
    setShowAddStateModal(false);
    setNewStateName("");
  };
  const handleCloseEditStateModal = () => {
    setShowEditStateModal(false);
    setEditStateId(null);
    setEditStateName("");
  };

  const handleAddCompany = () => setShowAddCompanyModal(true);
  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCompanyName.trim()) {
      const newId = companies.length
        ? (Math.max(...companies.map((c) => parseInt(c.id))) + 1).toString()
        : "1";
      setCompanies([...companies, { id: newId, name: newCompanyName.trim() }]);
      setNewCompanyName("");
      setShowAddCompanyModal(false);
    }
  };
  const handleEditCompany = (id: string) => {
    const company = companies.find((c) => c.id === id);
    if (company) {
      setEditCompanyId(id);
      setEditCompanyName(company.name);
      setShowEditCompanyModal(true);
    }
  };
  const handleUpdateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (editCompanyId !== null && editCompanyName.trim()) {
      setCompanies(
        companies.map((c) =>
          c.id === editCompanyId ? { ...c, name: editCompanyName.trim() } : c
        )
      );
      setShowEditCompanyModal(false);
      setEditCompanyId(null);
      setEditCompanyName("");
    }
  };
  const handleDeleteCompany = (id: string) => {
    setCompanies(companies.filter((c) => c.id !== id));
  };
  const handleCloseAddCompanyModal = () => {
    setShowAddCompanyModal(false);
    setNewCompanyName("");
  };
  const handleCloseEditCompanyModal = () => {
    setShowEditCompanyModal(false);
    setEditCompanyId(null);
    setEditCompanyName("");
  };

  // Handlers for Skills
  const handleAddSkill = () => setShowAddSkillModal(true);
  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillName.trim()) {
      const newId = skills.length
        ? (Math.max(...skills.map((s) => parseInt(s.id))) + 1).toString()
        : "1";
      setSkills([...skills, { id: newId, name: newSkillName.trim() }]);
      setNewSkillName("");
      setShowAddSkillModal(false);
    }
  };
  const handleEditSkill = (id: string) => {
    const skill = skills.find((s) => s.id === id);
    if (skill) {
      setEditSkillId(id);
      setEditSkillName(skill.name);
      setShowEditSkillModal(true);
    }
  };
  const handleUpdateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (editSkillId !== null && editSkillName.trim()) {
      setSkills(
        skills.map((s) =>
          s.id === editSkillId ? { ...s, name: editSkillName.trim() } : s
        )
      );
      setShowEditSkillModal(false);
      setEditSkillId(null);
      setEditSkillName("");
    }
  };
  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
  };
  const handleCloseAddSkillModal = () => {
    setShowAddSkillModal(false);
    setNewSkillName("");
  };
  const handleCloseEditSkillModal = () => {
    setShowEditSkillModal(false);
    setEditSkillId(null);
    setEditSkillName("");
  };
  // Handlers for Shift
  const handleAddShift = () => setShowAddShiftModal(true);
  const handleCreateShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (newShiftName.trim()) {
      const newId = shifts.length
        ? (Math.max(...shifts.map((s) => parseInt(s.id))) + 1).toString()
        : "1";
      setShifts([...shifts, { id: newId, name: newShiftName.trim() }]);
      setNewShiftName("");
      setShowAddShiftModal(false);
    }
  };
  const handleEditShift = (id: string) => {
    const shift = shifts.find((s) => s.id === id);
    if (shift) {
      setEditShiftId(id);
      setEditShiftName(shift.name);
      setShowEditShiftModal(true);
    }
  };
  const handleUpdateShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (editShiftId !== null && editShiftName.trim()) {
      setShifts(
        shifts.map((s) =>
          s.id === editShiftId ? { ...s, name: editShiftName.trim() } : s
        )
      );
      setShowEditShiftModal(false);
      setEditShiftId(null);
      setEditShiftName("");
    }
  };
  const handleDeleteShift = (id: string) => {
    setShifts(shifts.filter((s) => s.id !== id));
  };
  const handleCloseAddShiftModal = () => {
    setShowAddShiftModal(false);
    setNewShiftName("");
  };
  const handleCloseEditShiftModal = () => {
    setShowEditShiftModal(false);
    setEditShiftId(null);
    setEditShiftName("");
  };
  // Handlers for Department
  const handleAddDepartment = () => setShowAddDepartmentModal(true);
  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDepartmentName.trim()) {
      const newId = departments.length
        ? (Math.max(...departments.map((d) => parseInt(d.id))) + 1).toString()
        : "1";
      setDepartments([
        ...departments,
        { id: newId, name: newDepartmentName.trim() },
      ]);
      setNewDepartmentName("");
      setShowAddDepartmentModal(false);
    }
  };
  const handleEditDepartment = (id: string) => {
    const department = departments.find((d) => d.id === id);
    if (department) {
      setEditDepartmentId(id);
      setEditDepartmentName(department.name);
      setShowEditDepartmentModal(true);
    }
  };
  const handleUpdateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (editDepartmentId !== null && editDepartmentName.trim()) {
      setDepartments(
        departments.map((d) =>
          d.id === editDepartmentId
            ? { ...d, name: editDepartmentName.trim() }
            : d
        )
      );
      setShowEditDepartmentModal(false);
      setEditDepartmentId(null);
      setEditDepartmentName("");
    }
  };
  const handleDeleteDepartment = (id: string) => {
    setDepartments(departments.filter((d) => d.id !== id));
  };
  const handleCloseAddDepartmentModal = () => {
    setShowAddDepartmentModal(false);
    setNewDepartmentName("");
  };
  const handleCloseEditDepartmentModal = () => {
    setShowEditDepartmentModal(false);
    setEditDepartmentId(null);
    setEditDepartmentName("");
  };
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
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
                <SettingsSelector
                  onClick={handleSettingsClick}
                />
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
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <Header
          setShowProfile={setShowProfile}
          showProfile={showProfile}
          handleLogout={handleLogout}
        />
        {/* Content */}
        <main className="flex-1 p-10 bg-slate-100">
          {selectedSection === "dashboard" && (
            <DasboardSelector
              data={data}
              activities={activities}
              tasks={tasks}
            />
          )}
          {selectedSection === "jobs" && (
            <Jobselector
              handleAddJob={handleAddJob}
              showAddJobModal={showAddJobModal}
              handleCloseModal={handleCloseModal}
              handleCreateJob={handleCreateJob}
              newJobTitle={newJobTitle}
              jobs={jobs}
              setNewJobTitle={setNewJobTitle}
              handleEditJob={handleEditJob}
              showEditJobModal={showEditJobModal}
              handleCloseEditModal={handleCloseEditModal}
              handleUpdateJob={handleUpdateJob}
              handleDeleteJob={handleDeleteJob}
              editJobTitle={editJobTitle}
              setEditJobTitle={setEditJobTitle}
            />
          )}
          {selectedSection === "settings" && selectedSettings === "bank" && (
            <Bankselector
              handleAddBank={handleAddBank}
              handleEditBank={handleEditBank}
              handleDeleteBank={handleDeleteBank}
              handleCloseAddBankModal={handleCloseAddBankModal}
              handleCloseEditBankModal={handleCloseEditBankModal}
              handleCreateBank={handleCreateBank}
              handleUpdateBank={handleUpdateBank}
              banks={banks}
              editBankName={editBankName}
              setEditBankName={setEditBankName}
              newBankName={newBankName}
              setNewBankName={setNewBankName}
              showAddBankModal={showAddBankModal}
              showEditBankModal={showEditBankModal}
            />
          )}
          {selectedSection === "settings" && selectedSettings === "city" && (
            <CitySelector
              handleAddCity={handleAddCity}
              handleEditCity={handleEditCity}
              handleDeleteCity={handleDeleteCity}
              cities={cities}
              showAddCityModal={showAddCityModal}
              handleCloseAddCityModal={handleCloseAddCityModal}
              handleCreateCity={handleCreateCity}
              newCityName={newCityName}
              showEditCityModal={showEditCityModal}
              handleCloseEditCityModal={handleCloseEditCityModal}
              handleUpdateCity={handleUpdateCity}
              editCityName={editCityName}
              setNewCityName={setNewCityName}
              setEditCityName={setEditCityName}
            />
          )}
          {selectedSection === "settings" && selectedSettings === "state" && (
            <StateSelector
              handleAddState={handleAddState}
              showAddStateModal={showAddStateModal}
              handleCloseAddStateModal={handleCloseAddStateModal}
              handleCreateState={handleCreateState}
              newStateName={newStateName}
              setNewStateName={setNewStateName}
              showEditStateModal={showEditStateModal}
              handleCloseEditStateModal={handleCloseEditStateModal}
              handleUpdateState={handleUpdateState}
              editStateName={editStateName}
              setEditStateName={setEditStateName}
              states={states}
              handleEditState={handleEditState}
              handleDeleteState={handleDeleteState}
            />
          )}
          {selectedSection === "settings" && selectedSettings === "company" && (
            <CompanySelector
              handleAddCompany={handleAddCompany}
              showAddCompanyModal={showAddCompanyModal}
              handleCloseAddCompanyModal={handleCloseAddCompanyModal}
              handleCreateCompany={handleCreateCompany}
              newCompanyName={newCompanyName}
              setNewCompanyName={setNewCompanyName}
              showEditCompanyModal={showEditCompanyModal}
              handleCloseEditCompanyModal={handleCloseEditCompanyModal}
              handleUpdateCompany={handleUpdateCompany}
              editCompanyName={editCompanyName}
              setEditCompanyName={setEditCompanyName}
              companies={companies}
              handleEditCompany={handleEditCompany}
              handleDeleteCompany={handleDeleteCompany}
            />
          )}
          {selectedSection === "settings" && selectedSettings === "skills" && (
            <SkillSelector
              handleAddSkill={handleAddSkill}
              showAddSkillModal={showAddSkillModal}
              handleCloseAddSkillModal={handleCloseAddSkillModal}
              handleCreateSkill={handleCreateSkill}
              newSkillName={newSkillName}
              setNewSkillName={setNewSkillName}
              showEditSkillModal={showEditSkillModal}
              handleCloseEditSkillModal={handleCloseEditSkillModal}
              handleUpdateSkill={handleUpdateSkill}
              handleEditSkill={handleEditSkill}
              editSkillName={editSkillName}
              setEditSkillName={setEditSkillName}
              handleDeleteSkill={handleDeleteSkill}
              skills={skills}
            />
          )}
          {selectedSection === "settings" && selectedSettings === "shift" && (
            <ShiftSelector
              handleAddShift={handleAddShift}
              showAddShiftModal={showAddShiftModal}
              handleCloseAddShiftModal={handleCloseAddShiftModal}
              handleCreateShift={handleCreateShift}
              newShiftName={newShiftName}
              setNewShiftName={setNewShiftName}
              handleEditShift={handleEditShift}
              showEditShiftModal={showEditShiftModal}
              handleCloseEditShiftModal={handleCloseEditShiftModal}
              handleUpdateShift={handleUpdateShift}
              editShiftName={editShiftName}
              setEditShiftName={setEditShiftName}
              shifts={shifts}
              handleDeleteShift={handleDeleteShift}
            />
          )}
          {selectedSection === "settings" &&
            selectedSettings === "department" && (
              <DepartmentSelector
                handleAddDepartment={handleAddDepartment}
                showAddDepartmentModal={showAddDepartmentModal}
                handleCloseAddDepartmentModal={handleCloseAddDepartmentModal}
                handleCreateDepartment={handleCreateDepartment}
                newDepartmentName={newDepartmentName}
                setNewDepartmentName={setNewDepartmentName}
                handleEditDepartment={handleEditDepartment}
                showEditDepartmentModal={showEditDepartmentModal}
                handleCloseEditDepartmentModal={handleCloseEditDepartmentModal}
                handleUpdateDepartment={handleUpdateDepartment}
                editDepartmentName={editDepartmentName}
                setEditDepartmentName={setEditDepartmentName}
                handleDeleteDepartment={handleDeleteDepartment}
                departments={departments}
              />
            )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
