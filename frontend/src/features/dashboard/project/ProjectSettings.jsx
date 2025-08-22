import { useState } from "react";
import { Trash2, Save } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CircularLoader from "../../../components/CircularLoader";
import { toast } from "react-hot-toast";
import {
  deleteProject,
  updateProjectName,
} from "../../../app/slices/project/projectThunk";

const ProjectSettings = () => {
  const { currentProject, isUpdatingName } = useSelector(
    (state) => state.project
  );
  const { members, _id: id, name } = currentProject;
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState(() => name);
  const dispatch = useDispatch();
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const handleRoleChange = (id, newRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
  };

  const removeMember = (id) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${
          members.find((m) => m.id === id)?.name
        }?`
      )
    ) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      console.log(`Member ${id} removed`);
    }
  };

  const handleDeleteProject = async () => {
    if (
      window.confirm(
        "ARE YOU ABSOLUTELY SURE YOU WANT TO DELETE THIS PROJECT? This action cannot be undone and all data will be lost."
      )
    ) {
      setIsDeletingProject(true);
      await dispatch(deleteProject({ projectId: id }))
        .unwrap()
        .then(() => {
          toast.success("Projected deleted successfully");
          navigate("/dashboard/projects");
        })
        .catch((err) => toast.error(err?.message || err));
      setIsDeletingProject(false);
    }
  };

  const hanldeNameUpdate = async () => {
    const payload = { projectId: id, name: projectName };
    await dispatch(updateProjectName(payload))
      .unwrap()
      .then(() => toast.success("Name changed successfully."))
      .catch((err) => console.log(err));
  };

  return (
    <div className="min-h-screen p-6 bg-[#121212] text-gray-100 transition duration-300 ease-in-out">
      <div className="max-w-4xl mx-auto bg-[#1a1a1a] rounded-3xl shadow-xl p-8 space-y-8 border border-[#2a2a2a]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#2a2a2a] pb-4">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Project Settings
          </h2>
        </div>

        {/* Project Details */}
        <section className="space-y-5">
          <h3 className="text-xl font-bold text-gray-50">Project Name</h3>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full p-3 rounded-lg border border-[#3a3a3a] bg-[#222222] text-white focus:outline-none focus:ring-3 focus:ring-blue-500 text-base shadow-sm"
            placeholder="Enter Project Name"
          />
          <button
            onClick={hanldeNameUpdate}
            className="min-w-36 cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            {isUpdatingName ? (
              <CircularLoader />
            ) : (
              <>
                {" "}
                <Save className="w-5 h-5" /> Save Changes
              </>
            )}
          </button>
        </section>

        <hr className="border-[#2a2a2a]" />

        {/* Team Members */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-gray-50">Team Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map(
              (member) =>
                member.role !== "owner" && (
                  <div
                    key={member._id}
                    className="flex flex-col items-start p-5 bg-[#222222] rounded-xl shadow-sm border border-[#3a3a3a] hover:shadow-md transition duration-200 ease-in-out"
                  >
                    <p className="font-semibold text-lg text-white mb-2">
                      {`${member.user.firstname} ${member.user.lastname}`}
                    </p>
                    <div className="flex items-center w-full justify-between">
                      <p>{member.role}</p>
                      {/* <select
                    value={member.role}
                    onChange={(e) =>
                      handleRoleChange(member.user._id, e.target.value)
                    }
                    className="p-2.5 rounded-md border border-[#3a3a3a] text-sm bg-[#2a2a2a] text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select> */}
                      <button
                        onClick={() => removeMember(member.user._id)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm ml-4 py-1 px-2 rounded-md transition duration-200"
                        title="Remove Member"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )
            )}
          </div>
        </section>

        <hr className="border-[#2a2a2a]" />

        {/* Danger Zone: Delete Project */}
        <section className="pt-4 bg-gray-900 p-6 rounded-xl border border-red-900 shadow-inner">
          {" "}
          {/* Changed from red */}
          <h3 className="text-xl font-bold text-gray-300 mb-3">
            Danger Zone
          </h3>{" "}
          {/* Changed from red */}
          <p className="text-gray-400 mb-4 text-sm">
            {" "}
            {/* Changed from red */}
            Permanently delete this project and all its associated data. This
            action cannot be undone.
          </p>
          <button
            onClick={handleDeleteProject}
            className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition transform focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {isDeletingProject && <CircularLoader />}
            {!isDeletingProject && (
              <>
                <Trash2 className="w-5 h-5" /> Delete Project
              </>
            )}
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProjectSettings;
