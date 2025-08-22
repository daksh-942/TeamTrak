import { NavLink, Outlet, useParams } from "react-router";
import {
  ClipboardList,
  FilesIcon,
  LayoutDashboard,
  List,
  MessagesSquare,
  Menu,
  X,
  Settings,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import SplashScreen from "../../components/SplashScreen";
import { getCurrentProject } from "../../app/slices/project/projectSlice";
import { useEffect, useState } from "react";
import { getProjectTasks } from "../../app/slices/task/taskThunk";

function ProjectPageLayout() {
  const { projectId } = useParams();
  const { currentProject } = useSelector((state) => state.project);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    dispatch(getCurrentProject(projectId));
    dispatch(getProjectTasks({ projectId }));
  }, [dispatch, projectId]);

  if (!currentProject) return <SplashScreen />;

  return (
    <div className="relative min-h-screen font-roboto text-gray-300 bg-[#121212]">
      {/* Header */}
      <header className="z-10 sticky top-0 left-0 border-b border-white/10 px-4 py-3 shadow-md bg-[#1A1A1A]">
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            {currentProject.name}
          </h2>
          {/* Hamburger Icon */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            {isNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Nav Links */}
        <nav
          className={`${
            isNavOpen ? "block" : "hidden"
          } md:flex flex-col md:flex-row gap-4 mt-4 text-sm font-medium`}
        >
          <NavItem
            to="overview"
            icon={<ClipboardList size={16} />}
            label="Overview"
          />
          <NavItem to="tasks" icon={<List size={16} />} label="Tasks" />
          <NavItem
            to="project-dashboard"
            icon={<LayoutDashboard size={16} />}
            label="Analytics"
          />
          <NavItem
            to="messages"
            icon={<MessagesSquare size={16} />}
            label="Messages"
          />
          <NavItem to="files" icon={<FilesIcon size={16} />} label="Files" />
          {user.id === currentProject.owner._id && (
            <NavItem
              to="settings"
              icon={<Settings size={16} />}
              label="Settings"
            />
          )}
        </nav>
      </header>

      <main className="px-4 md:px-10 py-6">
        <Outlet />
      </main>
    </div>
  );
}

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      isActive
        ? "text-white border-b-2 border-blue-500 pb-1"
        : "text-gray-400 hover:text-white pb-1 transition-all"
    }
  >
    <div className="flex items-center gap-2">
      {icon} {label}
    </div>
  </NavLink>
);

export default ProjectPageLayout;
