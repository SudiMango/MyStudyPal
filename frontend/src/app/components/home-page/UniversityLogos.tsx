import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";

const UniversityLogos = () => {
    const universities = [
        { name: "UBC", logo: "/university-logos/ubc.png", width: "w-60" },
        { name: "UofT", logo: "/university-logos/uoft.jpg", width: "w-50" },
        {
            name: "UofWaterloo",
            logo: "/university-logos/uofwaterloo.png",
            width: "w-70",
        },
        {
            name: "Harvard",
            logo: "/university-logos/harvard.webp",
            width: "w-70",
        },
        {
            name: "UofOxford",
            logo: "/university-logos/uofoxford.svg",
            width: "w-70",
        },
    ];

    return (
        <div className="flex flex-col justify-center items-center w-full mb-10">
            <label className="font-bold text-xl my-5 px-5 text-center">
                Trusted by students at top universities
            </label>

            <Marquee
                autoFill
                play
                direction="left"
                gradient
                gradientColor="#282b30"
            >
                {universities.map((uni) => (
                    <Image
                        key={uni.name}
                        alt={uni.name}
                        src={uni.logo}
                        width={1000}
                        height={1000}
                        priority
                        className={`h-20 ${uni.width} mx-6 rounded-md border-2 border-(--discord-blurple) bg-white`}
                    />
                ))}
            </Marquee>
        </div>
    );
};

export default UniversityLogos;
