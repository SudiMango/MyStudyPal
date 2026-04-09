"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    createQuiz,
    deleteQuiz,
    getQuizzesForStudySet,
    updateQuiz,
} from "@/lib/api/quiz-api";
import { Brain, ChartNoAxesCombined, Plus, Loader } from "lucide-react";
import ConfirmationModal from "@/app/components/global/ConfirmationModal";
import SettingsDropdown from "@/app/components/global/SettingsDropdown";
import SearchBar from "@/app/components/global/SearchBar";
import { formatDate } from "@/lib/util";
import ItemDisplayCard from "../global/ItemDisplayCard";
import { QuestionType } from "@/lib/dto/quiz-question-dto";
import { FieldConfig } from "@/lib/types/modal";
import AbstractModal from "../global/AbstractModal";
import { QuizResponse } from "@/lib/dto/quiz-dto";
import { toast } from "sonner";

interface QuizzesTabProps {
    studySetId: string;
}

const CREATE_QUIZ_FIELDS: FieldConfig[] = [
    {
        key: "name",
        type: "text",
        label: "Quiz Name",
        row: 1,
        flex: 1,
        required: true,
        maxLength: 60,
        showCharCount: true,
        placeholder: "e.g., Biology Chapter 5 Final",
    },
    {
        key: "numQuestions",
        type: "number",
        label: "Number of Questions (1-50)",
        row: 2,
        required: true,
        min: 1,
        max: 50,
        placeholder: "10",
    },
    {
        key: "prompt",
        type: "textarea",
        label: "What should this quiz cover?",
        row: 3,
        required: true,
        maxLength: 300,
        showCharCount: true,
        rows: 3,
        placeholder:
            "e.g., Focus on cellular respiration, ATP production, and the Krebs cycle.",
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

const UPDATE_QUIZ_FIELDS: FieldConfig[] = [
    {
        key: "name",
        type: "text",
        label: "Name",
        required: false,
        maxLength: 60,
        showCharCount: true,
        placeholder: "e.g., Chapter 5 Quiz",
    },
];

const QuizzesTab: React.FC<QuizzesTabProps> = ({ studySetId }) => {
    /**
     * Variables
     */

    const router = useRouter();

    // Global
    const [quizzes, setQuizzes] = useState<QuizResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState("");

    // UI
    const [showDropdown, setShowDropdown] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Create
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    // Note: Reusing isLoading or adding isCreating if your UI needs a specific spinner
    const [isCreating, setIsCreating] = useState(false);

    // Edit
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<QuizResponse | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Delete
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState<QuizResponse | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    /**
     * Functions
     */

    // Data fetching
    const fetchQuizzes = async () => {
        setIsLoading(true);
        const response = await getQuizzesForStudySet(studySetId);
        if (response.data) {
            setQuizzes(response.data);
        } else {
            toast.error(response.error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchQuizzes();
    }, [studySetId]);

    // Filtering
    const filteredQuizzes = useMemo(() => {
        if (!query.trim()) return quizzes;
        return quizzes.filter((quiz) =>
            quiz.name.toLowerCase().includes(query.toLowerCase()),
        );
    }, [query, quizzes]);

    // Create
    const handleConfirmCreate = async (
        name: string,
        numQuestions: number,
        prompt: string,
        additionalInstructions?: string,
    ) => {
        setIsCreating(true);

        const payload = {
            name,
            numQuestions,
            prompt,
            allowedTypes: [
                QuestionType.MULTIPLE_CHOICE,
                QuestionType.MULTIPLE_ANSWER,
                QuestionType.SHORT_ANSWER,
                QuestionType.TRUE_FALSE,
            ],
            ...(additionalInstructions?.trim() && {
                additionalInstructions: additionalInstructions.trim(),
            }),
        };

        const result = await createQuiz(studySetId, payload);

        if (result.data) {
            const { quizId } = result.data;
            router.push(`/app/study-sets/${studySetId}/quizzes/${quizId}`);
        } else {
            toast.error(result.error);
        }

        setIsCreating(false);
    };

    // Edit
    const handleEditClick = (quiz: QuizResponse) => {
        setEditingQuiz(quiz);
        setIsEditModalOpen(true);
    };

    const handleConfirmUpdate = async (quizId: string, name: string) => {
        setIsUpdating(true);

        const payload = {
            name,
        };

        const response = await updateQuiz(quizId, payload);

        if (response.success && response.data) {
            fetchQuizzes();
            setIsEditModalOpen(false);
            setEditingQuiz(null);
            setShowDropdown(null);
        } else {
            toast.error(response.error);
        }

        setIsUpdating(false);
    };

    // Delete
    const handleDeleteClick = (quiz: QuizResponse) => {
        setQuizToDelete(quiz);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!quizToDelete) return;

        setIsDeleting(true);
        const response = await deleteQuiz(quizToDelete.quizId);

        if (response.success) {
            fetchQuizzes();
        } else {
            toast.error(response.error);
        }

        setIsDeleteModalOpen(false);
        setQuizToDelete(null);
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
            {/* Create quiz modal */}
            <AbstractModal
                isOpen={isCreateModalOpen}
                title="Create Quiz"
                fields={CREATE_QUIZ_FIELDS}
                initialValues={{
                    name: "",
                    numQuestions: "10",
                    prompt: "",
                    additionalInstructions: "",
                }}
                onConfirm={({
                    name,
                    numQuestions,
                    prompt,
                    additionalInstructions,
                }) =>
                    handleConfirmCreate(
                        name,
                        Number(numQuestions),
                        prompt,
                        additionalInstructions || undefined,
                    )
                }
                onCancel={() => setIsCreateModalOpen(false)}
                isLoading={isCreating}
                confirmLabel="Create"
                confirmLoadingLabel="Creating..."
            />

            {/* Edit quiz modal */}
            <AbstractModal
                isOpen={isEditModalOpen}
                title="Edit Quiz"
                fields={UPDATE_QUIZ_FIELDS}
                initialValues={{
                    name: editingQuiz?.name ?? "",
                }}
                onConfirm={({ name }) =>
                    editingQuiz && handleConfirmUpdate(editingQuiz.quizId, name)
                }
                onCancel={() => {
                    setIsEditModalOpen(false);
                    setEditingQuiz(null);
                }}
                isLoading={isUpdating}
                confirmLabel="Save"
                confirmLoadingLabel="Saving..."
            />

            {/* Delete quiz modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message={`Are you sure you want to delete the "${quizToDelete?.name}" quiz?`}
                confirmMessage="Deleting..."
                isLoading={isDeleting}
            />

            {/* Actions */}
            <div className="flex flex-row w-full mb-5 space-x-3">
                {/* Search bar */}
                <SearchBar
                    query={query}
                    onQueryChange={setQuery}
                    placeholder="Search quizzes..."
                />
                {/* New quiz button */}
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex flex-row justify-center items-center bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) cursor-pointer rounded-xl w-40 text-white font-medium"
                >
                    <Plus className="mr-1" />
                    New quiz
                </button>
            </div>

            {/* Body */}
            <div className="space-y-5 w-full">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader className="w-10 h-10 animate-spin text-gray-400" />
                        <p className="mt-4 text-gray-400">Loading quizzes...</p>
                    </div>
                ) : filteredQuizzes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Brain className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-400 text-lg">
                            {query.trim()
                                ? "No quizzes match your search"
                                : "No quizzes yet"}
                        </p>
                        {!query.trim() && (
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="mt-4 bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) px-6 py-2 rounded-lg font-medium cursor-pointer"
                            >
                                Create quiz
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {filteredQuizzes.map((quiz, i) => (
                            <ItemDisplayCard
                                key={quiz.quizId || i}
                                title={quiz.name}
                                subtitle={`Created ${formatDate(quiz.createdAt)}`}
                                icon={
                                    <Brain className="w-10 h-10 text-(--discord-blurple)" />
                                }
                                stats={[
                                    `${quiz.totalQuestions} questions`,
                                    `${quiz.totalPoints} points`,
                                    `${quiz.totalAttempts} attempts`,
                                ]}
                                onCardClick={() =>
                                    router.push(
                                        `/app/study-sets/${studySetId}/quizzes/${quiz.quizId}`,
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
                                        onEdit={() => handleEditClick(quiz)}
                                        onDelete={() => handleDeleteClick(quiz)}
                                    />
                                }
                                actions={[
                                    {
                                        label: "Take Quiz",
                                        icon: <Brain className="w-5 h-5" />,
                                        onClick: () =>
                                            router.push(
                                                `/app/study-sets/${studySetId}/quizzes/${quiz.quizId}`,
                                            ),
                                    },
                                    {
                                        label: "Stats",
                                        icon: (
                                            <ChartNoAxesCombined className="w-5 h-5" />
                                        ),
                                        onClick: () =>
                                            router.push(
                                                `/app/study-sets/${studySetId}/quizzes/${quiz.quizId}#stats`,
                                            ),
                                    },
                                ]}
                            />
                        ))}
                    </>
                )}

                {/* Create quiz button */}
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex flex-row w-full items-center justify-center space-x-3 outline-dashed rounded-lg p-3 outline-2 outline-(--discord-blurple-hover) bg-(--discord-gray-1) hover:bg-(--discord-gray-2)"
                >
                    <Plus className="h-8 w-8 text-(--discord-blurple)" />
                    <label className="text-lg font-medium cursor-pointer">
                        Create new quiz
                    </label>
                </button>
            </div>
        </>
    );
};

export default QuizzesTab;
