/**
 * Request
 */

export interface CreateFlashcardRequest {
    question: string;
    answer: string;
    hint?: string;
    orderIndex: number;
}

export interface UpdateFlashcardRequest {
    question?: string;
    answer?: string;
    hint?: string;
    orderIndex?: number;
}

/**
 * Response
 */

export interface FlashcardResponse {
    flashcardId: string;
    question: string;
    answer: string;
    hint?: string;
    isReviewed: boolean;
    isStarred: boolean;
    createdAt: string;
    orderIndex: number;
}
