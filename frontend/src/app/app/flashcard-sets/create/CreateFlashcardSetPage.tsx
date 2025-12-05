"use client";

import UploadFileSection from "@/app/components/create-flashcard-set-page/UploadFileSection";
import { uploadDocument } from "@/lib/api/document-api";
import { generateFlashcardSet } from "@/lib/api/flashcard-api";
import EmojiPicker from "emoji-picker-react";
import { redirect } from "next/navigation";
import React, { useState } from "react";

const CreateFlashcardSetPage = () => {
    const [name, setName] = useState<string>("");
    const [icon, setIcon] = useState<string>("📚");
    const [numFlashcards, setNumFlashcards] = useState<string>("5");
    const [mode, setMode] = useState<"full" | "prompt">("full");
    const [prompt, setPrompt] = useState("");
    const [additionalInstructions, setAdditionalInstructions] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [currStep, setCurrStep] = useState<string>("");

    /**
     * numFlashcard functions
     */

    const handleNumFlashcardChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNumFlashcards(e.target.value);
    };

    const handleBlur = () => {
        let numValue = parseInt(numFlashcards) || 5;

        if (numValue < 5) numValue = 5;
        if (numValue > 50) numValue = 50;

        setNumFlashcards(numValue.toString());
    };

    /**
     * icon functions
     */

    const handleEmojiClick = (emojiObject: any) => {
        setIcon(emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    /**
     * file functions
     */

    const handleFilesChange = (newFiles: File[]) => {
        const pdfFiles = newFiles.filter(
            (file) => file.type === "application/pdf"
        );

        if (newFiles.length !== pdfFiles.length) {
            alert("Only PDF files are allowed.");
        }

        setFiles(pdfFiles);
    };

    // Create flashcard set
    const createFlashcardSet = async (e: React.FormEvent) => {
        e.preventDefault();

        /**
         * Pre submission checks
         */

        if (files.length === 0) {
            alert("Please upload a file.");
            return;
        }

        if (!name.trim()) {
            alert("Please enter a flashcard set name.");
            return;
        }

        if (!numFlashcards.trim()) {
            alert("Please enter a valid number of flashcards to generate.");
            return;
        }

        if (mode === "prompt" && !prompt.trim()) {
            alert("Please enter a valid custom prompt.");
            return;
        }

        /**
         * Upload file
         */

        setLoading(true);
        setCurrStep("Uploading files...");
        const uploadResult = await uploadDocument(files[0]);

        if (!uploadResult.success || !uploadResult.data) {
            alert(uploadResult.error);
            setLoading(false);
            setCurrStep("");
            return;
        }

        /**
         * Generate flashcard set
         */

        const { documentId } = uploadResult.data;
        setCurrStep("Generating flashcards...");
        const createPayload = {
            documentId,
            name,
            icon: icon,
            numFlashcards: parseInt(numFlashcards),
            ...(mode === "prompt" && { prompt }),
            ...(additionalInstructions.trim() && {
                additionalInstructions,
            }),
            useFullDocument: mode === "full" ? true : false,
        };

        const createResult = await generateFlashcardSet(createPayload);
        if (!createResult.success || !createResult.data) {
            alert(createResult.error);
            setLoading(false);
            setCurrStep("");
            return;
        }

        /**
         * Redirect to flashcard set page
         */

        const { flashcardSetId } = createResult.data;
        redirect(`/app/flashcard-sets/${flashcardSetId}`);
    };

    return (
        <div className="flex flex-col items-center min-h-screen w-full p-5">
            <form
                onSubmit={createFlashcardSet}
                className="flex flex-col justify-center items-center w-full h-full max-w-[600px]"
            >
                {/* Title */}
                <h1 className="text-3xl font-bold mb-5">
                    Create Flashcard Set
                </h1>

                {/* Upload file area */}
                <UploadFileSection
                    files={files}
                    onFilesChange={handleFilesChange}
                />

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
                                            onEmojiClick={handleEmojiClick}
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
                                    {30 - name.length} characters
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
                        <div className="w-full flex flex-col">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., flashcards on photosynthesis"
                                maxLength={100}
                                className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) resize-none"
                                rows={2}
                            />
                            <label className="text-xs opacity-60 ml-1 mt-1">
                                {100 - additionalInstructions.length} characters
                            </label>
                        </div>
                    )}
                </div>

                {/* Additional instructions */}
                <div className="w-full flex flex-col space-y-1 my-2">
                    <label className="text-sm font-semibold">
                        Additional instructions (optional)
                    </label>
                    <div className="w-full flex flex-col">
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
                        <label className="text-xs opacity-60 ml-1 mt-1">
                            {100 - additionalInstructions.length} characters
                        </label>
                    </div>
                </div>

                {/* Generate button */}
                <button
                    type="submit"
                    className="w-full rounded-lg bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) p-3 text-lg font-bold my-2"
                >
                    {loading ? currStep : "Generate flashcards"}
                </button>
            </form>
        </div>
    );
};

export default CreateFlashcardSetPage;
