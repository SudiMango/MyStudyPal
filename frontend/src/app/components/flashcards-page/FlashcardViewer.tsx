import { FlashcardResponse } from "@/lib/dto/flashcard-dto";
import { Lightbulb, LightbulbOff, SquareCheck, Star } from "lucide-react";
import React from "react";

interface FlashcardViewProps {
    flashcard: FlashcardResponse;
    slideDirection: "left" | "right" | null;
    canTransition: boolean;
    handleShowHint: (e: any) => void;
    handleStarFlashcard: (e: any) => void;
    handleReviewFlashcard: (e: any) => void;
    showHint: boolean;
    showAnswer: boolean;
    handleShowAnswer: () => void;
    isReviewing: Set<string>;
}

const FlashcardViewer: React.FC<FlashcardViewProps> = ({
    flashcard,
    slideDirection,
    canTransition,
    handleShowHint,
    handleStarFlashcard,
    handleReviewFlashcard,
    showHint,
    showAnswer,
    handleShowAnswer,
    isReviewing,
}) => {
    const slideStyle = {
        transform:
            slideDirection === "right"
                ? "translateX(10%) scale(0.95)"
                : slideDirection === "left"
                  ? "translateX(-10%) scale(0.95)"
                  : "translateX(0) scale(1)",
        opacity: slideDirection ? 0.8 : 1,
    };

    const sharedFaceStyle: React.CSSProperties = {
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        position: "absolute",
        inset: 0,
        transition: canTransition ? "transform 0.3s" : "none",
    };

    return (
        <div className="relative h-80 w-full" style={{ perspective: "1000px" }}>
            {/* Slide/scale wrapper */}
            <div
                className="absolute inset-0"
                style={{
                    transition: canTransition
                        ? "transform 0.3s, opacity 0.3s"
                        : "none",
                    ...slideStyle,
                }}
            >
                {/* QUESTION FACE */}
                <div
                    onClick={handleShowAnswer}
                    className="bg-(--discord-gray-4) p-5 shadow-lg rounded-xl flex flex-col border-2 border-(--discord-blurple) items-center justify-center cursor-pointer"
                    style={{
                        ...sharedFaceStyle,
                        transform: showAnswer
                            ? "rotateX(180deg)"
                            : "rotateX(0deg)",
                    }}
                >
                    {/* Top right icons - question side */}
                    <div className="absolute top-4 right-4 space-x-3 opacity-80 flex flex-row items-center z-10">
                        <div
                            className={`flex flex-row rounded-lg p-1 space-x-1 ${showHint ? "bg-(--discord-gray-2)" : ""}`}
                        >
                            {showHint && (
                                <label className="text-sm">
                                    {flashcard.hint}
                                </label>
                            )}
                            <button onClick={handleShowHint}>
                                {showHint ? (
                                    <LightbulbOff className="w-5 h-5 hover:text-(--discord-blurple)" />
                                ) : (
                                    <Lightbulb className="w-5 h-5 hover:text-(--discord-blurple)" />
                                )}
                            </button>
                        </div>
                        <button className="p-1" onClick={handleStarFlashcard}>
                            <Star
                                className={`w-5 h-5 hover:text-(--discord-blurple) ${flashcard.isStarred ? "fill-current" : ""}`}
                            />
                        </button>
                        <button
                            className="p-1"
                            onClick={handleReviewFlashcard}
                            disabled={isReviewing.has(flashcard.flashcardId)}
                        >
                            <SquareCheck
                                className={`w-5 h-5 hover:text-(--discord-blurple) ${flashcard.isReviewed ? "fill-green-800 text-green-300" : ""}`}
                            />
                        </button>
                    </div>

                    <div className="flex flex-col items-center justify-center p-5">
                        <label className="opacity-50 text-sm">Question</label>
                        <label className="my-3 text-center text-lg">
                            {flashcard.question}
                        </label>
                        <label className="opacity-50 text-sm text-center">
                            Click to reveal answer.
                        </label>
                    </div>
                </div>

                {/* ANSWER FACE */}
                <div
                    onClick={handleShowAnswer}
                    className="bg-(--discord-gray-4) p-5 shadow-lg rounded-xl flex flex-col border-2 border-(--discord-blurple) items-center justify-center cursor-pointer"
                    style={{
                        ...sharedFaceStyle,
                        transform: showAnswer
                            ? "rotateX(0deg)"
                            : "rotateX(-180deg)",
                    }}
                >
                    {/* Bottom right icons - answer side */}
                    <div className="absolute top-4 right-4 space-x-3 opacity-80 flex flex-row items-center z-10">
                        <button className="p-1" onClick={handleStarFlashcard}>
                            <Star
                                className={`w-5 h-5 hover:text-(--discord-blurple) ${flashcard.isStarred ? "fill-current" : ""}`}
                            />
                        </button>
                        <button
                            className="p-1"
                            onClick={handleReviewFlashcard}
                            disabled={isReviewing.has(flashcard.flashcardId)}
                        >
                            <SquareCheck
                                className={`w-5 h-5 hover:text-(--discord-blurple) ${flashcard.isReviewed ? "fill-green-800 text-green-300" : ""}`}
                            />
                        </button>
                    </div>

                    <div className="flex flex-col items-center justify-center p-5">
                        <label className="opacity-50 text-sm">Answer</label>
                        <label className="my-3 text-center text-lg">
                            {flashcard.answer}
                        </label>
                        <label className="opacity-50 text-sm text-center">
                            Show question.
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlashcardViewer;
