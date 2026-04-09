import { QuizQuestionResponse } from "./quiz-question-dto";

export interface AnswerSubmission {
    questionId: string;
    userAnswer: string[];
}

export interface QuizAttemptAnswerResponse {
    answerId: string;
    userAnswer: string[];
    isCorrect: boolean;
    pointsEarned: number;
    question: QuizQuestionResponse;
}

/**
 * Request
 */

export interface CreateQuizAttemptRequest {
    timeSpentSeconds: number;
    answers: AnswerSubmission[];
}

/**
 * Response
 */

export interface CreateQuizAttemptResponse {
    attemptId: string;
}

export interface QuizAttemptResponse {
    attemptId: string;
    score: number;
    maxScore: number;
    startedAt: string;
    completedAt: string;
}
