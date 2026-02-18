import apiClient from "./client";
import { QuizQuestion } from "./quiz-question-api";

/**
 *
 * DTOs
 *
 */

export interface AnswerSubmission {
    questionId: string;
    userAnswer: string[];
}

// Post
export interface CreateQuizAttemptRequest {
    timeSpentSeconds: number;
    answers: AnswerSubmission[];
}

// Get
export interface QuizAttempt {
    attemptId: string;
    score: number;
    maxScore: number;
    timeSpentSeconds: number;
    startedAt: string;
    completedAt: string;
}

export interface QuizAttemptDetails {
    attemptId: string;
    score: number;
    maxScore: number;
    timeSpentSeconds: number;
    startedAt: string;
    completedAt: string;
    questions: QuizQuestion[];
    answers: AnswerSubmission[];
}

/**
 *
 * API calls
 *
 */

/**
 * POST
 */

// Create new quiz attempt
export const createQuizAttempt = async (
    quizId: string,
    payload: CreateQuizAttemptRequest,
): Promise<{ success: boolean; error?: string }> => {
    try {
        const response = await apiClient.post(
            `/quiz-attempt/submit/${quizId}`,
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

/**
 * GET
 */

// Get all quiz attempts for one quiz
export const getAllAttemptsForQuiz = async (
    quizId: string,
): Promise<{ success: boolean; data?: QuizAttempt; error?: string }> => {
    try {
        const response = await apiClient.get(`/quiz-attempt/get-all/${quizId}`);

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

// Get all quiz attempts for one quiz
export const getOneQuizAttemptDetails = async (
    quizId: string,
): Promise<{ success: boolean; data?: QuizAttemptDetails; error?: string }> => {
    try {
        const response = await apiClient.get(`/quiz-attempt/${quizId}`);

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
