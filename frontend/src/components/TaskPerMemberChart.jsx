import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const TasksPerMemberChart = ({ tasks }) => {
  const taskCountByAssignee = {};

  tasks.forEach((task) => {
    const name = task.assignee?.firstname || "Unknown";
    taskCountByAssignee[name] = (taskCountByAssignee[name] || 0) + 1;
  });

  const chartData = Object.entries(taskCountByAssignee).map(
    ([name, count]) => ({
      name,
      taskCount: count,
    })
  );

  return (
    <div className="w-full mt-6 h-72 p-4 pb-6 bg-background rounded-2xl shadow-lg text-gray-900">
      {/* <h2 className="text-xl font-semibold mb-4">
        Tasks Assigned to Each Member
      </h2> */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="taskCount" fill="#6366F1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TasksPerMemberChart;
