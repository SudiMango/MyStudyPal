import React, { useEffect, useRef, useState } from "react";
import {
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Circle,
    EllipsisVertical,
    Square,
    SquareCheck,
} from "lucide-react";
import ConfirmationModal from "../global/ConfirmationModal";
import SettingsDropdown from "../global/SettingsDropdown";
import {
    deleteQuizQuestion,
    updateQuizQuestion,
} from "@/lib/api/quiz-question-api";
import {
    QuizQuestionResponse,
    UpdateQuizQuestionRequest,
} from "@/lib/dto/quiz-question-dto";
import { toast } from "sonner";
import EditQuizQuestionModal from "./EditQuizQuestionModal";

interface QuestionListProps {
    questions: QuizQuestionResponse[];
    fetchEverything: () => Promise<void>;
}

const AllQuestionsPanel: React.FC<QuestionListProps> = ({
    questions,
    fetchEverything,
}) => {
    /**
     * Variables
     */

    // Global
    const [showAllQuestions, setShowAllQuestions] = useState<boolean>(false);
    const [showDropdown, setShowDropdown] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Delete
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [questionToDelete, setQuestionToDelete] =
        useState<QuizQuestionResponse | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Edit
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] =
        useState<QuizQuestionResponse | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Visibility
    const [visibleHints, setVisibleHints] = useState<Set<number>>(new Set());
    const [visibleAnswers, setVisibleAnswers] = useState<Set<number>>(
        new Set(),
    );

    /**
     * Functions
     */

    // Toggles
    const toggleHint = (index: number) => {
        const newHints = new Set(visibleHints);
        if (newHints.has(index)) newHints.delete(index);
        else newHints.add(index);
        setVisibleHints(newHints);
    };

    const toggleAnswer = (index: number) => {
        const newAnswers = new Set(visibleAnswers);
        if (newAnswers.has(index)) newAnswers.delete(index);
        else newAnswers.add(index);
        setVisibleAnswers(newAnswers);
    };

    const handleDropdownToggle = (e: any, index: number) => {
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

    // Deleting
    const handleDeleteClick = (question: QuizQuestionResponse) => {
        setQuestionToDelete(question);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!questionToDelete) return;

        setIsDeleting(true);
        const response = await deleteQuizQuestion(questionToDelete.questionId);
        setIsDeleting(false);

        if (response.success) {
            fetchEverything();
        } else {
            toast.error(response.error);
        }

        setIsDeleteModalOpen(false);
        setQuestionToDelete(null);
        setShowDropdown(null);
    };

    // Edit
    const handleEditClick = (question: QuizQuestionResponse) => {
        setEditingQuestion(question);
        setIsEditModalOpen(true);
    };

    const handleConfirmUpdate = async (
        questionId: string,
        req: UpdateQuizQuestionRequest,
    ) => {
        if (!editingQuestion) return;
        setIsUpdating(true);
        const response = await updateQuizQuestion(questionId, req);
        setIsUpdating(false);
        if (response.success && response.data) {
            fetchEverything();
            setIsEditModalOpen(false);
            setEditingQuestion(null);
            setShowDropdown(null);
        } else {
            toast.error(response.error);
        }
    };

    return (
        <div className="bg-(--discord-gray-3) w-full rounded-xl shadow-lg p-5 mt-5 outline outline-(--discord-blurple) flex flex-col">
            {/* Edit */}
            <EditQuizQuestionModal
                isOpen={isEditModalOpen}
                question={editingQuestion}
                onConfirm={handleConfirmUpdate}
                onCancel={() => {
                    setIsEditModalOpen(false);
                    setEditingQuestion(null);
                }}
                isLoading={isUpdating}
                totalQuestions={questions.length}
            />

            {/* Delete */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message={`Are you sure you want to delete this question?`}
                confirmMessage="Deleting..."
                isLoading={isDeleting}
            />

            {/* Header */}
            <div className="flex flex-row">
                <label className="font-bold text-lg mr-auto">
                    All questions ({questions.length})
                </label>
                <button onClick={() => setShowAllQuestions(!showAllQuestions)}>
                    {showAllQuestions ? (
                        <ChevronUp className="h-7 w-7 hover:text-(--discord-blurple)" />
                    ) : (
                        <ChevronDown className="h-7 w-7 hover:text-(--discord-blurple)" />
                    )}
                </button>
            </div>

            {/* Divider */}
            <div
                hidden={!showAllQuestions}
                className="w-full h-0.5 bg-(--discord-gray-2) my-5"
            />

            {/* Body */}
            <div hidden={!showAllQuestions} className="space-y-5">
                {questions.map((q, i) => {
                    const isHintVisible = visibleHints.has(i);
                    const isAnswerVisible = visibleAnswers.has(i);

                    return (
                        <div
                            key={q.questionId}
                            className="bg-(--discord-gray-4) rounded-md flex flex-col p-2 space-y-0.5"
                        >
                            <div className="flex flex-row items-center mb-1 border-b border-(--discord-gray-1) pb-2">
                                <label className="opacity-60 text-sm">
                                    #{q.orderIndex}
                                </label>
                                <div className="flex flex-row items-center justify-center ml-auto space-x-2">
                                    <div className="flex flex-row items-center space-x-2">
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-(--discord-blurple)/20 text-(--discord-blurple)">
                                            {q.points}{" "}
                                            {q.points === 1 ? "point" : ""}
                                        </span>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full ${
                                                q.questionType ===
                                                "MULTIPLE_CHOICE"
                                                    ? "bg-blue-500/20 text-blue-400"
                                                    : q.questionType ===
                                                        "MULTIPLE_ANSWER"
                                                      ? "bg-purple-500/20 text-purple-400"
                                                      : q.questionType ===
                                                          "SHORT_ANSWER"
                                                        ? "bg-orange-500/20 text-orange-400"
                                                        : "bg-green-500/20 text-green-400"
                                            }`}
                                        >
                                            {q.questionType.replace("_", " ")}
                                        </span>
                                    </div>
                                    <div
                                        className="relative flex justify-center items-center"
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
                                            <EllipsisVertical className="w-5 h-5 opacity-80" />
                                        </button>

                                        <SettingsDropdown
                                            isOpen={showDropdown === i}
                                            onClose={() =>
                                                setShowDropdown(null)
                                            }
                                            onEdit={() => handleEditClick(q)}
                                            onDelete={() =>
                                                handleDeleteClick(q)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <label className="py-1">Q: {q.questionText}</label>

                            {isHintVisible && (
                                <p className="mt-1 mb-2 text-sm italic opacity-70 py-1 px-2 bg-(--discord-gray-3) rounded-lg border-l-4 border-(--discord-blurple)">
                                    H: {q.hint}
                                </p>
                            )}

                            <div className="grid grid-cols-1 gap-2">
                                {q.questionType !== "SHORT_ANSWER" ? (
                                    q.options.map((option, optIdx) => {
                                        const shouldHighlight =
                                            isAnswerVisible &&
                                            q.correctAnswers.includes(option);

                                        const isRound =
                                            q.questionType ===
                                                "MULTIPLE_CHOICE" ||
                                            q.questionType === "TRUE_FALSE";

                                        return (
                                            <div
                                                key={optIdx}
                                                className={`flex items-center space-x-3 px-3 py-2 border text-sm transition-all ${
                                                    isRound
                                                        ? "rounded-full"
                                                        : "rounded-lg"
                                                } ${
                                                    shouldHighlight
                                                        ? "border-green-500/50 bg-green-500/10 text-green-400"
                                                        : "border-(--discord-gray-1) bg-(--discord-gray-3) opacity-60"
                                                }`}
                                            >
                                                {shouldHighlight ? (
                                                    isRound ? (
                                                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                    ) : (
                                                        <SquareCheck className="w-4 h-4 shrink-0" />
                                                    )
                                                ) : isRound ? (
                                                    <Circle className="w-4 h-4 opacity-20 shrink-0" />
                                                ) : (
                                                    <Square className="w-4 h-4 opacity-20 shrink-0" />
                                                )}
                                                <span
                                                    className={
                                                        shouldHighlight
                                                            ? "font-medium"
                                                            : ""
                                                    }
                                                >
                                                    {option}
                                                </span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div
                                        className={`px-3 py-2 rounded-lg border text-sm italic transition-colors ${
                                            isAnswerVisible
                                                ? "border-green-500/50 bg-green-500/10 text-green-400"
                                                : "border-(--discord-gray-1) bg-(--discord-gray-3) opacity-60 text-gray-400"
                                        }`}
                                    >
                                        {isAnswerVisible
                                            ? `Correct Answer: ${q.correctAnswers.join(", ")}`
                                            : "Click 'show answer' to see correct answer"}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-row text-xs ml-auto gap-x-3 mt-1 underline text-gray-400">
                                <button
                                    onClick={() => toggleHint(i)}
                                    className="hover:text-gray-200 transition-colors"
                                >
                                    {isHintVisible ? "hide hint" : "show hint"}
                                </button>
                                <button
                                    onClick={() => toggleAnswer(i)}
                                    className="hover:text-gray-200 transition-colors"
                                >
                                    {isAnswerVisible
                                        ? "hide answer"
                                        : "show answer"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AllQuestionsPanel;
