import React, { useState, useCallback } from "react";
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
import { useJobOperations } from '@/hooks/useJobOperations';
import { useToast } from '@/hooks/useToast';

const data = [
  { name: "Jan", jobs: 12 },
  { name: "Feb", jobs: 18 },
  { name: "Mar", jobs: 9 },
  { name: "Apr", jobs: 15 },
  { name: "May", jobs: 20 },
];

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
const DasboardSelector = () => {
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  
  // Use job operations hook
  const {
    companies,
    cities,
    departments,
    isAdding,
    createJob,
  } = useJobOperations();

  // Use toast for notifications
  const { showSuccess, showError } = useToast();

  // Memoized callbacks for better performance
  const handleAddJob = useCallback(() => setShowAddJobModal(true), []);

  const handleCloseAddJobModal = useCallback(() => {
    setShowAddJobModal(false);
  }, []);

  const handleCreateJob = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const jobData = {
      jobtitle: formData.get('jobtitle') as string,
      companyId: formData.get('companyId') as string || undefined,
      cityId: formData.get('cityId') as string || undefined,
      departmentId: formData.get('departmentId') as string || undefined,
      description: formData.get('description') as string || undefined,
      requirements: formData.get('requirements') as string || undefined,
      salary: formData.get('salary') as string || undefined,
      type: formData.get('type') as string || undefined,
      status: formData.get('status') as string || undefined,
    };

    if (jobData.jobtitle.trim()) {
      const result = await createJob(jobData);
      if (result) {
        setShowAddJobModal(false);
        showSuccess(`Job "${jobData.jobtitle.trim()}" has been created successfully.`);
      } else {
        showError('Failed to create job. Please try again.');
      }
    }
  }, [createJob, showSuccess, showError]);

  return (
    <>
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button 
          onClick={handleAddJob}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition"
        >
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

      {/* Add Job Modal */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseAddJobModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              Create New Job
            </h3>
            <form onSubmit={handleCreateJob} className="flex flex-col gap-4">
              <input
                type="text"
                name="jobtitle"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Job Title"
                autoFocus
                required
                disabled={isAdding}
              />
              <select
                name="companyId"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                disabled={isAdding}
              >
                <option value="">Select Company</option>
                {(companies as any[])?.map((company: any) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
              <select
                name="cityId"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                disabled={isAdding}
              >
                <option value="">Select City</option>
                {(cities as any[])?.map((city: any) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>
              <select
                name="departmentId"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                disabled={isAdding}
              >
                <option value="">Select Department</option>
                {(departments as any[])?.map((department: any) => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
              </select>
              <textarea
                name="description"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Job Description"
                rows={3}
                disabled={isAdding}
              />
              <textarea
                name="requirements"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Job Requirements"
                rows={3}
                disabled={isAdding}
              />
              <input
                type="text"
                name="salary"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Salary Range"
                disabled={isAdding}
              />
              <select
                name="type"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                disabled={isAdding}
              >
                <option value="">Select Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
              <select
                name="status"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                disabled={isAdding}
              >
                <option value="">Select Status</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="On Hold">On Hold</option>
              </select>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseAddJobModal}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                  disabled={isAdding}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
                  disabled={isAdding}
                >
                  {isAdding ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
export default DasboardSelector;
