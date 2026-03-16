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
  const [showParticipants, setShowParticipants] = useState(false);

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
        <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-white px-4 py-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
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

          <button
            type="button"
            onClick={() => setShowParticipants((prev) => !prev)}
            className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 lg:hidden"
          >
            {showParticipants ? "Hide People" : "Show People"}
          </button>
        </div>
      )}

      <div
        className={`relative flex flex-1 min-h-0 overflow-hidden ${
          mode === "video" ? "bg-slate-950" : "bg-gray-50"
        }`}
      >
        {mode === "video" && (
          <div className="absolute left-3 top-2 z-20 flex items-center gap-2 rounded-full bg-white/10 p-1 text-xs font-semibold text-white backdrop-blur sm:left-4 sm:top-4">
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
          <div
            className={`${
              showParticipants ? "flex" : "hidden"
            } absolute inset-0 z-10 bg-white lg:static lg:z-0 lg:flex lg:w-70 lg:flex-shrink-0 lg:overflow-hidden`}
          >
            <Sidebar participants={participants} />
          </div>
        )}

        <div
          className={`flex-1 overflow-hidden ${
            mode === "chat" && showParticipants ? "hidden lg:block" : ""
          }`}
        >
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
