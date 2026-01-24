const Readonly = ({ label, value, full }) => (
  <div className={`space-y-2 ${full ? "md:col-span-2" : ""}`}>
    <label className="text-sm text-gray-400">{label}</label>
    <div className="bg-white/5 border border-white/10 rounded-2xl py-3 px-4">
      {value || "-"}
    </div>
  </div>
);
export default Readonly;
