import { useNavigate } from "react-router";
const TeamInvite = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl w-full flex">
        {/* Left Section - Invitation Form */}
        <div className="w-1/2 pr-6">
          <h1 className="text-2xl font-semibold">
            Invite a teammate to try Asana together
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            You can start small by inviting a trusted teammate to learn how
            Asana works with you.
          </p>
          <div className="mt-4 space-y-3">
            {[...Array(4)].map((_, index) => (
              <input
                key={index}
                type="email"
                placeholder="Teammate’s email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            ))}
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full mt-4 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
          >
            Continue
          </button>
        </div>

        {/* Right Section - Project Preview */}
        <div className="w-1/2 pl-6 border-l">
          <h2 className="text-lg font-semibold mb-2">
            Cross-functional project plan
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <div className="border-b pb-2 mb-2 flex justify-between">
              <span className="font-semibold">Task name</span>
              <span className="font-semibold">Due date</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>✅ Draft project brief</span>
                <span className="text-green-600">Today - Jan 30</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>✅ Schedule kickoff meeting</span>
                <span className="text-yellow-600">Jan 29 - 31</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>✅ Share timeline with teammates</span>
                <span className="text-red-600">Jan 30 - Feb 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamInvite;
