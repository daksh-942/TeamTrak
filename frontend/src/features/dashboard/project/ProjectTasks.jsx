import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Select from "react-select";
import { createTask } from "../../../app/slices/task/taskThunk";
import { useNavigate } from "react-router";
import clsx from "clsx";

const statusColors = {
  "Not Started": "bg-zinc-700 text-zinc-300",
  "In Progress": "bg-blue-600 text-white",
  Completed: "bg-green-600 text-white",
};

const priorityColors = {
  Low: "bg-green-600 text-white",
  Medium: "bg-yellow-500 text-black",
  High: "bg-red-500 text-white",
};

function ProjectTasks() {
  const [isAdddingTask, setIsAddingTask] = useState(false);
  const [assigness, setAssignees] = useState([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { currentProject } = useSelector((state) => state.project);
  const { projectTasks } = useSelector((state) => state.task);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const members = currentProject.members;
  const options = [];

  members.forEach((member) => {
    if (member.role !== "owner") {
      const name = member.user.firstname + " " + member.user.lastname;
      options.push({ label: name, value: member.user._id });
    }
  });

  const handleAddTask = async () => {
    const task = {
      title,
      deadline,
      priority,
      status,
      assignee: assigness[0],
      project: currentProject._id,
    };
    await dispatch(createTask(task))
      .unwrap()
      .then(() => {
        toast.success("task created");
      })
      .catch((err) => {
        toast.error(err);
      });
    setAssignees([]);
    setTitle("");
    setDeadline("");
    setPriority("");
    setStatus("");
    setIsAddingTask(false);
  };

  return (
    <div className="px-4 py-2 text-sm text-white/90">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">Task ProjectTasks</h2>
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
      {user.id === currentProject.owner._id && (
        <div className="mb-4">
          {!isAdddingTask ? (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
              onClick={() => setIsAddingTask(true)}
            >
              Create new task
            </button>
          ) : (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
              onClick={handleAddTask}
            >
              Add
            </button>
          )}
        </div>
      )}
      <table className="table-auto w-full border-collapse">
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
          {isAdddingTask && (
            <tr className="hover:bg-[#2B2C2E] transition">
              <td className="border-b border-r h-12 border-white/20 relative">
                <input
                  type="text"
                  className="w-full h-full border-none outline-none p-2 text-base"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </td>
              <td className="border-b h-12 border-r border-white/20 relative">
                <Select
                  isMulti
                  options={options}
                  onChange={(selectedOptions) =>
                    setAssignees(selectedOptions.map((opt) => opt.value))
                  }
                  placeholder="Select Assignees"
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "transparent",
                      border: "none",
                      boxShadow: "none",
                      color: "white",
                      minHeight: "2.5rem",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "#2B2C2E",
                      color: "white",
                      border: "none",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused
                        ? "#3a3b3d"
                        : "transparent",
                      color: "white",
                      cursor: "pointer",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#3a3b3d",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "white",
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: "#aaa",
                      ":hover": {
                        backgroundColor: "#555",
                        color: "white",
                      },
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#ccc",
                    }),
                    input: (base) => ({
                      ...base,
                      color: "white",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "white",
                    }),
                  }}
                />
              </td>
              <td className="border-b border-r h-12 border-white/20 relative">
                <input
                  type="date"
                  className="w-full h-full border-none outline-none p-2 text-base"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </td>
              <td className="border-b border-r h-12 border-white/20 relative">
                <select
                  className="w-full h-full bg-transparent text-white px-3 py-2 outline-none appearance-none"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option className="bg-[#2B2C2E] text-white" value="">
                    Select Priority
                  </option>
                  <option className="bg-[#2B2C2E] text-white" value="Low">
                    Low
                  </option>
                  <option className="bg-[#2B2C2E] text-white" value="Medium">
                    Medium
                  </option>
                  <option className="bg-[#2B2C2E] text-white" value="High">
                    High
                  </option>
                </select>
              </td>
              <td className="border-b h-12 border-white/20 relative">
                <select
                  className="w-full h-full bg-transparent text-white px-3 py-2 outline-none appearance-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option className="bg-[#2B2C2E] text-white" value="">
                    Select Status
                  </option>
                  <option
                    className="bg-[#2B2C2E] text-white"
                    value="Not Started"
                  >
                    Not Started
                  </option>
                  <option
                    className="bg-[#2B2C2E] text-white"
                    value="In Progress"
                  >
                    In Progress
                  </option>
                  <option className="bg-[#2B2C2E] text-white" value="Completed">
                    Completed
                  </option>
                </select>
              </td>
            </tr>
          )}
          {projectTasks.map((task) => (
            <tr
              key={task._id}
              onClick={() => navigate(`/dashboard/my-tasks/${task._id}`)}
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
        </tbody>
      </table>
    </div>
  );
}

export default ProjectTasks;
