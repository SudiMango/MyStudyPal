import {
    CreateQuizRequest,
    CreateQuizResponse,
    QuizResponse,
    UpdateQuizRequest,
} from "../dto/quiz-dto";
import { ApiResponse } from "../types/api";
import { getErrorMessage } from "../util";
import apiClient from "../client";

// Generate new quiz
export const createQuiz = async (
    studySetId: string,
    payload: CreateQuizRequest,
): Promise<ApiResponse<CreateQuizResponse>> => {
    try {
        const response = await apiClient.post(`/quiz/${studySetId}`, payload);

        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: getErrorMessage(error),
        };
    }
};

// Get all quizzes for a study set
export const getQuizzesForStudySet = async (
    studySetId: string,
): Promise<ApiResponse<QuizResponse[]>> => {
    try {
        const response = await apiClient.get(`/quiz/study-set/${studySetId}`);
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: getErrorMessage(error),
        };
    }
};

// Get a single quiz by ID
export const getOneQuizDetails = async (
    quizId: string,
): Promise<ApiResponse<QuizResponse>> => {
    try {
        const response = await apiClient.get(`/quiz/${quizId}`);
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: getErrorMessage(error),
        };
    }
};

// Update a quiz
export const updateQuiz = async (
    quizId: string,
    payload: UpdateQuizRequest,
): Promise<ApiResponse<QuizResponse>> => {
    try {
        const response = await apiClient.patch(`/quiz/${quizId}`, payload);
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: getErrorMessage(error),
        };
    }
};

// Delete a quiz
export const deleteQuiz = async (quizId: string): Promise<ApiResponse> => {
    try {
        await apiClient.delete(`/quiz/${quizId}`);
        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: getErrorMessage(error),
        };
    }
};
