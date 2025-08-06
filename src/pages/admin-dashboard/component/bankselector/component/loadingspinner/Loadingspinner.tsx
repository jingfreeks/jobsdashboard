import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <div className="max-w-2xl mx-auto">
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-2 text-slate-600">Loading banks...</span>
    </div>
  </div>
);

export default LoadingSpinner;
