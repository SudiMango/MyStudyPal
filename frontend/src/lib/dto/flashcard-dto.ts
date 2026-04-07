/**
 * Request
 */

export interface CreateFlashcardSetRequest {
    name: string;
    icon?: string;
    numFlashcards: number;
    prompt: string;
    additionalInstructions?: string;
}

export interface UpdateFlashcardSetRequest {
    name?: string;
    icon?: string;
}

export interface UpdateFlashcardRequest {
    question?: string;
    answer?: string;
    hint?: string;
    instructions?: string;
    mode?: "manual" | "AI";
}

/**
 * Response
 */

export interface CreateFlashcardSetResponse {
    flashcardSetId: string;
}

export interface FlashcardResponse {
    flashcardId: string;
    question: string;
    answer: string;
    hint?: string;
    isReviewed: boolean;
    isStarred: boolean;
    createdAt: string;
}

export interface FlashcardSetResponse {
    flashcardSetId: string;
    name: string;
    icon?: string;
    createdAt: string;
    updatedAt: string;
    totalCards: number;
    reviewedCards: number;
    starredCards: number;
}
