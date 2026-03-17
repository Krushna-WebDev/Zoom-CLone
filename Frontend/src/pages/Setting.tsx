import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../Context/Context";
import axios from "axios";
import { toast } from "react-toastify";
import ForgotPasswordModal from "../components/ForgotPasswordModal";

export const Setting = () => {
  //context
  const { user, token } = useContext(UserContext)!;

  //model
  const [passwordModel, setPasswordModel] = useState(false);
  const [forgotPassModel, setForgotPassModel] = useState(false);

  //states & ref
  const [curPassword, setCurPassword] = useState(""); // current password input
  const [error, setError] = useState(false); // store error msg if any error occur
  const errorTimerRef = useRef<number | null>(null); // error timing
  const [isVerified, setIsVerified] = useState(false); // when user entered correct password or not
  const [newPassword, setNewPassword] = useState(""); // new password input
  const [confirmPass, setConfirmPass] = useState(""); // confirm new password input

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);
  const verifyPass = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/verifyPassword",
        {
          curPassword,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.status === 200) {
        setError(false);
        setIsVerified(true);
        if (errorTimerRef.current) {
          clearTimeout(errorTimerRef.current);
          errorTimerRef.current = null;
        }
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError(true);
        setIsVerified(false);
        if (errorTimerRef.current) {
          clearTimeout(errorTimerRef.current);
        }
        errorTimerRef.current = window.setTimeout(() => {
          setError(false);
          errorTimerRef.current = null;
        }, 2500);
      } else {
        console.error("verifyPass error", err);
      }
    }
  };

  const changePassword = async () => {
    try {
      if (newPassword != confirmPass) {
        toast.error("Confirm Passworld MissMatch");
        return;
      }
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/changepass",
        {
          newPassword,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        setPasswordModel(false);
        setIsVerified(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    if (isVerified) {
      changePassword();
    } else verifyPass();
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-16 p-4 font-raleway sm:p-6">
      <div className="mx-auto max-w-5xl">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Settings
          </span>
          <h1 className="mt-4 mb-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Your Profile
          </h1>
          <p className="text-gray-500">
            Manage your personal information and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ---------------- Card 1: Avatar & Identity ---------------- */}
          <div className="md:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center h-fit">
            <div className="relative w-32 h-32 mb-4">
              <img
                src={user?.profilePic || "/defaultProfile.jpg"}
                alt="Avatar"
                className="w-full h-full rounded-full bg-amber-50 object-cover border-4 border-white shadow-md"
              />
              <button className="absolute bottom-0 right-0 bg-gray-900 text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              {user?.googleId
                ? "Signed in with Google"
                : "Signed in with email"}
            </div>
          </div>

          {/* ---------------- Card 2: Personal Details & Actions ---------------- */}
          <div className="md:col-span-2 bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
            {/* Top Section: Header & Fields */}
            <div>
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Personal Details
                </h3>
                <button
                  // onClick={() => setEditInfoModel(true)}
                  className="text-sm text-orange-600 font-semibold hover:underline"
                >
                  Edit info
                </button>
              </div>

              <div className="space-y-6">
                {/* Field: Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                    Display Name
                  </label>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <h2 className="text-base font-bold text-gray-900">
                      {user?.name}
                    </h2>
                  </div>
                </div>

                {/* Field: Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                    Email Address
                  </label>
                  <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <svg
                      className="mr-1 h-5 w-5 text-gray-400 sm:mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <span className="flex-1 text-gray-600 font-medium truncate">
                      {user?.email}
                    </span>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold uppercase tracking-wide">
                      Verified
                    </span>
                  </div>
                </div>

                {/* Field: Password Change */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                    Security
                  </label>
                  <button
                    onClick={() => setPasswordModel(true)}
                    className="w-full sm:w-auto text-sm bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 px-4 py-2.5 rounded-xl font-semibold transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Section: Action Buttons */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <button className="w-full sm:w-auto text-red-600 hover:text-red-700 text-sm font-bold px-4 py-2 rounded-xl transition-colors hover:bg-red-50">
                Logout
              </button>
              <button className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Save Changes
              </button>
            </div>
          </div>
        </div>
        {passwordModel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
            {/* Common Backdrop Click to Close */}
            <div
              className="absolute inset-0"
              onClick={() => {
                setPasswordModel(false);
              }}
            ></div>

            {user?.googleId ? (
              <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200 border border-gray-100">
                {/* Google Icon Wrapper */}
                <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-5 border border-gray-100 shadow-sm">
                  <svg
                    className="w-7 h-7"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Google Account
                </h2>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                  You are currently signed in using Google. To change your
                  password, please update your security settings directly
                  through your Google Account.
                </p>

                <button
                  onClick={() => {
                    setPasswordModel(false);
                  }}
                  className="w-full py-3 px-4 bg-gray-900 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-md hover:shadow-lg"
                >
                  Understood
                </button>
              </div>
            ) : (
              <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-gray-100 bg-gray-50/50 sm:px-6">
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">
                      Change Password
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Secure your account
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setPasswordModel(false);
                    }}
                    className="rounded-full p-2 text-gray-400 hover:bg-white hover:text-gray-600 hover:shadow-sm transition-all"
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

                <div className="space-y-5 p-4 sm:p-6">
                  {/* Current Password */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                        Current Password
                      </label>
                      {isVerified && (
                        <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 animate-in fade-in">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>

                    <input
                      type="password"
                      onChange={(e) => setCurPassword(e.target.value)}
                      disabled={isVerified}
                      placeholder="••••••••"
                      className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all 
                ${
                  error
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                } 
                ${isVerified ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-100" : "bg-white text-gray-900 placeholder-gray-400"}`}
                    />
                    <button
                      onClick={() => {
                        setPasswordModel(false);
                        setForgotPassModel(true);
                      }}
                      type="button"
                      className="text-sm font-medium text-gray-500 hover:text-orange-600 hover:underline transition-colors focus:outline-none rounded-sm px-1 -ml-1"
                    >
                      Forgot password?
                    </button>
                    {error && (
                      <p className="flex items-center gap-1.5 mt-2 text-xs font-medium text-red-500 animate-in slide-in-from-top-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Please enter a valid password.
                      </p>
                    )}
                  </div>

                  {/* Hidden/Revealed Section */}
                  <div
                    className={
                      isVerified
                        ? "space-y-5 animate-in slide-in-from-top-2 fade-in duration-300"
                        : "hidden"
                    }
                  >
                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-white"
                      />
                      <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
                        Must be at least 8 characters long.
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        onChange={(e) => setConfirmPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
                  <button
                    onClick={() => {
                      setPasswordModel(false);
                    }}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClick}
                    className={`px-6 py-2 text-sm font-semibold text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 
              ${isVerified ? "bg-gray-900 hover:bg-orange-600" : "bg-green-600 hover:bg-green-700"}`}
                  >
                    {isVerified ? "Update Password" : "Verify Password"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {/* pending */}
        <ForgotPasswordModal
          isOpen={forgotPassModel}
          onClose={() => setForgotPassModel(false)}
          mode="loggedIn"
          token={token}
        />
      </div>
    </div>
  );
};
