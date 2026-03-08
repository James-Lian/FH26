function RegistrationButton() {
  return (
    <a
      href="https://forms.gle/VWB6fc2MUEkT6px86"
      target="_blank"
      rel="noopener noreferrer"
      className="relative inline-flex items-center justify-center px-5 py-2 font-semibold text-white rounded-lg group no-underline"
    >
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></span>

      <span className="absolute inset-[2px] rounded-2xl bg-gradient-to-r from-purple-950 via-pink-950 to-gray-950 transition-all duration-300 group-hover:opacity-0"></span>

      <div className="flex flex-col">
        <div className="relative z-10">Register</div>
        <div className="relative z-10 text-xs">(PDSB-only)</div>
      </div>
      <span className="relative z-10 ml-3">&gt;&gt;</span>
    </a>
  );
}

export default RegistrationButton;
