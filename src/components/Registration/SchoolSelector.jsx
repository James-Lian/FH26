import { useState } from "react";

const SCHOOL_OPTIONS = [
  "John Fraser",
  "Saint Francis Xavier",
  "Glenforest",
  "Applewood",
  "Port Credit",
  "Other",
];

const inputClass =
  "w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50";

const FIXED_SCHOOLS = SCHOOL_OPTIONS.slice(0, -1);

function RedGradientBorder({ children }) {
  return (
    <div className="relative rounded-lg p-[2px] bg-gradient-to-r from-red-500 via-red-600 to-rose-600">
      <div className="relative z-10 rounded-[6px] bg-gray-950 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default function SchoolSelector({ value, onChange, id = "school", required, error }) {
  const isOtherByValue = value !== "" && !FIXED_SCHOOLS.includes(value);
  const [otherSelected, setOtherSelected] = useState(false);
  const selectValue =
    isOtherByValue ? "Other" : otherSelected ? "Other" : value;
  const hasError = error && required;

  const handleSelectChange = (e) => {
    const v = e.target.value;
    if (v === "Other") {
      setOtherSelected(true);
      onChange("");
    } else {
      setOtherSelected(false);
      onChange(v);
    }
  };

  const handleOtherChange = (e) => {
    onChange(e.target.value);
  };

  const selectEl = (
    <select
      id={id}
      value={selectValue}
      onChange={handleSelectChange}
      className={`${inputClass} appearance-none cursor-pointer pr-10 bg-[length:12px] bg-[right_0.75rem_center] bg-no-repeat`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
      }}
    >
      <option value="" className="bg-gray-900 text-white">
        Select your school
      </option>
      {SCHOOL_OPTIONS.map((opt) => (
        <option key={opt} value={opt} className="bg-gray-900 text-white">
          {opt}
        </option>
      ))}
    </select>
  );

  const otherInputEl = selectValue === "Other" && (
    <input
      type="text"
      value={value}
      onChange={handleOtherChange}
      placeholder="Please Specify School Name"
      className={`${inputClass} mt-2`}
      aria-label="School name (other)"
    />
  );

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-white/90 mb-1">
        School
        {required && <span className="text-purple-400"> *</span>}
        {hasError && <span className="text-red-400"> required</span>}
      </label>
      {hasError ? (
        <RedGradientBorder>
          <div>
            {selectEl}
            {otherInputEl}
          </div>
        </RedGradientBorder>
      ) : (
        <>
          {selectEl}
          {otherInputEl}
        </>
      )}
    </div>
  );
}
