import axios from "axios";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../Context/Context";
import { ModalContext } from "../../Context/ModelContext";

const Navbar = () => {
  const { user, setUser, token, setToken } = useContext(UserContext)!;
  const { setLoginModel } = useContext(ModalContext)!;
  const [open, setopen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/auth/logout",
        {},
        { withCredentials: true },
      );
      setUser(null);
      setToken(null);
    } catch (error) {
      console.log("Error during logout", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/20 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <img className="w-9 h-9 sm:w-10 sm:h-10" src="logo.png" alt="Chattique Logo" />
          <h1 className="text-xl sm:text-2xl font-poppins font-bold text-gray-800 uppercase">
            Chattique
          </h1>
        </Link>

        <nav className="hidden md:flex gap-4 sm:gap-6">
          <Link
            to="/"
            className="relative px-3 py-2 rounded-2xl font-raleway text-gray-700 hover:text-gray-900 transition-colors
               before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-orange-500
               before:transition-all hover:before:w-full"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="relative px-3 py-2 rounded-2xl font-raleway text-gray-700 hover:text-gray-900 transition-colors
               before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-orange-500
               before:transition-all hover:before:w-full"
          >
            About
          </Link>

          <Link
            to="/features"
            className="relative px-3 py-2 rounded-2xl font-raleway text-gray-700 hover:text-gray-900 transition-colors
               before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-orange-500
               before:transition-all hover:before:w-full"
          >
            Features
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white/70 p-2 text-gray-700 shadow-sm"
            aria-label="Toggle navigation menu"
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
                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>

        {user ? (
          <div className="relative flex items-center gap-4">
            {/* User Trigger Button */}
            <button
              onClick={() => setopen(!open)}
              className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-3 shadow-sm transition-all hover:border-orange-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-white">
                <img
                  src={user?.profilePic || "/defaultProfile.jpg"}
                  alt={user?.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <span className="hidden sm:block max-w-[100px] truncate text-sm font-semibold text-gray-700">
                {user.name}
              </span>

              {/* Animated Chevron */}
              <svg
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {open && (
              <>
                {/* Invisible backdrop to close menu when clicking outside */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setopen(false)}
                ></div>

                <div className="absolute right-0 top-12 z-20 w-48 origin-top-right rounded-xl border border-gray-100 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="truncate text-sm font-medium text-gray-900">
                      {user.email || user.name}
                    </p>
                  </div>

                  <button
                    onClick={() => setopen(false)}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    Profile
                  </button>

                  <Link
                    to="/settings"
                    onClick={() => setopen(false)}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    Settings
                  </Link>

                  <Link
                    to="/history"
                    onClick={() => setopen(false)}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    History
                  </Link>

                  <div className="my-1 border-t border-gray-100"></div>

                  <button
                    onClick={() => {
                      logout();
                      setopen(false);
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={() => setLoginModel(true)}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 p-0.5 text-sm font-medium text-white shadow-lg transition-all hover:text-white focus:outline-none focus:ring-4 focus:ring-orange-300 group-hover:from-orange-600 group-hover:to-orange-700 sm:text-base"
          >
            <span className="relative rounded-md bg-opacity-0 px-4 py-2 transition-all duration-75 ease-in group-hover:bg-opacity-0 sm:px-6">
              Login
            </span>
          </button>
        )}
        </div>
      </div>

        {mobileMenuOpen && (
          <div className="mt-3 rounded-2xl border border-white/40 bg-white/80 p-2 shadow-lg backdrop-blur md:hidden">
            <nav className="flex flex-col">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/features", label: "Features" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
