import React, { useEffect, useRef, useState } from "react";
import {
    ChevronDown,
    ChevronUp,
    EllipsisVertical,
    Plus,
    SquareCheck,
    Star,
} from "lucide-react";
import {
    createFlashcard,
    deleteFlashcard,
    updateFlashcard,
} from "@/lib/api/flashcard-api";
import ConfirmationModal from "../global/ConfirmationModal";
import SettingsDropdown from "../global/SettingsDropdown";
import { FlashcardResponse } from "@/lib/dto/flashcard-dto";
import AbstractModal from "../global/AbstractModal";
import { FieldConfig } from "@/lib/types/modal";
import { useParams } from "next/navigation";

const CREATE_FLASHCARD_FIELDS: FieldConfig[] = [
    {
        key: "question",
        type: "textarea",
        label: "Question",
        row: 1,
        required: true,
        maxLength: 150,
        showCharCount: true,
        placeholder: "e.g., What is the powerhouse of a cell?",
        rows: 3,
    },
    {
        key: "answer",
        type: "textarea",
        label: "Answer",
        row: 2,
        required: true,
        maxLength: 200,
        showCharCount: true,
        placeholder: "e.g., It is the Mitochondria!",
        rows: 5,
    },
    {
        key: "hint",
        type: "text",
        label: "Hint",
        row: 3,
        required: false,
        maxLength: 25,
        showCharCount: true,
        placeholder: "e.g., Mito...",
    },
    {
        key: "orderIndex",
        type: "number",
        label: "Order Index (1-Infinity)",
        row: 4,
        required: true,
        placeholder: "e.g., 5",
    },
];

const UPDATE_FLASHCARD_FIELDS: FieldConfig[] = [
    {
        key: "question",
        type: "textarea",
        label: "Question",
        row: 1,
        required: false,
        maxLength: 150,
        showCharCount: true,
        placeholder: "e.g., What is the powerhouse of a cell?",
        rows: 3,
    },
    {
        key: "answer",
        type: "textarea",
        label: "Answer",
        row: 2,
        required: false,
        maxLength: 200,
        showCharCount: true,
        placeholder: "e.g., It is the Mitochondria!",
        rows: 5,
    },
    {
        key: "hint",
        type: "text",
        label: "Hint",
        row: 3,
        required: false,
        maxLength: 25,
        showCharCount: true,
        placeholder: "e.g., Mito...",
    },
    {
        key: "orderIndex",
        type: "number",
        label: "Order Index (1-Infinity)",
        row: 4,
        required: false,
        placeholder: "e.g., 5",
    },
];

interface FlashcardListProps {
    flashcards: FlashcardResponse[];
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
    /**
     * Variables
     */

