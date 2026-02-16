import apiClient from "./client";

/**
 *
 * DTOs
 *
 */

// Create

export interface CreateStudySetRequest {
    name: string;
    icon?: string;
    description?: string;
}

export interface CreateStudySetResponse {
    studySetId: string;
}

// Get

export interface StudySet {
    createdAt: Date;
    description: string;
    icon: string;
    name: string;
    studySetId: string;
    totalDocuments: number;
    totalFlashcardSets: number;
    totalQuizzes: number;
    updatedAt: Date;
}

// Update

export interface UpdateStudySetRequest {
    name?: string;
    description?: string;
    icon?: string;
}

/**
 *
 * API calls
 *
 */

// Generate new study set
export const createStudySet = async (
    payload: CreateStudySetRequest,
): Promise<{ data?: CreateStudySetResponse; error?: string }> => {
    try {
        const response = await apiClient.post(`/study-set/create`, payload);
        return { data: response.data };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Study set generation failed";
        return { error: errorMessage };
    }
};

// Update a study set
export const updateStudySet = async (
    studySetId: string,
    payload: UpdateStudySetRequest,
): Promise<{ error?: string }> => {
    try {
        await apiClient.patch(`/study-set/${studySetId}`, payload);
        return {};
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to update study set";
        return { error: errorMessage };
    }
};

// Get all study sets
export const getAllStudySets = async (): Promise<{
    data?: StudySet[];
    error?: string;
}> => {
    try {
        const response = await apiClient.get(`/study-set/get-all`);
        return { data: response.data };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch study sets";
        return { error: errorMessage };
    }
};

// Get all study sets
export const getOneStudySet = async (
    studySetId: string,
): Promise<{
    data?: StudySet;
    error?: string;
}> => {
    try {
        const response = await apiClient.get(`/study-set/${studySetId}`);
        return { data: response.data };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch study set";
        return { error: errorMessage };
    }
};

// Delete a study set
export const deleteStudySet = async (
    studySetId: string,
): Promise<{ error?: string }> => {
    try {
        await apiClient.delete(`/study-set/${studySetId}`);
        return {};
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to delete study set";
        return { error: errorMessage };
    }
};
