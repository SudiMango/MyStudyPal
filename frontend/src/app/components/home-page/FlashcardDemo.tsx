import { Lightbulb, LightbulbOff, SquareCheck, Star } from "lucide-react";
import React, { useEffect, useState } from "react";

const FlashcardDemo = () => {
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [showHint, setShowHint] = useState<boolean>(false);

    useEffect(() => {
        let t1: any, t2: any, t3: any;

        const cycle = () => {
            setShowHint(false);
            setShowAnswer(false);

            // show hint after 1 second
            t1 = setTimeout(() => setShowHint(true), 2000);

            // flip to answer after 2 seconds
            t2 = setTimeout(() => setShowAnswer(true), 3500);

            // restart cycle
            t3 = setTimeout(() => cycle(), 6000);
        };

        cycle();

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    const sharedFaceStyle: React.CSSProperties = {
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        position: "absolute",
        inset: 0,
        transition: "transform 0.3s",
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-full pointer-events-none">
            {/* Flashcard */}
            <div
                className="relative h-100 w-full"
                style={{ perspective: "1000px" }}
            >
                {/* QUESTION FACE */}
                <div
                    className="bg-(--discord-gray-4) p-5 shadow-lg rounded-xl flex flex-col border-2 border-(--discord-blurple) items-center justify-center"
                    style={{
                        ...sharedFaceStyle,
                        transform: showAnswer
                            ? "rotateX(180deg)"
                            : "rotateX(0deg)",
                    }}
                >
                    {/* Top right icons */}
                    <div className="absolute top-4 right-4 space-x-3 opacity-80 flex flex-row items-center z-10">
                        {/* Hint */}
                        <div
                            className={`flex flex-row rounded-lg p-1 space-x-1 ${
                                showHint ? "bg-(--discord-gray-2)" : ""
                            }`}
                        >
                            {showHint && (
                                <label className="text-sm">
                                    You know the answer...
                                </label>
                            )}
                            <button>
                                {showHint ? (
                                    <LightbulbOff className="w-5 h-5" />
                                ) : (
                                    <Lightbulb className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        {/* Star flashcard */}
                        <button className="p-1">
                            <Star className="w-5 h-5 fill-current" />
                        </button>

                        {/* Mark flashcard as reviewed */}
                        <button className="p-1">
                            <SquareCheck className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Question content */}
                    <div className="flex flex-col items-center justify-center p-5">
                        <label className="opacity-50 text-md">Question</label>
                        <label className="my-3 text-center text-xl">
                            How can I improve my study productivity?
                        </label>
                        <label className="opacity-50 text-md text-center">
                            Click to reveal answer.
                        </label>
                    </div>
                </div>

                {/* ANSWER FACE */}
                <div
                    className="bg-(--discord-gray-4) p-5 shadow-lg rounded-xl flex flex-col border-2 border-(--discord-blurple) items-center justify-center"
                    style={{
                        ...sharedFaceStyle,
                        transform: showAnswer
                            ? "rotateX(0deg)"
                            : "rotateX(-180deg)",
                    }}
                >
                    {/* Top right icons */}
                    <div className="absolute top-4 right-4 space-x-3 opacity-80 flex flex-row items-center z-10">
                        {/* Star flashcard */}
                        <button className="p-1">
                            <Star className="w-5 h-5" />
                        </button>

                        {/* Mark flashcard as reviewed */}
                        <button className="p-1">
                            <SquareCheck className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Answer content */}
                    <div className="flex flex-col items-center justify-center p-5">
                        <label className="opacity-50 text-md">Answer</label>
                        <label className="my-3 text-center text-xl">
                            Just use MyStudyPal!
                        </label>
                        <label className="opacity-50 text-md text-center">
                            Show question.
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlashcardDemo;
