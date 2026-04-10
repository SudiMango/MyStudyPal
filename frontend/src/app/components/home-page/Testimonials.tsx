import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";

const Testimonials = () => {
    const ratings = [
        {
            name: "Sudipto Islam",
            majorAndUni: "Computer Science @ UBC",
            profile: "/profile-pics/pfp1.jpg",
            content:
                "I recommend this if you have a hard time studying. It removes the procrastination of getting started and has my attention way longer than other methods.",
        },
        {
            name: "Sarah Chen",
            majorAndUni: "Biology @ UofT",
            profile: "/profile-pics/pfp2.jpg",
            content:
                "Honestly a lifesaver for finals week. The AI summaries saved me hours of reading.",
        },
        {
            name: "James Wilson",
            majorAndUni: "History @ Oxford",
            profile: "/profile-pics/pfp3.jpg",
            content:
                "The flashcard generation is incredibly accurate. Makes memorizing dates actually bearable.",
        },
        {
            name: "Emily Rodriguez",
            majorAndUni: "Engineering @ Waterloo",
            profile: "/profile-pics/pfp1.jpg",
            content:
                "Finally an AI tool that actually helps me learn instead of just giving me the answers.",
        },
        {
            name: "Michael Chang",
            majorAndUni: "Business @ Harvard",
            profile: "/profile-pics/pfp2.jpg",
            content:
                "My productivity has doubled since I started using this. Simple, effective, and clean UI.",
        },
        {
            name: "Priya Patel",
            majorAndUni: "Psychology @ McGill",
            profile: "/profile-pics/pfp3.jpg",
            content:
                "Love the ethical approach. It feels like a real study buddy, not a cheat tool.",
        },
        {
            name: "David Kim",
            majorAndUni: "Chemistry @ UCLA",
            profile: "/profile-pics/pfp1.jpg",
            content:
                "Super intuitive. I use it every day for my lab reports and exam prep.",
        },
        {
            name: "Sophie Martin",
            majorAndUni: "Arts @ NYU",
            profile: "/profile-pics/pfp2.jpg",
            content:
                "Best study investment I've made this year. Totally worth it.",
        },
    ];

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-200 mb-10">
            <div className="flex flex-row justify-center items-center mr-auto text-sm mt-5 px-5 [@media(min-width:850px)]:px-0">
                <Star className="h-5 w-5 text-(--discord-blurple) mr-1.5 fill-current" />
                <label className="text-(--discord-blurple)">Testimonials</label>
            </div>

            <label className="mr-auto font-bold text-3xl my-3 px-5 [@media(min-width:850px)]:px-0">
                Trust 1,000+ other students
            </label>

            <Marquee
                autoFill
                play
                direction="right"
                gradient
                gradientColor="#282b30"
            >
                {ratings.map((rating) => (
                    <div className="w-100 h-50 bg-(--discord-gray-4) border border-(--discord-blurple) mx-6 rounded-lg flex flex-col">
                        <label className="text-md p-3">{rating.content}</label>
                        <div className="flex flex-row items-center space-x-3 p-2 ml-2">
                            <Image
                                src={rating.profile}
                                alt="Profile image"
                                width={50}
                                height={50}
                                priority
                                className="rounded-full w-9 h-9 outline-2 outline-white object-cover"
                            />
                            <div className="flex flex-col">
                                <label className="text-sm">{rating.name}</label>
                                <label className="text-xs opacity-50">
                                    {rating.majorAndUni}
                                </label>
                            </div>
                        </div>
                    </div>
                ))}
            </Marquee>
        </div>
    );
};

export default Testimonials;
