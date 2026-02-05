import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/Context";
import { ModalContext } from "../../Context/ModelContext";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const Hero = () => {
  const navigate = useNavigate();

  // contexts
  const { user, token, setToken } = useContext(UserContext)!;
  const { JoinMeetingModal, setJoinMeetingModal, setRequireLoginModal } =
    useContext(ModalContext)!;

  // states
  const [inputCode, setinputCode] = useState("");
  const [meetingcode, setMeetingCode] = useState<string | null>(null);
  const [meetingName , setMeetingName] = useState<string | null>(null)

  const GenerateCode = async () => {
    const generatedId = uuidv4();
    setMeetingCode(generatedId);
  };

  const creataMeeting = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/meeting/create-meeting",
        {
          meetingName,
          meetingId: meetingcode,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.status === 201) {
        setJoinMeetingModal(false);
        navigate(`/chatarea/${meetingcode}`);
        setMeetingName(null)
      }
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 403) {
        try {
          const refreshRes = await axios.get(
            "http://localhost:5000/api/v1/auth/refresh",
            {
              withCredentials: true,
            },
          );
          const newToken = refreshRes.data.accessToken;
          localStorage.setItem("token", newToken);
          setToken(newToken);
        } catch (refreshError) {
          console.error("Refresh failed:", refreshError);
        }
      } else {
        console.error("Error fetching user:", error);
      }
    }
  };

  //optimize it

  // const joinAfterCode = async () => {
  //   if (!meetingcode) return;
  //   try {
  //     const res = await axios.get(
  //       `http://localhost:5000/api/v1/meeting/check-room/${meetingcode}`,
  //       {
  //         withCredentials: true,
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     if (res.data.isJoinable) {
  //     } else {
  //       toast.error(
  //         `Room is full (${res.data.currentUsers}/${res.data.maxUsers} users)`,
  //       );
  //     }
  //   } catch (error: any) {
  //     toast.error("Error checking room. Please try again.");
  //     console.error(error);
  //   }
  // };

  const joinMeeting = async () => {
    if (!inputCode) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/meeting/check-room/${inputCode}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.isJoinable) {
        setJoinMeetingModal(false);
        navigate(`/chatarea/${inputCode}`);
      } else {
        toast.error(
          `Room is full (${res.data.currentUsers}/${res.data.maxUsers} users)`,
        );
      }
    } catch (error: any) {
      toast.error("Error checking room. Please try again.");
      console.error(error);
    }
  };
