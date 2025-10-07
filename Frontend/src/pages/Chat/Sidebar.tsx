import React from "react";

interface Participant {
  userId: string;
  username: string;
}

interface SidebarProps {
  participants: Participant[];
}

const Sidebar = ({ participants }: SidebarProps) => {
  console.log(participants);
  return (
    <div className="h-screen bg-white border-r">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <img
            src="/pfp1.jpeg"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <h3 className="font-semibold text-gray-800">John Doe</h3>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h4 className="text-sm font-medium text-gray-500 mb-3">
          PARTICIPANTS ({`${participants.length}`})
        </h4>
        <div className="space-y-3">
          {participants.map((user) => (
            <div className="flex items-center gap-3">
              <div className="relative">
               <div className="py-5 px-5 rounded-full bg-gray-700 ">

               </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
              <p className="text-sm font-medium text-gray-700">{user.username}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
