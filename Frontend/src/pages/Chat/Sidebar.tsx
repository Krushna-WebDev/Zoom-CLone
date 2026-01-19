import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../Context/Context";

interface Participant {
  userId: string;
  name: string;
  joinType: string;
}

interface SidebarProps {
  participants: Participant[];
}

const Sidebar = ({ participants }: SidebarProps) => {
  const { user } = useContext(UserContext)!;
  return (
    <div className="h-full flex flex-col bg-white border-r">
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
      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Participants ({participants?.length})
        </h3>
        <div className="space-y-3">
          {participants?.map((user) => (
            <div key={user.userId} className="flex items-center gap-3">
              <div className="relative">
                <div className="py-5 px-5 rounded-full bg-gray-700 "></div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
              </div>

              <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span>{user.name}</span>

                {user.joinType === "admin" && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold uppercase px-2.5 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t p-4 flex-shrink-0">
        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded">
          Leave
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
