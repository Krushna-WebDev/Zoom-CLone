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
    <nav className="border-b border-blue-700 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-500 shadow-lg">
      <div className="flex flex-col gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:flex-row lg:items-center lg:justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <img
            className="h-10 w-10 rounded-xl object-cover shadow-sm"
            src="/public/logo.png"
            alt="Chattique Logo"
          />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-100/80">
              Meeting Space
            </p>
            <h1 className="truncate text-xl font-poppins font-bold uppercase text-white sm:text-2xl">
              Chattique
            </h1>
          </div>
        </Link>

        <button
          type="button"
          onClick={copyRoomId}
          title="Copy Room ID"
          className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-left backdrop-blur-sm transition-all hover:bg-white/15 sm:px-4"
        >
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/80">
              Room Id
            </p>
            <p className="truncate font-mono text-xs font-semibold text-white sm:text-sm">
              {meetingId}
            </p>
          </div>
          <span className="shrink-0 rounded-xl bg-white/20 px-3 py-2 text-xs font-semibold text-white">
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
      </div>
    </nav>
  );
};
