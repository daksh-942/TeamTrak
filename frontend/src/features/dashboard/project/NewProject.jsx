import { useDispatch, useSelector } from "react-redux";
import { close } from "../../../app/slices/modal";
import { useState } from "react";
import { createProject } from "../../../app/slices/project/projectThunk";
import Select from "react-select";
import CircularLoader from "../../../components/CircularLoader";

const projectTags = [
  // --- Technical Tags ---
  { label: "React", value: "React" },
  { label: "Node.js", value: "Node.js" },
  { label: "Python", value: "Python" },
  { label: "JavaScript", value: "JavaScript" },
  { label: "TypeScript", value: "TypeScript" },
  { label: "AWS", value: "AWS" },
  { label: "Docker", value: "Docker" },
  { label: "Firebase", value: "Firebase" },
  { label: "API", value: "API" },
  { label: "Machine Learning", value: "Machine Learning" },
  { label: "CSS3", value: "CSS3" },
  { label: "HTML5", value: "HTML5" },
  { label: "GraphQL", value: "GraphQL" },
  { label: "MongoDB", value: "MongoDB" },
  { label: "PostgreSQL", value: "PostgreSQL" },
  { label: "Vue.js", value: "Vue.js" },
  { label: "Angular", value: "Angular" },
  { label: "CI/CD", value: "CI/CD" },
  { label: "Blockchain", value: "Blockchain" },
  { label: "Mobile App", value: "Mobile App" },

  // --- Non-Technical Tags ---
  { label: "UX Design", value: "UX Design" },
  { label: "UI Design", value: "UI Design" },
  { label: "Agile", value: "Agile" },
  { label: "Scrum", value: "Scrum" },
  { label: "Project Management", value: "Project Management" },
  { label: "User Research", value: "User Research" },
  { label: "Marketing", value: "Marketing" },
  { label: "Analytics", value: "Analytics" },
  { label: "E-commerce", value: "E-commerce" },
  { label: "SaaS", value: "SaaS" },
  { label: "Prototyping", value: "Prototyping" },
  { label: "Leadership", value: "Leadership" },
  { label: "Collaboration", value: "Collaboration" },
  { label: "Innovation", value: "Innovation" },
  { label: "Content Strategy", value: "Content Strategy" },
  { label: "Fintech", value: "Fintech" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "EdTech", value: "EdTech" },
  { label: "SEO", value: "SEO" },
  { label: "Customer Support", value: "Customer Support" },
];

export default function NewProject() {
  const dispatch = useDispatch();
  const [projectName, setProjectName] = useState("");
  const [tags, setTags] = useState([]);
  const [teamsSelected, setTeamsSelected] = useState([]);

  const { loading } = useSelector((state) => state.project);
  const { teams } = useSelector((state) => state.team);

  const options = [];

  teams.forEach((team) => {
    options.push({ label: team.name, value: team._id });
  });

  const handleNewProject = () => {
    const projectData = {
      name: projectName,
      teamIds: teamsSelected,
      tags,
    };

    dispatch(createProject(projectData));
    dispatch(close());
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white p-4 sm:p-8 w-full max-w-screen-xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-center sm:text-left">
        New project
      </h1>

      <div className="mb-4 sm:mb-6">
        <label className="block text-gray-300 mb-2" htmlFor="projectName">
          Project name
        </label>
        <input
          type="text"
          id="projectName"
          className="w-full bg-[#1E1E1E] border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>

      <div className="mb-4 sm:mb-6">
        <label className="block text-gray-300 mb-2" htmlFor="projectName">
          Project tags
        </label>
        <Select
          isMulti={true}
          options={projectTags}
          onChange={(selectedOptions) =>
            setTags(selectedOptions.map((opt) => opt.value))
          }
          placeholder="Select Project tags"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "transparent",
              boxShadow: "none",
              borderColor: "#4a5565",
              color: "white",
              minHeight: "2.5rem",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#2B2C2E",
              color: "white",
              border: "#4a5565",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? "#3a3b3d" : "transparent",
              color: "white",
              cursor: "pointer",
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: "#3a3b3d",
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: "white",
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: "#aaa",
              ":hover": {
                backgroundColor: "#555",
                color: "white",
              },
            }),
            placeholder: (base) => ({
              ...base,
              color: "#ccc",
            }),
            input: (base) => ({
              ...base,
              color: "white",
            }),
            singleValue: (base) => ({
              ...base,
              color: "white",
            }),
          }}
        />
      </div>

      {/* <div className="flex gap-6 mb-6"> */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-gray-300 mb-2">Select a team</label>
        <Select
          isMulti={true}
          options={options}
          onChange={(selectedOptions) => {
            setTeamsSelected(selectedOptions.map((opt) => opt.value));
          }}
          placeholder="Select Team"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "transparent",
              boxShadow: "none",
              borderColor: "#4a5565",
              color: "white",
              minHeight: "2.5rem",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#2B2C2E",
              color: "white",
              border: "#4a5565",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? "#3a3b3d" : "transparent",
              color: "white",
              cursor: "pointer",
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: "#3a3b3d",
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: "white",
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: "#aaa",
              ":hover": {
                backgroundColor: "#555",
                color: "white",
              },
            }),
            placeholder: (base) => ({
              ...base,
              color: "#ccc",
            }),
            input: (base) => ({
              ...base,
              color: "white",
            }),
            singleValue: (base) => ({
              ...base,
              color: "white",
            }),
          }}
        />
      </div>

      {/* <div>
          <label className="block text-gray-300 mb-2">Privacy</label>
          <select className="w-full bg-[#1E1E1E] border border-gray-600 rounded-md px-4 py-2 text-white">
            <option>Shared with team</option>
          </select>
        </div> */}
      {/* </div> */}

      <div className="flex gap-4 justify-end">
        <button
          className="w-full sm:w-auto cursor-pointer bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md text-sm sm:text-base"
          onClick={() => dispatch(close())}
        >
          Cancel
        </button>
        <button
          className="w-full sm:w-auto cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm sm:text-base"
          onClick={handleNewProject}
          disabled={loading}
        >
          {loading ? <CircularLoader /> : "Create"}
        </button>
      </div>
    </div>
  );
}
