import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface VisitChartProps {
  data: { date: string; views: number; visitors: number }[];
}

export default function VisitChart({ data }: VisitChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">访问趋势</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} name="访问量" />
          <Line type="monotone" dataKey="visitors" stroke="#10B981" strokeWidth={2} name="访客数" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
