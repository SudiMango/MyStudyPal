import React, { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { Flashcard } from "@/lib/api/flashcard-api";

interface EditFlashcardModalProps {
    isOpen: boolean;
    flashcard: Flashcard | null;
    onConfirm: (
        flashcardId: string,
        question: string,
        answer: string,
        hint: string
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
            onConfirm(flashcard.flashcardId, question, answer, hint);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-5 overflow-auto">
            <div className="bg-(--discord-gray-2) p-6 rounded-lg shadow-xl max-w-[600px] w-full">
                <h2 className="text-white text-lg mb-4">Edit Flashcard</h2>

                {/* Fill up fields */}
                <div className="flex flex-col">
                    {/* Question */}
                    <div className="w-full flex flex-col space-y-1 my-2">
                        <label className="text-sm font-semibold">
                            Question
                        </label>
                        <div className="w-full flex flex-col">
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="new question..."
                                className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) resize-none"
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Answer */}
                    <div className="w-full flex flex-col space-y-1 my-2">
                        <label className="text-sm font-semibold">Answer</label>
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
                        <label className="text-sm font-semibold">Hint</label>
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
