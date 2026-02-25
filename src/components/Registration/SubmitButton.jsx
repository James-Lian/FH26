export default function SubmitButton({ children }) {
  return (
    <button
      type="submit"
      className="relative w-full inline-flex items-center justify-center px-5 py-2.5 font-semibold text-white rounded-lg group overflow-hidden mt-2"
    >
      <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />
      <span className="absolute inset-[2px] rounded-lg bg-gradient-to-r from-purple-950 via-pink-950 to-gray-950 transition-all duration-300 group-hover:opacity-0"></span>
      <span className="relative z-10">{children}</span>
    </button>
  );
}
