import React, { useEffect, useRef, useState } from "react";
import FlashcardDropdown from "../global/SettingsDropdown";
import {
    ChevronDown,
    ChevronUp,
    EllipsisVertical,
    SquareCheck,
    Star,
} from "lucide-react";
import {
    deleteFlashcard,
    Flashcard,
    updateFlashcard,
} from "@/lib/api/flashcard-api";
import ConfirmationModal from "../global/ConfirmationModal";
import EditFlashcardModal from "./EditFlashcardModal";

interface FlashcardListProps {
    flashcards: Flashcard[];
    onStarFlashcard: (index: number, e: any) => void;
    onReviewFlashcard: (index: number, e: any) => void;
    isReviewing: Set<string>;
    fetchEverything: () => Promise<void>;
}

const AllFlashcardsPanel: React.FC<FlashcardListProps> = ({
    flashcards,
    onStarFlashcard,
    onReviewFlashcard,
    isReviewing,
    fetchEverything,
}) => {
    const [showAllFlashcards, setShowAllFlashcards] = useState<boolean>(true);
    const [showDropdown, setShowDropdown] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Delete state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [flashcardToDelete, setFlashcardToDelete] =
        useState<Flashcard | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Editing state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(
        null
    );
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setShowDropdown(null);
            }
        };

        if (showDropdown !== null) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [showDropdown]);

    const handleDropdownToggle = (e: any, index: number) => {
        e.stopPropagation();
        setShowDropdown(showDropdown !== index ? index : null);
    };

    const handleStarClick = (index: number, e: any) => {
        e.stopPropagation();
        onStarFlashcard(index, e);
    };

    const handleReviewClick = (index: number, e: any) => {
        e.stopPropagation();
        onReviewFlashcard(index, e);
    };

    /**
     *
     * Handle flashcard set delete
     *
     */

    const handleDeleteClick = (set: Flashcard) => {
        setFlashcardToDelete(set);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (flashcardToDelete) {
            setIsDeleting(true);
            const response = await deleteFlashcard(
                flashcardToDelete.flashcardId
            );
            setIsDeleting(false);

            if (response.success) {
                fetchEverything();
            } else {
                alert(response.error);
            }
            setIsDeleteModalOpen(false);
            setFlashcardToDelete(null);
            setShowDropdown(null);
        }
    };

    /**
     *
     * Handle flashcard edit
     *
     */

    const handleEditClick = (flashcard: Flashcard) => {
        setEditingFlashcard(flashcard);
        setIsEditModalOpen(true);
    };

    const handleConfirmUpdate = async (
        flashcardId: string,
        question: string,
        answer: string,
        hint: string,
        instructions: string,
        mode: "manual" | "AI"
    ) => {
        setIsUpdating(true);
        const response = await updateFlashcard(flashcardId, {
            question,
            answer,
            hint,
            instructions,
            mode,
        });
        setIsUpdating(false);

        if (response.success) {
            fetchEverything();
            setIsEditModalOpen(false);
            setEditingFlashcard(null);
            setShowDropdown(null);
        } else {
            alert(response.error);
        }
    };

    return (
        <div className="bg-(--discord-gray-3) w-full rounded-xl shadow-lg p-5 mt-5 outline outline-(--discord-blurple) flex flex-col">
            {/* Delete flashcard modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message={`Are you sure you want to delete this flashcard?`}
                confirmMessage="Deleting..."
                isLoading={isDeleting}
            />

            {/* Edit flashcard modal */}
            <EditFlashcardModal
                isOpen={isEditModalOpen}
                flashcard={editingFlashcard}
                onConfirm={handleConfirmUpdate}
                onCancel={() => {
                    setIsEditModalOpen(false);
                    setEditingFlashcard(null);
                }}
                isLoading={isUpdating}
            />

            <div className="flex flex-row">
                <label className="font-bold text-lg mr-auto">
                    All flashcards ({flashcards.length})
                </label>
                <button
                    onClick={() => setShowAllFlashcards(!showAllFlashcards)}
                >
                    {showAllFlashcards ? (
                        <ChevronUp className="h-7 w-7 hover:text-(--discord-blurple)" />
                    ) : (
                        <ChevronDown className="h-7 w-7 hover:text-(--discord-blurple)" />
                    )}
                </button>
            </div>
            <div
                hidden={!showAllFlashcards}
                className="w-full h-0.5 bg-(--discord-gray-2) my-5"
            />
            <div hidden={!showAllFlashcards} className="space-y-5">
                {flashcards.map((f, i) => (
                    <div
                        key={i}
                        className="bg-(--discord-gray-4) rounded-md flex flex-col p-2 space-y-0.5"
                    >
                        <div className="flex flex-row items-center mb-1 border-b border-(--discord-gray-1) pb-2">
                            <label className="opacity-60 text-sm">
                                #{i + 1}
                            </label>
                            <div className="flex flex-row items-center justify-center ml-auto space-x-2">
                                <button onClick={(e) => handleStarClick(i, e)}>
                                    <Star
                                        className={`w-5 h-5 hover:text-(--discord-blurple) ${
                                            flashcards[i].starred
                                                ? "fill-current"
                                                : ""
                                        }`}
                                    />
                                </button>
                                <button
                                    onClick={(e) => handleReviewClick(i, e)}
                                    disabled={isReviewing.has(
                                        flashcards[i].flashcardId
                                    )}
                                >
                                    <SquareCheck
                                        className={`w-5 h-5 hover:text-(--discord-blurple) ${
                                            flashcards[i].reviewed
                                                ? "fill-green-800 text-green-300"
                                                : ""
                                        }`}
                                    />
                                </button>

                                {/* More settings button */}
                                <div
                                    className="relative flex justify-center items-center"
                                    ref={
                                        showDropdown === i ? dropdownRef : null
                                    }
                                >
                                    <button
                                        onClick={(e) =>
                                            handleDropdownToggle(e, i)
                                        }
                                        className="hover:text-(--discord-blurple)"
                                    >
                                        <EllipsisVertical className="w-5 h-5 opacity-80" />
                                    </button>

                                    <FlashcardDropdown
                                        isOpen={showDropdown === i}
                                        onClose={() => setShowDropdown(null)}
                                        onEdit={() => handleEditClick(f)}
                                        onDelete={() => handleDeleteClick(f)}
                                    />
                                </div>
                            </div>
                        </div>
                        <label className="pt-1">Q: {f.question}</label>
                        <label className="opacity-80 text-sm">
                            A: {f.answer}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllFlashcardsPanel;
