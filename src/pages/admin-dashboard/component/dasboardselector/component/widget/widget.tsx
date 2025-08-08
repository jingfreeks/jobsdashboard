import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


interface Activity {
    id: string | number;
    activity: string;
    time: string;
}

interface WidgetsProps {
    data: Array<{ name: string; jobs: number }>;
    activities: Activity[];
}

const Widgets = (props: WidgetsProps) => {
    const { data, activities } = props;
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Card */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 col-span-1 lg:col-span-2">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">
                    Job Applications Over Time
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="jobs" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-slate-800 mb-2">
                    Recent Activity
                </h2>
                <ul className="flex-1 space-y-3">
                    {activities.map((a) => (
                        <li key={a.id} className="flex flex-col">
                            <span className="text-slate-700">{a.activity}</span>
                            <span className="text-xs text-slate-400">{a.time}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
export default Widgets;
