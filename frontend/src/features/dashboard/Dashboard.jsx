import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import { useDispatch, useSelector } from "react-redux";
import { getUserProjects } from "../../app/slices/project/projectThunk";
import SplashScreen from "../../components/SplashScreen";
import { getUserTasks } from "../../app/slices/task/taskThunk";
import { getAllTeams } from "../../app/slices/team/teamThunk";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const dispatch = useDispatch();
  const {
    projects,
    loading: isLoadingProjects,
    error: projectError,
  } = useSelector((state) => state.project);
  const {
    teams,
    loading: isLoadingTeams,
    error: teamError,
  } = useSelector((state) => state.team);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUserProjects({ query: { page: 1 } }));
    dispatch(getAllTeams());
    dispatch(getUserTasks({ userId: user.id }));
  }, [dispatch, user]);

  if (isLoadingProjects || isLoadingTeams) return <SplashScreen />;
  // if (projectError) return <h1>Project Error : Error loading dashboard</h1>;
  // if (teamError) return <h1>Project Error : Error loading dashboard</h1>;

  return (
    <div className="h-screen font-roboto flex flex-col">
      {/* Navbar */}
      <div className="flex-shrink-0">
        <Navbar onToggleSidbar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - mobile (absolute) */}
        <div
          className={`fixed inset-y-0 left-0 z-40 transition-transform transform md:relative md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:flex-shrink-0 w-64`}
        >
          <Sidebar
            isToggled={isSidebarOpen}
            projects={projects}
            teams={teams}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-[#1E1F21] text-white">
          <Modal />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
