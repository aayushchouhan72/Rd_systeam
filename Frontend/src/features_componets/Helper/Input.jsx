const Input = ({ icon, label, ...props }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
          {icon}
        </span>
        <input
          {...props}
          required
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none"
        />
      </div>
    </div>
  );
};

export default Input;
