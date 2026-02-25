const EXPERIENCE_OPTIONS = ["Beginner", "Intermediate", "Advanced"];

const inputClass =
  "w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50";

export default function ExperienceSelector({ value, onChange, id = "experience" }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-white/90 mb-1">
        Experience
        <span className="text-white/50 font-normal"> (optional)</span>
      </label>
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
          Select experience level
        </option>
        {EXPERIENCE_OPTIONS.map((opt) => (
          <option key={opt} value={opt} className="bg-gray-900 text-white">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
