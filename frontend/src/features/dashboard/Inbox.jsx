// import React from 'react';

// const InboxPage = () => {
//   return (
//     <div className="flex h-screen bg-gray-1000 text-white">
//       {/* Sidebar removed */}

//       {/* Main Content */}
//       <main className="flex-1 p-6 flex flex-col w-full">
//         {/* Header */}
//         <div className="flex justify-between items-center border-b border-gray-500 pb-4 mb-4">
//           <h1 className="text-2xl font-semibold">Inbox</h1>
//           <input
//             type="text"
//             placeholder="Search"
//             className="bg-gray-500 text-white px-4 py-2 rounded border border-gray-500 w-72"
//           />
//         </div>

//         {/* Tabs */}
//         <div className="flex items-center space-x-6 mb-6 text-sm font-medium">
//           <button className="text-blue-400 border-b-2 border-blue-500 pb-2">Activity</button>
//           <button className="text-gray-400 hover:text-white">Archive</button>
//           <button className="text-gray-400 hover:text-white">Messages I’ve sent</button>
//           <div className="ml-auto space-x-4">
//             <button className="hover:underline text-sm text-gray-400">Manage notifications</button>
//             <button className="hover:underline text-sm text-gray-400">⋯</button>
//           </div>
//         </div>

//         {/* Notification List */}
//         <div className="flex-1 flex">
//           {/* Left side - List */}
//           <div className="w-1/2 space-y-4 pr-6">
//             <div className="bg-gray-600 p-4 rounded hover:bg-gray-700 cursor-pointer">
//               <p className="font-semibold">📣 Teamwork makes work happen!</p>
//               <p className="text-gray-400 text-sm mt-1">
//                 Inbox is where you get updates, notifications, and messages from your teammates.
//               </p>
//             </div>
//             <button className="text-blue-500 text-sm hover:underline">Archive all notifications</button>
//           </div>

//           {/* Right side - Empty State */}
//           <div className="flex-1 flex flex-col items-center justify-center text-center">
//             <div className="text-6xl mb-4">🔔</div>
//             <h2 className="text-lg font-medium mb-2">Inbox is where you get updates, notifications, and messages from your teammates.</h2>
//             <p className="mb-4">Send an invite to start collaborating.</p>
//             <button className="bg-blue-600 px-4 py-2 rounded">Invite teammates</button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default InboxPage;

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, User2 } from "lucide-react";

const dummyMessages = {
  received: [
    {
      id: 1,
      from: "Ayesha",
      message: "Hey, can you check the UI for Project Beta?",
      time: "2h ago",
    },
    {
      id: 2,
      from: "Raj",
      message: "We need to finalize the backend APIs by tomorrow.",
      time: "1d ago",
    },
  ],
  sent: [
    {
      id: 3,
      to: "Dev Team",
      message: "Please update the GitHub repo by EOD.",
      time: "3h ago",
    },
    {
      id: 4,
      to: "Ayesha",
      message: "Sure! I'll check and get back to you soon.",
      time: "22h ago",
    },
  ],
};

export default function Inbox() {
  const [activeTab, setActiveTab] = useState("received");

  const messages = dummyMessages[activeTab];

  return (
    <motion.div
      className="max-w-5xl mx-auto px-6 py-10 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center gap-2 mb-8">
        <Mail className="text-blue-400" />
        <h1 className="text-2xl font-bold">Inbox</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("received")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === "received"
              ? "bg-blue-600"
              : "bg-[#2A2A2A] border border-gray-700 hover:bg-gray-800"
          }`}
        >
          Received
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === "sent"
              ? "bg-blue-600"
              : "bg-[#2A2A2A] border border-gray-700 hover:bg-gray-800"
          }`}
        >
          Sent
        </button>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm">No messages found.</p>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              className="bg-[#1E1E1E] p-4 rounded-xl border border-gray-700 hover:border-blue-500 transition-all"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-center mb-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <User2 size={16} />
                  {activeTab === "received" ? (
                    <span className="font-medium text-white">{msg.from}</span>
                  ) : (
                    <span className="font-medium text-white">To: {msg.to}</span>
                  )}
                </div>
                <span className="text-xs">{msg.time}</span>
              </div>
              <p className="text-gray-300">{msg.message}</p>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
