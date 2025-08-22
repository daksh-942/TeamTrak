import { ChevronDown, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { useState } from "react";

function ProjectResourcesQuickView({ files }) {
  const [isResourcesOpen, setIsResourcesOpen] = useState(true);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-[#2A2A2A] p-6 rounded-2xl border border-gray-700"
    >
      {files.length === 0 ? (
        <p>No files currently.</p>
      ) : (
        <>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsResourcesOpen(!isResourcesOpen)}
          >
            <h2 className="text-lg font-semibold">Resources</h2>
            {isResourcesOpen ? <ChevronDown /> : <ChevronRight />}
          </div>
          {isResourcesOpen && (
            <ul className="space-y-3 mt-4 text-blue-400">
              {files.map((file) => (
                <li
                  key={file._id}
                  className="flex items-center gap-2 hover:underline"
                >
                  <Link size={16} />
                  {/* <a href={res.url} target="_blank" rel="noopener noreferrer">
                    {res.label}
                  </a> */}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </motion.div>
  );
}

export default ProjectResourcesQuickView;
