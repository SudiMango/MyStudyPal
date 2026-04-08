import { MoveUpRight, ShieldCheck } from "lucide-react";
import React from "react";
import Image from "next/image";
import FlashcardDemo from "./FlashcardDemo";
import Link from "next/link";

const HeroSection = () => {
    return (
        <div className="p-5 flex justify-center items-center w-full pb-20 bg-linear-to-b from-(--discord-gray-3) to-(--discord-blurple-hover)/50 from-50%">
            <div className="flex flex-col items-center justify-center w-full max-w-200">
                {/*  */}
                <div className="flex flex-row justify-center items-center mr-auto text-sm mt-5">
                    <ShieldCheck className="h-5 w-5 text-(--discord-blurple) mr-1.5" />
                    <label className="text-(--discord-blurple)">
                        Ethical AI, maintaining academic integrity
                    </label>
                </div>

                {/*  */}
                <label className="mr-auto font-bold text-4xl my-3">
                    Study 10x faster with AI.
                </label>

                {/* Desktop version */}
                <div className="mr-auto mb-5 hidden sm:flex items-center">
                    <Link
                        href="/signup"
                        className="text-lg flex flex-row bg-(--discord-blurple) items-center justify-center hover:bg-(--discord-blurple-hover) p-3 rounded-xl mr-auto cursor-pointer"
                    >
                        Start studying faster
                        <MoveUpRight className="ml-2" />
                    </Link>

                    <div className="ml-7 flex flex-row justify-center items-center">
                        <Image
                            src="/profile-pics/pfp1.jpg"
                            alt="Profile image"
                            width={50}
                            height={50}
                            priority
                            className="rounded-full w-8 h-8 outline-2 outline-white object-cover"
                        />
                        <Image
                            src="/profile-pics/pfp2.jpg"
                            alt="Profile image"
                            width={50}
                            height={50}
                            priority
                            className="rounded-full w-8 h-8 outline-2 outline-white -ml-3 object-cover"
                        />
                        <Image
                            src="/profile-pics/pfp3.jpg"
                            alt="Profile image"
                            width={50}
                            height={50}
                            priority
                            className="rounded-full w-8 h-8 outline-2 outline-white -ml-3 object-cover"
                        />

                        <label className="ml-3 opacity-55 text-sm">
                            Loved by 1,000+ students
                        </label>
                    </div>
                </div>

                {/* Mobile version */}
                <div className="mb-5 mt-2 flex flex-col items-center sm:hidden mr-auto w-full px-2">
                    <Link
                        href="/signup"
                        className="mb-5 w-full flex flex-row justify-center items-center text-lg bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) p-3 rounded-xl mr-auto"
                    >
                        Start studying faster
                        <MoveUpRight className="ml-2" />
                    </Link>

                    <div className="flex flex-row justify-center items-center">
                        <Image
                            src="/profile-pics/pfp1.jpg"
                            alt="Profile image"
                            width={50}
                            height={50}
                            priority
                            className="rounded-full w-8 h-8 outline-2 outline-white object-cover"
                        />
                        <Image
                            src="/profile-pics/pfp2.jpg"
                            alt="Profile image"
                            width={50}
                            height={50}
                            priority
                            className="rounded-full w-8 h-8 outline-2 outline-white -ml-3 object-cover"
                        />
                        <Image
                            src="/profile-pics/pfp3.jpg"
                            alt="Profile image"
                            width={50}
                            height={50}
                            priority
                            className="rounded-full w-8 h-8 outline-2 outline-white -ml-3 object-cover"
                        />

                        <label className="ml-3 opacity-55 text-sm">
                            Loved by 1,000+ students
                        </label>
                    </div>
                </div>

                {/* Flashcard part */}
                <FlashcardDemo />
            </div>
        </div>
    );
};

export default HeroSection;
