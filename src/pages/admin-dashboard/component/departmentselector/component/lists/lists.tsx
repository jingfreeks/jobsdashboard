interface DepartmentProps {
  name: string;
  _id: string;
}

interface listProps {
  departments: DepartmentProps[];
  handleEditDepartment: (name:string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  handleDeleteDepartment: (name:string) => void;
}
const Lists = (props: listProps) => {
  const {
    departments,
    handleEditDepartment,
    isUpdating,
    isDeleting,
    handleDeleteDepartment,
  } = props;
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
      {departments.length === 0 ? (
        <div className="text-slate-400 italic">No departments</div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {departments.map((department) => (
            <li
              key={department._id}
              className="flex items-center justify-between py-3"
            >
              <span className="flex-1 truncate text-slate-800 font-medium">
                {department.name}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditDepartment(department._id)}
                  disabled={isUpdating || isDeleting}
                  className="text-blue-500 hover:text-blue-700 disabled:text-blue-300 px-2 py-1 rounded transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteDepartment(department._id)}
                  disabled={isUpdating || isDeleting}
                  className="text-red-500 hover:text-red-700 disabled:text-red-300 px-2 py-1 rounded transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Lists;
