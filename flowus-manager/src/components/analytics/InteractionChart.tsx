import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface InteractionChartProps {
  data: { name: string; value: number; color: string }[];
}

export default function InteractionChart({ data }: InteractionChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">互动分布</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
