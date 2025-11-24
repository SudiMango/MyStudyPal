import { API_BASE_URL, apiCall } from "./client";

interface LoginResponse {
    accessToken: string;
}

// Login with email
export const loginWithEmail = async (
    email: string,
    password: string
): Promise<{ success: boolean; data?: LoginResponse; error?: string }> => {
    return apiCall<LoginResponse>("/auth/login", {
        method: "POST",
        body: { username: email, password },
    });
};

// Signup with email
export const signupWithEmail = async (
    email: string,
    password: string
): Promise<{ success: boolean; error?: string }> => {
    return apiCall("/auth/signup", {
        method: "POST",
        body: { username: email, password },
    });
};

// Verify email with code
export const verifyEmail = async (
    username: string,
    verificationCode: string
): Promise<{ success: boolean; error?: string }> => {
    return apiCall("/auth/verify-account", {
        method: "POST",
        body: { username, verificationCode },
    });
};

// Resend verification code
export const resendVerificationEmail = async (
    username: string
): Promise<{ success: boolean; error?: string }> => {
    return apiCall("/auth/resend-verification", {
        method: "POST",
        body: { username },
    });
};

// Google login url
export const getGoogleLoginUrl = (): string => {
    return `${API_BASE_URL.replace("/api", "")}/oauth2/authorization/google`;
};
