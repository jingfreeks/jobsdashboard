import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { User, Briefcase, BarChart2, LogOut, Bell, PlusCircle, CalendarCheck2, ChevronDown, Settings as SettingsIcon, Landmark, Building2, MapPin } from 'lucide-react'
import { useState } from 'react'

const data = [
  { name: 'Jan', jobs: 12 },
  { name: 'Feb', jobs: 18 },
  { name: 'Mar', jobs: 9 },
  { name: 'Apr', jobs: 15 },
  { name: 'May', jobs: 20 },
]

const Dashboard = () => {
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState<'dashboard' | 'jobs'>('dashboard')
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Frontend Developer' },
    { id: 2, title: 'Backend Engineer' },
    { id: 3, title: 'Product Manager' },
  ])
  const notifications = [
    { id: 1, message: 'New job application received', time: '2m ago' },
    { id: 2, message: 'Interview scheduled for John Doe', time: '1h ago' },
    { id: 3, message: 'Offer sent to Jane Smith', time: '3h ago' },
  ]
  const activities = [
    { id: 1, activity: 'You added a new job: Frontend Developer', time: 'Today, 09:00' },
    { id: 2, activity: 'Interview completed: Backend Engineer', time: 'Yesterday, 15:30' },
    { id: 3, activity: 'Offer accepted: Product Manager', time: 'Yesterday, 11:10' },
  ]
  const tasks = [
    { id: 1, task: 'Follow up with recruiter', due: 'Today' },
    { id: 2, task: 'Prepare for interview', due: 'Tomorrow' },
    { id: 3, task: 'Review candidate resumes', due: 'This week' },
  ]
  const handleLogout = () => {
    navigate('/login')
  }
  // Job actions
  const handleEditJob = (id: number) => {
    const job = jobs.find(j => j.id === id)
    if (job) {
      setEditJobId(id)
      setEditJobTitle(job.title)
      setShowEditJobModal(true)
    }
  }
  const handleDeleteJob = (id: number) => {
    setJobs(jobs.filter(job => job.id !== id))
  }
  const [showAddJobModal, setShowAddJobModal] = useState(false)
  const [newJobTitle, setNewJobTitle] = useState('')
  const handleAddJob = () => {
    setShowAddJobModal(true)
  }
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault()
    if (newJobTitle.trim()) {
      const newId = jobs.length ? Math.max(...jobs.map(j => j.id)) + 1 : 1
      setJobs([...jobs, { id: newId, title: newJobTitle.trim() }])
      setNewJobTitle('')
      setShowAddJobModal(false)
    }
  }
  const handleCloseModal = () => {
    setShowAddJobModal(false)
    setNewJobTitle('')
  }
  const [showEditJobModal, setShowEditJobModal] = useState(false)
  const [editJobId, setEditJobId] = useState<number | null>(null)
  const [editJobTitle, setEditJobTitle] = useState('')
  const handleUpdateJob = (e: React.FormEvent) => {
    e.preventDefault()
    if (editJobId !== null && editJobTitle.trim()) {
      setJobs(jobs.map(j => j.id === editJobId ? { ...j, title: editJobTitle.trim() } : j))
      setShowEditJobModal(false)
      setEditJobId(null)
      setEditJobTitle('')
    }
  }
  const handleCloseEditModal = () => {
    setShowEditJobModal(false)
    setEditJobId(null)
    setEditJobTitle('')
  }
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-50 via-white to-white border-r border-slate-200 flex flex-col min-h-screen shadow-lg">
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 px-8 py-6 border-b border-slate-200 bg-white/80 shadow-sm">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 shadow text-blue-600">
            <BarChart2 className="w-7 h-7" />
          </span>
          <span className="text-2xl font-extrabold text-slate-800 tracking-tight ml-1">Jobs CRM</span>
        </div>
        <nav className="flex-1 px-4 py-6">
          <div className="mb-3 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Main</div>
          <ul className="flex flex-col gap-1">
            <li>
              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-base transition w-full
                  ${selectedSection === 'dashboard' ? 'bg-blue-100 text-blue-700 shadow' : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'}`}
                onClick={() => setSelectedSection('dashboard')}
              >
                <BarChart2 className="w-5 h-5" /> Dashboard
              </button>
            </li>
            <li>
              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-base transition w-full
                  ${selectedSection === 'jobs' ? 'bg-blue-100 text-blue-700 shadow' : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'}`}
                onClick={() => setSelectedSection('jobs')}
              >
                <Briefcase className="w-5 h-5" /> Jobs
              </button>
            </li>
          </ul>
          <div className="my-5 border-t border-slate-100" />
          <div className="mb-3 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Settings</div>
          <ul className="flex flex-col gap-1">
            <li>
              <button
                className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-base text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition w-full justify-between"
                onClick={() => setSettingsOpen(v => !v)}
                aria-expanded={settingsOpen}
                aria-controls="sidebar-settings-sublist"
              >
                <span className="flex items-center gap-3">
                  <SettingsIcon className="w-5 h-5" /> Settings
                </span>
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
              </button>
              {settingsOpen && (
                <ul id="sidebar-settings-sublist" className="ml-8 mt-1 flex flex-col gap-1 border-l border-blue-100 pl-4">
                  <li>
                    <button className="flex items-center gap-2 px-2 py-1 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition w-full text-sm">
                      <Landmark className="w-4 h-4" /> Bank
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center gap-2 px-2 py-1 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition w-full text-sm">
                      <Building2 className="w-4 h-4" /> City
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center gap-2 px-2 py-1 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition w-full text-sm">
                      <MapPin className="w-4 h-4" /> State
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
          <div className="my-5 border-t border-slate-100" />
          <div className="mb-3 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Management</div>
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
              <span className="font-semibold text-slate-800 leading-tight">Jane Doe</span>
              <span className="text-xs text-slate-500">Admin</span>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 w-full bg-red-50 hover:bg-red-100 text-red-600 rounded-md px-4 py-2 font-semibold transition mt-2">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="w-full bg-white/90 border-b border-slate-200 px-10 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-600">
              <BarChart2 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Notifications Bell */}
            <div className="relative">
              <button onClick={() => setShowNotifications(v => !v)} className="relative p-2 rounded-full hover:bg-blue-50 transition">
                <Bell className="w-6 h-6 text-blue-700" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">{notifications.length}</span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                  <div className="p-4 border-b border-slate-100 font-semibold text-slate-700">Notifications</div>
                  <ul className="max-h-60 overflow-y-auto">
                    {notifications.map(n => (
                      <li key={n.id} className="px-4 py-2 hover:bg-slate-50 text-slate-700 flex justify-between">
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
              <button onClick={() => setShowProfile(v => !v)} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-lg focus:outline-none">
                <User className="w-6 h-6" />
              </button>
              {showProfile && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                  <div className="p-4 border-b border-slate-100">
                    <span className="block font-semibold text-slate-800">Jane Doe</span>
                    <span className="block text-xs text-slate-500">Admin</span>
                  </div>
                  <ul>
                    <li><button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700">Profile</button></li>
                    <li><button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700">Settings</button></li>
                    <li><button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600">Logout</button></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 p-10 bg-slate-100">
          {selectedSection === 'dashboard' && (
            <>
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-4 mb-8">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition">
                  <PlusCircle className="w-5 h-5" /> Add Job
                </button>
                <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition">
                  <CalendarCheck2 className="w-5 h-5" /> Schedule Interview
                </button>
              </div>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border border-slate-100">
                  <span className="text-slate-500 text-sm">Total Jobs</span>
                  <span className="text-2xl font-bold text-blue-700">74</span>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border border-slate-100">
                  <span className="text-slate-500 text-sm">Interviews</span>
                  <span className="text-2xl font-bold text-blue-700">18</span>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border border-slate-100">
                  <span className="text-slate-500 text-sm">Offers</span>
                  <span className="text-2xl font-bold text-blue-700">5</span>
                </div>
              </div>
              {/* Chart and Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Card */}
                <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 col-span-1 lg:col-span-2">
                  <h2 className="text-xl font-semibold text-slate-800 mb-4">Job Applications Over Time</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="jobs" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 flex flex-col gap-4">
                  <h2 className="text-lg font-semibold text-slate-800 mb-2">Recent Activity</h2>
                  <ul className="flex-1 space-y-3">
                    {activities.map(a => (
                      <li key={a.id} className="flex flex-col">
                        <span className="text-slate-700">{a.activity}</span>
                        <span className="text-xs text-slate-400">{a.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Tasks/Reminders */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 flex flex-col gap-4">
                  <h2 className="text-lg font-semibold text-slate-800 mb-2">Tasks & Reminders</h2>
                  <ul className="flex-1 space-y-3">
                    {tasks.map(t => (
                      <li key={t.id} className="flex flex-col">
                        <span className="text-slate-700">{t.task}</span>
                        <span className="text-xs text-slate-400">Due: {t.due}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
          {selectedSection === 'jobs' && (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Jobs List</h2>
                <button onClick={handleAddJob} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition">
                  <PlusCircle className="w-5 h-5" /> Add Job
                </button>
              </div>
              {/* Add Job Modal */}
              {showAddJobModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
                    <button onClick={handleCloseModal} className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold">&times;</button>
                    <h3 className="text-xl font-bold mb-4 text-slate-800">Create New Job</h3>
                    <form onSubmit={handleCreateJob} className="flex flex-col gap-4">
                      <input
                        type="text"
                        className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="Job Title"
                        value={newJobTitle}
                        onChange={e => setNewJobTitle(e.target.value)}
                        autoFocus
                        required
                      />
                      <div className="flex gap-2 justify-end">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold">Create</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
                {jobs.length === 0 ? (
                  <div className="text-slate-400 italic">No jobs</div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {jobs.map(job => (
                      <li key={job.id} className="flex items-center justify-between py-3">
                        <span className="flex-1 truncate text-slate-800 font-medium">{job.title}</span>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditJob(job.id)} className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded transition"><svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z' /></svg></button>
                          <button onClick={() => handleDeleteJob(job.id)} className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition"><svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' /></svg></button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Edit Job Modal */}
              {showEditJobModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
                    <button onClick={handleCloseEditModal} className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold">&times;</button>
                    <h3 className="text-xl font-bold mb-4 text-slate-800">Edit Job</h3>
                    <form onSubmit={handleUpdateJob} className="flex flex-col gap-4">
                      <input
                        type="text"
                        className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="Job Title"
                        value={editJobTitle}
                        onChange={e => setEditJobTitle(e.target.value)}
                        autoFocus
                        required
                      />
                      <div className="flex gap-2 justify-end">
                        <button type="button" onClick={handleCloseEditModal} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold">Update</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard 