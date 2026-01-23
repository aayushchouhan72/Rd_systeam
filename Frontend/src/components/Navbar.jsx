import React, { useEffect } from "react";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router";

import socket from "../utils/socket";
import { useUserStore } from "../store/register.store";
import { useAuthStore } from "../store/auth.store";
import toast from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();
  //    Menu  display or not
  const [menuOpen, setMenuOpen] = useState(false);
  const isMenuOpened = menuOpen ? "flex" : "hidden";
  const [data, setdata] = useState([]);

  //    Get authUser
  const { authUser } = useUserStore();
  const { check } = useAuthStore();
  //  Handle open chat compoent
  const handleChat = async () => {
    try {
      setMenuOpen(!menuOpen);
      const res = await check();
      setdata(res.email);
      data
        ? navigate("/home/investermessage")
        : toast.error("Login first to chat");
    } catch (error) {
      console.log("error in the navigate to chat component", error.message);
    }
  };

  useEffect(() => {}, [authUser]);

  return (
    <div className="fixed top-0 left-0 z-50 w-full h-auto p-1 flex flex-col items-center justify-center">
      <div className="w-full md:w-[70vw]  h-full bg-gray-300/40 backdrop-blur-md rounded-3xl  md:rounded-full flex px-4 py-5">
        <div className="w-1/2 h-full px-4 flex items-center  font-extrabold ">
          RD-Systeam
        </div>
        <div className="w-1/2 h-full  flex flex-row-reverse items-center  px-4">
          <Menu
            onClick={() => {
              setMenuOpen(!menuOpen);
            }}
            className="font-bold"
          />
        </div>
      </div>
      <div
        className={`${isMenuOpened} w-full rounded-3xl md:w-[70vw] h-auto bg-gray-300/40 backdrop-blur-md mt-2  flex flex-col transition-1000`}
      >
        <div className="text-center p-3 w-full">
          <button
            onClick={() => {
              handleChat();
            }}
            className="w-full cursor-pointer"
          >
            Chat
          </button>
        </div>
        <div className="text-center p-3 w-full ">
          <button
            onClick={() => {
              setMenuOpen(!menuOpen);
              navigate("/home/profile");
            }}
            className="w-full cursor-pointer"
          >
            Profile
          </button>
        </div>
        <div className="text-center p-3 w-full">
          <button
            onClick={() => {
              setMenuOpen(!menuOpen);
              navigate("/home");
            }}
            className="w-full cursor-pointer"
          >
            About
          </button>
        </div>
        <div className="text-center p-3 w-full">
          <button
            onClick={() => {
              setMenuOpen(!menuOpen);
              navigate("/home");
            }}
            className="w-full cursor-pointer"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
