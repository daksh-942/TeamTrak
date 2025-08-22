import { ChevronLeft, ChevronRight } from "lucide-react";
import { marked } from "marked";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getUserProjects } from "../../../app/slices/project/projectThunk";
import { setCurrentPage } from "../../../app/slices/project/projectSlice";
import CircularLoader from "../../../components/CircularLoader";

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
  if (!firstname || !lastname) return "?"; // Handle cases where names might be missing
  return `${firstname[0]?.toUpperCase() || ""}${
    lastname[0]?.toUpperCase() || ""
  }`;
};

const getRandomColor = () => {
  const colors = ["14213d", "264653", "132a13", "6f1d1b", "343a40", "240046"];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/dashboard/projects/${project._id}/overview`)}
      className="bg-[#2A2B2D] rounded-xl p-6 shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-cyan-500/50 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-100">{project.name}</h3>
          {project.owner && ( // Check if owner exists before accessing properties
            <img
              src={`https://placehold.co/100x100/${getRandomColor()}/fff?text=${getAvatar(
                project.owner.firstname,
                project.owner.lastname
              )}`}
              alt={`${project.owner.firstname}'s avatar`}
              className="w-12 h-12 rounded-full border-2 border-gray-600 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/100x100/333/FFF?text=?";
              }}
            />
          )}
        </div>
        <p
          className="text-gray-400 mb-5 text-sm leading-relaxed min-h-[60px]"
          dangerouslySetInnerHTML={{
            __html: marked(project.description.slice(0, 100) + "..."),
          }}
        ></p>
      </div>
      <div>
        <div className="flex items-center text-gray-400 text-sm mb-4">
          <UserIcon />
          <span className="ml-2">
            {project.owner
              ? `${project.owner.firstname} ${project.owner.lastname}`
              : "N/A"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tags &&
            project.tags.map(
              (
                tag // Check if tags exist
              ) => (
                <span
                  key={tag}
                  className="bg-gray-600/50 text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              )
            )}
        </div>
      </div>
    </div>
  );
};

function Projects() {
  const { projects, currentPage, totalPages, isFetchingProjects, error } =
    useSelector((state) => state.project);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserProjects({ query: { page: currentPage } }));
  }, [currentPage, dispatch]);

  const handleLeft = () => {
    if (currentPage > 1 && !isFetchingProjects) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  const handleRight = () => {
    if (currentPage < totalPages && !isFetchingProjects) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  const handlePageClick = (pageNumber) => {
    if (
      pageNumber !== currentPage &&
      pageNumber >= 1 &&
      pageNumber <= totalPages &&
      !isFetchingProjects
    ) {
      dispatch(setCurrentPage(pageNumber));
    }
  };

  return (
    <div className="relative container mx-auto px-8 py-12 min-h-screen flex flex-col">
      <header className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          Projects
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Explore your innovative work you're passionate about.
        </p>
      </header>

      {isFetchingProjects ? (
        <div className="flex-grow flex items-center justify-center">
          <CircularLoader />
        </div>
      ) : error ? (
        <h1 className="text-center text-2xl md:text-3xl font-extrabold text-red-500">
          Error: {error}. Please try again later.
        </h1>
      ) : projects.length === 0 ? (
        <h1 className="text-center text-2xl md:text-3xl font-extrabold text-white">
          No Projects 🙃.
        </h1>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in flex-grow"
          style={{ animationDelay: "0.2s" }}
        >
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      {totalPages > 1 && !isFetchingProjects && (
        <footer className="mt-10 b-0 flex justify-center items-center gap-2 md:gap-3 flex-wrap">
          <button
            onClick={handleLeft}
            disabled={currentPage === 1 || isFetchingProjects}
            className="pagination-button disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNumber) => {
              const isCurrent = pageNumber === currentPage;
              const buttonClass = `pagination-button ${
                isCurrent ? "active" : ""
              } disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`;

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageClick(pageNumber)}
                  disabled={isCurrent || isFetchingProjects}
                  className={buttonClass}
                >
                  {pageNumber}
                </button>
              );
            }
          )}

          <button
            onClick={handleRight}
            disabled={currentPage === totalPages || isFetchingProjects}
            className="pagination-button disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </footer>
      )}
    </div>
  );
}

export default Projects;
