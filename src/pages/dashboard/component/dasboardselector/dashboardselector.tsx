import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PlusCircle, CalendarCheck2 } from "lucide-react";


type DashboardSelectorProps = {
  data: { name: string; jobs: number }[];
  activities: { id: number; activity: string; time: string }[];
  tasks: { id: number; task: string; due: string }[];
};

const DasboardSelector = (props:DashboardSelectorProps) => {
    const {data, activities, tasks} = props;
  return (
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
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Job Applications Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
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
          <h2 className="text-lg font-semibold text-slate-800 mb-2">
            Recent Activity
          </h2>
          <ul className="flex-1 space-y-3">
            {activities.map((a) => (
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
          <h2 className="text-lg font-semibold text-slate-800 mb-2">
            Tasks & Reminders
          </h2>
          <ul className="flex-1 space-y-3">
            {tasks.map((t) => (
              <li key={t.id} className="flex flex-col">
                <span className="text-slate-700">{t.task}</span>
                <span className="text-xs text-slate-400">Due: {t.due}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
export default DasboardSelector;
