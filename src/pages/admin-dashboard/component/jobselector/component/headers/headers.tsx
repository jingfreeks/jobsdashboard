import { PlusCircle} from "lucide-react";

interface HeadersProps {
  handleAddJob: () => void;
}
const Headers = (props: HeadersProps) => {
  const { handleAddJob } = props;
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-slate-800">Jobs List</h2>
      <button
        onClick={handleAddJob}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
      >
        <PlusCircle className="w-5 h-5" /> Add Job
      </button>
    </div>
  );
};
export default Headers;
