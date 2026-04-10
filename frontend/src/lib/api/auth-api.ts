import apiClient from "../client";
import { LoginResponse, UserDetailsResponse } from "../dto/auth-dto";
import { ApiResponse } from "../types/api";
import { getErrorMessage } from "../util";

// Login with email
export const loginWithEmail = async (
    email: string,
    password: string,
): Promise<ApiResponse<LoginResponse>> => {
    try {
        const response = await apiClient.post<LoginResponse>("/auth/login", {
            username: email,
            password,
        });
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Signup with email
export const signupWithEmail = async (
    email: string,
    password: string,
): Promise<ApiResponse> => {
    try {
        await apiClient.post("/auth/signup", {
            username: email,
            password,
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Refresh access token
export const getLoggedInUser = async (): Promise<
    ApiResponse<UserDetailsResponse>
> => {
    try {
        const response = await apiClient.get("/auth/me");
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Verify email with code
export const verifyEmail = async (
    username: string,
    verificationCode: string,
): Promise<ApiResponse> => {
    try {
        await apiClient.post("/auth/verify-account", {
            username,
            verificationCode,
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Resend verification code
export const resendVerificationEmail = async (
    username: string,
): Promise<ApiResponse> => {
    try {
        await apiClient.post("/auth/resend-verification", { username });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Logout
export const logoutFromApp = async (): Promise<ApiResponse> => {
    try {
        await apiClient.post("/auth/logout");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Google login url
export const getGoogleLoginUrl = (): string => {
    return `http://localhost:8080/oauth2/authorization/google`;
};
