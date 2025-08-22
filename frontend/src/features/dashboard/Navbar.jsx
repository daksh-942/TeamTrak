import { LogOut, Settings, User, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../app/slices/auth/authThunks";

function Navbar({onToggleSidbar}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="bg-[#2e2e30] p-3 border-b border-[#424244] flex justify-between items-center px-4 md:px-6">
      {/* Left Section: Hamburger + Logo */}
      <div className="flex items-center gap-4">
        {/* Hamburger for Mobile */}
        <button
          className="text-white md:hidden"
          onClick={onToggleSidbar}
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>

        {/* Logo / Title */}
        <h1 className="text-white text-lg font-semibold">RemoteSync</h1>
      </div>

      {/* Right Section: User Info & Actions */}
      <div className="flex items-center gap-6">
        {/* User Info */}
        <div className="hidden sm:flex items-center gap-2">
          <p className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-sm">
            {user.avatar}
          </p>
          <span className="text-white font-medium text-sm">
            {`${user.firstname} ${user.lastname}`}
          </span>
        </div>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-6 text-white text-sm font-medium">
          <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-400 transition">
            <User size={16} />
            <span>Profile</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-400 transition">
            <Settings size={16} />
            <span>Settings</span>
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-red-400 transition"
            onClick={() => dispatch(logoutUser())}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
