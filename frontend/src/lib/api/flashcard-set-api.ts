import apiClient from "./client";

/**
 *
 * DTOs
 *
 */

// Create

export interface CreateFlashcardSetRequest {
    name: string;
    icon: string;
    numFlashcards: number;
    prompt: string;
    additionalInstructions?: string;
}

interface CreateFlashcardSetResponse {
    flashcardSetId: string;
}

// Get

export interface FlashcardSet {
    flashcardSetId: string;
    name: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
    totalCards: number;
    reviewedCards: number;
    starredCards: number;
}

// Update

export interface UpdateFlashcardSetRequest {
    name?: string;
    icon?: string;
}

/**
 *
 * API calls
 *
 */

// Generate new flashcard set
export const createFlashcardSet = async (
    studySetId: string,
    payload: CreateFlashcardSetRequest,
): Promise<{ data?: CreateFlashcardSetResponse; error?: string }> => {
    try {
        const response = await apiClient.post(
            `/flashcard-set/create/${studySetId}`,
            payload,
        );

        return { data: response.data };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Flashcard generation failed";
        return { error: errorMessage };
    }
};

// Update a flashcard set
export const updateFlashcardSet = async (
    flashcardSetId: string,
    payload: UpdateFlashcardSetRequest,
): Promise<{ error?: string }> => {
    try {
        await apiClient.patch(`/flashcard-set/${flashcardSetId}`, payload);
        return {};
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to update flashcard set";
        return { error: errorMessage };
    }
};

// Get all flashcard sets
export const getAllFlashcardSetsForStudySet = async (
    studySetId: string,
): Promise<{
    data?: FlashcardSet[];
    error?: string;
}> => {
    try {
        const response = await apiClient.get(
            `/flashcard-set/get-all/${studySetId}`,
        );
        return { data: response.data };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch flashcard sets";
        return { error: errorMessage };
    }
};

// Get all flashcard sets
export const getOneFlashcardSet = async (
    flashcardSetId: string,
): Promise<{
    data?: FlashcardSet;
    error?: string;
}> => {
    try {
        const response = await apiClient.get(
            `/flashcard-set/${flashcardSetId}`,
        );
        return { data: response.data };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch flashcard set";
        return { error: errorMessage };
    }
};

// Delete a flashcard set
export const deleteFlashcardSet = async (
    flashcardSetId: string,
): Promise<{ error?: string }> => {
    try {
        await apiClient.delete(`/flashcard-set/${flashcardSetId}`);
        return {};
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to delete flashcard set";
        return { error: errorMessage };
    }
};
