import { X } from "lucide-react";
import { motion } from "framer-motion";
function NewTask({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-end justify-end overflow-hidden right-10">
      <motion.div
        className="bg-[#2a2b2d] text-white p-4 rounded-xl shadow-lg w-96"
        initial={{ y: 100, opacity: 0 }} // Start off-screen (below)
        animate={{ y: 0, opacity: 1 }} // Slide up into view
        exit={{ y: 100, opacity: 0 }} // Slide down when closing
        transition={{ duration: 0.4, ease: "easeOut" }} // Smooth transition
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">New Task</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Task name"
            className="w-full p-2 transparent font-semibold rounded text-2xl text-white outline-none"
          />
          <div className="flex gap-2">
            <div className="p-2">For</div>
            <select className="w-1/2 p-2  rounded text-white outline-none ">
              <option>Assignee</option>
            </select>
            <div className="p-2">in</div>
            <select className="w-1/2 p-2 rounded text-white outline-none ">
              <option>Project</option>
            </select>
          </div>
          <textarea
            placeholder="Task description"
            className="w-full p-2 transparent rounded text-white outline-none resize-none"
            rows="3"
          />
        </div>
        <div className="mt-4">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition">
            Create Task
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default NewTask;