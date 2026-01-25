import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../Context/Context";
import { SocketContext } from "../../../Context/SocketContext";
// TODO :- load previous 15 msg in chat
interface Participants {
  userId: string;
  name: string;
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
}

type Message = joinMsg | leaveMsg | ChatMsg;
const ChatArea = ({ setparticipants }: ChatAreaProps) => {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const inputref = useRef<HTMLInputElement | null>(null);
  const { user, setIsCaller } = useContext(UserContext)!;
  const socket = useContext(SocketContext)!;

  useEffect(() => {
    inputref.current?.focus();
  }, []);

  // Join room + listeners
  useEffect(() => {
    if (!user) return;
    if (!socket) return;

    socket.emit("join-room", {
      meetingId,
      userId: user._id,
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

  // todo use of role to send offer

  // useEffect(() => {
  //   socket.on("role", ({ isCaller }) => {
  //     console.log("caller", isCaller);
  //   });
  // }, [socket]);

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
    const text = newMessage.trim();
    if (!text) return;
    socket.emit("send-message", {
      meetingId,
      message: newMessage,
      userId: user?._id,
    });
    setNewMessage("");
    inputref.current?.focus();
  };

  const LeaveRoom = () => {
    if (!socket) return;
    socket.emit("leave-room", meetingId);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          if (msg.type === "join") {
            const m = msg as joinMsg;
            return (
              <div
                key={`join-${idx}`}
                className="flex justify-center w-full my-3"
              >
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full shadow-sm">
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

                  <span className="text-xs text-emerald-800">
                    <span className="font-bold mr-1">{m.user}</span>
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
                className="flex justify-center w-full my-3 opacity-80"
              >
                <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full">
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

                  <span className="text-xs text-rose-800">
                    <span className="font-bold mr-1">{m.user}</span>
                    left the room
                  </span>
                </div>
              </div>
            );
          } else if (msg.type === "Msg") {
            //  (ME)
            if (msg.userId === user?._id) {
              return (
                <div key={`msg-${idx}`} className="flex justify-end mb-4">
                  <div className="max-w-[75%] px-4 py-2 rounded-2xl rounded-tr-sm bg-blue-600 text-white shadow-md">
                    <p className="text-sm leading-relaxed break-words">
                      {msg.text}
                    </p>

                    {/* Optional: Agar msg object me time hai to uncomment karein */}
                    {/* <div className="text-[10px] text-blue-100 opacity-70 text-right mt-1">
            10:30 AM
          </div> 
          */}
                  </div>
                </div>
              );
            }
            // others
            else {
              return (
                <div key={`msg-${idx}`} className="flex justify-start mb-4">
                  <div className="max-w-[75%] px-4 py-2 rounded-2xl rounded-tl-sm bg-white border border-gray-200 text-gray-800 shadow-sm">
                    <p className="text-sm leading-relaxed break-words">
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            }
          }
          return null;
        })}
      </div>
      <div className="flex-shrink-0 border-t bg-white p-4 bottom-0">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            ref={inputref}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          <button
            onClick={sendMessage}
            type="button"
            disabled={!newMessage.trim()}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 active:scale-95 flex items-center gap-2
             ${
               newMessage.trim()
                 ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                 : "bg-blue-200 text-white/60 cursor-not-allowed"
             }`}
          >
            <span className={`${newMessage.trim() ? "" : "opacity-70"}`}>
              Send
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
          <button onClick={LeaveRoom}>leave</button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
