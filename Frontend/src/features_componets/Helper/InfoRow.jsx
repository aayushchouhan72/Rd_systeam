import React from "react";

const InfoRow = ({ icon, value }) => (
  <div
    className="flex w-full items-center gap-3 px-4 py-2 mt-2 mb-2 
    bg-white/5 rounded-xl border border-white/10"
  >
    <span className="text-gray-300 w-4 h-4">{icon}</span>
    <span className="text-gray-200 truncate">{value}</span>
  </div>
);
export default InfoRow;
