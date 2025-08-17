import { PlusCircle, Loader2 } from "lucide-react";

interface HeaderProps {
  handleAddDepartment: () => void;
  isAdding: boolean;
}

const Header = (props: HeaderProps) => {
  const { handleAddDepartment, isAdding } = props;
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-slate-800">Department List</h2>
      <button
        onClick={handleAddDepartment}
        disabled={isAdding}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
      >
        {isAdding ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <PlusCircle className="w-5 h-5" />
        )}
        {isAdding ? "Adding..." : "Add Department"}
      </button>
    </div>
  );
};
export default Header;
