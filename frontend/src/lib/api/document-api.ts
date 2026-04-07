import { ApiResponse } from "../types/api";
import { getErrorMessage } from "../util";
import apiClient from "../client";

// Upload multiple documents
export const uploadDocuments = async (
    studySetId: string,
    files: File[],
): Promise<ApiResponse> => {
    try {
        const formData = new FormData();

        files.forEach((file) => {
            formData.append("files", file);
        });

        await apiClient.post(`/document/${studySetId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return { success: true };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Get all documents for a single study set
export const getAllDocumentsForStudySet = async (
    studySetId: string,
): Promise<ApiResponse<Document[]>> => {
    try {
        const response = await apiClient.get<Document[]>(
            `/document/${studySetId}`,
        );
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Delete a single document
export const deleteDocument = async (
    documentId: string,
): Promise<ApiResponse> => {
    try {
        await apiClient.delete(`/document/${documentId}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};
