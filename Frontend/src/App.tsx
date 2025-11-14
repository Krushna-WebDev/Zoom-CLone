import React, { useState } from "react";
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
  const [loginModel, setLoginModel] = useState(false);
  return (
    <div>
      {showNavbar && (
        <Navbar loginModel={loginModel} setLoginModel={setLoginModel} />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <Home loginModel={loginModel} setLoginModel={setLoginModel} />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chatarea/:meetingId" element={<ChatLayout />} />
      </Routes>
    </div>
  );
}

export default App;
