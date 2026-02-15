import { Flashcard } from "@/lib/api/flashcard-api";
import { Lightbulb, LightbulbOff, SquareCheck, Star } from "lucide-react";
import React from "react";

interface FlashcardViewProps {
    flashcard: Flashcard;
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
    return (
        <div className="relative h-80 w-full" style={{ perspective: "1000px" }}>
            <div
                onClick={handleShowAnswer}
                className={`absolute inset-0 bg-(--discord-gray-4) p-5 shadow-lg rounded-xl flex flex-col border-2 border-(--discord-blurple) items-center justify-center ${
                    canTransition ? "transition-transform duration-300" : ""
                }`}
                style={{
                    transformStyle: "preserve-3d",
                    transform: `
                ${showAnswer ? "rotateX(180deg)" : "rotateX(0deg)"}
                ${
                    slideDirection === "right"
                        ? "translateX(10%) scale(0.95)"
                        : slideDirection === "left"
                        ? "translateX(-10%) scale(0.95)"
                        : "translateX(0) scale(1)"
                }
            `,
                    opacity: slideDirection ? 0.8 : 1,
                }}
            >
                {/* Question side */}

                {/* Top right icons */}
                <div
                    className="absolute top-4 right-4 space-x-3 opacity-80 flex flex-row items-center z-10"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    {/* Hint */}
                    <div
                        className={`flex flex-row rounded-lg p-1 space-x-1 ${
                            showHint ? "bg-(--discord-gray-2)" : ""
                        }`}
                    >
                        {showHint && (
                            <label className="text-sm">{flashcard.hint}</label>
                        )}
                        <button onClick={handleShowHint}>
                            {showHint ? (
                                <LightbulbOff className="w-5 h-5 hover:text-(--discord-blurple)" />
                            ) : (
                                <Lightbulb className="w-5 h-5 hover:text-(--discord-blurple)" />
                            )}
                        </button>
                    </div>

                    {/* Star flashcard */}
                    <button className="p-1" onClick={handleStarFlashcard}>
                        <Star
                            className={`w-5 h-5 hover:text-(--discord-blurple) ${
                                flashcard.starred ? "fill-current" : ""
                            }`}
                        />
                    </button>

                    {/* Mark flashcard as reviewed */}
                    <button
                        className="p-1"
                        onClick={handleReviewFlashcard}
                        disabled={isReviewing.has(flashcard.flashcardId)}
                    >
                        <SquareCheck
                            className={`w-5 h-5 hover:text-(--discord-blurple) ${
                                flashcard.reviewed
                                    ? "fill-green-800 text-green-300"
                                    : ""
                            }`}
                        />
                    </button>
                </div>

                {/* Answer side */}
                {/* Top right icons */}
                <div
                    className="absolute bottom-4 right-4 space-x-3 opacity-80 flex flex-row items-center z-10"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateX(180deg)",
                    }}
                >
                    {/* Star flashcard */}
                    <button className="p-1" onClick={handleStarFlashcard}>
                        <Star
                            className={`w-5 h-5 hover:text-(--discord-blurple) ${
                                flashcard.starred ? "fill-current" : ""
                            }`}
                        />
                    </button>

                    {/* Mark flashcard as reviewed */}
                    <button
                        className="p-1"
                        onClick={handleReviewFlashcard}
                        disabled={isReviewing.has(flashcard.flashcardId)}
                    >
                        <SquareCheck
                            className={`w-5 h-5 hover:text-(--discord-blurple) ${
                                flashcard.reviewed
                                    ? "fill-green-800 text-green-300"
                                    : ""
                            }`}
                        />
                    </button>
                </div>

                {/* Question and answer */}
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center p-5"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <label className="opacity-50 text-sm">Question</label>
                    <label className="my-3 text-center text-lg">
                        {flashcard.question}
                    </label>
                    <label className="opacity-50 text-sm text-center">
                        Click to reveal answer.
                    </label>
                </div>

                <div
                    className="absolute inset-0 flex flex-col items-center justify-center p-5"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateX(180deg)",
                    }}
                >
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
    );
};

export default FlashcardViewer;
