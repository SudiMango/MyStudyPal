import apiClient from "./client";

/**
 *
 * DTOs
 *
 */

// Create
export interface CreateQuizRequest {
    name: string;
    timeLimitMinutes: number;
    prompt: string;
    additionalInstructions?: string;
}

interface CreateQuizResponse {
    quizId: string;
}

// Get

export type QuestionType =
    | "MULTIPLE_CHOICE"
    | "MULTIPLE_ANSWER"
    | "SHORT_ANSWER"
    | "TRUE_FALSE";

export interface Quiz {
    quizId: string;
    name: string;
    timeLimitMinutes: number;
    createdAt: string;
    totalQuestions: number;
    totalPoints: number;
}

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

export interface QuizAttempt {
    attemptId: string;
    score: number;
    maxScore: number;
    timeSpentSeconds: number | null;
    startedAt: string;
    completedAt: string | null;
}

export interface QuizDetails {
    quizId: string;
    name: string;
    timeLimitMinutes: number;
    createdAt: string;
    totalQuestions: number;
    totalPoints: number;
    questions: QuizQuestion[];
    attempts: QuizAttempt[];
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
): Promise<{ data?: CreateQuizResponse; error?: string }> => {
    try {
        const response = await apiClient.post(
            `/quiz/create/${studySetId}`,
            payload,
        );

        return { data: response.data };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Quiz generation failed";
        return { error: errorMessage };
    }
};

// Update a quiz
export const updateQuiz = async (
    quizId: string,
    payload: UpdateQuizRequest,
): Promise<{ error?: string }> => {
    try {
        await apiClient.patch(`/quiz/${quizId}`, payload);
        return {};
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to update quiz";
        return { error: errorMessage };
    }
};

// Get all quizzes for a study set
export const getAllQuizzesForStudySet = async (
    studySetId: string,
): Promise<{
    data?: Quiz[];
    error?: string;
}> => {
    try {
        const response = await apiClient.get(`/quiz/get-all/${studySetId}`);
        return { data: response.data };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch quizzes";
        return { error: errorMessage };
    }
};

// Get a single quiz by ID
export const getOneQuiz = async (
    quizId: string,
): Promise<{
    data?: Quiz;
    error?: string;
}> => {
    try {
        const response = await apiClient.get(`/quiz/${quizId}`);
        return { data: response.data };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch quiz";
        return { error: errorMessage };
    }
};

// Delete a quiz
export const deleteQuiz = async (
    quizId: string,
): Promise<{ error?: string }> => {
    try {
        await apiClient.delete(`/quiz/${quizId}`);
        return {};
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to delete quiz";
        return { error: errorMessage };
    }
};
