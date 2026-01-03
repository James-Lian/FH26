import { useEffect, useRef } from 'react';
import { useHorizontalScroll } from "../../../../hooks/useHorizontalScroll";
import GlassContainer from "./GlassContainer";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import RecapSlide from './RecapSlide';



function RecapProjects() {
    const { horizontalOffset } = useHorizontalScroll(false);
    const translateX = horizontalOffset * 50;
    const swiperWrapperRef = useRef(null);
    const swiperRef = useRef(null);

    // Intro section data
    const introData = {
        image: "/images/FH24_3.jpeg",
        title: "Featured Projects",
        description: "Explore the innovative projects created during this hackathon. Each project represents creativity, dedication, and technical excellence."
    };

    // Projects data
    const projects = [
        {
            image: "/images/Projects/FraserhacksRhythmConductor.jpg",
            makerName: "Yang Xue",
            projectName: "RhythmConductor"
        },
        {
            image: "/images/Projects/FraserhacksLogicraft.png",
            makerName: "Creator Name",
            projectName: "Logicraft"
        },
        {
            image: "/images/Projects/FraserhacksMartialVision.jpg",
            makerName: "Creator Name",
            projectName: "MartialVision"
        }
    ];

    useEffect(() => {
        if (swiperWrapperRef.current) {
            swiperWrapperRef.current.style.setProperty('--swiper-navigation-color', '#ffffff');
            swiperWrapperRef.current.style.setProperty('--swiper-pagination-color', '#ffffff');
            swiperWrapperRef.current.style.setProperty('--swiper-navigation-size', '24px');
        }
    }, []);

    return (
        <div className="flex flex-col px-2 justify-center items-center min-h-screen gap-3 md:gap-4 lg:gap-6 w-1/2"
            style={{ transform: `translateX(${translateX}px) translateY(-${150}px)` }}
        >
            {/* Section 1: Large wide rectangular box on top - Intro to Projects */}
            <div className="z-10 w-full md:w-4/5 lg:w-2/3">
            <GlassContainer 
                translateX={translateX * 0.1} 
                className="p-4 md:p-5 lg:p-6 mb-4 md:mb-5 lg:mb-6 relative z-10 flex flex-row"
            >
                <img 
                    src={introData.image} 
                    alt="Projects Intro"
                    className="object-cover rounded-lg h-40 w-40 md:h-52 md:w-52 lg:h-64 lg:w-64"
                />
                <div className="flex flex-col h-40 md:h-52 lg:h-64 pl-4 md:pl-6 lg:pl-8 justify-center text-white flex-1 pr-4 md:pr-6 lg:pr-8">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3 lg:mb-3">{introData.title}</div>
                    <div className="hidden md:block text-sm md:text-base opacity-70 leading-5 md:leading-6 lg:leading-6">{introData.description}</div>
                </div>
            </GlassContainer>

            {/* Bottom section: Slideshow of project cards */}
            <RecapSlide
                projects={projects}
                swiperRef={swiperRef}
                swiperWrapperRef={swiperWrapperRef}
                translateX={translateX}
            />
            </div>
        </div>
    );
}

export default RecapProjects;

