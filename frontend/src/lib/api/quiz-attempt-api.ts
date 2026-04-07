import {
    CreateQuizAttemptRequest,
    CreateQuizAttemptResponse,
    OneAttemptPage_QuizAttemptDetailsResponse,
} from "../dto/quiz-attempt-dto";
import { ApiResponse } from "../types/api";
import { getErrorMessage } from "../util";
import apiClient from "../client";

// Create new quiz attempt
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

// Get details on 1 quiz attempt
export const getOneAttemptDetails = async (
    attemptId: string,
): Promise<ApiResponse<OneAttemptPage_QuizAttemptDetailsResponse>> => {
    try {
        const response = await apiClient.get(`/quiz-attempt/${attemptId}`);

        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: getErrorMessage(error),
        };
    }
};
