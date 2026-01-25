import React, { useEffect, useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ProfileCard from "./ProfileCard.jsx";

const Profile = () => {
  const starsRef = useRef(null);
  useGSAP(() => {
    if (starsRef.current) {
      gsap.to(starsRef.current, {
        backgroundPosition: "2000px 0",
        duration: 150,
        ease: "none",
        repeat: -1,
      });
    }
  });

  return (
    <div className="relative min-h-screen bg-[#020617] text-white overflow-hidden">
      {/* 🌌 GALAXY BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div
          ref={starsRef}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/stardust.png')",
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      {/* 🧩 CENTER CHAT BOX */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-4xl flex  justify-center items-center">
          <ProfileCard />
        </div>
      </div>
    </div>
  );
};

export default Profile;
