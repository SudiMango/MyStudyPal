import {
    CreateQuizQuestionManuallyRequest,
    CreateQuizQuestionWithAIRequest,
    QuizQuestionResponse,
    TakeQuizResponse,
    UpdateQuizQuestionManuallyRequest,
    UpdateQuizQuestionWithAIRequest,
} from "../dto/quiz-question-dto";
import { ApiResponse } from "../types/api";
import { getErrorMessage } from "../util";
import apiClient from "../client";

// Generate new quiz question manually
export const createQuizQuestionManually = async (
    quizId: string,
    payload: CreateQuizQuestionManuallyRequest,
): Promise<ApiResponse<QuizQuestionResponse>> => {
    try {
        const response = await apiClient.post(
            `/quiz-question/manual/${quizId}`,
            payload,
        );

        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: getErrorMessage(error),
        };
    }
};

// Generate new quiz question with AI
export const createQuizQuestionWithAI = async (
    quizId: string,
    payload: CreateQuizQuestionWithAIRequest,
): Promise<ApiResponse<QuizQuestionResponse>> => {
    try {
        const response = await apiClient.post(
            `/quiz-question/ai/${quizId}`,
            payload,
        );

        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: getErrorMessage(error),
        };
    }
};

// Update a quiz question manually
export const updateQuizQuestionManually = async (
    questionId: string,
    payload: UpdateQuizQuestionManuallyRequest,
): Promise<ApiResponse<QuizQuestionResponse>> => {
    try {
        const response = await apiClient.patch(
            `/quiz-question/manual/${questionId}`,
            payload,
        );
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: getErrorMessage(error),
        };
    }
};

// Update a quiz question with AI
export const updateQuizQuestionWithAI = async (
    questionId: string,
    payload: UpdateQuizQuestionWithAIRequest,
): Promise<ApiResponse<QuizQuestionResponse>> => {
    try {
        const response = await apiClient.patch(
            `/quiz-question/ai/${questionId}`,
            payload,
        );
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: getErrorMessage(error),
        };
    }
};

// Get quiz questions for quiz
export const getQuizQuestionsForQuiz = async (
    quizId: string,
): Promise<ApiResponse<TakeQuizResponse>> => {
    try {
        const response = await apiClient.get(`/quiz-question/${quizId}`);
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: getErrorMessage(error),
        };
    }
};

// Delete a quiz question
export const deleteQuizQuestion = async (
    questionId: string,
): Promise<ApiResponse> => {
    try {
        await apiClient.delete(`/quiz-question/${questionId}`);
        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: getErrorMessage(error),
        };
    }
};
