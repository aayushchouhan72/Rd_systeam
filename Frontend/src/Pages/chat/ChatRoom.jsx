import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useAuthStore } from "../../../store/auth.store";
import socket from "../../../utils/socket";
import { useMessageStore } from "../../../store/message.store";

function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const { authUser } = useAuthStore();
  const { getmessage } = useMessageStore();

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial Load and Socket Setup
  useEffect(() => {
    const initializeChat = async () => {
      if (authUser?.email) {
        // Fix: Await the response and set local state
        const history = await getmessage(authUser.email);
        if (Array.isArray(history)) {
          setMessages(history);
        }
      }

      socket.connect();
    };

    initializeChat();

    // Listener for messages from other users
    socket.on("receive_message", (newMessage) => {
      // Ensure the received data is formatted correctly for the UI
      setMessages((prev) => [
        ...prev,
        {
          ...newMessage,
          sender: newMessage.senderId === authUser?.email ? "me" : "other",
        },
      ]);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [authUser, getmessage]);

  const sendMessage = () => {
    if (!input.trim() || !authUser?.email) return;

    const messageData = {
      text: input,
      senderId: authUser.email,
      id: Date.now(), // Unique ID for local rendering
    };

    // Update local UI immediately
    setMessages((prev) => [...prev, { ...messageData, sender: "me" }]);

    // Emit to server
    socket.emit("send_message", messageData);
    setInput("");
  };

  return (
    <div className="w-full h-[75vh] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl flex flex-col">
      <div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-white/20">
        <h2 className="text-lg font-semibold text-blue-400">
          Investor Chat Room
        </h2>
        <span className="text-xs text-green-400">● Online</span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {/* Safety check: ensure messages is an array before mapping */}
        {Array.isArray(messages) &&
          messages.map((msg) => (
            <div
              key={msg._id || msg.id}
              className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm leading-relaxed
              ${
                msg.sender === "me" || msg.senderId === authUser?.email
                  ? "ml-auto bg-blue-500 text-white"
                  : "mr-auto bg-white/20 text-white"
              }`}
            >
              {msg.text || msg.content}
              {msg.image && (
                <img src={msg.image} alt="Sent" className="rounded-lg mt-2" />
              )}
            </div>
          ))}
        <div ref={bottomRef} />
      </div>

      <div className="h-20 shrink-0 flex items-center gap-3 px-4 border-t border-white/20">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-white/10 text-white rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
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
