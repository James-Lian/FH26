const inputClass =
  "w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50";

function RedGradientBorder({ children }) {
  return (
    <div className="relative rounded-lg p-[2px] bg-gradient-to-r from-red-500 via-red-600 to-rose-600">
      <div className="relative z-10 rounded-[6px] bg-gray-950 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default function AuthField({ label, id, type = "text", as = "input", required, error, ...props }) {
  const hasError = error && required;
  const InputOrTextarea = as === "textarea" ? (
    <textarea id={id} className={`${inputClass} min-h-[100px] resize-none`} {...props} />
  ) : (
    <input id={id} type={type} className={inputClass} {...props} />
  );
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-white/90 mb-1">
        {label}
        {required === true && <span className="text-purple-400"> *</span>}
        {hasError && <span className="text-red-400"> required</span>}
        {required === false && <span className="text-white/50 font-normal"> (optional)</span>}
      </label>
      {hasError ? <RedGradientBorder>{InputOrTextarea}</RedGradientBorder> : InputOrTextarea}
    </div>
  );
}
