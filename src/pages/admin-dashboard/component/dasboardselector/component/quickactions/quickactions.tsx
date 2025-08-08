import { PlusCircle, CalendarCheck2 } from "lucide-react";

type QuickActionsProps = {
  handleAddJob: () => void;
};
const QuickActions = (props:QuickActionsProps) => {
    const { handleAddJob } = props
  return (
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
  );
};
export default QuickActions;
