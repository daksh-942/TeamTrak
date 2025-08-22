import { useAccountSetup } from "./AccountSetupContext";

const ProjectSetup = () => {
  const { projectName, setProjectName, setStep } = useAccountSetup();

  const handleInputChange = (e) => {
    setProjectName(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      {/* Card Container */}
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Let&apos;s set up your first project
        </h2>

        {/* Input Field */}
        <div className="mb-6">
          <label className="block text-gray-600 text-sm mb-2">
            What&apos;s something you and your team are currently working on?
          </label>
          <input
            type="text"
            placeholder="e.g. Cross-functional project plan"
            value={projectName}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={() => setStep((step) => step + 1)}
          className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ProjectSetup;
