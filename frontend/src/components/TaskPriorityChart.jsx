// TaskPriorityChart.jsx
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Colors for priorities
const PRIORITY_COLORS = {
  Low: "#4ECDC4",
  Medium: "#FFD93D",
  High: "#FF6B6B",
};

// Custom tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value, percent } = payload[0];
    return (
      <div className="bg-gray-700 text-white p-2 rounded shadow">
        <p className="font-semibold">{name} Priority</p>
        <p>Count: {value}</p>
        <p>Percentage: {(percent * 100).toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

const TaskPriorityChart = ({ tasks }) => {
  // Grouping priorities
  const priorityMap = {
    Low: 0,
    Medium: 0,
    High: 0,
  };

  tasks.forEach((task) => {
    if (priorityMap[task.priority] !== undefined) {
      priorityMap[task.priority]++;
    }
  });

  const total = tasks.length;

  const chartData = Object.entries(priorityMap).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="w-full h-96 p-4 bg-background rounded-xl shadow-md">
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
              <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name]} />
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
      {/* <p className="text-gray-400 mt-4 text-sm text-center">
        Total Tasks: {total}
      </p> */}
    </div>
  );
};

export default TaskPriorityChart;
