import { type Job } from "@/features/jobs";

interface JobsListProps {
  filteredJobs: Job[];
  jobsWithDetails: Job[];
  handleEditJob: (job: Job) => void;
  isDeleting: boolean;
  handleDeleteJob: (jobId: string) => void;
}
const JobsList = (props: JobsListProps) => {
  const {
    filteredJobs,
    jobsWithDetails,
    handleEditJob,
    isDeleting,
    handleDeleteJob,
  } = props;
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
      <div className="grid grid-cols-5 gap-4 pb-3 border-b border-slate-200 mb-4">
        <div className="font-semibold text-slate-800">Job Title</div>
        <div className="font-semibold text-slate-800">Company</div>
        <div className="font-semibold text-slate-800">City</div>
        <div className="font-semibold text-slate-800">Department</div>
        <div className="font-semibold text-slate-800">Actions</div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-slate-400 italic text-center py-8">
          {jobsWithDetails?.length === 0
            ? "No jobs"
            : "No jobs match your search criteria"}
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {filteredJobs.map((job: Job) => (
            <li
              key={job._id}
              className="flex items-center justify-between py-3"
            >
              <div className="flex-1 grid grid-cols-5 gap-4">
                <span className="truncate text-slate-800 font-medium">
                  {job.jobtitle}
                </span>
                <span className="truncate text-slate-600">
                  {job.companyname}
                </span>
                <span className="truncate text-slate-600">{job.cityname}</span>
                <span className="truncate text-slate-600">
                  {job.departmentname}
                </span>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleEditJob(job)}
                    className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded transition"
                    disabled={isDeleting}
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
                    onClick={() => handleDeleteJob(job._id)}
                    className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition disabled:opacity-50"
                    disabled={isDeleting}
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default JobsList;
