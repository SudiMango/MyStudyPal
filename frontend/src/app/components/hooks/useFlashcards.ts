import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    getAllFlashcardsInSet,
    changeReviewStatus,
    Flashcard,
    changeStarStatus,
} from "@/lib/api/flashcard-api";
import { FlashcardSet, getOneFlashcardSet } from "@/lib/api/flashcard-set-api";

export const useFlashcards = (setId: string) => {
    /**
     *
     * Variables
     *
     */

    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [flashcardSet, setFlashcardSet] = useState<FlashcardSet>();
    const [currIndex, setCurrIndex] = useState<number>(0);

    const [showHint, setShowHint] = useState<boolean>(false);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [isReviewing, setIsReviewing] = useState<Set<string>>(new Set());
    const [isStarring, setIsStarring] = useState<Set<string>>(new Set());

    const [isLoading, setIsLoading] = useState(true);

    const [slideDirection, setSlideDirection] = useState<
        "left" | "right" | null
    >(null);
    const [canTransition, setCanTransition] = useState(true);

    /**
     *
     * Fetch all flashcards and flashcard set info
     *
     */

    const fetchEverything = async () => {
        setIsLoading(true);

        const setResponse = await getOneFlashcardSet(setId);
        if (setResponse.success && setResponse.data) {
            setFlashcardSet(setResponse.data);
        } else {
            alert(setResponse.error);
        }

        const response = await getAllFlashcardsInSet(setId);
        if (response.success && response.data) {
            setFlashcards(response.data);
        } else {
            alert(response.error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (!setId) {
            setIsLoading(false);
            alert("Flashcard set ID is missing.");
            return;
        }

        fetchEverything();
    }, [setId]);

    /**
     *
     * Navigation controls
     *
     */

    const goRight = () => {
        setSlideDirection("right");
        setCanTransition(false);
        setShowAnswer(false);

        setTimeout(() => {
            if (currIndex + 1 >= flashcards.length) {
                setCurrIndex(0);
            } else {
                setCurrIndex(currIndex + 1);
            }
            setShowHint(false);
        }, 0);

        setTimeout(() => {
            setCanTransition(true);
            setSlideDirection(null);
        }, 0);
    };

    const goLeft = () => {
        setSlideDirection("left");
        setCanTransition(false);
        setShowAnswer(false);

        setTimeout(() => {
            if (currIndex - 1 < 0) {
                setCurrIndex(flashcards.length - 1);
            } else {
                setCurrIndex(currIndex - 1);
            }
            setShowHint(false);
        }, 0);

        setTimeout(() => {
            setCanTransition(true);
            setSlideDirection(null);
        }, 0);
    };

    /**
     *
     * Handle starring flashcard
     *
     */

    const handleStarFlashcard = async (index: number, e: any) => {
        e.stopPropagation();

        const flashcardToUpdate = flashcards[index];
        if (isStarring.has(flashcardToUpdate.flashcardId)) return;

        setIsStarring((prev) =>
            new Set(prev).add(flashcardToUpdate.flashcardId)
        );

        const originalFlashcards = [...flashcards];

        setFlashcards(
            flashcards.map((card, idx) =>
                idx === index ? { ...card, starred: !card.starred } : card
            )
        );

        const response = await changeStarStatus(flashcardToUpdate.flashcardId);
        if (!response.success) {
            setFlashcards(originalFlashcards);
            alert(response.error);
        }
        setIsStarring((prev) => {
            const newSet = new Set(prev);
            newSet.delete(flashcardToUpdate.flashcardId);
            return newSet;
        });
    };

    /**
     *
     * Handle reviewing flashcard
     *
     */

    const handleReviewFlashcard = async (index: number, e: any) => {
        e.stopPropagation();

        const flashcardToUpdate = flashcards[index];
        if (isReviewing.has(flashcardToUpdate.flashcardId)) return;

        setIsReviewing((prev) =>
            new Set(prev).add(flashcardToUpdate.flashcardId)
        );

        const originalFlashcards = [...flashcards];

        setFlashcards(
            flashcards.map((card, idx) =>
                idx === index ? { ...card, reviewed: !card.reviewed } : card
            )
        );

        const response = await changeReviewStatus(
            flashcardToUpdate.flashcardId
        );
        if (!response.success) {
            setFlashcards(originalFlashcards);
            alert(response.error);
        }
        setIsReviewing((prev) => {
            const newSet = new Set(prev);
            newSet.delete(flashcardToUpdate.flashcardId);
            return newSet;
        });
    };

    /**
     *
     * Misc
     *
     */

    const handleShowHint = (e: any) => {
        e.stopPropagation();
        setShowHint(!showHint);
    };

    const handleShowAnswer = () => {
        setShowAnswer(!showAnswer);
    };

    const shuffleFlashcards = () => {
        const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
        setFlashcards(shuffled);
        setCurrIndex(0);
    };

    return {
        flashcards,
        flashcardSet,
        currIndex,
        showHint,
        showAnswer,
        slideDirection,
        canTransition,
        isLoading,
        isReviewing,
        goRight,
        goLeft,
        handleStarFlashcard,
        handleReviewFlashcard,
        handleShowHint,
        handleShowAnswer,
        shuffleFlashcards,
        fetchEverything,
    };
};
