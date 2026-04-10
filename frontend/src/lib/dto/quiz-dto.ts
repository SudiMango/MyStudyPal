import { QuestionType } from "./quiz-question-dto";

/**
 * Request
 */

export interface CreateQuizRequest {
    name: string;
    numQuestions: number;
    prompt: string;
    additionalInstructions?: string;
    allowedTypes: QuestionType[];
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

export interface QuizResponse {
    quizId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    totalQuestions: number;
    totalPoints: number;
    totalAttempts: number;
}
