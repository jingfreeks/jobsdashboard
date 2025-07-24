import { Link, useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jan', jobs: 12 },
  { name: 'Feb', jobs: 18 },
  { name: 'Mar', jobs: 9 },
  { name: 'Apr', jobs: 15 },
  { name: 'May', jobs: 20 },
]

const Dashboard = () => {
  const navigate = useNavigate()
  const handleLogout = () => {
    navigate('/login')
  }
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-slate-800 text-white p-8 flex flex-col gap-8 min-h-screen">
        <h2 className="text-2xl font-bold mb-8">Jobs Dashboard</h2>
        <nav>
          <ul className="flex flex-col gap-5">
            <li><Link to="/dashboard" className="text-slate-200 hover:text-white text-lg">Dashboard</Link></li>
            <li><Link to="#" className="text-slate-200 hover:text-white text-lg">Jobs</Link></li>
            <li><button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white rounded-md px-4 py-2 text-lg font-semibold transition">Logout</button></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-10 bg-slate-100">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Job Statistics</h1>
        <div className="bg-white p-8 rounded-xl shadow-lg mt-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jobs" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  )
}

export default Dashboard 