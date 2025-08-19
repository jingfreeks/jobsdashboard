import { type Job } from "@/features/jobs";
import { OptionList } from "@/ui";

type cityProps = {
  _id?: string;
  name?: string;
};
type departmentProps = {
  _id?: string;
  name?: string;
};

type shiftsProps = {
  _id?: string;
  title?: string;
}

type companyProps = {
  _id?: string;
  name?: string;
  address?: string;
  cityId?: string;
  cityname?: string;
};

type submitLabelProps = {
  loading?: string;
  label?: string;
};

interface AddModalProps {
  handleCloseModal: () => void;
  handleActions: (e: React.FormEvent<HTMLFormElement>) => void;
  loaders: boolean;
  companies: companyProps[];
  cities: cityProps[];
  shifts:shiftsProps[];
  departments: departmentProps[];
  title: string;
  editJob?: Job | null;
  submitLabel?: submitLabelProps;
}
const Modals = (props: AddModalProps) => {
  const {
    handleCloseModal,
    handleActions,
    loaders,
    companies,
    cities,
    departments,
    shifts,
    title = "Create New Job",
    editJob,
    submitLabel = { loading: "Creating...", label: "Create" },
  } = props;
  console.log('Modal props:', shifts);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={handleCloseModal}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-slate-800">{title}</h3>
        <form onSubmit={handleActions} className="flex flex-col gap-4">
          <input
            type="text"
            name="jobtitle"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Job Title"
            defaultValue={editJob?.jobtitle || ""}
            autoFocus
            required
            disabled={loaders}
          />
          <OptionList
            defaultValue={editJob?.companyId || ""}
            name="companyId"
            disabled={loaders}
            data={companies}
            title="Select Company"
          />

          <OptionList
            defaultValue={editJob?.cityId || ""}
              name="cityId"
            disabled={loaders}
            data={cities}
            title="Select City"
          />
    
          <OptionList
            defaultValue={editJob?.departmentId || ""}
            disabled={loaders}
             name="departmentId"
            data={departments}
            title="Select Department"
          />

          <textarea
            name="jobDescription"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Job Description"
            rows={3}
            defaultValue={editJob?.jobDescription || ""}
            disabled={loaders}
          />

          <textarea
            name="jobRequirements"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Job Requirements"
            rows={3}
            defaultValue={editJob?.jobRequirements || ""}
            disabled={loaders}
          />

          <input
            type="text"
            name="salary"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Salary Range"
            defaultValue={editJob?.salary || ""}
            disabled={loaders}
          />

          <OptionList
            defaultValue={editJob?.jobType || ""}
            disabled={loaders}
            name="type"
            data={[
              { _id: "Full-time", name: "Full-time" },
              { _id: "Part-time", name: "Part-time" },
              { _id: "Contract", name: "Contract" },
              { _id: "Internship", name: "Internship" },
            ]}
            title="Select Job Type"
          />

          <OptionList 
            defaultValue={editJob?.shiftId || ""}
            disabled={loaders}
            name="shiftId"
            data={shifts}
            title="Select Shift"
          />
        
          <OptionList
            defaultValue={editJob?.status || ""}
            disabled={loaders}
            name="status"
            data={[
              { _id: "Open", name: "Open" },
              { _id: "Closed", name: "Closed" },
              { _id: "On Hold", name: "On Hold" },
            ]}
            title="Select Status"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              disabled={loaders}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
              disabled={loaders}
            >
              {loaders ? submitLabel.loading : submitLabel.label}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Modals;
