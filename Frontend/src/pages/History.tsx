import React from 'react';

const History = () => {
  // Dummy Data for the History
  const historyData = [
    {
      id: 1,
      title: "Q4 Marketing Strategy",
      admin: "Sarah Connor",
      date: "Oct 24, 2024",
      time: "10:00 AM",
      status: "Completed",
      participants: [
        { name: "Sarah Connor", img: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
        { name: "John Doe", img: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
        { name: "Alice Smith", img: "https://i.pravatar.cc/150?u=a04258114e29026302d" },
      ]
    },
    {
      id: 2,
      title: "Design System Review",
      admin: "Alex Morgan",
      date: "Oct 22, 2024",
      time: "2:30 PM",
      status: "Completed",
      participants: [
        { name: "Alex Morgan", img: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
        { name: "Dev Team", img: "https://i.pravatar.cc/150?u=a04258a2462d826712d" },
      ]
    },
    {
      id: 3,
      title: "Client Onboarding",
      admin: "Michael Scott",
      date: "Oct 20, 2024",
      time: "11:00 AM",
      status: "Cancelled",
      participants: [
        { name: "Michael Scott", img: "https://i.pravatar.cc/150?u=a048581f4e29026701d" },
        { name: "Dwight S.", img: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
        { name: "Jim H.", img: "https://i.pravatar.cc/150?u=2042581f4e29026704d" },
        { name: "Pam B.", img: "https://i.pravatar.cc/150?u=1042581f4e29026704d" },
      ]
    },
    {
      id: 4,
      title: "Sprint Planning",
      admin: "Sarah Connor",
      date: "Oct 18, 2024",
      time: "09:00 AM",
      status: "Completed",
      participants: [
        { name: "Sarah Connor", img: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
      ]
    },
  ];

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
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Export Data
          </button>
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
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {meeting.date}
              </div>
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                meeting.status === "Completed" 
                  ? "bg-green-50 text-green-700 ring-green-600/20" 
                  : "bg-red-50 text-red-700 ring-red-600/20"
              }`}>
                {meeting.status}
              </span>
            </div>

            {/* Card Body */}
            <div className="flex-1 px-6 py-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {meeting.title}
                </h3>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <svg className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {meeting.time}
                </div>
              </div>

              {/* Admin Info */}
              <div className="mb-6 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                   {/* Admin Crown Icon */}
                   <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                   </svg>
                </div>
                <div>
                   <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</p>
                   <p className="text-sm font-semibold text-gray-900">{meeting.admin}</p>
                </div>
              </div>
            </div>

            {/* Footer: Participants Stack */}
            <div className="border-t border-gray-100 bg-white px-6 py-4">
               <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Participants</span>
                  
                  <div className="flex -space-x-2 overflow-hidden">
                    {/* Render existing participants */}
                    {meeting.participants.map((p, i) => (
                      <img
                        key={i}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                        src={p.img}
                        alt={p.name}
                        title={p.name}
                      />
                    ))}
                    
                    {/* Render Placeholder circles for empty spots (Max 4) */}
                    {[...Array(4 - meeting.participants.length)].map((_, i) => (
                       <div key={`empty-${i}`} className="inline-block h-8 w-8 rounded-full bg-gray-100 ring-2 ring-white flex items-center justify-center">
                          <span className="text-gray-300 text-xs">•</span>
                       </div>
                    ))}
                  </div>
               </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default History