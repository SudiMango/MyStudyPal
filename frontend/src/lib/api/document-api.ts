import apiClient from "./client";

/**
 *
 * DTOs
 *
 */

interface UploadDocumentResponse {
    success: boolean;
    data?: {
        documentId: string;
    };
    error?: string;
}

/**
 *
 * API calls
 *
 */

// Upload document
export const uploadDocument = async (
    file: File
): Promise<UploadDocumentResponse> => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.post<{ documentId: string }>(
            "/document/upload",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return { success: true, data: response.data };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "File upload failed";
        return { success: false, error: errorMessage };
    }
};
