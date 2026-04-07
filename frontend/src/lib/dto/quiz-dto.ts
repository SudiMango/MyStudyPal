import { ListAttemptPage_QuizAttemptDetailsResponse } from "./quiz-attempt-dto";
import { QuizQuestionResponse } from "./quiz-question-dto";

/**
 * Request
 */

export interface CreateQuizRequest {
    name: string;
    timeLimitMinutes: number;
    prompt: string;
    additionalInstructions?: string;
}

export interface UpdateQuizRequest {
    name?: string;
}

/**
 * Response
 */

export interface CreateQuizResponse {
    quizId: string;
}

export interface QuizListPage_QuizDetailsResponse {
    quizId: string;
    name: string;
    timeLimitMinutes?: number;
    createdAt: string;
    updatedAt: string;
    totalQuestions: number;
    totalPoints: number;
    totalAttempts: number;
}

export interface OneQuizPage_QuizDetailsResponse {
    quizId: string;
    name: string;
    timeLimitMinutes?: number;
    createdAt: string;
    updatedAt: string;
    totalQuestions: number;
    totalPoints: number;
    totalAttempts: number;
    questions: QuizQuestionResponse[];
    attempts: ListAttemptPage_QuizAttemptDetailsResponse[];
}
