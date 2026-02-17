"use client";

import React, { useEffect, useState } from "react";
import { createQuiz } from "@/lib/api/quiz-api";
import { useRouter } from "next/navigation";

interface CreateQuizModalProps {
    isOpen: boolean;
    studySetId: string;
    onCancel: () => void;
}

const CreateQuizModal: React.FC<CreateQuizModalProps> = ({
    isOpen,
    studySetId,
    onCancel,
}) => {
    const router = useRouter();

    const [name, setName] = useState<string>("");
    const [timeLimit, setTimeLimit] = useState<string>("15");
    const [prompt, setPrompt] = useState("");
    const [additionalInstructions, setAdditionalInstructions] = useState("");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingStep, setLoadingStep] = useState<string>("");

    // Reset form on close
    useEffect(() => {
        if (!isOpen) {
            setName("");
            setTimeLimit("15");
            setPrompt("");
            setAdditionalInstructions("");
            setLoadingStep("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleTimeBlur = () => {
        let val = parseInt(timeLimit) || 5;
        if (val < 1) val = 1;
        if (val > 120) val = 120; // Cap at 2 hours
        setTimeLimit(val.toString());
    };

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !prompt.trim()) return;

        setIsLoading(true);
        setLoadingStep("Generating quiz...");

        const createPayload = {
            name,
            timeLimitMinutes: parseInt(timeLimit),
            prompt,
            ...(additionalInstructions.trim() && { additionalInstructions }),
        };

        const result = await createQuiz(studySetId, createPayload);

        if (result.data) {
            const { quizId } = result.data;
            // Assuming your quiz route follows this pattern
            router.push(`/app/study-sets/${studySetId}/quizzes/${quizId}`);
        } else {
            alert(result.error || "Failed to generate quiz");
            setIsLoading(false);
            setLoadingStep("");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-5 overflow-auto">
            <div className="bg-(--discord-gray-2) p-6 rounded-lg shadow-xl max-w-md w-full">
                <h2 className="text-white text-xl font-bold mb-4">
                    Create AI Quiz
                </h2>

                <form onSubmit={handleConfirm} className="space-y-4">
                    {/* Quiz Name */}
                    <div className="flex flex-col w-full">
                        <div className="flex flex-row items-baseline">
                            <label className="text-sm font-semibold mb-1">
                                Quiz Name
                            </label>
                            <label className="text-xs opacity-60 ml-auto">
                                {name.length}/30
                            </label>
                        </div>
                        <input
                            value={name}
                            maxLength={30}
                            required
                            disabled={isLoading}
                            placeholder="e.g., Biology Chapter 5 Final"
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) text-white"
                        />
                    </div>

                    {/* AI Prompt */}
                    <div className="flex flex-col w-full">
                        <div className="flex flex-row items-baseline">
                            <label className="text-sm font-semibold mb-1">
                                What should this quiz cover?
                            </label>
                            <label className="text-xs opacity-60 ml-auto">
                                {prompt.length}/100
                            </label>
                        </div>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            required
                            disabled={isLoading}
                            placeholder="e.g., Focus on cellular respiration, ATP production, and the Krebs cycle."
                            maxLength={100}
                            className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) text-white resize-none"
                            rows={3}
                        />
                    </div>

                    {/* Time Limit */}
                    <div className="flex flex-col w-full">
                        <label className="text-sm font-semibold mb-1">
                            Time Limit (1-120 minutes)
                        </label>
                        <input
                            type="number"
                            value={timeLimit}
                            disabled={isLoading}
                            onChange={(e) => setTimeLimit(e.target.value)}
                            onBlur={handleTimeBlur}
                            className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) text-white"
                        />
                    </div>

                    {/* Additional Instructions */}
                    <div className="flex flex-col w-full">
                        <div className="flex flex-row items-baseline">
                            <label className="text-sm font-semibold mb-1">
                                Additional instructions (optional)
                            </label>
                            <label className="text-xs opacity-60 ml-auto">
                                {additionalInstructions.length}/100
                            </label>
                        </div>
                        <textarea
                            value={additionalInstructions}
                            onChange={(e) =>
                                setAdditionalInstructions(e.target.value)
                            }
                            disabled={isLoading}
                            placeholder="e.g., Include multiple choice and true/false only."
                            maxLength={100}
                            className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) text-white resize-none"
                            rows={3}
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="px-5 py-2 text-sm font-medium text-white rounded-md hover:underline disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={
                                isLoading || !prompt.trim() || !name.trim()
                            }
                            className="px-6 py-2 bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? loadingStep : "Generate Quiz"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateQuizModal;
