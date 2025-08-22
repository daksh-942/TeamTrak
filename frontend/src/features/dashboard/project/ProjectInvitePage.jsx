//vaishvi.sisodiya28@gmail.com

import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { getProjectById } from "../../../app/slices/project/projectThunk";
import { UserIcon } from "lucide-react";

export default function ProjectInvitePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  // const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  let decoded = {};
  if (token) {
    decoded = jwtDecode(token);
    console.log(decoded);
  }

  const handleAccept = async () => {
    try {
      const res = await api.post("/projects/accept-invite", { token });
      const projectId = res.data.projectId;
      navigate(`/dashboard/projects/${projectId}/overview`);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data?.message);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing invitation token.");
      return;
    }
    // if (!user) {
    //   console.log("sending out because you are not logged in");
    //   navigate("/login");
    // }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-4">
            <UserIcon className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            {decoded.inviter} invites you
          </h2>
          <p className="text-gray-600 mb-2">
            to collaborate on{" "}
            <span className="font-medium">{decoded?.projectName}</span>
          </p>

          <button
            onClick={handleAccept}
            className="cursor-pointer mt-4 w-full bg-gray-800 hover:bg-gray-900 text-white py-2 px-6 rounded-lg transition"
          >
            Accept Invite
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          By accepting, you agree to our{" "}
          <a href="/terms" className="underline">
            Terms
          </a>{" "}
          &{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
