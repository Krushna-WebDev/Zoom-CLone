import Signup from "./pages/Signup";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import ChatLayout from "./pages/Chat/ChatLayout";
import NotFound404 from "./pages/NotFound404";
import History from "./pages/History";
import { Setting } from "./pages/Setting";
import About from "./pages/About";
import Features from "./pages/Features";
import BugReport from "./pages/BugReport";

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
  const showNavbar = [
    "/",
    "/login",
    "/signup",
    "/history",
    "/settings",
    "/about",
    "/features",
    "/bug-report",
  ].includes(location.pathname);
  return (
    <div>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/bug-report" element={<BugReport />} />
        <Route path="/notfound" element={<NotFound404 />} />
        <Route path="/chatarea/:meetingId" element={<ChatLayout />} />
      </Routes>
      {showNavbar && <Footer />}
    </div>
  );
}

export default App;
