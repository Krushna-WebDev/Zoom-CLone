import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../Context/Context";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Participant {
  userId: string;
  name: string;
}

// interface SidebarProps {
//   participants: Participant[];
// }

const Sidebar = () => {
  const { user } = useContext(UserContext)!;
  const token = localStorage.getItem("token");

  const [participants, setparticipants] = useState<Participant[]>([]);

  const { meetingId } = useParams();
  const fetchParticipants = async () => {
    console.log("meetingid", meetingId);
    const res = await axios.get(
      `http://localhost:5000/api/v1/meeting/fetch-participants/${meetingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setparticipants(res.data);
    console.log(res.data);
  };
  useEffect(() => {
    fetchParticipants();
  }, []);
  return (
    <div className="h-screen bg-white border-r">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <img
            src={user?.profilePic}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <h3 className="font-semibold text-gray-800">{user?.name}</h3>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Participants ({participants.length})
        </h3>
        <div className="space-y-3">
          {participants.map((user) => (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="py-5 px-5 rounded-full bg-gray-700 "></div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
              <p className="text-sm font-medium text-gray-700">{user.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
