const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

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

export default function TShirtSizeSelector({ value, onChange, id = "tshirt-size", required, error }) {
  const hasError = error && required;

  const selectEl = (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputClass} appearance-none cursor-pointer pr-10 bg-[length:12px] bg-[right_0.75rem_center] bg-no-repeat`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
      }}
    >
      <option value="" className="bg-gray-900 text-white">
        Select t-shirt size
      </option>
      {TSHIRT_SIZES.map((size) => (
        <option key={size} value={size} className="bg-gray-900 text-white">
          {size}
        </option>
      ))}
    </select>
  );

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-white/90 mb-1">
        T-shirt size
        {required && <span className="text-purple-400"> *</span>}
        {hasError && <span className="text-red-400"> required</span>}
      </label>
      {hasError ? <RedGradientBorder>{selectEl}</RedGradientBorder> : selectEl}
    </div>
  );
}
