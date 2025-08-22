import { jwtDecode } from "jwt-decode";
import { Link, useNavigate, useSearchParams } from "react-router";
import api from "../../../api/axios";
import { useEffect, useState } from "react";
import CircularLoader from "../../../components/CircularLoader";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function TeamInvitePage() {
  const { user } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isAccepting, setIsAccepting] = useState(false);
  const navigate = useNavigate();
  let decoded = {};
  if (token) {
    decoded = jwtDecode(token);
  }

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      const res = await api.post("/teams/accept-invite", { token });
      console.log(res);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
    setIsAccepting(false);
  };

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing invitation token.");
      return;
    }
    if (!user) {
      navigate("/login");
    }
  }, [token, navigate, user]);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex flex-col">
      <header className="w-full px-6 py-4 border-b border-gray-700 bg-[#1A1A1A] shadow-sm">
        <Link to="/" className="text-2xl font-bold text-white">
          RemoteSync
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-lg bg-[#262626] rounded-2xl shadow-md border border-gray-700 p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <p className="w-16 h-16 rounded-full border text-2xl font-bold border-gray-500 flex items-center justify-center">
              <span>{decoded.teamName.split("")[0]}</span>
            </p>
            <div>
              <h2 className="text-xl font-semibold">{decoded.teamName}</h2>
              <p className="text-gray-400 text-sm">
                A team focused on frontend excellence.
              </p>
            </div>
          </div>

          <div className="text-gray-300 text-sm">
            <p>
              <span className="text-white font-medium">{decoded.inviter}</span>{" "}
              has invited you to join this team as a {decoded.role}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            {/* <button className="cursor-pointer px-4 py-2 border border-gray-500 rounded-md hover:bg-gray-700 transition">
              Decline
            </button> */}
            <button
              onClick={handleAccept}
              className="cursor-pointer px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
            >
              {isAccepting ? <CircularLoader /> : "Accept"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
