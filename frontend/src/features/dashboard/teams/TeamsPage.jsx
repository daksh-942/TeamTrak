import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import SplashScreen from "../../../components/SplashScreen";
import { getCurrentTeam } from "../../../app/slices/team/teamSlice";
import Members from "./Members";
import Timeline from "../../../components/Timeline";
import InviteMember from "./InviteMember";
import { Settings } from "lucide-react";

export default function TeamsPage() {
  const { teamId } = useParams();
  const dispatch = useDispatch();
  const { currentTeam } = useSelector((state) => state.team);

  useEffect(() => {
    dispatch(getCurrentTeam(teamId));
  }, [dispatch, teamId]);

  if (!currentTeam) return <SplashScreen />;
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-white space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex gap-4">
          <span>{currentTeam.name}</span>{" "}
          <Link
            className="flex items-center justify-center"
            to="/dashboard/teams/settings"
          >
            {<Settings size={16} />}
          </Link>
        </h1>
        <p className="text-gray-400">Manage your team and collaborators</p>
        <p className="text-sm text-gray-500">
          Total Members:
          <span className="font-semibold text-white">
            {currentTeam.members.length}
          </span>
        </p>
      </div>

      <InviteMember teamId={currentTeam._id} />

      <Members members={currentTeam.members} />

      <Timeline activities={currentTeam.activityLogs} />
    </div>
  );
}
