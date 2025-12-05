"use client";

import ConfirmationModal from "@/app/components/global/ConfirmationModal";
import EditFlashcardSetModal from "@/app/components/create-flashcard-set-page/EditFlashcardSetModal";
import {
    FlashcardSet,
    getAllFlashcardSets,
    deleteFlashcardSet,
    updateFlashcardSet,
} from "@/lib/api/flashcard-set-api";
import {
    BookOpenText,
    Brain,
    ChartNoAxesCombined,
    EllipsisVertical,
    Loader,
    Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import SearchBar from "@/app/components/create-flashcard-set-page/SearchBar";
import SettingsDropdown from "@/app/components/global/SettingsDropdown";

const FlashcardSetsPage = () => {
    const router = useRouter();

    const [query, setQuery] = useState("");
    const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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
     *
     * Fetch all flashcard sets for user
     *
     */

    const fetchFlashcardSets = async () => {
        setIsLoading(true);
        const response = await getAllFlashcardSets();
        if (response.success && response.data) {
            console.log(response.data);
            setFlashcardSets(response.data);
        } else {
            alert(response.error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchFlashcardSets();
    }, []);

    /**
     *
     * Settings dropdown
     *
     */

    const handleDropdownToggle = (e: any, index: number) => {
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
     *
     * Handle flashcard set delete
     *
     */

    const handleDeleteClick = (set: FlashcardSet) => {
        setSetToDelete(set);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (setToDelete) {
            setIsDeleting(true);
            const response = await deleteFlashcardSet(
                setToDelete.flashcardSetId
            );
            setIsDeleting(false);

            if (response.success) {
                fetchFlashcardSets();
            } else {
                alert(response.error || "Failed to delete flashcard set.");
            }
            setIsDeleteModalOpen(false);
            setSetToDelete(null);
            setShowDropdown(null);
        }
    };

    /**
     *
     * Handle flashcard set edit
     *
     */

    const handleEditClick = (set: FlashcardSet) => {
        setEditingSet(set);
        setIsEditModalOpen(true);
    };

    const handleConfirmUpdate = async (
        flashcardSetId: string,
        name: string,
        icon: string
    ) => {
        setIsUpdating(true);
        const response = await updateFlashcardSet(flashcardSetId, {
            name,
            icon,
        });
        setIsUpdating(false);

        if (response.success) {
            fetchFlashcardSets();
            setIsEditModalOpen(false);
            setEditingSet(null);
            setShowDropdown(null);
        } else {
            alert(response.error || "Failed to update flashcard set.");
        }
    };

    // Format date to show on UI
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
            set.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, flashcardSets]);

    return (
        <div className="flex flex-col items-center min-h-screen w-full p-5">
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

            <div className="flex flex-col justify-center items-center w-full h-full max-w-[600px]">
                {/* Title */}
                <h1 className="text-3xl font-bold mb-5">My Flashcard Sets</h1>

                {/* Search bar */}
                <div className="flex flex-row w-full mb-5 space-x-3">
                    <SearchBar query={query} onQueryChange={setQuery} />
                    <button
                        onClick={() =>
                            router.push("/app/flashcard-sets/create")
                        }
                        className="flex flex-row justify-center items-center bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) cursor-pointer rounded-xl w-40"
                    >
                        <Plus className="mr-1" />
                        New set
                    </button>
                </div>

                {/* All flashcard sets */}
                <div className="space-y-5 w-full">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center w-full py-20">
                            <Loader className="w-10 h-10 animate-spin text-gray-400" />
                            <p className="mt-4 text-gray-400">
                                Loading flashcard sets...
                            </p>
                        </div>
                    ) : filteredSets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center w-full py-20">
                            <p className="text-gray-400 text-lg">
                                Nothing to show here...
                            </p>
                        </div>
                    ) : (
                        <>
                            {filteredSets.map((set, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col items-start justify-center w-full shadow-xl rounded-xl bg-(--discord-gray-4) p-4 transform transition-transform duration-200 hover:scale-105"
                                >
                                    {/* Title area */}
                                    <div className="flex flex-row items-center justify-center space-x-3 w-full">
                                        <label className="text-4xl">
                                            {set.icon}
                                        </label>
                                        <div className="flex flex-col">
                                            <label className="text-md">
                                                {set.name}
                                            </label>
                                            <label className="text-sm opacity-70">
                                                Updated{" "}
                                                {formatDate(set.updatedAt)}
                                            </label>
                                        </div>

                                        {/* More settings button */}
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
                                                onEdit={() =>
                                                    handleEditClick(set)
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(set)
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Stats area */}
                                    <div className="mt-6 flex flex-row space-x-3">
                                        <div className="bg-(--discord-gray-2) py-0.5 px-1 rounded-lg">
                                            <label className="text-sm">
                                                {set.totalCards} cards
                                            </label>
                                        </div>
                                        <div className="bg-(--discord-gray-2) py-0.5 px-1 rounded-lg">
                                            <label className="text-sm">
                                                0 reviewed
                                            </label>
                                        </div>
                                        <div className="bg-(--discord-gray-2) py-0.5 px-1 rounded-lg">
                                            <label className="text-sm">
                                                0 starred
                                            </label>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-0.5 w-full bg-(--discord-gray-1) my-5 rounded-2xl"></div>

                                    {/* Action buttons */}
                                    <div className="flex flex-row space-x-3 w-full">
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `/app/flashcard-sets/${set.flashcardSetId}`
                                                )
                                            }
                                            className="w-1/3 bg-(--discord-gray-1) flex flex-row justify-center items-center space-x-3 p-3 rounded-lg outline outline-(--discord-blurple) hover:bg-(--discord-gray-2)"
                                        >
                                            <BookOpenText />
                                            <label>Review</label>
                                        </button>
                                        <button className="w-1/3 bg-(--discord-gray-1) flex flex-row justify-center items-center space-x-3 p-3 rounded-lg outline outline-(--discord-blurple) hover:bg-(--discord-gray-2)">
                                            <Brain />
                                            <label>Quiz</label>
                                        </button>
                                        <button className="w-1/3 bg-(--discord-gray-1) flex flex-row justify-center items-center space-x-3 p-3 rounded-lg outline outline-(--discord-blurple) hover:bg-(--discord-gray-2)">
                                            <ChartNoAxesCombined />
                                            <label>Stats</label>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    <button
                        onClick={() =>
                            router.push("/app/flashcard-sets/create")
                        }
                        className="flex flex-row w-full items-center justify-center space-x-3 outline-dashed rounded-lg p-3 outline-2 outline-(--discord-blurple-hover) bg-(--discord-gray-1) hover:bg-(--discord-gray-2)"
                    >
                        <Plus className="h-8 w-8" />
                        <label className="text-lg">Create new set</label>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FlashcardSetsPage;
