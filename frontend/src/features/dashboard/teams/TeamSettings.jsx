import { useState } from "react";
import { Trash2, Save } from "lucide-react";

const ProjectSettings = () => {
  const [projectName, setProjectName] = useState("Remote Collab");
  const [members, setMembers] = useState([
    { id: 1, name: "Vaishnavi", role: "Admin" },
    { id: 2, name: "Akash", role: "Editor" },
    { id: 3, name: "Priya", role: "Viewer" },
  ]);

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

  const deleteProject = () => {
    if (
      window.confirm(
        "ARE YOU ABSOLUTELY SURE YOU WANT TO DELETE THIS PROJECT? This action cannot be undone and all data will be lost."
      )
    ) {
      console.log("Team deleted");
      // In a real application, you'd typically redirect or perform an API call here
    }
  };

  const updateProject = () => {
    console.log("Team updated:", { projectName, members });
    // In a real application, you'd typically perform an API call here to save changes
    alert("Team settings saved successfully!");
  };

  return (
    // <div className=" p-6 bg-[#1E1F21] ">
    <div className="transition text-gray-100  duration-300 ease-in-out min-h-screen max-w-4xl mx-auto bg-[#1E1F21] rounded-3xl p-6 space-y-8 ">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#2a2a2a] pb-4">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Team Settings
        </h2>
      </div>

      {/* Team Details */}
      <section className="space-y-5">
        <h3 className="text-xl font-bold text-gray-50">Team Name</h3>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full p-3 rounded-lg border border-[#3a3a3a] bg-[#222222] text-white focus:outline-none focus:ring-3 focus:ring-blue-500 text-base shadow-sm"
          placeholder="Enter Team Name"
        />
        <button
          onClick={updateProject}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Save className="w-5 h-5" /> Save Changes
        </button>
      </section>

      <hr className="border-[#2a2a2a]" />

      {/* Team Members */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-gray-50">Team Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-start p-5 bg-[#222222] rounded-xl shadow-sm border border-[#3a3a3a] hover:shadow-md transition duration-200 ease-in-out"
            >
              <p className="font-semibold text-lg text-white mb-2">
                {member.name}
              </p>
              <div className="flex items-center w-full justify-between">
                <select
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.id, e.target.value)}
                  className="p-2.5 rounded-md border border-[#3a3a3a] text-sm bg-[#2a2a2a] text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
                <button
                  onClick={() => removeMember(member.id)}
                  className="text-red-500 hover:text-red-700 font-medium text-sm ml-4 py-1 px-2 rounded-md transition duration-200"
                  title="Remove Member"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-[#2a2a2a]" />

      {/* Danger Zone: Delete Team */}
      <section className="pt-4 bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-inner">
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
          onClick={deleteProject}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <Trash2 className="w-5 h-5" /> Delete Team
        </button>
      </section>
    </div>
    // </div>
  );
};

export default ProjectSettings;
