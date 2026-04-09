"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    getAttemptAnswers,
    getOneAttemptDetails,
} from "@/lib/api/quiz-attempt-api";
import {
    Loader,
    CheckCircle2,
    XCircle,
    Clock,
    Target,
    Award,
    alertCircle,
    ArrowLeft,
    Calendar,
    SquareCheck,
    Circle,
    Square,
} from "lucide-react";
import { formatDate } from "@/lib/util";
import { getOneStudySet } from "@/lib/api/study-set-api";
import {
    OneAttemptPage_QuizAttemptDetailsResponse,
    QuizAttemptAnswerResponse,
} from "@/lib/dto/quiz-attempt-dto";
import { StudySetResponse } from "@/lib/dto/study-set-dto";

const AttemptDetailsPage = () => {
    const { studySetId, attemptId } = useParams();
    const router = useRouter();

    const [attempt, setAttempt] =
        useState<OneAttemptPage_QuizAttemptDetailsResponse | null>(null);
    const [attemptAnswers, setAttemptAnswers] = useState<
        QuizAttemptAnswerResponse[]
    >([]);
    const [studySet, setStudySet] = useState<StudySetResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!attemptId) return;
            setIsLoading(true);
            const res = await getOneAttemptDetails(attemptId as string);

            if (res.success && res.data) {
                setAttempt(res.data);
            } else {
                setError(res.error);
            }

            const answersRes = await getAttemptAnswers(attemptId as string);
            if (answersRes.success && answersRes.data) {
                setAttemptAnswers(answersRes.data);
            } else {
                setError(answersRes.error);
            }

            const studySetResponse = await getOneStudySet(studySetId as string);
            if (studySetResponse.data) setStudySet(studySetResponse.data);

            setIsLoading(false);
        };

        fetchDetails();
    }, [attemptId]);

    const getDuration = (start: string, end: string) => {
        const durationMs = new Date(end).getTime() - new Date(start).getTime();
        const mins = Math.floor(durationMs / 60000);
        const secs = Math.floor((durationMs % 60000) / 1000);
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-20">
                <Loader className="w-10 h-10 animate-spin text-(--discord-blurple)" />
                <p className="mt-4 text-gray-400">Fetching results...</p>
            </div>
        );
    }

    if (error || !attempt) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-20">
                <alertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-white text-lg">
                    {error || "Attempt not found"}
                </p>
                <button
                    onClick={() => router.back()}
                    className="mt-4 text-(--discord-blurple) hover:underline flex items-center gap-2"
                >
                    <ArrowLeft size={16} /> Go Back
                </button>
            </div>
        );
    }

    const percentage = Math.round((attempt.score / attempt.maxScore) * 100);

    return (
        <div className="flex flex-col items-center min-h-screen w-full p-5 mt-5 overflow-x-hidden">
            <div className="flex flex-col justify-center items-center w-full h-full max-w-150">
                {/* Breadcrumbs */}
                <div className="mr-auto mb-2 opacity-70 text-sm">
                    <button
                        className="underline hover:opacity-85 cursor-pointer"
                        onClick={() =>
                            router.push("/app/study-sets#flashcards")
                        }
                    >
                        study sets
                    </button>
                    <label> / </label>
                    <button
                        className="underline hover:opacity-85 cursor-pointer"
                        onClick={() =>
                            router.push(`/app/study-sets/${studySetId}`)
                        }
                    >
                        {studySet?.name}
                    </button>
                    <label> / </label>
                    <button
                        className="underline hover:opacity-85 cursor-pointer"
                        onClick={() => router.refresh()}
                    >
                        Attempt {attempt?.attemptId}
                    </button>
                </div>

                {/* Header */}
                <div className="flex flex-row items-center w-full mb-6">
                    <label className="mr-auto text-3xl font-bold flex items-center gap-3">
                        <Award className="text-yellow-400 w-8 h-8" />
                        Quiz Results
                    </label>
                </div>

                {/* Bento Grid Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mb-8">
                    <div className="bg-(--discord-gray-4) p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center shadow-md">
                        <Target
                            className={`w-5 h-5 mb-1.5 ${percentage >= 70 ? "text-green-400" : "text-orange-400"}`}
                        />
                        <span className="text-xl font-black">
                            {percentage}%
                        </span>
                        <span className="text-[10px] uppercase opacity-40 font-bold tracking-widest text-white">
                            Score
                        </span>
                    </div>

                    <div className="bg-(--discord-gray-4) p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center shadow-md">
                        <Award className="w-5 h-5 mb-1.5 text-orange-400" />
                        <span className="text-xl font-black">
                            {attempt.score}/{attempt.maxScore}
                        </span>
                        <span className="text-[10px] uppercase opacity-40 font-bold tracking-widest text-white">
                            Points
                        </span>
                    </div>

                    <div className="bg-(--discord-gray-4) p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center shadow-md">
                        <Clock className="w-5 h-5 mb-1.5 text-blue-400" />
                        <span className="text-lg font-black">
                            {getDuration(
                                attempt.startedAt,
                                attempt.completedAt,
                            )}
                        </span>
                        <span className="text-[10px] uppercase opacity-40 font-bold tracking-widest text-white">
                            Duration
                        </span>
                    </div>

                    <div className="bg-(--discord-gray-4) p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center shadow-md">
                        <Calendar className="w-5 h-5 mb-1.5 text-purple-400" />
                        <span className="text-xs font-black mt-1 leading-tight">
                            {formatDate(attempt.completedAt)}
                        </span>
                        <span className="text-[10px] uppercase opacity-40 font-bold tracking-widest text-white mt-1">
                            Finished
                        </span>
                    </div>
                </div>

                <label className="font-bold text-lg mr-auto mb-4 ml-1">
                    All questions ({attemptAnswers.length})
                </label>

                <div className="space-y-5">
                    {attemptAnswers.map((qa, i) => {
                        if (!qa.question) return null;
                        const question = qa.question;

                        return (
                            <div
                                key={i}
                                className={`bg-(--discord-gray-4) rounded-lg flex flex-col p-4 space-y-0.5 border-l-4 ${
                                    qa.isCorrect
                                        ? "border-green-500"
                                        : "border-red-500"
                                }`}
                            >
                                <div className="flex flex-row items-center mb-1 border-b border-(--discord-gray-1) pb-2">
                                    <label className="opacity-60 text-sm">
                                        #{i + 1}
                                    </label>
                                    <div className="flex flex-row items-center justify-center ml-auto space-x-2">
                                        <div className="flex flex-row items-center space-x-2">
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                                                    qa.isCorrect
                                                        ? "bg-green-500/20 text-green-400"
                                                        : "bg-red-500/20 text-red-400"
                                                }`}
                                            >
                                                {qa.pointsEarned}/
                                                {question.points} pts
                                            </span>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full ${
                                                    question.questionType ===
                                                    "MULTIPLE_CHOICE"
                                                        ? "bg-blue-500/20 text-blue-400"
                                                        : question.questionType ===
                                                            "MULTIPLE_ANSWER"
                                                          ? "bg-purple-500/20 text-purple-400"
                                                          : question.questionType ===
                                                              "SHORT_ANSWER"
                                                            ? "bg-orange-500/20 text-orange-400"
                                                            : "bg-green-500/20 text-green-400"
                                                }`}
                                            >
                                                {question.questionType.replace(
                                                    "_",
                                                    " ",
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <label className="py-1">
                                    Q: {question.questionText}
                                </label>
                                <p className="mt-1 mb-2 text-sm italic opacity-70 py-1 px-2 bg-(--discord-gray-3) rounded-lg border-l-4 border-(--discord-blurple)">
                                    H: {question.hint}
                                </p>
                                <div className="grid grid-cols-1 gap-2 mt-2">
                                    {question.questionType !==
                                    "SHORT_ANSWER" ? (
                                        question.options.map(
                                            (option, optIdx) => {
                                                const isCorrectAnswer =
                                                    question.correctAnswers.includes(
                                                        option,
                                                    );
                                                const isUserPicked =
                                                    qa.userAnswer.includes(
                                                        option,
                                                    );

                                                const isRound =
                                                    question.questionType ===
                                                        "MULTIPLE_CHOICE" ||
                                                    question.questionType ===
                                                        "TRUE_FALSE";

                                                let containerStyle =
                                                    "border-(--discord-gray-1) bg-(--discord-gray-3) opacity-40";
                                                if (isCorrectAnswer) {
                                                    containerStyle =
                                                        "border-green-500/50 bg-green-500/10 text-green-400 opacity-100";
                                                } else if (
                                                    isUserPicked &&
                                                    !isCorrectAnswer
                                                ) {
                                                    containerStyle =
                                                        "border-red-500/50 bg-red-500/10 text-red-400 opacity-100";
                                                }

                                                return (
                                                    <div
                                                        key={optIdx}
                                                        className={`flex items-center justify-between px-3 py-2.5 border text-sm transition-all ${
                                                            isRound
                                                                ? "rounded-full"
                                                                : "rounded-lg"
                                                        } ${containerStyle}`}
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            {isCorrectAnswer ? (
                                                                isRound ? (
                                                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                                ) : (
                                                                    <SquareCheck className="w-4 h-4 shrink-0" />
                                                                )
                                                            ) : isUserPicked ? (
                                                                <XCircle className="w-4 h-4 shrink-0" />
                                                            ) : isRound ? (
                                                                <Circle className="w-4 h-4 opacity-20 shrink-0" />
                                                            ) : (
                                                                <Square className="w-4 h-4 opacity-20 shrink-0" />
                                                            )}
                                                            <span
                                                                className={
                                                                    isCorrectAnswer ||
                                                                    isUserPicked
                                                                        ? "font-bold"
                                                                        : ""
                                                                }
                                                            >
                                                                {option}
                                                            </span>
                                                        </div>

                                                        {isUserPicked && (
                                                            <span className="text-[9px] uppercase font-black tracking-tighter opacity-80 px-2 py-0.5 rounded bg-black/20">
                                                                Your Pick
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            },
                                        )
                                    ) : (
                                        <div className="space-y-3">
                                            <div
                                                className={`px-4 py-3 rounded-xl border flex flex-col ${
                                                    qa.isCorrect
                                                        ? "border-green-500/50 bg-green-500/10 text-green-400"
                                                        : "border-red-500/50 bg-red-500/10 text-red-400"
                                                }`}
                                            >
                                                <span className="text-[10px] uppercase font-bold opacity-60 mb-1">
                                                    Your Answer:
                                                </span>
                                                <span className="font-mono text-base">
                                                    {qa.userAnswer[0] ||
                                                        "No answer provided"}
                                                </span>
                                            </div>

                                            {!qa.isCorrect && (
                                                <div className="px-4 py-3 rounded-xl border border-green-500/30 bg-green-500/5 text-green-400/90 flex flex-col">
                                                    <span className="text-[10px] uppercase font-bold opacity-60 mb-1">
                                                        Correct Answer:
                                                    </span>
                                                    <span className="font-mono text-base">
                                                        {question.correctAnswers.join(
                                                            ", ",
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AttemptDetailsPage;
