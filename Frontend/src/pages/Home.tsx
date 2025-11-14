import React, { useContext, useState } from "react";
import Hero from "../components/Hero";
import { IoIosVideocam } from "react-icons/io";
import { MdScreenShare } from "react-icons/md";
import { BsChatSquareTextFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import axios from "axios";
import { IoCloseCircle } from "react-icons/io5";
import { ModalContext } from "../../Context/ModelContext";
import { toast } from "react-toastify";
import { UserContext } from "../../Context/Context";

interface FeatureInterface {
  title: string;
  desc: string;
  bgcolor: string;
  iconColor: string;
  icon: React.ComponentType;
}

interface formdatainterface {
  email: string;
  password: string;
}

const featureData: FeatureInterface[] = [
  {
    title: "Crystal Clear Video Calls",
    desc: "Lag-free, HD quality audio & video.",
    bgcolor: "bg-orange-300/50",
    iconColor: "text-orange-500",
    icon: IoIosVideocam,
  },
  {
    title: "Screen Sharing",
    desc: "Share your screen instantly with one click",
    bgcolor: "bg-blue-300/50",
    iconColor: "text-blue-500",
    icon: MdScreenShare,
  },
  {
    title: "Secure and Real Time Chat",
    desc: " End-to-end encrypted With Real Time",
    bgcolor: "bg-green-300/50",
    iconColor: "text-green-500",
    icon: BsChatSquareTextFill,
  },
];

const Home = () => {
  //context
  const { loginModel, setLoginModel } = useContext(ModalContext)!;
  const { RequireLoginModal, setRequireLoginModal } = useContext(ModalContext)!;
  const { setToken } = useContext(UserContext)!;

  //states
  const [formdata, setformdata] = useState<formdatainterface>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        formdata,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setformdata({
        email: "",
        password: "",
      });

      if (res.status === 200) {
        localStorage.setItem("token", res.data.accessToken);
        const newToken = localStorage.getItem("token")!
        setToken(newToken)
        setLoginModel(false)
      }
    } catch (error) {
      alert(error);
    }
  };
  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = "http://localhost:5000/api/v1/auth/google/callback";
    const scope = "Email profile";
    const responseType = "code";

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&access_type=offline&prompt=consent`;

    window.location.href = googleAuthUrl;
  };
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-7xl min-h-screen">
        <h1 className="text-center font-raleway text-2xl mt-20">
          Feature Of Our Chattique
        </h1>
        <div className="grid grid-cols-3 gap-10 mt-10">
          {featureData.map((feature) => (
            <div className="flex gap-4 items-center bg-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 max-w-md">
              <div
                className={`${feature.bgcolor} rounded-full p-4 w-16 h-16 flex items-center justify-center hover:bg-orange-300 transition-all duration-300`}
              >
                <feature.icon className={`${feature.iconColor} text-3xl`} />
              </div>
              <div className="space-y-2">
                <h3 className="font-raleway text-xl font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm font-poppins">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {loginModel && (
        <div className="flex justify-center items-center fixed z-50 bg-black/20 inset-0 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full mx-4 flex relative">
            <button
              onClick={() => setLoginModel(false)}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <IoCloseCircle className="w-8 h-8" />
            </button>

            <div className="w-1/2 p-8">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome Back
                  </h1>
                  <p className="mt-2 text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="Email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        id="Email"
                        type="email"
                        name="email"
                        value={formdata.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-gray-50 hover:bg-white"
                        placeholder="Enter your Email"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        name="password"
                        value={formdata.password}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-gray-50 hover:bg-white"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Sign in
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white text-gray-500 font-medium">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full flex items-center font-raleway justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                    >
                      <FaGoogle className="w-5 h-5 text-red-500" />
                      <span className="font-medium">Continue with Google</span>
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center font-raleway justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                    >
                      <FaFacebook className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">
                        Continue with Facebook
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="w-1/2 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex items-center justify-center">
              <img
                src="Group 3.png"
                alt="Login illustration"
                className="max-w-md w-full object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
      {RequireLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setRequireLoginModal(false)}
          />
          <div className="bg-white rounded-xl shadow-lg w-96 max-w-[90%] p-6 relative z-10">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-raleway font-semibold text-gray-800 mb-2">
                Please Login First
              </h1>
              <p className="text-gray-600 font-poppins text-sm">
                Login to access the chat features
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setRequireLoginModal(false);
                  setLoginModel(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 
                     text-white font-raleway font-medium 
                     px-6 py-2.5 rounded-lg shadow-sm"
              >
                Login
              </button>

              <button
                onClick={() => setRequireLoginModal(false)}
                className="px-6 py-2.5 border border-gray-200 
                     hover:bg-gray-50 text-gray-600
                     font-raleway rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
