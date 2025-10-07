import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");
// interface Message {
//   id: number;
//   text: string;
//   sender: string;
//   timestamp: string;
//   isSelf: boolean;
// }

interface UserInterface {
  _id: string;
  email: string;
  username: string;
}

interface Participants {
  userId: string;
  username: string;
}

interface ChatAreaProps {
  participants: Participants[];
  setparticipants: React.Dispatch<React.SetStateAction<Participants[]>>;
}

const ChatArea = ({ participants, setparticipants }: ChatAreaProps) => {
  const { meetingId } = useParams();
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<UserInterface | null>();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/user/getuser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [token]);

  useEffect(() => {
    if (!user) return;
    const userId = user._id;
    const username = user.username;
    socket.emit("join-room", { meetingId, userId, username });

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
    setNewMessage(" ");
  };
  return (
    <div className="h-screen flex flex-col">
      <header className="flex-shrink-0 mx-auto w-full px-4 py-5 font-raleway flex items-center justify-between bg-white border-b ">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-800">Room ID:</h1>
          <span className="bg-gray-100 px-3 py-1 rounded-md text-gray-600 font-mono">
            {meetingId}
          </span>
        </div>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 active:scale-95 flex items-center gap-2">
          <span>Leave Room</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </header>{" "}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <p key={idx}>{msg}</p>
        ))}
      </div>
      <div className="flex-shrink-0 border-t bg-white p-4">
        <div className="flex gap-2 items-center max-w-7xl mx-auto">
          <input
            type="text"
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
