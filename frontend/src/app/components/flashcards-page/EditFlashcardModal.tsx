import React, { useEffect, useState } from "react";
import { Flashcard } from "@/lib/api/flashcard-api";

interface EditFlashcardModalProps {
    isOpen: boolean;
    flashcard: Flashcard | null;
    onConfirm: (
        flashcardId: string,
        question: string,
        answer: string,
        hint: string,
        instructions: string,
        mode: "manual" | "AI",
    ) => void;
    onCancel: () => void;
    isLoading: boolean;
}

const EditFlashcardModal: React.FC<EditFlashcardModalProps> = ({
    isOpen,
    flashcard,
    onConfirm,
    onCancel,
    isLoading,
}) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [hint, setHint] = useState("");

    const [instructions, setInstructions] = useState("");

    const [mode, setMode] = useState<"manual" | "AI">("manual");

    useEffect(() => {
        if (flashcard) {
            setQuestion(flashcard.question);
            setAnswer(flashcard.answer);
            setHint(flashcard.hint);
        }
    }, [flashcard]);

    if (!isOpen) {
        return null;
    }

    const handleConfirm = () => {
        if (flashcard) {
            onConfirm(
                flashcard.flashcardId,
                question,
                answer,
                hint,
                instructions,
                mode,
            );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-5 overflow-auto">
            <div className="bg-(--discord-gray-2) p-6 rounded-lg shadow-xl max-w-150 w-full">
                <h2 className="text-white text-lg mb-4">Edit Flashcard</h2>

                {/* Choose mode between manual and AI */}
                <div className="flex flex-row space-x-2">
                    <label className="w-1/2 flex items-center space-x-3 cursor-pointer p-3 rounded-lg bg-(--discord-gray-3) hover:bg-(--discord-gray-1) transition-colors">
                        <input
                            type="radio"
                            name="mode"
                            value="manual"
                            checked={mode === "manual"}
                            onChange={(e) =>
                                setMode(e.target.value as "manual")
                            }
                            className="w-4 h-4"
                        />
                        <div>
                            <p className="font-medium">Manual</p>
                            <p className="text-xs opacity-60">
                                Edit flashcard manually
                            </p>
                        </div>
                    </label>

                    <label className="w-1/2 flex items-center space-x-3 cursor-pointer p-3 rounded-lg bg-(--discord-gray-3) hover:bg-(--discord-gray-1) transition-colors">
                        <input
                            type="radio"
                            name="mode"
                            value="AI"
                            checked={mode === "AI"}
                            onChange={(e) => setMode(e.target.value as "AI")}
                            className="w-4 h-4"
                        />
                        <div>
                            <p className="font-medium">AI-Assisted</p>
                            <p className="text-xs opacity-60">
                                Edit flashcard with AI
                            </p>
                        </div>
                    </label>
                </div>

                {/* Fill up fields for manual */}
                {mode === "manual" && (
                    <div className="flex flex-col">
                        {/* Question */}
                        <div className="w-full flex flex-col space-y-1 my-2">
                            <label className="text-sm font-semibold">
                                Question
                            </label>
                            <div className="w-full flex flex-col">
                                <textarea
                                    value={question}
                                    onChange={(e) =>
                                        setQuestion(e.target.value)
                                    }
                                    placeholder="new question..."
                                    className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) resize-none"
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Answer */}
                        <div className="w-full flex flex-col space-y-1 my-2">
                            <label className="text-sm font-semibold">
                                Answer
                            </label>
                            <div className="w-full flex flex-col">
                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="new answer..."
                                    className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) resize-none"
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Hint */}
                        <div className="w-full flex flex-col space-y-1 my-2">
                            <label className="text-sm font-semibold">
                                Hint
                            </label>
                            <div className="w-full flex flex-col">
                                <textarea
                                    value={hint}
                                    onChange={(e) => setHint(e.target.value)}
                                    placeholder="new hint..."
                                    className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) resize-none"
                                    rows={1}
                                    maxLength={25}
                                />
                            </div>
                            <label className="text-xs opacity-60 ml-1 mt-1">
                                {hint.length}/25 characters
                            </label>
                        </div>
                    </div>
                )}

                {/* Fill up fields for AI */}
                {mode === "AI" && (
                    <div className="flex flex-col">
                        {/* Instructions */}
                        <div className="w-full flex flex-col space-y-1 my-2">
                            <label className="text-sm font-semibold">
                                Instructions
                            </label>
                            <div className="w-full flex flex-col">
                                <textarea
                                    value={instructions}
                                    onChange={(e) =>
                                        setInstructions(e.target.value)
                                    }
                                    placeholder="e.g. short flashcard on photosynthesis"
                                    className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) resize-none"
                                    rows={2}
                                    maxLength={100}
                                />
                            </div>
                            <label className="text-xs opacity-60 ml-1 mt-1">
                                {instructions.length}/100 characters
                            </label>
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 bg-(--discord-gray-1) text-white rounded hover:bg-(--discord-gray-3) disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                        {isLoading ? "Saving..." : "OK"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditFlashcardModal;
