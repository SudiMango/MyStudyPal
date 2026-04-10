"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    deleteStudySet,
    getOneStudySet,
    updateStudySet,
} from "@/lib/api/study-set-api";
import {
    Loader,
    Layers,
    Brain,
    ChartNoAxesCombined,
    FileText,
    Calendar,
    Settings,
} from "lucide-react";
import QuizzesTab from "@/app/components/study-set-page/QuizzesTab";
import DocumentsTab from "@/app/components/study-set-page/DocumentsTab";
import { formatDate } from "@/lib/util";
import FlashcardSetsTab from "@/app/components/study-set-page/FlashcardSetsTab";
import { StudySetResponse } from "@/lib/dto/study-set-dto";
import SettingsModal from "@/app/components/global/SettingsModal";
import ConfirmationModal from "@/app/components/global/ConfirmationModal";
import AbstractModal from "@/app/components/global/AbstractModal";
import { FieldConfig } from "@/lib/types/modal";
import { toast } from "sonner";

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

const CurrentStudySetPage = () => {
    const { studySetId } = useParams();

    const [studySet, setStudySet] = useState<StudySetResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<
        "flashcards" | "quizzes" | "stats" | "documents"
    >("flashcards");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Edit
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Delete
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchDetails = async () => {
        if (!studySetId) return;
        const response = await getOneStudySet(studySetId as string);
        if (response.data) {
            setStudySet(response.data);
            console.log(response.data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchDetails();
    }, [studySetId]);

    // Handle URL hash navigation
    useEffect(() => {
        const hash = window.location.hash.replace("#", "");
        if (
            hash === "flashcards" ||
            hash === "quizzes" ||
            hash === "documents" ||
            hash === "stats"
        ) {
            setActiveTab(hash);
        }
    }, []);

    // Edit
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
            fetchDetails();
            setIsEditModalOpen(false);
        } else {
            toast.error(response.error);
        }

        setIsUpdating(false);
    };

    // Delete
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        const response = await deleteStudySet(studySet!.studySetId);

        if (!response.error) {
            fetchDetails();
        } else {
            toast.error(response.error);
        }

        setIsDeleteModalOpen(false);
        setIsDeleting(false);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-20">
                <Loader className="w-10 h-10 animate-spin text-gray-400" />
                <p className="mt-4 text-gray-400">Loading contents...</p>
            </div>
        );
    }

    if (!studySet) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-20">
                <p className="text-gray-400 text-lg">Study set not found</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen w-full">
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
                        value: formatDate(studySet.createdAt),
                    },
                    {
                        label: "Updated",
                        value: formatDate(studySet.updatedAt),
                    },
                    {
                        label: "Total flashcard sets",
                        value: studySet.totalFlashcardSets.toString(),
                    },
                    {
                        label: "Total quizzes",
                        value: studySet.totalQuizzes.toString(),
                    },
                    {
                        label: "Total documents",
                        value: studySet.totalDocuments.toString(),
                    },
                ]}
            />

            {/* Edit study set modal */}
            <AbstractModal
                isOpen={isEditModalOpen}
                title="Edit Study Set"
                fields={UPDATE_STUDY_SET_FIELDS}
                initialValues={{
                    icon: studySet?.icon ?? "",
                    name: studySet?.name ?? "",
                    description: studySet?.description ?? "",
                }}
                onConfirm={({ name, description, icon }) =>
                    handleConfirmUpdate(
                        studySet.studySetId,
                        name,
                        description,
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

            {/* Header Section */}
            <div className="w-full bg-linear-to-br from-(--discord-gray-1) to-(--discord-gray-2) border-b border-(--discord-gray-3) py-8 px-5">
                <div className="max-w-150 mx-auto">
                    <div className="flex flex-row items-center space-x-4">
                        <div className="text-6xl">{studySet.icon}</div>
                        <div className="flex flex-col flex-1">
                            <h1 className="text-3xl font-bold">
                                {studySet.name}
                            </h1>
                            <p className="text-gray-400 mt-1">
                                {studySet.description}
                            </p>
                        </div>

                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="rounded-xl bg-(--discord-gray-1) hover:bg-(--discord-gray-2) group p-2.5 border border-white/5 transition-colors"
                        >
                            <Settings className="w-5 h-5 group-hover:text-(--discord-blurple)" />
                        </button>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-row flex-wrap justify-center gap-3 mt-6">
                        <div className="bg-(--discord-gray-3) py-2 px-4 rounded-lg flex flex-row items-center space-x-2 whitespace-nowrap">
                            <Layers className="w-4 h-4 text-(--discord-blurple)" />
                            <label className="text-sm">
                                {studySet.totalFlashcardSets} flashcard sets
                            </label>
                        </div>
                        <div className="bg-(--discord-gray-3) py-2 px-4 rounded-lg flex flex-row items-center space-x-2 whitespace-nowrap">
                            <Brain className="w-4 h-4 text-(--discord-blurple)" />
                            <label className="text-sm">
                                {studySet.totalQuizzes} quizzes
                            </label>
                        </div>
                        <div className="bg-(--discord-gray-3) py-2 px-4 rounded-lg flex flex-row items-center space-x-2 whitespace-nowrap">
                            <FileText className="w-4 h-4 text-(--discord-blurple)" />
                            <label className="text-sm">
                                {studySet.totalDocuments} documents
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="w-full bg-(--discord-gray-2) border-b border-(--discord-gray-3) px-5 overflow-x-auto">
                <div className="max-w-150 mx-auto flex flex-row justify-center space-x-1 min-w-max">
                    <button
                        onClick={() => {
                            setActiveTab("flashcards");
                            window.history.pushState(null, "", `#flashcards`);
                        }}
                        className={`flex flex-row items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                            activeTab === "flashcards"
                                ? "border-(--discord-blurple) text-(--discord-blurple)"
                                : "border-transparent text-gray-400 hover:text-white"
                        }`}
                    >
                        <Layers className="w-5 h-5" />
                        <span className="font-medium">Flashcards</span>
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("quizzes");
                            window.history.pushState(null, "", `#quizzes`);
                        }}
                        className={`flex flex-row items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                            activeTab === "quizzes"
                                ? "border-(--discord-blurple) text-(--discord-blurple)"
                                : "border-transparent text-gray-400 hover:text-white"
                        }`}
                    >
                        <Brain className="w-5 h-5" />
                        <span className="font-medium">Quizzes</span>
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("documents");
                            window.history.pushState(null, "", `#documents`);
                        }}
                        className={`flex flex-row items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                            activeTab === "documents"
                                ? "border-(--discord-blurple) text-(--discord-blurple)"
                                : "border-transparent text-gray-400 hover:text-white"
                        }`}
                    >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">Documents</span>
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("stats");
                            window.history.pushState(null, "", `#stats`);
                        }}
                        className={`flex flex-row items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                            activeTab === "stats"
                                ? "border-(--discord-blurple) text-(--discord-blurple)"
                                : "border-transparent text-gray-400 hover:text-white"
                        }`}
                    >
                        <ChartNoAxesCombined className="w-5 h-5" />
                        <span className="font-medium">Stats</span>
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full max-w-150 p-5">
                {activeTab === "flashcards" && (
                    <FlashcardSetsTab studySetId={studySetId as string} />
                )}

                {activeTab === "quizzes" && (
                    <QuizzesTab studySetId={studySetId as string} />
                )}

                {activeTab === "documents" && (
                    <DocumentsTab studySetId={studySetId as string} />
                )}

                {activeTab === "stats" && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <ChartNoAxesCombined className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-400 text-lg">
                            No stats available yet
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrentStudySetPage;
