import { Edit, Trash2, Loader2 } from "lucide-react";

interface skillProps {
  _id: string;
  name: string;
}

interface listProps {
  skills: skillProps[];
  handleEditSkill: (name: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  handleDeleteSkill: (name: string) => void;
}
const Lists = (props: listProps) => {
  const { skills, handleEditSkill, isUpdating, isDeleting, handleDeleteSkill } =
    props;
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
      {skills.length === 0 ? (
        <div className="text-slate-400 italic text-center py-8">
          No skills found. Create your first skill to get started.
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {skills.map((skill) => (
            <li
              key={skill._id}
              className="flex items-center justify-between py-3"
            >
              <span className="flex-1 truncate text-slate-800 font-medium">
                {skill.name}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditSkill(skill._id)}
                  disabled={isUpdating || isDeleting}
                  className="text-blue-500 hover:text-blue-700 disabled:opacity-50 px-2 py-1 rounded transition"
                  title="Edit skill"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteSkill(skill._id)}
                  disabled={isUpdating || isDeleting}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50 px-2 py-1 rounded transition"
                  title="Delete skill"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
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
