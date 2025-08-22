import { UserPlus } from "lucide-react";
import { useState } from "react";
import api from "../../../api/axios";
import CircularLoader from "../../../components/CircularLoader";
import { toast } from "react-hot-toast";
function InviteMember({ teamId }) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const handleInvite = async () => {
    setIsInviting(true);
    try {
      await api.post(`/teams/${teamId}/invite`, {
        email: inviteEmail,
        role: inviteRole,
      });
      toast.success("Invitation sent successfully");
    } catch (error) {
      toast.error(error.response.message);
    }
    setIsInviting(false);
    setInviteEmail("");
  };

  return (
    <div className="bg-[#2A2A2A] border border-gray-700 rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <UserPlus size={20} /> Invite Member
      </h2>
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="email"
          placeholder="Enter email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-600 bg-[#1E1E1E] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={inviteRole}
          onChange={(e) => setInviteRole(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-600 bg-[#1E1E1E] text-white"
        >
          <option>Contributor</option>
          <option>Designer</option>
          <option>Developer</option>
          <option>Project Manager</option>
        </select>
        <button
          onClick={handleInvite}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white"
        >
          {isInviting ? <CircularLoader /> : "Invite"}
        </button>
      </div>
    </div>
  );
}

export default InviteMember;
