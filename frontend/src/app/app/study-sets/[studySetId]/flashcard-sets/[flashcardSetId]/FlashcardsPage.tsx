"use client";

import AllFlashcardsPanel from "@/app/components/flashcards-page/AllFlashcardsPanel";
import FlashcardViewer from "@/app/components/flashcards-page/FlashcardViewer";
import NavigationControls from "@/app/components/flashcards-page/NavigationControls";
import AbstractModal from "@/app/components/global/AbstractModal";
import ConfirmationModal from "@/app/components/global/ConfirmationModal";
import SettingsModal from "@/app/components/global/SettingsModal";
import { useFlashcards } from "@/app/components/hooks/useFlashcards";
import {
    deleteFlashcardSet,
    updateFlashcardSet,
} from "@/lib/api/flashcard-set-api";
import { FieldConfig } from "@/lib/types/modal";
import { formatDate } from "@/lib/util";
import { Loader, Settings, Shuffle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const UPDATE_FLASHCARD_SET_FIELDS: FieldConfig[] = [
    { key: "icon", type: "emoji", label: "Icon", row: 1, width: "w-12" },
    {
        key: "name",
        type: "text",
        label: "Set Name",
        row: 1,
        flex: 1,
        required: true,
        maxLength: 60,
        showCharCount: true,
        placeholder: "e.g., Biology Chapter 5 Final",
    },
];

const FlashcardsPage = () => {
    const router = useRouter();
    const { studySetId, flashcardSetId } = useParams();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleConfirmUpdate = async (
        flashcardSetId: string,
        name: string,
        icon: string,
    ) => {
        setIsUpdating(true);

        const payload = {
            name,
            icon,
        };

        const response = await updateFlashcardSet(flashcardSetId, payload);

        if (response.success && response.data) {
            fetchEverything();
            setIsEditModalOpen(false);
        } else {
            toast.error(response.error);
        }

        setIsUpdating(false);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        const res = await deleteFlashcardSet(flashcardSetId as string);
        if (res.success) {
            router.push(`/app/study-sets/${studySetId}`);
        } else {
            toast.error(res.error);
            setIsDeleteModalOpen(false);
        }
        setIsDeleting(false);
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
                {/* Settings */}
                <SettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    onEdit={() => {
                        setIsSettingsOpen(false);
                        setIsEditModalOpen(true);
                    }}
                    onDelete={() => {
                        setIsSettingsOpen(false);
                        setIsDeleteModalOpen(true);
                    }}
                    info={[
                        {
                            label: "Created",
                            value: formatDate(flashcardSet.createdAt),
                        },
                        {
                            label: "Updated",
                            value: formatDate(flashcardSet.updatedAt),
                        },
                        {
                            label: "Total cards",
                            value: flashcardSet.totalCards.toString(),
                        },
                    ]}
                />

                {/* Edit flashcard set modal */}
                <AbstractModal
                    isOpen={isEditModalOpen}
                    title="Edit Flashcard Set"
                    fields={UPDATE_FLASHCARD_SET_FIELDS}
                    initialValues={{
                        icon: flashcardSet?.icon ?? "📚",
                        name: flashcardSet?.name ?? "",
                    }}
                    onConfirm={({ icon, name }) =>
                        handleConfirmUpdate(
                            flashcardSet.flashcardSetId,
                            name,
                            icon,
                        )
                    }
                    onCancel={() => {
                        setIsEditModalOpen(false);
                    }}
                    isLoading={isUpdating}
                    confirmLabel="Save"
                    confirmLoadingLabel="Saving..."
                />

                {/* Delete flashcard set */}
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    message="Are you sure you want to delete this flashcard set?"
                    confirmMessage="Deleting..."
                    isLoading={isDeleting}
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
