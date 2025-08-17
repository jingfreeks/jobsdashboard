
import { PlusCircle, Loader2 } from "lucide-react";

type HeaderProps = {
  isAdding: boolean;
  handleAddAction: () => void;
  btnLabel: string;
  title: string;
};

// Header component for Bankselector
const SettingsHeader= (props:HeaderProps) => {
    const { isAdding, handleAddAction,btnLabel,title } = props;
    return (
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <button
          onClick={handleAddAction}
          disabled={isAdding}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          {isAdding ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <PlusCircle className="w-5 h-5" />
          )}
          {isAdding ? "Adding..." : btnLabel}
        </button>
      </div>
    )
}
export default SettingsHeader;