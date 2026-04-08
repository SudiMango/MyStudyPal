import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import React from "react";

const HowItWorks = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full max-w-200 mb-10 px-5 [@media(min-width:850px)]:px-0">
            <div className="flex flex-row justify-center items-center mr-auto text-sm mt-5">
                <BadgeCheck className="h-5 w-5 text-(--discord-blurple) mr-1.5" />
                <label className="text-(--discord-blurple)">Easy to use</label>
            </div>

            <label className="mr-auto font-bold text-3xl my-3">
                How it works
            </label>

            <div className="flex flex-col space-y-5 w-full">
                <div className="flex flex-col sm:flex-row space-y-5 sm:space-x-5 w-full">
                    <div className="bg-(--discord-gray-4) p-3 w-full h-full min-h-62.5 rounded-lg shadow-lg flex flex-col">
                        <label className="text-lg">
                            1. Upload your notes to a set
                        </label>
                        <div className="w-full h-full flex flex-1 items-center justify-center">
                            <Image
                                src="/university-logos/ubc.png"
                                alt="smth"
                                width={100}
                                height={80}
                                priority
                                className="border border-(--discord-blurple) rounded-md object-cover"
                            />
                        </div>
                    </div>
                    <div className="bg-(--discord-gray-4) p-3 w-full h-full min-h-62.5 rounded-lg shadow-lg flex flex-col">
                        <label>2. Review your flashcards</label>
                        <div className="w-full h-full flex flex-1 items-center justify-center">
                            <Image
                                src="/university-logos/ubc.png"
                                alt="smth"
                                width={100}
                                height={80}
                                priority
                                className="border border-(--discord-blurple) rounded-md object-cover"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-5 sm:space-x-5 w-full">
                    <div className="bg-(--discord-gray-4) p-3 w-full h-full min-h-62.5 rounded-lg shadow-lg flex flex-col">
                        <label>3. Test yourself</label>
                        <div className="w-full h-full flex flex-1 items-center justify-center">
                            <Image
                                src="/university-logos/ubc.png"
                                alt="smth"
                                width={100}
                                height={80}
                                priority
                                className="border border-(--discord-blurple) rounded-md object-cover"
                            />
                        </div>
                    </div>
                    <div className="bg-(--discord-gray-4) p-3 w-full h-full min-h-62.5 rounded-lg shadow-lg flex flex-col">
                        <label>4. Track your progress</label>
                        <div className="w-full h-full flex flex-1 items-center justify-center">
                            <Image
                                src="/university-logos/ubc.png"
                                alt="smth"
                                width={100}
                                height={80}
                                priority
                                className="border border-(--discord-blurple) rounded-md object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
