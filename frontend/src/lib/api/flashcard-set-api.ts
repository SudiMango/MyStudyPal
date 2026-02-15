import apiClient from "./client";

/**
 *
 * DTOs
 *
 */

// Create

export interface GenerateFlashcardsPayload {
    documentId: string;
    name: string;
    icon: string;
    numFlashcards: number;
    useFullDocument: boolean;
    prompt?: string;
    additionalInstructions?: string;
}

interface GenerateFlashcardsResponse {
    success: boolean;
    data?: {
        flashcardSetId: string;
    };
    error?: string;
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

export interface UpdateFlashcardSetPayload {
    name?: string;
    icon?: string;
}

/**
 *
 * API calls
 *
 */

// Generate new flashcard set
export const generateFlashcardSet = async (
    payload: GenerateFlashcardsPayload
): Promise<GenerateFlashcardsResponse> => {
    try {
        const response = await apiClient.post<{
            flashcardSetId: string;
            flashcards: any[];
        }>("/flashcard-set/create", payload);

        return { success: true, data: response.data };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Flashcard generation failed";
        return { success: false, error: errorMessage };
    }
};

// Get all flashcard sets
export const getAllFlashcardSets = async (): Promise<{
    success: boolean;
    data?: FlashcardSet[];
    error?: string;
}> => {
    try {
        const response = await apiClient.get<FlashcardSet[]>(
            "/flashcard-set/get-all"
        );
        return { success: true, data: response.data };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch flashcard sets";
        return { success: false, error: errorMessage };
    }
};

// Get all flashcard sets
export const getOneFlashcardSet = async (
    flashcardSetId: string
): Promise<{
    success: boolean;
    data?: FlashcardSet;
    error?: string;
}> => {
    try {
        const response = await apiClient.get<FlashcardSet>(
            `/flashcard-set/${flashcardSetId}`
        );
        return { success: true, data: response.data };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch flashcard set";
        return { success: false, error: errorMessage };
    }
};

// Delete a flashcard set
export const deleteFlashcardSet = async (
    flashcardSetId: string
): Promise<{ success: boolean; error?: string }> => {
    try {
        await apiClient.delete(`/flashcard-set/${flashcardSetId}`);
        return { success: true };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to delete flashcard set";
        return { success: false, error: errorMessage };
    }
};

// Update a flashcard set
export const updateFlashcardSet = async (
    flashcardSetId: string,
    payload: UpdateFlashcardSetPayload
): Promise<{ success: boolean; error?: string }> => {
    try {
        await apiClient.patch(`/flashcard-set/${flashcardSetId}`, payload);
        return { success: true };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to update flashcard set";
        return { success: false, error: errorMessage };
    }
};
