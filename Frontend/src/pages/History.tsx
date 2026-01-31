import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Context/Context";

interface participant {
  email: string;
  name: string;
  role: "admin" | "member";
}

interface historydata {
  Created_By: string;
  Date: string;
  MeetingId: string;
  Participants: participant[];
  _id: string;
}

const History = () => {
  const [HistoryData, setHistoryData] = useState<historydata[]>();
  const [HistoryModel, setHistoryModel] = useState<boolean>(false);

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
      // console.log(res.data);
      setHistoryData(res.data);
    };
    fetchHistory();
  }, [isLoading, token]);

  console.log("HistoryData", HistoryData);
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
        {HistoryData?.map((meeting) => {
          const MeetingDate = new Date(meeting.Date).toLocaleDateString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          const MeetingTime = new Date(meeting.Date).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
          const admin = meeting.Participants.filter((p) => p.role === "admin");
          console.log(meeting.Participants);
          return (
            <div
              key={meeting._id}
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
                  {MeetingDate}
                </div>
              </div>

              {/* Card Body */}
              <div className="flex-1 px-6 py-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {/* todo:-tittle set krna hai  */}
                    {/* {meeting.title} */} Unknown Meeting
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
                    {MeetingTime}
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
                      {admin[0].name ?? "unknown"}
                    </p>
                  </div>
                </div>
                {/* {meeting.Participants.map((p) => (
                  <p>{p.name}</p>
                ))} */}

                {/* todo:- need to add image in participant to show history participant */}
                <div className="mt-2 flex items-center justify-between">
                  {/* Participants Stack */}
                  <div className="flex -space-x-3 pl-2">
                    {meeting.Participants.slice(0, 5).map((p, idx) => (
                      <img
                        key={idx}
                        /* Static Dummy Image */
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&auto=format&fit=crop&q=60"
                        alt={p.name}
                        className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm transition-transform hover:z-10 hover:-translate-y-1"
                      />
                    ))}

                    {meeting.Participants.length > 5 && (
                      <div className="relative z-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-orange-50 text-xs font-bold text-orange-600">
                        +{meeting.Participants.length - 5}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setHistoryModel(true)}
                    className="text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors"
                  >
                    View all
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {HistoryModel && (
        <>
          <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm">
            <div className="p-3 bg-white rounded-md flex">
              <h1 className="text-2xl">History Detail</h1>
              <h1 className="text-xl">Meeting Name</h1>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default History;
