import React, { useEffect, useRef, useState } from "react";
import FlashcardDropdown from "../global/SettingsDropdown";
import {
    ChevronDown,
    ChevronUp,
    EllipsisVertical,
    SquareCheck,
    Star,
} from "lucide-react";
import { Flashcard } from "@/lib/api/flashcard-api";

interface FlashcardListProps {
    flashcards: Flashcard[];
    currIndex: number;
    onStarFlashcard: (index: number, e: any) => void;
    onReviewFlashcard: (index: number, e: any) => void;
    isReviewing: Set<string>;
    // onEdit: (index: number) => void;
    // onDelete: (index: number) => void;
}

const AllFlashcardsPanel: React.FC<FlashcardListProps> = ({
    flashcards,
    currIndex,
    onStarFlashcard,
    onReviewFlashcard,
    isReviewing,
    // onEdit,
    // onDelete,
}) => {
    const [showAllFlashcards, setShowAllFlashcards] = useState<boolean>(true);
    const [showDropdown, setShowDropdown] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setShowDropdown(null);
            }
        };

        if (showDropdown !== null) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [showDropdown]);

    const handleDropdownToggle = (e: any, index: number) => {
        e.stopPropagation();
        setShowDropdown(showDropdown !== index ? index : null);
    };

    const handleStarClick = (index: number, e: any) => {
        e.stopPropagation();
        onStarFlashcard(index, e);
    };

    const handleReviewClick = (index: number, e: any) => {
        e.stopPropagation();
        onReviewFlashcard(index, e);
    };

    return (
        <div className="bg-(--discord-gray-3) w-full rounded-xl shadow-lg p-5 mt-5 outline outline-(--discord-blurple) flex flex-col">
            <div className="flex flex-row">
                <label className="font-bold text-lg mr-auto">
                    All flashcards ({flashcards.length})
                </label>
                <button
                    onClick={() => setShowAllFlashcards(!showAllFlashcards)}
                >
                    {showAllFlashcards ? (
                        <ChevronUp className="h-7 w-7 hover:text-(--discord-blurple)" />
                    ) : (
                        <ChevronDown className="h-7 w-7 hover:text-(--discord-blurple)" />
                    )}
                </button>
            </div>
            <div
                hidden={!showAllFlashcards}
                className="w-full h-0.5 bg-(--discord-gray-2) my-5"
            />
            <div hidden={!showAllFlashcards} className="space-y-5">
                {flashcards.map((f, i) => (
                    <div
                        key={i}
                        className="bg-(--discord-gray-4) rounded-md flex flex-col p-2 space-y-0.5"
                    >
                        <div className="flex flex-row items-center mb-1 border-b border-(--discord-gray-1) pb-2">
                            <label className="opacity-60 text-sm">
                                #{i + 1}
                            </label>
                            <div className="flex flex-row items-center justify-center ml-auto space-x-2">
                                <button onClick={(e) => handleStarClick(i, e)}>
                                    <Star
                                        className={`w-5 h-5 hover:text-(--discord-blurple) ${
                                            flashcards[i].starred
                                                ? "fill-current"
                                                : ""
                                        }`}
                                    />
                                </button>
                                <button
                                    onClick={(e) => handleReviewClick(i, e)}
                                    disabled={isReviewing.has(
                                        flashcards[i].flashcardId
                                    )}
                                >
                                    <SquareCheck
                                        className={`w-5 h-5 hover:text-(--discord-blurple) ${
                                            flashcards[i].reviewed
                                                ? "fill-green-800 text-green-300"
                                                : ""
                                        }`}
                                    />
                                </button>

                                {/* More settings button */}
                                <div
                                    className="relative flex justify-center items-center"
                                    ref={
                                        showDropdown === i ? dropdownRef : null
                                    }
                                >
                                    <button
                                        onClick={(e) =>
                                            handleDropdownToggle(e, i)
                                        }
                                        className="hover:text-(--discord-blurple)"
                                    >
                                        <EllipsisVertical className="w-5 h-5 opacity-80" />
                                    </button>

                                    <FlashcardDropdown
                                        isOpen={showDropdown === i}
                                        onClose={() => setShowDropdown(null)}
                                    />
                                </div>
                            </div>
                        </div>
                        <label className="pt-1">Q: {f.question}</label>
                        <label className="opacity-80 text-sm">
                            A: {f.answer}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllFlashcardsPanel;
