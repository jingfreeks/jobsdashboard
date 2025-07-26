type Notficationprops = {
  data: { id: number; message: string; time: string }[];
};
const Notificationscreen = (props: Notficationprops) => {
  const { data } = props;
  return (
    <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
      <div className="p-4 border-b border-slate-100 font-semibold text-slate-700">
        Notifications
      </div>
      <ul className="max-h-60 overflow-y-auto">
        {data.map((n) => (
          <li
            key={n.id}
            className="px-4 py-2 hover:bg-slate-50 text-slate-700 flex justify-between"
          >
            <span>{n.message}</span>
            <span className="text-xs text-slate-400 ml-2">{n.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Notificationscreen;
