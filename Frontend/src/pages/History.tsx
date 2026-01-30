import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Context/Context";

const History = () => {
  const [HistoryData, setHistoryData] = useState();

  const historyData = [
    {
      id: 1,
      title: "Q4 Marketing Strategy",
      admin: "Sarah Connor",
      date: "Oct 24, 2024",
      time: "10:00 AM",
      status: "Completed",
      participants: [
        {
          name: "Sarah Connor",
          img: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        },
        {
          name: "John Doe",
          img: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        },
        {
          name: "Alice Smith",
          img: "https://i.pravatar.cc/150?u=a04258114e29026302d",
        },
      ],
    },
    {
      id: 2,
      title: "Design System Review",
      admin: "Alex Morgan",
      date: "Oct 22, 2024",
      time: "2:30 PM",
      status: "Completed",
      participants: [
        {
          name: "Alex Morgan",
          img: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        },
        {
          name: "Dev Team",
          img: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
        },
      ],
    },
    {
      id: 3,
      title: "Client Onboarding",
      admin: "Michael Scott",
      date: "Oct 20, 2024",
      time: "11:00 AM",
      status: "Cancelled",
      participants: [
        {
          name: "Michael Scott",
          img: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
        },
        {
          name: "Dwight S.",
          img: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        },
        {
          name: "Jim H.",
          img: "https://i.pravatar.cc/150?u=2042581f4e29026704d",
        },
        {
          name: "Pam B.",
          img: "https://i.pravatar.cc/150?u=1042581f4e29026704d",
        },
      ],
    },
    {
      id: 4,
      title: "Sprint Planning",
      admin: "Sarah Connor",
      date: "Oct 18, 2024",
      time: "09:00 AM",
      status: "Completed",
      participants: [
        {
          name: "Sarah Connor",
          img: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        },
      ],
    },
  ];

  const { token, isLoading } = useContext(UserContext)!;
  useEffect(() => {
    const fetchHistory = async () => {
      if (!token || isLoading) return;
      const res = await axios.get(
        "http://localhost:5000/api/v1/meeting/fetchhistory",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res.data);
    };
    fetchHistory();
  }, [isLoading, token]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-raleway mt-20">
      {/* Header Section */}
      <div className="mx-auto max-w-7xl mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meeting History</h1>
          <p className="mt-2 text-sm text-gray-600">
            Overview of your past sessions and participant details.
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="mx-auto max-w-7xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {historyData.map((meeting) => (
          <div
            key={meeting.id}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-orange-200"
          >
            {/* Card Header (Date & Status) */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {meeting.date}
              </div>
            </div>

            {/* Card Body */}
            <div className="flex-1 px-6 py-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {meeting.title}
                </h3>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <svg
                    className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {meeting.time}
                </div>
              </div>

              {/* Admin Info */}
              <div className="mb-6 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  {/* Admin Crown Icon */}
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {meeting.admin}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
