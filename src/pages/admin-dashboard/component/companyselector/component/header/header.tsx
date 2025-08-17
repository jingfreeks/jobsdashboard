import { PlusCircle } from "lucide-react";

type HeaderProps = { handleAddCompany: () => void };
const Header = (props: HeaderProps) => {
  const { handleAddCompany } = props;
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-slate-800">Company List</h2>
      <button
        onClick={handleAddCompany}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
      >
        <PlusCircle className="w-5 h-5" /> Add Company
      </button>
    </div>
  );
};
export default Header;
