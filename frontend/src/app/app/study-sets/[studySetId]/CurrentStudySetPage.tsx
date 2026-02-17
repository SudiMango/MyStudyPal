"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOneStudySet, StudySet } from "@/lib/api/study-set-api";
import {
    Loader,
    Layers,
    Brain,
    ChartNoAxesCombined,
    FileText,
    Calendar,
} from "lucide-react";
import FlashcardsTab from "@/app/components/study-set-page/FlashcardsTab";

const CurrentStudySetPage = () => {
    const { studySetId } = useParams();
    const router = useRouter();

    const [studySet, setStudySet] = useState<StudySet | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<
        "flashcards" | "quizzes" | "stats" | "documents"
    >("flashcards");

    useEffect(() => {
        const fetchDetails = async () => {
            if (!studySetId) return;
            const response = await getOneStudySet(studySetId as string);
            if (response.data) {
                setStudySet(response.data);
                console.log(response.data);
            }
            setIsLoading(false);
        };
        fetchDetails();
    }, [studySetId]);

    // Handle URL hash navigation
    useEffect(() => {
        const hash = window.location.hash.replace("#", "");
        if (
            hash === "flashcards" ||
            hash === "quizzes" ||
            hash === "documents" ||
            hash === "stats"
        ) {
            setActiveTab(hash);
        }
    }, []);

    const formatDate = (dateString: Date): string => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-20">
                <Loader className="w-10 h-10 animate-spin text-gray-400" />
                <p className="mt-4 text-gray-400">Loading contents...</p>
            </div>
        );
    }

    if (!studySet) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-20">
                <p className="text-gray-400 text-lg">Study set not found</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen w-full">
            {/* Header Section */}
            <div className="w-full bg-gradient-to-br from-(--discord-gray-1) to-(--discord-gray-2) border-b border-(--discord-gray-3) py-8 px-5">
                <div className="max-w-150 mx-auto">
                    <div className="flex flex-row items-center space-x-4">
                        <div className="text-6xl">{studySet.icon}</div>
                        <div className="flex flex-col flex-1">
                            <h1 className="text-3xl font-bold">
                                {studySet.name}
                            </h1>
                            <p className="text-gray-400 mt-1">
                                {studySet.description}
                            </p>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-row flex-wrap justify-center gap-3 mt-6">
                        <div className="bg-(--discord-gray-3) py-2 px-4 rounded-lg flex flex-row items-center space-x-2 whitespace-nowrap">
                            <Layers className="w-4 h-4 text-(--discord-blurple)" />
                            <label className="text-sm">
                                {studySet.totalFlashcardSets} flashcard sets
                            </label>
                        </div>
                        <div className="bg-(--discord-gray-3) py-2 px-4 rounded-lg flex flex-row items-center space-x-2 whitespace-nowrap">
                            <Brain className="w-4 h-4 text-(--discord-blurple)" />
                            <label className="text-sm">
                                {studySet.totalQuizzes} quizzes
                            </label>
                        </div>
                        <div className="bg-(--discord-gray-3) py-2 px-4 rounded-lg flex flex-row items-center space-x-2 whitespace-nowrap">
                            <FileText className="w-4 h-4 text-(--discord-blurple)" />
                            <label className="text-sm">
                                {studySet.totalDocuments} documents
                            </label>
                        </div>
                        <div className="bg-(--discord-gray-3) py-2 px-4 rounded-lg flex flex-row items-center space-x-2 whitespace-nowrap">
                            <Calendar className="w-4 h-4 text-(--discord-blurple)" />
                            <label className="text-sm">
                                Created {formatDate(studySet.createdAt)}
                            </label>
                        </div>
                        <div className="bg-(--discord-gray-3) py-2 px-4 rounded-lg flex flex-row items-center space-x-2 whitespace-nowrap">
                            <Calendar className="w-4 h-4 text-(--discord-blurple)" />
                            <label className="text-sm">
                                Updated {formatDate(studySet.updatedAt)}
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="w-full bg-(--discord-gray-2) border-b border-(--discord-gray-3) px-5 overflow-x-auto">
                <div className="max-w-150 mx-auto flex flex-row justify-center space-x-1 min-w-max">
                    <button
                        onClick={() => {
                            setActiveTab("flashcards");
                            window.history.pushState(null, "", `#flashcards`);
                        }}
                        className={`flex flex-row items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                            activeTab === "flashcards"
                                ? "border-(--discord-blurple) text-(--discord-blurple)"
                                : "border-transparent text-gray-400 hover:text-white"
                        }`}
                    >
                        <Layers className="w-5 h-5" />
                        <span className="font-medium">Flashcards</span>
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("quizzes");
                            window.history.pushState(null, "", `#quizzes`);
                        }}
                        className={`flex flex-row items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                            activeTab === "quizzes"
                                ? "border-(--discord-blurple) text-(--discord-blurple)"
                                : "border-transparent text-gray-400 hover:text-white"
                        }`}
                    >
                        <Brain className="w-5 h-5" />
                        <span className="font-medium">Quizzes</span>
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("documents");
                            window.history.pushState(null, "", `#documents`);
                        }}
                        className={`flex flex-row items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                            activeTab === "documents"
                                ? "border-(--discord-blurple) text-(--discord-blurple)"
                                : "border-transparent text-gray-400 hover:text-white"
                        }`}
                    >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">Documents</span>
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("stats");
                            window.history.pushState(null, "", `#stats`);
                        }}
                        className={`flex flex-row items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                            activeTab === "stats"
                                ? "border-(--discord-blurple) text-(--discord-blurple)"
                                : "border-transparent text-gray-400 hover:text-white"
                        }`}
                    >
                        <ChartNoAxesCombined className="w-5 h-5" />
                        <span className="font-medium">Stats</span>
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full max-w-150 p-5">
                {activeTab === "flashcards" && (
                    <FlashcardsTab studySetId={studySetId as string} />
                )}

                {activeTab === "quizzes" && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Brain className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-400 text-lg">No quizzes yet</p>
                        <button className="mt-4 bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) px-6 py-2 rounded-lg font-medium">
                            Create quiz
                        </button>
                    </div>
                )}

                {activeTab === "stats" && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <ChartNoAxesCombined className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-400 text-lg">
                            No stats available yet
                        </p>
                    </div>
                )}

                {activeTab === "documents" && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <FileText className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-400 text-lg">
                            No documents yet
                        </p>
                        <button className="mt-4 bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) px-6 py-2 rounded-lg font-medium">
                            Upload document
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrentStudySetPage;
