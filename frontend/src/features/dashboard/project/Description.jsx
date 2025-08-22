import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { close, open, setActiveComponent } from "../../../app/slices/modal";
import { delay } from "../../../utils/delay";
import toast from "react-hot-toast";
import { marked } from "marked";
import { updateProjectDescription } from "../../../app/slices/project/projectThunk";

function Description({ currentProject }) {
  const { state } = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [openGenerateInput, setOpenGenerateInput] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  function stripMarkdown(md) {
    return md
      .replace(/!\[.*\]\(.*\)/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/[#_*~`>[\]()\-!\]]/g, "")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const descriptionText = currentProject?.description || "";
  const plainText = stripMarkdown(descriptionText);

  const words = plainText.split(" ").filter(Boolean);
  const wordLimit = 100;
  const isLong = words.length > wordLimit;

  function getTruncatedMarkdown(md, limit) {
    const plain = stripMarkdown(md);
    const wordArr = plain.split(" ").filter(Boolean);
    if (wordArr.length <= limit) return md;
    const truncated = wordArr.slice(0, limit).join(" ") + "...";
    return truncated;
  }
  const handleSaveDescription = async () => {
    setIsSaving(true);
    dispatch(
      updateProjectDescription({
        projectId: currentProject._id,
        description,
      })
    )
      .unwrap()
      .then(() => {
        setOpenGenerateInput((prev) => !prev);
        setIsGenerated(false);
        setIsSaving(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
        setIsSaving(false);
      });
  };

  const handleGenerateWithAI = async () => {
    setDescription("");
    setIsGenerating(true);
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URI}/api/v1/projects/ai/generate-project`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea: prompt }),
      }
    );
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      setDescription((prev) => prev + chunk);
    }
    setIsGenerating(false);
    setIsGenerated(true);
  };
  return (
    <>
      <div className="flex gap-4">
        <button
          onClick={() => setOpenGenerateInput((prev) => !prev)}
          className="px-4 py-2 cursor-pointer rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
        >
          {!openGenerateInput
            ? "Generate project description with AI"
            : "Cancel"}
        </button>
        {openGenerateInput && (
          <button
            onClick={handleGenerateWithAI}
            className="px-4 py-2 cursor-pointer rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>
        )}
      </div>

      {openGenerateInput && (
        <input
          type="text"
          placeholder="Enter project idea..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 w-full p-2.5 rounded-lg border border-gray-600 bg-[#1E1E1E] text-white placeholder-gray-500 focus:outline-none"
        />
      )}
      {openGenerateInput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#2A2A2A] border border-gray-700 p-6 rounded-2xl"
        >
          <div className="flex items-end justify-end">
            {isGenerating && <p1>...</p1>}
            {isGenerated && (
              <button
                onClick={handleSaveDescription}
                className="px-4 py-1 cursor-pointer rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
              >
                {isSaving ? "Saving" : "Save  "}
              </button>
            )}
          </div>
          <div
            className="prose text-gray-300 prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: marked(description) }}
          />
          {/* <p className="text-gray-300">{description}</p> */}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#2A2A2A] border border-gray-700 p-6 rounded-2xl"
      >
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold mb-2">Project Description</h2>
          <button
            className="flex items-center gap-1 text-sm text-blue-400 hover:underline"
            onClick={async () => {
              if (state) {
                dispatch(close());
                await delay(700);
              }
              dispatch(open());
              dispatch(setActiveComponent("set_project_description"));
            }}
          >
            <Pencil size={16} /> Edit
          </button>
        </div>
        <div
          className="prose text-gray-300 prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: marked(
              expanded || !isLong
                ? descriptionText
                : getTruncatedMarkdown(descriptionText, wordLimit)
            ),
          }}
        />
        {isLong && (
          <button
            className="cursor-pointer mt-2 px-3 py-1 rounded bg-blue-700 text-white text-sm hover:bg-blue-800"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Read Less" : "Read More"}
          </button>
        )}
      </motion.div>
    </>
  );
}

export default Description;
