import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface UserInterface {
  email: string;
  username: string;
}

const Navbar = () => {
  const [user, setUser] = useState<UserInterface | null>();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/user/getuser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img className="w-10 h-10" src="logo.png" alt="Chattique Logo" />
          <h1 className="text-2xl font-poppins font-bold text-gray-800 uppercase">
            Chattique
          </h1>
        </Link>

        <nav className="flex gap-8 font-raleway">
          <Link 
            to="/" 
            className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            About
          </Link>
          <Link 
            to="/features" 
            className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            Features
          </Link>
        </nav>

        {loading ? (
          <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
        ) : user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="font-raleway font-medium text-gray-700">
                {user.username}
              </span>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 font-raleway text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm hover:shadow active:scale-95"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 hover:border-gray-400"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;