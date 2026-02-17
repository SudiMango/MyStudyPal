"use client";

import ConfirmationModal from "@/app/components/global/ConfirmationModal";
import EditStudySetModal from "@/app/components/study-set-page/EditStudySetModal";
import CreateStudySetModal from "@/app/components/study-set-page/CreateStudySetModal";
import {
    StudySet,
    getAllStudySets,
    deleteStudySet,
    updateStudySet,
    createStudySet,
} from "@/lib/api/study-set-api";
import {
    Brain,
    ChartNoAxesCombined,
    EllipsisVertical,
    Layers,
    Loader,
    Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import SearchBar from "@/app/components/global/SearchBar";
import SettingsDropdown from "@/app/components/global/SettingsDropdown";
import { formatDate } from "@/lib/util";

const StudySetsPage = () => {
    const router = useRouter();

    const [query, setQuery] = useState("");
    const [studySets, setStudySets] = useState<StudySet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Delete state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [setToDelete, setSetToDelete] = useState<StudySet | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Edit state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSet, setEditingSet] = useState<StudySet | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Create state (New)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    /**
     * Fetch all study sets for user
     */
    const fetchStudySets = async () => {
        setIsLoading(true);
        const response = await getAllStudySets();
        if (response.data) {
            setStudySets(response.data);
        } else {
            alert(response.error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchStudySets();
    }, []);

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
     * Handle study set create (New)
     */
    const handleConfirmCreate = async (
        name: string,
        icon: string,
        description: string,
    ) => {
        setIsCreating(true);
        const response = await createStudySet({ name, icon, description });
        setIsCreating(false);

        if (!response.error) {
            fetchStudySets();
            setIsCreateModalOpen(false);
        } else {
            alert(response.error);
        }
    };

    /**
     * Handle study set delete
     */
    const handleDeleteClick = (set: StudySet) => {
        setSetToDelete(set);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (setToDelete) {
            setIsDeleting(true);
            const response = await deleteStudySet(setToDelete.studySetId);
            setIsDeleting(false);

            if (!response.error) {
                fetchStudySets();
            } else {
                alert(response.error);
            }
            setIsDeleteModalOpen(false);
            setSetToDelete(null);
            setShowDropdown(null);
        }
    };

    /**
     * Handle study set edit
     */
    const handleEditClick = (set: StudySet) => {
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
        const response = await updateStudySet(studySetId, {
            name,
            description,
            icon,
        });
        setIsUpdating(false);

        if (!response.error) {
            fetchStudySets();
            setIsEditModalOpen(false);
            setEditingSet(null);
            setShowDropdown(null);
        } else {
            alert(response.error);
        }
    };

    const filteredSets = useMemo(() => {
        if (!query.trim()) return studySets;
        return studySets.filter((set) =>
            set.name.toLowerCase().includes(query.toLowerCase()),
        );
    }, [query, studySets]);

    return (
        <div className="flex flex-col items-center min-h-screen w-full p-5">
            {/* Create study set modal (New) */}
            <CreateStudySetModal
                isOpen={isCreateModalOpen}
                onConfirm={handleConfirmCreate}
                onCancel={() => setIsCreateModalOpen(false)}
                isLoading={isCreating}
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

            {/* Edit study set modal */}
            <EditStudySetModal
                isOpen={isEditModalOpen}
                studySet={editingSet}
                onConfirm={handleConfirmUpdate}
                onCancel={() => {
                    setIsEditModalOpen(false);
                    setEditingSet(null);
                }}
                isLoading={isUpdating}
            />

            <div className="flex flex-col justify-center items-center w-full h-full max-w-150">
                <h1 className="text-3xl font-bold mb-5">My Study Sets</h1>

                {/* Search & Actions */}
                <div className="flex flex-row w-full mb-5 space-x-3">
                    <SearchBar
                        query={query}
                        onQueryChange={setQuery}
                        placeholder="Search study sets..."
                    />
                    <button
                        onClick={() => setIsCreateModalOpen(true)} // Updated
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
                        <div className="flex flex-col items-center justify-center w-full py-20">
                            <p className="text-gray-400 text-lg">
                                Nothing to show here...
                            </p>
                        </div>
                    ) : (
                        <>
                            {filteredSets.map((set, i) => (
                                <div
                                    key={set.studySetId}
                                    className="flex flex-col items-start justify-center w-full shadow-xl rounded-xl bg-(--discord-gray-4) p-4 transform transition-transform duration-200 hover:scale-105"
                                >
                                    <div className="flex flex-row items-center justify-center space-x-3 w-full">
                                        <label className="text-4xl">
                                            {set.icon}
                                        </label>
                                        <div className="flex flex-col">
                                            <label
                                                className="text-md font-semibold cursor-pointer"
                                                onClick={() =>
                                                    router.push(
                                                        `/app/study-sets/${set.studySetId}`,
                                                    )
                                                }
                                            >
                                                {set.name}
                                            </label>
                                            <label className="text-sm opacity-70">
                                                Updated{" "}
                                                {formatDate(set.updatedAt)}
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
                                                onEdit={() =>
                                                    handleEditClick(set)
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(set)
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="mt-6 flex flex-row space-x-3">
                                        <div className="bg-(--discord-gray-2) py-0.5 px-2 rounded-lg">
                                            <label className="text-sm">
                                                {set.totalFlashcardSets}{" "}
                                                flashcard sets
                                            </label>
                                        </div>
                                        <div className="bg-(--discord-gray-2) py-0.5 px-2 rounded-lg">
                                            <label className="text-sm">
                                                {set.totalQuizzes} quizzes
                                            </label>
                                        </div>
                                    </div>

                                    <div className="h-0.5 w-full bg-(--discord-gray-1) my-5 rounded-2xl"></div>

                                    {/* Actions */}
                                    <div className="flex flex-row space-x-3 w-full">
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `/app/study-sets/${set.studySetId}#flashcards`,
                                                )
                                            }
                                            className="w-1/3 bg-(--discord-gray-1) flex flex-row justify-center items-center space-x-3 p-3 rounded-lg outline outline-(--discord-blurple) hover:bg-(--discord-gray-2)"
                                        >
                                            <Layers className="w-5 h-5 text-(--discord-blurple)" />
                                            <span>Flashcards</span>
                                        </button>
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `/app/study-sets/${set.studySetId}#quizzes`,
                                                )
                                            }
                                            className="w-1/3 bg-(--discord-gray-1) flex flex-row justify-center items-center space-x-3 p-3 rounded-lg outline outline-(--discord-blurple) hover:bg-(--discord-gray-2)"
                                        >
                                            <Brain className="w-5 h-5 text-(--discord-blurple)" />
                                            <span>Quizzes</span>
                                        </button>
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `/app/study-sets/${set.studySetId}#stats`,
                                                )
                                            }
                                            className="w-1/3 bg-(--discord-gray-1) flex flex-row justify-center items-center space-x-3 p-3 rounded-lg outline outline-(--discord-blurple) hover:bg-(--discord-gray-2)"
                                        >
                                            <ChartNoAxesCombined className="w-5 h-5 text-(--discord-blurple)" />
                                            <span>Stats</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    <button
                        onClick={() => setIsCreateModalOpen(true)} // Updated
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
