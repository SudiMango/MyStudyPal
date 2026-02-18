import apiClient from "./client";
import { QuizAttempt } from "./quiz-attempt-api";
import { QuizQuestion } from "./quiz-question-api";

/**
 *
 * DTOs
 *
 */

// Post
export interface CreateQuizRequest {
    name: string;
    timeLimitMinutes: number;
    prompt: string;
    additionalInstructions?: string;
}

// Get
export interface Quiz {
    quizId: string;
    name: string;
    timeLimitMinutes: number;
    createdAt: string;
    totalQuestions: number;
    totalPoints: number;
}

export interface QuizDetails {
    quizId: string;
    name: string;
    timeLimitMinutes: number;
    createdAt: string;
    totalQuestions: number;
    totalPoints: number;
    quizQuestions: QuizQuestion[];
    quizAttempts: QuizAttempt[];
}

// Update
export interface UpdateQuizRequest {
    name?: string;
}

/**
 *
 * API calls
 *
 */

// Generate new quiz
export const createQuiz = async (
    studySetId: string,
    payload: CreateQuizRequest,
): Promise<{ success: boolean; error?: string }> => {
    try {
        const response = await apiClient.post(
            `/quiz/create/${studySetId}`,
            payload,
        );

        return { success: true };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.errorMessage ||
            error.message ||
            "An unexpected error occurred";

        return {
            success: false,
            error: errorMessage,
        };
    }
};

// Update a quiz
export const updateQuiz = async (
    quizId: string,
    payload: UpdateQuizRequest,
): Promise<{ success: boolean; data?: Quiz; error?: string }> => {
    try {
        const response = await apiClient.patch(`/quiz/${quizId}`, payload);
        return { success: true, data: response.data };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.errorMessage ||
            error.message ||
            "An unexpected error occurred";

        return {
            success: false,
            error: errorMessage,
        };
    }
};

// Get all quizzes for a study set
export const getAllQuizzesForStudySet = async (
    studySetId: string,
): Promise<{ success: boolean; data?: Quiz[]; error?: string }> => {
    try {
        const response = await apiClient.get(`/quiz/get-all/${studySetId}`);
        return { success: true, data: response.data };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.errorMessage ||
            error.message ||
            "An unexpected error occurred";

        return {
            success: false,
            error: errorMessage,
        };
    }
};

// Get a single quiz by ID
export const getOneQuizDetails = async (
    quizId: string,
): Promise<{ success: boolean; data?: QuizDetails; error?: string }> => {
    try {
        const response = await apiClient.get(`/quiz/${quizId}`);
        return { success: true, data: response.data };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.errorMessage ||
            error.message ||
            "An unexpected error occurred";

        return {
            success: false,
            error: errorMessage,
        };
    }
};

// Delete a quiz
export const deleteQuiz = async (
    quizId: string,
): Promise<{ success: boolean; error?: string }> => {
    try {
        await apiClient.delete(`/quiz/${quizId}`);
        return { success: true };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.errorMessage ||
            error.message ||
            "An unexpected error occurred";

        return {
            success: false,
            error: errorMessage,
        };
    }
};
