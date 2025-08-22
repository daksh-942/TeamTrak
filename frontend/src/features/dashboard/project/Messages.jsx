import { useState } from "react";
import { Send } from "lucide-react";

// Dummy data for project members
const projectMembers = [
  { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "David", avatar: "https://i.pravatar.cc/150?img=4" },
  { id: 5, name: "Eve", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: 6, name: "Frank", avatar: "https://i.pravatar.cc/150?img=6" },
];

function MessagesPage() {
  const [selectedMember, setSelectedMember] = useState(projectMembers[0]);
  const [messages, setMessages] = useState({
    1: [{ text: "Hey, Alice! How's the project going?", type: "sent" }],
    2: [{ text: "Hi, Bob! Any updates?", type: "received" }],
    3: [{ text: "Hey, Charlie! Let's catch up.", type: "received" }],
  });
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages({
        ...messages,
        [selectedMember.id]: [
          ...messages[selectedMember.id],
          { text: newMessage, type: "sent" },
        ],
      });
      setNewMessage("");
    }
  };

  return (
    <div className="h-[26rem] bg-[#1A1A1A] text-gray-200 font-roboto flex">
      {/* Left - Project Members List */}
      <div className="w-[260px] bg-[#222] border-r border-white/10 p-3 rounded-l-xl flex flex-col">
        <h2 className="text-lg font-bold text-white mb-4">Members</h2>
        <div className="flex-1 overflow-y-auto">
          {projectMembers.map((member) => (
            <div
              key={member.id}
              className={`flex items-center gap-3 p-2 cursor-pointer rounded-md hover:bg-gray-700 transition-all ${
                selectedMember.id === member.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-400"
              }`}
              onClick={() => setSelectedMember(member)}
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm">{member.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right - Messages Area */}
      <div className="flex-1 bg-[#222] p-4 flex flex-col rounded-r-xl">
        {/* Header for selected member */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={selectedMember.avatar}
            alt={selectedMember.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <h2 className="text-lg font-semibold text-white">
            {selectedMember.name}
          </h2>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-[#333] p-3 rounded-md mb-4">
          {messages[selectedMember.id].map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === "sent" ? "justify-end" : "justify-start"
              } mb-3`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-md text-sm ${
                  message.type === "sent"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input Area */}
        <div className="bg-[#222] px-3 py-2 flex items-center gap-3 rounded-md border-t border-white/10">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-[#333] text-gray-200 border border-white/10 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white rounded-md px-3 py-1.5 hover:bg-blue-700 transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;
