import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [model, setModel] = useState<boolean>(false);
  const [inputCode, setinputCode] = useState("");
  const [meetingcode, setMeetingCode] = useState<string | null>(null);

  const getMeetingcode = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "http://localhost:5000/api/v1/meeting/create-meeting",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setMeetingCode(res.data.meetingid);
  };

  return (
    <>
      <div className="bg-green-100/60">
        <div className="mx-auto max-w-7xl px-4 flex w-full items-center ">
          <div className="w-full m-5">
            <h1 className="text-6xl font-raleway">
              <span className="text-gray-400 pr-5">Say Hi!</span>
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
                onClick={() => setModel(true)}
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
            <div className="absolute bottom-45 left-50 z-10 bg-white shadow-md rounded-xl px-4 py-2 flex items-center gap-4">
              <div>
                <img
                  src="pfp2.jpeg"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  alt="Profile picture"
                />
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-gray-900">Sara K.</p>
                <p className="text-gray-600 text-sm">Hello!!</p>
              </div>
            </div>
            <div className="absolute bottom-20 left-10 z-10 bg-white shadow-md rounded-xl px-4 py-2 flex items-center gap-4">
              <div>
                <img
                  src="pfp1.jpeg"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  alt="Profile picture"
                />
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-gray-900">Jasmin P.</p>
                <p className="text-gray-600 text-sm">Hello !! How are you?</p>
              </div>
            </div>
          </div>
        </div>
        {model && (
          <div className="bg-black/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-96 max-w-[90%] relative">
              <button
                onClick={() => setModel(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
              <h1 className="text-2xl font-raleway text-center mb-8 text-gray-800">
                Meeting Code
              </h1>
              <div className="space-y-4 mb-8">
                <div className="flex gap-3">
                  <input
                    type="text"
                    onChange={(e) => setinputCode(e.target.value)}
                    className="flex-1 border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all"
                    placeholder="Enter meeting code..."
                  />
                  <button className="font-raleway bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2">
                    <span>Copy</span>
                  </button>
                </div>
                <p className="font-raleway text-center">OR</p>
                <button className="w-full font-raleway bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-all duration-300 active:scale-95 shadow-sm hover:shadow flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span onClick={getMeetingcode}>Generate New Code</span>
                </button>

                {meetingcode && <p className="font-raleway"> {meetingcode}</p>}
              </div>

              <Link
                to={`/chatarea/${inputCode || meetingcode}`}
                className="..."
              >
                Join Chat Area
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Hero;
