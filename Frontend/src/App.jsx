import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import socket from "./utils/socket.js";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import Logout from "./components/Logout.jsx";
import Signup from "./Pages/Signup.jsx";
import { useAuthStore } from "./store/auth.store.js";
import RegisterRD from "./components/RegisterForRd.jsx";
import AnimatedPage from "./components/AnimatedPage.jsx";
import StartRDPlan from "./components/RdStart.jsx";
import PayRDpage from "./components/PayRDpage.jsx";
import Message from "./features_componets/chat/Message.jsx";
import { useUserStore } from "./store/register.store.js";
import Profile from "./features_componets/profile-Section/Profile.jsx";
function App() {
  const navigate = useNavigate();
  const { authUser, ischecking, check, logout } = useAuthStore();
  useEffect(() => {
    check();
  }, []);

  if (ischecking) {
    return <AnimatedPage />;
  }

  return (
    <>
      <Toaster />
      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={
            authUser ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/home/registerforrd" element={<RegisterRD />} />
        <Route path="/home/startRd" element={<StartRDPlan />} />
        <Route path="/home/payRd" element={<PayRDpage />} />
        <Route path="/home/investermessage" element={<Message />} />
        <Route path="/home/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
