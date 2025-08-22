import { motion } from "framer-motion";
import { Crown, FolderKanban, Users } from "lucide-react";

function ProjectOverviewCards({ teams, projects }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 * 0 }}
        className="bg-[#2A2A2A] p-5 rounded-2xl border border-gray-700 flex flex-col gap-2 hover:shadow-lg"
      >
        <div className="flex items-center gap-3">
          <FolderKanban size={20} className="text-blue-400" />
          <span className="text-sm text-gray-400">Total Projects</span>
        </div>
        <h2 className="text-2xl font-bold">{projects.total}</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 * 1 }}
        className="bg-[#2A2A2A] p-5 rounded-2xl border border-gray-700 flex flex-col gap-2 hover:shadow-lg"
      >
        <div className="flex items-center gap-3">
          <Crown size={20} className="text-yellow-400" />
          <span className="text-sm text-gray-400">Owned Projects</span>
        </div>
        <h2 className="text-2xl font-bold">{projects.owned}</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 * 2 }}
        className="bg-[#2A2A2A] p-5 rounded-2xl border border-gray-700 flex flex-col gap-2 hover:shadow-lg"
      >
        <div className="flex items-center gap-3">
          <Users size={20} className="text-pink-400" />
          <span className="text-sm text-gray-400">Collaborating on</span>
        </div>
        <h2 className="text-2xl font-bold">
          {projects.total - projects.owned}
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 * 3 }}
        className="bg-[#2A2A2A] p-5 rounded-2xl border border-gray-700 flex flex-col gap-2 hover:shadow-lg"
      >
        <div className="flex items-center gap-3">
          <FolderKanban size={20} className="text-blue-400" />
          <span className="text-sm text-gray-400">Total teams</span>
        </div>
        <h2 className="text-2xl font-bold">{teams.total}</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 * 4 }}
        className="bg-[#2A2A2A] p-5 rounded-2xl border border-gray-700 flex flex-col gap-2 hover:shadow-lg"
      >
        <div className="flex items-center gap-3">
          <Crown size={20} className="text-yellow-400" />
          <span className="text-sm text-gray-400">Owned teams</span>
        </div>
        <h2 className="text-2xl font-bold">{teams.owned}</h2>
      </motion.div>
    </>
  );
}

export default ProjectOverviewCards;
