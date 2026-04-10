import React, { useState } from "react";
import {
    ArrowUpRight,
    Calendar,
    ChevronDown,
    ChevronUp,
    Clock,
    Trophy,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatDate } from "@/lib/util";
import { QuizAttemptResponse } from "@/lib/dto/quiz-attempt-dto";

interface AttemptListProps {
    attempts: QuizAttemptResponse[];
}

const AllAttemptsPanel: React.FC<AttemptListProps> = ({ attempts }) => {
    /**
     * Vairables
     */

    const { studySetId, quizId } = useParams();
    const [showAllAttempts, setShowAllAttempts] = useState<boolean>(false);

    /**
     * Functions
     */

    const calculateDuration = (start: string, end: string) => {
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();
        const diffInSeconds = Math.floor((endTime - startTime) / 1000);

        const m = Math.floor(diffInSeconds / 60);
        const s = diffInSeconds % 60;
        return `${m}m ${s}s`;
    };

    return (
        <div className="bg-(--discord-gray-3) w-full rounded-xl shadow-lg p-5 mt-5 outline outline-(--discord-blurple) flex flex-col">
            {/* Header */}
            <div className="flex flex-row">
                <label className="font-bold text-lg mr-auto">
                    All attempts ({attempts.length})
                </label>
                <button onClick={() => setShowAllAttempts(!showAllAttempts)}>
                    {showAllAttempts ? (
                        <ChevronUp className="h-7 w-7 hover:text-(--discord-blurple)" />
                    ) : (
                        <ChevronDown className="h-7 w-7 hover:text-(--discord-blurple)" />
                    )}
                </button>
            </div>

            {/* Divider */}
            <div
                hidden={!showAllAttempts}
                className="w-full h-0.5 bg-(--discord-gray-2) my-5"
            />

            {/* Body */}
            <div hidden={!showAllAttempts} className="space-y-5">
                {attempts.map((attempt, i) => {
                    const percentage = Math.round(
                        (attempt.score / attempt.maxScore) * 100,
                    );
                    const duration = calculateDuration(
                        attempt.startedAt,
                        attempt.completedAt,
                    );

                    return (
                        <div
                            key={attempt.attemptId}
                            className="bg-(--discord-gray-4) rounded-xl flex flex-col p-4 border border-(--discord-gray-1) hover:border-(--discord-blurple)/30 transition-colors"
                        >
                            {/* Header Section */}
                            <div className="flex flex-row items-center mb-3 border-b border-(--discord-gray-1) pb-3">
                                <div className="flex flex-col">
                                    <label className="font-bold text-md">
                                        Attempt #{attempts.length - i}
                                    </label>
                                    <div className="flex flex-row items-center opacity-60 text-xs mt-1">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {formatDate(attempt.completedAt)}
                                    </div>
                                </div>

                                <div className="ml-auto flex flex-row items-center space-x-3">
                                    <div className="flex flex-col items-end">
                                        <span
                                            className={`text-sm font-bold ${percentage >= 70 ? "text-green-400" : "text-orange-400"}`}
                                        >
                                            {attempt.score} / {attempt.maxScore}
                                        </span>
                                        <span className="text-[10px] opacity-50 uppercase font-bold tracking-wider">
                                            Score
                                        </span>
                                    </div>
                                    <div
                                        className={`p-2 rounded-lg bg-black/20 ${percentage >= 70 ? "text-green-400" : "text-orange-400"}`}
                                    >
                                        <Trophy className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center space-x-3 px-3 py-2 bg-(--discord-gray-3) rounded-lg border border-(--discord-gray-1)">
                                    <Clock className="w-4 h-4 text-(--discord-blurple)" />
                                    <div className="flex flex-col">
                                        <span className="text-xs opacity-50">
                                            Time Spent
                                        </span>
                                        <span className="text-sm font-medium">
                                            {duration}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 px-3 py-2 bg-(--discord-gray-3) rounded-lg border border-(--discord-gray-1)">
                                    <div className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center text-[10px] text-green-500 font-bold">
                                        %
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs opacity-50">
                                            Accuracy
                                        </span>
                                        <span className="text-sm font-medium">
                                            {percentage}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* View Details Button */}
                            <Link
                                href={`/app/study-sets/${studySetId}/quizzes/${quizId}/attempt/${attempt.attemptId}`}
                                className="flex flex-row items-center justify-center space-x-2 w-full py-2 bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) text-white rounded-lg text-sm font-medium transition-all group"
                            >
                                <span>View Detailed Results</span>
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AllAttemptsPanel;
