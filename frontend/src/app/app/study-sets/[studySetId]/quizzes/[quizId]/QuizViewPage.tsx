"use client";

import ConfirmationModal from "@/app/components/global/ConfirmationModal";
import AllAttemptsPanel from "@/app/components/quiz/AllAttemptsPanel";
import AllQuestionsPanel from "@/app/components/quiz/AllQuestionsPanel";
import { getAllAttemptsForQuiz } from "@/lib/api/quiz-attempt-api";
import { deleteQuiz, getOneQuizDetails, updateQuiz } from "@/lib/api/quiz-api";
import { getQuizQuestionsForQuiz } from "@/lib/api/quiz-question-api";
import { getOneStudySet } from "@/lib/api/study-set-api";
import { QuizQuestionResponse } from "@/lib/dto/quiz-question-dto";
import { StudySetResponse } from "@/lib/dto/study-set-dto";
import {
    Clock,
    Loader,
    Play,
    RotateCcw,
    Settings,
    Star,
    Trophy,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { QuizResponse } from "@/lib/dto/quiz-dto";
import { QuizAttemptResponse } from "@/lib/dto/quiz-attempt-dto";
import SettingsModal from "@/app/components/global/SettingsModal";
import { formatDate } from "@/lib/util";
import AbstractModal from "@/app/components/global/AbstractModal";
import { FieldConfig } from "@/lib/types/modal";

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

const QuizViewPage = () => {
    const router = useRouter();
    const { studySetId, quizId } = useParams();

    const [quizDetails, setQuizDetails] = useState<QuizResponse | null>(null);
    const [questions, setQuestions] = useState<QuizQuestionResponse[]>([]);
    const [attempts, setAttempts] = useState<QuizAttemptResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [studySet, setStudySet] = useState<StudySetResponse | null>(null);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchEverything = async () => {
        setIsLoading(true);

        const quizRes = await getOneQuizDetails(quizId as string);
        if (quizRes.data) {
            setQuizDetails(quizRes.data);
        } else {
            toast.error(quizRes.error);
        }

        const studySetResponse = await getOneStudySet(studySetId as string);
        if (studySetResponse.data) {
            setStudySet(studySetResponse.data);
        } else {
            toast.error(studySetResponse.error);
        }

        const questionsResponse = await getQuizQuestionsForQuiz(
            quizId as string,
        );
        if (questionsResponse.data) {
            setQuestions(questionsResponse.data);
        } else {
            toast.error(questionsResponse.error);
        }

        const attemptsResponse = await getAllAttemptsForQuiz(quizId as string);
        if (attemptsResponse.data) {
            setAttempts(attemptsResponse.data);
        } else {
            toast.error(attemptsResponse.error);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        fetchEverything();
    }, []);

    const getStats = () => {
        if (!quizDetails) return null;

        const bestScore =
            attempts.length > 0
                ? Math.max(...attempts.map((a) => (a.score / a.maxScore) * 100))
                : 0;

        return {
            bestScore: Math.round(bestScore),
            totalAttempts: attempts.length,
            totalPoints: quizDetails.totalPoints,
            questionCount: quizDetails.totalQuestions,
        };
    };

    const stats = getStats();

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        const res = await deleteQuiz(quizId as string);
        if (res.success) {
            router.push(`/app/study-sets/${studySetId}`);
        }
        setIsDeleting(false);
    };

    const handleConfirmUpdate = async (quizId: string, name: string) => {
        setIsUpdating(true);

        const payload = {
            name,
        };

        const response = await updateQuiz(quizId, payload);

        if (response.success && response.data) {
            fetchEverything();
            setIsEditModalOpen(false);
        } else {
            toast.error(response.error);
        }

        setIsUpdating(false);
    };

    if (isLoading || !quizDetails) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-20">
                <Loader className="w-10 h-10 animate-spin text-gray-400" />
                <p className="mt-4 text-gray-400">Loading quiz details...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen w-full p-5 mt-5 overflow-x-hidden">
            <div className="flex flex-col justify-center items-center w-full h-full max-w-150">
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
                            value: formatDate(quizDetails.createdAt),
                        },
                        {
                            label: "Updated",
                            value: formatDate(quizDetails.updatedAt),
                        },
                        {
                            label: "Total questions",
                            value: questions.length.toString(),
                        },
                        {
                            label: "Total attempts",
                            value: attempts.length.toString(),
                        },
                    ]}
                />

                {/* Edit quiz modal */}
                <AbstractModal
                    isOpen={isEditModalOpen}
                    title="Edit Quiz"
                    fields={UPDATE_QUIZ_FIELDS}
                    initialValues={{
                        name: quizDetails?.name ?? "",
                    }}
                    onConfirm={({ name }) =>
                        handleConfirmUpdate(quizDetails.quizId, name)
                    }
                    onCancel={() => {
                        setIsEditModalOpen(false);
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
                    message="Are you sure you want to delete this quiz?"
                    confirmMessage="Deleting..."
                    isLoading={isUpdating}
                />

                {/* Breadcrumbs */}
                <div className="mr-auto mb-2 opacity-70 text-sm">
                    <button
                        className="underline hover:opacity-85 cursor-pointer"
                        onClick={() => router.push("/app/study-sets")}
                    >
                        study sets
                    </button>
                    <label> / </label>
                    <button
                        className="underline hover:opacity-85 cursor-pointer"
                        onClick={() =>
                            router.push(`/app/study-sets/${studySetId}#quizzes`)
                        }
                    >
                        {studySet?.name}
                    </button>
                    <label> / </label>
                    <button
                        className="underline hover:opacity-85 cursor-pointer"
                        onClick={() => router.refresh()}
                    >
                        {quizDetails?.name}
                    </button>
                </div>

                {/* Header */}
                <div className="flex flex-row items-center w-full mb-6">
                    <label className="mr-auto text-3xl font-bold flex items-center gap-3">
                        📝 {quizDetails?.name}
                    </label>
                    <div className="flex space-x-3">
                        <button
                            onClick={() =>
                                router.push(
                                    `/app/study-sets/${studySetId}/quizzes/${quizId}/attempt`,
                                )
                            }
                            className="flex items-center gap-2 px-6 py-2.5 bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 group"
                        >
                            <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                            {attempts.length > 0 ? "Retake" : "Start"}
                        </button>
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="rounded-xl bg-(--discord-gray-1) hover:bg-(--discord-gray-2) group p-2.5 border border-white/5 transition-colors"
                        >
                            <Settings className="w-5 h-5 group-hover:text-(--discord-blurple)" />
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mb-2">
                    <div className="bg-(--discord-gray-4) p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center shadow-md">
                        <Trophy
                            className={`w-5 h-5 mb-1.5 ${stats?.bestScore ? "text-yellow-400" : "text-gray-500"}`}
                        />
                        <span className="text-xl font-black">
                            {stats?.bestScore}%
                        </span>
                        <span className="text-[10px] uppercase opacity-40 font-bold tracking-widest">
                            Best Score
                        </span>
                    </div>

                    <div className="bg-(--discord-gray-4) p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center shadow-md">
                        <Star className="w-5 h-5 mb-1.5 text-orange-400" />
                        <span className="text-xl font-black">
                            {stats?.totalPoints}
                        </span>
                        <span className="text-[10px] uppercase opacity-40 font-bold tracking-widest">
                            Total Pts
                        </span>
                    </div>

                    <div className="bg-(--discord-gray-4) p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center shadow-md">
                        <Clock className="w-5 h-5 mb-1.5 text-blue-400" />
                        <span className="text-xl font-black">
                            {stats?.questionCount}
                        </span>
                        <span className="text-[10px] uppercase opacity-40 font-bold tracking-widest">
                            Questions
                        </span>
                    </div>

                    <div className="bg-(--discord-gray-4) p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center shadow-md">
                        <RotateCcw className="w-5 h-5 mb-1.5 text-green-400" />
                        <span className="text-xl font-black">
                            {stats?.totalAttempts}
                        </span>
                        <span className="text-[10px] uppercase opacity-40 font-bold tracking-widest">
                            Attempts
                        </span>
                    </div>
                </div>

                {/* All questions */}
                <AllQuestionsPanel
                    questions={questions}
                    fetchEverything={fetchEverything}
                />

                {/* All attempts */}
                <AllAttemptsPanel attempts={attempts} />
            </div>
        </div>
    );
};

export default QuizViewPage;
