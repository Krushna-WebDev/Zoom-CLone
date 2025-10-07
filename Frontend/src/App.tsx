import React from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ChatLayout from "./pages/Chat/ChatLayout";



const App = () => {
  return (
    <>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </>
  );
};

function Layout() {
  const location = useLocation();
  const showNavbar = ["/", "/login", "/signup"].includes(location.pathname);

  return (
    <div>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chatarea/:meetingId" element={<ChatLayout />} />
      </Routes>
    </div>
  );
}

export default App;
