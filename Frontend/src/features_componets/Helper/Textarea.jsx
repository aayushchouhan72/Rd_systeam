const Textarea = ({ icon, label, ...props }) => (
  <div className="space-y-2 md:col-span-2">
    <label className="text-sm text-gray-400">{label}</label>
    <div className="relative">
      <span className="absolute left-4 top-4 text-blue-500">{icon}</span>
      <textarea
        {...props}
        rows={3}
        required
        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none resize-none"
      />
    </div>
  </div>
);

export default Textarea;
