export default function AuthField({ label, id, type = "text", as = "input", ...props }) {
  const inputClass =
    "w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50";
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-white/90 mb-1">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea id={id} className={`${inputClass} min-h-[100px] resize-none`} {...props} />
      ) : (
        <input id={id} type={type} className={inputClass} {...props} />
      )}
    </div>
  );
}
