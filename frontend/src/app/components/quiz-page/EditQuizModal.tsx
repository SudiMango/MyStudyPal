import React, { useEffect, useState } from "react";
import { Quiz } from "@/lib/api/quiz-api";

interface EditQuizModalProps {
    isOpen: boolean;
    quiz: Quiz | null;
    onConfirm: (quizId: string, name: string) => void;
    onCancel: () => void;
    isLoading: boolean;
}

const EditQuizModal: React.FC<EditQuizModalProps> = ({
    isOpen,
    quiz,
    onConfirm,
    onCancel,
    isLoading,
}) => {
    const [name, setName] = useState("");

    useEffect(() => {
        if (quiz) {
            setName(quiz.name);
        }
    }, [quiz]);

    if (!isOpen) {
        return null;
    }

    const handleConfirm = () => {
        if (quiz) {
            onConfirm(quiz.quizId, name);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-5 overflow-auto">
            <div className="bg-(--discord-gray-2) p-6 rounded-lg shadow-xl max-w-sm w-full">
                <h2 className="text-white text-lg mb-4">Edit Quiz</h2>

                {/* Name */}
                <div className="space-y-1 w-full my-2">
                    <div className="flex flex-row items-baseline">
                        <label className="text-sm font-semibold">Name</label>
                        <label className="text-xs opacity-60 ml-auto">
                            {name.length}/30 characters
                        </label>
                    </div>
                    <input
                        value={name}
                        maxLength={30}
                        placeholder="e.g., Chapter 5 Quiz"
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple)"
                    />
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
                        disabled={isLoading || !name.trim()}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                        {isLoading ? "Saving..." : "OK"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditQuizModal;
