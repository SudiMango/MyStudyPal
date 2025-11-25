import apiClient from "./client";

export const makeProtectedCall = async (): Promise<{
    success: boolean;
    data?: string;
    error?: string;
}> => {
    try {
        const response = await apiClient.get<string>("/protected/test");
        return { success: true, data: response.data };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "An unknown error occurred";
        return { success: false, error: errorMessage };
    }
};
