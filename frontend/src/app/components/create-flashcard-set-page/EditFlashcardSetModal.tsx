import React, { useEffect, useState } from "react";
import { FlashcardSet } from "@/lib/api/flashcard-set-api";
import EmojiPicker from "emoji-picker-react";

interface EditFlashcardSetModalProps {
    isOpen: boolean;
    flashcardSet: FlashcardSet | null;
    onConfirm: (flashcardSetId: string, name: string, icon: string) => void;
    onCancel: () => void;
    isLoading: boolean;
}

const EditFlashcardSetModal: React.FC<EditFlashcardSetModalProps> = ({
    isOpen,
    flashcardSet,
    onConfirm,
    onCancel,
    isLoading,
}) => {
    const [name, setName] = useState("");
    const [icon, setIcon] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        if (flashcardSet) {
            setName(flashcardSet.name);
            setIcon(flashcardSet.icon);
        }
    }, [flashcardSet]);

    if (!isOpen) {
        return null;
    }

    const handleConfirm = () => {
        if (flashcardSet) {
            onConfirm(flashcardSet.flashcardSetId, name, icon);
        }
    };

    const handleEmojiClick = (emojiObject: any) => {
        setIcon(emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-5 overflow-auto">
            <div className="bg-(--discord-gray-2) p-6 rounded-lg shadow-xl max-w-sm w-full">
                <h2 className="text-white text-lg mb-4">Edit Flashcard Set</h2>
                {/* Name and icon */}
                <div className="space-y-1 w-full my-2 flex">
                    <div className="flex flex-row w-full space-x-2">
                        <div className="flex flex-col w-12">
                            <label className="text-sm font-semibold">
                                Icon
                            </label>
                            <div className="relative bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg flex items-center justify-center h-full">
                                <button
                                    type="button"
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
                                            width={350}
                                            height={400}
                                            onEmojiClick={handleEmojiClick}
                                            className="mr-5 mb-5"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col w-full">
                            <div className="flex flex-row items-baseline">
                                <label className="text-sm font-semibold">
                                    Name
                                </label>
                                <label className="text-xs opacity-60 ml-auto">
                                    {name.length}/30 characters
                                </label>
                            </div>
                            <input
                                value={name}
                                maxLength={30}
                                placeholder="e.g., Bio 101 Midterm"
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple)"
                            />
                        </div>
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

export default EditFlashcardSetModal;
