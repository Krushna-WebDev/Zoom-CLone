import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/Context";
import { ModalContext } from "../../Context/ModelContext";

const Hero = () => {
  const navigate = useNavigate();

  // contexts
  const { user, setJoinType, token, setToken } = useContext(UserContext)!;
  const { JoinMeetingModal, setJoinMeetingModal, setRequireLoginModal } =
    useContext(ModalContext)!;

  // states
  const [inputCode, setinputCode] = useState("");
  const [meetingcode, setMeetingCode] = useState<string | null>(null);

  const getMeetingcode = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/meeting/create-meeting",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 201) {
        setMeetingCode(res.data.meetingId);
      }
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 403) {
        try {
          const refreshRes = await axios.get(
            "http://localhost:5000/api/v1/auth/refresh",
            {
              withCredentials: true,
            }
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

  const joinAfterCode = () => {
    if (meetingcode) {
      setJoinType("admin");
      navigate(`/chatarea/${meetingcode}`);
    }
  };
  const joinMeeting = async () => {
    if (inputCode) {
      navigate(`/chatarea/${inputCode}`);
      setJoinType("member");
    }
  };

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
          <div className="w-full relative">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
            {/* Modal Container */}
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 relative overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
              {/* Decorative Top Bar */}
              <div className="h-2 w-full bg-gradient-to-r from-orange-400 to-orange-600"></div>

              {/* Close Button */}
              <button
                onClick={() => setJoinMeetingModal(false)}
                className="absolute right-4 top-5 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
                aria-label="Close modal"
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
                    strokeWidth="2.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold font-raleway text-gray-900">
                    Video Meeting
                  </h1>
                  <p className="text-gray-500 text-sm mt-2">
                    Connect with your team instantly
                  </p>
                </div>

                <div className="space-y-6">
                  {/* --- Section 1: Join with Code --- */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                      Have a meeting code?
                    </label>
                    <div className="relative flex items-center group">
                      <div className="absolute left-3 text-gray-400 group-focus-within:text-orange-500 transition-colors">
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
                        className="w-full pl-10 pr-24 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-gray-700 placeholder-gray-400"
                        placeholder="abc-def-ghi"
                      />
                      <button
                        onClick={joinMeeting}
                        className="absolute right-1.5 top-1.5 bottom-1.5 bg-gray-900 hover:bg-orange-600 text-white px-4 rounded-lg font-medium text-sm transition-colors duration-200"
                      >
                        Join
                      </button>
                    </div>
                  </div>

                  {/* --- Separator --- */}
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-wider">
                      OR
                    </span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  {/* --- Section 2: Create Code --- */}
                  <div>
                    <button
                      onClick={getMeetingcode}
                      className="group w-full flex items-center justify-center gap-3 bg-orange-50 hover:bg-orange-100 border border-orange-100 hover:border-orange-200 text-orange-700 font-semibold px-6 py-4 rounded-xl transition-all duration-200 active:scale-[0.98]"
                    >
                      <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                        <svg
                          className="w-5 h-5 text-orange-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      Create New Meeting
                    </button>
                  </div>

                  {/* --- Section 3: Display Generated Code (Conditional) --- */}
                  {meetingcode && (
                    <div className="animate-in slide-in-from-top-4 fade-in duration-300">
                      <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-sm font-medium text-green-800">
                            Success! Here is your code:
                          </p>
                        </div>

                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-green-200 border-dashed">
                          <span className="flex-1 font-mono text-lg font-bold text-gray-800 tracking-wider text-center">
                            {meetingcode}
                          </span>

                          <div className="flex gap-1">
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(meetingcode)
                              }
                              className="p-2 hover:bg-gray-100 rounded-md text-gray-500 hover:text-gray-700 transition-colors"
                              title="Copy to clipboard"
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
                                  strokeWidth={2}
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={joinAfterCode}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
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
