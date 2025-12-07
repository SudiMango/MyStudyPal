import apiClient from "./client";

/**
 *
 * DTOs
 *
 */

export interface Flashcard {
    flashcardId: string;
    question: string;
    answer: string;
    hint: string;
    starred: boolean;
    reviewed: boolean;
}

export interface UpdateFlashcardDTO {
    question?: string;
    answer?: string;
    hint?: string;
}

/**
 *
 * API calls
 *
 */

// Get all flashcards of one set
export const getAllFlashcardsInSet = async (
    setId: string
): Promise<{
    success: boolean;
    data?: Flashcard[];
    error?: string;
}> => {
    try {
        const response = await apiClient.get<Flashcard[]>(
            `/flashcard/${setId}`
        );
        return { success: true, data: response.data };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch flashcards";
        return { success: false, error: errorMessage };
    }
};

// Mark flashcard as reviewed/unreviewed
export const changeReviewStatus = async (
    flashcardId: string
): Promise<{
    success: boolean;
    error?: string;
}> => {
    try {
        await apiClient.patch(`/flashcard/review/${flashcardId}`);
        return { success: true };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to update flashcard";
        return { success: false, error: errorMessage };
    }
};

// Mark flashcard as starred/unstarred
export const changeStarStatus = async (
    flashcardId: string
): Promise<{
    success: boolean;
    error?: string;
}> => {
    try {
        apiClient.patch(`/flashcard/star/${flashcardId}`);
        return { success: true };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to update flashcard";
        return { success: false, error: errorMessage };
    }
};

// Create one flashcard manually

// Create one flashcard with prompt and AI

// Regenerate flashcard with optional additional instructions

// Edit flashcard
export const updateFlashcard = async (
    flashcardId: string,
    data: UpdateFlashcardDTO
): Promise<{
    success: boolean;
    error?: string;
}> => {
    try {
        apiClient.patch(`/flashcard/${flashcardId}`, data);
        return { success: true };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to update flashcard";
        return { success: false, error: errorMessage };
    }
};

// Delete flashcard
export const deleteFlashcard = async (
    flashcardId: string
): Promise<{
    success: boolean;
    error?: string;
}> => {
    try {
        apiClient.delete(`/flashcard/${flashcardId}`);
        return { success: true };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to delete flashcard";
        return { success: false, error: errorMessage };
    }
};
