import apiClient from "./client";

/**
 *
 * DTOs
 *
 */

export type QuestionType =
    | "MULTIPLE_CHOICE"
    | "MULTIPLE_ANSWER"
    | "SHORT_ANSWER"
    | "TRUE_FALSE";

// Post
export interface CreateQuizQuestionManuallyRequest {
    questionType: QuestionType;
    questionText: string;
    options: string[];
    correctAnswers: string[];
    hint?: string;
    points: number;
    orderIndex: number;
}

export interface CreateQuizQuestionWithAIRequest {
    questionType: QuestionType;
    prompt: string;
    additionalInstructions?: string;
    orderIndex: number;
}

// Get
export interface QuizQuestion {
    questionId: string;
    questionType: QuestionType;
    questionText: string;
    options: string[];
    correctAnswers: string[];
    hint: string;
    points: number;
    orderIndex: number;
}

// Update
export interface UpdateQuizQuestionManuallyRequest {
    questionType?: QuestionType;
    questionText?: string;
    options?: string[];
    correctAnswers?: string[];
    hint?: string;
    points?: number;
    orderIndex?: number;
}

export interface UpdateQuizQuestionWithAIRequest {
    questionType?: QuestionType;
    prompt: string;
    orderIndex?: number;
}

/**
 *
 * API calls
 *
 */

/**
 * POST
 */

// Generate new quiz question manually
export const createQuizQuestionManually = async (
    studySetId: string,
    payload: CreateQuizQuestionManuallyRequest,
): Promise<{ success: boolean; data?: QuizQuestion; error?: string }> => {
    try {
        const response = await apiClient.post(
            `/quiz-question/create/manual/${studySetId}`,
            payload,
        );

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

// Generate new quiz question with AI
export const createQuizQuestionWithAI = async (
    studySetId: string,
    payload: CreateQuizQuestionWithAIRequest,
): Promise<{ success: boolean; data?: QuizQuestion; error?: string }> => {
    try {
        const response = await apiClient.post(
            `/quiz-question/create/ai/${studySetId}`,
            payload,
        );

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

/**
 * PATCH
 */

// Update a quiz question manually
export const updateQuizQuestionManually = async (
    questionId: string,
    payload: UpdateQuizQuestionManuallyRequest,
): Promise<{ success: boolean; data?: QuizQuestion; error?: string }> => {
    try {
        const response = await apiClient.patch(
            `/quiz-question/manual/${questionId}`,
            payload,
        );
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

// Update a quiz question with AI
export const updateQuizQuestionWithAI = async (
    questionId: string,
    payload: UpdateQuizQuestionWithAIRequest,
): Promise<{ success: boolean; data?: QuizQuestion; error?: string }> => {
    try {
        const response = await apiClient.patch(
            `/quiz-question/ai/${questionId}`,
            payload,
        );
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

/**
 * DELETE
 */

// Delete a quiz question
export const deleteQuizQuestion = async (
    questionId: string,
): Promise<{ success: boolean; error?: string }> => {
    try {
        await apiClient.delete(`/quiz-question/${questionId}`);
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
