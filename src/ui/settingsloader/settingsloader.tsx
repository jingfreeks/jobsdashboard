import { Loader2 } from "lucide-react";
const SettingsLoader=(props:{label:string})=>{
    const {label}=props
    return(
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-slate-600">{label}</span>
        </div>
      </div>
    )
};
export default SettingsLoader