"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOneQuiz, Quiz } from "@/lib/api/quiz-api"; // Assume this fetches questions/attempts too
import {
    Loader,
    ChevronLeft,
    Play,
    CheckCircle2,
    Clock,
    History,
    HelpCircle,
} from "lucide-react";
import { formatDate } from "@/lib/util";

const QuizViewPage = () => {
    const router = useRouter();
    const { studySetId, quizId } = useParams();

    const [quiz, setQuiz] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuizDetails = async () => {
            setIsLoading(true);
            const response = await getOneQuiz(quizId as string);
            if (response.data) setQuiz(response.data);
            setIsLoading(false);
        };
        fetchQuizDetails();
    }, [quizId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-20">
                <Loader className="w-10 h-10 animate-spin text-gray-400" />
                <p className="mt-4 text-gray-400">Loading quiz details...</p>
            </div>
        );
    }

    const averageScore = quiz?.quizAttempts?.length
        ? (
              (quiz.quizAttempts.reduce(
                  (acc: number, curr: any) => acc + curr.score / curr.maxScore,
                  0,
              ) /
                  quiz.quizAttempts.length) *
              100
          ).toFixed(0)
        : 0;

    return (
        <div className="flex flex-col items-center min-h-screen w-full p-5 mt-5">
            <div className="flex flex-col w-full max-w-3xl">
                {/* Breadcrumbs */}
                <div className="mb-4 opacity-70 text-sm flex items-center gap-2">
                    <button
                        onClick={() => router.push("/app/study-sets")}
                        className="hover:underline"
                    >
                        study-sets
                    </button>
                    <span>/</span>
                    <button
                        onClick={() =>
                            router.push(`/app/study-sets/${studySetId}`)
                        }
                        className="hover:underline"
                    >
                        Study Set
                    </button>
                    <span>/</span>
                    <span className="font-semibold text-(--discord-blurple)">
                        {quiz?.name}
                    </span>
                </div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-(--discord-gray-4) p-6 rounded-xl shadow-lg border border-(--discord-gray-1) mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {quiz?.name}
                        </h1>
                        <div className="flex gap-4 text-sm opacity-80">
                            <span className="flex items-center gap-1">
                                <HelpCircle size={16} />{" "}
                                {quiz?.quizQuestions?.length} Questions
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={16} /> {quiz?.timeLimitMinutes}m
                                Limit
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() =>
                            router.push(
                                `/app/study-sets/${studySetId}/quizzes/${quizId}/take`,
                            )
                        }
                        className="mt-4 md:mt-0 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition-all transform hover:scale-105"
                    >
                        <Play size={20} fill="currentColor" /> Start Quiz
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Questions List */}
                    <div className="md:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                            <CheckCircle2 className="text-(--discord-blurple)" />{" "}
                            Questions Overview
                        </h2>
                        {quiz?.quizQuestions?.map((q: any, idx: number) => (
                            <div
                                key={q.questionId}
                                className="bg-(--discord-gray-3) p-5 rounded-lg border border-white/5"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-(--discord-blurple)">
                                        {q.questionType.replace("_", " ")}
                                    </span>
                                    <span className="text-xs opacity-50">
                                        {q.points} pts
                                    </span>
                                </div>
                                <p className="text-white font-medium mb-3">
                                    {idx + 1}. {q.questionText}
                                </p>
                                <div className="pl-4 border-l-2 border-(--discord-blurple)/30 space-y-1">
                                    <p className="text-sm text-green-400 font-semibold">
                                        Correct: {q.correctAnswers.join(", ")}
                                    </p>
                                    {q.hint && (
                                        <p className="text-xs italic opacity-60">
                                            Hint: {q.hint}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Stats & Attempts */}
                    <div className="space-y-6">
                        {/* Stats Card */}
                        <div className="bg-(--discord-blurple) p-6 rounded-xl text-white shadow-lg">
                            <p className="text-sm opacity-80 uppercase font-bold">
                                Avg. Accuracy
                            </p>
                            <h3 className="text-4xl font-black">
                                {averageScore}%
                            </h3>
                            <p className="text-xs mt-2">
                                {quiz?.quizAttempts?.length || 0} attempts total
                            </p>
                        </div>

                        {/* Recent Attempts */}
                        <div>
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                                <History size={20} /> Past Attempts
                            </h2>
                            <div className="space-y-3">
                                {quiz?.quizAttempts?.length > 0 ? (
                                    quiz.quizAttempts.map((attempt: any) => (
                                        <div
                                            key={attempt.attemptId}
                                            className="bg-(--discord-gray-4) p-3 rounded-lg border border-white/5 flex justify-between items-center"
                                        >
                                            <div>
                                                <p className="text-sm font-bold text-white">
                                                    Score:{" "}
                                                    {(
                                                        (attempt.score /
                                                            attempt.maxScore) *
                                                        100
                                                    ).toFixed(0)}
                                                    %
                                                </p>
                                                <p className="text-[10px] opacity-50">
                                                    {formatDate(
                                                        attempt.completedAt,
                                                    )}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs flex items-center gap-1 opacity-80">
                                                    <Clock size={12} />{" "}
                                                    {Math.floor(
                                                        attempt.timeSpentSeconds /
                                                            60,
                                                    )}
                                                    m{" "}
                                                    {attempt.timeSpentSeconds %
                                                        60}
                                                    s
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 italic">
                                        No attempts yet. Take the quiz to see
                                        your progress!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizViewPage;
