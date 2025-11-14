import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { UserContext } from "../../../Context/Context";
const socket = io("http://localhost:5000");


interface Participants {
  userId: string;
  name: string;
}

interface ChatAreaProps {
  participants: Participants[];
  setparticipants: React.Dispatch<React.SetStateAction<Participants[]>>;
}

const ChatArea = ({ setparticipants }: ChatAreaProps) => {
  const { meetingId } = useParams();
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const { user  } = useContext(UserContext)!;

  useEffect(() => {
    if (!user) return;
    const userId = user._id;
   
    const name = user.name;
    socket.emit("join-room", { meetingId, userId, name });

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on("Connected-Users", (data) => {
      setparticipants(data);
    });
    return () => {
      socket.off("receive-message");
    };
  }, [meetingId, user]);

  const sendMessage = () => {
    socket.emit("send-message", { meetingId, message: newMessage });
    setNewMessage("");
  };
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <p key={idx}>{msg}</p>
        ))}
      </div>
      <div className="flex-shrink-0 border-t bg-white p-4">
        <div className="flex gap-2 items-center max-w-7xl mx-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 active:scale-95 flex items-center gap-2"
          >
            <span>Send</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
