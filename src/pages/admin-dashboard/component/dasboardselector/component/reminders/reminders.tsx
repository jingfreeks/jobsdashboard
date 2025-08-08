
interface Task {
    id: string | number;
    task: string;
    due: string;
}

interface RemindersProps {
    tasks: Task[];
}

const Reminders = (props:RemindersProps) => {
  const { tasks } = props;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">
          Tasks & Reminders
        </h2>
        <ul className="flex-1 space-y-3">
          {tasks.map((t) => (
            <li key={t.id} className="flex flex-col">
              <span className="text-slate-700">{t.task}</span>
              <span className="text-xs text-slate-400">Due: {t.due}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Reminders;
