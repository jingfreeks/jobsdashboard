import { memo } from "react";

type LoadersProps = { title?: string };
const Loaders = (props: LoadersProps) => {
  const { title } = props;
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-slate-600">{title}</span>
      </div>
    </div>
  );
};
export default memo(Loaders);
