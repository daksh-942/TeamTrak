import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
function Members({ currentProject }) {
  const [isMembersOpen, setIsMembersOpen] = useState(true);
  const [isInviting, setIsInviting] = useState(false);
  const [newMember, setNewMember] = useState("");

  const handleAddMember = async () => {
    setIsInviting(true);
    const memberData = {
      email: newMember.trim(),
    };

    try {
      const res = await api.post(
        `/projects/${currentProject._id}/invite`,
        memberData
      );
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }

    setIsInviting(false);
    setNewMember("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="p-6 rounded-2xl"
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsMembersOpen(!isMembersOpen)}
      >
        <h2 className="text-lg font-semibold">Project Members</h2>
        {isMembersOpen ? <ChevronDown /> : <ChevronRight />}
      </div>
      {isMembersOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="space-y-3 mt-4">
            {currentProject.members.map((member) => (
              <div key={member._id} className="flex items-center gap-3">
                <User size={18} className="text-pink-400" />
                <span>{member.user.firstname}</span>
                <span className="ml-auto text-sm text-gray-400 italic">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-6">
            <input
              type="email"
              placeholder="Enter email"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              className="cursor-pointer flex-1 p-2.5 rounded-lg border border-gray-600 bg-[#1E1E1E] text-white placeholder-gray-500 focus:outline-none"
            />
            <button
              onClick={handleAddMember}
              className="cursor-pointer px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
              disabled={isInviting}
            >
              {isInviting ? "Inviting..." : "Invite"}
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Members;
