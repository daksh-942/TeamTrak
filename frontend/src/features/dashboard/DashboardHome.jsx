import { motion } from "framer-motion";
import { FolderKanban, Plus, BarChart2, Settings2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ProjectOverviewCards from "./project/ProjectOverviewCards";
import Timeline from "../../components/Timeline";
import UpcomingTasks from "./project/UpcomingTasks";
import { Link } from "react-router";
import { close, open, setActiveComponent } from "../../app/slices/modal";
import { delay } from "../../utils/delay";

const tasks = [
  {
    title: "Finalize login API",
    project: "RemoteHub",
    due: "Today",
    status: "On Track",
  },
  {
    title: "UI wireframes review",
    project: "ClassMate",
    due: "In 2 days",
    status: "Upcoming",
  },
];

const activities = [
  "You commented on API Integration",
  "Ravi completed UI Design",
  "Sanya created a new task in Hostel App",
];

function getDetails(projects, userId) {
  const total = projects.length;
  let owned = 0;
  projects.map((project) => {
    if (project?.owner && project?.owner?.user === userId) {
      owned++;
    }
  });
  return {
    total,
    owned,
  };
}

function getActivites(teams) {
  const activites = teams.reduce((acc, curr) => {
    const activity = curr.activityLogs.map((activity) => ({
      ...activity,
      id: curr._id,
      name: curr.name,
    }));
    acc.push(...activity);
    return acc;
  }, []);
  return activites;
}

export default function DashboardHome() {
  const { user } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.project);
  const { teams } = useSelector((state) => state.team);
  const { userTasks } = useSelector((state) => state.task);
  const { state } = useSelector((state) => state.modal);

  const projectsData = getDetails(projects, user._id);
  const teamsData = getDetails(teams, user._id);
  const activites = getActivites(teams);

  const dispatch = useDispatch();
  const handleNewProject = async (activeComponent) => {
    if (state) {
      dispatch(close());
      await delay(700);
    }
    dispatch(open());
    dispatch(setActiveComponent(activeComponent));
  };
  return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 text-white space-y-10">
  {/* Welcome Section */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col gap-4 sm:flex-row sm:justify-between"
  >
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
        Welcome back, {`${user.firstname}`} 👋
      </h1>
      <p className="text-gray-400 text-sm sm:text-base">
        Explore your projects and teams.
      </p>
    </div>

    {/* Responsive Buttons */}
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full sm:w-auto">
      <button
        onClick={() => handleNewProject("new_project_form")}
        className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium text-sm sm:text-base"
      >
        <Plus size={14} /> New Project
      </button>
      <Link
        to="/dashboard/projects"
        className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium text-sm sm:text-base"
      >
        <FolderKanban size={14} /> Browse Projects
      </Link>
      <Link
        to="/dashboard/teams"
        className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium text-sm sm:text-base"
      >
        <Settings2 size={14} /> Browse Team
      </Link>
    </div>
  </motion.div>

  {/* Project Overview Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
    <ProjectOverviewCards projects={projectsData} teams={teamsData} />
  </div>

  {/* Tasks and Activity */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
    <UpcomingTasks userTasks={userTasks} />
    <Timeline activities={activites} />
  </div>
</div>

  );
}


