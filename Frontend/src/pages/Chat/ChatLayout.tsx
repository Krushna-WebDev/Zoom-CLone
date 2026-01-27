import React, { useContext, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import { ChatNavbar } from "./ChatNavbar";
import VideoCall from "../Video/VideoCall";
import { UserContext } from "../../../Context/Context";
import { useNavigate } from "react-router-dom";

interface Participant {
  userId: string;
  name: string;
  profilePic:string
}

const ChatLayout = () => {
  const [participants, setparticipants] = useState<Participant[]>([]);
  const { token, isLoading } = useContext(UserContext)!;
  const [mode, setMode] = useState<"chat" | "video">("chat");

  const navigate = useNavigate();
  console.log("token in layout", token);
  useEffect(() => {
    if (!isLoading && !token) {
      navigate("/notfound");
    }
  }, [isLoading, token, navigate]);
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <ChatNavbar />

      <div className="flex items-center gap-4 px-6 py-4 border-b bg-white flex-shrink-0">
        <div className="text-sm font-medium text-gray-700">View</div>

        <div className="inline-flex bg-gray-200 rounded-full p-1">
          <button
            type="button"
            onClick={() => setMode("chat")}
            aria-pressed={mode === "chat"}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              mode === "chat"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Chat
          </button>

          <button
            type="button"
            onClick={() => setMode("video")}
            aria-pressed={mode === "video"}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              mode === "video"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Video
          </button>
        </div>
      </div>

      <div className="flex flex-1 bg-gray-50 overflow-hidden">
        <div className="w-70 flex-shrink-0 overflow-hidden">
          <Sidebar participants={participants} />
        </div>

        <div className="flex-1 overflow-hidden">
          {mode === "chat" ? (
            <ChatArea
              participants={participants}
              setparticipants={setparticipants}
            />
          ) : (
            <VideoCall />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
