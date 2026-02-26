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
  useEffect(() => {
    if (!isLoading && !token) {
      navigate("/notfound");
    }
  }, [isLoading, token, navigate]);
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {mode === "chat" && <ChatNavbar />}

      {mode === "chat" && (
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
      )}

      <div
        className={`relative flex flex-1 min-h-0 overflow-hidden ${
          mode === "video" ? "bg-slate-950" : "bg-gray-50"
        }`}
      >
        {mode === "video" && (
          <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full bg-white/10 p-1 text-xs font-semibold text-white backdrop-blur">
            <button
              type="button"
              onClick={() => setMode("chat")}
              className="rounded-full px-3 py-1 transition hover:bg-white/10"
            >
              Chat
            </button>
            <span className="h-3 w-px bg-white/20" />
            <button
              type="button"
              onClick={() => setMode("video")}
              className="rounded-full bg-white/20 px-3 py-1"
            >
              Video
            </button>
          </div>
        )}
        {mode === "chat" && (
          <div className="w-70 flex-shrink-0 overflow-hidden">
            <Sidebar participants={participants} />
          </div>
        )}

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
