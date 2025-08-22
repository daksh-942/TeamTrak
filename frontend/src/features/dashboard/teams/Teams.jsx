import { marked } from "marked";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const UserIcon = () => (
  <Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
);

const getAvatar = (firstname, lastname) => {
  return `${firstname[0].toUpperCase()}${lastname[0].toUpperCase()}`;
};

const getRandomColor = () => {
  const colors = ["14213d", "264653", "132a13", "6f1d1b", "343a40", "240046"];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const TeamCard = ({ team }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/dashboard/teams/${team._id}`)}
      className="bg-[#2A2B2D] rounded-xl p-6 shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-cyan-500/50 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-100">{team.name}</h3>
          <img
            src={`https://placehold.co/100x100/${getRandomColor()}/fff?text=${getAvatar(
              team.owner.firstname,
              team.owner.lastname
            )}`}
            alt={`${team.owner.firstname}'s avatar`}
            className="w-12 h-12 rounded-full border-2 border-gray-600 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/100x100/333/FFF?text=?";
            }}
          />
        </div>
        <p
          className="text-gray-400 mb-5 text-sm leading-relaxed min-h-[60px]"
          dangerouslySetInnerHTML={{
            __html: marked(team.description.slice(0, 100) + "..."),
          }}
        ></p>
      </div>
      <div>
        <div className="flex items-center text-gray-400 text-sm mb-4">
          <UserIcon />
          <span className="ml-2">
            {team.owner.firstname} {team.owner.lastname}
          </span>
        </div>
        {/* <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-600/50 text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div> */}
      </div>
    </div>
  );
};

function Teams() {
  const { teams } = useSelector((state) => state.team);
  return (
    <div className="container mx-auto px-8 py-12">
      <header className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          Teams
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Explore your teams.</p>
      </header>
      {teams.length === 0 ? (
        <h1 className=" text-center text-2xl md:text-3xl font-extrabold text-white">
          No teams 🙃.
        </h1>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          {teams.map((team) => (
            <TeamCard key={team._id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Teams;
