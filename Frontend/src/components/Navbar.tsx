import axios from "axios";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../Context/Context";
import { ModalContext } from "../../Context/ModelContext";

interface modelInterface {
  loginModel: boolean;
  setLoginModel: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = () => {
  const { user, setUser } = useContext(UserContext)!;
  const { setLoginModel } = useContext(ModalContext)!;

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      localStorage.removeItem("token");
    } catch (error) {
      console.log("Error during logout", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/20 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <img className="w-10 h-10" src="logo.png" alt="Chattique Logo" />
          <h1 className="text-2xl font-poppins font-bold text-gray-800 uppercase">
            Chattique
          </h1>
        </Link>

        <nav className="flex gap-4 sm:gap-6">
          {["Home", "About", "Features"].map((page) => (
            <Link
              key={page}
              to={`/${page.toLowerCase()}`}
              className="relative px-3 py-2 rounded-2xl font-raleway text-gray-700 hover:text-gray-900 transition-colors
                         before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-orange-500
                         before:transition-all hover:before:w-full"
            >
              {page}
            </Link>
          ))}
        </nav>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={user?.profilePic || "/defaultProfile.jpg"}
                  alt={`${user?.name || "User"}'s profile`}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-raleway font-medium text-gray-700">
                {user.name}
              </span>
            </div>

            <button
              onClick={logout}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 px-4 rounded-lg shadow-md text-sm font-medium transition-transform duration-200 active:scale-95"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setLoginModel(true)}
            className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg shadow-md text-sm font-medium transition-transform duration-200 active:scale-95"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
