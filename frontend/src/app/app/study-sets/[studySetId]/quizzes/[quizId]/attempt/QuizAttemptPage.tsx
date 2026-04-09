"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// Import the API calls
import { submitAttempt } from "@/lib/api/quiz-attempt-api";
import {
    Loader,
    ChevronLeft,
    ChevronRight,
    Clock,
    CheckSquare,
    Square,
    Circle,
    CheckCircle2,
    LightbulbOff,
    Lightbulb,
} from "lucide-react";
import {
    getQuizQuestionsForTakingQuiz,
} from "@/lib/api/quiz-question-api";
import { AnswerSubmission } from "@/lib/dto/quiz-attempt-dto";
import { TakeQuizResponse } from "@/lib/dto/quiz-question-dto";

type Answers = Record<string, string[]>;

const QuizAttemptPage = () => {
    const { studySetId, quizId } = useParams();
    const router = useRouter();

    const [quiz, setQuiz] = useState<TakeQuizResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currIndex, setCurrIndex] = useState(0);
    const [answers, setAnswers] = useState<Answers>({});
    const [showHint, setShowHint] = useState(false);

    // Timer
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const startedAtRef = useRef<Date>(new Date());
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Fetch Quiz Data on Mount
     */
    useEffect(() => {
        const fetchQuiz = async () => {
            if (!quizId) return;
            setIsLoading(true);
            const res = await getQuizQuestionsForTakingQuiz(quizId as string);

            if (res.success && res.data) {
                setQuiz(res.data);
                startedAtRef.current = new Date();
            }
            setIsLoading(false);
        };

        fetchQuiz();
    }, [quizId]);

    useEffect(() => {
        setShowHint(false);
    }, [currIndex]);

    // Start timer
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setElapsedSeconds((prev) => prev + 1);
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const formatElapsed = (seconds: number): string => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0)
            return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    /**
     * Answer logic
     */
    const handleSingleSelect = (questionId: string, option: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: [option] }));
    };

    const handleMultiSelect = (questionId: string, option: string) => {
        setAnswers((prev) => {
            const current = prev[questionId] ?? [];
            const alreadySelected = current.includes(option);
            return {
                ...prev,
                [questionId]: alreadySelected
                    ? current.filter((o) => o !== option)
                    : [...current, option],
            };
        });
    };

    const handleShortAnswer = (questionId: string, value: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: [value] }));
    };

    const isOptionSelected = (questionId: string, option: string): boolean => {
        return answers[questionId]?.includes(option) ?? false;
    };

    const answeredCount = quiz
        ? quiz.questions.filter(
              (q) =>
                  (answers[q.questionId]?.filter((a) => a.trim() !== "")
                      .length ?? 0) > 0,
          ).length
        : 0;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
    };

    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    /**
     * Submit logic
     */
    const handleSubmit = async () => {
        if (!quiz || !quizId) return;
        window.removeEventListener("beforeunload", handleBeforeUnload);

        if (timerRef.current) clearInterval(timerRef.current);
        setIsSubmitting(true);

        const submissionAnswers: AnswerSubmission[] = Object.entries(answers)
            .filter(([, userAnswer]) => userAnswer.some((a) => a.trim() !== ""))
            .map(([questionId, userAnswer]) => ({
                questionId,
                userAnswer,
            }));

        const res = await submitAttempt(quizId as string, {
            timeSpentSeconds: elapsedSeconds,
            answers: submissionAnswers,
        });

        setIsSubmitting(false);

        if (res.success) {
            router.push(`/app/study-sets/${studySetId}/quizzes/${quizId}`);
        } else {
            alert(res.error || "Failed to submit quiz. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-20">
                <Loader className="w-10 h-10 animate-spin text-gray-400" />
                <p className="mt-4 text-gray-400">Loading quiz...</p>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-20">
                <p className="text-gray-400 text-lg">Quiz not found</p>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currIndex];
    const isLastQuestion = currIndex === quiz.questions.length - 1;
    const isFirstQuestion = currIndex === 0;

    return (
        <div className="flex flex-col items-center min-h-screen w-full">
            <div className="flex flex-col w-full h-full max-w-150 min-h-screen p-7">
                {/* Top bar */}
                <div className="flex flex-row items-center w-full mb-6">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold">{quiz.name}</h1>
                        <p className="text-sm opacity-60 mt-0.5">
                            {answeredCount} / {quiz.questions.length} answered
                        </p>
                    </div>
                    <div className="ml-auto flex flex-row items-center space-x-2 bg-(--discord-gray-4) px-4 py-2 rounded-xl">
                        <Clock className="w-4 h-4 text-(--discord-blurple)" />
                        <span className="font-mono font-medium text-lg">
                            {formatElapsed(elapsedSeconds)}
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-(--discord-gray-4) rounded-full mb-6 overflow-hidden">
                    <div
                        className="h-full bg-(--discord-blurple) rounded-full transition-all duration-300"
                        style={{
                            width: `${((currIndex + 1) / quiz.questions.length) * 100}%`,
                        }}
                    />
                </div>

                {/* Question card */}
                <div className="flex flex-col items-center justify-center flex-1 w-full py-6">
                    <div className="flex flex-col w-full bg-(--discord-gray-4) rounded-2xl p-6 shadow-xl">
                        {/* Question header */}
                        <div className="flex flex-row items-start justify-between mb-6">
                            <div className="flex flex-row items-center space-x-2">
                                <span className="text-sm font-bold opacity-40">
                                    {currIndex + 1} / {quiz.questions.length}
                                </span>
                            </div>
                            <div className="flex flex-row items-center space-x-2">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-(--discord-blurple)/20 text-(--discord-blurple)">
                                    {currentQuestion.points}{" "}
                                    {currentQuestion.points === 1
                                        ? "point"
                                        : "points"}
                                </span>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                        currentQuestion.questionType ===
                                        "MULTIPLE_CHOICE"
                                            ? "bg-blue-500/20 text-blue-400"
                                            : currentQuestion.questionType ===
                                                "MULTIPLE_ANSWER"
                                              ? "bg-purple-500/20 text-purple-400"
                                              : currentQuestion.questionType ===
                                                  "SHORT_ANSWER"
                                                ? "bg-orange-500/20 text-orange-400"
                                                : "bg-green-500/20 text-green-400"
                                    }`}
                                >
                                    {currentQuestion.questionType.replace(
                                        "_",
                                        " ",
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Question text */}
                        <p className="text-xl font-semibold mb-8 leading-relaxed">
                            {currentQuestion.questionText}
                        </p>

                        {/* Hint logic */}
                        {currentQuestion.hint && (
                            <div className="mb-4">
                                <button
                                    onClick={() => setShowHint(!showHint)}
                                    className="flex items-center gap-2 text-sm text-(--discord-blurple) hover:underline"
                                >
                                    {showHint ? (
                                        <LightbulbOff className="w-4 h-4" />
                                    ) : (
                                        <Lightbulb className="w-4 h-4" />
                                    )}
                                    {showHint ? "Hide Hint" : "Show Hint"}
                                </button>
                                {showHint && (
                                    <p className="mt-2 text-sm italic opacity-70 p-3 bg-(--discord-gray-3) rounded-lg border-l-4 border-(--discord-blurple)">
                                        {currentQuestion.hint}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Answer area */}
                        <div className="flex flex-col space-y-3">
                            {/* Multiple choice / True False */}
                            {(currentQuestion.questionType ===
                                "MULTIPLE_CHOICE" ||
                                currentQuestion.questionType ===
                                    "TRUE_FALSE") &&
                                currentQuestion.options.map((option, i) => {
                                    const selected = isOptionSelected(
                                        currentQuestion.questionId,
                                        option,
                                    );
                                    return (
                                        <button
                                            key={i}
                                            onClick={() =>
                                                handleSingleSelect(
                                                    currentQuestion.questionId,
                                                    option,
                                                )
                                            }
                                            className={`flex flex-row items-center space-x-3 w-full px-4 py-3 rounded-xl border-2 transition-all text-left ${
                                                selected
                                                    ? "border-(--discord-blurple) bg-(--discord-blurple)/10"
                                                    : "border-(--discord-gray-3) bg-(--discord-gray-3) hover:border-(--discord-blurple)/50"
                                            }`}
                                        >
                                            {selected ? (
                                                <CheckCircle2 className="w-5 h-5 text-(--discord-blurple) shrink-0" />
                                            ) : (
                                                <Circle className="w-5 h-5 opacity-40 shrink-0" />
                                            )}
                                            <span
                                                className={
                                                    selected
                                                        ? "font-medium"
                                                        : "opacity-80"
                                                }
                                            >
                                                {option}
                                            </span>
                                        </button>
                                    );
                                })}

                            {/* Multiple answer */}
                            {currentQuestion.questionType ===
                                "MULTIPLE_ANSWER" &&
                                currentQuestion.options.map((option, i) => {
                                    const selected = isOptionSelected(
                                        currentQuestion.questionId,
                                        option,
                                    );
                                    return (
                                        <button
                                            key={i}
                                            onClick={() =>
                                                handleMultiSelect(
                                                    currentQuestion.questionId,
                                                    option,
                                                )
                                            }
                                            className={`flex flex-row items-center space-x-3 w-full px-4 py-3 rounded-xl border-2 transition-all text-left ${
                                                selected
                                                    ? "border-(--discord-blurple) bg-(--discord-blurple)/10"
                                                    : "border-(--discord-gray-3) bg-(--discord-gray-3) hover:border-(--discord-blurple)/50"
                                            }`}
                                        >
                                            {selected ? (
                                                <CheckSquare className="w-5 h-5 text-(--discord-blurple) shrink-0" />
                                            ) : (
                                                <Square className="w-5 h-5 opacity-40 shrink-0" />
                                            )}
                                            <span
                                                className={
                                                    selected
                                                        ? "font-medium"
                                                        : "opacity-80"
                                                }
                                            >
                                                {option}
                                            </span>
                                        </button>
                                    );
                                })}

                            {/* Short answer */}
                            {currentQuestion.questionType ===
                                "SHORT_ANSWER" && (
                                <textarea
                                    value={
                                        answers[
                                            currentQuestion.questionId
                                        ]?.[0] ?? ""
                                    }
                                    onChange={(e) =>
                                        handleShortAnswer(
                                            currentQuestion.questionId,
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Type your answer here..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-(--discord-gray-3) border-2 border-(--discord-gray-3) focus:border-(--discord-blurple) rounded-xl focus:outline-none resize-none transition-colors"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Question dot indicators */}
                <div className="flex flex-row flex-wrap justify-center gap-2 mt-5">
                    {quiz.questions.map((q, i) => {
                        const answered =
                            (answers[q.questionId]?.filter(
                                (a) => a.trim() !== "",
                            ).length ?? 0) > 0;
                        return (
                            <button
                                key={i}
                                onClick={() => setCurrIndex(i)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                    i === currIndex
                                        ? "bg-(--discord-blurple) text-white"
                                        : answered
                                          ? "bg-(--discord-blurple)/30 text-(--discord-blurple)"
                                          : "bg-(--discord-gray-4) opacity-60 hover:opacity-100"
                                }`}
                            >
                                {i + 1}
                            </button>
                        );
                    })}
                </div>

                {/* Navigation buttons */}
                <div className="flex flex-row items-center w-full mt-5 space-x-3">
                    <button
                        onClick={() =>
                            setCurrIndex((prev) => Math.max(prev - 1, 0))
                        }
                        disabled={isFirstQuestion}
                        className="flex flex-row items-center space-x-2 px-5 py-3 bg-(--discord-gray-4) hover:bg-(--discord-gray-3) rounded-xl font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>

                    <div className="flex-1" />

                    {isLastQuestion ? (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex flex-row items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            <span>
                                {isSubmitting ? "Submitting..." : "Submit Quiz"}
                            </span>
                        </button>
                    ) : (
                        <button
                            onClick={() =>
                                setCurrIndex((prev) =>
                                    Math.min(
                                        prev + 1,
                                        quiz.questions.length - 1,
                                    ),
                                )
                            }
                            className="flex flex-row items-center space-x-2 px-5 py-3 bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) rounded-xl font-medium transition-colors"
                        >
                            <span>Next</span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizAttemptPage;
