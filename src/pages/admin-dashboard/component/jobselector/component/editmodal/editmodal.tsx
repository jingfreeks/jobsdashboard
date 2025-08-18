import { type Job } from "@/features/jobs";

type cityProps = {
  _id?: string;
  name?: string;
};
type departmentProps = {
  _id?: string;
  name?: string;
};

type companyProps = {
  _id?: string;
  name?: string;
  address?: string;
  cityId?: string;
  cityname?: string;
};
interface editModalProps {
  handleCloseEditJobModal: () => void;
  handleUpdateJob: (e: React.FormEvent<HTMLFormElement>) => void;
  isUpdating: boolean;
  editJob: Job;
  companies: companyProps[];
  cities: cityProps[];
  departments: departmentProps[];
}
const EditModal = (props:editModalProps) => {
    const {
    handleCloseEditJobModal,
    handleUpdateJob,
    isUpdating,
    editJob,
    companies,
    cities,
    departments,
  } = props;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={handleCloseEditJobModal}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-slate-800">Edit Job</h3>
        <form onSubmit={handleUpdateJob} className="flex flex-col gap-4">
          <input
            type="text"
            name="jobtitle"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Job Title"
            defaultValue={editJob.jobtitle}
            autoFocus
            required
            disabled={isUpdating}
          />
          <select
            name="companyId"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            defaultValue={editJob.companyId || ""}
            disabled={isUpdating}
          >
            <option value="">Select Company</option>
            {(companies as companyProps[])?.map((company: companyProps) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>
          <select
            name="cityId"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            defaultValue={editJob.cityId || ""}
            disabled={isUpdating}
          >
            <option value="">Select City</option>
            {(cities as cityProps[])?.map((city: cityProps) => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>
          <select
            name="departmentId"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            defaultValue={editJob.departmentId || ""}
            disabled={isUpdating}
          >
            <option value="">Select Department</option>
            {(departments as departmentProps[])?.map((department: departmentProps) => (
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
            defaultValue={editJob.description || ""}
            disabled={isUpdating}
          />
          <textarea
            name="requirements"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Job Requirements"
            rows={3}
            defaultValue={editJob.requirements || ""}
            disabled={isUpdating}
          />
          <input
            type="text"
            name="salary"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Salary Range"
            defaultValue={editJob.salary || ""}
            disabled={isUpdating}
          />
          <select
            name="type"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            defaultValue={editJob.type || ""}
            disabled={isUpdating}
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
            defaultValue={editJob.status || ""}
            disabled={isUpdating}
          >
            <option value="">Select Status</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="On Hold">On Hold</option>
          </select>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleCloseEditJobModal}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditModal;
