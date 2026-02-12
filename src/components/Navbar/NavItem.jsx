import MinecraftNumbers from "../MinecraftNumbers";

export default function NavItem({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative font-semibold tracking-tight"
    >
      {/* shadow stays in the original position */}
      <span
        className="pointer-events-none absolute inset-0 -z-10
                   opacity-0 transition-opacity duration-200 ease-out
                   group-hover:opacity-100
                   text-fuchsia-800"
        style={{
          textShadow: `
            0 0 14px rgba(217,70,239,0.6),
            0 0 34px rgba(217,70,239,0.45),
            0 0 70px rgba(168,85,247,0.35)
          `,
        }}
      >
        <MinecraftNumbers>{label}</MinecraftNumbers>
      </span>

      {/* main text moves up on hover */}
      <span
        className="relative inline-block transition-all duration-200 ease-out
                   group-hover:-translate-y-[4px]
                   group-hover:-translate-x-[-4px]
                   group-hover:text-transparent group-hover:bg-clip-text
                   group-hover:bg-gradient-to-r group-hover:from-blue-100
                   group-hover:via-fuchsia-300 group-hover:to-purple-500"
      >
        <MinecraftNumbers>{label}</MinecraftNumbers>
      </span>
    </button>
  );
}
