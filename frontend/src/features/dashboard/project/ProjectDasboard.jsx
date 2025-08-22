import TaskStatusChart from "../../../components/TaskStatusChart";
import TaskPriorityChart from "../../../components/TaskPriorityChart";
import TasksPerMemberChart from "../../../components/TaskPerMemberChart";
import { useSelector } from "react-redux";

function ProjectDashboard() {
  const { projectTasks } = useSelector((state) => state.task);

  return (
    <div className="min-h-screen p-2  text-white">
      <h1 className="text-3xl font-bold mb-6">Project Analytics</h1>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaskStatusChart tasks={projectTasks} />
        <TaskPriorityChart tasks={projectTasks} />
      </div>
      <div>
        <TasksPerMemberChart tasks={projectTasks} />
      </div>
    </div>
  );
}

export default ProjectDashboard;
