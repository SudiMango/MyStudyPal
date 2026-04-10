import {
    CreateQuizQuestionRequest,
    QuizQuestionResponse,
    TakeQuizResponse,
    UpdateQuizQuestionRequest,
} from "../dto/quiz-question-dto";
import { ApiResponse } from "../types/api";
import { getErrorMessage } from "../util";
import apiClient from "../client";

export const createQuizQuestion = async (
    quizId: string,
    payload: CreateQuizQuestionRequest,
): Promise<ApiResponse<QuizQuestionResponse>> => {
    try {
        const response = await apiClient.post(
            `/quiz-question/${quizId}`,
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

export const updateQuizQuestion = async (
    questionId: string,
    payload: UpdateQuizQuestionRequest,
): Promise<ApiResponse<QuizQuestionResponse>> => {
    try {
        const response = await apiClient.patch(
            `/quiz-question/${questionId}`,
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

export const getQuizQuestionsForQuiz = async (
    quizId: string,
): Promise<ApiResponse<QuizQuestionResponse[]>> => {
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

export const getQuizQuestionsForTakingQuiz = async (
    quizId: string,
): Promise<ApiResponse<TakeQuizResponse>> => {
    try {
        const response = await apiClient.get(`/quiz-question/exam/${quizId}`);
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: getErrorMessage(error),
        };
    }
};

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
