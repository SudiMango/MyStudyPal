import apiClient from "./client";

/**
 *
 * DTOs
 *
 */

export interface Document {
    documentId: string;
    title: string;
    createdAt: string;
    numChunks: number;
}

/**
 *
 * API calls
 *
 */

// Upload multiple documents
export const uploadDocuments = async (
    studySetId: string,
    files: File[],
): Promise<{ error?: string }> => {
    try {
        const formData = new FormData();

        files.forEach((file) => {
            formData.append("files", file);
        });

        await apiClient.post(`/document/upload/${studySetId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return {};
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Files upload failed";
        return { error: errorMessage };
    }
};

// Get all documents for a single study set
export const getAllDocumentsForStudySet = async (
    studySetId: string,
): Promise<{ data?: Document[]; error?: string }> => {
    try {
        const response = await apiClient.get<Document[]>(
            `/document/get-all/${studySetId}`,
        );
        return { data: response.data };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch documents";
        return { error: errorMessage };
    }
};

// Delete a single document
export const deleteDocument = async (
    documentId: string,
): Promise<{ error?: string }> => {
    try {
        await apiClient.delete(`/document/${documentId}`);
        return {};
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to delete document";
        return { error: errorMessage };
    }
};
