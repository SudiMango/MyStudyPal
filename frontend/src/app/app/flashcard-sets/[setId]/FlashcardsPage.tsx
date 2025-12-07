"use client";

import AllFlashcardsPanel from "@/app/components/flashcards-page/AllFlashcardsPanel";
import FlashcardViewer from "@/app/components/flashcards-page/FlashcardViewer";
import InteractPanel from "@/app/components/flashcards-page/InteractPanel";
import NavigationControls from "@/app/components/flashcards-page/NavigationControls";
import { useFlashcards } from "@/app/components/hooks/useFlashcards";
import { Loader, Settings, Shuffle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const FlashcardsPage = () => {
    const router = useRouter();

    const params = useParams();
    const setId = params.setId as string;

    const {
        isLoading,
        flashcards,
        flashcardSet,
        currIndex,
        showHint,
        showAnswer,
        slideDirection,
        canTransition,
        isReviewing,
        goRight,
        goLeft,
        handleStarFlashcard,
        handleReviewFlashcard,
        handleShowHint,
        handleShowAnswer,
        shuffleFlashcards,
        fetchEverything,
    } = useFlashcards(setId);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-20">
                <Loader className="w-10 h-10 animate-spin text-gray-400" />
                <p className="mt-4 text-gray-400">Loading flashcards...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen w-full p-5 mt-5 overflow-x-hidden">
            <div className="flex flex-col justify-center items-center w-full h-full max-w-[600px]">
                <div className="mr-auto mb-2 opacity-70 text-sm">
                    <button
                        className="underline hover:opacity-85 cursor-pointer"
                        onClick={() => router.push("/app/flashcard-sets")}
                    >
                        flashcard-sets
                    </button>
                    <label> / </label>
                    <button
                        className="underline hover:opacity-85 cursor-pointer"
                        onClick={() => router.refresh()}
                    >
                        {flashcardSet?.name}
                    </button>
                </div>
                <div className="flex flex-row items-center w-full mb-3">
                    <label className="mr-auto text-2xl">
                        {flashcardSet?.icon} {flashcardSet?.name}
                    </label>
                    <div className="space-x-3">
                        <button className="rounded-full bg-(--discord-gray-1) hover:bg-(--discord-gray-2) group p-3">
                            <Settings className="w-5 h-5 group-hover:text-(--discord-blurple)" />
                        </button>
                        <button
                            onClick={shuffleFlashcards}
                            className="rounded-full bg-(--discord-gray-1) hover:bg-(--discord-gray-2) group p-3"
                        >
                            <Shuffle className="w-5 h-5 group-hover:text-(--discord-blurple)" />
                        </button>
                    </div>
                </div>

                {flashcards.length > 0 ? (
                    <>
                        {/* Flashcard */}
                        <FlashcardViewer
                            flashcard={flashcards[currIndex]}
                            slideDirection={slideDirection}
                            canTransition={canTransition}
                            handleShowHint={handleShowHint}
                            handleStarFlashcard={(e) =>
                                handleStarFlashcard(currIndex, e)
                            }
                            handleReviewFlashcard={(e) =>
                                handleReviewFlashcard(currIndex, e)
                            }
                            isReviewing={isReviewing}
                            showHint={showHint}
                            showAnswer={showAnswer}
                            handleShowAnswer={handleShowAnswer}
                        />

                        {/* Nagivation controls */}
                        <NavigationControls
                            currIndex={currIndex}
                            totalFlashcards={flashcards.length}
                            onPrevious={goLeft}
                            onNext={goRight}
                        />
                    </>
                ) : (
                    <div className="flex items-center justify-center h-48">
                        <p>This flashcard set is empty.</p>
                    </div>
                )}

                {/* Interact */}
                <InteractPanel />

                {/* All flashcards panel */}
                <AllFlashcardsPanel
                    flashcards={flashcards}
                    onStarFlashcard={handleStarFlashcard}
                    onReviewFlashcard={handleReviewFlashcard}
                    isReviewing={isReviewing}
                    fetchEverything={fetchEverything}
                />
            </div>
        </div>
    );
};

export default FlashcardsPage;
