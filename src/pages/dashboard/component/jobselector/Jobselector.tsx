import { PlusCircle } from "lucide-react";

type JobsTypes = {
  handleAddJob: () => void;
  showAddJobModal: boolean;
  handleCloseModal: () => void;
  handleCreateJob: (e: React.FormEvent) => void;
  newJobTitle: string;
  jobs: { id: string; title: string }[];
  setNewJobTitle: (title: string) => void;
  handleEditJob: (id: string) => void;
  showEditJobModal: boolean;
  handleCloseEditModal: () => void;
  handleUpdateJob: (e: React.FormEvent) => void;
  handleDeleteJob: (id: string) => void;
  editJobTitle: string;
  setEditJobTitle: (title: string) => void;
};

const Jobselector = (props:JobsTypes) => {
  const {
    handleAddJob,
    showAddJobModal,
    handleCloseModal,
    handleCreateJob,
    newJobTitle,
    jobs,
    setNewJobTitle,
    handleEditJob,
    showEditJobModal,
    handleCloseEditModal,
    handleUpdateJob,
    handleDeleteJob,
    editJobTitle,
    setEditJobTitle,
  } = props;
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Jobs List</h2>
        <button
          onClick={handleAddJob}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          <PlusCircle className="w-5 h-5" /> Add Job
        </button>
      </div>
      {/* Add Job Modal */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseModal}
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
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Job Title"
                value={newJobTitle}
                onChange={(e) => setNewJobTitle(e.target.value)}
                autoFocus
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Create
                </button>
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
            {jobs.map((job) => (
              <li
                key={job.id}
                className="flex items-center justify-between py-3"
              >
                <span className="flex-1 truncate text-slate-800 font-medium">
                  {job.title}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditJob(job.id)}
                    className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
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
            <button
              onClick={handleCloseEditModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-slate-800">Edit Job</h3>
            <form onSubmit={handleUpdateJob} className="flex flex-col gap-4">
              <input
                type="text"
                className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Job Title"
                value={editJobTitle}
                onChange={(e) => setEditJobTitle(e.target.value)}
                autoFocus
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Jobselector;
