import { useState } from "react";
import { Link, useParams } from "react-router-dom";

export const ChatNavbar = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const [copied, setCopied] = useState(false);

  const copyRoomId = () => {
    navigator.clipboard.writeText(meetingId || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <nav className="h-16 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-500 border-b border-blue-700 flex items-center justify-between px-6 shadow-lg">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <img className="w-10 h-10" src="/public/logo.png" alt="Chattique Logo" />
          <h1 className="text-2xl font-poppins font-bold text-white uppercase">
            Chattique
          </h1>
        </Link>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
          <span className="text-sm font-medium text-white/70">Room:</span>
          <span className="font-mono text-sm font-semibold text-white">
            Room:
          </span>
          <span className="font-mono text-sm font-semibold text-white">
            {meetingId}
          </span>
          <button
            onClick={copyRoomId}
            className="ml-2 px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded transition-all text-white"
            title="Copy Room ID"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      <button
        // onClick={onLeaveRoom}
       className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
      >
        Leave Room
      </button>
    </nav>
  );
};
