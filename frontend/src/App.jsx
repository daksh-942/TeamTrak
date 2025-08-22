import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import DashboardHome from "./features/dashboard/DashboardHome";
import Dashboard from "./features/dashboard/Dashboard";
import MyTasks from "./features/dashboard/MyTasks";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { Toaster } from "react-hot-toast";
import ProjectPage from "./features/dashboard/ProjectPage";
import Overview from "./features/dashboard/project/Overview";
import Files from "./features/dashboard/project/Files";
import Messages from "./features/dashboard/project/Messages";
import Inbox from "./features/dashboard/Inbox";
import ProjectDasboard from "./features/dashboard/project/ProjectDasboard";
import TeamsPage from "./features/dashboard/teams/TeamsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TaskPage from "./features/dashboard/tasks/TaskPage";
import AuthWrapper from "./components/AuthWrapper";
import TeamInvitePage from "./features/dashboard/teams/TeamInvitePage";
import ProjectInvitePage from "./features/dashboard/project/ProjectInvitePage";
import Projects from "./features/dashboard/project/Projects";
import Teams from "./features/dashboard/teams/Teams";
import ProjectSettings from "./features/dashboard/project/ProjectSettings";
import TeamSettings from "./features/dashboard/teams/TeamSettings";
import ProjectTasks from "./features/dashboard/project/ProjectTasks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="project-invite" element={<ProjectInvitePage />} />
        <Route path="team-invite" element={<TeamInvitePage />} />
        <Route path="signup" element={<SignupPage />} />

        <Route
          path="dashboard"
          element={
            <AuthWrapper>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </AuthWrapper>
          }
        >
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<DashboardHome />} />
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="my-tasks/:taskId" element={<TaskPage />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="projects" element={<Projects />} />

          {/* nested projects route */}
          <Route path="projects/:projectId" element={<ProjectPage />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="tasks" element={<ProjectTasks />} />
            <Route path="files" element={<Files />} />
            <Route path="messages" element={<Messages />} />
            <Route path="project-dashboard" element={<ProjectDasboard />} />
            <Route path="settings" element={<ProjectSettings />} />
          </Route>

          {/* teams route */}
          <Route path="teams" element={<Teams />} />
          <Route path="teams/:teamId" element={<TeamsPage />} />
          <Route path="teams/settings" element={<TeamSettings />} />
        </Route>
      </Routes>

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            iconTheme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
