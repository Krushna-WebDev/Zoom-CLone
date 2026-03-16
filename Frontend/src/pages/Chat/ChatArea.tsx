import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../Context/Context";
import { SocketContext } from "../../../Context/SocketContext";
// TODO :- load previous 15 msg in chat
interface Participants {
  userId: string;
  name: string;
  profilePic: string;
}

interface ChatAreaProps {
  participants: Participants[];
  setparticipants: React.Dispatch<React.SetStateAction<Participants[]>>;
}

interface joinMsg {
  type: "join";
  user: string;
}

interface leaveMsg {
  type: "leave";
  user: string;
}
interface ChatMsg {
  type: "Msg";
  user: string;
  text: string;
  userId: string;
  Time: string;
}

interface recentMsfinterface {
  senderId: string;
  senderName: string;
  text: string;
  time: string;
}

type Message = joinMsg | leaveMsg | ChatMsg;
const ChatArea = ({ participants, setparticipants }: ChatAreaProps) => {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [Newtext, setNewtext] = useState("");
  const inputref = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { user, setIsCaller, token } = useContext(UserContext)!;
  const socket = useContext(SocketContext)!;

  useEffect(() => {
    inputref.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join room + listeners
  useEffect(() => {
    if (!user) return;
    if (!socket) return;

    socket.emit("join-room", {
      meetingId,
      name: user.name,
    });

    socket.on("userJoined", (msg: joinMsg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("receive-message", (msg: ChatMsg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on("userLeft", (msg: leaveMsg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on("Connected-Users", (data) => {
      setIsCaller(data.adminUserId);
      setparticipants(data.users);
    });

    return () => {
      socket.off("userJoined");
      socket.off("receive-message");
      socket.off("userLeft");
      socket.off("Connected-Users");
    };
  }, [meetingId, user, socket]);

  // Leave confirmation → redirect
  useEffect(() => {
    if (!socket) return;
    socket.on("left-room-success", () => {
      navigate("/");
    });
    return () => {
      socket.off("left-room-success");
    };
  }, []);

  const sendMessage = () => {
    if (!socket) return;
    const text = Newtext.trim();
    if (!text) return;
    socket.emit("send-message", {
      meetingId,
      message: Newtext,
    });
    setNewtext("");
    inputref.current?.focus();
  };
  useEffect(() => {
    const fetchRecent = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/v1/meeting/fetchRecentMsg/${meetingId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setMessages(res.data);
    };

    if (meetingId && token) {
      fetchRecent();
    }
  }, [meetingId, token]);
  return (
    <div className="flex h-full min-h-0 flex-col bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)]">
    

      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-5">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 sm:gap-4">
        {messages.map((msg, idx) => {
          if (msg.type === "join") {
            const m = msg as joinMsg;
            return (
              <div
                key={`join-${idx}`}
                className="flex w-full justify-center"
              >
                <div className="flex max-w-full items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-center shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3 h-3 text-emerald-600"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>

                  <span className="text-xs font-medium text-emerald-800">
                    <span className="mr-1 font-bold">{m.user}</span>
                    joined the room
                  </span>
                </div>
              </div>
            );
          } else if (msg.type === "leave") {
            const m = msg as leaveMsg;
            return (
              <div
                key={`leave-${idx}`}
                className="flex w-full justify-center opacity-90"
              >
                <div className="flex max-w-full items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-center shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3 h-3 text-rose-500"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>

                  <span className="text-xs font-medium text-rose-800">
                    <span className="mr-1 font-bold">{m.user}</span>
                    left the room
                  </span>
                </div>
              </div>
            );
          } else if (msg.type === "Msg") {
            //  (ME)
            if (msg.userId === user?._id) {
              const msgTime = new Date(msg.Time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <div key={`msg-${idx}`} className="flex justify-end">
                  <div className="w-fit max-w-[88%] rounded-[20px] rounded-br-md bg-[linear-gradient(135deg,#2563eb_0%,#1d4ed8_100%)] px-3.5 py-3 text-white shadow-[0_12px_30px_rgba(37,99,235,0.22)] sm:max-w-[min(70%,420px)] sm:px-4">
                    <p className="text-sm leading-relaxed break-words">
                      {msg.text}
                    </p>
                    <div className="mt-2 text-right text-[10px] text-blue-100/80">
                      {msgTime}
                    </div>
                  </div>
                </div>
              );
            }
            // others
            else {
              const msgTime = new Date(msg.Time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <div key={`msg-${idx}`} className="flex justify-start">
                  <div className="w-fit max-w-[88%] rounded-[20px] rounded-bl-md border border-slate-200 bg-white px-3.5 py-3 text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.08)] sm:max-w-[min(70%,420px)] sm:px-4">
                    <p className="mb-1 text-xs font-semibold text-slate-500">
                      {msg.user}
                    </p>
                    <p className="text-sm leading-relaxed break-words">
                      {msg.text}
                    </p>
                    <div className="mt-2 text-right text-[10px] text-slate-500">
                      {msgTime}
                    </div>
                  </div>
                </div>
              );
            }
          }
          return null;
        })}
          {messages.length === 0 && (
            <div className="flex flex-1 items-center justify-center py-12 sm:py-16">
              <div className="max-w-sm rounded-3xl border border-slate-200 bg-white/80 px-6 py-8 text-center shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:px-8 sm:py-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Start the conversation
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Messages, join updates, and room activity will appear here.
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-slate-200/80 bg-white/90 px-3 py-3 backdrop-blur sm:px-6 sm:py-4">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_14px_34px_rgba(15,23,42,0.08)] sm:flex-row sm:items-end sm:rounded-[28px]">
          <input
            type="text"
            ref={inputref}
            value={Newtext}
            onChange={(e) => setNewtext(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type a message..."
            aria-label="Message"
            autoComplete="off"
            className="min-h-[50px] w-full flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:min-h-[52px]"
          />
          <button
            onClick={sendMessage}
            type="button"
            disabled={!Newtext.trim()}
            className={`flex h-[50px] w-full items-center justify-center gap-2 rounded-2xl px-5 font-semibold transition-all duration-300 active:scale-95 sm:h-[52px] sm:w-auto
             ${
               Newtext.trim()
                 ? "cursor-pointer bg-blue-600 text-white shadow-[0_12px_28px_rgba(37,99,235,0.24)] hover:bg-blue-700"
                 : "cursor-not-allowed bg-slate-200 text-slate-400"
             }`}
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
