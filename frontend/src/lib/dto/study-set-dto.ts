/**
 * Request
 */

export interface CreateStudySetRequest {
    name: string;
    icon?: string;
    description?: string;
}

export interface UpdateStudySetRequest {
    name?: string;
    icon?: string;
    description?: string;
}

/**
 * Response
 */

export interface CreateStudySetResponse {
    studySetId: string;
}

export interface StudySetResponse {
    studySetId: string;
    name: string;
    description?: string;
    icon?: string;
    createdAt: string;
    updatedAt: string;

    totalFlashcardSets: number;
    totalDocuments: number;
    totalQuizzes: number;
}
