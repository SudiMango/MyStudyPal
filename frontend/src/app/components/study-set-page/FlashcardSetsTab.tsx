"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    getAllFlashcardSetsForStudySet,
    deleteFlashcardSet,
    updateFlashcardSet,
    createFlashcardSet,
} from "@/lib/api/flashcard-set-api";
import { Layers, BookOpenText, Plus, Loader } from "lucide-react";
import ConfirmationModal from "@/app/components/global/ConfirmationModal";
import SettingsDropdown from "@/app/components/global/SettingsDropdown";
import SearchBar from "@/app/components/global/SearchBar";
import { formatDate } from "@/lib/util";
import ItemDisplayCard from "../global/ItemDisplayCard";
import { FieldConfig } from "@/lib/types/modal";
import AbstractModal from "../global/AbstractModal";
import { FlashcardSetResponse } from "@/lib/dto/flashcard-set-dto";

const CREATE_FLASHCARD_SET_FIELDS: FieldConfig[] = [
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
    {
        key: "numFlashcards",
        type: "number",
        label: "Number of Flashcards (1-50)",
        row: 2,
        required: true,
        min: 1,
        max: 50,
        placeholder: "e.g., 10",
    },
    {
        key: "prompt",
        type: "textarea",
        label: "What should the flashcards be about?",
        row: 3,
        required: true,
        maxLength: 300,
        showCharCount: true,
        rows: 3,
        placeholder:
            "e.g., Key concepts of photosynthesis and the Calvin cycle.",
    },
    {
        key: "additionalInstructions",
        type: "textarea",
        label: "Additional Instructions (optional)",
        row: 4,
        required: false,
        maxLength: 150,
        showCharCount: true,
        rows: 2,
        placeholder: "e.g., Include multiple choice and true/false only.",
    },
];

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

interface FlashcardSetsTabProps {
    studySetId: string;
}

