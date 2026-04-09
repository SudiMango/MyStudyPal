import {
    CreateFlashcardSetRequest,
    CreateFlashcardSetResponse,
    FlashcardSetResponse,
    UpdateFlashcardSetRequest,
} from "../dto/flashcard-set-dto";
import { ApiResponse } from "../types/api";
import { getErrorMessage } from "../util";
import apiClient from "../client";

// Generate new flashcard set
export const createFlashcardSet = async (
    studySetId: string,
    payload: CreateFlashcardSetRequest,
): Promise<ApiResponse<CreateFlashcardSetResponse>> => {
    try {
        const response = await apiClient.post(
            `/flashcard-set/${studySetId}`,
            payload,
        );

        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Update a flashcard set
export const updateFlashcardSet = async (
    flashcardSetId: string,
    payload: UpdateFlashcardSetRequest,
): Promise<ApiResponse<FlashcardSetResponse>> => {
    try {
        const response = await apiClient.patch(
            `/flashcard-set/${flashcardSetId}`,
            payload,
        );
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Get all flashcard sets
export const getAllFlashcardSetsForStudySet = async (
    studySetId: string,
): Promise<ApiResponse<FlashcardSetResponse[]>> => {
    try {
        const response = await apiClient.get(
            `/flashcard-set/study-set/${studySetId}`,
        );
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Get all flashcard sets
export const getOneFlashcardSet = async (
    flashcardSetId: string,
): Promise<ApiResponse<FlashcardSetResponse>> => {
    try {
        const response = await apiClient.get(
            `/flashcard-set/${flashcardSetId}`,
        );
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Delete a flashcard set
export const deleteFlashcardSet = async (
    flashcardSetId: string,
): Promise<ApiResponse> => {
    try {
        await apiClient.delete(`/flashcard-set/${flashcardSetId}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};
