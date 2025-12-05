"use client";

import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "@/app/components/create-flashcard-set-page/SearchBar";
import {
    BookOpenText,
    Brain,
    ChartNoAxesCombined,
    EllipsisVertical,
    Loader,
    Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FlashcardSet, getAllFlashcardSets } from "@/lib/api/flashcard-api";

const FlashcardSetsPage = () => {
    const router = useRouter();

    const [query, setQuery] = useState("");
    const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all flashcard sets for user
    useEffect(() => {
        const fetchFlashcardSets = async () => {
            setIsLoading(true);
            const response = await getAllFlashcardSets();
            if (response.success && response.data) {
                console.log(response.data);
                setFlashcardSets(response.data);
            } else {
                alert(response.error);
            }
            setIsLoading(false);
        };

        fetchFlashcardSets();
    }, []);

    // Format date to show on UI
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // Filtered sets for search
    const filteredSets = useMemo(() => {
        if (!query.trim()) return flashcardSets;

        return flashcardSets.filter((set) =>
            set.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, flashcardSets]);

    return (
        <div className="flex flex-col items-center min-h-screen w-full p-5">
            <div className="flex flex-col justify-center items-center w-full h-full max-w-[600px]">
                {/* Title */}
                <h1 className="text-3xl font-bold mb-5">My Flashcard Sets</h1>

                {/* Search bar */}
                <div className="flex flex-row w-full mb-5 space-x-3">
                    <SearchBar query={query} onQueryChange={setQuery} />
                    <button
                        onClick={() =>
                            router.push("/app/flashcard-sets/create")
                        }
                        className="flex flex-row justify-center items-center bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) cursor-pointer rounded-xl w-40"
                    >
                        <Plus className="mr-1" />
                        New set
                    </button>
                </div>

                {/* All flashcard sets */}
                <div className="space-y-5 w-full">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center w-full py-20">
                            <Loader className="w-10 h-10 animate-spin text-gray-400" />
                            <p className="mt-4 text-gray-400">
                                Loading flashcard sets...
                            </p>
                        </div>
                    ) : filteredSets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center w-full py-20">
                            <p className="text-gray-400 text-lg">
                                Nothing to show here...
                            </p>
                        </div>
                    ) : (
                        <>
                            {filteredSets.map((set, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col items-start justify-center w-full shadow-xl rounded-xl bg-(--discord-gray-4) p-4 transform transition-transform duration-200 hover:scale-105"
                                >
                                    {/* Title area */}
                                    <div className="flex flex-row items-center justify-center space-x-3 w-full">
                                        <label className="text-4xl">
                                            {set.icon}
                                        </label>
                                        <div className="flex flex-col">
                                            <label className="text-md">
                                                {set.name}
                                            </label>
                                            <label className="text-sm opacity-70">
                                                Updated{" "}
                                                {formatDate(set.updatedAt)}
                                            </label>
                                        </div>
                                        <button className="ml-auto hover:text-(--discord-blurple)">
                                            <EllipsisVertical className="w-5 h-5 opacity-80" />
                                        </button>
                                    </div>

                                    {/* Stats area */}
                                    <div className="mt-5 flex flex-row space-x-3">
                                        <div className="bg-(--discord-gray-2) py-0.5 px-1 rounded-lg">
                                            <label className="text-sm">
                                                {set.totalCards} cards
                                            </label>
                                        </div>
                                        <div className="bg-(--discord-gray-2) py-0.5 px-1 rounded-lg">
                                            <label className="text-sm">
                                                0 reviewed
                                            </label>
                                        </div>
                                        <div className="bg-(--discord-gray-2) py-0.5 px-1 rounded-lg">
                                            <label className="text-sm">
                                                0 starred
                                            </label>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-0.5 w-full bg-(--discord-gray-1) my-5 rounded-2xl"></div>

                                    {/* Action buttons */}
                                    <div className="flex flex-row space-x-3 w-full">
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `/app/flashcard-sets/${set.flashcardSetId}`
                                                )
                                            }
                                            className="w-1/3 bg-(--discord-gray-1) flex flex-row justify-center items-center space-x-3 p-3 rounded-lg outline outline-(--discord-blurple) hover:bg-(--discord-gray-2)"
                                        >
                                            <BookOpenText />
                                            <label>Review</label>
                                        </button>
                                        <button className="w-1/3 bg-(--discord-gray-1) flex flex-row justify-center items-center space-x-3 p-3 rounded-lg outline outline-(--discord-blurple) hover:bg-(--discord-gray-2)">
                                            <Brain />
                                            <label>Quiz</label>
                                        </button>
                                        <button className="w-1/3 bg-(--discord-gray-1) flex flex-row justify-center items-center space-x-3 p-3 rounded-lg outline outline-(--discord-blurple) hover:bg-(--discord-gray-2)">
                                            <ChartNoAxesCombined />
                                            <label>Stats</label>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    <button
                        onClick={() =>
                            router.push("/app/flashcard-sets/create")
                        }
                        className="flex flex-row w-full items-center justify-center space-x-3 outline-dashed rounded-lg p-3 outline-2 outline-(--discord-blurple-hover) bg-(--discord-gray-1) hover:bg-(--discord-gray-2)"
                    >
                        <Plus className="h-8 w-8" />
                        <label className="text-lg">Create new set</label>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FlashcardSetsPage;
