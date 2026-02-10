import React, { useContext, useState } from "react";
import { UserContext } from "../../Context/Context";

export const Setting = () => {
  const { user } = useContext(UserContext)!;
  const [passwordModel, setPasswordModel] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 mt-16 font-raleway p-6">
      <div className="mx-auto max-w-5xl">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Settings
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-4 mb-2">
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
          <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
            {/* Top Section: Header & Fields */}
            <div>
              <div className="flex justify-between items-center mb-8">
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
                  <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <svg
                      className="w-5 h-5 text-gray-400 mr-3"
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
                    <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold uppercase tracking-wide">
                      Verified
                    </span>
                  </div>
                </div>

                {/* Field: Password Change */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                    Security
                  </label>
                  <button className="w-full sm:w-auto text-sm bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 px-4 py-2.5 rounded-xl font-semibold transition-colors">
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Section: Action Buttons */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
              <button className="w-full sm:w-auto text-red-600 hover:text-red-700 text-sm font-bold px-4 py-2 rounded-xl transition-colors hover:bg-red-50">
                Logout
              </button>
              <button className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Save Changes
              </button>
            </div>
          </div>

          {/* ---------------- Card 3: Danger Zone ---------------- */}
          <div className="md:col-span-3 bg-gradient-to-r from-red-50 to-white rounded-3xl p-6 border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full text-red-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
              </div>
              <div>
                <h4 className="text-red-900 font-bold">Danger Zone</h4>
                <p className="text-red-700/70 text-sm">
                  Once you delete your account, there is no going back.
                </p>
              </div>
            </div>
            <button className="whitespace-nowrap px-4 py-2 bg-white border border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors shadow-sm">
              Delete Account
            </button>
          </div>
        </div>
        {passwordModel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
            <div className="relative w-full max-w-md bg-white rounded shadow-2xl overflow-hidden p-4">
              <h1>Change Password</h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
