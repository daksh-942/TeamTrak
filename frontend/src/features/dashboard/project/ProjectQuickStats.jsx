import { CalendarCheck, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

function ProjectQuickStats() {
  const { projectTasks } = useSelector((state) => state.task);
  const completedProjects = projectTasks.reduce((acc, curr) => {
    console.log(curr);
    if (curr.status === "Completed") acc += 1;
    return acc;
  }, 0);
  const width = (completedProjects / projectTasks.length) * 100;
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-[#2A2A2A] p-6 rounded-2xl border border-gray-700"
    >
      <h2 className="text-lg font-semibold mb-2">Project Stats</h2>
      <div className="flex items-center gap-3">
        <ClipboardList size={18} className="text-blue-400" />
        <span>
          {completedProjects} / {projectTasks.length} tasks completed
        </span>
      </div>
      <div className="w-full mt-3 bg-gray-700 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full"
          style={{ width: `${width}%` }}
        ></div>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <CalendarCheck size={18} className="text-orange-400" />
        <span>Deadline: April 20</span>
      </div>
    </motion.div>
  );
}

export default ProjectQuickStats;
