import { useSelector } from "react-redux";
import SplashScreen from "../../components/SplashScreen";
import { useNavigate } from "react-router";
import clsx from "clsx";

const statusColors = {
  "To Do": "bg-zinc-700 text-zinc-300",
  "In Progress": "bg-blue-600 text-white",
  Blocked: "bg-red-600 text-white",
  Completed: "bg-green-600 text-white",
};

const priorityColors = {
  Low: "bg-green-600 text-white",
  Medium: "bg-yellow-500 text-black",
  High: "bg-red-500 text-white",
};

export default function MyTasks() {
  const { userTasks, loading } = useSelector((state) => state.task);
  const navigate = useNavigate();

  if (loading) return <SplashScreen />;

  return (
    <div className="px-8 py-6 text-sm text-white/90">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">My Tasks</h2>
        <nav className="flex gap-3 text-sm">
          <button className="px-3 py-1 hover:bg-[#2B2C2E] rounded transition">
            Filter
          </button>
          <button className="px-3 py-1 hover:bg-[#2B2C2E] rounded transition">
            Sort
          </button>
          <button className="px-3 py-1 hover:bg-[#2B2C2E] rounded transition">
            Group
          </button>
          <button className="px-3 py-1 hover:bg-[#2B2C2E] rounded transition">
            Options
          </button>
        </nav>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[#2B2C2E] text-white/80 text-left">
              <th className="py-3 px-4 border-b border-white/30">Task</th>
              <th className="py-3 px-4 border-b border-white/30">Project</th>
              <th className="py-3 px-4 border-b border-white/30">Due Date</th>
              <th className="py-3 px-4 border-b border-white/30">Priority</th>
              <th className="py-3 px-4 border-b border-white/30">Status</th>
            </tr>
          </thead>
          <tbody>
            {userTasks.map((task) => (
              <tr
                key={task._id}
                onClick={() => navigate(`${task._id}`)}
                className="hover:bg-[#2B2C2E] cursor-pointer transition"
              >
                <td className="py-3 px-4 border-b border-white/20">
                  {task.title}
                </td>
                <td className="py-3 px-4 border-b border-white/20">
                  {task.assignee.firstname}
                </td>
                <td className="py-3 px-4 border-b border-white/20">
                  {new Date(task.deadline).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 border-b border-white/20">
                  <span
                    className={clsx(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      priorityColors[task.priority] || "bg-gray-600 text-white"
                    )}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="py-3 px-4 border-b border-white/20">
                  <span
                    className={clsx(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      statusColors[task.status] || "bg-gray-700 text-white"
                    )}
                  >
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
            {userTasks.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-zinc-400 border-b border-white/20"
                >
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
