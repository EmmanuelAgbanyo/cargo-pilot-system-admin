
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ShipmentChartProps {
  data: {
    delivered: number;
    inTransit: number;
    pending: number;
  };
}

const COLORS = ['#22c55e', '#eab308', '#f97316'];

const ShipmentChart = ({ data }: ShipmentChartProps) => {
  const chartData = [
    { name: 'Delivered', value: data.delivered },
    { name: 'In Transit', value: data.inTransit },
    { name: 'Pending', value: data.pending }
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} shipments`, '']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ShipmentChart;
