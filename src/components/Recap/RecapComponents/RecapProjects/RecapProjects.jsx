import { useEffect, useRef } from 'react';
import { useHorizontalScroll } from "../../../../hooks/useHorizontalScroll";
import GlassContainer from "./GlassContainer";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import RecapSlide from './RecapSlide';
import { useThree } from '@react-three/fiber';



function RecapProjects() {
    const { horizontalOffset } = useHorizontalScroll(false);
    const { viewport } = useThree();
    const translateX = horizontalOffset * viewport.factor / 2.2;
    const swiperWrapperRef = useRef(null);
    const swiperRef = useRef(null);
    console.log(viewport.factor);

    // Intro section data
    const introData = {
        image: "/images/FH24_4.jpeg",
        title: "Featured Projects",
        description: "Explore finalist projects created during this hackathon!"
    };

    // Projects data
    const projects = [
        {
            image: "/images/Projects/FraserhacksRhythmConductor.jpg",
            makerName: "Yang Xue",
            projectName: "RhythmConductor",
            link: "https://devpost.com/software/rhythmconductor"
        },
        {
            image: "/images/Projects/FraserhacksLogicraft.png",
            makerName: "shaan Kelkar, Vivaan Sugandh, Jerry Zeng, Aryan Vasudevan",
            projectName: "Logicraft",
            link: "https://devpost.com/software/logicraft"
        },
        {
            image: "/images/Projects/FraserhacksMartialVision.jpg",
            makerName: "Victor Yu, Hasan Mustafa, EimaiOKanenas, Anshuman Routray",
            projectName: "MartialVision",
            link: "https://devpost.com/software/martialvision"
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
        <div className="flex flex-col px-2 justify-center items-center min-h-screen gap-4 w-1/2"
            style={{ transform: `translateX(${translateX}px) translateY(-${150}px)` }}
        >
            {/* Section 1: Large wide rectangular box on top - Intro to Projects */}
            <div className="z-10 w-4/5 md:w-3/4 lg:w-2/3">
            <GlassContainer 
                translateX={translateX * 0.1} 
                className="p-4 md:p-5 lg:p-5 mb-4 md:mb-5 lg:mb-5 relative z-10 flex flex-row"
            >
                <img 
                    src={introData.image} 
                    alt="Projects Intro"
                    className="object-cover rounded-lg h-40 w-40 md:h-52 md:w-52 lg:h-64 lg:w-64"
                />
                <div className="flex flex-col h-40 md:h-52 lg:h-64 pl-4 md:pl-5 lg:pl-6 justify-center text-white flex-1 pr-4 md:pr-5 lg:pr-6">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-2 lg:mb-3">{introData.title}</div>
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

