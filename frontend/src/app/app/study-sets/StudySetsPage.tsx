"use client";

import ConfirmationModal from "@/app/components/global/ConfirmationModal";
import {
    getAllStudySets,
    deleteStudySet,
    updateStudySet,
    createStudySet,
} from "@/lib/api/study-set-api";
import {
    Brain,
    ChartNoAxesCombined,
    Folder,
    Layers,
    Loader,
    Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import SearchBar from "@/app/components/global/SearchBar";
import SettingsDropdown from "@/app/components/global/SettingsDropdown";
import ItemDisplayCard from "@/app/components/global/ItemDisplayCard";
import { StudySetResponse } from "@/lib/dto/study-set-dto";
import { FieldConfig } from "@/lib/types/modal";
import AbstractModal from "@/app/components/global/AbstractModal";
import { toast } from "sonner";

const CREATE_STUDY_SET_FIELDS: FieldConfig[] = [
    { key: "icon", type: "emoji", label: "Icon", row: 1, width: "w-12" },
    {
        key: "name",
        type: "text",
        label: "Name",
        row: 1,
        flex: 1,
        required: true,
        maxLength: 30,
        showCharCount: true,
        placeholder: "e.g., Bio 101 Midterm",
    },
    {
        key: "description",
        type: "textarea",
        label: "Description",
        row: 2,
        maxLength: 100,
        showCharCount: true,
        placeholder: "What is this study set about?",
        rows: 3,
    },
];

const UPDATE_STUDY_SET_FIELDS: FieldConfig[] = [
    { key: "icon", type: "emoji", label: "Icon", row: 1, width: "w-12" },
    {
        key: "name",
        type: "text",
        label: "Name",
        row: 1,
        flex: 1,
        required: false,
        maxLength: 30,
        showCharCount: true,
        placeholder: "e.g., Bio 101 Midterm",
    },
    {
        key: "description",
        type: "textarea",
        label: "Description",
        row: 2,
        maxLength: 100,
        showCharCount: true,
        placeholder: "What is this study set about?",
        rows: 3,
    },
];

const StudySetsPage = () => {
    /**
     * Variables
     */

    const router = useRouter();

    // Global
    const [studySets, setStudySets] = useState<StudySetResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState("");

    // UI
    const [showDropdown, setShowDropdown] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Create
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Edit
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSet, setEditingSet] = useState<StudySetResponse | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Delete
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [setToDelete, setSetToDelete] = useState<StudySetResponse | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    /**
     * Functions
     */

    // Data fetching
    const fetchStudySets = async () => {
        setIsLoading(true);
        const response = await getAllStudySets();
        if (response.data) {
            setStudySets(response.data);
        } else {
            toast.error(response.error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchStudySets();
    }, []);

    // Filtering
    const filteredSets = useMemo(() => {
        if (!query.trim()) return studySets;
        return studySets.filter((set) =>
            set.name.toLowerCase().includes(query.toLowerCase()),
        );
    }, [query, studySets]);

    // Create
    const handleConfirmCreate = async (
        name: string,
        icon: string,
        description: string,
    ) => {
        setIsCreating(true);

        const payload = { name, icon, description };

        const response = await createStudySet(payload);

        if (!response.error) {
            fetchStudySets();
            setIsCreateModalOpen(false);
        } else {
            toast.error(response.error);
        }

        setIsCreating(false);
    };

    // Edit
    const handleEditClick = (set: StudySetResponse) => {
        setEditingSet(set);
        setIsEditModalOpen(true);
    };

    const handleConfirmUpdate = async (
        studySetId: string,
        name: string,
        description: string,
        icon: string,
    ) => {
        setIsUpdating(true);

        const payload = {
            name,
            description,
            icon,
        };

        const response = await updateStudySet(studySetId, payload);

        if (response.success && response.data) {
            fetchStudySets();
            setIsEditModalOpen(false);
            setEditingSet(null);
            setShowDropdown(null);
        } else {
            toast.error(response.error);
        }

        setIsUpdating(false);
    };

    // Delete
    const handleDeleteClick = (set: StudySetResponse) => {
        setSetToDelete(set);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!setToDelete) return;

        setIsDeleting(true);
        const response = await deleteStudySet(setToDelete.studySetId);

        if (!response.error) {
            fetchStudySets();
        } else {
            toast.error(response.error);
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
        <div className="flex flex-col items-center min-h-screen w-full p-5">
            {/* Create study set modal */}
            <AbstractModal
                isOpen={isCreateModalOpen}
                title="Create Study Set"
                fields={CREATE_STUDY_SET_FIELDS}
                initialValues={{
                    icon: "📚",
                    name: "",
                    description: "",
                }}
                onConfirm={({ name, icon, description }) =>
                    handleConfirmCreate(name, icon, description)
                }
                onCancel={() => setIsCreateModalOpen(false)}
                isLoading={isCreating}
                confirmLabel="Create"
                confirmLoadingLabel="Creating..."
            />

            {/* Edit study set modal */}
            <AbstractModal
                isOpen={isEditModalOpen}
                title="Edit Study Set"
                fields={UPDATE_STUDY_SET_FIELDS}
                initialValues={{
                    icon: editingSet?.icon ?? "",
                    name: editingSet?.name ?? "",
                    description: editingSet?.description ?? "",
                }}
                onConfirm={({ name, description, icon }) =>
                    editingSet &&
                    handleConfirmUpdate(
                        editingSet.studySetId,
                        name,
                        description,
                        icon,
                    )
                }
                onCancel={() => {
                    setIsEditModalOpen(false);
                    setEditingSet(null);
                }}
                isLoading={isUpdating}
                confirmLabel="Save"
                confirmLoadingLabel="Saving..."
            />

            {/* Delete study set modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message={`Are you sure you want to delete the "${setToDelete?.name}" study set?`}
                confirmMessage="Deleting..."
                isLoading={isDeleting}
            />

            {/* Body */}
            <div className="flex flex-col justify-center items-center w-full h-full max-w-150">
                <h1 className="text-3xl font-bold mb-5">My Study Sets</h1>

                {/* Top bar */}
                <div className="flex flex-row w-full mb-5 space-x-3">
                    {/* Search */}
                    <SearchBar
                        query={query}
                        onQueryChange={setQuery}
                        placeholder="Search study sets..."
                    />
                    {/* Create new study set */}
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex flex-row justify-center items-center bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) cursor-pointer rounded-xl w-40 text-white font-medium"
                    >
                        <Plus className="mr-1" />
                        New set
                    </button>
                </div>

                {/* Study Sets List */}
                <div className="space-y-5 w-full">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center w-full py-20">
                            <Loader className="w-10 h-10 animate-spin text-gray-400" />
                            <p className="mt-4 text-gray-400">
                                Loading study sets...
                            </p>
                        </div>
                    ) : filteredSets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Folder className="w-16 h-16 text-gray-400 mb-4" />
                            <p className="text-gray-400 text-lg">
                                {query.trim()
                                    ? "No study sets match your search"
                                    : "No study sets yet"}
                            </p>
                            {!query.trim() && (
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="mt-4 bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) px-6 py-2 rounded-lg font-medium cursor-pointer"
                                >
                                    Create study set
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {filteredSets.map((set, i) => (
                                <ItemDisplayCard
                                    key={set.studySetId}
                                    title={set.name}
                                    subtitle={set.description || ""}
                                    icon={set.icon}
                                    stats={[
                                        `${set.totalFlashcardSets} flashcard sets`,
                                        `${set.totalQuizzes} quizzes`,
                                    ]}
                                    onCardClick={() =>
                                        router.push(
                                            `/app/study-sets/${set.studySetId}`,
                                        )
                                    }
                                    onMenuClick={(e) =>
                                        handleSettingsDropdownToggle(e, i)
                                    }
                                    dropdownRef={
                                        showDropdown === i
                                            ? dropdownRef
                                            : undefined
                                    }
                                    dropdownComponent={
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
                                    }
                                    actions={[
                                        {
                                            label: "Flashcards",
                                            icon: (
                                                <Layers className="w-5 h-5" />
                                            ),
                                            onClick: () =>
                                                router.push(
                                                    `/app/study-sets/${set.studySetId}#flashcards`,
                                                ),
                                        },
                                        {
                                            label: "Quizzes",
                                            icon: <Brain className="w-5 h-5" />,
                                            onClick: () =>
                                                router.push(
                                                    `/app/study-sets/${set.studySetId}#quizzes`,
                                                ),
                                        },
                                        {
                                            label: "Stats",
                                            icon: (
                                                <ChartNoAxesCombined className="w-5 h-5" />
                                            ),
                                            onClick: () =>
                                                router.push(
                                                    `/app/study-sets/${set.studySetId}#stats`,
                                                ),
                                        },
                                    ]}
                                />
                            ))}
                        </>
                    )}

                    {/* Create new study set */}
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex flex-row w-full items-center justify-center space-x-3 outline-dashed rounded-lg p-3 outline-2 outline-(--discord-blurple-hover) bg-(--discord-gray-1) hover:bg-(--discord-gray-2)"
                    >
                        <Plus className="h-8 w-8 text-(--discord-blurple)" />
                        <label className="text-lg font-medium cursor-pointer">
                            Create new set
                        </label>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudySetsPage;
