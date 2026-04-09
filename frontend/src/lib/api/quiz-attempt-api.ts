import {
    CreateQuizAttemptRequest,
    CreateQuizAttemptResponse,
    QuizAttemptResponse,
    QuizAttemptAnswerResponse,
} from "../dto/quiz-attempt-dto";
import { ApiResponse } from "../types/api";
import { getErrorMessage } from "../util";
import apiClient from "../client";

export const submitAttempt = async (
    quizId: string,
    payload: CreateQuizAttemptRequest,
): Promise<ApiResponse<CreateQuizAttemptResponse>> => {
    try {
        const response = await apiClient.post(
            `/quiz-attempt/${quizId}`,
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

export const getAllAttemptsForQuiz = async (
    quizId: string,
): Promise<ApiResponse<QuizAttemptResponse[]>> => {
    try {
        const response = await apiClient.get(`/quiz-attempt/quiz/${quizId}`);
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: getErrorMessage(error),
        };
    }
};

export const getOneAttemptDetails = async (
    attemptId: string,
): Promise<ApiResponse<QuizAttemptResponse>> => {
    try {
        const response = await apiClient.get(
            `/quiz-attempt/attempt/${attemptId}`,
        );
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: getErrorMessage(error),
        };
    }
};

export const getAttemptAnswers = async (
    attemptId: string,
): Promise<ApiResponse<QuizAttemptAnswerResponse[]>> => {
    try {
        const response = await apiClient.get(
            `/quiz-attempt/answers/${attemptId}`,
        );
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: getErrorMessage(error),
        };
    }
};