const FlashcardSetsTab: React.FC<FlashcardSetsTabProps> = ({ studySetId }) => {
    /**
     * Variables
     */

    const router = useRouter();

    // Global
    const [flashcardSets, setFlashcardSets] = useState<FlashcardSetResponse[]>(
        [],
    );
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState("");

    // UI
    const [showDropdown, setShowDropdown] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Create
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Edit
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSet, setEditingSet] = useState<FlashcardSetResponse | null>(
        null,
    );
    const [isUpdating, setIsUpdating] = useState(false);

    // Delete
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [setToDelete, setSetToDelete] = useState<FlashcardSetResponse | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    /**
     * Functions
     */

    // Data fetching
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

    // Filtering
    const filteredSets = useMemo(() => {
        if (!query.trim()) return flashcardSets;
        return flashcardSets.filter((set) =>
            set.name.toLowerCase().includes(query.toLowerCase()),
        );
    }, [query, flashcardSets]);

    // Create
    const handleConfirmCreate = async (
        name: string,
        icon: string,
        numFlashcards: number,
        prompt: string,
        additionalInstructions?: string,
    ) => {
        setIsCreating(true);

        const payload = {
            name,
            icon,
            numFlashcards,
            prompt,
            ...(additionalInstructions?.trim() && {
                additionalInstructions: additionalInstructions.trim(),
            }),
        };

        const response = await createFlashcardSet(studySetId, payload);

        if (response.data) {
            const { flashcardSetId } = response.data;
            router.push(
                `/app/study-sets/${studySetId}/flashcard-sets/${flashcardSetId}`,
            );
        } else {
            alert(response.error);
        }

        setIsCreating(false);
    };

    // Edit
    const handleEditClick = (set: FlashcardSetResponse) => {
        setEditingSet(set);
        setIsEditModalOpen(true);
    };

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
            fetchFlashcardSets();
            setIsEditModalOpen(false);
            setEditingSet(null);
            setShowDropdown(null);
        } else {
            alert(response.error);
        }

        setIsUpdating(false);
    };

    // Delete
    const handleDeleteClick = (set: FlashcardSetResponse) => {
        setSetToDelete(set);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!setToDelete) return;

        setIsDeleting(true);
        const response = await deleteFlashcardSet(setToDelete.flashcardSetId);

        if (!response.error) {
            fetchFlashcardSets();
        } else {
            alert(response.error);
        }

        setIsDeleteModalOpen(false);
        setSetToDelete(null);
        setShowDropdown(null);
        setIsDeleting(false);
    };

    // Settings
    const handleSettingsDropdownToggle = (
        e: React.MouseEvent,
        index: number,
    ) => {
        e.stopPropagation();
        setShowDropdown(showDropdown !== index ? index : null);
    };

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

    return (
        <>
            {/* Create flashcard set modal */}
            <AbstractModal
                isOpen={isCreateModalOpen}
                title="Create Flashcard Set"
                fields={CREATE_FLASHCARD_SET_FIELDS}
                initialValues={{
                    icon: "📚",
                    name: "",
                    numFlashcards: "10",
                    prompt: "",
                    additionalInstructions: "",
                }}
                onConfirm={({
                    icon,
                    name,
                    numFlashcards,
                    prompt,
                    additionalInstructions,
                }) =>
                    handleConfirmCreate(
                        name,
                        icon,
                        Number(numFlashcards),
                        prompt,
                        additionalInstructions || undefined,
                    )
                }
                onCancel={() => setIsCreateModalOpen(false)}
                isLoading={isCreating}
                confirmLabel="Create"
                confirmLoadingLabel="Creating..."
            />

            {/* Edit flashcard set modal */}
            <AbstractModal
                isOpen={isEditModalOpen}
                title="Edit Flashcard Set"
                fields={UPDATE_FLASHCARD_SET_FIELDS}
                initialValues={{
                    icon: editingSet?.icon ?? "📚",
                    name: editingSet?.name ?? "",
                }}
                onConfirm={({ icon, name }) =>
                    editingSet &&
                    handleConfirmUpdate(editingSet.flashcardSetId, name, icon)
                }
                onCancel={() => {
                    setIsEditModalOpen(false);
                    setEditingSet(null);
                }}
                isLoading={isUpdating}
                confirmLabel="Save"
                confirmLoadingLabel="Saving..."
            />

            {/* Delete flashcard set modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message={`Are you sure you want to delete the "${setToDelete?.name}" flashcard set?`}
                confirmMessage="Deleting..."
                isLoading={isDeleting}
            />

            {/* Actions */}
            <div className="flex flex-row w-full mb-5 space-x-3">
                {/* Search bar */}
                <SearchBar
                    query={query}
                    onQueryChange={setQuery}
                    placeholder="Search flashcard sets..."
                />
                {/* Create new flashcard set */}
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex flex-row justify-center items-center bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) cursor-pointer rounded-xl w-40 text-white font-medium"
                >
                    <Plus className="mr-1" />
                    New set
                </button>
            </div>

            {/* Body */}
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
                                onClick={() => setIsCreateModalOpen(true)}
                                className="mt-4 bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) px-6 py-2 rounded-lg font-medium cursor-pointer"
                            >
                                Create flashcard set
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {filteredSets.map((set, i) => (
                            <ItemDisplayCard
                                key={set.flashcardSetId || i}
                                title={set.name}
                                subtitle={`Created ${formatDate(set.createdAt)}`}
                                icon={set.icon}
                                stats={[
                                    `${set.totalCards} cards`,
                                    `${set.reviewedCards} reviewed`,
                                    `${set.starredCards} starred`,
                                ]}
                                onCardClick={() =>
                                    router.push(
                                        `/app/study-sets/${studySetId}/flashcard-sets/${set.flashcardSetId}`,
                                    )
                                }
                                onMenuClick={(e) =>
                                    handleSettingsDropdownToggle(e, i)
                                }
                                dropdownRef={
                                    showDropdown === i ? dropdownRef : undefined
                                }
                                dropdownComponent={
                                    <SettingsDropdown
                                        isOpen={showDropdown === i}
                                        onClose={() => setShowDropdown(null)}
                                        onEdit={() => handleEditClick(set)}
                                        onDelete={() => handleDeleteClick(set)}
                                    />
                                }
                                actions={[
                                    {
                                        label: "Review",
                                        icon: (
                                            <BookOpenText className="w-5 h-5" />
                                        ),
                                        onClick: () =>
                                            router.push(
                                                `/app/study-sets/${studySetId}/flashcard-sets/${set.flashcardSetId}`,
                                            ),
                                    },
                                ]}
                            />
                        ))}
                    </>
                )}

                {/* Create new flashcard set */}
                <button
                    onClick={() => setIsCreateModalOpen(true)}
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

export default FlashcardSetsTab;
