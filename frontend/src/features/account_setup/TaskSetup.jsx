import { useAccountSetup } from "./AccountSetupContext";

const TaskSetup = () => {
  const { setStep, projectName } = useAccountSetup();
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Left Section */}
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Collab</h1>

        {/* Input Fields */}
        <h2 className="text-lg font-semibold mb-4">
          What are a few tasks you have to do for
          <span className="text-gray-600"> {projectName}</span>?
        </h2>

        <input
          type="text"
          placeholder="e.g. Draft project brief"
          className="w-full px-4 py-2 mb-3 border rounded-lg focus:ring-2 focus:ring-gray-500"
        />
        <input
          type="text"
          placeholder="e.g. Draft project brief"
          className="w-full px-4 py-2 mb-3 border rounded-lg focus:ring-2 focus:ring-gray-500"
        />
        <input
          type="text"
          placeholder="e.g. Draft project brief"
          className="w-full px-4 py-2 mb-3 border rounded-lg focus:ring-2 focus:ring-gray-500"
        />

        {/* Continue Button */}
        <button
          onClick={() => setStep((step) => step + 1)}
          className="w-full mt-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default TaskSetup;
