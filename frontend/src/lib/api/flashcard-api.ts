import {
    CreateFlashcardRequest,
    FlashcardResponse,
    UpdateFlashcardRequest,
} from "../dto/flashcard-dto";
import { ApiResponse } from "../types/api";
import { getErrorMessage } from "../util";
import apiClient from "../client";

// Create a flashcard for a set
export const createFlashcard = async (
    flashcardSetId: string,
    data: CreateFlashcardRequest,
): Promise<ApiResponse<FlashcardResponse>> => {
    try {
        const response = await apiClient.post<FlashcardResponse>(
            `/flashcard/${flashcardSetId}`,
            data,
        );
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Get all flashcards of one set
export const getAllFlashcardsInSet = async (
    setId: string,
): Promise<ApiResponse<FlashcardResponse[]>> => {
    try {
        const response = await apiClient.get<FlashcardResponse[]>(
            `/flashcard/${setId}`,
        );
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Mark flashcard as reviewed/unreviewed
export const changeReviewStatus = async (
    flashcardId: string,
): Promise<ApiResponse> => {
    try {
        await apiClient.patch(`/flashcard/review/${flashcardId}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Mark flashcard as starred/unstarred
export const changeStarStatus = async (
    flashcardId: string,
): Promise<ApiResponse> => {
    try {
        await apiClient.patch(`/flashcard/star/${flashcardId}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Edit flashcard
export const updateFlashcard = async (
    flashcardId: string,
    data: UpdateFlashcardRequest,
): Promise<ApiResponse<FlashcardResponse>> => {
    try {
        const response = await apiClient.patch(
            `/flashcard/${flashcardId}`,
            data,
        );
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Delete flashcard
export const deleteFlashcard = async (
    flashcardId: string,
): Promise<ApiResponse> => {
    try {
        await apiClient.delete(`/flashcard/${flashcardId}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};
