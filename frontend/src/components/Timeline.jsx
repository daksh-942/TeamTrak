import { format } from "date-fns";
import { motion } from "framer-motion";
import { Link } from "react-router";
function Timeline({ activities }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-[#2A2A2A] p-6 rounded-2xl border border-gray-700 max-h-90 overflow-y-scroll no-scrollbar"
    >
      <h2 className="text-lg font-semibold mb-4">Activity Timeline</h2>
      <div className="border-l border-gray-600 pl-4 space-y-6 text-sm text-gray-300">
        {activities
          .slice()
          .reverse()
          .map((activity) => (
            <div key={activity._id} className="relative">
              <span className="w-2 h-2 bg-pink-400 rounded-full absolute -left-5 top-1" />
              {activity.name && (
                <Link
                  to={`/dashboard/teams/${activity.id}`}
                  className="font-bold underline"
                >
                  {activity.name}
                </Link>
              )}
              <p>{activity.message}</p>
              <p className="text-xs text-gray-500">
                {format(new Date(activity.createdAt), "MMM d, yyyy")}
              </p>
            </div>
          ))}
      </div>
    </motion.div>
  );
}

export default Timeline;
