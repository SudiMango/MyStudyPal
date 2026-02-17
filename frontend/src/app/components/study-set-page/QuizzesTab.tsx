"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Quiz,
    getAllQuizzesForStudySet,
    deleteQuiz,
    updateQuiz,
} from "@/lib/api/quiz-api";
import {
    Brain,
    ChartNoAxesCombined,
    EllipsisVertical,
    Plus,
    Loader,
    Clock,
} from "lucide-react";
import ConfirmationModal from "@/app/components/global/ConfirmationModal";
import SettingsDropdown from "@/app/components/global/SettingsDropdown";
import SearchBar from "@/app/components/global/SearchBar";
import EditQuizModal from "../quiz-page/EditQuizModal";
import { formatDate } from "@/lib/util";
import CreateQuizModal from "../CreateQuizModal";

interface QuizzesTabProps {
    studySetId: string;
}

const QuizzesTab: React.FC<QuizzesTabProps> = ({ studySetId }) => {
    const router = useRouter();

    const [query, setQuery] = useState("");
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Delete state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Edit state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    /**
     * Fetch quizzes for this study set
     */
    const fetchQuizzes = async () => {
        setIsLoading(true);
        const response = await getAllQuizzesForStudySet(studySetId);
        if (response.data) {
            setQuizzes(response.data);
        } else {
            alert(response.error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchQuizzes();
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
     * Handle quiz delete
     */
    const handleDeleteClick = (quiz: Quiz) => {
        setQuizToDelete(quiz);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (quizToDelete) {
            setIsDeleting(true);
            const response = await deleteQuiz(quizToDelete.quizId);
            setIsDeleting(false);

            if (!response.error) {
                fetchQuizzes();
            } else {
                alert(response.error);
            }
            setIsDeleteModalOpen(false);
            setQuizToDelete(null);
            setShowDropdown(null);
        }
    };

    /**
     * Handle quiz edit
     */
    const handleEditClick = (quiz: Quiz) => {
        setEditingQuiz(quiz);
        setIsEditModalOpen(true);
    };

    const handleConfirmUpdate = async (quizId: string, name: string) => {
        setIsUpdating(true);
        const response = await updateQuiz(quizId, {
            name: name,
        });
        setIsUpdating(false);

        if (!response.error) {
            fetchQuizzes();
            setIsEditModalOpen(false);
            setEditingQuiz(null);
            setShowDropdown(null);
        } else {
            alert(response.error);
        }
    };

    // Filtered quizzes for search
    const filteredQuizzes = useMemo(() => {
        if (!query.trim()) return quizzes;
        return quizzes.filter((quiz) =>
            quiz.name.toLowerCase().includes(query.toLowerCase()),
        );
    }, [query, quizzes]);

    return (
        <>
            {/* Delete quiz modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message={`Are you sure you want to delete the "${quizToDelete?.name}" quiz?`}
                confirmMessage="Deleting..."
                isLoading={isDeleting}
            />

            {/* Create quiz modal */}
            <CreateQuizModal
                isOpen={isCreateModalOpen}
                studySetId={studySetId}
                onCancel={() => setIsCreateModalOpen(false)}
            />

            {/* Edit quiz modal */}
            <EditQuizModal
                isOpen={isEditModalOpen}
                quiz={editingQuiz}
                onConfirm={handleConfirmUpdate}
                onCancel={() => {
                    setIsEditModalOpen(false);
                    setEditingQuiz(null);
                }}
                isLoading={isUpdating}
            />

            {/* Search bar and create button */}
            <div className="flex flex-row w-full mb-5 space-x-3">
                <SearchBar
                    query={query}
                    onQueryChange={setQuery}
                    placeholder="Search quizzes..."
                />
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex flex-row justify-center items-center bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) cursor-pointer rounded-xl w-40 text-white font-medium"
                >
                    <Plus className="mr-1" />
                    New quiz
                </button>
            </div>

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
                                className="mt-4 bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) px-6 py-2 rounded-lg font-medium"
                            >
                                Create quiz
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {filteredQuizzes.map((quiz, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-start justify-center w-full shadow-xl rounded-xl bg-(--discord-gray-4) p-4 transform transition-transform duration-200 hover:scale-105"
                            >
                                <div className="flex flex-row items-center justify-center space-x-3 w-full">
                                    <Brain className="w-10 h-10 text-(--discord-blurple)" />
                                    <div className="flex flex-col">
                                        <label className="text-md font-semibold">
                                            {quiz.name}
                                        </label>
                                        <label className="text-sm opacity-70">
                                            Created {formatDate(quiz.createdAt)}
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
                                            onEdit={() => handleEditClick(quiz)}
                                            onDelete={() =>
                                                handleDeleteClick(quiz)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-row space-x-3">
                                    <div className="bg-(--discord-gray-2) py-0.5 px-2 rounded-lg">
                                        <label className="text-sm">
                                            {quiz.totalQuestions} questions
                                        </label>
                                    </div>
                                    <div className="bg-(--discord-gray-2) py-0.5 px-2 rounded-lg">
                                        <label className="text-sm">
                                            {quiz.totalPoints} points
                                        </label>
                                    </div>
                                    <div className="bg-(--discord-gray-2) py-0.5 px-2 rounded-lg flex flex-row items-center space-x-1">
                                        <Clock className="w-3 h-3" />
                                        <label className="text-sm">
                                            {quiz.timeLimitMinutes} min
                                        </label>
                                    </div>
                                </div>

                                <div className="h-0.5 w-full bg-(--discord-gray-1) my-5 rounded-2xl"></div>

                                <div className="flex flex-row space-x-3 w-full">
                                    <button
                                        onClick={() =>
                                            router.push(
                                                `/app/study-sets/${studySetId}/quizzes/${quiz.quizId}`,
                                            )
                                        }
                                        className="w-1/2 bg-(--discord-gray-1) flex flex-row justify-center items-center space-x-3 p-3 rounded-lg outline outline-(--discord-blurple) hover:bg-(--discord-gray-2)"
                                    >
                                        <Brain className="w-5 h-5" />
                                        <span>Take Quiz</span>
                                    </button>
                                    <button className="w-1/2 bg-(--discord-gray-1) flex flex-row justify-center items-center space-x-3 p-3 rounded-lg outline outline-(--discord-blurple) hover:bg-(--discord-gray-2)">
                                        <ChartNoAxesCombined className="w-5 h-5" />
                                        <span>Stats</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </>
                )}

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
