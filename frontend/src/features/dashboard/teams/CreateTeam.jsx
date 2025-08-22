import { useDispatch, useSelector } from "react-redux";
import { close } from "../../../app/slices/modal";
import { useState } from "react";
import { createTeam } from "../../../app/slices/team/teamThunk";
import { toast } from "react-hot-toast";
import CircularLoader from "../../../components/CircularLoader";
import { useNavigate } from "react-router";

export default function CreateTeam() {
  const dispatch = useDispatch();
  const [teamName, setTeamName] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const navigate = useNavigate();
  const { isCreating } = useSelector((state) => state.team);

  const handleTeamCreation = async () => {
    await dispatch(createTeam({ name: teamName, description: teamDesc }))
      .unwrap()
      .then((team) => {
        toast.success("Team created successfully");
        navigate(`/dashboard/teams/${team._id}`);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
    dispatch(close());
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-2 py-8">
      <div className="w-full max-w-2xl bg-[#1E1E1E]/80 backdrop-blur-md shadow-2xl border border-gray-700 text-white p-4 sm:p-8 rounded-2xl">
        <h1 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-center">
          Create a New Team
        </h1>

        <div className="mb-4 sm:mb-6">
          <label className="block text-gray-400 mb-2" htmlFor="teamName">
            Team Name
          </label>
          <input
            type="text"
            id="teamName"
            className="w-full bg-[#2A2A2A] border border-gray-600 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
            placeholder='For example: "My first Team" or "Backend Team"'
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>
        <div className="mb-4 sm:mb-6">
          <label className="block text-gray-400 mb-2" htmlFor="teamDesc">
            Team Description
          </label>
          <textarea
            id="teamDesc"
            className="w-full bg-[#2A2A2A] border border-gray-600 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
            value={teamDesc}
            onChange={(e) => setTeamDesc(e.target.value)}
            rows={3}
            placeholder="Describe your team..."
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end mt-6 sm:mt-8">
          <button
            className="cursor-pointer w-full sm:w-auto bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 sm:py-2.5 sm:px-5 rounded-lg transition-all text-sm sm:text-base"
            onClick={() => dispatch(close())}
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleTeamCreation}
            className="cursor-pointer w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 sm:py-2.5 sm:px-5 rounded-lg transition-all text-sm sm:text-base"
            type="button"
          >
            {isCreating ? <CircularLoader /> : "Create Team"}
          </button>
        </div>
      </div>
    </div>
  );
}