    // Global
    const { flashcardSetId } = useParams();
    const [showAllFlashcards, setShowAllFlashcards] = useState<boolean>(false);
    const [showDropdown, setShowDropdown] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Create
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Editing state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingFlashcard, setEditingFlashcard] =
        useState<FlashcardResponse | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Delete state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [flashcardToDelete, setFlashcardToDelete] =
        useState<FlashcardResponse | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    /**
     * Functions
     */

    // Handle click outside
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

    // Create
    const handleCreateClick = () => {
        setIsCreateModalOpen(true);
    };

    const handleConfirmCreate = async (
        question: string,
        answer: string,
        hint: string,
        orderIndex: number,
    ) => {
        setIsCreating(true);

        const payload = { question, answer, hint, orderIndex };

        const response = await createFlashcard(
            flashcardSetId as string,
            payload,
        );

        if (response.success && response.data) {
            fetchEverything();
            setIsCreateModalOpen(false);
        } else {
            alert(response.error);
        }

        setIsCreating(false);
    };

    // Edit
    const handleEditClick = (flashcard: FlashcardResponse) => {
        setEditingFlashcard(flashcard);
        setIsEditModalOpen(true);
    };

    const handleConfirmUpdate = async (
        flashcardId: string,
        question: string,
        answer: string,
        hint: string,
        orderIndex: number,
    ) => {
        setIsUpdating(true);

        const payload = {
            question,
            answer,
            hint,
            orderIndex,
        };

        const response = await updateFlashcard(flashcardId, payload);

        if (response.success && response.data) {
            fetchEverything();
            setIsEditModalOpen(false);
            setEditingFlashcard(null);
            setShowDropdown(null);
        } else {
            alert(response.error);
        }

        setIsUpdating(false);
    };

    // Delete
    const handleDeleteClick = (set: FlashcardResponse) => {
        setFlashcardToDelete(set);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (flashcardToDelete) {
            setIsDeleting(true);
            const response = await deleteFlashcard(
                flashcardToDelete.flashcardId,
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

    // Settings
    const handleSettingsDropdownToggle = (e: any, index: number) => {
        e.stopPropagation();
        setShowDropdown(showDropdown !== index ? index : null);
    };

    // Starring and reviewing
    const handleStarClick = (index: number, e: any) => {
        e.stopPropagation();
        onStarFlashcard(index, e);
    };

    const handleReviewClick = (index: number, e: any) => {
        e.stopPropagation();
        onReviewFlashcard(index, e);
    };

    return (
        <div className="bg-(--discord-gray-3) w-full rounded-xl shadow-lg p-5 mt-5 outline outline-(--discord-blurple) flex flex-col">
            {/* Create flashcard modal */}
            <AbstractModal
                isOpen={isCreateModalOpen}
                title="Create Flashcard"
                fields={CREATE_FLASHCARD_FIELDS}
                initialValues={{
                    question: "",
                    answer: "",
                    hint: "",
                    orderIndex: `${flashcards.length + 1}`,
                }}
                onConfirm={({ question, answer, hint, orderIndex }) =>
                    handleConfirmCreate(
                        question,
                        answer,
                        hint,
                        Number(orderIndex),
                    )
                }
                onCancel={() => {
                    setIsCreateModalOpen(false);
                }}
                isLoading={isCreating}
                confirmLabel="Create"
                confirmLoadingLabel="Creating..."
            />

            {/* Edit flashcard modal */}
            <AbstractModal
                isOpen={isEditModalOpen}
                title="Edit Flashcard"
                fields={UPDATE_FLASHCARD_FIELDS}
                initialValues={{
                    question: editingFlashcard?.question ?? "",
                    answer: editingFlashcard?.answer ?? "",
                    hint: editingFlashcard?.hint ?? "",
                    orderIndex: editingFlashcard?.orderIndex.toString() ?? "1",
                }}
                onConfirm={({ question, answer, hint, orderIndex }) =>
                    editingFlashcard &&
                    handleConfirmUpdate(
                        editingFlashcard.flashcardId,
                        question,
                        answer,
                        hint,
                        Number(orderIndex),
                    )
                }
                onCancel={() => {
                    setIsEditModalOpen(false);
                    setEditingFlashcard(null);
                }}
                isLoading={isUpdating}
                confirmLabel="Save"
                confirmLoadingLabel="Saving..."
            />

            {/* Delete flashcard modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message={`Are you sure you want to delete this flashcard?`}
                confirmMessage="Deleting..."
                isLoading={isDeleting}
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
                                #{f.orderIndex}
                            </label>
                            <div className="flex flex-row items-center justify-center ml-auto space-x-2">
                                <button onClick={(e) => handleStarClick(i, e)}>
                                    <Star
                                        className={`w-5 h-5 hover:text-(--discord-blurple) ${
                                            flashcards[i].isStarred
                                                ? "fill-current"
                                                : ""
                                        }`}
                                    />
                                </button>
                                <button
                                    onClick={(e) => handleReviewClick(i, e)}
                                    disabled={isReviewing.has(
                                        flashcards[i].flashcardId,
                                    )}
                                >
                                    <SquareCheck
                                        className={`w-5 h-5 hover:text-(--discord-blurple) ${
                                            flashcards[i].isReviewed
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
                                            handleSettingsDropdownToggle(e, i)
                                        }
                                        className="hover:text-(--discord-blurple)"
                                    >
                                        <EllipsisVertical className="w-5 h-5 opacity-80" />
                                    </button>

                                    <SettingsDropdown
                                        isOpen={showDropdown === i}
                                        onClose={() => setShowDropdown(null)}
                                        onEdit={() => handleEditClick(f)}
                                        onDelete={() => handleDeleteClick(f)}
                                    />
                                </div>
                            </div>
                        </div>
                        <label className="py-1">Q: {f.question}</label>
                        <label className="opacity-80 text-sm py-1">
                            H: {f.hint}
                        </label>
                        <label className="opacity-80 text-sm py-1">
                            A: {f.answer}
                        </label>
                    </div>
                ))}

                {/* Create new flashcard */}
                <button
                    onClick={handleCreateClick}
                    className="flex flex-row justify-center items-center bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) cursor-pointer rounded-xl h-10 text-white font-medium w-full"
                >
                    <Plus className="mr-1" />
                    New flashcard
                </button>
            </div>
        </div>
    );
};

export default AllFlashcardsPanel;
