"use client";

import React, { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { createFlashcardSet } from "@/lib/api/flashcard-set-api";
import { useRouter } from "next/navigation";

interface CreateFlashcardSetModalProps {
    isOpen: boolean;
    studySetId: string;
    onCancel: () => void;
}

const CreateFlashcardSetModal: React.FC<CreateFlashcardSetModalProps> = ({
    isOpen,
    studySetId,
    onCancel,
}) => {
    const router = useRouter();

    const [name, setName] = useState<string>("");
    const [icon, setIcon] = useState<string>("📚");
    const [numFlashcards, setNumFlashcards] = useState<string>("10");
    const [prompt, setPrompt] = useState("");
    const [additionalInstructions, setAdditionalInstructions] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingStep, setLoadingStep] = useState<string>("");

    useEffect(() => {
        if (!isOpen) {
            setName("");
            setIcon("📚");
            setNumFlashcards("10");
            setPrompt("");
            setAdditionalInstructions("");
            setShowEmojiPicker(false);
            setLoadingStep("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBlur = () => {
        let numValue = parseInt(numFlashcards) || 5;
        if (numValue < 5) numValue = 5;
        if (numValue > 50) numValue = 50;
        setNumFlashcards(numValue.toString());
    };

    const handleEmojiClick = (emojiObject: any) => {
        setIcon(emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !prompt.trim()) return;

        setIsLoading(true);
        setLoadingStep("Generating flashcards...");

        const createPayload = {
            name,
            icon,
            numFlashcards: parseInt(numFlashcards),
            prompt,
            ...(additionalInstructions.trim() && { additionalInstructions }),
        };

        const result = await createFlashcardSet(studySetId, createPayload);

        if (result.data) {
            const { flashcardSetId } = result.data;
            router.push(
                `/app/study-sets/${studySetId}/flashcard-sets/${flashcardSetId}`,
            );
        } else {
            alert(result.error || "Failed to generate flashcards");
            setIsLoading(false);
            setLoadingStep("");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-5 overflow-auto">
            <div className="bg-(--discord-gray-2) p-6 rounded-lg shadow-xl max-w-md w-full">
                <h2 className="text-white text-xl font-bold mb-4">
                    Create Flashcard Set
                </h2>

                <form onSubmit={handleConfirm} className="space-y-4">
                    {/* Name and Icon Row */}
                    <div className="flex flex-row w-full space-x-2">
                        <div className="flex flex-col w-12">
                            <label className="text-sm font-semibold mb-1">
                                Icon
                            </label>
                            <div className="relative bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg flex items-center justify-center h-10">
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() =>
                                        setShowEmojiPicker(!showEmojiPicker)
                                    }
                                    className="text-2xl hover:opacity-80 transition-opacity w-full h-full flex items-center justify-center"
                                >
                                    {icon}
                                </button>
                                {showEmojiPicker && (
                                    <div className="absolute top-12 left-0 z-50">
                                        <EmojiPicker
                                            width={320}
                                            height={400}
                                            onEmojiClick={handleEmojiClick}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col w-full">
                            <div className="flex flex-row items-baseline">
                                <label className="text-sm font-semibold mb-1">
                                    Set Name
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
                                placeholder="e.g., Photosynthesis Quiz"
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) text-white"
                            />
                        </div>
                    </div>

                    {/* AI Prompt */}
                    <div className="flex flex-col w-full">
                        <div className="flex flex-row items-baseline">
                            <label className="text-sm font-semibold mb-1">
                                What should these flashcards be about?
                            </label>
                            <label className="text-xs opacity-60 ml-auto">
                                {prompt.length}/300
                            </label>
                        </div>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            required
                            disabled={isLoading}
                            placeholder="e.g., Key concepts of photosynthesis and the Calvin cycle."
                            maxLength={300}
                            className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) text-white resize-none"
                            rows={3}
                        />
                    </div>

                    {/* Count - Now Full Width Line */}
                    <div className="flex flex-col w-full">
                        <label className="text-sm font-semibold mb-1">
                            Number of Flashcards (5-50)
                        </label>
                        <input
                            type="number"
                            value={numFlashcards}
                            disabled={isLoading}
                            onChange={(e) => setNumFlashcards(e.target.value)}
                            onBlur={handleBlur}
                            className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) text-white"
                        />
                    </div>

                    {/* Additional Instructions - Now Full Line and Matching Prompt Height */}
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
                            placeholder="e.g., keep the definitions concise"
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
                            {isLoading ? loadingStep : "Generate Flashcards"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFlashcardSetModal;
