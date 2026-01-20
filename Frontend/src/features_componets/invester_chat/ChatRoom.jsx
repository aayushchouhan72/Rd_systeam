import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

import { useAuthStore } from "../../store/auth.store";
import socket from "../../utils/socket";
import { Socket } from "socket.io-client";
function ChatRoom() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to Investor Chat Room 👋", sender: "system" },
    { id: 2, text: "Hello!", sender: "other" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { authUser } = useAuthStore;
  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });
    return () => {
      socket.off("connect");
      socket.disconnect();
    };
  }, [authUser]);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: input, sender: "me" },
    ]);
    setInput("");
  };

  return (
    <div className="w-full h-[75vh] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl flex flex-col">
      {/* 🔹 HEADER */}
      <div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-white/20">
        <h2 className="text-lg font-semibold text-blue-400">
          Investor Chat Room
        </h2>
        <span className="text-xs text-green-400">● Online</span>
      </div>

      {/* 🔹 MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.map((msg) => {
          if (msg.sender === "system") {
            return (
              <div key={msg.id} className="text-center text-xs text-gray-400">
                {msg.text}
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm leading-relaxed
                ${
                  msg.sender === "me"
                    ? "ml-auto bg-blue-500 text-white"
                    : "mr-auto bg-white/20 text-white"
                }`}
            >
              {msg.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* 🔹 INPUT */}
      <div className="h-20 shrink-0 flex items-center gap-3 px-4 border-t border-white/20">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-white/10 text-white placeholder-gray-400 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
