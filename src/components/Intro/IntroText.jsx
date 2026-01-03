import { useState } from "react";

export default function IntroText() {
  const [hoveredImage, setHoveredImage] = useState(null);

  const images = [
    {
      src: "/images/FH24_1.jpeg",
      alt: "Photobooth 1",
      className: "absolute top-0 left-1/2 -translate-x-[70%] -rotate-6 z-30",
      hoverTransform:
        "translate-x-[-80%] translate-y-[-20px] rotate-[-15deg] scale-110 z-50",
    },
    {
      src: "/images/FH24_2.jpeg",
      alt: "Photobooth 2",
      className: "absolute top-16 left-1/2 translate-x-[10%] rotate-3 z-20",
      hoverTransform:
        "translate-x-[30%] translate-y-[-40px] rotate-[15deg] scale-110 z-50",
    },
    {
      src: "/images/FH24_3.jpeg",
      alt: "Photobooth 3",
      className: "absolute top-32 left-1/2 -translate-x-[85%] -rotate-1 z-10",
      hoverTransform:
        "translate-x-[-100%] translate-y-[-60px] rotate-[-15deg] scale-110 z-50",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col md:flex-row items-center justify-center">
        <div className="flex flex-col relative md:w-1/4 w-4/5">
          <div className="flex justify-center items-center md:items-start text-white text-2xl md:text-3xl lg:text-4xl flex flex-col mb-8 md:mb-10 lg:mb-12">
            Welcome to the{" "}
            <div className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-shadow-2xs tracking-widest">
              Largest
            </div>
            Peel Hackathon
          </div>
          <div className="text-gray-300 text-xs md:text-sm lg:text-lg leading-5 md:leading-6">
            FraserHacks is Mississauga's largest high school hackathon organized
            entirely by students at John Fraser Secondary School. More than 100
            students from all of Peel Region will be coming together on Febuary
            12th 2026, for a full 10 hours of friendly hacking, enthusiastic
            learning, and delicious food.
          </div>
        </div>

        {/* Photobooth stack */}
        <div className="relative h-[20rem] w-[24rem] sm:h-[16rem] sm:w-[20rem] md:h-[24rem] md:w-[28rem] lg:h-[28rem] lg:w-[32rem]">
          {images.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={image.alt}
              className={`
                w-40 md:w-48 lg:w-52 xl:w-56 2xl:w-64 aspect-[3/4] object-cover
                bg-white p-1.5 md:p-2 rounded-lg shadow-2xl ring-1 ring-black/10
                transition-all duration-500 ease-out cursor-pointer
                ${image.className}
                ${hoveredImage === index ? image.hoverTransform : ""}
                ${
                  hoveredImage !== null && hoveredImage !== index
                    ? "opacity-70"
                    : ""
                }
              `}
              style={{
                boxShadow:
                  hoveredImage === index
                    ? "0 0 14px rgba(217,70,239,0.6), 0 0 34px rgba(217,70,239,0.45), 0 0 70px rgba(168,85,247,0.35)"
                    : "",
              }}
              onMouseEnter={() => setHoveredImage(index)}
              onMouseLeave={() => setHoveredImage(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
