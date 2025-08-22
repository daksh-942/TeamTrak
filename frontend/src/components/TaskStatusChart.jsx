// TaskStatusChart.jsx
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define chart colors for each status
const STATUS_COLORS = {
  "Not Started": "#FF6B6B",
  "In Progress": "#FFD93D",
  Completed: "#6BCB77",
};

// Custom tooltip to show status, count, and percentage
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value, percent } = payload[0];
    return (
      <div className="bg-gray-700 text-white p-2 rounded shadow">
        <p className="font-semibold">{name}</p>
        <p>Count: {value}</p>
        <p>Percentage: {(percent * 100).toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

const TaskStatusChart = ({ tasks }) => {
  // Count status
  const statusMap = {
    "Not Started": 0,
    "In Progress": 0,
    Completed: 0,
  };
  tasks.forEach((task) => {
    if (statusMap[task.status] !== undefined) {
      statusMap[task.status]++;
    }
  });

  const chartData = Object.entries(statusMap).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="w-full h-96 p-4 bg-background rounded-2xl shadow-lg">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ color: "white" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskStatusChart;
