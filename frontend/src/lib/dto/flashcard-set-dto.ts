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

/**
 * Response
 */

export interface CreateFlashcardSetResponse {
    flashcardSetId: string;
}

export interface FlashcardSetResponse {
    flashcardSetId: string;
    name: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
    totalCards: number;
    reviewedCards: number;
    starredCards: number;
}
