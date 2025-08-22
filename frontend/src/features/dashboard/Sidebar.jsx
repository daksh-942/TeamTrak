import {
  Home,
  ListTodo,
  Inbox,
  FolderKanban,
  Users2,
  Plus,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { close, open, setActiveComponent } from "../../app/slices/modal";
import { delay } from "../../utils/delay";

export default function Sidebar({ projects, teams, onClose }) {
  const dispatch = useDispatch();
  const { state } = useSelector((state) => state.modal);
  const navigate = useNavigate();

  async function handleNew(activeComponent) {
    if (state) {
      dispatch(close());
      await delay(700);
    }
    dispatch(open());
    dispatch(setActiveComponent(activeComponent));
    if (onClose) onClose(); // Close sidebar on mobile after opening modal
  }

  return (
    <aside className="w-64 h-full bg-[#1A1A1A] text-white flex flex-col z-30">
      {/* Top bar for mobile to close */}
      <div className="flex items-center justify-between p-4 md:hidden border-b border-white/10">
        <h2 className="text-white text-lg font-semibold">Menu</h2>
        <X
          size={20}
          className="cursor-pointer hover:text-white text-white/70"
          onClick={onClose}
        />
      </div>

      {/* Fixed Section */}
      <div className="p-4 border-b border-white/10">
        <nav className="flex flex-col gap-2">
          <SidebarItem
            icon={<Home size={18} />}
            label="Home"
            to="/dashboard"
            onClose={onClose}
          />
          <SidebarItem
            icon={<ListTodo size={18} />}
            label="My Tasks"
            to="my-tasks"
            onClose={onClose}
          />
          <SidebarItem
            icon={<Inbox size={18} />}
            label="Inbox"
            to="inbox"
            onClose={onClose}
          />
        </nav>
      </div>

      {/* Scrollable Section */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
        {/* Projects */}
        <div>
          <SectionHeader
            label="Projects"
            onClick={() => handleNew("new_project_form")}
          />
          <div className="flex flex-col gap-2 mt-2">
            {projects.length === 0 ? (
              <h1>No Projects</h1>
            ) : (
              projects.map((project) => (
                <SidebarItem
                  key={project._id}
                  icon={<FolderKanban size={18} />}
                  label={project.name}
                  to={`projects/${project._id}`}
                  onClose={onClose}
                />
              ))
            )}
          </div>
        </div>

        {/* Teams */}
        <div>
          <SectionHeader
            label="Teams"
            onClick={() => handleNew("new_team_form")}
          />

          <div className="flex flex-col gap-2 mt-2">
            {teams.length === 0 ? (
              <h1>No teams. Start by creating one.</h1>
            ) : (
              teams.map((team) => (
                <SidebarItem
                  key={team._id}
                  icon={<FolderKanban size={18} />}
                  label={team.name}
                  to={`teams/${team._id}`}
                  onClose={onClose}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

// Reusable Item
const SidebarItem = ({ icon, label, to, onClick, onClose }) => (
  <Link
    to={to}
    className="flex items-center gap-2 text-sm px-2 py-2 rounded hover:bg-[#2B2C2E] cursor-pointer transition"
    onClick={() => {
      if (onClick) onClick();
      if (onClose) onClose(); // close sidebar on mobile
    }}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

// Section Header with "+" icon
const SectionHeader = ({ label, onClick }) => (
  <div className="flex items-center justify-between text-xs uppercase text-white/60">
    <span>{label}</span>
    <Plus
      size={16}
      className="cursor-pointer hover:text-white transition"
      onClick={onClick}
    />
  </div>
);