console.log("meeting name ", meetingName)
  return (
    <>
      <div
        style={{
          backgroundImage: `url('Gradient landscape design background _ Free Vector.jpg')`, // <-- put your image in /public
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.90)",
        }}
        className="pt-20 relative"
      >
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 flex w-full  items-center ">
          {/* left side text */}
          <div className="w-full m-1">
            <h1 className="text-6xl font-raleway">
              <span className=" pr-5 bg-clip-text text-transparent bg-gradient-to-r from-[#B29FD9] to-[#F97316]">
                Say Hi!
              </span>
              To Your Friend & Family
            </h1>
            <p className="font-poppins font-semibold mt-8 mr-30 text-gray-600">
              Talk. Share. Hang Out. Stay connected with friends, family, or
              your team anytime, anywhere. Our platform makes video calls
              effortless with smooth, high-quality video, crystal-clear audio,
              and easy screen sharing.
            </p>
            <div className="flex items-center mt-10 gap-5">
              <button
                onClick={() =>
                  user ? setJoinMeetingModal(true) : setRequireLoginModal(true)
                }
                className="bg-orange-500 text-white font-raleway px-3 py-2 rounded"
              >
                Start Chat
              </button>
              <button className="bg-orange-500 text-white font-raleway px-3 py-2 rounded">
                Start Video Call
              </button>
            </div>
          </div>
          {/* img right side */}
          <div className="w-full relative hidden md:block ">
            <img
              src="chatting Lady.png"
              alt="chatting lady"
              className="w-full"
            />
            <img
              src="image 10.png"
              className="absolute bottom-0 w-30 right-20 z-10  object-contain"
              alt="overlay"
            />
            <div className="absolute bottom-44 left-40 z-30 bg-white shadow-md rounded-xl px-4 py-2 flex items-center gap-4 backdrop-blur-sm">
              <img
                src="/pfp2.jpeg"
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                alt="Profile"
              />
              <div className="flex flex-col">
                <p className="font-semibold text-gray-900">Sara K.</p>
                <p className="text-gray-600 text-sm">Hello!!</p>
              </div>
            </div>
            <div className="absolute bottom-20 left-10 z-30 bg-white shadow-md rounded-xl px-4 py-2 flex items-center gap-4 backdrop-blur-sm">
              <img
                src="/pfp1.jpeg"
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                alt="Profile"
              />
              <div className="flex flex-col">
                <p className="font-semibold text-gray-900">Jasmin P.</p>
                <p className="text-gray-600 text-sm">Hello !! How are you?</p>
              </div>
            </div>
          </div>
        </div>
        {JoinMeetingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
            {/* Modal Container */}
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
              {/* Decorative Gradient Bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-red-500 to-orange-600"></div>

              {/* Close Button */}
              <button
                onClick={() => setJoinMeetingModal(false)}
                className="absolute right-4 top-5 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors z-10"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="px-8 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <svg
                      className="h-6 w-6 text-orange-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Video Meeting
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Connect with your team instantly
                  </p>
                </div>

                <div className="space-y-6">
                  {/* --- Section 1: Join with Code --- */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                      Join Existing
                    </label>
                    <div className="relative flex items-center group">
                      <div className="absolute left-3 text-gray-400 group-focus-within:text-orange-500 transition-colors pointer-events-none">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        onChange={(e) => setinputCode(e.target.value)}
                        className="w-full pl-10 pr-20 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-gray-700 placeholder-gray-400"
                        placeholder="Enter code"
                      />
                      <button
                        onClick={joinMeeting}
                        className="absolute right-1.5 top-1.5 bottom-1.5 bg-gray-900 hover:bg-orange-600 text-white px-4 rounded-lg font-medium text-sm transition-colors shadow-sm"
                      >
                        Join
                      </button>
                    </div>
                  </div>

                  {/* --- Separator --- */}
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-300 text-[10px] font-bold uppercase tracking-widest">
                      OR START NEW
                    </span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  {/* --- Section 2: Create New Meeting --- */}
                  <div>
                    {/* NEW: Optional Meeting Name Input */}
                    <div className="mb-3">
                      <input
                        type="text"
                        onChange={(e) => setMeetingName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-sm text-gray-700 placeholder-gray-400"
                        placeholder="Meeting Name (Optional)"
                      />
                    </div>

                    <button
                      onClick={GenerateCode}
                      className="group w-full flex items-center justify-center gap-3 bg-gradient-to-b from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border border-orange-200 text-orange-800 font-semibold px-6 py-3 rounded-xl transition-all duration-200 active:scale-[0.98]"
                    >
                      <svg
                        className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Create New Meeting
                    </button>
                  </div>

                  {/* --- Section 3: Generated Code Result --- */}
                  {meetingcode && (
                    <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                      <div className="bg-green-50/80 border border-green-100 rounded-xl p-4 mt-2">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs font-bold text-green-700 uppercase tracking-wide">
                            Meeting Created!
                          </p>
                        </div>

                        <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-green-200 border-dashed shadow-sm">
                          <span className="flex-1 font-mono text-lg font-bold text-gray-800 tracking-wider text-center select-all">
                            {meetingcode}
                          </span>

                          <div className="flex gap-1 border-l border-gray-100 pl-1">
                            <button
                              onClick={creataMeeting}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-md shadow-sm transition-colors whitespace-nowrap"
                            >
                              Enter Room
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Hero;
