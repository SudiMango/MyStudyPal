import {
    CreateStudySetRequest,
    CreateStudySetResponse,
    StudySetResponse,
    UpdateStudySetRequest,
} from "../dto/study-set-dto";
import { ApiResponse } from "../types/api";
import { getErrorMessage } from "../util";
import apiClient from "../client";

// Generate new study set
export const createStudySet = async (
    payload: CreateStudySetRequest,
): Promise<ApiResponse<CreateStudySetResponse>> => {
    try {
        const response = await apiClient.post(`/study-set`, payload);
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Update a study set
export const updateStudySet = async (
    studySetId: string,
    payload: UpdateStudySetRequest,
): Promise<ApiResponse> => {
    try {
        await apiClient.patch(`/study-set/${studySetId}`, payload);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Get all study sets
export const getAllStudySets = async (): Promise<
    ApiResponse<StudySetResponse[]>
> => {
    try {
        const response = await apiClient.get(`/study-set`);
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Get all study sets
export const getOneStudySet = async (
    studySetId: string,
): Promise<ApiResponse<StudySetResponse>> => {
    try {
        const response = await apiClient.get(`/study-set/${studySetId}`);
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Delete a study set
export const deleteStudySet = async (
    studySetId: string,
): Promise<ApiResponse> => {
    try {
        await apiClient.delete(`/study-set/${studySetId}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};
