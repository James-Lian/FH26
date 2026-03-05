import RegistrationButton from "../Navbar/RegistrationButton";
import MinecraftNumbers from "../MinecraftNumbers";
import { Tooltip } from 'react-tooltip'

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
        <div className="flex flex-row">
          <div className="font-black mr-2">Mississauga's largest high school hackathon</div>
        </div>
        <div>
          <MinecraftNumbers>March 26, 2026</MinecraftNumbers> • In-person event
        </div>
        <div className="flex flex-row items-center gap-1.5 mb-5">
          <img src="/icons/map-pin.png" className="h-[1em] w-[1em]" alt="location"/>
          <div className="font-black mr-2">John Fraser SS • No fees required</div>
        </div>
        <div className="flex flex-row mb-2">
          <RegistrationButton />
          <div className="font-black ml-3 mt-2">Due <MinecraftNumbers>Sunday, March 15th, 2026</MinecraftNumbers>!</div>
        </div>
        <div className="flex flex-col text-xs md:text-sm lg:text-base xl:text-lg font-normal">
          <a className="flex flex-row gap-1.5 items-center cursor-pointer hover:underline hover:underline-offset-3" target="_blank" href="https://www.instagram.com/fraser.hacks/" rel="noopener noreferrer">
            <img src="/icons/instagram.png" className="h-[1em] w-[1em]" alt="instagram"/>
            <div>Want to learn more? Check out our Instagram!</div>
          </a>
          <span className="underline decoration-dotted underline-offset-3 inline-block" id="tooltip">Are you a non-JFSS student?</span>
          <Tooltip
            anchorSelect="#tooltip"
            style={{
              place: bottom,
              maxWidth: '300px',
              backgroundColor: '#333333',
              opacity:'0.5',
              color: '#fff',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '15px',
              zIndex: '999',
            }}
            content="Non-JFSS students MUST be accompanied and supervised by a teacher from their respective school. If you have a teacher who's willing to come and supervise a group of students from your school, ask them to contact hi@fraserhacks.dev or DM us at fraser.hacks for further info!"
          />
        </div>
      </div>
    </div>
  );
}
