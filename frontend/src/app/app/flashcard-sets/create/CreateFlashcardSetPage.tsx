"use client";

import UploadFileSection from "@/app/components/create-flashcard-set-page/UploadFileSection";
import React, { useState } from "react";

const CreateFlashcardSetPage = () => {
    const [numFlashcards, setNumFlashcards] = useState<string>("5");
    const [mode, setMode] = useState<"full" | "prompt">("full");
    const [prompt, setPrompt] = useState("");
    const [additionalInstructions, setAdditionalInstructions] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    const handleNumFlashcardChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNumFlashcards(e.target.value);
    };

    const handleBlur = () => {
        let numValue = parseInt(numFlashcards) || 5;

        // Clamp between 1 and 50
        if (numValue < 5) numValue = 5;
        if (numValue > 50) numValue = 50;

        setNumFlashcards(numValue.toString());
    };

    return (
        <div className="flex flex-col items-center min-h-screen w-full p-5">
            <form
                onSubmit={() => {}}
                className="flex flex-col justify-center items-center w-full h-full max-w-[600px]"
            >
                {/* Title */}
                <h1 className="text-3xl font-bold mb-5">
                    Create Flashcard Set
                </h1>

                {/* Upload file area */}
                <UploadFileSection files={files} onFilesChange={setFiles} />

                {/* Number of flashcards */}
                <div className="space-y-1 w-full my-2">
                    <label className="text-sm font-semibold">
                        Number of Flashcards (5-50)
                    </label>
                    <input
                        type="number"
                        min="5"
                        max="50"
                        value={numFlashcards}
                        onChange={handleNumFlashcardChange}
                        onBlur={handleBlur}
                        className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple)"
                    />
                </div>

                {/* Flashcard generation settings */}
                <div className="flex flex-col space-y-1 my-2">
                    <label className="text-sm font-semibold">
                        Generation Settings
                    </label>
                    <div className="flex flex-row space-x-2">
                        <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg bg-(--discord-gray-2) hover:bg-(--discord-gray-1) transition-colors">
                            <input
                                type="radio"
                                name="mode"
                                value="full"
                                checked={mode === "full"}
                                onChange={(e) =>
                                    setMode(e.target.value as "full")
                                }
                                className="w-4 h-4"
                            />
                            <div>
                                <p className="font-medium">Entire file</p>
                                <p className="text-xs opacity-60">
                                    Generate flashcards from the whole document
                                </p>
                            </div>
                        </label>

                        <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg bg-(--discord-gray-2) hover:bg-(--discord-gray-1) transition-colors">
                            <input
                                type="radio"
                                name="mode"
                                value="prompt"
                                checked={mode === "prompt"}
                                onChange={(e) =>
                                    setMode(e.target.value as "prompt")
                                }
                                className="w-4 h-4"
                            />
                            <div>
                                <p className="font-medium">Custom prompt</p>
                                <p className="text-xs opacity-60">
                                    Generate flashcards based on a specific
                                    topic
                                </p>
                            </div>
                        </label>
                    </div>

                    {mode === "prompt" && (
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., flashcards on photosynthesis"
                            maxLength={100}
                            className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) resize-none"
                            rows={2}
                        />
                    )}
                </div>

                {/* Additional instructions */}
                <div className="w-full flex flex-col space-y-1 my-2">
                    <label className="text-sm font-semibold">
                        Additional instructions (optional)
                    </label>
                    <textarea
                        value={additionalInstructions}
                        onChange={(e) =>
                            setAdditionalInstructions(e.target.value)
                        }
                        placeholder="e.g., make the flashcards short"
                        maxLength={100}
                        className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) resize-none"
                        rows={2}
                    />
                </div>

                {/* Generate button */}
                <button
                    type="submit"
                    className="w-full rounded-lg bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) p-3 text-lg font-bold my-2"
                >
                    Generate flashcards
                </button>
            </form>
        </div>
    );
};

export default CreateFlashcardSetPage;
