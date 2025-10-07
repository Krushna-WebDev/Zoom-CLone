import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";

interface Participant {
  userId: string;
  username: string;
}

const ChatLayout = () => {
  const [participants, setparticipants] = useState<Participant[]>([]);
  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden">
      <div className="w-70 flex-shrink-0">
        <Sidebar
          participants={participants}
        />
      </div>
      <div className="flex-1">
        <ChatArea
          participants={participants}
          setparticipants={setparticipants}
        />
      </div>
    </div>
  );
};

export default ChatLayout;
