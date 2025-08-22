import { motion } from "framer-motion";
import { CheckCircle, Lightbulb } from "lucide-react";
import { useAccountSetup } from "./AccountSetupContext";
import { useState } from "react";

const GetStarted = () => {
  const { step, setStep } = useAccountSetup();
  const [selectedOption, setSelectedOption] = useState(null);
  const options = [
    {
      id: 1,
      icon: <CheckCircle className="text-green-500" />,
      title: "Create new work",
      description: "Create a project or tasks from scratch.",
    },
    {
      id: 2,
      icon: <Lightbulb className="text-yellow-500" />,
      title: "See personalized examples",
      description: "See what a great project looks like.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6">
        How would you like to get started?
      </h1>
      <div className="w-full max-w-md space-y-4">
        {options.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedOption(option.id)}
            className={`cursor-pointer flex items-center p-4 border rounded-lg shadow-sm transition-all ${
              selectedOption === option.id
                ? "border-blue-500 bg-blue-50"
                : "bg-white"
            }`}
          >
            <div className="mr-4">{option.icon}</div>
            <div>
              <h3 className="text-lg font-medium">{option.title}</h3>
              <p className="text-sm text-gray-600">{option.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <button
        className={`mt-6 px-6 py-2 text-white font-medium rounded-lg ${
          step
            ? "bg-gray-500 hover:bg-gray-600"
            : "bg-gray-300 cursor-not-allowed"
        }`}
        disabled={!step}
        onClick={() => setStep((step) => step + 1)}
      >
        Continue
      </button>
    </div>
  );
};

export default GetStarted;
