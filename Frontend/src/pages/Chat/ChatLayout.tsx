import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import { ChatNavbar } from "./ChatNavbar";

interface Participant {
  userId: string;
  name: string;
}

const ChatLayout = () => {
  const [participants, setparticipants] = useState<Participant[]>([]);
  return (
    <>
      <ChatNavbar />
      <div className="flex bg-gray-50 overflow-hidden">
        <div className="w-70 flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1">
          <ChatArea
            participants={participants}
            setparticipants={setparticipants}
          />
        </div>
      </div>
    </>
  );
};

export default ChatLayout;
