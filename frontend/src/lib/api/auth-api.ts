import apiClient from "./client"; // <- Use the new client

interface LoginResponse {
    accessToken: string;
}

// Login with email
export const loginWithEmail = async (
    email: string,
    password: string
): Promise<{ success: boolean; data?: LoginResponse; error?: string }> => {
    try {
        const response = await apiClient.post<LoginResponse>("/auth/login", {
            username: email,
            password,
        });
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

// Signup with email
export const signupWithEmail = async (
    email: string,
    password: string
): Promise<{ success: boolean; error?: string }> => {
    try {
        await apiClient.post("/auth/signup", {
            username: email,
            password,
        });
        return { success: true };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.errors?.join(" ") ||
            error.message ||
            "An unknown error occurred";
        return { success: false, error: errorMessage };
    }
};

// Verify email with code
export const verifyEmail = async (
    username: string,
    verificationCode: string
): Promise<{ success: boolean; error?: string }> => {
    try {
        await apiClient.post("/auth/verify-account", {
            username,
            verificationCode,
        });
        return { success: true };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.message ||
            "An unknown error occurred";
        return { success: false, error: errorMessage };
    }
};

// Resend verification code
export const resendVerificationEmail = async (
    username: string
): Promise<{ success: boolean; error?: string }> => {
    try {
        await apiClient.post("/auth/resend-verification", { username });
        return { success: true };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.message ||
            "An unknown error occurred";
        return { success: false, error: errorMessage };
    }
};

// Logout
export const logoutFromApp = async (): Promise<{
    success: boolean;
    error?: string;
}> => {
    try {
        await apiClient.post("/auth/logout");
        return { success: true };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error ||
            error.message ||
            "An unknown error occurred";
        return { success: false, error: errorMessage };
    }
};

// Google login url
export const getGoogleLoginUrl = (): string => {
    return `http://localhost:8080/oauth2/authorization/google`;
};
