"use client";

import React, { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";

interface CreateStudySetModalProps {
    isOpen: boolean;
    onConfirm: (title: string, icon: string, description: string) => void;
    onCancel: () => void;
    isLoading: boolean;
}

const CreateStudySetModal: React.FC<CreateStudySetModalProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    isLoading,
}) => {
    const [title, setTitle] = useState("");
    const [icon, setIcon] = useState("📚");
    const [description, setDescription] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setTitle("");
            setIcon("📚");
            setDescription("");
            setShowEmojiPicker(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!title.trim()) {
            alert("Please enter a title for your study set.");
            return;
        }
        onConfirm(title, icon, description);
    };

    const handleEmojiClick = (emojiObject: any) => {
        setIcon(emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-5 overflow-auto">
            <div className="bg-(--discord-gray-2) p-6 rounded-lg shadow-xl max-w-md w-full">
                <h2 className="text-white text-xl font-bold mb-4">
                    Create Study Set
                </h2>

                {/* Title and icon */}
                <div className="space-y-1 w-full my-4 flex">
                    <div className="flex flex-row w-full space-x-2">
                        <div className="flex flex-col w-12">
                            <label className="text-sm font-semibold mb-1">
                                Icon
                            </label>
                            <div className="relative bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg flex items-center justify-center h-10">
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
                                    Title
                                </label>
                                <label className="text-xs opacity-60 ml-auto">
                                    {title.length}/30
                                </label>
                            </div>
                            <input
                                value={title}
                                maxLength={30}
                                placeholder="e.g., Computer Science Year 1"
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col w-full my-4">
                    <div className="flex flex-row items-baseline">
                        <label className="text-sm font-semibold mb-1">
                            Description
                        </label>
                        <label className="text-xs opacity-60 ml-auto">
                            {description.length}/100
                        </label>
                    </div>
                    <textarea
                        value={description}
                        maxLength={100}
                        rows={3}
                        placeholder="What is this study set about?"
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) text-white resize-none"
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-5 py-2 text-sm font-medium text-white rounded-md hover:underline disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading || !title.trim()}
                        className="px-6 py-2 bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Creating..." : "Create Set"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateStudySetModal;
