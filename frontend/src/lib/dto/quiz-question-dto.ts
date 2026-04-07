export enum QuestionType {
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
    MULTIPLE_ANSWER = "MULTIPLE_ANSWER",
    SHORT_ANSWER = "SHORT_ANSWER",
    TRUE_FALSE = "TRUE_FALSE",
}

export interface Quiz_QuizQuestionResponse {
    questionId: string;
    questionType: QuestionType;
    questionText: string;
    options: string[];
    hint?: string;
    points: number;
    orderIndex: number;
}

/**
 * Request
 */

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
    orderIndex: number;
    prompt: string;
    additionalInstructions?: string;
}

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
    questionType: QuestionType;
    orderIndex: number;
    prompt: string;
}

/**
 * Response
 */

export interface QuizQuestionResponse {
    questionId: string;
    questionType: QuestionType;
    questionText: string;
    options: string[];
    correctAnswers: string[];
    hint?: string;
    points: number;
    orderIndex: number;
}

export interface TakeQuizResponse {
    name: string;
    questions: Quiz_QuizQuestionResponse[];
}
