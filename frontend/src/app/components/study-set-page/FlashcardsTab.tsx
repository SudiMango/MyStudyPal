"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    FlashcardSet,
    getAllFlashcardSetsForStudySet,
    deleteFlashcardSet,
    updateFlashcardSet,
} from "@/lib/api/flashcard-set-api";
import {
    Layers,
    Brain,
    ChartNoAxesCombined,
    BookOpenText,
    EllipsisVertical,
    Plus,
    Loader,
} from "lucide-react";
import ConfirmationModal from "@/app/components/global/ConfirmationModal";
import EditFlashcardSetModal from "@/app/components/create-flashcard-set-page/EditFlashcardSetModal";
import SettingsDropdown from "@/app/components/global/SettingsDropdown";
import SearchBar from "@/app/components/global/SearchBar";

interface FlashcardsTabProps {
    studySetId: string;
}

const FlashcardsTab: React.FC<FlashcardsTabProps> = ({ studySetId }) => {
    const router = useRouter();

    const [query, setQuery] = useState("");
    const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Delete state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [setToDelete, setSetToDelete] = useState<FlashcardSet | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Edit state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSet, setEditingSet] = useState<FlashcardSet | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    /**
     * Fetch flashcard sets for this study set
     */
    const fetchFlashcardSets = async () => {
        setIsLoading(true);
        const response = await getAllFlashcardSetsForStudySet(studySetId);
        if (response.data) {
            setFlashcardSets(response.data);
        } else {
            alert(response.error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchFlashcardSets();
    }, [studySetId]);

    /**
     * Settings dropdown logic
     */
    const handleDropdownToggle = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        setShowDropdown(showDropdown !== index ? index : null);
    };

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

    /**
     * Handle flashcard set delete
     */
    const handleDeleteClick = (set: FlashcardSet) => {
        setSetToDelete(set);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (setToDelete) {
            setIsDeleting(true);
            const response = await deleteFlashcardSet(
                setToDelete.flashcardSetId,
            );
            setIsDeleting(false);

            if (!response.error) {
                fetchFlashcardSets();
            } else {
                alert(response.error);
            }
            setIsDeleteModalOpen(false);
            setSetToDelete(null);
            setShowDropdown(null);
        }
    };

    /**
     * Handle flashcard set edit
     */
    const handleEditClick = (set: FlashcardSet) => {
        setEditingSet(set);
        setIsEditModalOpen(true);
    };

    const handleConfirmUpdate = async (
        flashcardSetId: string,
        name: string,
        icon: string,
    ) => {
        setIsUpdating(true);
        const response = await updateFlashcardSet(flashcardSetId, {
            name,
            icon,
        });
        setIsUpdating(false);

        if (!response.error) {
            fetchFlashcardSets();
            setIsEditModalOpen(false);
            setEditingSet(null);
            setShowDropdown(null);
        } else {
            alert(response.error);
        }
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // Filtered sets for search
    const filteredSets = useMemo(() => {
        if (!query.trim()) return flashcardSets;
        return flashcardSets.filter((set) =>
            set.name.toLowerCase().includes(query.toLowerCase()),
        );
    }, [query, flashcardSets]);

    return (
        <>
            {/* Delete flashcard set modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message={`Are you sure you want to delete the "${setToDelete?.name}" flashcard set?`}
                confirmMessage="Deleting..."
                isLoading={isDeleting}
            />

            {/* Edit flashcard set modal */}
            <EditFlashcardSetModal
                isOpen={isEditModalOpen}
                flashcardSet={editingSet}
                onConfirm={handleConfirmUpdate}
                onCancel={() => {
                    setIsEditModalOpen(false);
                    setEditingSet(null);
                }}
                isLoading={isUpdating}
            />

            {/* Search bar and create button */}
            <div className="flex flex-row w-full mb-5 space-x-3">
                <SearchBar
                    query={query}
                    onQueryChange={setQuery}
                    placeholder="Search flashcard sets..."
                />
                <button
                    onClick={() =>
                        router.push(
                            `/app/study-sets/${studySetId}/flashcard-sets/create`,
                        )
                    }
                    className="flex flex-row justify-center items-center bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) cursor-pointer rounded-xl w-40 text-white font-medium"
                >
                    <Plus className="mr-1" />
                    New set
                </button>
            </div>

            <div className="space-y-5 w-full">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader className="w-10 h-10 animate-spin text-gray-400" />
                        <p className="mt-4 text-gray-400">
                            Loading flashcard sets...
                        </p>
                    </div>
                ) : filteredSets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Layers className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-400 text-lg">
                            {query.trim()
                                ? "No flashcard sets match your search"
                                : "No flashcard sets yet"}
                        </p>
                        {!query.trim() && (
                            <button
                                onClick={() =>
                                    router.push(
                                        `/app/study-sets/${studySetId}/flashcard-sets/create`,
                                    )
                                }
                                className="mt-4 bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) px-6 py-2 rounded-lg font-medium"
                            >
                                Create flashcard set
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {filteredSets.map((set, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-start justify-center w-full shadow-xl rounded-xl bg-(--discord-gray-4) p-4 transform transition-transform duration-200 hover:scale-105"
                            >
                                <div className="flex flex-row items-center justify-center space-x-3 w-full">
                                    <label className="text-4xl">
                                        {set.icon}
                                    </label>
                                    <div className="flex flex-col">
                                        <label className="text-md font-semibold">
                                            {set.name}
                                        </label>
                                        <label className="text-sm opacity-70">
                                            Updated {formatDate(set.updatedAt)}
                                        </label>
                                    </div>

                                    <div
                                        className="relative flex justify-center items-center ml-auto"
                                        ref={
                                            showDropdown === i
                                                ? dropdownRef
                                                : null
                                        }
                                    >
                                        <button
                                            onClick={(e) =>
                                                handleDropdownToggle(e, i)
                                            }
                                            className="hover:text-(--discord-blurple)"
                                        >
                                            <EllipsisVertical className="w-5 h-5 opacity-80 mb-1" />
                                        </button>

                                        <SettingsDropdown
                                            isOpen={showDropdown === i}
                                            onClose={() =>
                                                setShowDropdown(null)
                                            }
                                            onEdit={() => handleEditClick(set)}
                                            onDelete={() =>
                                                handleDeleteClick(set)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-row space-x-3">
                                    <div className="bg-(--discord-gray-2) py-0.5 px-2 rounded-lg">
                                        <label className="text-sm">
                                            {set.totalCards} cards
                                        </label>
                                    </div>
                                    <div className="bg-(--discord-gray-2) py-0.5 px-2 rounded-lg">
                                        <label className="text-sm">
                                            {set.reviewedCards} reviewed
                                        </label>
                                    </div>
                                    <div className="bg-(--discord-gray-2) py-0.5 px-2 rounded-lg">
                                        <label className="text-sm">
                                            {set.starredCards} starred
                                        </label>
                                    </div>
                                </div>

                                <div className="h-0.5 w-full bg-(--discord-gray-1) my-5 rounded-2xl"></div>

                                <div className="flex flex-row space-x-3 w-full">
                                    <button
                                        onClick={() =>
                                            router.push(
                                                `/app/study-sets/${studySetId}/flashcard-sets/${set.flashcardSetId}`,
                                            )
                                        }
                                        className="w-1/3 bg-(--discord-gray-1) flex flex-row justify-center items-center space-x-3 p-3 rounded-lg outline outline-(--discord-blurple) hover:bg-(--discord-gray-2)"
                                    >
                                        <BookOpenText className="w-5 h-5" />
                                        <span>Review</span>
                                    </button>
                                    <button className="w-1/3 bg-(--discord-gray-1) flex flex-row justify-center items-center space-x-3 p-3 rounded-lg outline outline-(--discord-blurple) hover:bg-(--discord-gray-2)">
                                        <Brain className="w-5 h-5" />
                                        <span>Quiz</span>
                                    </button>
                                    <button className="w-1/3 bg-(--discord-gray-1) flex flex-row justify-center items-center space-x-3 p-3 rounded-lg outline outline-(--discord-blurple) hover:bg-(--discord-gray-2)">
                                        <ChartNoAxesCombined className="w-5 h-5" />
                                        <span>Stats</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                <button
                    onClick={() =>
                        router.push(
                            `/app/study-sets/${studySetId}/flashcard-sets/create`,
                        )
                    }
                    className="flex flex-row w-full items-center justify-center space-x-3 outline-dashed rounded-lg p-3 outline-2 outline-(--discord-blurple-hover) bg-(--discord-gray-1) hover:bg-(--discord-gray-2)"
                >
                    <Plus className="h-8 w-8 text-(--discord-blurple)" />
                    <label className="text-lg font-medium cursor-pointer">
                        Create new flashcard set
                    </label>
                </button>
            </div>
        </>
    );
};

export default FlashcardsTab;
