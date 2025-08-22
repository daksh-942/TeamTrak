import { Link } from "react-router";

function NavLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-1 hover:bg-[#2B2C2E] rounded py-1 px-1.5 transition text-white/60 hover:text-white/100"
    >
      <span>{icon}</span>
      <span className="mt-1">{label}</span>
    </Link>
  );
}

export default NavLink;
