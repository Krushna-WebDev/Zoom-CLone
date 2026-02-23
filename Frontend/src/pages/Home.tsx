import React, { useContext, useState } from "react";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import axios from "axios";
import { IoCloseCircle } from "react-icons/io5";
import { ModalContext } from "../../Context/ModelContext";
import { toast } from "react-toastify";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import { UserContext } from "../../Context/Context";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";

interface formdatainterface {
  username: string;
  email: string;
  password: string;
}

const Home = () => {
  //context
  const { loginModel, setLoginModel } = useContext(ModalContext)!;
  const { RequireLoginModal, setRequireLoginModal } = useContext(ModalContext)!;
  const { setToken } = useContext(UserContext)!;
  //states
  const [formdata, setformdata] = useState<formdatainterface>({
    username: "",
    email: "",
    password: "",
  });
  const [modelStatus, SetModelStatus] = useState(1); // 1 for login and 0 for signup
  const [emailVerifyModel, setEmailVerifyModel] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [forgotPassOpen, setForgotPassOpen] = useState(false);
  // function
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value,
    } as any);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (modelStatus === 1) {
        // Login
        const res = await axios.post(
          "http://localhost:5000/api/v1/auth/login",
          { email: formdata.email, password: formdata.password },
          { withCredentials: true },
        );
        toast.success(res.data.message);
        setformdata({ username: "", email: "", password: "" });

        if (res.status === 200) {
          setToken(res.data.accessToken);
          setLoginModel(false);
        }
      } else {
        // Signup
        const res = await axios.post(
          "http://localhost:5000/api/v1/auth/register",
          {
            name: formdata.username,
            email: formdata.email,
            password: formdata.password,
          },
        );
        toast.success(res.data.message);
        setformdata({ username: "", email: "", password: "" });
        SetModelStatus(1); // switch to login after successful signup
      }
    } catch (error: any) {
      const err = error?.response?.data;
      if (err?.errors && Array.isArray(err.errors)) {
        err.errors.forEach((e: any) => toast.error(e));
      } else if (err?.message) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = "http://localhost:5000/api/v1/auth/google/callback";
    const scope = "email profile";
    const responseType = "code";

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&access_type=offline&prompt=consent`;

    window.location.href = googleAuthUrl;
  };

  const emailVerify = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/emailverify",
        {
          email: emailInput,
        },
        {
          withCredentials: true,
        },
      );
      // console.log(res.data);
      if (res.status === 200) {
        setEmailVerifyModel(false);
        setForgotPassOpen(true);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      {loginModel && (
        <div className="flex justify-center items-center fixed z-50 bg-gray-900/50 inset-0 backdrop-blur-sm p-4">
          {/* Dynamic container based on modelStatus: flex-row-reverse swaps form and image position */}
          <div
            className={`bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full flex relative transition-all duration-500 min-h-[650px] ${
              modelStatus === 0 ? "md:flex-row-reverse" : "md:flex-row"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setLoginModel(false);
                setformdata({
                  username: "",
                  email: "",
                  password: "",
                });
              }}
              className="absolute top-5 right-5 z-20 text-gray-400 hover:text-red-500 transition-colors duration-300 p-1 rounded-full bg-white/50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Close modal"
            >
              <IoCloseCircle className="w-8 h-8" />
            </button>

            {/* Form Area (Stays visually on one side of the flex row, order controlled by container) */}
            <div className="w-full md:w-1/2 p-10 lg:p-12 xl:p-16 flex flex-col justify-start overflow-y-auto max-h-[650px] space-y-8">
              {/* Tab/Model Status Switcher - Centered */}
              <div className="mb-4 text-center">
                <div className="inline-flex bg-gray-100 p-1 rounded-xl shadow-inner">
                  <button
                    onClick={() => SetModelStatus(1)}
                    className={
                      modelStatus === 1
                        ? "bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 text-base"
                        : "text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium text-base"
                    }
                  >
                    Login
                  </button>

                  <button
                    onClick={() => SetModelStatus(0)}
                    className={
                      modelStatus === 0
                        ? "bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 text-base"
                        : "text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium text-base"
                    }
                  >
                    Signup
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Header Area */}
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 text-center">
                    {modelStatus === 1 ? "Welcome Back" : "Create Account"}
                  </h1>
                  <p className="mt-2 text-md text-gray-500 text-center">
                    {modelStatus === 1
                      ? "Sign in to continue to your dashboard."
                      : "Join us and start your journey."}
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Input Fields Container - Fixed Space */}
                  <div className="space-y-5 transition-all duration-300">
                    {/* Username Field (Conditional - only visible in Signup) */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        modelStatus === 0
                          ? "max-h-24 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <label
                        htmlFor="Username"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                      >
                        Username
                      </label>
                      <input
                        id="Username"
                        type="text"
                        name="username"
                        value={formdata.username}
                        onChange={handleChange}
                        className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white shadow-sm"
                        placeholder="Enter your username"
                        required={modelStatus === 0}
                        aria-hidden={modelStatus !== 0}
                      />
                    </div>

                    {/* Email Field - Consistent position */}
                    <div>
                      <label
                        htmlFor="Email"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        id="Email"
                        type="email"
                        name="email"
                        value={formdata.email}
                        onChange={handleChange}
                        className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white shadow-sm"
                        placeholder="name@example.com"
                        required
                      />
                    </div>

                    {/* Password Field - Consistent position */}
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                      >
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        name="password"
                        value={formdata.password}
                        onChange={handleChange}
                        className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white shadow-sm"
                        placeholder="Enter your secure password"
                        required
                      />
                    </div>
                  </div>

                  {/* Forgot Password (Conditional - only visible in Login) */}
                  <div
                    className={`flex justify-end transition-all duration-300 ${
                      modelStatus === 1 ? "h-5 opacity-100" : "h-0 opacity-0"
                    }`}
                  >
                    {modelStatus === 1 && (
                      <button
                        onClick={() => {
                          setEmailVerifyModel(true);
                          setLoginModel(false);
                        }}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 rounded-xl text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/50 transition-all duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    {modelStatus === 1 ? "Sign In" : "Get Started"}
                  </button>

                  {/* Separator */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white text-gray-400 font-medium">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-gray-700 hover:bg-gray-50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 text-base"
                    >
                      <FaGoogle className="w-5 h-5 text-red-500" />
                      <span className="font-semibold">
                        Continue with Google
                      </span>
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-gray-700 hover:bg-gray-50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 text-base"
                    >
                      <FaFacebook className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">
                        Continue with Facebook
                      </span>
                    </button>
                  </div>
                </form>

                {/* Conditional Signup/Login link at the bottom (secondary CTA) */}
                <p className="mt-6 text-sm text-gray-500 text-center">
                  {modelStatus === 1 ? (
                    <>
                      Don't have an account?{" "}
                      <span
                        onClick={() => SetModelStatus(0)}
                        className="text-blue-600 hover:text-blue-700 font-bold transition-colors hover:underline cursor-pointer"
                      >
                        Sign up
                      </span>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <span
                        onClick={() => SetModelStatus(1)}
                        className="text-blue-600 hover:text-blue-700 font-bold transition-colors hover:underline cursor-pointer"
                      >
                        Login
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Visual/Image Area (Stays visually on one side of the flex row, order controlled by container) */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 to-indigo-700 p-8 lg:p-12 items-center justify-center relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative text-white text-center space-y-4">
                <h2 className="text-4xl font-extrabold tracking-tight">
                  {modelStatus === 1
                    ? "Seamlessly Connect"
                    : "Start Your Journey"}
                </h2>
                <p className="text-lg font-light max-w-sm mx-auto">
                  {modelStatus === 1
                    ? "Access your personalized dashboard and discover new features today."
                    : "Create an account in seconds and unlock new possibilities."}
                </p>
                <img
                  src="Group 3.png"
                  alt="Illustration"
                  className="mt-10 max-w-sm w-full object-contain drop-shadow-2xl"
                />
              </div>
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

      {emailVerifyModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          {/* Common Backdrop Click to Close */}
          <div
            className="absolute inset-0"
            onClick={() => setEmailVerifyModel(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200 border border-gray-100">
            {/* Close Button (Top Right) */}
            <button
              onClick={() => setEmailVerifyModel(false)}
              className="absolute right-4 top-4 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-full transition-colors"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Mail Icon */}
            <div className="mx-auto w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-6 border border-orange-100 shadow-sm">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </h2>
            <p className="text-sm text-gray-500 mb-8 px-2">
              Enter the email address associated with your account and we'll
              send you a code to reset your password.
            </p>

            {/* Input Field Area */}
            <div className="text-left mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative flex items-center group">
                <div className="absolute left-4 text-gray-400 group-focus-within:text-orange-500 transition-colors pointer-events-none">
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
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-gray-50 focus:bg-white font-medium"
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                if (!emailInput) {
                  toast.error("Please enter your email");
                  return;
                }
                emailVerify();
              }}
              className="w-full py-3.5 px-4 bg-gray-900 hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] mb-6"
            >
              Send Reset Code
            </button>

            {/* Back to Login Link */}
            <button
              onClick={() => {
                setEmailVerifyModel(false);
                setLoginModel(true);
              }}
              className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-1.5"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Login
            </button>
          </div>
        </div>
      )}

      <ForgotPasswordModal
        isOpen={forgotPassOpen}
        onClose={() => {
          setForgotPassOpen(false);
          setEmailInput("");
        }}
        mode="loggedOut"
        email={emailInput}
      />
    </>
  );
};

export default Home;
