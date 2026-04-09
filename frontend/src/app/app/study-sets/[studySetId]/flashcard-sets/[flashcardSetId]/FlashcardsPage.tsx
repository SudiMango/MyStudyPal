"use client";

import AllFlashcardsPanel from "@/app/components/flashcards-page/AllFlashcardsPanel";
import FlashcardViewer from "@/app/components/flashcards-page/FlashcardViewer";
import NavigationControls from "@/app/components/flashcards-page/NavigationControls";
import ConfirmationModal from "@/app/components/global/ConfirmationModal";
import { useFlashcards } from "@/app/components/hooks/useFlashcards";
import {
    deleteFlashcardSet,
    updateFlashcardSet,
} from "@/lib/api/flashcard-set-api";
import { Loader, Settings, Shuffle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const FlashcardsPage = () => {
    const router = useRouter();
    const { studySetId, flashcardSetId } = useParams();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const {
        isLoading,
        flashcards,
        flashcardSet,
        studySet,
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
    } = useFlashcards(studySetId as string, flashcardSetId as string);

    const handleConfirmDelete = async () => {
        setIsUpdating(true);
        const res = await deleteFlashcardSet(flashcardSetId as string);
        if (res.success) {
            router.push(`/app/study-sets/${studySetId}`);
        } else {
            alert(res.error);
            setIsUpdating(false);
            setIsDeleteModalOpen(false);
        }
    };

    if (isLoading || !flashcardSet) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-20">
                <Loader className="w-10 h-10 animate-spin text-gray-400" />
                <p className="mt-4 text-gray-400">Loading flashcards...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen w-full p-5 mt-5 overflow-x-hidden">
            <div className="flex flex-col justify-center items-center w-full h-full max-w-150">
                {/* Delete flashcard set */}
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    message="Are you sure you want to delete this flashcard set?"
                    confirmMessage="Deleting..."
                    isLoading={isUpdating}
                />

                {/* Breadcrumbs */}
                <div className="mr-auto mb-2 opacity-70 text-sm">
                    <button
                        className="underline hover:opacity-85 cursor-pointer"
                        onClick={() =>
                            router.push("/app/study-sets#flashcards")
                        }
                    >
                        study sets
                    </button>
                    <label> / </label>
                    <button
                        className="underline hover:opacity-85 cursor-pointer"
                        onClick={() =>
                            router.push(`/app/study-sets/${studySetId}`)
                        }
                    >
                        {studySet?.name}
                    </button>
                    <label> / </label>
                    <button
                        className="underline hover:opacity-85 cursor-pointer"
                        onClick={() => router.refresh()}
                    >
                        {flashcardSet?.name}
                    </button>
                </div>

                {/* Header */}
                <div className="flex flex-row items-center w-full mb-3">
                    <label className="mr-auto text-3xl font-bold flex items-center gap-3">
                        {flashcardSet?.icon} {flashcardSet?.name}
                    </label>
                    <div className="space-x-3">
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="rounded-xl bg-(--discord-gray-1) hover:bg-(--discord-gray-2) group p-2.5 border border-white/5 transition-colors"
                        >
                            <Settings className="w-5 h-5 group-hover:text-(--discord-blurple)" />
                        </button>
                        <button
                            onClick={shuffleFlashcards}
                            className="rounded-xl bg-(--discord-gray-1) hover:bg-(--discord-gray-2) group p-2.5 border border-white/5 transition-colors"
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
