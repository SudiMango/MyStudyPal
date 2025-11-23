import { MoveUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const StartCTA = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full max-w-[800px] mb-10 px-5 max-[850px]:px-5 min-[850px]:px-0">
            <div className="flex flex-col justify-center items-center w-full bg-(--discord-blurple)/20 rounded-xl shadow-2xl p-5 space-y-2">
                <label className="text-3xl font-bold text-center">
                    Stop wasting time studying.
                </label>
                <label className="opacity-60 text-center">
                    Join ,000+ students crushing their exams. Start studying
                    faster for free.
                </label>
                <Link
                    href="/signup"
                    className="mt-5 text-lg flex flex-row bg-(--discord-blurple) items-center justify-center hover:bg-(--discord-blurple-hover) p-3 rounded-xl cursor-pointer"
                >
                    Start learning faster
                    <MoveUpRight className="ml-2" />
                </Link>
            </div>
        </div>
    );
};

export default StartCTA;
