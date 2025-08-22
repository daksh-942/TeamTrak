import { useState } from "react";
import { Save, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { close } from "../../../app/slices/modal";
import { updateProjectDescription } from "../../../app/slices/project/projectThunk";
import toast from "react-hot-toast";

const ProjectDescription = () => {
  const { currentProject, loading } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const [description, setDescription] = useState(currentProject.description);

  const handleSave = () => {
    dispatch(
      updateProjectDescription({
        projectId: currentProject._id,
        description,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Description updated successfully!");
        dispatch(close());
      });
  };

  const handleCancel = () => {
    dispatch(close());
  };

  return (
    <div className="min-h-screen w-lg shadow-lg  bg-[#1E1E1E] text-white p-8">
      <h2 className="text-xl font-semibold mb-4">Project Description</h2>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Write a detailed description about the project..."
        className=" scrollbar-hide w-full h-96 p-4 bg-background text-white border border-gray-700 rounded-lg resize-none focus:outline-none  "
      />
      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition font-medium text-sm"
        >
          <XCircle size={16} />
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition font-medium text-sm"
        >
          <Save size={16} />
          {loading ? "Saving.." : "Save Description"}
        </button>
      </div>
    </div>
  );
};

export default ProjectDescription;
