import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Context/Context";

interface participant {
  email: string;
  name: string;
  profilePic: string;
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
  const [selectedMeeting, setSelectedMeeting] = useState<historydata | null>(
    null,
  );
  const selectedAdmin =
    selectedMeeting?.Participants.find((p) => p.role === "admin") ?? null;
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
      console.log("data", res.data);
      setHistoryData(res.data);
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
                        src={
                          p.profilePic ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}`
                        }
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
                    onClick={() => {
                      setHistoryModel(true);
                      setSelectedMeeting(meeting);
                    }}
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
      {HistoryModel && selectedMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setHistoryModel(false);
              setSelectedMeeting(null);
            }}
          ></div>

          {/* Modal Card */}
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/5 animate-in fade-in zoom-in-95 duration-200">
            {/* Header Section */}
            <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-gray-900">
                  Meeting Details
                </h1>
                {/* ID Badge */}
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    ID:
                  </span>
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-gray-600">
                    {selectedMeeting._id}
                  </code>
                </div>
              </div>

              <button
                onClick={() => {
                  setHistoryModel(false);
                  setSelectedMeeting(null);
                }}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6">
              {/* Top Grid: Host & Date */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Host Card */}
                <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-orange-600">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wide">
                      Host
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {selectedAdmin?.name || "Unknown Host"}
                  </p>
                </div>

                {/* Date Card */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {/* Date Badge */}
                  <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 border border-blue-100">
                    <svg
                      className="h-5 w-5 text-blue-600"
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
                    <span className="text-sm font-bold text-blue-900">
                      {new Date(selectedMeeting.Date).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </span>
                  </div>

                  {/* Time Badge */}
                  <div className="flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 border border-orange-100">
                    <svg
                      className="h-5 w-5 text-orange-600"
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
                    <span className="text-sm font-bold text-orange-900">
                      {new Date(selectedMeeting.Date).toLocaleTimeString(
                        "en-US",
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Participants Section */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-500 flex items-center gap-2">
                  Participants
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {selectedMeeting.Participants.length}
                  </span>
                </h3>

                <div className="max-h-48 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                  {selectedMeeting.Participants.map((p, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {/* Dummy Avatar */}
                        <img
                          src={`https://ui-avatars.com/api/?name=${p.name}&background=random`}
                          alt={p.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {p.email || "No email provided"}
                          </p>
                        </div>
                      </div>

                      {/* Role Badge */}
                      {p.role && (
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          {p.role}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button
                onClick={() => {
                  setHistoryModel(false);
                  setSelectedMeeting(null);
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Close
              </button>
              <button className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                {/* todo:- make working download button */}
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
