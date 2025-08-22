import { Link } from "react-router";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CardContent } from "../components/CardContent";
import { useSelector } from "react-redux";

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-extrabold text-gray-700 tracking-tight">
            RemoteSync
          </h1>
          <div className="space-x-2">
            {!user ? (
              <>
                <Button className="text-white bg-gray-600 hover:bg-gray-700 transition text-sm px-4 py-2">
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="text-white bg-gray-600 hover:bg-gray-700 transition text-sm px-4 py-2">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            ) : (
              <Button className="text-white bg-gray-600 hover:bg-gray-700 transition text-sm px-4 py-2">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero + Features Section (Combined) */}
      <motion.section
        className="relative flex flex-col lg:flex-row items-center justify-center container mx-auto px-4 gap-4 flex-1 h-[calc(100vh-96px)]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute w-[400px] h-[400px] bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse top-[-150px] left-[-100px]" />
          <div className="absolute w-[300px] h-[300px] bg-purple-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse top-[50px] right-[-100px]" />
        </div>

        {/* Image */}
        <motion.div
          className="lg:w-1/2"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="https://static.nomensa.com/collaboration_eb16f9b754.jpg"
            alt="Team Collaboration"
            className="w-xl mx-auto rounded-xl"
          />
        </motion.div>

        {/* Text and Features */}
        <div className="lg:w-1/2 text-center lg:text-left space-y-3">
          <h2 className="text-2xl font-bold text-gray-800 leading-tight">
            Power Up Your <span className="text-gray-600">Team Workflow</span>
          </h2>
          <p className="text-sm text-gray-600">
            Create teams, assign tasks, and track projects — all in one place.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 text-sm transition">
              Get Started
            </Button>
          </motion.div>

          {/* Mini Feature Grid */}
          <div className="grid gap-4 md:grid-cols-2 mt-10">
            {[
              {
                title: "Team Management",
                description: "Create and manage teams with ease.",
              },
              {
                title: "Task Assignment",
                description: "Assign and track task progress.",
              },
              {
                title: "Project Tracking",
                description: "Visualize progress in real-time.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 250 }}
              >
                <Card className="rounded-xl p-4 shadow-md">
                  <CardContent>
                    <div className="flex items-center mb-2">
                      <CheckCircle className="text-gray-600 w-4 h-4 mr-2" />
                      <h4 className="text-sm font-semibold text-gray-800">
                        {feature.title}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-4 text-sm">
        <div className="container mx-auto px-4 text-center">
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-gray-400 font-semibold">RemoteSync</span>. All
          rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
