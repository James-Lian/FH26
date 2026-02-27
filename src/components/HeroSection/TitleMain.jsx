import RegistrationButton from "../Navbar/RegistrationButton";
import MinecraftNumbers from "../MinecraftNumbers";

export default function TitleMain() {
  return (
    <div className="relative mt-24 ml-8 sm:mt-24 sm:ml-24 md:mt-32 md:ml-36 lg:mt-54 lg:ml-48 text-white">
      <span
        className="absolute inset-0 text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight
               text-fuchsia-800
               -z-10
               translate-x-[-6px] translate-y-[6px]"
        style={{
          textShadow: `
        0 0 14px rgba(217,70,239,0.6),
        0 0 34px rgba(217,70,239,0.45),
        0 0 70px rgba(168,85,247,0.35)
      `,
        }}
      >
        <MinecraftNumbers>FraserHacks26</MinecraftNumbers>
      </span>
      <h1 className="text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-fuchsia-300 to-purple-500 ">
        <MinecraftNumbers>FraserHacks26</MinecraftNumbers>
      </h1>
      <div className="text-base md:text-lg lg:text-xl xl:text-2xl">
        <div>
          <MinecraftNumbers>March 26, 2026</MinecraftNumbers> • In-person event
        </div>
        <div className="flex flex-row mb-5">
          <div className="font-black mr-2">Largest</div>
          <div>Mississauga highschool hackathon</div>
        </div>
        <div className="flex flex-row">
          <RegistrationButton />
          <div className="font-black ml-3 mt-2">(Due <MinecraftNumbers>March 16th, 2026</MinecraftNumbers>!)</div>
        </div>
      </div>
    </div>
  );
}
