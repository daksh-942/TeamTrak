import { CalendarCheck, ShieldCheck, User } from "lucide-react";
import { format } from "date-fns";
function Member({ member }) {
  return (
    <div className="bg-[#2A2A2A] border border-gray-700 p-5 rounded-xl space-y-3">
      <div className="flex items-center gap-3">
        <User className="text-pink-400" />
        <div>
          <p className="font-semibold">{`${member.user.firstname} ${member.user.lastname}`}</p>
          <p className="text-sm text-gray-400">{member.role}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <CalendarCheck size={16} />
        Joined on {format(new Date(member.joined), "MMM d, yyyy")}
      </div>
      <div className="flex items-center gap-2 text-sm">
        <ShieldCheck size={16} className="text-green-400" />
        <span className="text-gray-300">{member.user.email}</span>
      </div>
    </div>
  );
}

export default Member;
