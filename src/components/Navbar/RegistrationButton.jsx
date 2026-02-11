function RegistrationButton() {
  return (
    <a
      href="/registration"
      className="relative inline-flex items-center justify-center px-5 py-2 font-semibold text-white rounded-lg group no-underline"
    >
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></span>

      <span className="absolute inset-[2px] rounded-2xl bg-gradient-to-r from-purple-950 via-pink-950 to-gray-950 transition-all duration-300 group-hover:opacity-0"></span>

      <span className="relative z-10">Register &gt;&gt;</span>
    </a>
  );
}

export default RegistrationButton;
