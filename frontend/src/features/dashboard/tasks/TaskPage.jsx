import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentTask } from "../../../app/slices/task/taskSlice";
import SplashScreen from "../../../components/SplashScreen";
import { changeTaskStatus } from "../../../app/slices/task/taskThunk";
import toast from "react-hot-toast";
import CircularLoader from "../../../components/CircularLoader";

const statusOptions = ["Not Started", "In Progress", "Completed"];
const statusColors = {
  "Not Started": "bg-blue-400/30 text-blue-300",
  "In Progress": "bg-yellow-300/20 text-yellow-200",
  Completed: "bg-green-400/20 text-green-300",
};
const priorityColors = {
  Low: "text-green-400",
  Medium: "text-yellow-400",
  High: "text-red-400",
};

export default function TaskPage() {
  const { currentTask: task, isUpdatingStatus } = useSelector(
    (state) => state.task
  );
  const { taskId } = useParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");

  async function handleStatusChange() {
    dispatch(changeTaskStatus({ taskId, status }))
      .unwrap()
      .then(() => toast.success("Task status updated successfully."))
      .catch((err) => toast.error(err.message));
  }

  useEffect(() => {
    dispatch(getCurrentTask(taskId));
  }, [dispatch, task, taskId]);

  if (!task) return <SplashScreen />;
  return (
    <motion.div
      className="max-w-3xl mx-auto p-8 bg-zinc-900 rounded-2xl shadow-lg text-white space-y-6 mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Title + Description */}
      <div>
        <h1 className="text-4xl font-bold mb-2 pt-4">{task.title}</h1>
        <p className="text-zinc-400 text-lg">{task.description}</p>
      </div>

      {/* Deadline */}
      <div>
        <label className="block text-sm text-zinc-500 mb-1">Deadline</label>
        <p className="text-zinc-300 text-lg">
          {new Date(task.deadline).toLocaleString()}
        </p>
      </div>

      <div>
        <label className="block text-sm text-zinc-500 mb-1">Status</label>
        <p
          className={`${
            statusColors[task.status]
          } p-2 rounded-2xl inline-block`}
        >
          {task.status}
        </p>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm text-zinc-500 mb-1">Priority</label>
        <p className={`text-lg font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </p>
      </div>

      {/* Horizontal Status Selection */}
      <div>
        <label className="block text-sm text-zinc-500 mb-2">
          Change Status
        </label>
        <div className="flex flex-wrap gap-4">
          {statusOptions.map((option) => (
            <label
              key={option}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition
                ${
                  status === option
                    ? "bg-zinc-800 border border-zinc-700"
                    : "bg-zinc-800/60"
                }`}
            >
              <input
                type="radio"
                name="status"
                value={option}
                onChange={() => setStatus(option)}
                className="accent-indigo-500"
              />
              <span
                className={`text-sm font-medium px-2 py-0.5 rounded ${statusColors[option]}`}
              >
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <button
          onClick={handleStatusChange}
          className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 transition px-4 py-2 rounded-md"
        >
          {isUpdatingStatus ? <CircularLoader /> : "Save Changes"}
        </button>
      </div>
    </motion.div>
  );
}
